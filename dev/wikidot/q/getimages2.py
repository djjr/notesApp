from selenium import webdriver
from selenium.webdriver.common.by import By
import os
import requests
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def download_images_from_url(url, save_dir):
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    # Start a new browser session
    with webdriver.Chrome() as browser:
        browser.get(url)

        # You can add an optional delay if the page needs more time to load or the JavaScript needs more time to render
        import time
        time.sleep(10)

        #img_tags = browser.find_elements_by_tag_name('img')
        img_tags = browser.find_elements(By.TAG_NAME, 'img')
        logging.info(f"Found {len(img_tags)} images on the webpage.")

        for img_tag in img_tags:
            img_url = img_tag.get_attribute('src')
            
            try:
                img_data = requests.get(img_url).content
                img_name = os.path.join(save_dir, os.path.basename(img_url))
                
                with open(img_name, 'wb') as img_file:
                    img_file.write(img_data)
                logging.info(f"Downloaded {img_name}")
            except Exception as e:
                logging.error(f"Error downloading {img_url}. Error: {e}")


if __name__ == "__main__":
    URL = "https://computational-thinking.wikidot.com/main:problemslistall"
    SAVE_DIRECTORY = "../ct/ct_problem/images"
    download_images_from_url(URL, SAVE_DIRECTORY)