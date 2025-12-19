import json
import os
from typing import List, Dict
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from app.core.config import settings

class SimpleVectorStore:
    """Simple in-memory vector storage (no ChromaDB needed)"""
    
    def __init__(self, session_id: int):
        self.session_id = session_id
        self.data_file = os.path.join(settings.CHROMA_PERSIST_DIR, f"session_{session_id}.json")
        self.vectors = []
        self.documents = []
        self.metadatas = []
        self.ids = []
        self._load()
    
    def _load(self):
        """Load from file if exists"""
        os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.vectors = data.get('vectors', [])
                    self.documents = data.get('documents', [])
                    self.metadatas = data.get('metadatas', [])
                    self.ids = data.get('ids', [])
            except Exception as e:
                print(f"⚠️ Error loading data: {e}")
    
    def _save(self):
        """Save to file"""
        try:
            with open(self.data_file, 'w', encoding='utf-8') as f:
                json.dump({
                    'vectors': self.vectors,
                    'documents': self.documents,
                    'metadatas': self.metadatas,
                    'ids': self.ids
                }, f)
        except Exception as e:
            print(f"⚠️ Error saving data: {e}")
    
    def add(self, documents: List[str], embeddings: List[List[float]], 
            metadatas: List[Dict], ids: List[str]):
        """Add vectors"""
        self.documents.extend(documents)
        self.vectors.extend(embeddings)
        self.metadatas.extend(metadatas)
        self.ids.extend(ids)
        self._save()
        print(f"✅ Added {len(documents)} vectors to session {self.session_id}")
    
    def query(self, query_embeddings: List[List[float]], n_results: int = 3):
        """Search similar vectors using cosine similarity"""
        if not self.vectors:
            print(f"⚠️ No vectors in session {self.session_id}")
            return {"documents": [[]], "metadatas": [[]]}
        
        try:
            # Calculate cosine similarity
            query_vec = np.array(query_embeddings)
            db_vecs = np.array(self.vectors)
            
            similarities = cosine_similarity(query_vec, db_vecs)[0]
            
            # Get top N results
            top_indices = np.argsort(similarities)[-n_results:][::-1]
            
            results_docs = [self.documents[i] for i in top_indices if i < len(self.documents)]
            results_meta = [self.metadatas[i] for i in top_indices if i < len(self.metadatas)]
            
            print(f"🔍 Found {len(results_docs)} similar results")
            
            return {
                "documents": [results_docs],
                "metadatas": [results_meta]
            }
        except Exception as e:
            print(f"❌ Search error: {e}")
            return {"documents": [[]], "metadatas": [[]]}


class VectorService:
    """Vector service using simple file-based storage"""
    
    def __init__(self):
        self.stores = {}
        print("✅ VectorService initialized (Simple mode - no ChromaDB)")
    
    def get_or_create_collection(self, session_id: int):
        """Get or create collection for a chat session"""
        if session_id not in self.stores:
            self.stores[session_id] = SimpleVectorStore(session_id)
            print(f"📦 Created vector store for session {session_id}")
        return self.stores[session_id]
    
    def add_embedding(
        self, 
        session_id: int,
        text: str,
        embedding: List[float],
        metadata: Dict,
        doc_id: str
    ):
        """Store embedding in file-based storage"""
        collection = self.get_or_create_collection(session_id)
        collection.add(
            documents=[text],
            embeddings=[embedding],
            metadatas=[metadata],
            ids=[doc_id]
        )
    
    def search_similar(
        self, 
        session_id: int,
        query_embedding: List[float],
        top_k: int = 3
    ) -> Dict:
        """Search for similar embeddings (semantic search)"""
        try:
            collection = self.get_or_create_collection(session_id)
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            return results
        except Exception as e:
            print(f"⚠️ Search error: {e}")
            return {"documents": [[]], "metadatas": [[]]}

# Global instance
vector_service = VectorService()