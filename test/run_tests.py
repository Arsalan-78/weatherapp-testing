#!/usr/bin/env python3
"""
Weather Forecast Application - Main Test Runner
Runs both single page and multi-page Selenium tests
"""

import sys
import time
import subprocess
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

from single_page_test import SinglePageTests
from multi_page_test import MultiPageTests

class WeatherAppTestRunner:
    def __init__(self):
        self.driver = None
        self.setup_driver()
    
    def setup_driver(self):
        """Setup Chrome WebDriver with options"""
        print("🔧 Setting up Chrome WebDriver...")
        
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Remove this line to see browser
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.driver.implicitly_wait(10)
        
        print("✅ Chrome WebDriver setup complete")
    
    def check_application_running(self):
        """Check if the application is running on localhost:5173"""
        print("🌐 Checking if application is running...")
        
        try:
            self.driver.get("http://localhost:5173")
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            print("✅ Application is running and accessible")
            return True
        except Exception as e:
            print(f"❌ Application not accessible: {e}")
            print("💡 Make sure to run 'npm run dev' first")
            return False
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Weather App Automation Tests")
        print("=" * 50)
        
        if not self.check_application_running():
            return False
        
        try:
            
            single_page_tests = SinglePageTests(self.driver)
            multi_page_tests = MultiPageTests(self.driver)
            
            
            print("\n📄 Running Single Page Tests...")
            print("-" * 30)
            single_page_results = single_page_tests.run_all_tests()
            
            
            print("\n📱 Running Multi Page Tests...")
            print("-" * 30)
            multi_page_results = multi_page_tests.run_all_tests()
            
            
            self.print_test_summary(single_page_results, multi_page_results)
            
            return single_page_results['passed'] and multi_page_results['passed']
            
        except Exception as e:
            print(f"\n❌ Test execution failed: {e}")
            return False
    
    def print_test_summary(self, single_results, multi_results):
        """Print comprehensive test summary"""
        print("\n" + "=" * 50)
        print("📊 TEST EXECUTION SUMMARY")
        print("=" * 50)
        
        total_tests = single_results['total'] + multi_results['total']
        total_passed = single_results['passed_count'] + multi_results['passed_count']
        total_failed = single_results['failed_count'] + multi_results['failed_count']
        
        print(f"📄 Single Page Tests: {single_results['passed_count']}/{single_results['total']} passed")
        print(f"📱 Multi Page Tests: {multi_results['passed_count']}/{multi_results['total']} passed")
        print("-" * 30)
        print(f"🎯 Total Tests: {total_tests}")
        print(f"✅ Passed: {total_passed}")
        print(f"❌ Failed: {total_failed}")
        print(f"📈 Success Rate: {(total_passed/total_tests)*100:.1f}%")
        
        if total_failed == 0:
            print("\n🎉 ALL TESTS PASSED! 🎉")
        else:
            print(f"\n⚠️  {total_failed} test(s) failed. Check logs above for details.")
    
    def cleanup(self):
        """Clean up resources"""
        if self.driver:
            self.driver.quit()
            print("\n🧹 WebDriver cleanup complete")

def main():
    """Main execution function"""
    test_runner = WeatherAppTestRunner()
    
    try:
        success = test_runner.run_all_tests()
        test_runner.cleanup()
        
        if success:
            print("\n✅ All tests completed successfully!")
            sys.exit(0)
        else:
            print("\n❌ Some tests failed!")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n⚠️ Tests interrupted by user")
        test_runner.cleanup()
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        test_runner.cleanup()
        sys.exit(1)

if __name__ == "__main__":
    main()