"""
Quick script to reload and resave the model with current sklearn version
"""
import pickle
import warnings
warnings.filterwarnings('ignore')

print("Attempting to fix the model...")

# Try to load the old model
try:
    with open("mobile_price_model (1).pkl", "rb") as f:
        model = pickle.load(f)
    print("✓ Model loaded successfully")
    
    # Resave it with current sklearn version
    with open("mobile_price_model_fixed.pkl", "wb") as f:
        pickle.dump(model, f)
    print("✓ Model resaved as 'mobile_price_model_fixed.pkl'")
    print("\nNow update app.py to use 'mobile_price_model_fixed.pkl'")
    
except Exception as e:
    print(f"✗ Error: {e}")
    print("\nThe model has compatibility issues. We need to retrain it.")
    print("Let me create a simple retraining script...")
