import { useState, useEffect } from "react";

export function useTypewriter(text: string, speed = 20, enabled = true) {
    const [displayedContent, setDisplayedContent] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!enabled) {
            setDisplayedContent(text);
            setIsTyping(false);
            return;
        }

        // Initialize with empty state
        setDisplayedContent("");
        setIsTyping(true);

        let i = 0;
        const interval = setInterval(() => {
            i++;
            // Slice from source text
            setDisplayedContent(text.slice(0, i));

            if (i >= text.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, enabled, speed]);

    return { displayText: displayedContent, isTyping };
}
