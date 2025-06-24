import React, { useState, useEffect } from "react";
import ChatBox from "./ChatBox";
import "./App.css";
import IntroAnimation from "./IntroAnimation"; 





/*function App() {
  return (
    <div className="App">
      <ChatBox />
    </div>
  );
}*/



function App() {
  const [showIntro, setShowIntro] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {showIntro ? <IntroAnimation onFinish={() => setShowIntro(false)} />
 : <ChatBox />}
    </div>
  );
}
export default App;
