import React, { useRef, useEffect, useState } from "react";
import useChat from "../../../dashboard/src/hooks/useChat";

function ChatRoom({ classroomId, token }) {
  const { messages, sendMessage, loadMore, hasMore, loading } = useChat({ classroomId, token });
  const [input, setInput] = useState("");
  const chatBoxRef = useRef();
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Scroll to bottom when new message arrives (if user is at bottom)
  useEffect(() => {
    if (isAtBottom && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  // Preserve scroll position when loading more
  const handleScroll = () => {
    const el = chatBoxRef.current;
    if (!el) return;

    // If at top, load more
    if (el.scrollTop === 0 && hasMore && !loading) {
      const prevHeight = el.scrollHeight;
      loadMore().then(() => {
        // After loading, maintain scroll position
        setTimeout(() => {
          el.scrollTop = el.scrollHeight - prevHeight;
        }, 0);
      });
    }

    // Track if user is at bottom
    setIsAtBottom(el.scrollHeight - el.scrollTop === el.clientHeight);
  };

  // Scroll to bottom on mount
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, []);

  return (
    <div>
      <div
        ref={chatBoxRef}
        style={{
          maxHeight: 400,
          height: 400,
          overflowY: "auto",
          border: "1px solid #ccc",
          marginBottom: 8,
          display: "flex",
          flexDirection: "column-reverse", // Newest at bottom
        }}
        onScroll={handleScroll}
      >
        <div>
          {loading && <div style={{ textAlign: "center", padding: 8 }}>Loading...</div>}
          {!hasMore && <div style={{ textAlign: "center", padding: 8, color: "#888" }}>No more messages</div>}
          {messages.slice().reverse().map((msg) => (
            <div key={msg._id} style={{ margin: "8px 0" }}>
              <strong>{msg.sender?.fullName || "Unknown"}:</strong> {msg.message}
              <div style={{ fontSize: 10, color: "#aaa" }}>{new Date(msg.createdAt).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1 }}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message"
          onKeyDown={e => {
            if (e.key === "Enter" && input.trim()) {
              sendMessage(input);
              setInput("");
            }
          }}
        />
        <button
          onClick={() => {
            if (input.trim()) {
              sendMessage(input);
              setInput("");
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom; 