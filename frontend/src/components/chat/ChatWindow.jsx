import React, { useState, useRef, useEffect } from "react";
import { Phone, Video, Search, MoreVertical } from "lucide-react";
import Avatar from "../common/Avatar";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { sendChatMessage, uploadFile } from "../../api/client";
import { useSession } from "../../context/SessionContext";

function formatTime() {
    return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function ChatWindow({ onMessagesChange }) {
    const { sessionId, fileName, startSession } = useSession();
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "नमस्ते! तपाईंको बिक्री डाटा अपलोड गर्नुहोस्, त्यसपछि नेपालीमा प्रश्न सोध्न सक्नुहुन्छ।",
            time: formatTime(),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        if (onMessagesChange) {
            const last = messages[messages.length - 1];
            onMessagesChange(last?.text?.slice(0, 40));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    const handleFilePick = async (file) => {
        setLoading(true);
        try {
            const data = await uploadFile(file);
            startSession(data.session_id, file.name, data.rows_loaded);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: `${file.name} लोड भयो (${data.rows_loaded} पङ्क्ति)। अब प्रश्न सोध्नुहोस्।`,
                    time: formatTime(),
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: "फाइल अपलोड गर्न सकिएन, फेरि प्रयास गर्नुहोस्।", time: formatTime() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        const question = input.trim();
        if (!question || loading) return;

        if (!sessionId) {
            setMessages((prev) => [
                ...prev,
                { role: "user", text: question, time: formatTime() },
                { role: "assistant", text: "पहिले क्लिप आइकनबाट फाइल अपलोड गर्नुहोस्।", time: formatTime() },
            ]);
            setInput("");
            return;
        }

        setMessages((prev) => [...prev, { role: "user", text: question, time: formatTime() }]);
        setInput("");
        setLoading(true);

        try {
            const data = await sendChatMessage(sessionId, question);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: data.answer,
                    time: formatTime(),
                    rawData: data.raw_data,
                    functionUsed: data.function_used,
                },
            ]);
        } catch (err) {
            const detail = err.response?.data?.detail || "जवाफ दिन सकिएन, फेरि प्रयास गर्नुहोस्।";
            setMessages((prev) => [...prev, { role: "assistant", text: detail, time: formatTime() }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ minWidth: 0, background: "#fff", display: "flex", flexDirection: "column", flex: 1 }}>
            <header
                style={{
                    background: "#fff",
                    borderBottom: "1px solid var(--neutral-200)",
                    display: "flex",
                    padding: "0 32px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "76px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <Avatar label="AI" size={44} />
                    <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: "16px" }}>नेपाली BI सहायक</p>
                        <p style={{ margin: 0, color: "var(--neutral-500)", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-teal)" }} />
                            {fileName ? `${fileName} विश्लेषण गरिँदै` : "फाइलको प्रतीक्षामा"}
                        </p>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--neutral-900)" }}>
                    {[Phone, Video, Search, MoreVertical].map((Icon, i) => (
                        <button
                            key={i}
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                border: "none",
                                background: "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                        >
                            <Icon size={16} />
                        </button>
                    ))}
                </div>
            </header>

            <div style={{ background: "rgba(250,250,250,0.4)", display: "flex", padding: "32px", flexDirection: "column", flex: 1, gap: "16px", overflowY: "auto" }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                        <MessageBubble {...msg} />
                    </div>
                ))}
                {loading && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Avatar label="AI" size={32} />
                        <div style={{ borderRadius: "18px 18px 18px 4px", background: "#fff", border: "1px solid var(--neutral-200)", padding: "12px 16px" }}>
                            <span style={{ color: "var(--neutral-500)", fontSize: "13px" }}>सोच्दैछ...</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <MessageInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
                onFilePick={handleFilePick}
                disabled={loading}
            />
        </main>
    );
}

export default ChatWindow;