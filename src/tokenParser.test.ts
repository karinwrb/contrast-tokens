import { parseTokenString, parseTokenFile, ColorToken } from './tokenParser';
import * as fs from 'fs';
import * as path from 'path';

describe('parseTokenString', () => {
  it('parses a valid token JSON string', () => {
    const input = JSON.stringify({
      tokens: [
        { name: 'primary', foreground: '#000000', background: '#ffffff' },
      ],
    });
    const result = parseTokenString(input);
    expect(result.tokens).toHaveLength(1);
    expect(result.tokens[0].name).toBe('primary');
  });

  it('applies default level and fontSize', () => {
    const input = JSON.stringify({
      tokens: [{ name: 'btn', foreground: '#333', background: '#eee' }],
    });
    const result = parseTokenString(input);
    expect(result.tokens[0].level).toBe('AA');
    expect(result.tokens[0].fontSize).toBe('normal');
  });

  it('respects explicit level and fontSize', () => {
    const input = JSON.stringify({
      tokens: [{ name: 'hero', foreground: '#000', background: '#fff', level: 'AAA', fontSize: 'large' }],
    });
    const result = parseTokenString(input);
    expect(result.tokens[0].level).toBe('AAA');
    expect(result.tokens[0].fontSize).toBe('large');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseTokenString('not json')).toThrow('Invalid JSON');
  });

  it('throws when tokens key is missing', () => {
    expect(() => parseTokenString('{}')).toThrow('"tokens" array');
  });

  it('throws when tokens is not an array', () => {
    expect(() => parseTokenString('{"tokens": {}}')).toThrow('must be an array');
  });

  it('throws when a token is missing foreground', () => {
    const input = JSON.stringify({ tokens: [{ name: 'x', background: '#fff' }] });
    expect(() => parseTokenString(input)).toThrow('foreground');
  });

  it('throws when a token is missing background', () => {
    const input = JSON.stringify({ tokens: [{ name: 'x', foreground: '#000' }] });
    expect(() => parseTokenString(input)).toThrow('background');
  });
});

describe('parseTokenFile', () => {
  it('throws when file does not exist', () => {
    expect(() => parseTokenFile('./nonexistent.json')).toThrow('not found');
  });
});
