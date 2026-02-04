import { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  const handleToggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Show welcome message when opening chat for the first time
    if (newIsOpen && !hasShownWelcome) {
      const welcomeMessage = {
        role: "bot",
        text: "Hi! I'm Kian's AI assistant. Feel free to ask me about Kian's skills, projects, or experience!",
        isWelcome: true
      };
      setChat([welcomeMessage]);
      setHasShownWelcome(true);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setIsLoading(true);

    try {
      const systemPrompt = `You are Kian Lhei Pagkaliwagan's AI assistant. Answer questions about Kian's portfolio, skills, projects, and experience. Be professional but friendly. If asked about topics unrelated to Kian's portfolio, politely redirect the conversation back to Kian's professional work, skills, or projects.
        
      Rules:
        - Answer in simple English
        - Use short sentences
        - Be friendly and helpful
        - Avoid complex words
        - Only answer questions related to the portfolio
        - Act like yout are the person in this portfolio. DONT use "his" 
        `
      ;
      
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          contents: [{ 
            parts: [{ 
              text: `${systemPrompt}\n\nUser question: ${message}` 
            }] 
          }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const botText =
        res.data.candidates[0].content.parts[0].text;

      setChat((prev) => [...prev, { role: "bot", text: botText }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      let errorMessage = "Sorry, I'm having trouble connecting. Please try again later.";
      
      if (error.response?.status === 400) {
        errorMessage = "Invalid request format. Please try again.";
      } else if (error.response?.status === 403) {
        errorMessage = "API key issue. Please check the configuration.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment.";
      }
      
      setChat((prev) => [
        ...prev,
        { role: "bot", text: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className="chat-toggle-btn"
        onClick={handleToggleChat}
      >
        <span className="chat-icon">{isOpen ? '✕' : '💬'}</span> Chat with Kian
      </button>

      {/* Chat Container */}
      <div className={`chat-container ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          Kian Lhei Pagkaliwagan
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        <div className="chat-body">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.role} ${msg.isWelcome ? 'welcome' : ''}`}
            >
              <span>{msg.text}</span>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message bot typing">
              <span>Thinking...</span>
            </div>
          )}
        </div>

        <div className="chat-footer">
          <input
            type="text"
            value={message}
            placeholder="Type a message..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button 
            onClick={sendMessage} 
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
