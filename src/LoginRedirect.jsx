import React, { useEffect } from 'react';

const LoginRedirect = () => {
    useEffect(() => {
        window.location.href = 'https://app.centhropy.com';
    }, []);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center font-mono">
            <div className="flex flex-col items-center gap-4 animate-pulse duration-1000">
                <span className="text-white/50 text-[10px] tracking-widest uppercase">INITIALIZING_SECURE_PROTOCOL...</span>
                <span className="text-white text-xs tracking-[0.2em] font-bold">REDIRECTING TO TERMINAL</span>
            </div>
        </div>
    );
};

export default LoginRedirect;
