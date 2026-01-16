export type Role = "user" | "miku";

export type ChatMessage = {
    id: string;
    role: Role;
    text: string;
};

export type MotionGroup = "Idle" | "Tap" | "Flick" | "FlickUp";
