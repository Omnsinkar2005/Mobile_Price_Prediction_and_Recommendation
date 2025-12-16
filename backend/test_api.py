"""
Simple script to test the API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_health():
    """Test health endpoint"""
    print("\n" + "="*50)
    print("Testing Health Endpoint")
    print("="*50)
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_predict():
    """Test price prediction endpoint"""
    print("\n" + "="*50)
    print("Testing Price Prediction Endpoint")
    print("="*50)
    
    test_data = {
        "brand": "Samsung",
        "releaseYear": 2023,
        "screenSize": 6.5,
        "operatingSystem": "Android",
        "internalStorage": 128,
        "battery": 5000,
        "ram": 8,
        "processor": "octa-core"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/predict", json=test_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_recommend():
    """Test recommendation endpoint"""
    print("\n" + "="*50)
    print("Testing Recommendation Endpoint")
    print("="*50)
    
    test_data = {
        "budget": 30000,
        "brand": "Samsung",
        "operatingSystem": "Android",
        "minRam": 6,
        "minStorage": 64,
        "minBattery": 4000,
        "minScreenSize": 6.0
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/recommend", json=test_data)
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Success: {data.get('success')}")
        print(f"Total Found: {data.get('total_found')}")
        print(f"Recommendations: {len(data.get('recommendations', []))}")
        if data.get('recommendations'):
            print(f"\nFirst recommendation:")
            print(json.dumps(data['recommendations'][0], indent=2))
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_root():
    """Test root endpoint"""
    print("\n" + "="*50)
    print("Testing Root Endpoint")
    print("="*50)
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


if __name__ == "__main__":
    print("\n" + "="*60)
    print("🧪 API Testing Suite")
    print("="*60)
    print(f"Testing API at: {BASE_URL}")
    print("Make sure the Flask server is running!")
    print("="*60)
    
    results = {
        "Root": test_root(),
        "Health": test_health(),
        "Predict": test_predict(),
        "Recommend": test_recommend()
    }
    
    print("\n" + "="*60)
    print("📊 Test Results Summary")
    print("="*60)
    for test_name, passed in results.items():
        status = "✓ PASSED" if passed else "✗ FAILED"
        print(f"{test_name}: {status}")
    print("="*60 + "\n")
