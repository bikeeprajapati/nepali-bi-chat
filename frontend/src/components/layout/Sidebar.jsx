import React from "react";
import { MessageCircle, Users, Settings, MessageSquareText } from "lucide-react";
import Avatar from "../common/Avatar";

function Sidebar() {
    return (
        <aside
            style={{
                flexShrink: 0,
                background: "var(--neutral-50)",
                borderRight: "1px solid var(--neutral-200)",
                display: "flex",
                padding: "24px",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "240px",
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: "var(--neutral-900)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MessageSquareText size={20} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                        <span style={{ fontWeight: 600, fontSize: "14px" }}>Nepali BI</span>
                        <span style={{ color: "var(--neutral-500)", fontSize: "12px" }}>Chats</span>
                    </div>
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <a
                        style={{
                            fontWeight: 500,
                            borderRadius: "12px",
                            background: "var(--neutral-900)",
                            color: "#fff",
                            fontSize: "14px",
                            display: "flex",
                            padding: "12px 16px",
                            alignItems: "center",
                            gap: "12px",
                            cursor: "pointer",
                        }}
                    >
                        <MessageCircle size={16} />
                        च्याट
                    </a>
                    <a
                        style={{
                            fontWeight: 500,
                            borderRadius: "12px",
                            color: "var(--neutral-900)",
                            fontSize: "14px",
                            display: "flex",
                            padding: "12px 16px",
                            alignItems: "center",
                            gap: "12px",
                            cursor: "pointer",
                        }}
                    >
                        <Users size={16} />
                        सम्पर्कहरू
                    </a>
                    <a
                        style={{
                            fontWeight: 500,
                            borderRadius: "12px",
                            color: "var(--neutral-900)",
                            fontSize: "14px",
                            display: "flex",
                            padding: "12px 16px",
                            alignItems: "center",
                            gap: "12px",
                            cursor: "pointer",
                        }}
                    >
                        <Settings size={16} />
                        सेटिङ
                    </a>
                </nav>
            </div>

            <div
                style={{
                    borderRadius: "16px",
                    background: "#fff",
                    border: "1px solid var(--neutral-200)",
                    display: "flex",
                    padding: "12px",
                    alignItems: "center",
                    gap: "12px",
                }}
            >
                <Avatar label="बि" />
                <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: "14px" }}>Bikee Prajapati</p>
                    <p style={{ margin: 0, color: "var(--neutral-500)", fontSize: "12px" }}>Online</p>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;