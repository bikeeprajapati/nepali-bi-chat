import React from "react";
import { Search, Plus } from "lucide-react";
import Avatar from "../common/Avatar";
import { useSession } from "../../context/SessionContext";

function ChatList({ lastMessagePreview }) {
    const { sessionId, fileName } = useSession();

    return (
        <section
            style={{
                flexShrink: 0,
                background: "#fff",
                borderRight: "1px solid var(--neutral-200)",
                display: "flex",
                flexDirection: "column",
                width: "320px",
            }}
        >
            <div
                style={{
                    borderBottom: "1px solid var(--neutral-200)",
                    display: "flex",
                    padding: "24px 24px 20px",
                    flexDirection: "column",
                    gap: "16px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h1 style={{ fontWeight: 600, fontSize: "22px", margin: 0 }}>च्याटहरू</h1>
                    <button
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "var(--neutral-900)",
                            color: "#fff",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <div style={{ position: "relative" }}>
                    <Search
                        size={16}
                        style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--neutral-500)" }}
                    />
                    <input
                        placeholder="कुराकानी खोज्नुहोस्"
                        style={{
                            width: "100%",
                            borderRadius: "12px",
                            background: "var(--neutral-50)",
                            border: "none",
                            fontSize: "14px",
                            padding: "11px 12px 11px 36px",
                            outline: "none",
                        }}
                    />
                </div>
            </div>

            <div style={{ padding: "12px", flex: 1, overflowY: "auto" }}>
                {sessionId ? (
                    <div
                        style={{
                            borderRadius: "16px",
                            background: "var(--neutral-100)",
                            display: "flex",
                            padding: "16px",
                            alignItems: "center",
                            gap: "16px",
                            cursor: "pointer",
                        }}
                    >
                        <Avatar label="AI" />
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                                <span style={{ fontWeight: 600, fontSize: "14px" }}>नेपाली BI सहायक</span>
                            </div>
                            <p
                                style={{
                                    margin: 0,
                                    color: "var(--neutral-500)",
                                    fontSize: "14px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {lastMessagePreview || `${fileName} लोड भयो`}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p style={{ color: "var(--neutral-500)", fontSize: "13px", textAlign: "center", marginTop: "24px" }}>
                        फाइल अपलोड गरेर सुरु गर्नुहोस्
                    </p>
                )}
            </div>
        </section>
    );
}

export default ChatList;