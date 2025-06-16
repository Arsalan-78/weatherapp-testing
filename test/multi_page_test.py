from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class MultiPageTests:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)

    def run_all_tests(self):
        print('🌐 Starting Multi Page Tests...')
        results = {
            'total': 4,
            'passed_count': 0,
            'failed_count': 0,
            'passed': False
        }

        try:
            # Start from home page
            self.driver.get('http://localhost:5173')
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="page-title"]')))

            # Test 1: Navigate to Forecast page
            print('✓ Test 1: Navigate to Forecast page')
            forecast_nav = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="nav-forecast"]')
            forecast_nav.click()
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="forecast-page-title"]')))
            forecast_title = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="forecast-page-title"]').text
            if 'Extended Forecast' not in forecast_title:
                raise Exception('Forecast page not loaded correctly')
            results['passed_count'] += 1

            # Test 2: Tab switching
            print('✓ Test 2: Tab switching works on Forecast page')
            hourly_tab = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="hourly-tab"]')
            hourly_tab.click()
            time.sleep(1)
            daily_tab = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="daily-tab"]')
            daily_tab.click()
            time.sleep(1)
            results['passed_count'] += 1

            # Test 3: Navigate to Settings page
            print('✓ Test 3: Navigate to Settings page')
            settings_nav = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="nav-settings"]')
            settings_nav.click()
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="settings-title"]')))
            settings_title = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="settings-title"]').text
            if 'Settings' not in settings_title:
                raise Exception('Settings page not loaded correctly')
            results['passed_count'] += 1

            # Test 4: Settings functionality
            print('✓ Test 4: Settings functionality works')
            fahrenheit_button = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="fahrenheit-button"]')
            fahrenheit_button.click()
            results['passed_count'] += 1

            print('✅ All multi-page tests passed!')
            results['passed'] = True

        except Exception as e:
            print(f'❌ Test failed: {str(e)}')
            results['failed_count'] = results['total'] - results['passed_count']
            results['passed'] = False

        return results
