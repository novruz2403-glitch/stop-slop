export type Pos = { x: number; y: number };

/**
 * Places words on wrapped, centered lines.
 *
 * Coordinates come back in character units (x) and line units (y), both
 * measured from the centre of the block, so the caller multiplies by the
 * glyph advance and the line height to get pixels.
 */
export const layout = (words: string[], maxCols: number): Pos[] => {
  const cells: { line: number; col: number }[] = [];
  let line = 0;
  let col = 0;

  for (const word of words) {
    if (col > 0 && col + 1 + word.length > maxCols) {
      line += 1;
      col = 0;
    }
    if (col > 0) {
      col += 1;
    }
    cells.push({ line, col });
    col += word.length;
  }

  const lineWidths: number[] = [];
  cells.forEach((cell, i) => {
    const end = cell.col + words[i].length;
    lineWidths[cell.line] = Math.max(lineWidths[cell.line] ?? 0, end);
  });

  const lineCount = lineWidths.length;

  return cells.map((cell) => ({
    x: cell.col - lineWidths[cell.line] / 2,
    y: cell.line - (lineCount - 1) / 2,
  }));
};
