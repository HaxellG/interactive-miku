
import type { MotionGroup } from "../../types/miku";
import { tinyPillGlass } from "./ChatStyles";

// Moving motionButtons definition here as it's static config
const MOTION_BUTTONS: Array<{ label: string; group: MotionGroup; index?: number }> = [
    { label: "idle", group: "Idle" },
    { label: "tap#1", group: "Tap", index: 0 },
    { label: "tap#2", group: "Tap", index: 1 },
    { label: "flick", group: "Flick" },
    { label: "flickUp", group: "FlickUp" },
];

interface MotionButtonsProps {
    onMotion: (group: MotionGroup, index?: number) => void;
}

export function MotionButtons({ onMotion }: MotionButtonsProps) {
    return (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingLeft: 2 }}>
            {MOTION_BUTTONS.map((b) => (
                <button
                    key={b.label}
                    onClick={() => onMotion(b.group, b.index)}
                    style={tinyPillGlass}
                    title="legacy motion"
                >
                    {b.label}
                </button>
            ))}
        </div>
    );
}
