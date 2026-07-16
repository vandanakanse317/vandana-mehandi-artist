import urllib.request

try:
    resp = urllib.request.urlopen("http://localhost:3000/")
    print(resp.status)
except Exception as e:
    print(e)
