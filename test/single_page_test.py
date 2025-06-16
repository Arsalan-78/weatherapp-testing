from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class SinglePageTests:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)

    def run_all_tests(self):
        print('🔍 Starting Single Page Tests...')
        results = {
            'total': 5,
            'passed_count': 0,
            'failed_count': 0,
            'passed': False
        }

        try:
            
            self.driver.get('http://localhost:5173')

            # Test 1: Verify page loads correctly
            print('✓ Test 1: Page loads correctly')
            page_title_element = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="page-title"]')))
            page_title = page_title_element.text
            if 'Weather Dashboard' not in page_title:
                raise Exception('Page title not found or incorrect')
            results['passed_count'] += 1

            # Test 2: Weather card is displayed
            print('✓ Test 2: Weather card is displayed')
            weather_card = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="weather-card"]')))
            assert weather_card.is_displayed(), 'Weather card is not displayed'
            results['passed_count'] += 1

            # Test 3: City name is displayed
            print('✓ Test 3: City name is displayed')
            city_name = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="city-name"]').text
            if not city_name:
                raise Exception('City name is not displayed')
            results['passed_count'] += 1

            # Test 4: Temperature is displayed
            print('✓ Test 4: Temperature is displayed')
            temperature = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="temperature"]').text
            if '°C' not in temperature:
                raise Exception('Temperature is not displayed correctly')
            results['passed_count'] += 1

            # Test 5: Weather condition is displayed
            print('✓ Test 5: Weather condition is displayed')
            condition = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="condition"]').text
            if not condition:
                raise Exception('Weather condition is not displayed')
            results['passed_count'] += 1

            print('✅ All single page tests passed!')
            results['passed'] = True

        except Exception as e:
            print(f'❌ Test failed: {str(e)}')
            results['failed_count'] = results['total'] - results['passed_count']
            results['passed'] = False

        return results
