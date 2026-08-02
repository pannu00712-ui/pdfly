#!/usr/bin/env python3
"""
IndexNow submitter for pdfly.uk
Run this any time you deploy new/updated pages. It reads sitemap.xml
and submits every URL to the IndexNow API in one batch request.
IndexNow is shared by Bing, Yandex, Seznam, and Naver — one submission
notifies all of them.

Usage:
    python3 submit_indexnow.py
"""
import urllib.request
import json
import re
import os

HOST = "pdfly.uk"
KEY = "d71ccb6584fa8777e7ec6dd513228c35"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
SITEMAP_PATH = os.path.join(os.path.dirname(__file__), "sitemap.xml")
ENDPOINT = "https://api.indexnow.org/indexnow"

def get_urls_from_sitemap(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    return re.findall(r"<loc>(.*?)</loc>", content)

def submit(urls):
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"Status: {resp.status} {resp.reason}")
    except urllib.error.HTTPError as e:
        print(f"Status: {e.code} {e.reason}")
        print(e.read().decode())

if __name__ == "__main__":
    urls = get_urls_from_sitemap(SITEMAP_PATH)
    print(f"Found {len(urls)} URLs in sitemap.xml")
    submit(urls)
    print("Submitted to IndexNow (Bing, Yandex, Seznam, Naver).")
