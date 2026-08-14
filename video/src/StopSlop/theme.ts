export const theme = {
  bg: "#0E0E10",
  panel: "#17171B",
  text: "#F5F3EF",
  dim: "#71717F",
  cut: "#FF5D47",
  accent: "#5FE3A1",
  mono: `"DejaVu Sans Mono", "Liberation Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,
};

// Advance width of a glyph in the mono stack, as a fraction of the font size.
// DejaVu Sans Mono and Liberation Mono both sit at ~0.602em, which lets us place
// every word analytically instead of measuring the DOM.
export const CHAR_RATIO = 0.602;
