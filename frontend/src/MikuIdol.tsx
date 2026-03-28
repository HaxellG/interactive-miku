import { useAudioLipsync } from "./hooks/useAudioLipsync";
import { useChat } from "./hooks/useChat";
import { useLive2D } from "./hooks/useLive2D";
import { useCallback } from "react";
import type { MotionGroup } from "./types/miku";
import ChatInput from "./components/ChatInput/ChatInput";
import ChatBubble from "./components/ChatBubbles/ChatBubble";
import CreatorInfo from "./components/CreatorInfo/CreatorInfo";

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
                {/* Chat History / Bubbles Container */}
                <div className="sci-chat-container" ref={messagesRef}>
                    <ChatBubble sender="miku" avatarUrl="/miku-avatar.jpg" text="Hola! Soy Miku. ¿De qué te gustaría hablar hoy?" />
                    <ChatBubble sender="user" text="¡Hola Miku! Me encanta tu interfaz futurista, es asombrosa." />
                    <ChatBubble sender="miku" avatarUrl="/miku-avatar.jpg" text="¡Gracias! Ha sido diseñada especialmente para encajar con el estilo ciberpunk y HUD que tanto nos gusta." />
                    <ChatBubble sender="user" text="Quedó increíble el diseño, las burbujas y las luces se ven geniales." />
                    <ChatBubble sender="miku" avatarUrl="/miku-avatar.jpg" text="Me alegra mucho que te guste. El diseño utiliza SVG y CSS avanzado para los efectos neón." />
                    <ChatBubble sender="user" text="¡Sí! Y los láseres de luz detrás de cada mensaje le dan mucha vida." />
                    <ChatBubble sender="miku" avatarUrl="/miku-avatar.jpg" text="Además ahora el chat tiene una barra de scroll personalizada para que puedas leer todo nuestro historial sin perder la estética HUD." />
                    <ChatBubble sender="user" text="Perfecto, vamos a seguir programando los siguientes módulos entonces." />
                </div>

                {/* Chat Input */}
                <ChatInput />
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
