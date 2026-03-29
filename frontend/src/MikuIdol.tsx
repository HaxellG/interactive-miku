import { useAudioLipsync } from "./hooks/useAudioLipsync";
import { useChat } from "./hooks/useChat";
import { useLive2D } from "./hooks/useLive2D";
import { useCallback, useState, useEffect } from "react";
import type { MotionGroup } from "./types/miku";
import ChatInput from "./components/ChatInput/ChatInput";
import ChatBubble from "./components/ChatBubbles/ChatBubble";
import CreatorInfo from "./components/CreatorInfo/CreatorInfo";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

interface MikuIdolProps {
    isVideoLoaded?: boolean;
}

export default function MikuIdol({ isVideoLoaded = false }: MikuIdolProps) {
    const { mouthOpenRef, playAudio } = useAudioLipsync();
    const { hostRef, playMotion, isLoaded: isLive2DLoaded } = useLive2D({ mouthOpenRef });

    // Loading Screen Orchestration
    const [isFadingOut, setIsFadingOut] = useState(false);
    const isSystemReady = isVideoLoaded && isLive2DLoaded;

    useEffect(() => {
        if (isSystemReady) {
            // Wait an extra 1.5s for the animation to finish and ensure stability
            const timer = setTimeout(() => setIsFadingOut(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [isSystemReady]);

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

    const { messages, draft, isBusy, setDraft, messagesRef, sendMessage, apiError } = useChat({
        onSpeak: playAudio,
        onReaction: handleReaction,
    });

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
            {/* Global System Loading Screen */}
            <LoadingScreen isVisible={true} isFadingOut={isFadingOut} />

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
                {/* Chat History / Bubbles Container */}
                <div className="sci-chat-container" ref={messagesRef}>
                    {messages.map((msg) => (
                        <ChatBubble 
                            key={msg.id} 
                            sender={msg.role} 
                            avatarUrl={`${import.meta.env.BASE_URL}miku-avatar.jpg`} 
                            text={msg.text} 
                        />
                    ))}
                    {isBusy && (
                        <ChatBubble 
                            sender="miku" 
                            avatarUrl={`${import.meta.env.BASE_URL}miku-avatar.jpg`} 
                            text="" 
                            isTypingIndicator 
                        />
                    )}
                </div>

                {/* Chat Input */}
                <ChatInput 
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onSend={sendMessage}
                    isBusy={isBusy}
                    apiError={apiError}
                />
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
                }}
            />

            {/* Creator Info Floating Component */}
            <CreatorInfo />
        </div>
    );
}
