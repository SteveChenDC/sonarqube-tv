import { describe, it, expect } from "vitest";
import { videos, categories } from "@/data/videos";

describe("generateStaticParams coverage", () => {
  it("every video has a non-empty id suitable for static param generation", () => {
    const ids = videos.map((v) => v.id);
    expect(ids.length).toBeGreaterThan(0);
    ids.forEach((id) => {
      expect(id).toBeTruthy();
      expect(typeof id).toBe("string");
      expect(id.trim()).toBe(id);
    });
  });

  it("every category has a non-empty slug suitable for static param generation", () => {
    const slugs = categories.map((c) => c.slug);
    expect(slugs.length).toBeGreaterThan(0);
    slugs.forEach((slug) => {
      expect(slug).toBeTruthy();
      expect(typeof slug).toBe("string");
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  it("video ids contain only URL-safe characters", () => {
    videos.forEach((v) => {
      expect(v.id).toMatch(/^[a-zA-Z0-9_-]+$/);
    });
  });

  it("category slugs are unique", () => {
    const slugs = categories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("video ids are unique", () => {
    const ids = videos.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
