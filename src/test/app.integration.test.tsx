import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import CountdownBanner from "../components/CountdownBanner";
import InstallPrompt from "../components/InstallPrompt";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

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

  function setUserAgent(userAgent: string) {
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      value: userAgent,
    });
  }

  function createBeforeInstallPromptEvent(): BeforeInstallPromptEvent {
    const event = new Event("beforeinstallprompt", {
      bubbles: true,
      cancelable: true,
    }) as BeforeInstallPromptEvent;

    Object.defineProperty(event, "prompt", {
      value: vi.fn().mockResolvedValue(undefined),
    });
    Object.defineProperty(event, "userChoice", {
      value: Promise.resolve({ outcome: "dismissed" as const }),
    });

    return event;
  }

  it("renders iOS install guidance and allows dismiss", () => {
    setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    );

    render(<InstallPrompt />);

    expect(screen.getByText("Add to Home Screen")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "How to" }));
    expect(screen.getByText(/Tap the/)).toBeInTheDocument();
    expect(screen.getByText(/your browser toolbar/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(localStorage.getItem("jchcfest-install-dismissed")).toBe("1");
  });

  it("shows iOS install guidance in Chrome on iPhone", () => {
    setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.108 Mobile/15E148 Safari/604.1"
    );

    render(<InstallPrompt />);

    expect(screen.getByText("Add to Home Screen")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "How to" }));
    expect(screen.getByText(/your browser toolbar/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Open this page in\s+Safari/i)
    ).not.toBeInTheDocument();
  });

  it("shows native install guidance when beforeinstallprompt is available", () => {
    setUserAgent(
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36"
    );

    render(<InstallPrompt />);

    act(() => {
      window.dispatchEvent(createBeforeInstallPromptEvent());
    });

    expect(screen.getByText("Install App")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Use the Install button here, or look for the install icon in the address bar/i
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Install" })).toBeInTheDocument();
  });

  it("shows desktop install guidance in Chrome fallback", () => {
    vi.useFakeTimers();
    setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    );

    render(<InstallPrompt />);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText("Install App")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "How to" }));

    expect(
      screen.getByText((_, element) => {
        const textContent = element?.textContent ?? "";
        return (
          element?.tagName === "P" &&
          textContent.includes("Look for an install option in your browser UI")
        );
      })
    ).toBeInTheDocument();
  });
});
