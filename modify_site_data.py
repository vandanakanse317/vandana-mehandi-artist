import re

with open("src/data/siteData.ts", "r") as f:
    content = f.read()

# Replace googleDirections
content = re.sub(
    r'googleDirections:\s*"[^"]+"',
    'googleDirections: "https://www.google.com/maps/dir//Vandana+Mehandi+Artist,+Shrirampur,+Maharashtra"',
    content
)

# Replace googleMapsEmbed
content = re.sub(
    r'googleMapsEmbed:\s*"[^"]+"',
    'googleMapsEmbed: "https://maps.google.com/maps?q=Vandana%20Mehandi%20Artist,%20Shrirampur,%20Maharashtra&t=&z=15&ie=UTF8&iwloc=&output=embed"',
    content
)

with open("src/data/siteData.ts", "w") as f:
    f.write(content)
