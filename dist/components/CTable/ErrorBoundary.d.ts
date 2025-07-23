import React, { Component, ReactNode } from 'react';
interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: (error: Error, errorInfo: React.ErrorInfo) => ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
declare class CTableErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    handleRetry: () => void;
    render(): string | number | boolean | Iterable<React.ReactNode> | import("react/jsx-runtime").JSX.Element | null | undefined;
}
export default CTableErrorBoundary;
//# sourceMappingURL=ErrorBoundary.d.ts.map