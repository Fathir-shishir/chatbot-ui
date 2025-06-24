import React, { useEffect, useState } from "react";
import "./IntroAnimation.css";

function IntroAnimation({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true); 
    }, 2500); 

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3000); 

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`intro-container ${fadeOut ? "fade-out" : ""}`}>
      <div className="intro-glass">
        <h1 className="intro-title">Valeo FAQ Chatbot</h1>
        <p className="intro-subtitle">Here to provide fast, accurate answers.</p>
      </div>
    </div>
  );
}

export default IntroAnimation;
