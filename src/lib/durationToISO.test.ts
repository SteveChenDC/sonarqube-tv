import { describe, it, expect } from "vitest";
import { durationToISO } from "./durationToISO";

describe("durationToISO", () => {
  describe("MM:SS format", () => {
    it("converts a standard MM:SS duration", () => {
      expect(durationToISO("3:31")).toBe("PT3M31S");
    });

    it("converts a 10-minute duration", () => {
      expect(durationToISO("10:00")).toBe("PT10M0S");
    });

    it("converts a single-digit second value", () => {
      expect(durationToISO("5:05")).toBe("PT5M5S");
    });

    it("converts 1-second duration (0:01)", () => {
      expect(durationToISO("0:01")).toBe("PT1S");
    });

    it("converts 0:41 to seconds-only form when minutes is 0", () => {
      expect(durationToISO("0:41")).toBe("PT41S");
    });

    it("converts 0:00 to seconds-only zero form", () => {
      expect(durationToISO("0:00")).toBe("PT0S");
    });

    it("converts a 59:59 edge case", () => {
      expect(durationToISO("59:59")).toBe("PT59M59S");
    });
  });

  describe("HH:MM:SS format", () => {
    it("converts a standard HH:MM:SS duration", () => {
      expect(durationToISO("1:02:41")).toBe("PT1H2M41S");
    });

    it("converts exactly one hour", () => {
      expect(durationToISO("1:00:00")).toBe("PT1H0M0S");
    });

    it("converts a long video", () => {
      expect(durationToISO("2:30:15")).toBe("PT2H30M15S");
    });

    it("handles single-digit hours", () => {
      expect(durationToISO("0:10:05")).toBe("PT0H10M5S");
    });
  });
});
