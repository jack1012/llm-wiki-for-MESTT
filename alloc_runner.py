#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
alloc 技能實作 — 文件分派與預處理
版本：2.0 (規範檢查 + 自動分類)
"""

import os
import re
import shutil
from pathlib import Path
from datetime import datetime
from typing import Tuple, Dict, List

class AllocRunner:
    def __init__(self, vault_root: str = "."):
        self.vault_root = Path(vault_root)
        self.inbox_dir = self.vault_root / "inbox"
        self.raw_dir = self.vault_root / "raw"
        self.report = {
            "compliant": [],
            "non_compliant": [],
            "errors": [],
            "timestamp": datetime.now().strftime("%Y-%m-%d")
        }

    def validate_filename(self, filename: str) -> Tuple[bool, str]:
        """
        檢查檔案名稱是否符合規範：YYYY_Author_Title.ext

        Returns: (is_compliant, reason)
        """
        name_without_ext = os.path.splitext(filename)[0]

        # 檢查是否以 4 位數年份開頭
        if not re.match(r"^\d{4}", name_without_ext):
            return False, "缺少年份（4位數開頭）"

        # 檢查是否包含特殊問題字符
        problematic_chars = r'[\[\]\(\)%"\'|:?*&]'
        if re.search(problematic_chars, filename):
            return False, "包含特殊字符"

        # 檢查至少有 3 個基本部分（YYYY_Author_Title）
        parts = name_without_ext.split("_")
        if len(parts) < 3:
            return False, "檔名結構不完整（缺年份/作者/標題）"

        return True, "規範"

    def detect_language_and_type(self, file_path: Path) -> Tuple[str, str]:
        """
        讀取檔案內容，判定語言和內容類型

        Returns: (language, type)
        language: 'english' | '中文'
        type: 'articles' | 'papers' | 'transcripts' | 'book'
        """
        try:
            # 只讀前 2000 字以判定語言和類型
            content = ""

            if file_path.suffix.lower() == ".pdf":
                # 簡化：對 PDF，根據檔名和大小推斷
                # 實際應使用 pypdf 或 pdfplumber
                file_size_mb = file_path.stat().st_size / (1024 * 1024)
                # 啟發式：大文件 = 論文，小文件 = 文章
                estimated_type = "papers" if file_size_mb > 1 else "articles"
            else:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read(2000)
                estimated_type = self._classify_content(content)

            # 判定語言
            language = self._detect_language(content or file_path.name)

            return language, estimated_type

        except Exception as e:
            return "unknown", "articles"  # 預設値

    def _detect_language(self, text: str) -> str:
        """簡單的語言檢測"""
        # 計算中文字符比例
        chinese_chars = len(re.findall(r"[\u4e00-\u9fff]", text))
        english_chars = len(re.findall(r"[a-zA-Z]", text))

        total = chinese_chars + english_chars
        if total == 0:
            return "unknown"

        if chinese_chars / total > 0.4:
            return "中文"
        return "english"

    def _classify_content(self, text: str) -> str:
        """根據內容特徵分類"""
        text_lower = text.lower()

        # 尋找特徵關鍵詞
        if any(kw in text_lower for kw in ["abstract", "introduction", "methodology", "references", "摘要", "引言", "參考文獻"]):
            return "papers"
        elif any(kw in text_lower for kw in ["00:", "[00:", "speaker", "transcript", "轉錄", "發言人"]):
            return "transcripts"
        elif any(kw in text_lower for kw in ["chapter", "section", "part", "book", "章節", "部分"]):
            return "book"
        else:
            return "articles"

    def determine_target_dir(self, is_compliant: bool, file_type: str) -> Path:
        """根據規範狀態和類型決定目標目錄"""
        if not is_compliant:
            return self.raw_dir / "99-fixme"

        type_mapping = {
            "articles": "01-articles",
            "papers": "02-book",  # 注意：實際目錄是 02-book
            "transcripts": "03-notes",
            "book": "02-book"
        }

        subdir = type_mapping.get(file_type, "01-articles")
        return self.raw_dir / subdir

    def run(self, dry_run: bool = False):
        """執行 alloc 流程"""
        if not self.inbox_dir.exists():
            print(f"❌ inbox/ 目錄不存在：{self.inbox_dir}")
            return

        print(f"\n🔍 掃描 {self.inbox_dir} 中的檔案...")

        inbox_files = list(self.inbox_dir.glob("*"))
        inbox_files = [f for f in inbox_files if f.is_file()]

        print(f"   找到 {len(inbox_files)} 個檔案\n")

        for idx, file_path in enumerate(inbox_files, 1):
            filename = file_path.name
            print(f"[{idx:3d}/{len(inbox_files)}] {filename:60s} ", end="", flush=True)

            # 步驟 1：檢查檔案名稱規範
            is_compliant, validate_reason = self.validate_filename(filename)

            if is_compliant:
                # 步驟 2：識別屬性
                language, content_type = self.detect_language_and_type(file_path)

                # 步驟 3：決定目標目錄
                target_dir = self.determine_target_dir(True, content_type)

                print(f"✅ [{language}] {content_type:12s} → {target_dir.name}")

                self.report["compliant"].append({
                    "filename": filename,
                    "language": language,
                    "type": content_type,
                    "target": str(target_dir.relative_to(self.vault_root))
                })

                # 實際移動檔案（除非 dry_run）
                if not dry_run:
                    target_dir.mkdir(parents=True, exist_ok=True)
                    target_path = target_dir / filename
                    shutil.move(str(file_path), str(target_path))
            else:
                target_dir = self.raw_dir / "99-fixme"
                print(f"⚠️  {validate_reason:30s} → 99-fixme")

                self.report["non_compliant"].append({
                    "filename": filename,
                    "reason": validate_reason
                })

                # 實際移動檔案（除非 dry_run）
                if not dry_run:
                    target_dir.mkdir(parents=True, exist_ok=True)
                    target_path = target_dir / filename
                    shutil.move(str(file_path), str(target_path))

        # 生成報告
        self.print_report()

    def print_report(self):
        """生成分派報告"""
        compliant_count = len(self.report["compliant"])
        non_compliant_count = len(self.report["non_compliant"])
        total = compliant_count + non_compliant_count

        report_text = f"""
