import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme } from "./theme";

export const INTRO_DURATION = 96;

const TITLE = "stop-slop";

const clampBoth = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  const typed = Math.round(
    interpolate(frame, [10, 46], [0, TITLE.length], clampBoth),
  );
  const caretOn = Math.floor(frame / 14) % 2 === 0;

  const subtitle = interpolate(frame, [52, 74], [0, 1], {
    ...clampBoth,
    easing: Easing.out(Easing.cubic),
  });

  const fade = interpolate(
    frame,
    [INTRO_DURATION - 16, INTRO_DURATION],
    [1, 0],
    clampBoth,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, opacity: fade }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${theme.panel} 0%, ${theme.bg} 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily: theme.mono,
            fontSize: 128,
            color: theme.text,
            letterSpacing: -2,
            whiteSpace: "pre",
          }}
        >
          {TITLE.slice(0, typed)}
          <span style={{ color: theme.accent, opacity: caretOn ? 1 : 0 }}>
            _
          </span>
        </div>
        <div
          style={{
            marginTop: 34,
            fontFamily: theme.mono,
            fontSize: 32,
            letterSpacing: 3,
            color: theme.dim,
            opacity: subtitle,
            transform: `translateY(${(1 - subtitle) * 14}px)`,
          }}
        >
          Remove AI tells from prose.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
