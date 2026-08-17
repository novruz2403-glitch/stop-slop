import type { GlyphKind } from "./Glyph";

export type Token = {
  text: string;
  /** Marked for removal — reddened, struck through, then dropped. */
  cut?: boolean;
  /** Replacement once the cut words are gone (capitalisation fixes). */
  afterText?: string;
};

export type Example = {
  label: string;
  /** Line drawing above the sentence, picked to match what it says. */
  glyph: GlyphKind;
  tokens: Token[];
};

const token = (text: string): Token => ({ text });
const cut = (text: string): Token => ({ text, cut: true });

/**
 * Each example removes words and nothing else, so what the animation deletes
 * is exactly what the skill deletes. Rules come from references/phrases.md.
 */
export const examples: Example[] = [
  {
    label: "Adverbs · Emphasis crutches",
    glyph: "blocks",
    tokens: [
      token("Building"),
      token("products"),
      token("is"),
      cut("really"),
      token("hard."),
      cut("Let"),
      cut("that"),
      cut("sink"),
      cut("in."),
    ],
  },
  {
    label: "Throat-clearing openers",
    glyph: "arrows",
    tokens: [
      cut("Here's"),
      cut("the"),
      cut("thing:"),
      { text: "teams", afterText: "Teams" },
      token("struggle"),
      token("with"),
      token("alignment."),
      cut("And"),
      cut("that's"),
      cut("okay."),
    ],
  },
  {
    label: "Vague declaratives · Meta-commentary",
    glyph: "plane",
    tokens: [
      token("Ship"),
      token("the"),
      token("fix"),
      token("today."),
      cut("The"),
      cut("implications"),
      cut("are"),
      cut("significant."),
      cut("Let"),
      cut("me"),
      cut("walk"),
      cut("you"),
      cut("through"),
      cut("it."),
    ],
  },
];
