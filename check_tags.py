import re

with open("src/App.tsx", "r") as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines):
    # this is a bit crude but we can just use a simple regex on each line
    # to find tags. Assuming one tag per match.
    for match in re.finditer(r'</?(?:div|section|nav|footer|header|main)[^>]*>', line):
        tag = match.group(0)
        if tag.startswith('</'):
            tag_name = tag[2:].split()[0].strip('>')
            if not stack:
                print(f"Line {i+1}: Error closing {tag_name} but stack is empty")
            else:
                top, top_line = stack.pop()
                if top != tag_name:
                    print(f"Line {i+1}: Error closing {tag_name} but expected {top} (opened at line {top_line})")
        else:
            if not tag.endswith('/>'):
                tag_name = tag[1:].split()[0].strip('>')
                stack.append((tag_name, i+1))

if stack:
    print(f"Unclosed tags: {stack}")
