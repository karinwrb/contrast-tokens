#!/usr/bin/env node
import * as path from 'path';
import { parseTokenFile } from './tokenParser';
import { validateTokens } from './validator';
import { generateReport, formatReportText } from './reporter';

const args = process.argv.slice(2);

function printUsage(): void {
  console.log('Usage: contrast-tokens <token-file.json> [--format text|json] [--fail-on-error]');
}

if (args.length === 0) {
  printUsage();
  process.exit(1);
}

const filePath = args[0];
const formatFlag = args.includes('--format') ? args[args.indexOf('--format') + 1] : 'text';
const failOnError = args.includes('--fail-on-error');

try {
  const tokenFile = parseTokenFile(filePath);
  const results = validateTokens(tokenFile.tokens);
  const report = generateReport(results);

  if (formatFlag === 'json') {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatReportText(report));
  }

  const hasFailures = report.summary.failed > 0;

  if (failOnError && hasFailures) {
    process.exit(1);
  }
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Error: ${message}`);
  process.exit(2);
}
