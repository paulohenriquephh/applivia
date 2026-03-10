"""Qdrant-based vector memory for long-term storage and retrieval."""

import hashlib
import uuid
from datetime import datetime, timezone
from typing import Any, Optional

import structlog

logger = structlog.get_logger()


class LongTermMemory:
    """Stores and retrieves memories using Qdrant vector database."""

    def __init__(self, host: str, port: int, collection: str):
        self.host = host
        self.port = port
        self.collection = collection
        self._client = None
        self._initialized = False

    def _get_client(self):
        if self._client is None:
            try:
                from qdrant_client import QdrantClient
                self._client = QdrantClient(host=self.host, port=self.port, timeout=10)
            except Exception as exc:
                logger.error("qdrant_connection_failed", error=str(exc))
                return None
        return self._client

    def _ensure_collection(self):
        if self._initialized:
            return True
        client = self._get_client()
        if not client:
            return False
        try:
            from qdrant_client.models import Distance, VectorParams
            collections = [c.name for c in client.get_collections().collections]
            if self.collection not in collections:
                client.create_collection(
                    collection_name=self.collection,
                    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
                )
            self._initialized = True
            return True
        except Exception as exc:
            logger.error("qdrant_init_failed", error=str(exc))
            return False

    def _text_to_vector(self, text: str) -> list[float]:
        """Simple hash-based vector encoding (384-dim). [ASSUMED] Using hash-based encoding
        as a lightweight alternative to requiring a separate embedding model."""
        text_hash = hashlib.sha384(text.encode()).digest()
        vector = []
        for byte in text_hash:
            vector.append((byte - 128) / 128.0)
        while len(vector) < 384:
            ext_hash = hashlib.sha384((text + str(len(vector))).encode()).digest()
            for byte in ext_hash:
                vector.append((byte - 128) / 128.0)
                if len(vector) >= 384:
                    break
        return vector[:384]

    async def store(self, query: str, response: str, metadata: Optional[dict] = None) -> bool:
        """Store a memory (query-response pair) in Qdrant."""
        if not self._ensure_collection():
            return False
        client = self._get_client()
        if not client:
            return False

        try:
            from qdrant_client.models import PointStruct
            point_id = str(uuid.uuid4())
            vector = self._text_to_vector(query)
            payload = {
                "query": query[:1000],
                "response": response[:5000],
                "timestamp": datetime.now(timezone.utc).isoformat(),
                **(metadata or {}),
            }
            client.upsert(
                collection_name=self.collection,
                points=[PointStruct(id=point_id, vector=vector, payload=payload)],
            )
            return True
        except Exception as exc:
            logger.error("memory_store_failed", error=str(exc))
            return False

    async def search(self, query: str, limit: int = 5) -> list[dict[str, Any]]:
        """Search for relevant memories."""
        if not self._ensure_collection():
            return []
        client = self._get_client()
        if not client:
            return []

        try:
            vector = self._text_to_vector(query)
            results = client.search(
                collection_name=self.collection,
                query_vector=vector,
                limit=limit,
            )
            return [
                {
                    "query": hit.payload.get("query", ""),
                    "response": hit.payload.get("response", ""),
                    "score": hit.score,
                    "timestamp": hit.payload.get("timestamp", ""),
                }
                for hit in results
            ]
        except Exception as exc:
            logger.error("memory_search_failed", error=str(exc))
            return []
