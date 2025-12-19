# ============================================================================
# FILE: app/services/groq_service.py (UPDATED - No Groq Embeddings)
# ============================================================================
from groq import Groq
from app.core.config import settings
import time
from collections import deque
from typing import List
from sentence_transformers import SentenceTransformer

class GroqRateLimiter:
    """Free tier rate limiter: 30 requests/min, 14,400 tokens/day"""
    def __init__(self):
        self.requests = deque()
        self.MAX_PER_MINUTE = 30
        
    def wait_if_needed(self):
        now = time.time()
        # Remove requests older than 1 minute
        while self.requests and now - self.requests[0] > 60:
            self.requests.popleft()
        
        # If at limit, wait
        if len(self.requests) >= self.MAX_PER_MINUTE:
            sleep_time = 60 - (now - self.requests[0])
            print(f"⏳ Rate limit: waiting {sleep_time:.1f}s...")
            time.sleep(sleep_time)
        
        self.requests.append(now)


class GroqService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.limiter = GroqRateLimiter()
        
        # Load local embedding model (FREE - runs on your computer)
        print("📥 Loading local embedding model...")
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✅ Embedding model loaded (384 dimensions)")
    
    def create_embedding(self, text: str) -> List[float]:
        """Create embedding vector from text using LOCAL model (FREE)"""
        try:
            # Use local Sentence Transformers model
            embedding = self.embedding_model.encode(text[:8000])
            return embedding.tolist()
        except Exception as e:
            print(f"❌ Embedding error: {e}")
            raise
    
    def chat_completion(
        self, 
        messages: List[dict], 
        max_tokens: int = 500,
        temperature: float = 0.7
    ) -> str:
        """Generate AI response using Groq (FREE tier optimized)"""
        self.limiter.wait_if_needed()
        
        try:
            response = self.client.chat.completions.create(
                model=settings.GROQ_CHAT_MODEL,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"❌ Chat error: {e}")
            raise

# Global instance
groq_service = GroqService()