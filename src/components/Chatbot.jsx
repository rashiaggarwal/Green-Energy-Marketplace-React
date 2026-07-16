import { useState } from "react";
import { apiClient } from "../services/apiClient";

// Minimal HTML detection
function isHtml(str) {
  return /<[^>]+>/.test(str);
}

// Basic sanitizer fallback: removes <script>/<style> and event handlers.
function sanitizeHtml(html) {
  try {
    // Prefer DOMPurify if available in the page (safer and recommended)
    if (typeof window !== "undefined" && window.DOMPurify) {
      return window.DOMPurify.sanitize(html);
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove script and style elements
    doc.querySelectorAll("script, style").forEach((el) => el.remove());

    // Remove event handler attributes and javascript: URIs
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const val = attr.value || "";
        if (name.startsWith("on") || val.trim().toLowerCase().startsWith("javascript:")) {
          el.removeAttribute(attr.name);
        }
      });
    }

    return doc.body.innerHTML;
  } catch (e) {
    return "";
  }
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);

  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! Ask me anything about GreenGrid.",
    },
  ]);

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "Chat refreshed. Ask me anything.",
      },
    ]);
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    const currentQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: currentQuestion,
      },
    ]);

    setQuestion("");

    try {
      setLoading(true);

      const response =
        await apiClient.askAssistant(
          currentQuestion
        );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            response.answer ||
            "No response received.",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Unable to connect to GreenGrid Assistant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="chat-button"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {open && (
        <div className="chat-window">

          <div className="chat-header">
            <h3>GreenGrid Assistant</h3>

            <button
              className="refresh-chat"
              onClick={clearChat}
            >
              ↻
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role}`}
              >
                {isHtml(msg.text) ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(msg.text),
                    }}
                  />
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                Thinking...
              </div>
            )}
          </div>

          <div className="chat-input-row">
            <input
              value={question}
              placeholder="Ask a question..."
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askQuestion();
                }
              }}
            />

            <button
              className="send-btn"
              onClick={askQuestion}
            >
              ✨ Ask
            </button>
          </div>

        </div>
      )}
    </>
  );
}