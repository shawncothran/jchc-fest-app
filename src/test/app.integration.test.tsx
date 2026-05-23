import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import CountdownBanner from "../components/CountdownBanner";
import InstallPrompt from "../components/InstallPrompt";

describe("App flows", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("switches between all sets and favorites", () => {
    render(<App />);

    expect(screen.getByText("JCHC Fest")).toBeInTheDocument();
    expect(screen.getByText("Nomads")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Can't Miss/i }));
    expect(screen.getByText("No Can't Miss Sets Yet")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Browse All Sets" }));
    expect(screen.getByText("Nomads")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Add Nomads to can't miss/i })
    );
    fireEvent.click(screen.getByRole("tab", { name: /Can't Miss/i }));

    expect(screen.getByText("Nomads")).toBeInTheDocument();
  });
});

describe("CountdownBanner", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("shows pre-festival countdown", () => {
    vi.setSystemTime(new Date("2026-07-17T12:00:00"));

    render(<CountdownBanner favorites={new Set()} />);

    expect(screen.getByText("Fest starts in")).toBeInTheDocument();
  });

  it("shows next favorite when one is upcoming", () => {
    vi.setSystemTime(new Date("2026-07-18T12:10:00"));

    render(<CountdownBanner favorites={new Set([3])} />);

    expect(screen.getByText("Next can&apos;t miss")).toBeInTheDocument();
    expect(screen.getByText("Dear Adversary")).toBeInTheDocument();
  });

  it("shows wrap state after festival end", () => {
    vi.setSystemTime(new Date("2026-07-18T22:30:00"));

    render(<CountdownBanner favorites={new Set()} />);

    expect(screen.getByText("That's a wrap!")).toBeInTheDocument();
    expect(screen.getByText("See you next year")).toBeInTheDocument();
  });
});

describe("InstallPrompt", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it("renders iOS install guidance and allows dismiss", () => {
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });

    render(<InstallPrompt />);

    expect(screen.getByText("Add to Home Screen")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "How to" }));
    expect(screen.getByText(/Tap the/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(localStorage.getItem("jchcfest-install-dismissed")).toBe("1");
  });
});
