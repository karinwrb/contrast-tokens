import { MultiThemeReport, ThemeComparisonResult } from './themeComparator';

export function formatThemeComparisonReport(report: MultiThemeReport): string {
  const lines: string[] = [];

  lines.push('=== Multi-Theme Contrast Comparison ===');
  lines.push(`Themes analyzed: ${report.summary.totalThemes}`);
  lines.push(
    `Passing themes: ${report.summary.allPassingThemes.join(', ') || 'none'}`
  );
  lines.push(
    `Failing themes: ${report.summary.failingThemes.join(', ') || 'none'}`
  );
  lines.push('');

  for (const theme of report.themes) {
    lines.push(formatThemeSection(theme));
  }

  return lines.join('\n');
}

function formatThemeSection(theme: ThemeComparisonResult): string {
  const lines: string[] = [];
  const status = theme.failingPairs === 0 ? '✅ PASS' : '❌ FAIL';

  lines.push(`--- Theme: ${theme.themeName} [${status}] ---`);
  lines.push(
    `  Pairs: ${theme.totalPairs} total, ${theme.passingPairs} passing, ${theme.failingPairs} failing`
  );

  if (theme.failures.length > 0) {
    lines.push('  Failures:');
    for (const failure of theme.failures) {
      lines.push(
        `    • ${failure.tokenKey}: ${failure.foreground} on ${failure.background}` +
          ` — ratio ${failure.contrastRatio.toFixed(2)}:1 (required ${failure.requiredLevel})`
      );
    }
  }

  lines.push('');
  return lines.join('\n');
}

export function themeComparisonExitCode(report: MultiThemeReport): number {
  return report.summary.failingThemes.length > 0 ? 1 : 0;
}
