import React, { useRef } from "react";
import { Paperclip, Smile, Send } from "lucide-react";

function MessageInput({ value, onChange, onSend, onFilePick, disabled }) {
    const fileInputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <footer
            style={{
                background: "#fff",
                borderTop: "1px solid var(--neutral-200)",
                display: "flex",
                padding: "0 32px",
                alignItems: "center",
                gap: "12px",
                height: "72px",
            }}
        >
            <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "none",
                    background: "transparent",
                    color: "var(--neutral-900)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                }}
            >
                <Paperclip size={18} />
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                style={{ display: "none" }}
                onChange={(e) => {
                    if (e.target.files[0]) onFilePick(e.target.files[0]);
                    e.target.value = "";
                }}
            />

            <button
                style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "none",
                    background: "transparent",
                    color: "var(--neutral-900)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                }}
            >
                <Smile size={18} />
            </button>

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder="फाइल अपलोड गर्नुहोस् वा नेपालीमा प्रश्न सोध्नुहोस्..."
                style={{
                    flex: 1,
                    borderRadius: "999px",
                    background: "var(--neutral-100)",
                    border: "none",
                    fontSize: "14px",
                    padding: "0 16px",
                    height: "44px",
                    outline: "none",
                }}
            />

            <button
                onClick={onSend}
                disabled={disabled}
                style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: "none",
                    background: "var(--neutral-900)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: disabled ? "default" : "pointer",
                    opacity: disabled ? 0.5 : 1,
                    flexShrink: 0,
                }}
            >
                <Send size={16} />
            </button>
        </footer>
    );
}

export default MessageInput;