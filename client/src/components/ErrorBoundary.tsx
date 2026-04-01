import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-main)]">
                    <div className="glass-card max-w-md w-full text-center py-12 px-6 shadow-2xl shadow-red-500/10">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 drop-shadow-lg" />
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Oops! Something went wrong.</h1>
                        <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                            We're sorry, an unexpected fatal error has occurred rendering this view. Our team has been notified.
                        </p>
                        <button 
                            className="btn-primary"
                            onClick={() => window.location.href = "/"}
                        >
                            Return Safe Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
