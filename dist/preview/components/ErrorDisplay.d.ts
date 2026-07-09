import { CSSProperties } from 'react';
import { ErrorInfo } from '../types';
interface ErrorDisplayProps {
    error: ErrorInfo;
    files?: Record<string, string>;
    className?: string;
    style?: CSSProperties;
}
export declare function ErrorDisplay({ error, files, className, style }: ErrorDisplayProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ErrorDisplay.d.ts.map