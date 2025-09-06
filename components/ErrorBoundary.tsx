import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/Button';
import { ErrorIcon } from './ui/icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
            <div className="text-center bg-white/60 dark:bg-gray-800/60 p-8 rounded-xl shadow-lg max-w-lg">
                <ErrorIcon className="h-16 w-16 mx-auto text-red-500" />
                <h1 className="mt-4 text-2xl font-bold">Something went wrong.</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    An unexpected error has occurred. Please try reloading the page.
                </p>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-left text-xs">
                        <summary className="font-semibold cursor-pointer">Error Details</summary>
                        <pre className="mt-2 whitespace-pre-wrap break-all">
                            {this.state.error.toString()}
                            <br />
                            {this.state.error.stack}
                        </pre>
                    </details>
                )}

                <Button onClick={this.handleReload} className="mt-6">
                    Reload Page
                </Button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}