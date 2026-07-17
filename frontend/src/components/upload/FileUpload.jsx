import React from "react";
import { Upload } from "lucide-react";
import { uploadFile } from "../../api/client";
import { useSession } from "../../context/SessionContext";

function FileUpload() {
    const { startSession } = useSession();

    const handleChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const data = await uploadFile(file);
        startSession(data.session_id, file.name, data.rows_loaded);
    };

    return (
        <div style={{ textAlign: "center", padding: "40px" }}>
            <Upload size={28} color="var(--neutral-500)" style={{ marginBottom: "12px" }} />
            <p style={{ color: "var(--neutral-500)", fontSize: "14px", marginBottom: "16px" }}>
                बिक्री डाटा अपलोड गर्नुहोस् (CSV वा Excel)
            </p>
            <label
                style={{
                    display: "inline-block",
                    background: "var(--neutral-900)",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500,
                }}
            >
                फाइल छान्नुहोस्
                <input type="file" accept=".csv,.xlsx,.xls" onChange={handleChange} style={{ display: "none" }} />
            </label>
        </div>
    );
}

export default FileUpload;