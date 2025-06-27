import React, { useState } from "react";
import axios from "axios";


function ChatBox() {
  const [userQuery, setUserQuery] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "What are your opening hours?",
    "How do I apply for a job?",
    "Where is the nearest office?",
  ];

  const handleSend = async () => {
    if (!userQuery.trim()) return;

    setIsLoading(true);

    try {
      // Send the user's query to the Flask backend
      const response = await axios.post("http://localhost:5000/ask", { query: userQuery });

      // Update the conversation history with the user's message and the chatbot's response
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { isUser: true, message: userQuery },
        { isUser: false, message: response.data.answer }
      ]);

      // Clear the input field
      setUserQuery("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await axios.post("http://localhost:5000/reset", {}, { withCredentials: true });

      setConversationHistory([]);
    } catch (error) {
      console.error("Error resetting conversation:", error);
    }
  };

  return (
    <div className="chatbox fade-in">
      <div className="chatbox-header">
        <h2 className="chatbox-title">Chatbot for Valeo FAQ</h2>
        <button onClick={handleReset} className="reset-button">Reset Chat</button>
      </div>

      {conversationHistory.length === 0 && (
      <div className="chatbox-intro">
        <div className="intro-header">
          <h1>Hello</h1>
          <h2>How may I assist you today?</h2>
          <p>Choose one of the frequently asked questions below, or ask your own.</p>
        </div>
        <div className="question-suggestions">
          {suggestedQuestions.map((q, idx) => (
            <button key={idx} className="question-btn" onClick={() => setUserQuery(q)}>
              {q}
            </button>
          ))}
        </div>
      </div>
     )}


      <div className="chatbox-body">
        <div className="messages">
          {conversationHistory.map((message, index) => (
            <div key={index} className={`message ${message.isUser ? "user" : "bot"}`}>
              <p dangerouslySetInnerHTML={{ __html: message.message }} />
            </div>
          ))}
        </div>
      </div>

      <div className="input-box">
        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;

