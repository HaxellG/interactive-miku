import "./ChatInput.css";

/**
 * Sci-Fi HUD Chat Input — V3 (Structural & Precision Geometry)
 * 
 * Accurately replicates the exact polygonal silhouettes:
 * - Wider button, steeper parallel gap.
 * - Structural top notch and symmetric bottom notch.
 * - Massive overlapping inner glow wash.
 * - Translucent glass tints instead of solid fills.
 */
export default function ChatInput() {
  // ─── EXACT GEOMETRY COORDINATES ───
  // Uses a 600x56 viewBox canvas.

  // Input Field Panel:
  // - Starts with a 3-facet left edge [16,2 -> 4,16 -> 4,40 -> 16,54]
  // - Massive Structural top notch shifted right, less deep [205,2 -> 209,6 -> 411,6 -> 415,2] width 210
  // - Steeper, parallel ascending diagonal right edge [510,2 -> 460,54] width=50
  // - Massive Structural bottom notch [415,54 -> 411,50 -> 209,50 -> 205,54] perfectly aligned
  const INPUT_POLY = "16,2 205,2 209,6 411,6 415,2 510,2 460,54 415,54 411,50 209,50 205,54 16,54 4,40 4,16";



  // Send Button Panel (Compact Irregular Hexagon, wider):
  // - Left diagnostic edge perfectly parallel to input [522,2 -> 472,54] (Exactly 12px gap)
  // - Top right and bottom right corners chamfered/beveled cleanly
  const BUTTON_POLY = "522,2 584,2 596,14 596,40 584,54 472,54";

  // Send Arrow Icon (Segmented Sci-Fi arrow):
  // - Top wing: left tip [534,13], shared right tip [566,28], inner corner [544,27]
  // - Bottom wing: left tip [534,43], shared right tip [566,28], inner corner [544,29]
  const ICON_WING_TOP = "534,13 566,28 544,27";
  const ICON_WING_BOT = "534,43 566,28 544,29";

  return (
    <div className="chat-input-wrapper">
      {/* ── BACKGROUND VECTOR LAYER ── */}
      <svg
        className="sci-svg-bg"
        viewBox="0 0 600 56"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Clip masks ensure the inner glow adheres perfectly to the edges without bleeding outward */}
          <clipPath id="inputClipMask">
            <polygon points={INPUT_POLY} />
          </clipPath>
          <clipPath id="btnClipMask">
            <polygon points={BUTTON_POLY} />
          </clipPath>

          {/* Outer glow filters (tight halo) */}
          <filter id="glowOuterTight" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
          </filter>
          
          {/* Inner Glow Filters (massive deep wash of light) */}
          <filter id="glowInnerWash" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" result="blur" />
          </filter>
          <filter id="glowInnerRim" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
          </filter>
        </defs>

        {/* ── 1. INPUT PANEL (Teal / Cyan) ── */}
        <g className="sci-input-group">
          {/* C] Tight Outer Halo */}
          <polygon
            points={INPUT_POLY}
            fill="none"
            stroke="var(--in-outer-glow)"
            strokeWidth="4"
            filter="url(#glowOuterTight)"
          />
          {/* A] Base Translucent Fill (Glass) */}
          <polygon points={INPUT_POLY} fill="var(--in-fill)" />

          {/* B1] Massive Inner Glow Wash (Thick stroke, deep blur) */}
          <polygon
            points={INPUT_POLY}
            fill="none"
            stroke="var(--in-inner-glow)"
            strokeWidth="24"
            clipPath="url(#inputClipMask)"
            filter="url(#glowInnerWash)"
          />
          {/* B2] Tight Inner Glow Rim */}
          <polygon
             points={INPUT_POLY}
             fill="none"
             stroke="var(--in-inner-glow)"
             strokeWidth="10"
             clipPath="url(#inputClipMask)"
             filter="url(#glowInnerRim)"
          />

          {/* D] Sharp Primary Border Limit */}
          <polygon
            points={INPUT_POLY}
            fill="none"
            stroke="var(--in-border)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* ── 2. SEND BUTTON PANEL (Glacial Blue) ── */}
        <g className="sci-btn-group">
          {/* C] Tight Outer Halo */}
          <polygon
            points={BUTTON_POLY}
            fill="none"
            stroke="var(--btn-outer-glow)"
            strokeWidth="5"
            filter="url(#glowOuterTight)"
          />
          {/* A] Base Translucent Fill (Glass) */}
          <polygon points={BUTTON_POLY} fill="var(--btn-fill)" />

          {/* B1] Massive Inner Glow Wash */}
          <polygon
            points={BUTTON_POLY}
            fill="none"
            stroke="var(--btn-inner-glow)"
            strokeWidth="28"
            clipPath="url(#btnClipMask)"
            filter="url(#glowInnerWash)"
          />
          {/* B2] Tight Inner Glow Rim */}
          <polygon
             points={BUTTON_POLY}
             fill="none"
             stroke="var(--btn-inner-glow)"
             strokeWidth="12"
             clipPath="url(#btnClipMask)"
             filter="url(#glowInnerRim)"
          />

          {/* D] Sharp Primary Border Limit */}
          <polygon
            points={BUTTON_POLY}
            fill="none"
            stroke="var(--btn-border)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* ── 3. SEND ICON (Segmented dual-wing arrow) ── */}
          <polygon
            points={ICON_WING_TOP}
            fill="var(--btn-icon)"
            filter="url(#glowOuterTight)"
          />
          <polygon
            points={ICON_WING_BOT}
            fill="var(--btn-icon)"
            filter="url(#glowOuterTight)"
          />
          <polygon
            points={ICON_WING_TOP}
            fill="var(--btn-icon-core)"
          />
          <polygon
            points={ICON_WING_BOT}
            fill="var(--btn-icon-core)"
          />
        </g>
      </svg>

      {/* ── FOREGROUND CONTENT ── */}
      <div className="sci-input-content">
        <input
          type="text"
          className="sci-input-field"
          placeholder="Chat with Miku..."
          readOnly
        />
      </div>
    </div>
  );
}
