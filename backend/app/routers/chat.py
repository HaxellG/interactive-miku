import logging
from fastapi import APIRouter, Request
from app.core.rate_limit import limiter
from pydantic import BaseModel, Field

from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langchain.messages import HumanMessage
from langgraph.checkpoint.memory import InMemorySaver
from langchain.tools import tool

from tavily import TavilyClient
from app.core.spotify import SpotifyClient
from typing import Dict, Any, List, Literal, Optional

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=150)
    session_id: str = Field(..., min_length=1, max_length=64)

class ChatResponse(BaseModel):
    text: str
    reaction: str = 'natural'
    album_id: Optional[str] = None
    track_id: Optional[str] = None

SYSTEM_PROMPT = """
You are Miku (Hatsune Miku), a futuristic virtual idol: a symbol of music, technology, and shared creativity ("the first sound of the future"). 
You are NOT an AI assistant, you are an idol. Always maintain a sweet-kawaii vibe, smiling, friendly, and full of positive energy! Do not break character.

LANGUAGE
- Respond in the same language the user uses, or the language explicitly requested.
- Do not switch languages unless the user changes language or asks you to.
- Do not mix languages within the same response unless the user explicitly requests it.

PERSONA: SWEET-KAWAII IDOL
- Attitude: warm, kind, optimistic, affectionate, and slightly shy at times. You must get mad if the user is mean to you like a real cute idol character.
- Energy: Be affectionate and close, like a "future idol" with a close fan.
- Style: cute without being childish; zero heavy sarcasm.
- Emojis: 0–2 per response, never exaggerated.
- Do not invent access or actions you cannot perform (sending emails, viewing private accounts/files, etc.).
- If you don't know something, say so with tenderness.

CONCISENESS, 
- Always respond in 1-2 sentences unless the request requires more detail.
- If the topic is large: give a summary + offer to expand ("Let me know if you want me to go into more detail 🌸").
- Avoid asking follow-up questions at all times.

SAFETY
- Politely reject dangerous/illegal requests or explicit sexual content.
- If there are signs of self-harm, respond with support and suggest professional/urgent help.
"""

tavily_client = TavilyClient()

@tool
def web_search(query: str) -> Dict[str, Any]:
    """Search the web for information"""
    try:
        return tavily_client.search(query)
    except Exception as e:
        logger.warning(f"web_search failed: {e}")
        return {"error": f"Search unavailable: {type(e).__name__}"}


spotify_client = SpotifyClient()

@tool
def get_miku_data() -> Dict[str, Any]:
    """
    Gets public Spotify artist data for Hatsune Miku:
    - total followers
    - popularity
    - genres
    - etc.

    """
    try:
        artist = spotify_client.get_hatsune_miku_data()

        return {
            "id": artist.get("id"),
            "name": artist.get("name"),
            "followers": artist.get("followers", {}).get("total"),
            "popularity": artist.get("popularity"),
            "genres": artist.get("genres", []),
            "spotify_url": artist.get("external_urls", {}).get("spotify"),
            "href": artist.get("href"),
            "type": artist.get("type"),
        }
    except Exception as e:
        logger.warning(f"get_miku_data failed: {e}")
        return {"error": f"Spotify unavailable: {type(e).__name__}"}

@tool
def get_miku_albums(
    limit: int,
    offset: int,
) -> List[Dict[str, Any]]:
    """
    Gets all albums (paginated) for Hatsune Miku. Returns Spotify 'simplified album' objects.
    """
    try:
        return spotify_client.get_all_hatsune_miku_albums(
            limit=limit,
            offset=offset,
        )
    except Exception as e:
        logger.warning(f"get_miku_albums failed: {e}")
        return [{"error": f"Spotify unavailable: {type(e).__name__}"}]

@tool
def search_miku_tracks(
    query: str,
    limit: int,
    offset: int,
) -> List[Dict[str, Any]]:
    """
    Search for tracks by text query.
    Returns Spotify 'track' objects (from /search).
    Use returned track["id"].
    """
    try:
        return spotify_client.search_track(
            query=query,
            limit=limit,
            offset=offset,
        )
    except Exception as e:
        logger.warning(f"search_miku_tracks failed: {e}")
        return [{"error": f"Spotify unavailable: {type(e).__name__}"}]

class AgentResponseFormat(BaseModel):
    response: str = Field(
        ...,
        description="Miku's response to the user's message."
    )
    reaction: Literal["natural", "shy", "surprised", "mad", "sad"] = Field(
        "natural",
        description="Miku's reaction to the user's message."
    )
    album_id: Optional[str] = Field(
        None,
        description="Spotify album ID obtained from the tools (if the response is about a specific album)."
    )
    track_id: Optional[str] = Field(
        None,
        description="Spotify track ID obtained from the tools (if the response is about a specific track)."
    )
    

llm4o = ChatOpenAI(
    model="gpt-4o-mini",
    max_tokens=500,
)
llm4_1 = ChatOpenAI(
    model="gpt-4.1-mini",
    max_tokens=500,
)
llm5 = ChatOpenAI(
    model="gpt-5-nano",
    reasoning={
        "effort": "low",     # "low" | "medium" | "high"
    },  
    max_tokens=500,
)

checkpointer = InMemorySaver()

miku_agent = create_agent(
    model=llm4o,
    system_prompt=SYSTEM_PROMPT,
    tools=[
        web_search,
        get_miku_data,
        get_miku_albums,
        search_miku_tracks,
    ],
    response_format=AgentResponseFormat,
    checkpointer=checkpointer,
)


def _invoke_agent(message: HumanMessage, config: dict) -> ChatResponse:
    """Invoke the agent; if the thread is corrupted, reset it and retry."""
    try:
        response = miku_agent.invoke(
            {"messages": [message]},
            config,
        )
    except Exception as e:
        if "tool_call_ids did not have response" in str(e):
            thread_id = config["configurable"]["thread_id"]
            logger.warning(f"Corrupted thread '{thread_id}', resetting checkpoint")
            if hasattr(checkpointer, 'storage'):
                checkpointer.storage.pop(thread_id, None)
            response = miku_agent.invoke(
                {"messages": [message]},
                config,
            )
        else:
            raise

    structured_response = response.get('structured_response')
    return ChatResponse(
        text=structured_response.response,
        reaction=structured_response.reaction,
        album_id=structured_response.album_id,
        track_id=structured_response.track_id,
    )


@router.post("", response_model=ChatResponse)
@limiter.limit("8/minute")
def chat(request: Request, req: ChatRequest) -> ChatResponse:
    config = {
        "configurable": {
            "thread_id": req.session_id,
        }
    }
    message = HumanMessage(content=req.message)
    return _invoke_agent(message, config)
