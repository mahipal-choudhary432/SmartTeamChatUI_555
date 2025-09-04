import React, { useState } from "react";
import { FaRobot, FaMagic, FaSmile, FaArrowLeft, FaPlus } from "react-icons/fa";
import "./App.css";

const INITIAL_CHATS = [
  { id: 1, name: "Design Team", last: "Upload ready. Please review.", time: "12:34" },
  { id: 2, name: "Frontend Squad", last: "Let's update those color tokens.", time: "09:22" },
  { id: 3, name: "Product Managers", last: "Sprint review at 3 PM.", time: "08:17" },
];

const INITIAL_MESSAGES = {
  1: [
    { from: "Alice", text: "Let's refine the UI today!", time: "11:45 AM" },
    { from: "Me", text: "Agreed! I'll check the Figma now.", time: "11:47 AM" },
  ],
  2: [{ from: "Bob", text: "Don't forget dark mode!", time: "09:00 AM" }],
  3: [{ from: "Sara", text: "Agenda: Roadmap and feedback.", time: "08:10 AM" }],
};

function ChatList({ chats, onOpenChat, onNewChat }) {
  return (
    <div className="main-card">
      <header className="header">
        <h2>Team Chats</h2>
        <button className="icon-btn" title="Start Chat" onClick={onNewChat}>
          <FaPlus />
        </button>
      </header>
      <ul className="chat-list">
        {chats.map((chat) => (
          <li key={chat.id} className="chat-list-item" onClick={() => onOpenChat(chat)}>
            <div>
              <span className="chat-name">{chat.name}</span>
              <span className="chat-time">{chat.time}</span>
            </div>
            <span className="chat-last">{chat.last}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChatWindow({ chat, messages, onBack }) {
  const [aiSummary, setAiSummary] = useState("");
  const [aiReply, setAiReply] = useState("");

  return (
    <div className="main-card">
      <header className="header">
        <button className="icon-btn" onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2>{chat.name}</h2>
      </header>
      <div className="chat-messages">
        {messages?.length ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.from === "Me"
                  ? "msg msg-me"
                  : msg.from === "AI"
                  ? "msg msg-ai"
                  : "msg msg-them"
              }
            >
              <span className="msg-from">{msg.from}</span>
              <span className="msg-text">{msg.text}</span>
              <span className="msg-time">{msg.time}</span>
            </div>
          ))
        ) : (
          <div className="msg msg-ai" style={{ fontStyle: "italic", color: "#999" }}>
            No messages yet in this chat.
          </div>
        )}
        {aiSummary && (
          <div className="msg msg-ai">
            <span className="msg-from">AI</span>
            <span className="msg-text">{aiSummary}</span>
          </div>
        )}
        {aiReply && (
          <div className="msg msg-ai">
            <span className="msg-from">AI</span>
            <span className="msg-text">{aiReply}</span>
          </div>
        )}
      </div>
      <div className="ai-actions">
        <button
          className="ai-btn"
          onClick={() =>
            setAiSummary(
              "Summary: This chat contains team discussions and updates on ongoing projects."
            )
          }
        >
          <FaRobot className="ai-btn-icon" />
          Summarize Thread
        </button>
        <button
          className="ai-btn"
          onClick={() =>
            setAiReply(
              "Smart Reply Suggestion: Can you please clarify the timeline for this task?"
            )
          }
        >
          <FaMagic className="ai-btn-icon" />
          Smart Reply Suggestion
        </button>
      </div>
    </div>
  );
}

function NewChat({ onStartChat, onBack }) {
  const [name, setName] = useState("");
  const [icebreaker, setIcebreaker] = useState("");

  return (
    <div className="main-card">
      <header className="header">
        <button className="icon-btn" onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h2>New Chat</h2>
      </header>
      <div className="new-chat-form">
        <input
          className="input"
          placeholder="Enter participant or team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="ai-btn"
          onClick={() => setIcebreaker("👋 Hi! What will we collaborate on today?")}
        >
          <FaSmile className="ai-btn-icon" />
          Generate Icebreaker
        </button>
        {icebreaker && (
          <div className="msg msg-ai" style={{ marginTop: "1rem" }}>
            <span className="msg-from">AI</span>
            <span className="msg-text">{icebreaker}</span>
          </div>
        )}
        <button
          className="send-btn"
          disabled={!name.trim()}
          onClick={() => {
            if (name.trim()) {
              onStartChat(name.trim());
            }
          }}
        >
          Start Chat
        </button>
      </div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("list");
  const [chatList, setChatList] = useState(INITIAL_CHATS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [activeChat, setActiveChat] = useState(null);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const addNewChat = (name) => {
    const curTime = getCurrentTime();
    const newChat = {
      id: chatList.length + 1,
      name,
      last: "",
      time: curTime,
    };
    setChatList((prev) => [...prev, newChat]);
    setMessages((prev) => ({ ...prev, [newChat.id]: [] }));
    setActiveChat(newChat);
    setScreen("chat");
  };

  return screen === "list" ? (
    <ChatList
      chats={chatList}
      onOpenChat={(chat) => {
        setActiveChat(chat);
        setScreen("chat");
      }}
      onNewChat={() => setScreen("new")}
    />
  ) : screen === "chat" && activeChat ? (
    <ChatWindow chat={activeChat} messages={messages[activeChat.id]} onBack={() => setScreen("list")} />
  ) : screen === "new" ? (
    <NewChat onStartChat={addNewChat} onBack={() => setScreen("list")} />
  ) : null;
}

export default App;
