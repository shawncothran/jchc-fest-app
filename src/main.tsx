import { Component, StrictMode, type ErrorInfo, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Handle unhandled promise rejections from dnd-kit on iOS
window.addEventListener("unhandledrejection", (event) => {
  // Check if it's the dnd-kit iOS payload error
  const reason = event.reason as { message?: string } | undefined;
  if (
    typeof reason === "object" &&
    reason?.message?.includes("Cannot read properties of undefined")
  ) {
    console.warn(
      "[iOS dnd-kit] Suppressing known drag-kit iOS event bug",
      reason
    );
    event.preventDefault();
  }
});

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{ padding: "2rem", color: "#fff", fontFamily: "sans-serif" }}
        >
          <p style={{ color: "#e83d72", fontWeight: "bold" }}>
            Something went wrong.
          </p>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#71717a",
              marginTop: "0.5rem",
            }}
          >
            Try refreshing the page.
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#52525b",
              marginTop: "1rem",
              wordBreak: "break-all",
            }}
          >
            {String(this.state.error)}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
