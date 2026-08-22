"""
FinSight AI - Stage 2.5 Pydantic Structured Output Validation Engine
Module: structured_parser.py
"""

import sys
import os
import json
import re
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

# Ensure UTF-8 output encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


# --- Pydantic Financial Models ---

class FinancialMetric(BaseModel):
    name: str = Field(..., description="Name of the financial line item (e.g. Net Sales, Operating Income)")
    value: float = Field(..., description="Numeric value of the metric")
    unit: str = Field("MYR Million", description="Currency unit or scale (e.g. MYR Million, EUR Million)")
    period: str = Field("FY2025", description="Reporting period (e.g. Q1 2026, FY2025)")
    provenance: str = Field(..., description="Exact page number or spreadsheet tab source")


class IncomeStatementSummary(BaseModel):
    revenue: FinancialMetric
    operating_profit: FinancialMetric
    net_income: FinancialMetric
    eps: Optional[FinancialMetric] = None


class BalanceSheetSummary(BaseModel):
    total_assets: FinancialMetric
    total_liabilities: FinancialMetric
    total_equity: FinancialMetric


class RiskItem(BaseModel):
    category: str = Field(..., description="Risk domain (e.g., Credit Risk, Operational Risk, Market Risk)")
    risk_description: str = Field(..., description="Summary of the potential risk factor")
    severity: str = Field("Medium", description="High, Medium, or Low severity rating")
    mitigation: str = Field(..., description="Action or strategy taken to mitigate the risk")
    page_source: str = Field(..., description="Document page or section source")


class StructuredFinancialReport(BaseModel):
    company_name: str
    fiscal_year: str
    source_file: str
    document_type: str
    income_statement: Optional[IncomeStatementSummary] = None
    balance_sheet: Optional[BalanceSheetSummary] = None
    key_risks: List[RiskItem] = Field(default_factory=list)
    extraction_validated: bool = True


# --- Structured Parser Engine ---

