import { hexToRgb, rgbToHex, isDarkColor, suggestForeground, isValidHex } from "./colorUtils";

describe("hexToRgb", () => {
  it("parses a 6-digit hex color", () => {
    expect(hexToRgb("#1a2b3c")).toEqual({ r: 26, g: 43, b: 60 });
  });

  it("parses a 3-digit hex color", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("parses without leading hash", () => {
    expect(hexToRgb("000000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("returns null for invalid hex", () => {
    expect(hexToRgb("#gg0000")).toBeNull();
    expect(hexToRgb("#12345")).toBeNull();
    expect(hexToRgb("")).toBeNull();
  });
});

describe("rgbToHex", () => {
  it("converts RGB to hex", () => {
    expect(rgbToHex(255, 255, 255)).toBe("#ffffff");
    expect(rgbToHex(0, 0, 0)).toBe("#000000");
    expect(rgbToHex(26, 43, 60)).toBe("#1a2b3c");
  });

  it("clamps values outside 0-255", () => {
    expect(rgbToHex(-10, 300, 128)).toBe("#00ff80");
  });
});

describe("isDarkColor", () => {
  it("identifies dark colors", () => {
    expect(isDarkColor("#000000")).toBe(true);
    expect(isDarkColor("#1a1a2e")).toBe(true);
  });

  it("identifies light colors", () => {
    expect(isDarkColor("#ffffff")).toBe(false);
    expect(isDarkColor("#f0f0f0")).toBe(false);
  });

  it("throws for invalid hex", () => {
    expect(() => isDarkColor("notacolor")).toThrow("Invalid hex color");
  });
});

describe("suggestForeground", () => {
  it("suggests white text on dark backgrounds", () => {
    expect(suggestForeground("#000000")).toBe("#ffffff");
    expect(suggestForeground("#2c3e50")).toBe("#ffffff");
  });

  it("suggests black text on light backgrounds", () => {
    expect(suggestForeground("#ffffff")).toBe("#000000");
    expect(suggestForeground("#ecf0f1")).toBe("#000000");
  });
});

describe("isValidHex", () => {
  it("validates correct hex colors", () => {
    expect(isValidHex("#abc")).toBe(true);
    expect(isValidHex("#1a2b3c")).toBe(true);
  });

  it("rejects invalid hex colors", () => {
    expect(isValidHex("abc")).toBe(false);
    expect(isValidHex("#gg0000")).toBe(false);
    expect(isValidHex("#12345")).toBe(false);
  });
});
