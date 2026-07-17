import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

export async function sendChatMessage(sessionId, question) {
    const response = await axios.post(`${API_BASE}/chat`, {
        session_id: sessionId,
        question: question,
    });
    return response.data;
}