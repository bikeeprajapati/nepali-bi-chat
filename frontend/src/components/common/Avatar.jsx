import React from "react";

function Avatar({ label, size = 40, color = "#009689" }) {
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background: color,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: size * 0.35,
                fontWeight: 600,
                flexShrink: 0,
            }}
        >
            {label}
        </div>
    );
}

export default Avatar;