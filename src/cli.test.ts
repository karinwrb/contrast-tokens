import { execSync, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

function writeTempTokenFile(tokens: object[]): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'contrast-tokens-'));
  const filePath = path.join(dir, 'tokens.json');
  fs.writeFileSync(filePath, JSON.stringify({ tokens }));
  return filePath;
}

function runCli(args: string): { stdout: string; stderr: string; status: number } {
  const result = spawnSync(
    'npx',
    ['ts-node', 'src/cli.ts', ...args.split(' ')],
    { encoding: 'utf-8' }
  );
  return {
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    status: result.status ?? 0,
  };
}

describe('CLI', () => {
  it('exits with code 1 when no arguments provided', () => {
    const result = spawnSync('npx', ['ts-node', 'src/cli.ts'], { encoding: 'utf-8' });
    expect(result.status).toBe(1);
    expect(result.stdout).toContain('Usage');
  });

  it('exits with code 2 for a missing file', () => {
    const result = runCli('./missing-file.json');
    expect(result.status).toBe(2);
    expect(result.stderr).toContain('Error');
  });

  it('outputs text report for passing tokens', () => {
    const file = writeTempTokenFile([
      { name: 'high-contrast', foreground: '#000000', background: '#ffffff' },
    ]);
    const result = runCli(file);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('high-contrast');
  });

  it('outputs JSON when --format json is passed', () => {
    const file = writeTempTokenFile([
      { name: 'token-a', foreground: '#000000', background: '#ffffff' },
    ]);
    const result = runCli(`${file} --format json`);
    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout);
    expect(parsed).toHaveProperty('summary');
    expect(parsed).toHaveProperty('results');
  });

  it('exits with code 1 on failure when --fail-on-error is set', () => {
    const file = writeTempTokenFile([
      { name: 'low-contrast', foreground: '#aaaaaa', background: '#bbbbbb' },
    ]);
    const result = runCli(`${file} --fail-on-error`);
    expect(result.status).toBe(1);
  });
});
