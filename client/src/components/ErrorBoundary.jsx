import { Component } from "react";
import { AlertCircle } from "lucide-react";





export default class ErrorBoundary extends Component {
    state = {
        hasError: false
    };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
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
