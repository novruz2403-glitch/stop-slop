import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Sentence } from "./Sentence";
import { Glyph } from "./Glyph";
import { theme, CHAR_RATIO } from "./theme";
import type { Example } from "./examples";

const FONT_SIZE = 58;
const MAX_COLS = 45;

export const SCENE_DURATION = 180;

const ease = { easing: Easing.inOut(Easing.cubic) } as const;
const clampBoth = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const Scene: React.FC<{ example: Example }> = ({ example }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 30], [0, 1], {
    ...clampBoth,
    easing: Easing.out(Easing.cubic),
  });
  const mark = interpolate(frame, [38, 60], [0, 1], clampBoth);
  const strike = interpolate(frame, [54, 82], [0, 1], {
    ...clampBoth,
    ...ease,
  });
  const collapse = interpolate(frame, [92, 128], [0, 1], {
    ...clampBoth,
    ...ease,
  });

  const labelIn = interpolate(frame, [4, 22], [0, 1], clampBoth);
  const glyphDraw = interpolate(frame, [10, 46], [0, 1], {
    ...clampBoth,
    easing: Easing.out(Easing.quad),
  });
  // The drawing straightens itself on the same beat the slop drops out.
  const glyphResolve = interpolate(frame, [96, 132], [0, 1], {
    ...clampBoth,
    ...ease,
  });
  const counterIn = interpolate(frame, [130, 148], [0, 1], {
    ...clampBoth,
    easing: Easing.out(Easing.cubic),
  });
  const rule = interpolate(frame, [126, 154], [0, 1], { ...clampBoth, ...ease });

  const fade =
    interpolate(frame, [0, 12], [0, 1], clampBoth) *
    interpolate(
      frame,
      [SCENE_DURATION - 16, SCENE_DURATION],
      [1, 0],
      clampBoth,
    );

  const keptWords = example.tokens.filter((t) => !t.cut);
  const finalText = keptWords
    .map((t) => t.afterText ?? t.text)
    .join(" ");
  const ruleWidth =
    Math.min(finalText.length, MAX_COLS) * FONT_SIZE * CHAR_RATIO;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, opacity: fade }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, ${theme.panel} 0%, ${theme.bg} 68%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 132,
          width: "100%",
          textAlign: "center",
          fontFamily: theme.mono,
          fontSize: 24,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: theme.accent,
          opacity: labelIn,
          transform: `translateY(${(1 - labelIn) * 12}px)`,
        }}
      >
        {example.label}
      </div>

      <div
        style={{
          position: "absolute",
          top: 218,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: labelIn,
        }}
      >
        <Glyph
          kind={example.glyph}
          draw={glyphDraw}
          resolve={glyphResolve}
          size={196}
        />
      </div>

      <AbsoluteFill style={{ justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <Sentence
            tokens={example.tokens}
            fontSize={FONT_SIZE}
            maxCols={MAX_COLS}
            enter={enter}
            mark={mark}
            strike={strike}
            collapse={collapse}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: FONT_SIZE * 0.85,
              width: ruleWidth * rule,
              height: 3,
              marginLeft: (-ruleWidth * rule) / 2,
              background: theme.accent,
              borderRadius: 2,
              opacity: 0.85,
            }}
          />
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          bottom: 138,
          width: "100%",
          textAlign: "center",
          fontFamily: theme.mono,
          fontSize: 26,
          letterSpacing: 2,
          opacity: counterIn,
          transform: `translateY(${(1 - counterIn) * 10}px)`,
        }}
      >
        <span style={{ color: theme.dim }}>
          {example.tokens.length} words
        </span>
        <span style={{ color: theme.dim }}>{"  →  "}</span>
        <span style={{ color: theme.accent }}>{keptWords.length} words</span>
      </div>
    </AbsoluteFill>
  );
};
