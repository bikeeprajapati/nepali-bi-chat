import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel

from data_functions import load_sales_data_from_buffer
from main_pipeline import answer_question
from session_store import create_session, get_session, session_exists

app = FastAPI(title="Nepali Business Intelligence Chat API")


class ChatRequest(BaseModel):
    session_id: str
    question: str


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Nepali BI Chat API is running"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
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
async def chat(request: ChatRequest):
    if not session_exists(request.session_id):
        raise HTTPException(status_code=404, detail="Session not found. Please upload a file first.")

    df = get_session(request.session_id)
    result = answer_question(request.question, df)

    if "error" in result:
        raise HTTPException(status_code=422, detail=result["error"])

    return result
