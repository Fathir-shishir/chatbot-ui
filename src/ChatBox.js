import React, { useState } from "react";
import axios from "axios";

// Configure axios to include credentials (cookies) with every request
axios.defaults.withCredentials = true;

function ChatBox() {
  const [userQuery, setUserQuery] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) setDarkMode(savedTheme === "true");
  }, []);

  React.useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);


  const suggestedQuestions = [
    "What are your opening hours?",
    "How do I apply for a job?",
    "Where is the nearest office?",
  ];

  const funFacts = [
    "Did you know? The first computer bug was an actual bug - a moth found trapped in a Harvard Mark II computer in 1947!",
    "Fun fact: The term 'debugging' comes from Admiral Grace Hopper who literally had to remove a bug (moth) from a computer!",
    "Amazing fact: Your smartphone has more computing power than the computers that guided Apollo 11 to the moon!",
    "Cool fact: The first webcam was created to monitor a coffee pot at Cambridge University so people could see if it was empty!",
    "Interesting fact: The '@' symbol was used in email for the first time in 1971 by Ray Tomlinson!",
    "Did you know? The term 'Wi-Fi' doesn't actually stand for anything - it's just a catchy name!",
    "Fun fact: The first computer mouse was made of wood and had only one button!",
    "Amazing fact: Google processes over 8.5 billion searches per day!",
    "Cool fact: The first email was sent in 1971, and it just said 'QWERTYUIOP'!",
    "Interesting fact: YouTube uploads more than 500 hours of video every minute!",
    "Did you know? The first domain name ever registered was symbolics.com in 1985!",
    "Fun fact: The password for nuclear missile computers in the US was '00000000' for 8 years!",
    "Amazing fact: More people have mobile phones than have access to clean water!",
    "Cool fact: The first banner ad on the web had a 44% click-through rate!",
    "Interesting fact: Amazon was originally called 'Cadabra' but changed it because it sounded too much like 'cadaver'!"
  ];


  const getRandomFunFact = () => {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    const funFact = funFacts[randomIndex];

    setConversationHistory((prevHistory) => [
      ...prevHistory,
      { isUser: true, message: "Tell me a fun fact!" },
      { isUser: false, message: funFact }
    ]);
  };


  const handleSend = async () => {
    if (!userQuery.trim()) return;

    setIsLoading(true);

    try {
      console.log("Sending query:", userQuery);
      
      // Send the user's query to the Flask backend with credentials
      const response = await axios.post(
        "http://localhost:5000/ask", 
        { query: userQuery },
        { withCredentials: true } // Ensure cookies are sent
      );

      console.log("Response received:", response.data);

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
      await axios.post(
        "http://localhost:5000/reset", 
        {}, 
        { withCredentials: true }
      );

      setConversationHistory([]);
   //   setDebugInfo(null);
    } catch (error) {
      console.error("Error resetting conversation:", error);
    }
  };

  return (
  <div className={`chatbox fade-in ${darkMode ? "dark-mode" : ""}`}>
    <div className="chatbox-header">
      <h2 className="chatbox-title">Chatbot for Valeo FAQ</h2>
      <div>
        <button onClick={handleReset} className="reset-button">Reset Chat</button>
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="dark-mode-toggle"
          style={{ marginLeft: '10px', padding: '6px 12px', cursor: 'pointer' }}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
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
        <div style={{marginTop: '20px', textAlign: 'center'}}>
          <button 
            onClick={getRandomFunFact}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
          >
            Tell me a fun fact!
          </button>
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