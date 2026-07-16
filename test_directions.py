import urllib.request
url = "https://www.google.com/maps/dir//Vandana+Mehandi+Artist,+Shrirampur,+Maharashtra"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    resp = urllib.request.urlopen(req)
    print(resp.status)
except Exception as e:
    print(e)
