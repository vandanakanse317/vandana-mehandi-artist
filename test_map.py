import urllib.request
url = "https://maps.google.com/maps?q=Vandana%20Mehandi%20Artist,%20Shrirampur,%20Maharashtra&t=&z=15&ie=UTF8&iwloc=&output=embed"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    resp = urllib.request.urlopen(req)
    print(resp.status)
except Exception as e:
    print(e)