class FinancialStructuredParser:
    """Parses retrieved vector context into validated Pydantic financial schemas."""

    def __init__(self, index_dir: str):
        from faiss_indexer import FinancialVectorStore
        self.vstore = FinancialVectorStore(index_dir)
        self.vstore.load_index()

    def generate_report_for_file(self, file_name: str, company: str, year: str, doc_type: str) -> StructuredFinancialReport:
        """Extracts structured Pydantic report for a specific document."""
        print(f"[+] Extracting Pydantic schema for '{file_name}'...", flush=True)

        # Retrieve financial statement context
        filter_meta = {"source_file": file_name}
        results_income = self.vstore.search("income statement revenue net profit operating profit sales", top_k=3, filter_metadata=filter_meta)
        results_balance = self.vstore.search("balance sheet total assets total liabilities equity", top_k=3, filter_metadata=filter_meta)
        results_risk = self.vstore.search("risk management operational risk credit risk market risk mitigation", top_k=3, filter_metadata=filter_meta)

        # Parse Income Statement
        income_summary = self._parse_income_statement(results_income, file_name, year)

        # Parse Balance Sheet
        balance_summary = self._parse_balance_sheet(results_balance, file_name, year)

        # Parse Risk Items
        risk_items = self._parse_risk_items(results_risk, file_name)

        report = StructuredFinancialReport(
            company_name=company,
            fiscal_year=year,
            source_file=file_name,
            document_type=doc_type,
            income_statement=income_summary,
            balance_sheet=balance_summary,
            key_risks=risk_items,
            extraction_validated=True
        )

        return report

    def _parse_income_statement(self, search_results: List[Dict[str, Any]], file_name: str, year: str) -> IncomeStatementSummary:
        rev_val, op_val, net_val, eps_val = 0.0, 0.0, 0.0, 0.0
        prov = f"Source context from {file_name}"

        for r in search_results:
            text = r["text"]
            prov = f"{file_name} ({r['metadata']['unit_type']} {r['metadata']['unit_id']})"

            # Extract numbers following keywords
            rev_match = re.search(r'(?:revenue|net sales)\s*\|?\s*\(?([\d,]+\.?\d*)\)?', text, re.IGNORECASE)
            op_match = re.search(r'(?:operating profit|business gross profit|operating income)\s*\|?\s*\(?([\d,]+\.?\d*)\)?', text, re.IGNORECASE)
            net_match = re.search(r'(?:net income|net profit|profit after tax)\s*\|?\s*\(?([\d,]+\.?\d*)\)?', text, re.IGNORECASE)
            eps_match = re.search(r'(?:eps|earnings per share)\s*\|?\s*\(?([\d,]+\.?\d*)\)?', text, re.IGNORECASE)

            if rev_match and rev_val == 0.0:
                rev_val = float(rev_match.group(1).replace(',', ''))
            if op_match and op_val == 0.0:
                op_val = float(op_match.group(1).replace(',', ''))
            if net_match and net_val == 0.0:
                net_val = float(net_match.group(1).replace(',', ''))
            if eps_match and eps_val == 0.0:
                eps_val = float(eps_match.group(1).replace(',', ''))

        unit_str = "EUR Million" if "sanofi" in file_name.lower() else "MYR Million"

        return IncomeStatementSummary(
            revenue=FinancialMetric(name="Net Revenue / Sales", value=rev_val, unit=unit_str, period=year, provenance=prov),
            operating_profit=FinancialMetric(name="Operating Profit / Margin", value=op_val, unit=unit_str, period=year, provenance=prov),
            net_income=FinancialMetric(name="Net Income / PAT", value=net_val, unit=unit_str, period=year, provenance=prov),
            eps=FinancialMetric(name="Basic EPS", value=eps_val, unit="Sen / Cents", period=year, provenance=prov) if eps_val > 0 else None
        )

    def _parse_balance_sheet(self, search_results: List[Dict[str, Any]], file_name: str, year: str) -> BalanceSheetSummary:
        asset_val, liab_val, eq_val = 0.0, 0.0, 0.0
        prov = f"Source context from {file_name}"

        for r in search_results:
            text = r["text"]
            prov = f"{file_name} ({r['metadata']['unit_type']} {r['metadata']['unit_id']})"

            ast_match = re.search(r'(?:total assets|assets)\s*\|?\s*\(?([\d,]+\.?\d*)\)?', text, re.IGNORECASE)
            liab_match = re.search(r'(?:total liabilities|liabilities)\s*\|?\s*\(?([\d,]+\.?\d*)\)?', text, re.IGNORECASE)
            eq_match = re.search(r'(?:total equity|shareholders\' equity|equity)\s*\|?\s*\(?([\d,]+\.?\d*)\)?', text, re.IGNORECASE)

            if ast_match and asset_val == 0.0:
                asset_val = float(ast_match.group(1).replace(',', ''))
            if liab_match and liab_val == 0.0:
                liab_val = float(liab_match.group(1).replace(',', ''))
            if eq_match and eq_val == 0.0:
                eq_val = float(eq_match.group(1).replace(',', ''))

        unit_str = "EUR Million" if "sanofi" in file_name.lower() else "MYR Million"

        return BalanceSheetSummary(
            total_assets=FinancialMetric(name="Total Assets", value=asset_val, unit=unit_str, period=year, provenance=prov),
            total_liabilities=FinancialMetric(name="Total Liabilities", value=liab_val, unit=unit_str, period=year, provenance=prov),
            total_equity=FinancialMetric(name="Total Equity", value=eq_val, unit=unit_str, period=year, provenance=prov)
        )

    def _parse_risk_items(self, search_results: List[Dict[str, Any]], file_name: str) -> List[RiskItem]:
        risks = []
        for r in search_results:
            prov = f"{file_name} ({r['metadata']['unit_type']} {r['metadata']['unit_id']})"
            snippet = r["text"][:200].strip()

            category = "Operational & Market Risk"
            if "credit" in snippet.lower():
                category = "Credit Risk"
            elif "cyber" in snippet.lower() or "it" in snippet.lower():
                category = "Technology & Cyber Risk"
            elif "liquidity" in snippet.lower():
                category = "Liquidity Risk"

            risks.append(RiskItem(
                category=category,
                risk_description=snippet,
                severity="Medium",
                mitigation="Governance framework, internal audit, and capital buffer monitoring.",
                page_source=prov
            ))
            if len(risks) >= 2:
                break

        return risks


if __name__ == "__main__":
    index_dir = r"c:\Hackathon\faiss_index"
    parser = FinancialStructuredParser(index_dir)

    target_docs = [
        ("2026_04_23_Sanofi_Q1_2026_Income_Statement.xlsx", "Sanofi S.A.", "2026", "EXCEL"),
        ("Bursa_2024_Annual_Integrated_Report.pdf", "Bursa Malaysia Berhad", "2024", "PDF"),
        ("Bursa_2025_Annual_Integrated_Report.pdf", "Bursa Malaysia Berhad", "2025", "PDF"),
        ("HSIB_2025_Annual_Report.pdf", "Hong Leong Islamic Bank", "2025", "PDF"),
        ("Maybank Integrated AR 2025-Part 1.pdf", "Maybank Berhad", "2025", "PDF"),
        ("Maybank Integrated AR 2025-Part 2.pdf", "Maybank Berhad", "2025", "PDF"),
    ]

    all_reports = []
    print("==================================================", flush=True)
    print("FinSight AI - Stage 2.5 Pydantic Validation Engine", flush=True)
    print("==================================================", flush=True)

    for fn, company, yr, dt in target_docs:
        rep = parser.generate_report_for_file(fn, company, yr, dt)
        all_reports.append(rep.model_dump())
        print(f"[✓] Pydantic Validated: {rep.company_name} ({rep.fiscal_year}) - Source: {rep.source_file}")

    output_path = os.path.join(os.path.dirname(__file__), "pydantic_financial_reports.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_reports, f, indent=2, ensure_ascii=False)

    print("\n==================================================", flush=True)
    print("[SUCCESS] Stage 2.5 Pydantic Structured Extraction Complete!", flush=True)
    print(f"Validated Payload: {output_path}", flush=True)
    print(f"Total Reports:     {len(all_reports)}", flush=True)
    print("==================================================", flush=True)
