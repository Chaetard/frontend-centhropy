import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class AdminErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('[AdminErrorBoundary] Caught error:', error, info);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-12 text-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-red-50 border border-red-100 mb-6">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <h2 className="text-base font-semibold text-[#222944] dark:text-[#BCC5DC] mb-2 font-funnel">
                        Algo salió mal
                    </h2>
                    <p className="text-[11px] text-[#222944]/45 dark:text-[#BCC5DC]/60 mb-1 max-w-sm">
                        Se produjo un error en esta sección del panel. Tu sesión y datos están intactos.
                    </p>
                    {this.state.error?.message && (
                        <p className="text-[10px] font-mono text-red-400 bg-red-50 px-3 py-1.5 border border-red-100 mb-6 max-w-sm break-all">
                            {this.state.error.message}
                        </p>
                    )}
                    <button
                        onClick={this.handleReset}
                        className="flex items-center gap-2 px-5 py-2.5 text-xs font-funnel uppercase tracking-widest bg-black text-white hover:bg-[#222944]/80 transition-all active:scale-95"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reintentar
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AdminErrorBoundary;
