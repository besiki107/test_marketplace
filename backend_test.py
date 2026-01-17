#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class MarketplaceAPITester:
    def __init__(self, base_url="http://localhost:3001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, expected_count=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if success and expected_count is not None:
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        actual_count = len(response_data)
                        if actual_count != expected_count:
                            success = False
                            details += f", Expected {expected_count} items, got {actual_count}"
                        else:
                            details += f", Count: {actual_count}"
                except:
                    success = False
                    details += ", Failed to parse JSON response"

            self.log_test(name, success, details if not success else "")
            return success, response.json() if success and response.content else {}

        except requests.exceptions.RequestException as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return False, {}
        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_get_all_items(self):
        """Test GET /items - should return 15 car parts"""
        return self.run_test("GET All Items", "GET", "items", 200, expected_count=15)

    def test_get_item_by_id(self):
        """Test GET /items/:id"""
        return self.run_test("GET Item by ID", "GET", "items/1", 200)

    def test_get_nonexistent_item(self):
        """Test GET /items/:id with non-existent ID"""
        return self.run_test("GET Non-existent Item", "GET", "items/999", 404)

    def test_create_item(self):
        """Test POST /items"""
        new_item = {
            "title": "Test Brake Caliper",
            "price": 199.99,
            "category": "Brakes",
            "description": "High-performance brake caliper for testing purposes. This description is longer than 10 characters.",
            "image": "https://example.com/test-image.jpg",
            "condition": "new",
            "quantity": 5,
            "tags": ["test", "brakes"],
            "location": "Test City, TS",
            "createdAt": datetime.now().isoformat()
        }
        return self.run_test("POST Create Item", "POST", "items", 201, data=new_item)

    def test_update_item(self):
        """Test PUT /items/:id"""
        # First create an item to update
        success, created_item = self.test_create_item()
        if not success:
            self.log_test("PUT Update Item", False, "Failed to create item for update test")
            return False, {}

        # Update the created item
        updated_data = {
            "title": "Updated Test Item",
            "price": 299.99,
            "category": "Engine",
            "description": "Updated description for testing purposes. This is definitely longer than 10 characters.",
            "image": "https://example.com/updated-image.jpg",
            "condition": "used",
            "quantity": 3,
            "tags": ["updated", "test"],
            "location": "Updated City, UC",
            "createdAt": created_item.get("createdAt", datetime.now().isoformat())
        }
        
        item_id = created_item.get("id")
        if not item_id:
            self.log_test("PUT Update Item", False, "No ID returned from created item")
            return False, {}

        return self.run_test("PUT Update Item", "PUT", f"items/{item_id}", 200, data=updated_data)

    def test_delete_item(self):
        """Test DELETE /items/:id"""
        # First create an item to delete
        success, created_item = self.test_create_item()
        if not success:
            self.log_test("DELETE Item", False, "Failed to create item for delete test")
            return False, {}

        item_id = created_item.get("id")
        if not item_id:
            self.log_test("DELETE Item", False, "No ID returned from created item")
            return False, {}

        return self.run_test("DELETE Item", "DELETE", f"items/{item_id}", 200)

    def test_search_functionality(self):
        """Test search query parameters"""
        # Test search by title
        success, _ = self.run_test("Search by Title", "GET", "items?q=brake", 200)
        return success

    def test_category_filtering(self):
        """Test category filtering"""
        success, response = self.run_test("Filter by Category", "GET", "items?category=Engine", 200)
        if success and response:
            # Verify all returned items are in Engine category
            engine_items = [item for item in response if item.get("category") == "Engine"]
            if len(engine_items) != len(response):
                self.log_test("Category Filter Validation", False, "Some items don't match Engine category")
                return False
            else:
                self.log_test("Category Filter Validation", True)
        return success

    def test_price_sorting(self):
        """Test price sorting"""
        success, response = self.run_test("Sort by Price", "GET", "items?_sort=price&_order=asc", 200)
        if success and response and len(response) > 1:
            # Verify items are sorted by price ascending
            prices = [item.get("price", 0) for item in response]
            is_sorted = all(prices[i] <= prices[i+1] for i in range(len(prices)-1))
            if not is_sorted:
                self.log_test("Price Sort Validation", False, "Items not sorted by price")
                return False
            else:
                self.log_test("Price Sort Validation", True)
        return success

    def test_pagination(self):
        """Test pagination"""
        success, response = self.run_test("Pagination Test", "GET", "items?_page=1&_limit=5", 200)
        if success and response:
            if len(response) > 5:
                self.log_test("Pagination Validation", False, f"Expected max 5 items, got {len(response)}")
                return False
            else:
                self.log_test("Pagination Validation", True)
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Marketplace API Tests...")
        print("=" * 50)

        # Basic CRUD operations
        self.test_get_all_items()
        self.test_get_item_by_id()
        self.test_get_nonexistent_item()
        
        # Create, Update, Delete operations
        self.test_create_item()
        self.test_update_item()
        self.test_delete_item()
        
        # Advanced features
        self.test_search_functionality()
        self.test_category_filtering()
        self.test_price_sorting()
        self.test_pagination()

        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed!")
            return False

def main():
    tester = MarketplaceAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())