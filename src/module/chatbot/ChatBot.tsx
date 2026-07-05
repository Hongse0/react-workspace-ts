import { useEffect, useRef, useState } from "react";
import "./ChatBot.css";

type ChatRole = "user" | "bot";

interface ChatMessage {
    id: string;
    role: ChatRole;
    text: string;
    createdAt: number;
}

const INITIAL_MESSAGE: ChatMessage = {
    id: "welcome",
    role: "bot",
    text: "안녕하세요! GrowFolio AI입니다. 무엇을 도와드릴까요?",
    createdAt: Date.now(),
};

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState("");
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!listRef.current) return;
        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages, isOpen]);

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const userMessage: ChatMessage = {
            id: `u-${Date.now()}`,
            role: "user",
            text: trimmed,
            createdAt: Date.now(),
        };

        const botMessage: ChatMessage = {
            id: `b-${Date.now() + 1}`,
            role: "bot",
            text: "곧 AI가 답변드릴 예정입니다. (백엔드 연동 예정)",
            createdAt: Date.now() + 1,
        };

        setMessages((prev) => [...prev, userMessage, botMessage]);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {isOpen && (
                <div className="chatbot-panel" role="dialog" aria-label="AI 챗봇">
                    <div className="chatbot-header">
                        <div className="chatbot-header-title">
                            <span className="chatbot-header-dot" />
                            GrowFolio AI
                        </div>
                        <button
                            type="button"
                            className="chatbot-close-btn"
                            onClick={() => setIsOpen(false)}
                            aria-label="챗봇 닫기"
                        >
                            ×
                        </button>
                    </div>

                    <div className="chatbot-messages" ref={listRef}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`chatbot-message chatbot-message--${msg.role}`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <div className="chatbot-input-row">
                        <textarea
                            className="chatbot-input"
                            placeholder="메시지를 입력하세요"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                        <button
                            type="button"
                            className="chatbot-send-btn"
                            onClick={handleSend}
                            disabled={!input.trim()}
                        >
                            전송
                        </button>
                    </div>
                </div>
            )}

            <button
                type="button"
                className={`chatbot-fab ${isOpen ? "is-open" : ""}`}
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? "AI 챗봇 닫기" : "AI 챗봇 열기"}
            >
                {isOpen ? "×" : "AI"}
            </button>
        </>
    );
}
