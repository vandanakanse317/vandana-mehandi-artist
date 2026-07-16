import re

with open("src/App.tsx", "r") as f:
    text = f.read()

sections = re.findall(r'<section[^>]*>.*?</section>', text, re.DOTALL)
for i, section in enumerate(sections):
    div_opens = len(re.findall(r'<div[^>]*>', section))
    # Note: <div /> self closing should not be counted as open? 
    # There shouldn't be any <div /> but let's check
    self_closing = len(re.findall(r'<div[^>]*/>', section))
    div_opens -= self_closing
    
    div_closes = len(re.findall(r'</div>', section))
    print(f"Section {i+1}: opened {div_opens}, closed {div_closes}, diff {div_opens - div_closes}")
    

footer = re.search(r'<footer[^>]*>.*?</footer>', text, re.DOTALL)
if footer:
    footer = footer.group(0)
    div_opens = len(re.findall(r'<div[^>]*>', footer))
    div_closes = len(re.findall(r'</div>', footer))
    print(f"Footer: opened {div_opens}, closed {div_closes}, diff {div_opens - div_closes}")

# Check everything outside of sections and footers
# We can just check the whole file
div_opens = len(re.findall(r'<div[^>]*>', text))
div_closes = len(re.findall(r'</div>', text))
print(f"Total: opened {div_opens}, closed {div_closes}, diff {div_opens - div_closes}")
