"""Image generation via OpenAI GPT-image-1 / DALL-E."""

import httpx


class ImageGenerator:
    """Generates images using OpenAI's image generation API."""

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def generate(self, prompt: str, size: str = "1024x1024",
                       quality: str = "standard") -> dict:
        """Generate an image from a text prompt."""
        if not self.api_key:
            return {"error": "OPENAI_API_KEY not configured", "url": None}

        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    "https://api.openai.com/v1/images/generations",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "gpt-image-1",
                        "prompt": prompt,
                        "n": 1,
                        "size": size,
                        "quality": quality,
                    },
                    timeout=120,
                )
                resp.raise_for_status()
                data = resp.json()

            image_url = data["data"][0].get("url", "")
            return {
                "prompt": prompt,
                "url": image_url,
                "size": size,
                "quality": quality,
                "model": "gpt-image-1",
            }
        except Exception as exc:
            return {"error": str(exc), "prompt": prompt, "url": None}
