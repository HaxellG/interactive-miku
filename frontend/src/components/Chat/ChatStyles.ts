import type { CSSProperties } from "react";

// Base styles for bubbles (common props)
export const baseBubbleStyle: CSSProperties = {
    maxWidth: "85%",
    padding: "12px 18px",
    borderRadius: 12,
    lineHeight: 1.5,
    fontSize: "1.05rem",
    color: "rgba(255, 255, 255, 0.9)",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
};

export const userBubbleStyle: CSSProperties = {
    ...baseBubbleStyle,
    background: "rgba(255, 255, 255, 0.15)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderBottomRightRadius: 2,
};

export const mikuBubbleStyle: CSSProperties = {
    ...baseBubbleStyle,
    background: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderBottomLeftRadius: 2,
};

export const inputContainerGlass: CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "auto",
    marginLeft: 4,
    marginRight: 10,
    padding: "6px 6px 6px 20px",
    borderRadius: 999,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    background: "rgba(40, 40, 40, 0.5)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
};

export const transparentInput: CSSProperties = {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "rgba(255, 255, 255, 0.95)",
    fontSize: "1rem",
    resize: "none",
    minHeight: 24,
    maxHeight: 120,
    fontFamily: "inherit",
    paddingRight: 10,
    lineHeight: "24px",
    marginTop: 1,
};

export const sendButtonGlass: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "none",
    background: "rgba(255, 255, 255, 0.15)",
    color: "rgba(255, 255, 255, 1)",
    transition: "all 0.2s",
};

export const tinyPillGlass: CSSProperties = {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.92)",
    boxShadow: "0 8px 18px rgba(0,0,0,0.16)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    cursor: "pointer",
    userSelect: "none",
    fontSize: 13,
    lineHeight: 1,
};

export const messageContainerStyle: CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: "6px 4px",
    background: "transparent",
    border: "none",
}
