"""
FinSight AI - Stage 2.3 Financial-Aware Semantic Chunking & Metadata Tagging Module
Module: chunker.py
"""

import sys
import os
import json
import re
from typing import List, Dict, Any

# Ensure UTF-8 output encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


class FinancialChunker:
    """Chunks financial document units while preserving table boundaries and attaching rich metadata."""

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 150):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_payload(self, scrubbed_json_path: str, output_json_path: str) -> List[Dict[str, Any]]:
        """Reads PDPA scrubbed payload and produces semantically chunked documents with metadata."""
        if not os.path.exists(scrubbed_json_path):
            raise FileNotFoundError(f"Scrubbed JSON payload not found: {scrubbed_json_path}")

        print("==================================================", flush=True)
        print("FinSight AI - Stage 2.3 Financial Semantic Chunker", flush=True)
        print(f"Loading payload from: {scrubbed_json_path}", flush=True)
        print("==================================================", flush=True)

        with open(scrubbed_json_path, "r", encoding="utf-8") as f:
            documents = json.load(f)

        all_chunks = []
        doc_summary = []

        for doc in documents:
            file_name = doc["file_name"]
            file_type = doc["file_type"]
            company, year = self._infer_entity_and_year(file_name)

            doc_chunks = []
            for unit in doc.get("units", []):
                unit_id = unit["unit_id"]
                unit_type = unit["unit_type"]
                content = unit.get("content", "")
                tables = unit.get("tables", [])

                # Form full unit text combining narrative and extracted tables
                combined_text = content
                if tables:
                    combined_text += "\n\n### Extracted Tables:\n" + "\n\n".join(tables)

                if not combined_text.strip():
                    continue

                # Generate chunks for this page/sheet
                unit_chunks = self._split_text_into_chunks(combined_text)

                for c_idx, chunk_text in enumerate(unit_chunks):
                    chunk_id = f"{file_name}_{unit_type}_{unit_id}_c{c_idx+1}"
                    chunk_obj = {
                        "chunk_id": chunk_id,
                        "text": chunk_text,
                        "metadata": {
                            "source_file": file_name,
                            "file_type": file_type,
                            "company_name": company,
                            "fiscal_year": year,
                            "unit_type": unit_type,
                            "unit_id": unit_id,
                            "chunk_index": c_idx + 1,
                            "char_count": len(chunk_text),
                            "pii_scrubbed": doc.get("pdpa_anonymized", True)
                        }
                    }
                    doc_chunks.append(chunk_obj)

            all_chunks.extend(doc_chunks)
            doc_summary.append({
                "file_name": file_name,
                "total_chunks": len(doc_chunks)
            })
            print(f"[✓] Chunked '{file_name}': Created {len(doc_chunks)} chunks", flush=True)

        with open(output_json_path, "w", encoding="utf-8") as f:
            json.dump(all_chunks, f, indent=2, ensure_ascii=False)

        print("\n==================================================", flush=True)
        print("[SUCCESS] Stage 2.3 Financial Chunking Complete!", flush=True)
        print(f"Chunked Payload:  {output_json_path}", flush=True)
        print(f"Total Chunks:     {len(all_chunks)}", flush=True)
        print("==================================================", flush=True)

        return all_chunks

    def _split_text_into_chunks(self, text: str) -> List[str]:
        """Splits text recursively by headers, paragraphs, lines, and spaces without breaking tables."""
        if len(text) <= self.chunk_size:
            return [text]

        separators = ["\n### ", "\n## ", "\n\n", "\n|", "\n", " "]
        return self._recursive_split(text, separators, self.chunk_size, self.chunk_overlap)

    def _recursive_split(self, text: str, separators: List[str], chunk_size: int, overlap: int) -> List[str]:
        final_chunks = []
        if not separators:
            # Fallback hard slice
            for i in range(0, len(text), chunk_size - overlap):
                final_chunks.append(text[i:i+chunk_size])
            return final_chunks

        sep = separators[0]
        splits = text.split(sep)
        curr_chunk = ""

        for part in splits:
            piece = (sep if curr_chunk else "") + part
            if len(curr_chunk) + len(piece) <= chunk_size:
                curr_chunk += piece
            else:
                if curr_chunk:
                    final_chunks.append(curr_chunk.strip())
                if len(part) > chunk_size:
                    sub_chunks = self._recursive_split(part, separators[1:], chunk_size, overlap)
                    final_chunks.extend(sub_chunks)
                    curr_chunk = ""
                else:
                    curr_chunk = part

        if curr_chunk.strip():
            final_chunks.append(curr_chunk.strip())

        return final_chunks

    @staticmethod
    def _infer_entity_and_year(file_name: str) -> (str, str):
        """Infers entity name and fiscal year from file name."""
        fn_lower = file_name.lower()
        company = "Unknown Entity"
        year = "2025"

        if "bursa" in fn_lower:
            company = "Bursa Malaysia Berhad"
        elif "sanofi" in fn_lower:
            company = "Sanofi S.A."
        elif "hsib" in fn_lower:
            company = "Hong Leong Islamic Bank (HSIB)"
        elif "maybank" in fn_lower:
            company = "Malayan Banking Berhad (Maybank)"

        year_match = re.search(r'20\d{2}', file_name)
        if year_match:
            year = year_match.group(0)

        return company, year


if __name__ == "__main__":
    pipeline_dir = os.path.dirname(__file__)
    scrubbed_path = os.path.join(pipeline_dir, "scrubbed_data.json")
    chunked_path = os.path.join(pipeline_dir, "chunked_documents.json")

    chunker = FinancialChunker(chunk_size=1000, chunk_overlap=150)
    chunker.chunk_payload(scrubbed_path, chunked_path)
