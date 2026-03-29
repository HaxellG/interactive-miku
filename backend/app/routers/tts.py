from typing import Optional, Dict, Any, AsyncIterator
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from app.core.rate_limit import limiter
from pydantic import BaseModel, Field
import httpx

from app.core.config import settings

router = APIRouter(prefix="/tts", tags=["tts"])

ELEVEN_BASE = "https://api.elevenlabs.io/v1"

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=40000)
    model_id: Optional[str] = None
    output_format: Optional[str] = None  # e.g. "mp3_22050_32" :contentReference[oaicite:5]{index=5}
    voice_settings: Optional[Dict[str, Any]] = None

def _headers() -> dict:
    return {
        "xi-api-key": settings.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    }

def _payload(req: TTSRequest) -> dict:
    payload = {
        "text": req.text,
        "model_id": req.model_id or settings.ELEVENLABS_MODEL_ID,  # por defecto multilingual :contentReference[oaicite:7]{index=7}
    }

    # output_format es opcional (en docs/ejemplos del SDK lo usan) :contentReference[oaicite:8]{index=8}
    if req.output_format:
        payload["output_format"] = req.output_format

    # voice_settings opcional (stability, similarity_boost, style, etc.) :contentReference[oaicite:9]{index=9}
    if req.voice_settings:
        payload["voice_settings"] = req.voice_settings

    return payload

@router.post("", response_class=StreamingResponse)
@limiter.limit("8/minute")
async def tts(request: Request, req: TTSRequest):
    """
    Devuelve un MP3 completo (no streaming).
    """
    voice_id = settings.ELEVENLABS_VOICE_ID
    url = f"{ELEVEN_BASE}/text-to-speech/{voice_id}"

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(url, headers=_headers(), json=_payload(req))
            if r.status_code >= 400:
                raise HTTPException(status_code=r.status_code, detail=r.text)
            audio_bytes = r.content
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"ElevenLabs request failed: {str(e)}")

    return StreamingResponse(iter([audio_bytes]), media_type="audio/mpeg")


async def _stream_bytes(url: str, payload: dict) -> AsyncIterator[bytes]:
    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("POST", url, headers=_headers(), json=payload) as r:
            if r.status_code >= 400:
                # leemos el body de error
                err = await r.aread()
                raise HTTPException(status_code=r.status_code, detail=err.decode("utf-8", errors="ignore"))
            async for chunk in r.aiter_bytes():
                if chunk:
                    yield chunk

@router.post("/stream", response_class=StreamingResponse)
@limiter.limit("8/minute")
async def tts_stream(request: Request, req: TTSRequest):
    """
    Devuelve audio en streaming (chunked transfer encoding). :contentReference[oaicite:10]{index=10}
    """
    voice_id = settings.ELEVENLABS_VOICE_ID
    url = f"{ELEVEN_BASE}/text-to-speech/{voice_id}/stream"

    return StreamingResponse(
        _stream_bytes(url, _payload(req)),
        media_type="audio/mpeg",
    )
