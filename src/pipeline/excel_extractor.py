"""
FinSight AI - Excel Financial Report Extraction Engine
Module: excel_extractor.py
"""

import os
import openpyxl
import pandas as pd
from typing import List, Dict, Any


class ExcelExtractor:
    """Parses multi-tab financial Excel spreadsheets into structured Markdown tables and dictionaries."""

    def __init__(self, file_path: str):
        self.file_path = file_path
        self.file_name = os.path.basename(file_path)

    def extract_all_sheets(self) -> List[Dict[str, Any]]:
        """Extracts data from all sheets in the Excel workbook."""
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"Excel file not found: {self.file_path}")

        wb = openpyxl.load_workbook(self.file_path, data_only=True)
        results = []

        for sheet_name in wb.sheetnames:
            sheet = wb[sheet_name]
            sheet_data = self._process_sheet(sheet, sheet_name)
            results.append(sheet_data)

        return results

    def _process_sheet(self, sheet: openpyxl.worksheet.worksheet.Worksheet, sheet_name: str) -> Dict[str, Any]:
        """Processes a single sheet into clean dataframes, markdown, and cell value mappings."""
        data = list(sheet.values)
        if not data:
            return {
                "file_name": self.file_name,
                "sheet_name": sheet_name,
                "row_count": 0,
                "col_count": 0,
                "markdown_table": "",
                "records": []
            }

        # Convert to pandas DataFrame for clean handling
        df = pd.DataFrame(data)

        # Drop entirely empty rows and columns
        df.dropna(how='all', inplace=True)
        df.dropna(how='all', axis=1, inplace=True)

        # Format numeric values
        try:
            df_clean = df.map(lambda x: self._format_cell(x))
        except AttributeError:
            df_clean = df.applymap(lambda x: self._format_cell(x))

        # Convert to Markdown table representation
        try:
            markdown_table = df_clean.to_markdown(index=False, header=False)
        except Exception:
            markdown_table = self._df_to_simple_markdown(df_clean)

        # Structure rows into records
        records = []
        for idx, row in df_clean.iterrows():
            row_vals = [str(val) for val in row.values if pd.notna(val) and str(val).strip() != ""]
            if row_vals:
                records.append({
                    "row_index": idx + 1,
                    "values": row_vals,
                    "line_text": " | ".join(row_vals)
                })

        return {
            "file_name": self.file_name,
            "sheet_name": sheet_name.strip(),
            "row_count": len(df_clean),
            "col_count": len(df_clean.columns) if not df_clean.empty else 0,
            "markdown_table": markdown_table,
            "records": records
        }

    @staticmethod
    def _format_cell(val: Any) -> Any:
        if val is None:
            return ""
        if isinstance(val, float):
            return round(val, 4)
        return str(val).strip()

    @staticmethod
    def _df_to_simple_markdown(df: pd.DataFrame) -> str:
        lines = []
        for _, row in df.iterrows():
            cells = [str(c) if c is not None else "" for c in row.values]
            lines.append("| " + " | ".join(cells) + " |")
        return "\n".join(lines)


if __name__ == "__main__":
    test_path = r"c:\Hackathon\2026_04_23_Sanofi_Q1_2026_Income_Statement.xlsx"
    extractor = ExcelExtractor(test_path)
    sheets = extractor.extract_all_sheets()
    print(f"Extracted {len(sheets)} sheets from {os.path.basename(test_path)}:")
    for s in sheets:
        print(f"  - Sheet '{s['sheet_name']}': {s['row_count']} rows, {s['col_count']} cols")
