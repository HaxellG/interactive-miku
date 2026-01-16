import type { KeyboardEvent } from "react";
import { inputContainerGlass, transparentInput, sendButtonGlass } from "./ChatStyles";

interface ChatInputProps {
    draft: string;
    isBusy: boolean;
    setDraft: (value: string) => void;
    onSend: () => void;
}

export function ChatInput({ draft, isBusy, setDraft, onSend }: ChatInputProps) {
    function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    }

    return (
        <div style={inputContainerGlass}>
            <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Chat with Miku..."
                rows={1}
                style={transparentInput}
            />
            <button
                onClick={onSend}
                disabled={isBusy}
                style={{
                    ...sendButtonGlass,
                    background: isBusy ? "transparent" : "rgba(255,255,255,0.15)",
                    cursor: isBusy ? "not-allowed" : "pointer",
                    opacity: isBusy ? 0.5 : 1,
                }}
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
            </button>
        </div>
    );
}
