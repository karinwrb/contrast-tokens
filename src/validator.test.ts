import { validateTokens, TokenPair } from './validator';

const samplePairs: TokenPair[] = [
  { name: 'primary-text', foreground: '#000000', background: '#ffffff' },
  { name: 'low-contrast', foreground: '#aaaaaa', background: '#ffffff' },
  { name: 'blue-on-white', foreground: '#1a73e8', background: '#ffffff' },
];

describe('validateTokens', () => {
  it('returns a report with results for each valid pair', () => {
    const report = validateTokens(samplePairs);
    expect(report.totalPairs).toBe(3);
    expect(report.results).toHaveLength(3);
    expect(report.errors).toHaveLength(0);
  });

  it('correctly identifies passing and failing pairs for AA normal', () => {
    const report = validateTokens(samplePairs, 'AA', 'normal');
    const primary = report.results.find((r) => r.name === 'primary-text')!;
    const low = report.results.find((r) => r.name === 'low-contrast')!;
    expect(primary.passesAA).toBe(true);
    expect(low.passesAA).toBe(false);
  });

  it('counts passed and failed correctly', () => {
    const report = validateTokens(samplePairs, 'AA', 'normal');
    expect(report.passed + report.failed).toBe(report.totalPairs);
  });

  it('captures errors for invalid hex values', () => {
    const badPairs: TokenPair[] = [
      { name: 'invalid-fg', foreground: '#zzzzzz', background: '#ffffff' },
    ];
    const report = validateTokens(badPairs);
    expect(report.errors).toHaveLength(1);
    expect(report.errors[0].name).toBe('invalid-fg');
    expect(report.errors[0].message).toContain('Invalid hex color');
  });

  it('includes full WCAG breakdown in each result', () => {
    const report = validateTokens(samplePairs);
    const result = report.results[0];
    expect(result).toHaveProperty('passesAA');
    expect(result).toHaveProperty('passesAAA');
    expect(result).toHaveProperty('passesAALarge');
    expect(result).toHaveProperty('passesAAALarge');
    expect(typeof result.ratio).toBe('number');
  });

  it('handles an empty array gracefully', () => {
    const report = validateTokens([]);
    expect(report.totalPairs).toBe(0);
    expect(report.passed).toBe(0);
    expect(report.failed).toBe(0);
  });
});
