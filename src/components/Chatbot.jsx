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
      text: "Hi! Ask me anything about Green Energy Marketplace.",
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

    console.log(
      "AI RESPONSE",
      response
    );

    const uniqueSources =
      Array.from(
        new Set(
          (
            response?.sources || []
          ).map((source) => {
            if (
              typeof source ===
              "string"
            ) {
              return source;
            }

            return (
              source.document_name ||
              source.filename ||
              source.name
            );
          })
        )
      ).filter(Boolean);

    const apiEndpoints =
  response?.api_summary?.tool_results
    ?.map((t) => t.endpoint)
    ?.filter(Boolean) || [];

setMessages((prev) => [
  ...prev,
  {
    role: "assistant",
    text:
      response?.answer ||
      response?.response ||
      "No response received.",

    sources: uniqueSources,

    endpoints: apiEndpoints,
  },
]);
  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text:
          "Unable to connect to Green Energy Assistant.",
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
            <h3>Green Energy Marketplace Assistant</h3>

           <button
            className="refresh-chat-icon"
            onClick={clearChat}
            title="New Chat"
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
                <>
                  {isHtml(msg.text) ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          sanitizeHtml(
                            msg.text
                          ),
                      }}
                    />
                  ) : (
                    msg.text
                  )}

                  {(msg.sources?.length > 0 ||
  msg.endpoints?.length > 0) && (

  <div className="chat-sources">

    <div className="source-title">
      📚 Sources Used
    </div>

    {msg.sources?.map(
      (source, idx) => (
        <div
          key={`src-${idx}`}
          className="source-chip"
        >
          📄 {source}
        </div>
      )
    )}

    {msg.endpoints?.map(
      (endpoint, idx) => (
        <div
          key={`api-${idx}`}
          className="source-chip api-chip"
        >
          🔌 {endpoint}
        </div>
      )
    )}

  </div>
)}
                </>
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