import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FilterTabs from "../components/FilterTabs";
import NotificationBanner from "../components/NotificationBanner";
import SetCard from "../components/SetCard";
import YouTubeModal from "../components/YouTubeModal";
import { sets } from "../data/schedule";

describe("SetCard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders set details and metadata", () => {
    render(
      <SetCard
        set={sets[1]}
        isFavorite={false}
        onToggle={() => {}}
        onPlayVideo={() => {}}
      />
    );

    expect(screen.getByText("Saul of Tarsus")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Saul of Tarsus, 12:35 PM to 1:00 PM")
    ).toBeInTheDocument();
    expect(screen.getByText(/Inland Empire, CA/)).toBeInTheDocument();
  });

  it("calls onToggle when favorite button is clicked", () => {
    const onToggle = vi.fn();
    render(<SetCard set={sets[0]} isFavorite={false} onToggle={onToggle} />);

    fireEvent.click(
      screen.getByRole("button", { name: /Add Nomads to can't miss/i })
    );

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("shows active state and pressed favorite state", () => {
    render(<SetCard set={sets[0]} isFavorite onToggle={() => {}} isActive />);

    expect(screen.getByText("Live Now")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Remove Nomads from can't miss/i,
      })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onPlayVideo when YouTube button is clicked", () => {
    const onPlayVideo = vi.fn();
    render(
      <SetCard
        set={sets[1]}
        isFavorite={false}
        onToggle={() => {}}
        onPlayVideo={onPlayVideo}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Watch Saul of Tarsus on YouTube/i })
    );

    expect(onPlayVideo).toHaveBeenCalledTimes(1);
  });

  it("uses clipboard fallback when navigator.share is unavailable", async () => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<SetCard set={sets[0]} isFavorite={false} onToggle={() => {}} />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Share Nomads/i }));
      await Promise.resolve();
    });

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining("I'm going to see Nomads")
    );
  });
});

describe("FilterTabs", () => {
  it("switches filter when tabs are clicked", () => {
    const onChange = vi.fn();
    render(<FilterTabs filter="all" onChange={onChange} favoriteCount={2} />);

    fireEvent.click(screen.getByRole("tab", { name: /Can't Miss/i }));
    fireEvent.click(screen.getByRole("tab", { name: /All Sets/i }));

    expect(onChange).toHaveBeenNthCalledWith(1, "favorites");
    expect(onChange).toHaveBeenNthCalledWith(2, "all");
    expect(screen.getByLabelText("2 favorited")).toBeInTheDocument();
  });

  it("hides favorite badge when favorite count is zero", () => {
    render(<FilterTabs filter="all" onChange={() => {}} favoriteCount={0} />);

    expect(screen.queryByLabelText(/favorited/)).toBeNull();
  });
});

describe("NotificationBanner", () => {
  it("renders enable CTA only when permission is default", () => {
    const onRequest = vi.fn();
    const { rerender } = render(
      <NotificationBanner status="default" onRequest={onRequest} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Enable" }));
    expect(onRequest).toHaveBeenCalledTimes(1);

    rerender(<NotificationBanner status="granted" onRequest={onRequest} />);
    expect(screen.queryByRole("button", { name: "Enable" })).toBeNull();
  });
});

describe("YouTubeModal", () => {
  it("does not render when closed", () => {
    const { container } = render(
      <YouTubeModal
        bandName="Nomads"
        youtubeUrl="https://www.youtube.com/watch?v=zoSQJn3GVRg"
        isOpen={false}
        onClose={() => {}}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders iframe for valid URL and closes on Escape", () => {
    const onClose = vi.fn();
    render(
      <YouTubeModal
        bandName="Nomads"
        youtubeUrl="https://www.youtube.com/watch?v=zoSQJn3GVRg"
        isOpen
        onClose={onClose}
      />
    );

    const iframe = screen.getByTitle("Nomads");
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("youtube.com/embed/zoSQJn3GVRg")
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows invalid URL message when parsing fails", () => {
    render(
      <YouTubeModal
        bandName="Nomads"
        youtubeUrl="https://example.com/video"
        isOpen
        onClose={() => {}}
      />
    );

    expect(screen.getByText("Invalid YouTube URL")).toBeInTheDocument();
  });
});
