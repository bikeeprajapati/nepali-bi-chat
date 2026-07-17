import React, { createContext, useContext, useState } from "react";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
    const [sessionId, setSessionId] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [rowsLoaded, setRowsLoaded] = useState(null);

    const startSession = (id, name, rows) => {
        setSessionId(id);
        setFileName(name);
        setRowsLoaded(rows);
    };

    const clearSession = () => {
        setSessionId(null);
        setFileName(null);
        setRowsLoaded(null);
    };

    return (
        <SessionContext.Provider
            value={{ sessionId, fileName, rowsLoaded, startSession, clearSession }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error("useSession must be used within SessionProvider");
    return ctx;
}