/**
 * WCAG contrast ratio calculation utilities
 */

/**
 * Converts a hex color string to relative luminance (WCAG 2.1)
 */
export function hexToLuminance(hex: string): number {
  const clean = hex.replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    throw new Error(`Invalid hex color: "${hex}"`);
  }

  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const toLinear = (c: number): number =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculates the WCAG contrast ratio between two hex colors.
 * Returns a value between 1 and 21.
 */
export function contrastRatio(foreground: string, background: string): number {
  const l1 = hexToLuminance(foreground);
  const l2 = hexToLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export const WCAG_THRESHOLDS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
} as const;

export type WcagLevel = 'AA' | 'AAA';
export type TextSize = 'normal' | 'large';

/**
 * Checks whether a contrast ratio passes a given WCAG level and text size.
 */
export function passesWcag(
  ratio: number,
  level: WcagLevel,
  size: TextSize = 'normal'
): boolean {
  if (level === 'AAA') {
    return ratio >= (size === 'large' ? WCAG_THRESHOLDS.AAA_LARGE : WCAG_THRESHOLDS.AAA_NORMAL);
  }
  return ratio >= (size === 'large' ? WCAG_THRESHOLDS.AA_LARGE : WCAG_THRESHOLDS.AA_NORMAL);
}

/**
 * Returns the highest WCAG level and size combination passed for a given
 * foreground/background color pair, or null if no level is met.
 *
 * Example: { level: 'AAA', size: 'normal' } means the pair passes AAA for normal text.
 */
export function wcagResult(
  foreground: string,
  background: string
): { level: WcagLevel; size: TextSize } | null {
  const ratio = contrastRatio(foreground, background);
  if (passesWcag(ratio, 'AAA', 'normal')) return { level: 'AAA', size: 'normal' };
  if (passesWcag(ratio, 'AAA', 'large')) return { level: 'AAA', size: 'large' };
  if (passesWcag(ratio, 'AA', 'normal')) return { level: 'AA', size: 'normal' };
  if (passesWcag(ratio, 'AA', 'large')) return { level: 'AA', size: 'large' };
  return null;
}
