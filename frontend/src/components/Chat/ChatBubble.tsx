import type { ChatMessage } from "../../types/miku";
import ReactMarkdown from "react-markdown";
import { useLayoutEffect } from "react";
import { userBubbleStyle, mikuBubbleStyle } from "./ChatStyles";

interface ChatBubbleProps {
    message: ChatMessage;
    onUpdate?: () => void;
}

import { useTypewriter } from "../../hooks/useTypewriter";
// ... imports

export function ChatBubble({ message, onUpdate }: ChatBubbleProps) {
    const isMiku = message.role === "miku";

    // Only stream if it's Miku. 
    // We could optimize by only streaming if it's the *latest* message, 
    // but for now let's just stream on mount (React keys handle persistence).
    const { displayText } = useTypewriter(message.text, 20, isMiku);

    useLayoutEffect(() => {
        if (isMiku && onUpdate) {
            onUpdate();
        }
    }, [displayText, isMiku, onUpdate]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: !isMiku ? "flex-end" : "flex-start",
            }}
        >
            <div style={!isMiku ? userBubbleStyle : mikuBubbleStyle}>
                <ReactMarkdown
                    components={{
                        p: ({ node, ...props }) => <p style={{ margin: 0 }} {...props} />,
                        a: ({ node, ...props }) => <a style={{ color: "inherit", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer" {...props} />
                    }}
                >
                    {isMiku ? displayText : message.text}
                </ReactMarkdown>
            </div>
        </div>
    );
}
