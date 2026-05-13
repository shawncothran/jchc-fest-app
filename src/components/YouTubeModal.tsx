import { useEffect, useRef } from "react";

interface YouTubeModalProps {
  bandName: string;
  youtubeUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function YouTubeModal({
  bandName,
  youtubeUrl,
  isOpen,
  onClose,
}: YouTubeModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Extract video ID from various YouTube URL formats
  function extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  const videoId = extractVideoId(youtubeUrl);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Trigger iOS autoplay via YouTube API + try multiple strategies
  useEffect(() => {
    if (!isOpen || !iframeRef.current) {
      return;
    }

    // Try multiple strategies to trigger playback
    const timer = setTimeout(() => {
      if (iframeRef.current?.contentWindow) {
        // Strategy 1: YouTube IFrame API postMessage
        iframeRef.current.contentWindow.postMessage(
          { event: "command", func: "playVideo" },
          "*"
        );

        // Strategy 2: Try focus + keyboard event
        iframeRef.current.focus();

        // Strategy 3: Reload with updated src to trigger autoplay
        const currentSrc = iframeRef.current.src;
        if (!currentSrc.includes("autoplay=1")) {
          const newSrc = currentSrc.includes("?")
            ? `${currentSrc}&autoplay=1`
            : `${currentSrc}?autoplay=1`;
          iframeRef.current.src = newSrc;
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 safe-area-insets">
        <div
          className="relative w-full max-w-2xl bg-zinc-900 rounded-xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <h2 className="font-display text-lg text-white truncate">
              {bandName}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="ml-2 p-1 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Video Container */}
          {videoId ? (
            <div className="relative w-full bg-black pt-[56.25%]">
              <iframe
                ref={iframeRef}
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&playsinline=1&mute=0`}
                title={bandName}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-zinc-800 flex items-center justify-center">
              <p className="text-zinc-500 text-sm">Invalid YouTube URL</p>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              Click outside or press ESC to close
            </p>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-500 hover:text-brand-400 transition-colors font-bold uppercase"
            >
              Watch on YouTube →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
