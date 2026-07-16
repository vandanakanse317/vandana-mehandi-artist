import re

with open("src/data/siteData.ts", "r") as f:
    content = f.read()

# make sure googleDirections is the robust API format
content = re.sub(
    r'googleDirections:\s*"[^"]+"',
    'googleDirections: "https://www.google.com/maps/dir/?api=1&destination=Vandana+Mehendi+Artist,+Shrirampur,+Maharashtra"',
    content
)

with open("src/data/siteData.ts", "w") as f:
    f.write(content)
