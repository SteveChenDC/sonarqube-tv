import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseBadge from "./CourseBadge";

vi.mock("@/data/courses", () => ({
  getCoursesForVideo: vi.fn((videoId: string) => {
    if (videoId === "v177") {
      return [
        {
          id: "scd",
          slug: "sonarqube-certified-developer",
          title: "SonarQube Certified Developer",
          shortTitle: "SCD",
        },
      ];
    }
    return [];
  }),
}));

describe("CourseBadge", () => {
  it("renders nothing when video not in any course", () => {
    const { container } = render(<CourseBadge videoId="v999" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders badge for video in a course", () => {
    render(<CourseBadge videoId="v177" />);
    expect(screen.getByText("Part of SCD")).toBeTruthy();
  });

  it("links to the course page", () => {
    render(<CourseBadge videoId="v177" />);
    const link = screen.getByText("Part of SCD").closest("a");
    expect(link?.getAttribute("href")).toBe(
      "/courses/sonarqube-certified-developer"
    );
  });
});
