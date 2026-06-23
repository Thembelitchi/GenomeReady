import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof window !== "undefined") {
  window.alert = (message: any) => {
    console.log("[Alert Intercepted]:", message);
    try {
      const event = new CustomEvent("safe-toast", { detail: String(message) });
      window.dispatchEvent(event);
    } catch (e) {
      console.error("Safe alert emit failed", e);
    }
  };

  window.confirm = (message: any) => {
    console.log("[Confirm Intercepted - Auto approved]:", message);
    try {
      const event = new CustomEvent("safe-toast", { detail: `Approved: ${String(message)}` });
      window.dispatchEvent(event);
    } catch (e) {
      console.error("Safe confirm emit failed", e);
    }
    return true;
  };

  // Intercept and silence cross-origin script errors or third-party tracking errors
  window.onerror = (message, source, lineno, colno, error) => {
    const msgStr = String(message || "");
    if (msgStr.includes("Script error.") || (source && !source.includes(window.location.origin))) {
      console.warn("[GenomeReady Global Intercept] Silenced third-party or cross-origin script exception:", message, source);
      return true; // Return true to suppress the error event from propagating further
    }
    return false;
  };

  window.addEventListener("error", (event) => {
    const msgStr = String(event.message || "");
    if (msgStr.includes("Script error.") || (event.filename && !event.filename.includes(window.location.origin))) {
      console.warn("[GenomeReady Event Intercept] Silenced cross-origin error event:", event.message);
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener("unhandledrejection", (event) => {
    const reasonStr = event.reason ? String(event.reason.message || event.reason) : "";
    if (reasonStr.includes("Script error.")) {
      console.warn("[GenomeReady Global Intercept] Silenced cross-origin rejection:", reasonStr);
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
