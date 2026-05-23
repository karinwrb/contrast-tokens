# contrast-tokens

> Design token validator that checks color contrast ratios against WCAG AA/AAA thresholds

## Installation

```bash
npm install contrast-tokens
```

## Usage

```typescript
import { validateTokens } from "contrast-tokens";

const tokens = {
  "color-text-primary": "#1a1a1a",
  "color-background": "#ffffff",
  "color-text-muted": "#9e9e9e",
};

const results = validateTokens(tokens, {
  level: "AA", // or "AAA"
  pairings: [
    { foreground: "color-text-primary", background: "color-background" },
    { foreground: "color-text-muted", background: "color-background" },
  ],
});

results.forEach(({ pairing, ratio, pass }) => {
  console.log(`${pairing.foreground} on ${pairing.background}`);
  console.log(`  Ratio: ${ratio.toFixed(2)}:1 — ${pass ? "✅ Pass" : "❌ Fail"}`);
});
```

### CLI

```bash
npx contrast-tokens --tokens ./tokens.json --level AA
```

## WCAG Thresholds

| Level | Normal Text | Large Text |
|-------|-------------|------------|
| AA    | 4.5:1       | 3:1        |
| AAA   | 7:1         | 4.5:1      |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](./LICENSE)