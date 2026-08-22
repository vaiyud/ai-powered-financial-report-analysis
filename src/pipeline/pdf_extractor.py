"""
FinSight AI - PDF Financial Report Extraction Engine
Module: pdf_extractor.py
"""

import os
import re
import zlib
from typing import List, Dict, Any

# Try importing pypdfium2 or other available PDF libraries
PYPDFIUM_AVAILABLE = False
PYPDF_AVAILABLE = False

try:
    import pypdfium2 as pdfium
    PYPDFIUM_AVAILABLE = True
except ImportError:
    pass

try:
    import pypdf
    PYPDF_AVAILABLE = True
except ImportError:
    pass


class PDFExtractor:
    """Multi-backend PDF extractor with page provenance and table preservation."""

    def __init__(self, file_path: str):
        self.file_path = file_path
        self.file_name = os.path.basename(file_path)

    def extract_pages(self) -> List[Dict[str, Any]]:
        """Extracts text page-by-page from the PDF report using the best available backend."""
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"PDF file not found: {self.file_path}")

        if PYPDFIUM_AVAILABLE:
            return self._extract_with_pypdfium()
        elif PYPDF_AVAILABLE:
            return self._extract_with_pypdf()
        else:
            return self._extract_with_native_stream_parser()

    def _extract_with_pypdfium(self) -> List[Dict[str, Any]]:
        """Primary extraction using pypdfium2."""
        doc = pdfium.PdfDocument(self.file_path)
        pages_data = []

        for page_idx in range(len(doc)):
            page = doc[page_idx]
            textpage = page.get_textpage()
            text = textpage.get_text_range()
            textpage.close()
            page.close()

            clean_text, tables = self._post_process_page_text(text)
            pages_data.append({
                "file_name": self.file_name,
                "page_num": page_idx + 1,
                "text": clean_text,
                "tables": tables,
                "char_count": len(clean_text)
            })

        doc.close()
        return pages_data

    def _extract_with_pypdf(self) -> List[Dict[str, Any]]:
        """Fallback extraction using pypdf."""
        reader = pypdf.PdfReader(self.file_path)
        pages_data = []

        for idx, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            clean_text, tables = self._post_process_page_text(text)
            pages_data.append({
                "file_name": self.file_name,
                "page_num": idx + 1,
                "text": clean_text,
                "tables": tables,
                "char_count": len(clean_text)
            })

        return pages_data

    def _extract_with_native_stream_parser(self) -> List[Dict[str, Any]]:
        """Zero-dependency fallback PDF stream parser."""
        with open(self.file_path, "rb") as f:
            data = f.read()

        # Find decompressed text streams
        pos = 0
        streams = []
        while True:
            s_idx = data.find(b"stream", pos)
            if s_idx == -1:
                break
            content_start = s_idx + 6
            if data[content_start:content_start+2] == b"\r\n":
                content_start += 2
            elif data[content_start:content_start+1] in (b"\r", b"\n"):
                content_start += 1

            e_idx = data.find(b"endstream", content_start)
            if e_idx == -1:
                break

            streams.append(data[content_start:e_idx])
            pos = e_idx + 9

        extracted_tokens = []
        for s in streams:
            try:
                decompressed = zlib.decompress(s)
                # Regex for strings inside parentheses () Tj / TJ
                for match in re.finditer(b"\\((.*?)\\)", decompressed):
                    txt = match.group(1).decode("latin1", errors="ignore").strip()
                    if len(txt) > 1 and not txt.startswith("/"):
                        extracted_tokens.append(txt)
            except Exception:
                pass

        full_text = " ".join(extracted_tokens)
        clean_text, tables = self._post_process_page_text(full_text)

        # Virtual page estimation (~3000 chars per page)
        chunk_size = 3000
        pages_data = []
        for p_idx, i in enumerate(range(0, max(len(clean_text), 1), chunk_size)):
            page_str = clean_text[i:i+chunk_size]
            pages_data.append({
                "file_name": self.file_name,
                "page_num": p_idx + 1,
                "text": page_str,
                "tables": tables,
                "char_count": len(page_str)
            })

        return pages_data

    def _post_process_page_text(self, raw_text: str) -> (str, List[str]):
        """Cleans headers, formats tabular text, and detects markdown tables."""
        lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
        cleaned_lines = []
        tables = []

        table_buffer = []

        for line in lines:
            # Check if line looks like a table row (contains multiple numbers or delimiters)
            is_table_row = bool(re.search(r'(\d+[\d,.]*[\s|]+){2,}', line))
            if is_table_row:
                table_buffer.append(line)
            else:
                if len(table_buffer) >= 2:
                    tables.append("\n".join(table_buffer))
                    table_buffer = []
                cleaned_lines.append(line)

        if len(table_buffer) >= 2:
            tables.append("\n".join(table_buffer))

        clean_text = "\n".join(cleaned_lines)
        return clean_text, tables


if __name__ == "__main__":
    test_pdf = r"c:\Hackathon\HSIB_2025_Annual_Report.pdf"
    extractor = PDFExtractor(test_pdf)
    pages = extractor.extract_pages()
    print(f"Extracted {len(pages)} pages from {os.path.basename(test_pdf)}:")
    print(f"  - First page preview: {pages[0]['text'][:150]}...")
