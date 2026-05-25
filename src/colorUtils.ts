/**
 * Utility functions for color manipulation and analysis.
 */

/**
 * Parses a hex color string and returns its RGB components.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace(/^#/, "");

  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(cleaned)) {
    return null;
  }

  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/**
 * Converts an RGB color to a hex string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Determines whether a hex color is considered "dark" based on its perceived luminance.
 * Useful for choosing foreground text color (black vs white) automatically.
 */
export function isDarkColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) throw new Error(`Invalid hex color: ${hex}`);
  // Perceived brightness formula (ITU-R BT.601)
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness < 128;
}

/**
 * Suggests a readable foreground color (black or white) for a given background hex color.
 */
export function suggestForeground(backgroundHex: string): string {
  return isDarkColor(backgroundHex) ? "#ffffff" : "#000000";
}

/**
 * Validates whether a string is a valid hex color.
 */
export function isValidHex(hex: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
}
