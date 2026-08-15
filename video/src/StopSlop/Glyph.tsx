import React from "react";
import { interpolateColors } from "remotion";
import { theme } from "./theme";

export type GlyphKind = "blocks" | "arrows" | "plane";

type Props = {
  kind: GlyphKind;
  /** Strokes drawing themselves in, 0 to 1. */
  draw: number;
  /** The drawing settling as the slop comes out, 0 to 1. */
  resolve: number;
  size: number;
};

const STROKE = 3.4;

/**
 * pathLength normalises every path to 1, so a dash offset of 1 - draw walks
 * the stroke on at the same rate whatever the real geometry measures.
 */
const strokeProps = (draw: number, color: string) => ({
  fill: "none",
  stroke: color,
  strokeWidth: STROKE,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1 - draw,
});

const Blocks: React.FC<{ draw: number; resolve: number; color: string }> = ({
  draw,
  resolve,
  color,
}) => {
  // The top block sits askew until the sentence is cleaned up.
  const tilt = -13 * (1 - resolve);
  const lift = 5 * (1 - resolve);

  return (
    <>
      <rect x={38} y={138} width={124} height={34} rx={4} {...strokeProps(draw, color)} />
      <rect x={52} y={100} width={96} height={34} rx={4} {...strokeProps(draw, color)} />
      <g transform={`rotate(${tilt} 100 79) translate(0 ${-lift})`}>
        <rect x={64} y={62} width={72} height={34} rx={4} {...strokeProps(draw, color)} />
      </g>
    </>
  );
};

const ARROW = "M -38 0 L 38 0 M 22 -14 L 38 0 L 22 14";
const SCATTER = [-38, 41, 166, -122];
const SEATS = [
  [54, 64],
  [146, 64],
  [54, 140],
  [146, 140],
];

const Arrows: React.FC<{ draw: number; resolve: number; color: string }> = ({
  draw,
  resolve,
  color,
}) => (
  <>
    {SEATS.map(([cx, cy], i) => (
      <g
        key={i}
        transform={`translate(${cx} ${cy}) rotate(${SCATTER[i] * (1 - resolve)}) scale(1)`}
      >
        <path d={ARROW} {...strokeProps(draw, color)} strokeWidth={4.2} />
      </g>
    ))}
  </>
);

const Plane: React.FC<{ draw: number; resolve: number; color: string }> = ({
  draw,
  resolve,
  color,
}) => (
  <g transform={`translate(${resolve * 26} ${-resolve * 20})`}>
    <path
      d="M 26 108 L 176 46 L 122 168 L 98 122 Z"
      {...strokeProps(draw, color)}
    />
    <path d="M 26 108 L 98 122 L 176 46" {...strokeProps(draw, color)} />
    <path
      d="M 30 150 L 70 132 M 44 176 L 88 156"
      {...strokeProps(draw, color)}
      strokeDashoffset={1 - draw * resolve}
      opacity={0.75}
    />
  </g>
);

export const Glyph: React.FC<Props> = ({ kind, draw, resolve, size }) => {
  const color = interpolateColors(resolve, [0, 1], [theme.dim, theme.accent]);

  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      {kind === "blocks" ? (
        <Blocks draw={draw} resolve={resolve} color={color} />
      ) : null}
      {kind === "arrows" ? (
        <Arrows draw={draw} resolve={resolve} color={color} />
      ) : null}
      {kind === "plane" ? (
        <Plane draw={draw} resolve={resolve} color={color} />
      ) : null}
    </svg>
  );
};
