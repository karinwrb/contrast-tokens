import { hexToLuminance, contrastRatio, passesWcag } from './contrast';

describe('hexToLuminance', () => {
  it('returns 0 for pure black', () => {
    expect(hexToLuminance('#000000')).toBeCloseTo(0, 5);
  });

  it('returns 1 for pure white', () => {
    expect(hexToLuminance('#ffffff')).toBeCloseTo(1, 5);
  });

  it('handles hex without leading #', () => {
    expect(() => hexToLuminance('ffffff')).not.toThrow();
  });

  it('throws on invalid hex', () => {
    expect(() => hexToLuminance('#xyz123')).toThrow('Invalid hex color');
    expect(() => hexToLuminance('#fff')).toThrow('Invalid hex color');
  });
});

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBe(21);
  });

  it('returns 1 for identical colors', () => {
    expect(contrastRatio('#888888', '#888888')).toBe(1);
  });

  it('is symmetric (foreground/background order does not matter)', () => {
    const a = contrastRatio('#ff0000', '#ffffff');
    const b = contrastRatio('#ffffff', '#ff0000');
    expect(a).toBe(b);
  });

  it('returns a value between 1 and 21', () => {
    const ratio = contrastRatio('#1a73e8', '#ffffff');
    expect(ratio).toBeGreaterThanOrEqual(1);
    expect(ratio).toBeLessThanOrEqual(21);
  });
});

describe('passesWcag', () => {
  it('passes AA normal at 4.5+', () => {
    expect(passesWcag(4.5, 'AA', 'normal')).toBe(true);
    expect(passesWcag(4.49, 'AA', 'normal')).toBe(false);
  });

  it('passes AA large at 3.0+', () => {
    expect(passesWcag(3.0, 'AA', 'large')).toBe(true);
    expect(passesWcag(2.99, 'AA', 'large')).toBe(false);
  });

  it('passes AAA normal at 7.0+', () => {
    expect(passesWcag(7.0, 'AAA', 'normal')).toBe(true);
    expect(passesWcag(6.99, 'AAA', 'normal')).toBe(false);
  });

  it('defaults to normal text size', () => {
    expect(passesWcag(4.5, 'AA')).toBe(true);
  });
});
