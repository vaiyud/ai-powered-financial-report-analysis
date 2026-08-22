"""
FinSight AI - Stage 2.4 Vector Store Indexing Engine
Module: faiss_indexer.py
"""

import sys
import os
import json
import numpy as np
import scipy.sparse as sp
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer

# Ensure UTF-8 output encoding for Windows terminal
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Check for FAISS availability
FAISS_AVAILABLE = False
try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    pass


class FinancialVectorStore:
    """High-performance vector store and hybrid retriever with metadata filtering."""

    def __init__(self, index_dir: str):
        self.index_dir = index_dir
        os.makedirs(self.index_dir, exist_ok=True)
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.matrix_sparse: Optional[sp.csr_matrix] = None
        self.chunks_metadata: List[Dict[str, Any]] = []
        self.faiss_index = None

    def build_index(self, chunked_json_path: str) -> int:
        """Builds vector index from chunked documents payload and persists to index_dir."""
        if not os.path.exists(chunked_json_path):
            raise FileNotFoundError(f"Chunked payload not found: {chunked_json_path}")

        print("==================================================", flush=True)
        print("FinSight AI - Stage 2.4 Vector Store Indexing Engine", flush=True)
        print(f"Loading chunked payload from: {chunked_json_path}", flush=True)
        print("==================================================", flush=True)

        with open(chunked_json_path, "r", encoding="utf-8") as f:
            chunks = json.load(f)

        print(f"Vectorizing {len(chunks)} text chunks with TF-IDF...", flush=True)

        texts = [c["text"] for c in chunks]
        self.chunks_metadata = chunks

        # Fit TF-IDF matrix representation
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 1),
            sublinear_tf=True,
            stop_words='english'
        )

        self.matrix_sparse = self.vectorizer.fit_transform(texts)

        # Normalize L2 sparse matrix
        from sklearn.preprocessing import normalize
        self.matrix_sparse = normalize(self.matrix_sparse, norm='l2', axis=1)

        if FAISS_AVAILABLE:
            print("FAISS library detected. Initializing FAISS IndexFlatIP...", flush=True)
            matrix_dense = self.matrix_sparse.toarray().astype(np.float32)
            dim = matrix_dense.shape[1]
            self.faiss_index = faiss.IndexFlatIP(dim)
            self.faiss_index.add(matrix_dense)

            faiss_file = os.path.join(self.index_dir, "index.faiss")
            faiss.write_index(self.faiss_index, faiss_file)
            print(f"Saved FAISS index to: {faiss_file}", flush=True)
        else:
            print("Using high-performance sparse matrix vector engine...", flush=True)
            matrix_file = os.path.join(self.index_dir, "matrix_sparse.npz")
            sp.save_npz(matrix_file, self.matrix_sparse)
            print(f"Saved Sparse Vector matrix to: {matrix_file}", flush=True)

        # Save metadata and vectorizer params
        meta_file = os.path.join(self.index_dir, "chunks_metadata.json")
        with open(meta_file, "w", encoding="utf-8") as f:
            json.dump(chunks, f, ensure_ascii=False)

        import pickle
        vec_file = os.path.join(self.index_dir, "vectorizer.pkl")
        with open(vec_file, "wb") as f:
            pickle.dump(self.vectorizer, f)

        print("\n==================================================", flush=True)
        print("[SUCCESS] Stage 2.4 Vector Store Indexing Complete!", flush=True)
        print(f"Index Location:  {self.index_dir}", flush=True)
        print(f"Indexed Chunks:  {len(chunks)}", flush=True)
        print("==================================================", flush=True)

        return len(chunks)

    def load_index(self):
        """Loads index, vectorizer, and metadata into memory for fast retrieval."""
        import pickle

        meta_file = os.path.join(self.index_dir, "chunks_metadata.json")
        vec_file = os.path.join(self.index_dir, "vectorizer.pkl")

        if not os.path.exists(meta_file) or not os.path.exists(vec_file):
            raise FileNotFoundError(f"Index files missing in {self.index_dir}")

        with open(meta_file, "r", encoding="utf-8") as f:
            self.chunks_metadata = json.load(f)

        with open(vec_file, "rb") as f:
            self.vectorizer = pickle.load(f)

        faiss_file = os.path.join(self.index_dir, "index.faiss")
        matrix_file = os.path.join(self.index_dir, "matrix_sparse.npz")

        if FAISS_AVAILABLE and os.path.exists(faiss_file):
            self.faiss_index = faiss.read_index(faiss_file)
        elif os.path.exists(matrix_file):
            self.matrix_sparse = sp.load_npz(matrix_file)

    def search(self, query: str, top_k: int = 5, filter_metadata: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Searches vector index with hybrid cosine similarity and metadata filters."""
        if self.vectorizer is None:
            self.load_index()

        q_vec = self.vectorizer.transform([query])
        from sklearn.preprocessing import normalize
        q_vec = normalize(q_vec, norm='l2', axis=1)

        if self.faiss_index is not None:
            q_dense = q_vec.toarray().astype(np.float32)
            scores, indices = self.faiss_index.search(q_dense, min(top_k * 10, len(self.chunks_metadata)))
            raw_scores = scores[0]
            raw_indices = indices[0]
        else:
            sims = self.matrix_sparse.dot(q_vec.T).toarray().ravel()
            raw_indices = np.argsort(sims)[::-1][:top_k * 10]
            raw_scores = sims[raw_indices]

        filtered_results = []
        for idx, score in zip(raw_indices, raw_scores):
            if score <= 0.0 and len(filtered_results) >= 1:
                break

            chunk = self.chunks_metadata[idx]
            meta = chunk["metadata"]

            match = True
            if filter_metadata:
                for k, v in filter_metadata.items():
                    if str(meta.get(k, "")).lower() != str(v).lower():
                        match = False
                        break

            if match:
                filtered_results.append({
                    "rank": len(filtered_results) + 1,
                    "score": float(round(score, 4)),
                    "chunk_id": chunk["chunk_id"],
                    "text": chunk["text"],
                    "metadata": meta
                })
                if len(filtered_results) >= top_k:
                    break

        return filtered_results


if __name__ == "__main__":
    pipeline_dir = os.path.dirname(__file__)
    chunked_path = os.path.join(pipeline_dir, "chunked_documents.json")
    index_dir = r"c:\Hackathon\faiss_index"

    vstore = FinancialVectorStore(index_dir)
    vstore.build_index(chunked_path)

    query = "Operating income net sales revenue financial statements"
    print(f"\n[Test Search] Query: '{query}'")
    results = vstore.search(query, top_k=3)
    for r in results:
        print(f"  Rank {r['rank']} (Score: {r['score']}) - {r['chunk_id']}")
        print(f"  Source: {r['metadata']['source_file']} ({r['metadata']['unit_type']} {r['metadata']['unit_id']})")
        print(f"  Snippet: {r['text'][:120]}...\n")
