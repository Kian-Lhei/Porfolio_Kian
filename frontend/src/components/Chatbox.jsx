import { useState } from "react";
import axios from "axios";
import "./Chatbot.css";
import Profile from "../assets/Profile.jpg";

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
        text: "Hi! I'm Kian. Feel free to ask me about my skills, projects, or experience!",
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
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="chat-icon">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="chat-icon">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
        <span>Chat with Kian</span>
      </button>

      {/* Chat Container */}
      <div className={`chat-container ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <span className="font-poppins">Kian Lhei Pagkaliwagan</span>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="chat-body">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`chat-message-wrapper ${msg.role} ${msg.isWelcome ? 'welcome' : ''}`}
            >
              <img 
                src={msg.role === 'user' ? Profile : Profile} 
                alt={msg.role === 'user' ? 'User' : 'Kian'}
                className="chat-avatar"
              />
              <div className={`chat-message ${msg.role} ${msg.isWelcome ? 'welcome' : ''}`}>
                <span>{msg.text}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message-wrapper bot typing">
              <img src={Profile} alt="Kian" className="chat-avatar" />
              <div className="chat-message bot typing">
                <span>Thinking...</span>
              </div>
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
            {isLoading ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
