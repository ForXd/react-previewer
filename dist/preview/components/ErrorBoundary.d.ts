import { Component, ErrorInfo, ReactNode } from 'react';
interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    renderFallback?: (error: Error, reset: () => void) => ReactNode;
}
interface State {
    hasError: boolean;
    error?: Error;
}
export declare class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props);
    static getDerivedStateFromError(error: Error): State;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    private reset;
    render(): string | number | bigint | boolean | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import('react').ReactPortal | import('react').ReactElement<unknown, string | import('react').JSXElementConstructor<any>> | Iterable<ReactNode>> | import("react/jsx-runtime").JSX.Element;
}
export {};
//# sourceMappingURL=ErrorBoundary.d.ts.map