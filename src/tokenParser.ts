import * as fs from 'fs';
import * as path from 'path';

export interface ColorToken {
  name: string;
  foreground: string;
  background: string;
  level?: 'AA' | 'AAA';
  fontSize?: 'normal' | 'large';
}

export interface TokenFile {
  tokens: ColorToken[];
}

export function parseTokenFile(filePath: string): TokenFile {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Token file not found: ${absolutePath}`);
  }

  const raw = fs.readFileSync(absolutePath, 'utf-8');
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON in token file: ${filePath}`);
  }

  return validateTokenFile(parsed);
}

export function parseTokenString(content: string): TokenFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Invalid JSON string provided');
  }
  return validateTokenFile(parsed);
}

function validateTokenFile(data: unknown): TokenFile {
  if (typeof data !== 'object' || data === null || !('tokens' in data)) {
    throw new Error('Token file must have a top-level "tokens" array');
  }

  const file = data as Record<string, unknown>;
  if (!Array.isArray(file.tokens)) {
    throw new Error('"tokens" must be an array');
  }

  const tokens: ColorToken[] = file.tokens.map((item: unknown, index: number) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Token at index ${index} must be an object`);
    }
    const t = item as Record<string, unknown>;
    if (typeof t.name !== 'string') throw new Error(`Token at index ${index} missing "name"`);
    if (typeof t.foreground !== 'string') throw new Error(`Token at index ${index} missing "foreground"`);
    if (typeof t.background !== 'string') throw new Error(`Token at index ${index} missing "background"`);

    return {
      name: t.name,
      foreground: t.foreground,
      background: t.background,
      level: (t.level as 'AA' | 'AAA') ?? 'AA',
      fontSize: (t.fontSize as 'normal' | 'large') ?? 'normal',
    };
  });

  return { tokens };
}
