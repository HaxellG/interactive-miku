import { useAudioLipsync } from "./hooks/useAudioLipsync";
import { useChat } from "./hooks/useChat";
import { useLive2D } from "./hooks/useLive2D";
import { ChatBubble } from "./components/Chat/ChatBubble";
import { ChatInput } from "./components/Chat/ChatInput";
import { LoadingIndicator } from "./components/Chat/LoadingIndicator";
import {
    outerFrameStyle,
    middleFrameStyle,
    innerContentStyle,
    headerBarStyle,
    headerLeftStyle,
    headerRightStyle,
    headerButtonStyle,
    headerLineStyle,
    messagesAreaStyle,
} from "./components/Chat/ChatStyles";
import { useCallback } from "react";
import type { MotionGroup } from "./types/miku";


export default function MikuIdol() {
    const { mouthOpenRef, playAudio } = useAudioLipsync();
    const { hostRef, playMotion } = useLive2D({ mouthOpenRef });

    const handleReaction = useCallback((reaction: string) => {
        // Map reactions to Live2D motions
        // mad → Tap index 0, sad → Tap index 1, shy → Flick, surprised → FlickUp
        const reactionMap: Record<string, { group: MotionGroup; index?: number }> = {
            mad: { group: "Tap", index: 0 },
            sad: { group: "Tap", index: 1 },
            shy: { group: "Flick" },
            surprised: { group: "FlickUp" },
        };

        const motion = reactionMap[reaction];
        if (motion) {
            playMotion(motion.group, motion.index);
        }
        // natural or unknown reactions: do nothing
    }, [playMotion]);

    const { messages, draft, isBusy, setDraft, messagesRef, sendMessage } = useChat({
        onSpeak: playAudio,
        onReaction: handleReaction,
    });

    const handleBubbleUpdate = useCallback(() => {
        const el = messagesRef.current;
        if (!el) return;
        // Smart scroll: if we are close to bottom, stick to bottom.
        const threshold = 150; // generous threshold to catch user reading near bottom
        const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
        if (isNearBottom) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messagesRef]);

    return (
        <div
            style={{
                height: "100%",
                padding: 18,
                boxSizing: "border-box",
                display: "grid",
                gridTemplateColumns: "minmax(360px, 520px) 1fr",
                gap: 18,
            }}
        >
            {/* LEFT: Chat Interface */}
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "80px",
                    marginRight: "20px",
                    justifyContent: "center",
                    paddingTop: "30px",
                    paddingBottom: "30px",
                    boxSizing: "border-box",
                    minHeight: 0,
                }}
            >
                {/* LAYER 1: Outer neon frame (brightest glow) */}
                <div style={outerFrameStyle}>
                    {/* LAYER 2: Middle frame (dark gap) */}
                    <div style={middleFrameStyle}>
                        {/* LAYER 3: Inner content area */}
                        <div style={innerContentStyle}>
                            {/* Header bar with decorative lines and controls */}
                            <div style={headerBarStyle}>
                                {/* Left: decorative lines */}
                                <div style={headerLeftStyle}>
                                    <div style={{ ...headerLineStyle, width: 24 }} />
                                    <div style={{ ...headerLineStyle, width: 16, opacity: 0.7 }} />
                                    <div style={{ ...headerLineStyle, width: 10, opacity: 0.5 }} />
                                </div>

                                {/* Right: minimize and close buttons */}
                                <div style={headerRightStyle}>
                                    <button style={headerButtonStyle} aria-label="Minimize">
                                        ─
                                    </button>
                                    <button style={headerButtonStyle} aria-label="Close chat">
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Messages List */}
                            <div ref={messagesRef} className="no-scrollbar" style={messagesAreaStyle}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingRight: 6 }}>
                                    {messages.map((m) => (
                                        <ChatBubble key={m.id} message={m} onUpdate={handleBubbleUpdate} />
                                    ))}
                                    {isBusy && <LoadingIndicator />}
                                </div>
                            </div>

                            {/* Input Area */}
                            <ChatInput
                                draft={draft}
                                isBusy={isBusy}
                                setDraft={setDraft}
                                onSend={sendMessage}
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* RIGHT: Live2D Canvas */}
            <div
                ref={hostRef}
                style={{
                    height: "100%",
                    minHeight: 520,
                    background: "transparent",
                    border: "none",
                    borderRadius: 0,
                    overflow: "hidden"
                }}
            />
        </div>
    );
}
