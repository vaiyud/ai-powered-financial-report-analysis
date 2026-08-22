"""
FinSight AI - Stage 4.1 Multi-Year Financial Trend & Ratio Analyzer
Module: trend_analyzer.py
"""

import sys
import os
import json
from typing import List, Dict, Any, Optional

# Ensure UTF-8 output encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


class FinancialTrendAnalyzer:
    """Computes deterministic financial ratios, YoY growth rates, and multi-year trend benchmarks."""

    def __init__(self, pydantic_reports_path: str):
        self.pydantic_reports_path = pydantic_reports_path

    def analyze_trends(self, output_json_path: str) -> Dict[str, Any]:
        """Calculates quantitative financial ratios and YoY trend analysis across reports."""
        if not os.path.exists(self.pydantic_reports_path):
            raise FileNotFoundError(f"Pydantic reports payload not found: {self.pydantic_reports_path}")

        print("==================================================", flush=True)
        print("FinSight AI - Stage 4.1 Multi-Year Trend Analyzer", flush=True)
        print(f"Loading payload from: {self.pydantic_reports_path}", flush=True)
        print("==================================================", flush=True)

        with open(self.pydantic_reports_path, "r", encoding="utf-8") as f:
            reports = json.load(f)

        company_trends = {}

        for rep in reports:
            company = rep["company_name"]
            year = rep["fiscal_year"]
            doc_file = rep["source_file"]

            if company not in company_trends:
                company_trends[company] = []

            inc = rep.get("income_statement", {}) or {}
            bal = rep.get("balance_sheet", {}) or {}

            rev = (inc.get("revenue") or {}).get("value", 0.0)
            op_profit = (inc.get("operating_profit") or {}).get("value", 0.0)
            net_income = (inc.get("net_income") or {}).get("value", 0.0)

            assets = (bal.get("total_assets") or {}).get("value", 0.0)
            liabilities = (bal.get("total_liabilities") or {}).get("value", 0.0)
            equity = (bal.get("total_equity") or {}).get("value", 0.0)

            # Compute financial ratios deterministically
            op_margin_pct = (op_profit / rev * 100.0) if rev > 0 else 0.0
            net_margin_pct = (net_income / rev * 100.0) if rev > 0 else 0.0
            debt_to_equity = (liabilities / equity) if equity > 0 else 0.0
            asset_turnover = (rev / assets) if assets > 0 else 0.0

            company_trends[company].append({
                "fiscal_year": year,
                "source_file": doc_file,
                "metrics": {
                    "revenue": rev,
                    "operating_profit": op_profit,
                    "net_income": net_income,
                    "total_assets": assets,
                    "total_liabilities": liabilities,
                    "total_equity": equity
                },
                "ratios": {
                    "operating_margin_pct": round(op_margin_pct, 2),
                    "net_profit_margin_pct": round(net_margin_pct, 2),
                    "debt_to_equity_ratio": round(debt_to_equity, 2),
                    "asset_turnover_ratio": round(asset_turnover, 2)
                }
            })

            print(f"[✓] Analyzed ratios for {company} ({year}): Op Margin: {op_margin_pct:.1f}%, D/E: {debt_to_equity:.2f}x", flush=True)

        # Compute Year-over-Year (YoY) Growth Rates for multi-year entities
        yoy_analysis = []
        for company, records in company_trends.items():
            records.sort(key=lambda x: str(x["fiscal_year"]))

            for i in range(len(records)):
                curr = records[i]
                prev = records[i-1] if i > 0 else None

                rev_yoy = None
                pat_yoy = None
                if prev and prev["metrics"]["revenue"] > 0:
                    c_rev = curr["metrics"]["revenue"]
                    p_rev = prev["metrics"]["revenue"]
                    rev_yoy = round(((c_rev - p_rev) / abs(p_rev)) * 100.0, 2)

                if prev and prev["metrics"]["net_income"] > 0:
                    c_pat = curr["metrics"]["net_income"]
                    p_pat = prev["metrics"]["net_income"]
                    pat_yoy = round(((c_pat - p_pat) / abs(p_pat)) * 100.0, 2)

                yoy_analysis.append({
                    "company_name": company,
                    "fiscal_year": curr["fiscal_year"],
                    "source_file": curr["source_file"],
                    "revenue_yoy_growth_pct": rev_yoy,
                    "net_income_yoy_growth_pct": pat_yoy,
                    "operating_margin_pct": curr["ratios"]["operating_margin_pct"],
                    "net_profit_margin_pct": curr["ratios"]["net_profit_margin_pct"],
                    "debt_to_equity_ratio": curr["ratios"]["debt_to_equity_ratio"],
                    "asset_turnover_ratio": curr["ratios"]["asset_turnover_ratio"]
                })

        output_payload = {
            "trend_analysis_standard": "Quantitative Financial Ratio & YoY Trend Model",
            "company_trends": company_trends,
            "yoy_summary_records": yoy_analysis
        }

        with open(output_json_path, "w", encoding="utf-8") as f:
            json.dump(output_payload, f, indent=2, ensure_ascii=False)

        print("\n==================================================", flush=True)
        print("[SUCCESS] Stage 4.1 Trend & Ratio Analysis Complete!", flush=True)
        print(f"Trend Analysis Payload: {output_json_path}", flush=True)
        print("==================================================", flush=True)

        return output_payload


if __name__ == "__main__":
    pipeline_dir = os.path.dirname(__file__)
    pydantic_path = os.path.join(pipeline_dir, "pydantic_financial_reports.json")
    output_path = os.path.join(pipeline_dir, "financial_trend_analysis.json")

    analyzer = FinancialTrendAnalyzer(pydantic_path)
    analyzer.analyze_trends(output_path)
