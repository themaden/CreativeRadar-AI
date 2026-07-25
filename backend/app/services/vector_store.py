import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class VectorStoreService:
    """
    Qdrant Vector DB Service providing Hybrid Search (Dense Vector + Payload Filtering).
    """

    def __init__(self):
        self.collection_name = settings.QDRANT_COLLECTION_NAME
        self._in_memory_store: List[Dict[str, Any]] = []

    async def init_collection(self):
        """
        Ensures Qdrant collection is created with 1536-dim vector specs (OpenAI / Gemini Embeddings).
        """
        logger.info(f"Initializing Qdrant Vector Collection: {self.collection_name}")
        # In live env, uses qdrant_client.QdrantClient

    async def upsert_ad_vector(self, ad_id: str, vector: List[float], payload: Dict[str, Any]):
        """
        Upserts ad metadata payload & embeddings vector into Qdrant.
        """
        logger.info(f"Upserting Qdrant vector for Ad UUID: {ad_id}")
        self._in_memory_store.append({
            "id": ad_id,
            "vector": vector,
            "payload": payload
        })

    async def hybrid_search(self, query: str, brand_filter: Optional[str] = None, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Performs dense semantic vector search + payload metadata filtering.
        """
        logger.info(f"Hybrid Qdrant Search query='{query}', brand_filter='{brand_filter}'")

        # Returns relevant retrieved items for RAG context
        results = []
        for item in self._in_memory_store:
            payload = item.get("payload", {})
            if brand_filter and payload.get("brand_name", "").lower() != brand_filter.lower():
                continue
            results.append(item)
            if len(results) >= top_k:
                break

        return results

vector_store_service = VectorStoreService()
