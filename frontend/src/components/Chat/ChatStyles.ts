import type { CSSProperties } from "react";

// ============================================
// COLOR PALETTE (matching reference exactly)
// ============================================
const COLORS = {
    // Outer layer - brightest neon cyan
    outerNeon: "#00F5FF",
    outerGlow: "rgba(0, 245, 255, 0.7)",

    // Middle layer - slightly dimmer cyan
    middleBorder: "#00E5E5",
    middleGlow: "rgba(0, 229, 229, 0.4)",

    // Gap between layers - very dark teal
    gapBackground: "rgba(8, 25, 35, 0.97)",

    // Inner layer - darkest teal
    innerBackground: "rgba(10, 28, 38, 0.95)",
    innerBorder: "rgba(0, 180, 180, 0.35)",

    // Text and accents
    textPrimary: "rgba(255, 255, 255, 0.95)",
    textSecondary: "rgba(200, 230, 240, 0.8)",
};

// ============================================
// LAYER 1: OUTER FRAME (Thick Neon Border)
// ============================================
// The outermost layer - thick glowing cyan border with beveled corners
export const outerFrameStyle: CSSProperties = {
    position: "relative",
    height: "100%",
    padding: 5, // Thicker outer border (5px)
    // Beveled top corners (deeper cut), rounded bottom
    clipPath: "polygon(28px 0, calc(100% - 28px) 0, 100% 28px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 28px)",
    background: `linear-gradient(180deg, ${COLORS.outerNeon} 0%, #00D8D8 100%)`,
    boxShadow: `
        0 0 15px ${COLORS.outerGlow},
        0 0 40px ${COLORS.outerGlow},
        0 0 80px rgba(0, 245, 255, 0.35),
        inset 0 0 25px rgba(0, 245, 255, 0.2)
    `,
};


// ============================================
// LAYER 2: MIDDLE FRAME (Secondary Border + Gap)
// ============================================
// Creates the dark gap and thin inner border effect
export const middleFrameStyle: CSSProperties = {
    position: "relative",
    height: "100%",
    padding: 8, // Gap between outer and inner
    // Same beveled shape, slightly inset
    clipPath: "polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 24px)",
    background: COLORS.gapBackground,
    boxSizing: "border-box",
};

// Thin cyan border inside the gap (optional visual accent)
export const middleBorderStyle: CSSProperties = {
    position: "absolute",
    inset: 2,
    clipPath: "polygon(22px 0, calc(100% - 22px) 0, 100% 22px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 22px)",
    border: `1px solid ${COLORS.middleBorder}`,
    pointerEvents: "none",
    boxShadow: `0 0 8px ${COLORS.middleGlow}`,
};

// ============================================
// LAYER 3: INNER CONTENT AREA
// ============================================
// Where messages and input live
export const innerContentStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    // Slightly different bevel for inner
    clipPath: "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 18px)",
    background: COLORS.innerBackground,
    border: `1px solid ${COLORS.innerBorder}`,
    boxSizing: "border-box",
    overflow: "hidden",
};


// ============================================
// HEADER BAR (Top marquee with decorations)
// ============================================
export const headerBarStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    minHeight: 40,
    borderBottom: `1px solid ${COLORS.innerBorder}`,
    background: "rgba(0, 60, 70, 0.25)",
};

export const headerLeftStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
};

export const headerRightStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 14,
};

// Decorative horizontal lines in header
export const headerLineStyle: CSSProperties = {
    height: 3,
    background: COLORS.middleBorder,
    borderRadius: 2,
    boxShadow: `0 0 6px ${COLORS.middleGlow}`,
};

export const headerButtonStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 22,
    height: 22,
    background: "transparent",
    border: "none",
    color: COLORS.textSecondary,
    fontSize: 16,
    cursor: "pointer",
    padding: 0,
    transition: "color 0.2s ease, text-shadow 0.2s ease",
};

// ============================================
// MESSAGES AREA
// ============================================
export const messagesAreaStyle: CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: "10px 14px",
    background: "transparent",
};

// ============================================
// CHAT BUBBLES
// ============================================
export const baseBubbleStyle: CSSProperties = {
    maxWidth: "85%",
    padding: "12px 18px",
    borderRadius: 12,
    lineHeight: 1.5,
    fontSize: "1.05rem",
    color: COLORS.textPrimary,
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

// ============================================
// INPUT AREA
// ============================================
export const inputContainerGlass: CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "auto",
    margin: "8px 10px 10px 10px",
    padding: "6px 6px 6px 20px",
    borderRadius: 999,
    border: `1px solid ${COLORS.innerBorder}`,
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
    color: COLORS.textPrimary,
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

// Legacy exports for backwards compatibility
export const messageContainerStyle = messagesAreaStyle;
export const chatContainerStyle = innerContentStyle;
export const chatContainerBorderStyle = outerFrameStyle;
export const chatHeaderStyle = headerBarStyle;
