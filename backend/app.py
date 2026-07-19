import io
from datetime import datetime

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr

from data_functions import load_sales_data_from_buffer
from main_pipeline import answer_question
from session_store import create_session, get_session, session_exists
from auth import hash_password, verify_password, create_access_token, get_current_user
from db import users_collection

app = FastAPI(title="Nepali Business Intelligence Chat API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    session_id: str
    question: str


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Nepali BI Chat API is running"}


# ---------- Auth routes ----------

@app.post("/auth/signup")
async def signup(request: SignupRequest):
    existing = users_collection.find_one({"email": request.email})
    if existing:
        raise HTTPException(status_code=400, detail="यो इमेल पहिले नै दर्ता भइसकेको छ")

    hashed = hash_password(request.password)
    users_collection.insert_one({
        "email": request.email,
        "password": hashed,
        "name": request.name,
        "created_at": datetime.utcnow(),
    })

    token = create_access_token({"sub": request.email})
    return {"access_token": token, "token_type": "bearer", "name": request.name}


@app.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="गलत इमेल वा पासवर्ड")

    token = create_access_token({"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer", "name": user["name"]}


@app.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    user = users_collection.find_one({"email": current_user["email"]})
    return {"email": user["email"], "name": user["name"]}


# ---------- Data / chat routes (protected) ----------

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    if not file.filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Only .csv, .xlsx, .xls files are supported")

    try:
        contents = await file.read()
        buffer = io.BytesIO(contents)
        df = load_sales_data_from_buffer(buffer, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")

    session_id = create_session(df)
    return {"session_id": session_id, "rows_loaded": len(df)}


@app.post("/chat")
async def chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user),
):
    if not session_exists(request.session_id):
        raise HTTPException(status_code=404, detail="Session not found. Please upload a file first.")

    df = get_session(request.session_id)
    result = answer_question(request.question, df)

    if "error" in result:
        raise HTTPException(status_code=422, detail=result["error"])

    return result