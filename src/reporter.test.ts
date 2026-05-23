import { generateReport, formatReportText } from './reporter';
import { ValidationResult } from './validator';

const mockResults: ValidationResult[] = [
  { tokenPair: 'text/background', ratio: 7.2, required: 4.5, passes: true, level: 'AA' },
  { tokenPair: 'text/background', ratio: 7.2, required: 7, passes: true, level: 'AAA' },
  { tokenPair: 'muted/surface', ratio: 3.1, required: 4.5, passes: false, level: 'AA' },
  { tokenPair: 'link/background', ratio: 6.5, required: 7, passes: false, level: 'AAA' },
];

describe('generateReport', () => {
  it('computes summary totals correctly', () => {
    const report = generateReport(mockResults);
    expect(report.summary.total).toBe(4);
    expect(report.summary.passed).toBe(2);
    expect(report.summary.failed).toBe(1);
  });

  it('calculates pass rate as a percentage string', () => {
    const report = generateReport(mockResults);
    expect(report.summary.passRate).toBe('50.0%');
  });

  it('separates failures (AA) from warnings (AAA)', () => {
    const report = generateReport(mockResults);
    expect(report.failures).toHaveLength(1);
    expect(report.failures[0].tokenPair).toBe('muted/surface');
    expect(report.warnings).toHaveLength(1);
    expect(report.warnings[0].tokenPair).toBe('link/background');
  });

  it('handles empty results gracefully', () => {
    const report = generateReport([]);
    expect(report.summary.total).toBe(0);
    expect(report.summary.passRate).toBe('0%');
    expect(report.failures).toHaveLength(0);
    expect(report.warnings).toHaveLength(0);
  });

  it('includes an ISO timestamp', () => {
    const report = generateReport(mockResults);
    expect(report.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe('formatReportText', () => {
  it('includes summary header', () => {
    const report = generateReport(mockResults);
    const text = formatReportText(report);
    expect(text).toContain('=== Contrast Token Report ===');
    expect(text).toContain('Pass rate');
  });

  it('lists failures with FAIL label', () => {
    const report = generateReport(mockResults);
    const text = formatReportText(report);
    expect(text).toContain('[FAIL] muted/surface');
  });

  it('lists warnings with WARN label', () => {
    const report = generateReport(mockResults);
    const text = formatReportText(report);
    expect(text).toContain('[WARN] link/background');
  });

  it('omits failures section when there are none', () => {
    const passing: ValidationResult[] = [
      { tokenPair: 'a/b', ratio: 5, required: 4.5, passes: true, level: 'AA' },
    ];
    const text = formatReportText(generateReport(passing));
    expect(text).not.toContain('[FAIL]');
  });
});
