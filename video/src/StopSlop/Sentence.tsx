import React from "react";
import { interpolateColors } from "remotion";
import { CHAR_RATIO, theme } from "./theme";
import { layout, type Pos } from "./layout";
import type { Token } from "./examples";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type Props = {
  tokens: Token[];
  fontSize: number;
  maxCols: number;
  /** Words fading in, staggered left to right. */
  enter: number;
  /** Cut words turning red. */
  mark: number;
  /** Strike-through drawing across the cut words. */
  strike: number;
  /** Cut words dropping out while the survivors slide together. */
  collapse: number;
};

export const Sentence: React.FC<Props> = ({
  tokens,
  fontSize,
  maxCols,
  enter,
  mark,
  strike,
  collapse,
}) => {
  const charW = fontSize * CHAR_RATIO;
  const lineH = fontSize * 1.55;

  const beforePos = layout(
    tokens.map((t) => t.text),
    maxCols,
  );

  const keptIndices = tokens
    .map((t, i) => (t.cut ? -1 : i))
    .filter((i) => i >= 0);

  const keptPos = layout(
    keptIndices.map((i) => tokens[i].afterText ?? tokens[i].text),
    maxCols,
  );

  const afterPos = new Map<number, Pos>();
  keptIndices.forEach((tokenIndex, n) => {
    afterPos.set(tokenIndex, keptPos[n]);
  });

  const move = easeInOut(clamp01(collapse));
  const cutTotal = tokens.filter((t) => t.cut).length;
  let cutSeen = -1;

  return (
    <div style={{ position: "relative", width: "100%", height: 0 }}>
      {tokens.map((t, i) => {
        if (t.cut) {
          cutSeen += 1;
        }
        const cutOrder = t.cut ? cutSeen : 0;

        const from = beforePos[i];
        const to = afterPos.get(i) ?? from;
        const x = (from.x + (to.x - from.x) * move) * charW;
        const y = (from.y + (to.y - from.y) * move) * lineH;

        // Stagger each effect across the words so the line reads as it changes.
        const spread = 0.55;
        const share = tokens.length > 1 ? i / (tokens.length - 1) : 0;
        const appear = clamp01((enter - share * spread) / (1 - spread));

        const cutShare = cutTotal > 1 ? cutOrder / (cutTotal - 1) : 0;
        const reddening = clamp01((mark - cutShare * 0.4) / 0.6);
        const struck = clamp01((strike - cutShare * 0.5) / 0.5);
        const vanish = clamp01((collapse - cutShare * 0.3) / 0.45);

        const color = t.cut
          ? interpolateColors(reddening, [0, 1], [theme.text, theme.cut])
          : theme.text;

        const opacity = t.cut ? appear * (1 - vanish) : appear;
        const lift = t.cut ? -vanish * fontSize * 0.45 : 0;
        const enterLift = (1 - appear) * fontSize * 0.3;

        const label = t.afterText && move > 0.5 ? t.afterText : t.text;

        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              transform: `translate(${x}px, ${y + lift + enterLift - fontSize * 0.75}px)`,
              whiteSpace: "pre",
              fontFamily: theme.mono,
              fontSize,
              lineHeight: 1,
              color,
              opacity,
              filter: t.cut && vanish > 0 ? `blur(${vanish * 5}px)` : undefined,
            }}
          >
            {label}
            {t.cut && struck > 0 ? (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "48%",
                  height: Math.max(2, fontSize * 0.055),
                  width: `${struck * 100}%`,
                  background: theme.cut,
                  borderRadius: 2,
                }}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
};
