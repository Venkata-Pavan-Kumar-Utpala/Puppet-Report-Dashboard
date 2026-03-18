"""
Selenium UI Tests - Puppet Report Dashboard
CSE3253 DevOps | Venkata Pavan Kumar Utpala | 23FE10CSE00388
"""

import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

BASE_URL = "http://localhost:8080"

class PuppetDashboardUITests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        cls.driver = webdriver.Chrome(options=options)
        cls.driver.implicitly_wait(10)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_01_page_title(self):
        """Dashboard page title should contain Puppet"""
        self.driver.get(BASE_URL)
        self.assertIn("Puppet", self.driver.title)

    def test_02_header_displayed(self):
        """Header should show project title"""
        self.driver.get(BASE_URL)
        header = self.driver.find_element(By.TAG_NAME, "header")
        self.assertIn("Puppet Report Dashboard", header.text)

    def test_03_summary_cards_present(self):
        """All 6 summary cards should be present"""
        self.driver.get(BASE_URL)
        wait = WebDriverWait(self.driver, 10)
        wait.until(EC.presence_of_element_located((By.ID, "total-nodes")))
        for elem_id in ["total-nodes", "nodes-changed", "nodes-unchanged",
                        "nodes-failed", "reports-today", "failures-today"]:
            el = self.driver.find_element(By.ID, elem_id)
            self.assertIsNotNone(el)

    def test_04_nodes_table_populated(self):
        """Node status table should have at least one row after data loads"""
        self.driver.get(BASE_URL)
        wait = WebDriverWait(self.driver, 15)
        wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "#nodes-tbody tr")) > 0)
        rows = self.driver.find_elements(By.CSS_SELECTOR, "#nodes-tbody tr")
        self.assertGreater(len(rows), 0)

    def test_05_reports_table_populated(self):
        """Recent reports table should have rows"""
        self.driver.get(BASE_URL)
        wait = WebDriverWait(self.driver, 15)
        wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "#reports-tbody tr")) > 0)
        rows = self.driver.find_elements(By.CSS_SELECTOR, "#reports-tbody tr")
        self.assertGreater(len(rows), 0)

    def test_06_report_drilldown_modal(self):
        """Clicking a report row should open the detail modal"""
        self.driver.get(BASE_URL)
        wait = WebDriverWait(self.driver, 15)
        row = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "#reports-tbody tr")))
        row.click()
        modal = wait.until(EC.visibility_of_element_located((By.ID, "modal-overlay")))
        self.assertIn("open", modal.get_attribute("class"))

    def test_07_charts_rendered(self):
        """Trend and pie charts canvas elements should be present"""
        self.driver.get(BASE_URL)
        self.assertIsNotNone(self.driver.find_element(By.ID, "trendChart"))
        self.assertIsNotNone(self.driver.find_element(By.ID, "pieChart"))


if __name__ == "__main__":
    unittest.main()
