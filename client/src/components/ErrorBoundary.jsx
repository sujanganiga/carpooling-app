import React, { Component } from "react";
import { useTranslation } from "react-i18next";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              {t("somethingWentWrong")}
            </h2>
            <p className="mb-4">{t("applicationError")}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              {t("reloadPage")}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap with translation HOC
export default function TranslatedErrorBoundary(props) {
  const { t } = useTranslation();
  return <ErrorBoundary t={t} {...props} />;
}
