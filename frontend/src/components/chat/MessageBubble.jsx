import React from "react";
import { CheckCheck } from "lucide-react";
import Avatar from "../common/Avatar";
import DataCard from "./DataCard";

function MessageBubble({ role, text, time, rawData, functionUsed }) {
    const isUser = role === "user";

    if (isUser) {
        return (
            <div style={{ maxWidth: "72%", display: "flex", alignSelf: "flex-end", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                <div
                    style={{
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        borderRadius: "18px 18px 4px 18px",
                        background: "var(--neutral-900)",
                        color: "#fff",
                        padding: "12px 16px",
                    }}
                >
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5 }}>{text}</p>
                </div>
                <span style={{ color: "var(--neutral-500)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", padding: "0 4px" }}>
                    {time}
                    <CheckCheck size={14} color="var(--accent-teal)" />
                </span>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "72%", display: "flex", alignItems: "flex-end", gap: "8px" }}>
            <Avatar label="AI" size={32} />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div
                    style={{
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        borderRadius: "18px 18px 18px 4px",
                        background: "#fff",
                        border: "1px solid var(--neutral-200)",
                        padding: "12px 16px",
                    }}
                >
                    <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5, color: "var(--neutral-900)" }}>{text}</p>
                </div>
                {rawData && <DataCard rawData={rawData} functionUsed={functionUsed} />}
                <span style={{ color: "var(--neutral-500)", fontSize: "12px", padding: "0 4px" }}>{time}</span>
            </div>
        </div>
    );
}

export default MessageBubble;