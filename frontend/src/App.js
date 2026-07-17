import React, { useState } from "react";
import { SessionProvider } from "./context/SessionContext";
import Sidebar from "./components/layout/Sidebar";
import ChatList from "./components/layout/ChatList";
import ChatWindow from "./components/chat/ChatWindow";

function App() {
  const [preview, setPreview] = useState(null);

  return (
    <SessionProvider>
      <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
        <Sidebar />
        <ChatList lastMessagePreview={preview} />
        <ChatWindow onMessagesChange={setPreview} />
      </div>
    </SessionProvider>
  );
}

export default App;