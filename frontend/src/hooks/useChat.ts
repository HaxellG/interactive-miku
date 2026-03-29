import { useState, useRef, useEffect } from "react";
import axios from "axios";
import type { ChatMessage } from "../types/miku";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

function uid() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

interface UseChatProps {
    onSpeak: (text: string) => Promise<void>;
    onReaction: (reaction: string) => void;
}

export function useChat({ onSpeak, onReaction }: UseChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState("");
    const [isBusy, setIsBusy] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const messagesRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll logic
    useEffect(() => {
        const el = messagesRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [messages.length]);

    async function sendMessage() {
        const content = draft.trim();
        if (!content || isBusy) return;

        setDraft("");

        const userMsg: ChatMessage = { id: uid(), role: "user", text: content };
        setMessages((m) => [...m, userMsg]);

        setIsBusy(true);
        try {
            const chatRes = await axios.post(`${API_BASE}/chat`, { message: content });
            const assistantText: string = (chatRes?.data?.text ?? "").trim() || "…";
            const mikuReaction: string = (chatRes?.data?.reaction ?? "natural");
            // const albumId: string = (chatRes?.data?.album_id); // Future implementation
            // const trackId: string = (chatRes?.data?.track_id); // Future implementation

            // Removes emojis and URLs from TTS
            const processedAssistantText = assistantText
                .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
                .replace(/(https?:\/\/[^\s]+)/g, '')
                .trim();

            const mikuMessage: ChatMessage = { id: uid(), role: "miku", text: assistantText };

            // Trigger reaction animation
            onReaction(mikuReaction);

            // Add Miku's message to the chat
            setIsBusy(false);
            setMessages((m) => [...m, mikuMessage]);

            // Speak Miku's message
            await onSpeak(processedAssistantText);
        } catch (e) {
            console.error(e);
            let errorMessage = "[ SYSTEM ERROR: COULD NOT CONTACT THE SERVER ]";
            if (axios.isAxiosError(e) && e.response?.status === 429) {
                errorMessage = "[ WARNING: TOO MANY MESSAGES. PLEASE WAIT ]";
            }
            onReaction("surprised");
            setApiError(errorMessage);
            setTimeout(() => setApiError(null), 5000);
            setIsBusy(false);
        }

    }

    return {
        messages,
        draft,
        setDraft,
        isBusy,
        messagesRef,
        sendMessage,
        apiError,
    };
}
