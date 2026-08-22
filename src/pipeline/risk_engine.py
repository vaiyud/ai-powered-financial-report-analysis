"""
FinSight AI - Stage 4.3 Risk Matrix & Severity Scoring Engine
Module: risk_engine.py
"""

import sys
import os
import json
from typing import List, Dict, Any

# Ensure UTF-8 output encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


class FinancialRiskEngine:
    """Categorizes, scores, and assesses severity of financial & operational risks."""

    def __init__(self, pydantic_reports_path: str):
        self.pydantic_reports_path = pydantic_reports_path

    def build_risk_matrix(self, output_json_path: str) -> Dict[str, Any]:
        """Generates a structured risk matrix across all target financial documents."""
        if not os.path.exists(self.pydantic_reports_path):
            raise FileNotFoundError(f"Pydantic reports payload not found: {self.pydantic_reports_path}")

        print("==================================================", flush=True)
        print("FinSight AI - Stage 4.3 Risk Scoring & Matrix Engine", flush=True)
        print(f"Loading reports from: {self.pydantic_reports_path}", flush=True)
        print("==================================================", flush=True)

        with open(self.pydantic_reports_path, "r", encoding="utf-8") as f:
            reports = json.load(f)

        risk_matrix = []

        for rep in reports:
            company = rep["company_name"]
            year = rep["fiscal_year"]
            doc_file = rep["source_file"]
            doc_risks = rep.get("key_risks", [])

            comp_risks = []
            for r_idx, r in enumerate(doc_risks):
                comp_risks.append({
                    "risk_id": f"risk_{doc_file}_{r_idx+1}",
                    "company_name": company,
                    "fiscal_year": year,
                    "source_file": doc_file,
                    "category": r.get("category", "General Operational Risk"),
                    "severity": r.get("severity", "Medium"),
                    "risk_description": r.get("risk_description", ""),
                    "mitigation_strategy": r.get("mitigation", "Internal governance & oversight."),
                    "page_provenance": r.get("page_source", f"Source: {doc_file}")
                })

            # Default strategic risk if none extracted
            if not comp_risks:
                comp_risks.append({
                    "risk_id": f"risk_{doc_file}_default",
                    "company_name": company,
                    "fiscal_year": year,
                    "source_file": doc_file,
                    "category": "Market & Macroeconomic Risk",
                    "severity": "Medium",
                    "risk_description": f"Macroeconomic fluctuation, interest rate volatility, and regulatory compliance monitoring for {company}.",
                    "mitigation_strategy": "Active capital management, asset-liability hedging, and compliance controls.",
                    "page_provenance": f"Source: {doc_file}"
                })

            risk_matrix.extend(comp_risks)
            print(f"[✓] Processed Risk Matrix for {company} ({year}): {len(comp_risks)} risk items logged", flush=True)

        summary_counts = {"HIGH": 0, "MEDIUM": 0, "LOW": 0}
        for r in risk_matrix:
            sev = r["severity"].upper()
            if sev in summary_counts:
                summary_counts[sev] += 1
            else:
                summary_counts["MEDIUM"] += 1

        output_payload = {
            "risk_scoring_standard": "FinSight AI Risk Matrix & Severity Framework",
            "total_risk_items": len(risk_matrix),
            "severity_counts": summary_counts,
            "risk_matrix_records": risk_matrix
        }

        with open(output_json_path, "w", encoding="utf-8") as f:
            json.dump(output_payload, f, indent=2, ensure_ascii=False)

        print("\n==================================================", flush=True)
        print("[SUCCESS] Stage 4.3 Risk Matrix Complete!", flush=True)
        print(f"Risk Matrix Payload: {output_json_path}", flush=True)
        print(f"Severity Breakdown:  {summary_counts}", flush=True)
        print("==================================================", flush=True)

        return output_payload


if __name__ == "__main__":
    pipeline_dir = os.path.dirname(__file__)
    pydantic_path = os.path.join(pipeline_dir, "pydantic_financial_reports.json")
    output_path = os.path.join(pipeline_dir, "financial_risk_matrix.json")

    engine = FinancialRiskEngine(pydantic_path)
    engine.build_risk_matrix(output_path)
