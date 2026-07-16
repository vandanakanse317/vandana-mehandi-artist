import os
import glob

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Replace Mehendi -> Mehandi
        content = content.replace("Mehendi", "Mehandi")
        # Replace mehendi -> mehandi
        content = content.replace("mehendi", "mehandi")
        # URL encoded versions
        content = content.replace("Mehendi", "Mehandi") 
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

# Walk through the project
for root, dirs, files in os.walk("."):
    if "node_modules" in root or ".git" in root or "dist" in root:
        continue
    for file in files:
        if file.endswith(('.ts', '.tsx', '.json', '.html', '.css', '.js')):
            replace_in_file(os.path.join(root, file))

