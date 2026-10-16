import urllib.request
import json

url = "https://api.superdesign.dev/v1/prompt-library?isPublic=true&limit=2"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=10) as resp:
    data = json.loads(resp.read().decode("utf-8"))
    print("Success! Items:", len(data.get("items", [])))
