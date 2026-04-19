import requests

BASE_URL = "http://127.0.0.1:8000"

def test_backend():
    print("Testing Backend...")
    
    # 1. POST /vendors
    payload = {
        "name": "Test Vendor",
        "category": "Consultant",
        "contact_email": "test@example.com"
    }
    response = requests.post(f"{BASE_URL}/vendors", json=payload)
    print(f"POST /vendors: {response.status_code}")
    print(response.json())
    
    if response.status_code != 200:
        return

    vendor_id = response.json()["id"]

    # 2. GET /vendors
    response = requests.get(f"{BASE_URL}/vendors")
    print(f"GET /vendors: {response.status_code}")
    print(response.json())

    # 3. PATCH /vendors/{id}/approve
    response = requests.patch(f"{BASE_URL}/vendors/{vendor_id}/approve")
    print(f"PATCH /vendors/{vendor_id}/approve: {response.status_code}")
    print(response.json())

    # 4. GET /vendors (again to see approval)
    response = requests.get(f"{BASE_URL}/vendors")
    print(f"GET /vendors (after approval): {response.status_code}")
    print(response.json())

if __name__ == "__main__":
    test_backend()
