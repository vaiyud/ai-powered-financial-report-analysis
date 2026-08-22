"""
FinSight AI - Stage 2.1 Dual-Stream Ingestion & Extraction Engine
Module: dual_extractor.py
"""

import sys
import os
import json
from typing import List, Dict, Any

# Ensure UTF-8 output encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from excel_extractor import ExcelExtractor
from pdf_extractor import PDFExtractor


class DualStreamExtractor:
    """Orchestrates multi-format financial document extraction across PDFs and Excel files."""

    def __init__(self, data_directory: str):
        self.data_directory = data_directory

    def run_pipeline(self) -> List[Dict[str, Any]]:
        """Scans directory and extracts content from all financial documents."""
        if not os.path.exists(self.data_directory):
            raise FileNotFoundError(f"Data directory does not exist: {self.data_directory}")

        files = [
            f for f in os.listdir(self.data_directory)
            if f.endswith((".pdf", ".xlsx")) and not f.startswith("~$")
        ]

        print(f"==================================================")
        print(f"FinSight AI - Stage 2.1 Extraction Pipeline Started")
        print(f"Found {len(files)} target document(s) in '{self.data_directory}'")
        print(f"==================================================")

        pipeline_results = []

        for file_name in files:
            file_path = os.path.join(self.data_directory, file_name)
            print(f"\n[+] Processing Document: {file_name}")

            if file_name.endswith(".xlsx"):
                doc_result = self._process_excel(file_path)
            elif file_name.endswith(".pdf"):
                doc_result = self._process_pdf(file_path)
            else:
                continue

            pipeline_results.append(doc_result)

        # Save extracted outputs to structured JSON
        output_json_path = os.path.join(os.path.dirname(__file__), "extracted_data.json")
        with open(output_json_path, "w", encoding="utf-8") as f:
            json.dump(pipeline_results, f, indent=2, ensure_ascii=False)

        print(f"\n==================================================")
        print(f"[SUCCESS] Stage 2.1 Extraction Complete!")
        print(f"Extracted payload saved to: {output_json_path}")
        print(f"==================================================")

        return pipeline_results

    def _process_excel(self, file_path: str) -> Dict[str, Any]:
        extractor = ExcelExtractor(file_path)
        sheets = extractor.extract_all_sheets()
        print(f"    ├─ Excel Spreadsheet: Extracted {len(sheets)} sheet(s)")

        units = []
        for s in sheets:
            units.append({
                "unit_type": "sheet",
                "unit_id": s["sheet_name"],
                "content": s["markdown_table"],
                "records": s["records"],
                "row_count": s["row_count"],
                "col_count": s["col_count"]
            })

        return {
            "file_name": os.path.basename(file_path),
            "file_type": "EXCEL",
            "total_units": len(units),
            "units": units
        }

    def _process_pdf(self, file_path: str) -> Dict[str, Any]:
        extractor = PDFExtractor(file_path)
        pages = extractor.extract_pages()
        print(f"    ├─ PDF Report: Extracted {len(pages)} page(s)")

        units = []
        for p in pages:
            units.append({
                "unit_type": "page",
                "unit_id": p["page_num"],
                "content": p["text"],
                "tables": p["tables"],
                "char_count": p["char_count"]
            })

        return {
            "file_name": os.path.basename(file_path),
            "file_type": "PDF",
            "total_units": len(units),
            "units": units
        }


if __name__ == "__main__":
    target_dir = r"c:\Hackathon"
    pipeline = DualStreamExtractor(target_dir)
    pipeline.run_pipeline()
