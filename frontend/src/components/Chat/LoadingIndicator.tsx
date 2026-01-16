import { mikuBubbleStyle } from "./ChatStyles";

export function LoadingIndicator() {
    return (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
                ...mikuBubbleStyle,
                padding: "12px 18px",
                display: "flex",
                gap: 4,
                alignItems: "center",
                minWidth: 40,
                justifyContent: "center",
                minHeight: "1.575rem" // Matches line-height (1.5) * fontSize (1.05rem) of ChatBubble
            }}
            >
                <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    animation: "typing-bounce 1.4s infinite ease-in-out both",
                    animationDelay: "0s"
                }} />
                <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    animation: "typing-bounce 1.4s infinite ease-in-out both",
                    animationDelay: "0.2s"
                }} />
                <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    animation: "typing-bounce 1.4s infinite ease-in-out both",
                    animationDelay: "0.4s"
                }} />
            </div>
        </div>
    );
}
