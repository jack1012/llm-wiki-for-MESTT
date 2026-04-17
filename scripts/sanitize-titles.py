import os
import re

def sanitize_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 標案處理受損的各種變體
        # 1. 直接移除標題標記及其損毀變體
        patterns = [
            r'【標題】',
            r'\?\?題】',
            r'D', 
            r'【D】',
            r'【標?'
        ]
        
        new_content = content
        for pattern in patterns:
            new_content = re.sub(pattern, '', new_content)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
    return False

if __name__ == "__main__":
    cards_dir = 'wiki/cards'
    fixed_count = 0
    for file in os.listdir(cards_dir):
        if file.endswith('.md'):
            if sanitize_file(os.path.join(cards_dir, file)):
                fixed_count += 1
    print(f"Successfully sanitized {fixed_count} cards.")
