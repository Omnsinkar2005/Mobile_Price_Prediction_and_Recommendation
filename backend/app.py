from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Get the base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)

# Try multiple possible paths for the model files (check current directory first)
MODEL_PATHS = [
    os.path.join(BASE_DIR, "mobile_price_model_fixed.pkl"),
    os.path.join(BASE_DIR, "mobile_price_model (1).pkl"),
    os.path.join(PARENT_DIR, "Recommendation", "Recommendation", "mobile_price_model (1).pkl"),
    os.path.join(BASE_DIR, "..", "Recommendation", "Recommendation", "mobile_price_model (1).pkl"),
    "mobile_price_model_fixed.pkl",
    "mobile_price_model (1).pkl"
]

RULES_PATHS = [
    os.path.join(BASE_DIR, "fpgrowth_rules.pkl"),
    os.path.join(PARENT_DIR, "Recommendation", "Recommendation", "fpgrowth_rules.pkl"),
    os.path.join(BASE_DIR, "..", "Recommendation", "Recommendation", "fpgrowth_rules.pkl"),
    "fpgrowth_rules.pkl"
]

DATA_PATHS = [
    os.path.join(BASE_DIR, "cleaned_data1 (1).csv"),
    os.path.join(PARENT_DIR, "Recommendation", "Recommendation", "cleaned_data1 (1).csv"),
    os.path.join(BASE_DIR, "..", "Recommendation", "Recommendation", "cleaned_data1 (1).csv"),
    "cleaned_data1 (1).csv"
]

# Load the price prediction model
price_model = None
import warnings
warnings.filterwarnings('ignore', category=UserWarning)

for path in MODEL_PATHS:
    try:
        if os.path.exists(path):
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                with open(path, "rb") as file:
                    price_model = pickle.load(file)
            print(f"✓ Price prediction model loaded from: {path}")
            break
    except Exception as e:
        print(f"   Error loading from {path}: {e}")
        continue

if price_model is None:
    print(f"✗ Error: Could not load price model from any path")
    print(f"   Tried: {MODEL_PATHS}")

# Load FP-Growth rules for recommendations
fp_rules = None
for path in RULES_PATHS:
    try:
        if os.path.exists(path):
            with open(path, "rb") as file:
                fp_rules = pickle.load(file)
            print(f"✓ FP-Growth rules loaded from: {path}")
            break
    except Exception as e:
        continue

if fp_rules is None:
    print(f"✗ Error: Could not load FP-Growth rules from any path")

# Load dataset for recommendations
dataset = None
for path in DATA_PATHS:
    try:
        if os.path.exists(path):
            dataset = pd.read_csv(path)
            print(f"✓ Dataset loaded successfully ({len(dataset)} records) from: {path}")
            break
    except Exception as e:
        continue

if dataset is None:
    print(f"✗ Error: Could not load dataset from any path")


