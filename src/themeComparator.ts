import { validateTokens, TokenPair } from './validator';
import { parseTokenString } from './tokenParser';

export interface ThemeComparisonResult {
  themeName: string;
  totalPairs: number;
  passingPairs: number;
  failingPairs: number;
  failures: ThemeFailure[];
}

export interface ThemeFailure {
  tokenKey: string;
  foreground: string;
  background: string;
  contrastRatio: number;
  requiredLevel: 'AA' | 'AAA';
}

export interface MultiThemeReport {
  themes: ThemeComparisonResult[];
  summary: {
    totalThemes: number;
    allPassingThemes: string[];
    failingThemes: string[];
  };
}

export function compareThemes(
  themes: Record<string, string>
): MultiThemeReport {
  const results: ThemeComparisonResult[] = [];

  for (const [themeName, tokenJson] of Object.entries(themes)) {
    const parsed = parseTokenString(tokenJson);
    if (!parsed.success || !parsed.tokens) {
      results.push({
        themeName,
        totalPairs: 0,
        passingPairs: 0,
        failingPairs: 0,
        failures: [],
      });
      continue;
    }

    const validation = validateTokens(parsed.tokens);
    const failures: ThemeFailure[] = validation.results
      .filter((r) => !r.passes)
      .map((r) => ({
        tokenKey: r.tokenKey,
        foreground: r.foreground,
        background: r.background,
        contrastRatio: r.contrastRatio,
        requiredLevel: r.requiredLevel,
      }));

    results.push({
      themeName,
      totalPairs: validation.results.length,
      passingPairs: validation.results.filter((r) => r.passes).length,
      failingPairs: failures.length,
      failures,
    });
  }

  const allPassingThemes = results
    .filter((r) => r.failingPairs === 0)
    .map((r) => r.themeName);
  const failingThemes = results
    .filter((r) => r.failingPairs > 0)
    .map((r) => r.themeName);

  return {
    themes: results,
    summary: {
      totalThemes: results.length,
      allPassingThemes,
      failingThemes,
    },
  };
}
