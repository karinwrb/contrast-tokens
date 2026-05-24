import { compareThemes, MultiThemeReport } from './themeComparator';

const passingThemeJson = JSON.stringify({
  pairs: [
    {
      key: 'primary-text',
      foreground: '#000000',
      background: '#ffffff',
      level: 'AA',
    },
  ],
});

const failingThemeJson = JSON.stringify({
  pairs: [
    {
      key: 'low-contrast',
      foreground: '#aaaaaa',
      background: '#ffffff',
      level: 'AA',
    },
  ],
});

const invalidThemeJson = 'not valid json';

describe('compareThemes', () => {
  it('returns a result for each theme', () => {
    const report = compareThemes({
      light: passingThemeJson,
      dark: passingThemeJson,
    });
    expect(report.themes).toHaveLength(2);
    expect(report.summary.totalThemes).toBe(2);
  });

  it('identifies all-passing themes correctly', () => {
    const report = compareThemes({ light: passingThemeJson });
    expect(report.summary.allPassingThemes).toContain('light');
    expect(report.summary.failingThemes).toHaveLength(0);
  });

  it('identifies failing themes correctly', () => {
    const report = compareThemes({ dark: failingThemeJson });
    expect(report.summary.failingThemes).toContain('dark');
    expect(report.summary.allPassingThemes).toHaveLength(0);
  });

  it('handles mixed passing and failing themes', () => {
    const report = compareThemes({
      light: passingThemeJson,
      dark: failingThemeJson,
    });
    expect(report.summary.allPassingThemes).toContain('light');
    expect(report.summary.failingThemes).toContain('dark');
  });

  it('handles invalid JSON gracefully', () => {
    const report = compareThemes({ broken: invalidThemeJson });
    const brokenTheme = report.themes.find((t) => t.themeName === 'broken');
    expect(brokenTheme).toBeDefined();
    expect(brokenTheme!.totalPairs).toBe(0);
  });

  it('includes failure details for failing pairs', () => {
    const report = compareThemes({ dark: failingThemeJson });
    const darkTheme = report.themes.find((t) => t.themeName === 'dark');
    expect(darkTheme!.failures.length).toBeGreaterThan(0);
    expect(darkTheme!.failures[0]).toHaveProperty('tokenKey');
    expect(darkTheme!.failures[0]).toHaveProperty('contrastRatio');
  });
});
