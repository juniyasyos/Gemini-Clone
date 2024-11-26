from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List, Optional
import os
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(
    title="Gemini AI Chat API",
    description="API ini digunakan untuk berinteraksi dengan model Gemini AI secara aman.",
    version="1.0.0",
)

api_key = os.getenv("GEMINI_TOKEN_API_KEY")
if not api_key:
    raise ValueError("GEMINI_TOKEN_API_KEY is not set")

genai.configure(api_key=api_key)

AUTHORIZED_KEYS =os.getenv("AUTH_PASSWORD")
if not AUTHORIZED_KEYS:
    raise ValueError("AUTH_PASSWORD is not set")

def authenticate(api_key: str = Header(...)):
    if api_key not in AUTHORIZED_KEYS:
        raise HTTPException(status_code=403, detail="Unauthorized: Invalid API Key")
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HistoryItem(BaseModel):
    role: str = "user"
    content: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[HistoryItem]] = []

class ChatResponse(BaseModel):
    message: str
    history: List[HistoryItem]

@app.post("/gemini", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """
    Endpoint untuk berinteraksi dengan model Gemini AI.
    """
    try:
        formatted_history = []
        for item in request.history:
            formatted_history.append({
                "role": item.role,
                "parts": [{"text": item.content}] if item.content else []
            })

        model = genai.GenerativeModel("gemini-1.5-flash")

        chat = model.start_chat(history=formatted_history)

        result = chat.send_message(request.message)
        response_text = result.text

        updated_history = request.history + [
            HistoryItem(role="user", content=request.message),
            HistoryItem(role="model", content=response_text),
        ]

        return ChatResponse(message=response_text, history=updated_history)

    except Exception as e:
        # Log kesalahan untuk debugging
        print(f"Error during AI generation: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")
