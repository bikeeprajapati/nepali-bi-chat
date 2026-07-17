import React from "react";
import { BarChart3 } from "lucide-react";

function DataCard({ rawData, functionUsed }) {
    if (!rawData) return null;

    let stats = [];
    let title = "";

    if (functionUsed === "get_top_product") {
        title = rawData.product;
        stats = [
            { label: "परिमाण", value: `${rawData.value}` },
            { label: "महिना", value: `${rawData.year}-${String(rawData.month).padStart(2, "0")}` },
        ];
    } else if (functionUsed === "get_total_sales") {
        title = "कुल बिक्री";
        stats = [
            { label: "रकम", value: `रु. ${rawData.total_sales.toLocaleString("en-IN")}` },
            { label: "अवधि", value: `${rawData.year}-${String(rawData.month || "").padStart(2, "0")}` },
        ];
    } else if (functionUsed === "get_sales_trend") {
        const entries = Object.entries(rawData);
        title = "बिक्री प्रवृत्ति";
        stats = entries.map(([period, value]) => ({
            label: period,
            value: `रु. ${value.toLocaleString("en-IN")}`,
        }));
    }

    return (
        <div
            style={{
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                borderRadius: "16px",
                background: "#fff",
                border: "1px solid var(--neutral-200)",
                width: "320px",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    borderBottom: "1px solid var(--neutral-200)",
                    display: "flex",
                    padding: "12px 16px",
                    alignItems: "center",
                    gap: "12px",
                }}
            >
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        background: "var(--neutral-100)",
                        color: "var(--neutral-900)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <BarChart3 size={18} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: "14px" }}>{title}</p>
                    <p style={{ margin: 0, color: "var(--neutral-500)", fontSize: "12px" }}>
                        अपलोड गरिएको डाटाबाट गणना गरिएको
                    </p>
                </div>
            </div>
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)`,
                        gap: "8px",
                    }}
                >
                    {stats.map((s, i) => (
                        <div
                            key={i}
                            style={{
                                borderRadius: "12px",
                                background: "var(--neutral-50)",
                                border: "1px solid var(--neutral-200)",
                                padding: "10px",
                            }}
                        >
                            <p style={{ margin: 0, color: "var(--neutral-500)", fontSize: "11px" }}>{s.label}</p>
                            <p style={{ margin: "4px 0 0", fontWeight: 600, fontSize: "13px" }}>{s.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DataCard;