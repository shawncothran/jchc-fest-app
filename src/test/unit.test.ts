import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FESTIVAL_DATE } from "../data/schedule";
import { useFavorites } from "../hooks/useFavorites";
import { parseDropId } from "../hooks/useTacoDragGesture";
import {
  getPermissionStatus,
  notificationsSupported,
  requestPermission,
  scheduleReminder,
  syncReminders,
} from "../utils/notifications";
import { computeTacoAfterSetId, getTacoWindowLabel } from "../utils/tacoTime";

describe("useFavorites", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads existing favorites from localStorage", () => {
    localStorage.setItem("jchcfest-favorites", JSON.stringify([2, 5]));

    const { result } = renderHook(() => useFavorites());

    expect(result.current.count).toBe(2);
    expect(result.current.isFavorite(2)).toBe(true);
    expect(result.current.isFavorite(5)).toBe(true);
  });

  it("falls back to empty favorites for invalid stored data", () => {
    localStorage.setItem("jchcfest-favorites", "not-json");

    const { result } = renderHook(() => useFavorites());

    expect(result.current.count).toBe(0);
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it("toggles favorites and persists to localStorage", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggle(3);
    });
    expect(result.current.isFavorite(3)).toBe(true);
    expect(localStorage.getItem("jchcfest-favorites")).toBe("[3]");

    act(() => {
      result.current.toggle(3);
    });
    expect(result.current.isFavorite(3)).toBe(false);
    expect(localStorage.getItem("jchcfest-favorites")).toBe("[]");
  });
});

describe("taco time utilities", () => {
  it("uses the biggest gap by default", () => {
    expect(computeTacoAfterSetId(new Set())).toBe(10);
  });

  it("uses the free window when favorites are outside that window", () => {
    expect(computeTacoAfterSetId(new Set([1, 2, 3]))).toBe(7);
  });

  it("keeps biggest gap when any favorite is in the window", () => {
    expect(computeTacoAfterSetId(new Set([8]))).toBe(10);
  });

  it("builds the visible taco break window label", () => {
    expect(getTacoWindowLabel(10)).toBe("7:05 PM – 7:25 PM");
  });

  it("returns empty label when anchor set is missing", () => {
    expect(getTacoWindowLabel(999)).toBe("");
  });
});

describe("parseDropId", () => {
  it("parses valid drop IDs", () => {
    expect(parseDropId("drop-5")).toBe(5);
  });

  it("returns null for invalid drop IDs", () => {
    expect(parseDropId("card-5")).toBeNull();
    expect(parseDropId("drop-foo")).toBeNull();
  });
});

describe("notifications utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reports unsupported when Notification API is unavailable", () => {
    const previous = (globalThis as { Notification?: unknown }).Notification;
    delete (globalThis as { Notification?: unknown }).Notification;

    expect(notificationsSupported()).toBe(false);
    expect(getPermissionStatus()).toBe("unsupported");

    (globalThis as { Notification?: unknown }).Notification = previous;
  });

  it("returns browser permission and requests it", async () => {
    const NotificationMock = Object.assign(() => undefined, {
      permission: "default",
      requestPermission: () => Promise.resolve("granted"),
    });
    Object.defineProperty(globalThis, "Notification", {
      configurable: true,
      value: NotificationMock,
    });

    expect(getPermissionStatus()).toBe("default");
    await expect(requestPermission()).resolves.toBe("granted");
  });

  it("schedules a reminder and fires notification when due", () => {
    const created: Array<{ title: string; body?: string }> = [];
    function NotificationCtor(title: string, options?: NotificationOptions) {
      created.push({ title, body: options?.body });
    }
    Object.assign(NotificationCtor, {
      permission: "granted",
      requestPermission: () => Promise.resolve("granted"),
    });
    Object.defineProperty(globalThis, "Notification", {
      configurable: true,
      value: NotificationCtor,
    });

    vi.useFakeTimers();
    vi.setSystemTime(new Date(`${FESTIVAL_DATE}T00:00:00`));

    scheduleReminder(100, "Test Band", 60);
    vi.advanceTimersByTime(45 * 60 * 1000);

    expect(created).toHaveLength(1);
    expect(created[0].title).toContain("Up Next");
    expect(created[0].body).toContain("Test Band");

    vi.useRealTimers();
  });

  it("does not schedule reminders when it is not festival day", () => {
    const created: Array<{ title: string; body?: string }> = [];
    function NotificationCtor(title: string, options?: NotificationOptions) {
      created.push({ title, body: options?.body });
    }
    Object.assign(NotificationCtor, {
      permission: "granted",
      requestPermission: () => Promise.resolve("granted"),
    });
    Object.defineProperty(globalThis, "Notification", {
      configurable: true,
      value: NotificationCtor,
    });

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-17T00:00:00"));

    scheduleReminder(100, "Test Band", 60);
    vi.advanceTimersByTime(24 * 60 * 60 * 1000);

    expect(created).toHaveLength(0);

    vi.useRealTimers();
  });

  it("syncs reminders only for favorited sets", () => {
    const created: string[] = [];
    function NotificationCtor(title: string) {
      created.push(title);
    }
    Object.assign(NotificationCtor, {
      permission: "granted",
      requestPermission: () => Promise.resolve("granted"),
    });
    Object.defineProperty(globalThis, "Notification", {
      configurable: true,
      value: NotificationCtor,
    });

    vi.useFakeTimers();
    vi.setSystemTime(new Date(`${FESTIVAL_DATE}T00:00:00`));

    syncReminders(
      new Set([1]),
      [
        { id: 1, name: "Nomads", startMinutes: 60, endMinutes: 80 },
        { id: 2, name: "Other", startMinutes: 120, endMinutes: 140 },
      ],
      1
    );

    vi.advanceTimersByTime(70 * 60 * 1000);

    expect(created.some((title) => title.includes("Up Next"))).toBe(true);
    expect(created.some((title) => title.includes("Taco Time Soon"))).toBe(
      true
    );

    vi.useRealTimers();
  });

  it("does not sync reminders when it is not festival day", () => {
    const created: string[] = [];
    function NotificationCtor(title: string) {
      created.push(title);
    }
    Object.assign(NotificationCtor, {
      permission: "granted",
      requestPermission: () => Promise.resolve("granted"),
    });
    Object.defineProperty(globalThis, "Notification", {
      configurable: true,
      value: NotificationCtor,
    });

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-17T00:00:00"));

    syncReminders(
      new Set([1]),
      [
        { id: 1, name: "Nomads", startMinutes: 60, endMinutes: 80 },
        { id: 2, name: "Other", startMinutes: 120, endMinutes: 140 },
      ],
      1
    );

    vi.advanceTimersByTime(70 * 60 * 1000);

    expect(created).toHaveLength(0);

    vi.useRealTimers();
  });
});
