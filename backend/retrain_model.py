"""
Retrain the price prediction model with current sklearn version
"""
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
import warnings
warnings.filterwarnings('ignore')

print("Loading dataset...")
df = pd.read_csv("cleaned_data1 (1).csv")
print(f"✓ Loaded {len(df)} records")

# Prepare features and target
print("\nPreparing data...")
X = df[['Brand', 'Release_year', 'Screen-size', 'operating_system', 
        'Internal_storage(GB)', 'Battery(mah)', 'RAM', 'Processor']]
y = df['Price_in_India']

# Remove rows with missing values
X = X.dropna()
y = y[X.index]

print(f"✓ Clean data: {len(X)} records")

# Define categorical and numerical columns
categorical_features = ['Brand', 'operating_system', 'Processor']
numerical_features = ['Release_year', 'Screen-size', 'Internal_storage(GB)', 'Battery(mah)', 'RAM']

# Create preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
    ],
    remainder='passthrough'
)

# Create full pipeline
print("\nTraining model...")
model = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1))
])

# Train the model
model.fit(X, y)
print("✓ Model trained successfully")

# Save the model
with open("mobile_price_model_fixed.pkl", "wb") as f:
    pickle.dump(model, f)
print("✓ Model saved as 'mobile_price_model_fixed.pkl'")

# Test the model
print("\nTesting model...")
test_input = pd.DataFrame([{
    'Brand': 'Samsung',
    'Release_year': 2023,
    'Screen-size': 6.5,
    'operating_system': 'Android',
    'Internal_storage(GB)': 128,
    'Battery(mah)': 5000,
    'RAM': 8192,
    'Processor': 'octa-core'
}])

prediction = model.predict(test_input)[0]
print(f"✓ Test prediction: ₹{prediction:,.2f}")

print("\n" + "="*50)
print("SUCCESS! Model retrained and saved.")
print("The app.py will now use this fixed model.")
print("="*50)
