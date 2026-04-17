import os
import re
import sys
import argparse

def search_wiki(query, root_dir='wiki'):
    results = []
    query_regex = re.compile(re.escape(query), re.IGNORECASE)
    
    # Walk through the wiki directory
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, start=root_dir)
                page_name = os.path.splitext(file)[0]
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Match count
                        matches = list(query_regex.finditer(content))
                        if matches:
                            # Extract snippet of first match
                            idx = matches[0].start()
                            start = max(0, idx - 50)
                            end = min(len(content), idx + 100)
                            snippet = content[start:end].replace('\n', ' ')
                            
                            results.append({
                                'name': page_name,
                                'path': rel_path,
                                'matches': len(matches),
                                'snippet': f"...{snippet}..."
                            })
                except Exception as e:
                    continue
    
    # Sort by number of matches
    results.sort(key=lambda x: x['matches'], reverse=True)
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Academic Wiki Local Search Engine')
    parser.add_argument('query', type=str, help='Keyword to search')
    args = parser.parse_args()
    
    hits = search_wiki(args.query)
    
    if not hits:
        print(f"\n❌ 沒有在 Wiki 中找到關鍵字: '{args.query}'")
    else:
        print(f"\n🔍 找到 {len(hits)} 個相關頁面:")
        print("-" * 60)
        for hit in hits[:15]:  # Limit to top 15 results
            print(f"📄 [[{hit['name']}]] ({hit['matches']} 處匹配)")
            print(f"   💡 內容片段: {hit['snippet']}")
            print("-" * 60)
        
        if len(hits) > 15:
            print(f"...還有 {len(hits) - 15} 個結果未顯示。")
