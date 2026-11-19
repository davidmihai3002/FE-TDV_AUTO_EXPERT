import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportError } from '@/libs';
import { ErrorPage } from './ErrorPage/ErrorPage';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (args: { error: unknown; reset: () => void }) => ReactNode;
  /** reset when any of these change (e.g. location.pathname) */
  resetKeys?: unknown[];
  onError?: (error: unknown, info: ErrorInfo) => void;
}

interface State {
  error: unknown;
  keys?: unknown[];
}

/** Last-resort crash screen (root, outside the router) and reusable around risky widgets. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null, keys: this.props.resetKeys };

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { error };
  }

  static getDerivedStateFromProps(props: ErrorBoundaryProps, state: State): Partial<State> | null {
    const changed =
      props.resetKeys && state.keys && props.resetKeys.some((k, i) => !Object.is(k, state.keys?.[i]));
    return changed ? { error: null, keys: props.resetKeys } : null;
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    reportError(error, { componentStack: info.componentStack });
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (error === null) return this.props.children;
    if (this.props.fallback) return this.props.fallback({ error, reset: this.reset });
    const e = error instanceof Error ? error : null;
    return (
      <ErrorPage
        variant="server"
        standalone
        onRetry={() => window.location.reload()}
        debug={e ? { message: e.message, stack: e.stack } : { message: String(error) }}
      />
    );
  }
}
