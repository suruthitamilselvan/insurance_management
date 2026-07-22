import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white text-center">
          <div className="max-w-md space-y-4 glass-card p-8 rounded-2xl border border-rose-500/40 shadow-2xl">
            <h2 className="text-xl font-bold text-rose-400">Application Error Encountered</h2>
            <p className="text-xs text-slate-300 font-mono bg-slate-900 p-3 rounded-xl border border-slate-800 text-left overflow-x-auto">
              {this.state.error?.toString()}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20"
            >
              Clear Stale Cache & Return to Login
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
