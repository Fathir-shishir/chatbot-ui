import React, { useState } from "react";
import axios from "axios";

function ChatBox() {
  const [userQuery, setUserQuery] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Send query to the Flask server
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
    // Reset conversation history on backend
    await axios.post("http://localhost:5000/reset");
    setConversationHistory([]);
  };

  return (
    <div className="chatbox">
      <div className="chatbox-header">
        <h2>Chatbot for Valeo FAQ</h2>
        <button onClick={handleReset}>Reset Chat</button>
      </div>

      <div className="chatbox-body">
        <div className="messages">
          {conversationHistory.map((message, index) => (
            <div key={index} className={`message ${message.isUser ? "user" : "bot"}`}>
              <p>{message.message}</p>
            </div>
          ))}
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
    </div>
  );
}

export default ChatBox;
