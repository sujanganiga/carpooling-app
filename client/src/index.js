import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Tailwind CSS and custom styles

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application Error:", error);
    console.error("Error Info:", errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    const errorFallback = document.getElementById("error-fallback");
    const root = document.getElementById("root");
    if (errorFallback && root) {
      root.style.display = "none";
      errorFallback.style.display = "block";
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              We're sorry, but there was an error loading the application.
            </p>
            <details className="text-left text-sm text-gray-500 mb-4">
              <summary className="cursor-pointer font-medium">
                Error Details
              </summary>
              <pre className="mt-2 whitespace-pre-wrap break-words">
                {this.state.error && this.state.error.toString()}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const initializeApp = () => {
  try {
    const container = document.getElementById("root");

    if (!container) {
      throw new Error("Root element not found");
    }

    const root = ReactDOM.createRoot(container);

    const loadingFallback = document.getElementById("loading-fallback");
    if (loadingFallback) {
      loadingFallback.style.display = "none";
    }

    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Failed to initialize app:", error);

    const errorFallback = document.getElementById("error-fallback");
    const rootElement = document.getElementById("root");

    if (errorFallback && rootElement) {
      rootElement.style.display = "none";
      errorFallback.style.display = "block";
    }
  }
};

const appConfig = {
  apiBaseUrl: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  environment: process.env.NODE_ENV || "development",
  version: process.env.REACT_APP_VERSION || "1.0.0",
  buildDate: process.env.REACT_APP_BUILD_DATE || new Date().toISOString(),
};

window.APP_CONFIG = appConfig;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

window.addEventListener("error", (event) => {
  console.error("Unhandled error:", event.error);
  if (
    event.error &&
    event.error.stack &&
    event.error.stack.includes("ChunkLoadError")
  ) {
    window.location.reload();
  }
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  event.preventDefault();
});

if (process.env.NODE_ENV === "development") {
  if (typeof window !== "undefined") {
    window.React = React;
  }

  console.log("🚗 Carpool App initialized in development mode");
  console.log("📊 App Config:", appConfig);

  if (module.hot) {
    module.hot.accept("./App", () => {
      const NextApp = require("./App").default;
      const container = document.getElementById("root");
      const root = ReactDOM.createRoot(container);

      root.render(
        <React.StrictMode>
          <ErrorBoundary>
            <NextApp />
          </ErrorBoundary>
        </React.StrictMode>
      );
    });
  }
}

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};

  console.info("🚗 Carpool App loaded successfully");
}

export const cleanup = () => {
  const container = document.getElementById("root");
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.unmount();
  }
};

export { appConfig };
export default initializeApp;