## 📦 alloc 分派報告 — {self.report['timestamp']}

### ✅ 規範檔案已分派 ({compliant_count} 個)
"""

        # 按類型分組
        by_type = {}
        for item in self.report["compliant"]:
            t = item["type"]
            if t not in by_type:
                by_type[t] = []
            by_type[t].append(item["filename"])

        for type_name, files in sorted(by_type.items()):
            report_text += f"\n#### {type_name} ({len(files)} 個)\n"
            for filename in files[:5]:  # 只顯示前 5 個
                report_text += f"- {filename}\n"
            if len(files) > 5:
                report_text += f"- ... 及其他 {len(files) - 5} 個\n"

        if non_compliant_count > 0:
            report_text += f"""
### ⚠️ 非規範檔案已移至待處理 ({non_compliant_count} 個)
檔案名稱有問題，已移到 `99-fixme/` 待人工確認與重命名：
"""
            for item in self.report["non_compliant"][:10]:  # 只顯示前 10 個
                report_text += f"- {item['filename']} — {item['reason']}\n"
            if non_compliant_count > 10:
                report_text += f"- ... 及其他 {non_compliant_count - 10} 個\n"

        report_text += f"""
### 📊 統計
- 總計處理：{total} 個檔案
- 規範分派：{compliant_count} 個 ({100*compliant_count/total:.1f}%)
- 非規範移至 99-fixme：{non_compliant_count} 個 ({100*non_compliant_count/total:.1f}%)
"""

        print(report_text)

        # 保存報告到文件
        report_path = self.vault_root / "ALLOC_REPORT.md"
        with open(report_path, "w", encoding="utf-8") as f:
            f.write(report_text)

        print(f"\n✅ 報告已保存到：{report_path}")

if __name__ == "__main__":
    import sys

    dry_run = "--dry-run" in sys.argv

    if dry_run:
        print("🔄 [DRY RUN] 將預覽分類結果，不實際移動檔案\n")

    runner = AllocRunner(vault_root=".")
    runner.run(dry_run=dry_run)
