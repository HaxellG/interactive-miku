<div align="center">
  <img src="frontend/public/miku-logo.png" alt="Miku Logo" width="120" />
  <h1>✨ Interactive Hatsune Miku ✨</h1>
  <p><b>A futuristic Sci-Fi HUD web application featuring a fully interactive Live2D Hatsune Miku powered by AI.</b></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
  [![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white)](https://openai.com/)
</div>

<br />

## 🌟 Overview
**Interactive Miku** is a robust full-stack project that brings the world's most famous virtual idol to life. It combines a **React/Vite** frontend utilizing **PixiJS** for Live2D rendering, with a **FastAPI** backend driven by **LangChain** and **OpenAI's GPT-4o-mini** to grant Miku autonomous personality, emotion-based physical reactions, and TTS via ElevenLabs API.

## 🚀 Key Features
* **Sci-Fi HUD UI**: A completely custom, responsive, and glassmorphic user interface with typing indicators, laser trails, and toast popups.
* **Live2D Integration**: Smooth, hardware-accelerated rendering of Miku with dynamic mouth-syncing (LipSync) tied directly to generated audio.
* **AI Personality Engine**: LangGraph and GPT-4 model simulating a warm, sweet-kawaii idol persona that reacts to messages with corresponding Live2D animations (shy, mad, surprised).
* **Multilingual Voices**: Powered by ElevenLabs TTS, generating instantaneous, natural-sounding voice responses.
* **Spotify Integration**: Miku can dynamically search for her own tracks, fetch follower counts, and retrieve album metadata directly using Spotify's API.

## 🛠️ Tech Stack
### **Frontend**
- **React 18** + **Vite** + **TypeScript**
- **Vanilla CSS** (Custom Sci-Fi Geometry & Glassmorphism)
- **PixiJS** & **pixi-live2d-display**

### **Backend**
- **Python 3.11** + **FastAPI**
- **LangChain** + **LangGraph**
- **OpenAI API** + **ElevenLabs API** + **Spotify API**

## 🌐 Deployments
* **Frontend**: Hosted on [GitHub Pages](https://haxellg.github.io/interactive-miku/)
* **Backend**: Hosted on [Render](https://render.com)

## 📜 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details. 

<div align="center">
  <sub><i>Made with ❤️ by <b>HaxellG</b></i></sub>
</div>
