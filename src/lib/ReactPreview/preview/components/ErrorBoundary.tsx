// components/ErrorBoundary.tsx
import React, { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="rounded-lg bg-white p-4 shadow-[0_0_0_1px_rgba(255,91,79,0.24),0_2px_2px_rgba(0,0,0,0.04)]">
          <h3 className="mb-2 text-sm font-semibold text-[#c73a31]">组件渲染错误</h3>
          <p className="text-sm text-[#4d4d4d]">
            {this.state.error?.message || '未知错误'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-3 rounded-md bg-[#171717] px-3 py-1.5 text-sm font-medium text-white hover:bg-black"
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
