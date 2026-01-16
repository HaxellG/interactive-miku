import os
import time
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple
import requests

from dotenv import load_dotenv

load_dotenv()

SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE = "https://api.spotify.com/v1"
SPOTIFY_MIKU_ID = "6pNgnvzBa6Bthsv8SrZJYl"


class SpotifyAuthError(RuntimeError):
    pass


class SpotifyAPIError(RuntimeError):
    pass


@dataclass
class TokenState:
    access_token: str
    expires_at: float  # epoch seconds


class SpotifyClient:
    """
    Spotify client using Client Credentials flow.
    - Keeps token in-memory.
    - Refreshes token proactively by expiry time.
    - Uses a requests.Session for connection pooling.
    """
    def __init__(
        self,
        timeout: Tuple[float, float] = (3.05, 15.0),  # (connect, read)
    ) -> None:
        self.client_id = os.getenv("SPOTIFY_CLIENT_ID")
        self.client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
        if not self.client_id or not self.client_secret:
            raise SpotifyAuthError(
                "Missing env vars. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET."
            )

        self.timeout = timeout
        self.session = requests.Session()
        self._token: Optional[TokenState] = None

    def _fetch_token(self) -> TokenState:
        # Client Credentials flow
        resp = self.session.post(
            SPOTIFY_TOKEN_URL,
            data={"grant_type": "client_credentials"},
            auth=(self.client_id, self.client_secret),
            timeout=self.timeout,
        )

        if resp.status_code != 200:
            raise SpotifyAuthError(
                f"Token request failed: {resp.status_code} {resp.text}"
            )

        payload = resp.json()
        token = payload["access_token"]
        expires_in = int(payload.get("expires_in", 3600))

        # Refresh a bit early (skew) to avoid edge-of-expiry failures
        skew_seconds = 30
        expires_at = time.time() + max(0, expires_in - skew_seconds)
        return TokenState(access_token=token, expires_at=expires_at)

    def _ensure_token(self) -> str:
        if self._token is None or time.time() >= self._token.expires_at:
            self._token = self._fetch_token()
        return self._token.access_token

    def _request(
        self,
        method: str,
        path: str,
        *,
        params: Optional[Dict[str, Any]] = None,
        max_retries_401: int = 1,
    ) -> Dict[str, Any]:
        """
        Makes an authenticated request. If token is expired/invalid, refresh and retry once.
        Also handles 429 with a single respect to Retry-After (optional).
        """
        url = f"{SPOTIFY_API_BASE}{path}"

        for attempt in range(max_retries_401 + 1):
            token = self._ensure_token()
            headers = {"Authorization": f"Bearer {token}"}

            resp = self.session.request(
                method,
                url,
                headers=headers,
                params=params,
                timeout=self.timeout,
            )

            # Token invalid/expired: refresh and retry
            if resp.status_code == 401 and attempt < max_retries_401:
                self._token = self._fetch_token()
                continue

            # Rate limit
            if resp.status_code == 429:
                retry_after = resp.headers.get("Retry-After")
                if retry_after is not None:
                    try:
                        time.sleep(float(retry_after))
                    except ValueError:
                        pass
                # Try once more after waiting
                token = self._ensure_token()
                headers = {"Authorization": f"Bearer {token}"}
                resp = self.session.request(
                    method, url, headers=headers, params=params, timeout=self.timeout
                )

            if 200 <= resp.status_code < 300:
                return resp.json()

            raise SpotifyAPIError(f"Spotify API error: {resp.status_code} {resp.text}")

        # Should never reach here due to raise in-loop
        raise SpotifyAPIError("Unexpected request loop exit")


    def get_hatsune_miku_data(self) -> Dict[str, Any]:
        return self._request("GET", f"/artists/{SPOTIFY_MIKU_ID}")

    def get_all_hatsune_miku_albums(
        self,
        *,
        include_groups: str = "album,single,compilation,appears_on",
        market: str = "US",
        limit: int = 50,
        offset: int = 0,
    ) -> List[Dict[str, Any]]:
        """
        Returns all album objects for an artist (paginated).
        """
        data = self._request(
            "GET",
            f"/artists/{SPOTIFY_MIKU_ID}/albums",
            params={
                "include_groups": include_groups,
                "market": market,
                "limit": limit,
                "offset": offset,
            },
        )
        return data.get("items", [])
    
    def search_track(
        self,
        query: str,
        *,
        market: str = "US",
        limit: int = 10,
        offset: int = 0,
    ) -> List[Dict[str, Any]]:
        """
        Search for tracks by text query.

        Notes:
        - Returns Spotify 'track' objects (from /search).
        - Use returned track["id"] to build a URI: f"spotify:track:{track['id']}" for embeds.
        """
        q = (query or "").strip()
        if not q:
            return []

        data = self._request(
            "GET",
            "/search",
            params={
                "q": q,
                "type": "track",
                "market": market,
                "limit": limit,
                "offset": offset,
            },
        )
        return data.get("tracks", {}).get("items", [])