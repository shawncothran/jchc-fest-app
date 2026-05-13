import { useEffect, useState } from "react";

// Extend the BeforeInstallPromptEvent which isn't in lib.dom yet
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type PromptVariant = "android" | "ios" | "other" | null;

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  // Chrome and Firefox on iOS set their own UA string but still use WebKit;
  // we only want vanilla Safari (no "CriOS" or "FxiOS")
  const isSafari = /safari/i.test(ua) && !/crios|fxios/i.test(ua);
  return isIos && isSafari;
}

function isIos(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches
  );
}

const DISMISSED_KEY = "jchcfest-install-dismissed";

function isDismissed(): boolean {
  try {
    return !!localStorage.getItem(DISMISSED_KEY);
  } catch {
    return false;
  }
}

function setDismissed(): void {
  try {
    localStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    // localStorage may be unavailable
  }
}

export default function InstallPrompt() {
  const [variant, setVariant] = useState<PromptVariant>(() => {
    if (isStandalone() || isDismissed()) {
      return null;
    }
    if (isIosSafari()) {
      return "ios";
    }
    return null;
  });
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [iosExpanded, setIosExpanded] = useState(false);

  useEffect(() => {
    // Skip if already determined or dismissed
    if (variant !== null) {
      return;
    }
    if (isStandalone() || isDismissed()) {
      return;
    }

    let resolved = false;

    const handler = (e: Event) => {
      resolved = true;
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVariant("android");
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Give the browser a moment to fire beforeinstallprompt before falling back
    const fallback = setTimeout(() => {
      if (!resolved) {
        setVariant("other");
      }
    }, 500);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(fallback);
    };
  }, [variant]);

  function dismiss() {
    setDismissed();
    setVariant(null);
  }

  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVariant(null);
    }
    setDeferredPrompt(null);
  }

  if (!variant) {
    return null;
  }

  return (
    <div className="border-b border-zinc-800 bg-zinc-900">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-start gap-3">
        {/* Icon */}
        <img
          src="/icons/icon-192x192.png"
          alt=""
          aria-hidden="true"
          className="w-10 h-10 rounded-xl shrink-0 mt-0.5"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight">
            Add to Home Screen
          </p>

          {variant === "android" && (
            <p className="text-xs text-zinc-400 mt-0.5">
              Install the app for quick access on fest day.
            </p>
          )}

          {variant === "ios" && (
            <>
              <p className="text-xs text-zinc-400 mt-0.5">
                Install for quick access on fest day.
              </p>
              {iosExpanded && (
                <ol className="mt-2 space-y-1 text-xs text-zinc-300 list-none">
                  <li>
                    <span className="text-zinc-500 mr-1">1.</span>
                    Tap the{" "}
                    <span className="inline-flex items-center gap-0.5 font-bold text-white">
                      Share
                      {/* Safari share icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5"
                        aria-hidden="true"
                      >
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                        <polyline points="16 6 12 2 8 6" />
                        <line x1="12" y1="2" x2="12" y2="15" />
                      </svg>
                    </span>{" "}
                    button in Safari&apos;s toolbar.
                  </li>
                  <li>
                    <span className="text-zinc-500 mr-1">2.</span>
                    Scroll down and tap{" "}
                    <span className="font-bold text-white">
                      Add to Home Screen
                    </span>
                    .
                  </li>
                  <li>
                    <span className="text-zinc-500 mr-1">3.</span>
                    Tap <span className="font-bold text-white">Add</span>.
                  </li>
                </ol>
              )}
            </>
          )}

          {variant === "other" && (
            <>
              <p className="text-xs text-zinc-400 mt-0.5">
                Add to your home screen for quick access on fest day.
              </p>
              {iosExpanded &&
                (isIos() ? (
                  <p className="mt-2 text-xs text-zinc-300">
                    Open this page in{" "}
                    <span className="font-bold text-white">Safari</span>, then
                    tap the <span className="font-bold text-white">Share</span>{" "}
                    button and choose{" "}
                    <span className="font-bold text-white">
                      Add to Home Screen
                    </span>
                    .
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-zinc-300">
                    Open your browser&apos;s menu (usually{" "}
                    <span className="font-bold text-white">⋮</span> or{" "}
                    <span className="font-bold text-white">☰</span>) and look
                    for{" "}
                    <span className="font-bold text-white">
                      Add to Home Screen
                    </span>{" "}
                    or <span className="font-bold text-white">Install App</span>
                    .
                  </p>
                ))}
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            {variant === "android" && (
              <button
                onClick={() => void handleInstall()}
                className="text-xs font-bold uppercase tracking-widest border border-white hover:bg-white/10 active:bg-white/20 text-white px-3 py-1.5 rounded transition-colors"
              >
                Install
              </button>
            )}
            {(variant === "ios" || variant === "other") && (
              <button
                onClick={() => setIosExpanded((v) => !v)}
                className="text-xs font-bold uppercase tracking-widest border border-white hover:bg-white/10 active:bg-white/20 text-white px-3 py-1.5 rounded transition-colors"
              >
                {iosExpanded ? "Got it" : "How to"}
              </button>
            )}
            <button
              onClick={dismiss}
              className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 px-3 py-1.5 rounded transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
