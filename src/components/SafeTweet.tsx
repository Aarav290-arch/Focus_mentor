"use client";
import React, { ReactNode } from "react";
import { Tweet } from "react-tweet";

interface SafeTweetProps {
  id: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            Tweet unavailable
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default function SafeTweet({ id }: SafeTweetProps) {
  return (
    <ErrorBoundary>
      <Tweet id={id} />
    </ErrorBoundary>
  );
}