@app.route('/api/predict', methods=['POST'])
def predict_price():
    """
    Predict mobile price based on specifications
    Expected input format:
    {
        "brand": "Samsung",
        "releaseYear": 2023,
        "screenSize": 6.5,
        "operatingSystem": "Android",
        "internalStorage": 128,
        "battery": 5000,
        "ram": 8,
        "processor": "octa-core"
    }
    """
    try:
        data = request.json
        
        if price_model is None:
            return jsonify({"error": "Model not loaded"}), 500
        
        # Prepare input data matching the model's expected format
        input_df = pd.DataFrame([{
            "Brand": data.get("brand"),
            "Release_year": float(data.get("releaseYear")),
            "Screen-size": float(data.get("screenSize")),
            "operating_system": data.get("operatingSystem"),
            "Internal_storage(GB)": float(data.get("internalStorage")),
            "Battery(mah)": float(data.get("battery")),
            "RAM": float(data.get("ram")) * 1024,  # Convert GB to MB
            "Processor": data.get("processor")
        }])
        
        # Make prediction
        predicted_price = price_model.predict(input_df)[0]
        
        return jsonify({
            "success": True,
            "predicted_price": round(float(predicted_price), 2),
            "input_data": data
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


def generate_phone_image_url(brand, year):
    """
    Generate image URL using Unsplash API for mobile phones
    Falls back to a generic phone image if specific brand not found
    """
    # Using Unsplash Source API for random phone images
    # Format: https://source.unsplash.com/300x400/?{query}
    query = f"{brand}+phone+{year}"
    return f"https://source.unsplash.com/300x400/?{query}"


@app.route('/api/recommend', methods=['POST'])
def get_recommendations():
    """
    Get mobile recommendations based on user preferences
    Expected input format:
    {
        "budget": 50000,
        "brand": "Samsung",
        "operatingSystem": "Android",
        "minRam": 6,
        "minStorage": 128,
        "minBattery": 4000,
        "minScreenSize": 6.0
    }
    """
    try:
        data = request.json
        
        if dataset is None:
            return jsonify({"error": "Dataset not loaded"}), 500
        
        # Filter dataset based on user preferences
        filtered_df = dataset.copy()
        
        # Apply filters
        budget = data.get("budget")
        if budget:
            filtered_df = filtered_df[filtered_df["Price_in_India"] <= float(budget)]
        
        brand = data.get("brand")
        if brand:
            filtered_df = filtered_df[filtered_df["Brand"] == brand]
        
        os_filter = data.get("operatingSystem")
        if os_filter:
            filtered_df = filtered_df[filtered_df["operating_system"] == os_filter]
        
        min_ram = data.get("minRam")
        if min_ram:
            # RAM in dataset is in MB, convert GB to MB
            filtered_df = filtered_df[filtered_df["RAM"] >= float(min_ram) * 1024]
        
        min_storage = data.get("minStorage")
        if min_storage:
            filtered_df = filtered_df[filtered_df["Internal_storage(GB)"] >= float(min_storage)]
        
        min_battery = data.get("minBattery")
        if min_battery:
            filtered_df = filtered_df[filtered_df["Battery(mah)"] >= float(min_battery)]
        
        min_screen = data.get("minScreenSize")
        if min_screen:
            filtered_df = filtered_df[filtered_df["Screen-size"] >= float(min_screen)]
        
        # Remove duplicates and sort by price
        filtered_df = filtered_df.drop_duplicates(subset=["Brand", "Release_year", "Internal_storage(GB)", "RAM"])
        filtered_df = filtered_df.sort_values("Price_in_India")
        
        # Limit to top 10 recommendations
        recommendations = []
        for idx, row in filtered_df.head(10).iterrows():
            recommendations.append({
                "id": int(idx),
                "name": f"{row['Brand']} {int(row['Release_year'])} Model",
                "brand": row["Brand"],
                "price": float(row["Price_in_India"]),
                "ram": int(row["RAM"] / 1024),  # Convert MB to GB
                "storage": int(row["Internal_storage(GB)"]),
                "screenSize": float(row["Screen-size"]),
                "battery": int(row["Battery(mah)"]),
                "os": row["operating_system"],
                "releaseYear": int(row["Release_year"]),
                "processor": row["Processor"],
                "image": generate_phone_image_url(row["Brand"], int(row["Release_year"]))
            })
        
        return jsonify({
            "success": True,
            "recommendations": recommendations,
            "total_found": len(filtered_df)
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


@app.route('/', methods=['GET'])
def home():
    """Root endpoint"""
    return jsonify({
        "message": "Mobile Price Prediction API",
        "version": "1.0",
        "endpoints": {
            "health": "/api/health",
            "predict": "/api/predict (POST)",
            "recommend": "/api/recommend (POST)",
            "brands": "/api/brands (GET)"
        },
        "status": {
            "model_loaded": price_model is not None,
            "rules_loaded": fp_rules is not None,
            "dataset_loaded": dataset is not None
        }
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": price_model is not None,
        "rules_loaded": fp_rules is not None,
        "dataset_loaded": dataset is not None,
        "dataset_size": len(dataset) if dataset is not None else 0
    })


@app.route('/api/brands', methods=['GET'])
def get_brands():
    """Get list of available brands"""
    if dataset is None:
        return jsonify({"error": "Dataset not loaded"}), 500
    
    brands = sorted(dataset["Brand"].unique().tolist())
    return jsonify({"brands": brands})


if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Mobile Price Prediction API Server")
    print("="*50)
    print(f"Model Status: {'✓ Loaded' if price_model is not None else '✗ Not Loaded'}")
    print(f"Rules Status: {'✓ Loaded' if fp_rules is not None else '✗ Not Loaded'}")
    print(f"Dataset Status: {'✓ Loaded' if dataset is not None else '✗ Not Loaded'}")
    print("="*50)
    print("Server running on http://localhost:5000")
    print("="*50 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
