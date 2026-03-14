import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats a standard date with 'th' suffix", () => {
    expect(formatDate("2024-06-15")).toBe("June 15th 2024");
  });

  it("uses 'st' suffix for 1st, 21st, 31st", () => {
    expect(formatDate("2024-01-01")).toBe("January 1st 2024");
    expect(formatDate("2024-01-21")).toBe("January 21st 2024");
    expect(formatDate("2024-01-31")).toBe("January 31st 2024");
  });

  it("uses 'nd' suffix for 2nd, 22nd", () => {
    expect(formatDate("2024-03-02")).toBe("March 2nd 2024");
    expect(formatDate("2024-03-22")).toBe("March 22nd 2024");
  });

  it("uses 'rd' suffix for 3rd, 23rd", () => {
    expect(formatDate("2024-07-03")).toBe("July 3rd 2024");
    expect(formatDate("2024-07-23")).toBe("July 23rd 2024");
  });

  it("uses 'th' for teen exceptions: 11th, 12th, 13th", () => {
    expect(formatDate("2024-04-11")).toBe("April 11th 2024");
    expect(formatDate("2024-04-12")).toBe("April 12th 2024");
    expect(formatDate("2024-04-13")).toBe("April 13th 2024");
  });

  it("uses 'th' for other teens (14th-19th)", () => {
    expect(formatDate("2024-05-14")).toBe("May 14th 2024");
    expect(formatDate("2024-05-19")).toBe("May 19th 2024");
  });
});
