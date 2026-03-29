from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.tts import router as tts_router
from app.routers.chat import router as chat_router

app = FastAPI(title="Hatsune Miku")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://haxellg.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tts_router)
app.include_router(chat_router)

@app.get("/health")
def health():
    return {"ok": True}
