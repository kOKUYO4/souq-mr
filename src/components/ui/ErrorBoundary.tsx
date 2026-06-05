"use client";

import { Component, ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-2xl mb-2">⚠️</p>
            <p className="font-bold text-night-500">Une erreur est survenue</p>
            <button onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-night-500"
              style={{ background: "linear-gradient(135deg, #C9A84C, #B8922E)" }}>
              Réessayer
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
