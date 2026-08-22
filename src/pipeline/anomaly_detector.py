"""
FinSight AI - Stage 4.2 Financial Anomaly & Exception Detector Engine
Module: anomaly_detector.py
"""

import sys
import os
import json
from typing import List, Dict, Any

# Ensure UTF-8 output encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


class FinancialAnomalyDetector:
    """Detects financial anomalies, red flags, and operational exceptions algorithmically."""

    def __init__(self, trend_json_path: str):
        self.trend_json_path = trend_json_path

    def detect_anomalies(self, output_json_path: str) -> List[Dict[str, Any]]:
        """Scans financial trends and metrics for statistical anomalies and red flags."""
        if not os.path.exists(self.trend_json_path):
            raise FileNotFoundError(f"Trend payload not found: {self.trend_json_path}")

        print("==================================================", flush=True)
        print("FinSight AI - Stage 4.2 Financial Anomaly Detector", flush=True)
        print(f"Loading trend payload from: {self.trend_json_path}", flush=True)
        print("==================================================", flush=True)

        with open(self.trend_json_path, "r", encoding="utf-8") as f:
            trend_data = json.load(f)

        company_trends = trend_data.get("company_trends", {})
        anomalies = []

        for company, records in company_trends.items():
            for rec in records:
                year = rec["fiscal_year"]
                file_name = rec["source_file"]
                metrics = rec["metrics"]
                ratios = rec["ratios"]

                # 1. High Financial Leverage Rule
                de_ratio = ratios.get("debt_to_equity_ratio", 0.0)
                if de_ratio > 1.5:
                    anomalies.append({
                        "anomaly_id": f"anom_{file_name}_de_leverage",
                        "company_name": company,
                        "fiscal_year": year,
                        "source_file": file_name,
                        "category": "Capital Structure & Leverage Alert",
                        "severity": "HIGH" if de_ratio > 2.5 else "MEDIUM",
                        "title": "Elevated Debt-to-Equity Ratio",
                        "description": f"Debt-to-Equity ratio reached {de_ratio:.2f}x, indicating reliance on financial liabilities relative to equity.",
                        "metric_impacted": "Debt-to-Equity Ratio",
                        "observed_value": f"{de_ratio:.2f}x",
                        "threshold": "1.50x"
                    })

                # 2. Operating Margin Compression Rule
                op_margin = ratios.get("operating_margin_pct", 0.0)
                rev = metrics.get("revenue", 0.0)
                if rev > 0 and op_margin < 5.0:
                    anomalies.append({
                        "anomaly_id": f"anom_{file_name}_margin_compression",
                        "company_name": company,
                        "fiscal_year": year,
                        "source_file": file_name,
                        "category": "Profitability & Margin Compression",
                        "severity": "MEDIUM",
                        "title": "Low Operating Profit Margin",
                        "description": f"Operating margin is constrained at {op_margin:.2f}%, suggesting overhead or cost-of-goods inflation.",
                        "metric_impacted": "Operating Margin (%)",
                        "observed_value": f"{op_margin:.2f}%",
                        "threshold": "5.00%"
                    })

                # 3. Profit vs Asset Efficiency Rule
                assets = metrics.get("total_assets", 0.0)
                turnover = ratios.get("asset_turnover_ratio", 0.0)
                if assets > 5000 and turnover < 0.1:
                    anomalies.append({
                        "anomaly_id": f"anom_{file_name}_asset_efficiency",
                        "company_name": company,
                        "fiscal_year": year,
                        "source_file": file_name,
                        "category": "Asset Utilization Efficiency",
                        "severity": "LOW",
                        "title": "Low Asset Turnover Rate",
                        "description": f"Asset turnover of {turnover:.2f}x reflects dense capital structure relative to quarterly top-line revenue generation.",
                        "metric_impacted": "Asset Turnover Ratio",
                        "observed_value": f"{turnover:.2f}x",
                        "threshold": "0.10x"
                    })

        for a in anomalies:
            print(f"[{a['severity']} ANOMALY] {a['company_name']} ({a['fiscal_year']}): {a['title']} - {a['observed_value']}", flush=True)

        with open(output_json_path, "w", encoding="utf-8") as f:
            json.dump(anomalies, f, indent=2, ensure_ascii=False)

        print("\n==================================================", flush=True)
        print("[SUCCESS] Stage 4.2 Anomaly Detection Complete!", flush=True)
        print(f"Anomalies Payload: {output_json_path}", flush=True)
        print(f"Total Anomalies:   {len(anomalies)}", flush=True)
        print("==================================================", flush=True)

        return anomalies


if __name__ == "__main__":
    pipeline_dir = os.path.dirname(__file__)
    trend_path = os.path.join(pipeline_dir, "financial_trend_analysis.json")
    output_path = os.path.join(pipeline_dir, "financial_anomalies.json")

    detector = FinancialAnomalyDetector(trend_path)
    detector.detect_anomalies(output_path)
