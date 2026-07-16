import re

with open("src/data/siteData.ts", "r") as f:
    content = f.read()

content = content.replace("Vandana+Mehandi+Artist", "Vandana+Mehendi+Artist")
content = content.replace("Vandana%20Mehandi%20Artist", "Vandana%20Mehendi%20Artist")

with open("src/data/siteData.ts", "w") as f:
    f.write(content)
