import { contrastRatio, passesWcag, WcagLevel, TextSize } from './contrast';

export interface TokenPair {
  name: string;
  foreground: string;
  background: string;
}

export interface ValidationResult {
  name: string;
  foreground: string;
  background: string;
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
  passesAAALarge: boolean;
}

export interface ValidationReport {
  results: ValidationResult[];
  totalPairs: number;
  passed: number;
  failed: number;
  errors: Array<{ name: string; message: string }>;
}

/**
 * Validates an array of token pairs against WCAG AA and AAA thresholds.
 */
export function validateTokens(
  pairs: TokenPair[],
  level: WcagLevel = 'AA',
  size: TextSize = 'normal'
): ValidationReport {
  const results: ValidationResult[] = [];
  const errors: ValidationReport['errors'] = [];
  let passed = 0;
  let failed = 0;

  for (const pair of pairs) {
    try {
      const ratio = contrastRatio(pair.foreground, pair.background);
      const result: ValidationResult = {
        name: pair.name,
        foreground: pair.foreground,
        background: pair.background,
        ratio,
        passesAA: passesWcag(ratio, 'AA', 'normal'),
        passesAALarge: passesWcag(ratio, 'AA', 'large'),
        passesAAA: passesWcag(ratio, 'AAA', 'normal'),
        passesAAALarge: passesWcag(ratio, 'AAA', 'large'),
      };
      results.push(result);
      passesWcag(ratio, level, size) ? passed++ : failed++;
    } catch (err) {
      errors.push({
        name: pair.name,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    results,
    totalPairs: pairs.length,
    passed,
    failed,
    errors,
  };
}
