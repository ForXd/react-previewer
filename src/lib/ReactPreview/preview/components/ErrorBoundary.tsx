// components/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  renderFallback?: (error: Error, reset: () => void) => ReactNode;
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

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.state.error && this.props.renderFallback) {
        return this.props.renderFallback(this.state.error, this.reset);
      }

      return this.props.fallback ?? (
        <div className="react-previewer__boundary-error" role="alert">
          <span className="react-previewer__eyebrow">Previewer error</span>
          <h2>The preview surface crashed</h2>
          <p>
            {this.state.error?.message || 'An unknown error occurred.'}
          </p>
          <button
            type="button"
            onClick={this.reset}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
