import { ValidationResult } from './validator';

export interface ReportSummary {
  total: number;
  passed: number;
  failed: number;
  passRate: string;
}

export interface Report {
  summary: ReportSummary;
  failures: ValidationResult[];
  warnings: ValidationResult[];
  timestamp: string;
}

export function generateReport(results: ValidationResult[]): Report {
  const failures = results.filter((r) => !r.passes && r.level === 'AA');
  const warnings = results.filter(
    (r) => !r.passes && r.level === 'AAA'
  );
  const passed = results.filter((r) => r.passes).length;
  const total = results.length;

  return {
    summary: {
      total,
      passed,
      failed: failures.length,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(1) + '%' : '0%',
    },
    failures,
    warnings,
    timestamp: new Date().toISOString(),
  };
}

export function formatReportText(report: Report): string {
  const lines: string[] = [];

  lines.push('=== Contrast Token Report ===');
  lines.push(`Generated: ${report.timestamp}`);
  lines.push('');
  lines.push('Summary:');
  lines.push(`  Total pairs checked : ${report.summary.total}`);
  lines.push(`  Passed             : ${report.summary.passed}`);
  lines.push(`  Failed (AA)        : ${report.summary.failed}`);
  lines.push(`  Warnings (AAA)     : ${report.warnings.length}`);
  lines.push(`  Pass rate          : ${report.summary.passRate}`);

  if (report.failures.length > 0) {
    lines.push('');
    lines.push('Failures (AA):');
    for (const f of report.failures) {
      lines.push(
        `  [FAIL] ${f.tokenPair} — ratio ${f.ratio.toFixed(2)}:1 (required ${f.required}:1)`
      );
    }
  }

  if (report.warnings.length > 0) {
    lines.push('');
    lines.push('Warnings (AAA):');
    for (const w of report.warnings) {
      lines.push(
        `  [WARN] ${w.tokenPair} — ratio ${w.ratio.toFixed(2)}:1 (required ${w.required}:1)`
      );
    }
  }

  lines.push('');
  lines.push('=============================');
  return lines.join('\n');
}
