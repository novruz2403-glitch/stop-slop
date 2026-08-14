import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme } from "./theme";

export const OUTRO_DURATION = 108;

const clampBoth = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const line = (frame: number, start: number) =>
  interpolate(frame, [start, start + 20], [0, 1], {
    ...clampBoth,
    easing: Easing.out(Easing.cubic),
  });

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const title = line(frame, 6);
  const rule = interpolate(frame, [24, 52], [0, 1], {
    ...clampBoth,
    easing: Easing.inOut(Easing.cubic),
  });
  const credit = line(frame, 44);

  const fade = interpolate(
    frame,
    [OUTRO_DURATION - 20, OUTRO_DURATION],
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
            fontSize: 104,
            color: theme.text,
            letterSpacing: -2,
            opacity: title,
            transform: `translateY(${(1 - title) * 16}px)`,
          }}
        >
          stop-slop
        </div>

        <div
          style={{
            marginTop: 30,
            width: 360 * rule,
            height: 3,
            background: theme.accent,
            borderRadius: 2,
            opacity: 0.85,
          }}
        />

        <div
          style={{
            marginTop: 30,
            fontFamily: theme.mono,
            fontSize: 28,
            letterSpacing: 3,
            color: theme.dim,
            opacity: credit,
            transform: `translateY(${(1 - credit) * 12}px)`,
            textAlign: "center",
            lineHeight: 1.7,
          }}
        >
          A skill for Claude
          <br />
          Hardik Pandya · MIT
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
