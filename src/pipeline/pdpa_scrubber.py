"""
FinSight AI - Stage 2.2 Pre-Ingestion PDPA & Anonymization Layer
Module: pdpa_scrubber.py
Compliance: Personal Data Protection Act (PDPA) Malaysia
"""

import sys
import os
import json
import re
from typing import List, Dict, Any, Tuple

# Ensure UTF-8 output encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


class PDPAScrubber:
    """Detects, masks, and audits PII in extracted financial data to enforce PDPA compliance."""

    def __init__(self):
        # Malaysian NRIC (e.g., 901231-14-5566 or 901231145566)
        self.nric_pattern = re.compile(
            r'\b\d{6}[-_]?\d{2}[-_]?\d{4}\b'
        )

        # Malaysian Phone Numbers (e.g., +6012-3456789, 012-3456789)
        self.phone_pattern = re.compile(
            r'\b(?:\+?60|0)1[0-9][-_]?\d{7,8}\b'
        )

        # Email addresses
        self.email_pattern = re.compile(
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'
        )

        # Personal Credit Card / Bank Account Numbers
        self.account_pattern = re.compile(
            r'\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b'
        )

    def scrub_text(self, text: str) -> Tuple[str, Dict[str, int]]:
        """Scubs PII tokens from text string and returns scrubbed text along with match counts."""
        if not text:
            return "", {"nric": 0, "phone": 0, "email": 0, "account": 0}

        counts = {"nric": 0, "phone": 0, "email": 0, "account": 0}

        def _nric_repl(m):
            counts["nric"] += 1
            return "[REDACTED_NRIC]"

        def _phone_repl(m):
            counts["phone"] += 1
            return "[REDACTED_PHONE]"

        def _email_repl(m):
            counts["email"] += 1
            return "[REDACTED_EMAIL]"

        def _account_repl(m):
            counts["account"] += 1
            return "[REDACTED_ACCOUNT_NO]"

        scrubbed = self.nric_pattern.sub(_nric_repl, text)
        scrubbed = self.phone_pattern.sub(_phone_repl, scrubbed)
        scrubbed = self.email_pattern.sub(_email_repl, scrubbed)
        scrubbed = self.account_pattern.sub(_account_repl, scrubbed)

        return scrubbed, counts

    def scrub_payload(self, raw_json_path: str, output_json_path: str) -> Dict[str, Any]:
        """Processes extracted data JSON payload and produces PDPA scrubbed payload and audit log."""
        if not os.path.exists(raw_json_path):
            raise FileNotFoundError(f"Input JSON payload not found: {raw_json_path}")

        print("==================================================", flush=True)
        print("FinSight AI - Stage 2.2 PDPA Anonymization Layer", flush=True)
        print(f"Loading payload from: {raw_json_path}", flush=True)
        print("==================================================", flush=True)

        with open(raw_json_path, "r", encoding="utf-8") as f:
            documents = json.load(f)

        scrubbed_documents = []
        total_counts = {"nric": 0, "phone": 0, "email": 0, "account": 0}
        audit_records = []

        for doc in documents:
            file_name = doc["file_name"]
            doc_counts = {"nric": 0, "phone": 0, "email": 0, "account": 0}
            scrubbed_units = []

            for unit in doc.get("units", []):
                scrubbed_content, content_counts = self.scrub_text(unit.get("content", ""))

                scrubbed_tables = []
                for table_str in unit.get("tables", []):
                    st, tc = self.scrub_text(table_str)
                    scrubbed_tables.append(st)
                    for k in doc_counts:
                        doc_counts[k] += tc[k]

                for k in doc_counts:
                    doc_counts[k] += content_counts[k]

                unit_copy = dict(unit)
                unit_copy["content"] = scrubbed_content
                if scrubbed_tables:
                    unit_copy["tables"] = scrubbed_tables
                scrubbed_units.append(unit_copy)

            doc_copy = dict(doc)
            doc_copy["units"] = scrubbed_units
            doc_copy["pdpa_anonymized"] = True
            scrubbed_documents.append(doc_copy)

            audit_records.append({
                "file_name": file_name,
                "redactions": doc_counts,
                "total_redactions": sum(doc_counts.values())
            })

            for k in total_counts:
                total_counts[k] += doc_counts[k]

            print(f"[✓] Scrubbed '{file_name}': {sum(doc_counts.values())} PII redactions performed", flush=True)

        with open(output_json_path, "w", encoding="utf-8") as f:
            json.dump(scrubbed_documents, f, indent=2, ensure_ascii=False)

        audit_log_path = os.path.join(os.path.dirname(output_json_path), "pdpa_audit_report.json")
        audit_summary = {
            "pdpa_compliance_standard": "Personal Data Protection Act (PDPA) Malaysia",
            "total_documents_processed": len(documents),
            "total_pii_redactions": sum(total_counts.values()),
            "redaction_breakdown": total_counts,
            "document_audit_records": audit_records
        }
        with open(audit_log_path, "w", encoding="utf-8") as f:
            json.dump(audit_summary, f, indent=2, ensure_ascii=False)

        print("\n==================================================", flush=True)
        print("[SUCCESS] Stage 2.2 PDPA Scrubbing Complete!", flush=True)
        print(f"Scrubbed Payload: {output_json_path}", flush=True)
        print(f"PDPA Audit Log:   {audit_log_path}", flush=True)
        print(f"Total Redactions: {sum(total_counts.values())}", flush=True)
        print("==================================================", flush=True)

        return audit_summary


if __name__ == "__main__":
    pipeline_dir = os.path.dirname(__file__)
    input_payload = os.path.join(pipeline_dir, "extracted_data.json")
    output_payload = os.path.join(pipeline_dir, "scrubbed_data.json")

    scrubber = PDPAScrubber()
    scrubber.scrub_payload(input_payload, output_payload)
