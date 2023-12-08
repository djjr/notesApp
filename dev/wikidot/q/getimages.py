import os
import requests
from bs4 import BeautifulSoup
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def download_images_from_url(url, save_dir):
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors

        soup = BeautifulSoup(response.content, 'html.parser')
        img_tags = soup.find_all('img')
        logging.info(f"Found {len(img_tags)} images on the webpage.")
        
        for img_tag in img_tags:
            img_url = img_tag.get('src')
            if not img_url:
                logging.warning("Found an img tag without a src attribute. Skipping.")
                continue

            if not img_url.startswith(('http:', 'https:')):
                img_url = os.path.join(url, img_url)

            try:
                img_data = requests.get(img_url).content
                img_name = os.path.join(save_dir, os.path.basename(img_url))
                
                with open(img_name, 'wb') as img_file:
                    img_file.write(img_data)
                logging.info(f"Downloaded {img_name}")
            except Exception as e:
                logging.error(f"Error downloading {img_url}. Error: {e}")

    except Exception as e:
        logging.error(f"Error fetching the webpage. Error: {e}")

if __name__ == "__main__":
    URL = "https://innoeduvation.org/danryan/wikidot/q/display.html"
    SAVE_DIRECTORY = "images"
    download_images_from_url(URL, SAVE_DIRECTORY)