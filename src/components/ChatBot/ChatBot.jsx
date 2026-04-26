import React, { useEffect, useRef, useState } from "react";
import { askAiChatbot } from "../../services/chatbotService";
import "./ChatBot.css";

const ChatBotWidget = ({ onSuggestionClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Xin chao! Toi la tro ly AI. Ban can tu van san pham nao hom nay?",
      suggestions: [],
    },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const cleanedInput = input.trim();
    if (!cleanedInput || isBotTyping) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: cleanedInput,
    };

    const historyPayload = messages.map((item) => ({
      role: item.role,
      content: item.content,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsBotTyping(true);

    try {
      const chatbotData = await askAiChatbot(cleanedInput, historyPayload);
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: chatbotData.reply,
        suggestions: chatbotData.suggestions || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          content: "Xin loi, toi dang gap loi ket noi. Ban vui long thu lai sau it phut.",
          suggestions: [],
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <>
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI chatbot"
      >
        {isOpen ? "Close" : "AI Chat"}
      </button>

      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <h4>AI Tu Van</h4>
              <p>Online</p>
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              x
            </button>
          </div>

          <div className="chatbot-body">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`chat-msg ${item.role === "user" ? "chat-msg-user" : "chat-msg-assistant"}`}
              >
                {item.content}

                {item.role === "assistant" &&
                  Array.isArray(item.suggestions) &&
                  item.suggestions.length > 0 && (
                    <div className="chat-suggestions">
                      {item.suggestions.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          className="chat-suggestion-btn"
                          onClick={() => onSuggestionClick(product.id)}
                        >
                          {product.name}
                          {typeof product.price === "number" && (
                            <span>{` - ${product.price.toLocaleString()}đ`}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {isBotTyping && <div className="chat-msg chat-msg-assistant">Dang soan tra loi...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-wrap" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhap cau hoi cua ban..."
            />
            <button type="submit" disabled={isBotTyping || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBotWidget;
