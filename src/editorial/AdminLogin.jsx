import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Terminal, Loader2 } from 'lucide-react';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [terminalLines, setTerminalLines] = useState([]);
    const navigate = useNavigate();

    const addTerminalLine = (text) => {
        setTerminalLines(prev => [...prev.slice(-5), `> ${text}`]);
    };

    useEffect(() => {
        addTerminalLine('SYSTEM READY: WAITING FOR ENCRYPTION KEY...');
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(false);
        addTerminalLine('INITIALIZING AUTH_PROTOCOL_X92...');

        setTimeout(() => {
            // Check for a sample password "CENTHROPY2026"
            if (password === 'CENTHROPY2026') {
                addTerminalLine('ACCESS GRANTED. REDIRECTING TO CORE...');
                setTimeout(() => {
                    localStorage.setItem('ces_authorized', 'true');
                    navigate('/terminal-x92-core/dashboard');
                }, 1000);
            } else {
                addTerminalLine('ERROR: INVALID ENCRYPTION KEY.');
                setError(true);
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-6 selection:bg-white selection:text-black">
            <div className="w-full max-w-md">
                {/* Tactical Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-500" />
                        <span className="text-[10px] tracking-[0.3em] font-bold">SECURE_ACCESS_GATE</span>
                    </div>
                    <span className="text-[10px] text-gray-600">[X92-CORE]</span>
                </div>

                {/* Terminal Display */}
                <div className="bg-white/5 p-4 rounded-sm border border-white/5 mb-8 min-h-[140px] flex flex-col justify-end">
                    {terminalLines.map((line, i) => (
                        <div key={i} className={`text-[10px] mb-1 ${i === terminalLines.length - 1 ? 'text-white' : 'text-gray-500'}`}>
                            {line}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-center gap-2 mt-2">
                            <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                            <span className="text-[9px] text-gray-400">PROCESSING...</span>
                        </div>
                    )}
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">Input Master Key</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                placeholder="••••••••••••"
                                className={`w-full bg-transparent border-b ${error ? 'border-red-500' : 'border-white/20 focus:border-white'} py-3 outline-none transition-all placeholder:text-white/10`}
                            />
                            <Lock className={`absolute right-0 top-3 w-4 h-4 ${error ? 'text-red-500' : 'text-gray-600'}`} />
                        </div>
                        {error && (
                            <p className="text-[9px] text-red-500 mt-2 tracking-tighter">PERMISIÓN DENEGADA: VERIFIQUE SUS CREDENCIALES</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !password}
                        className="w-full py-4 border border-white/10 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
                    >
                        <Terminal className="w-4 h-4 group-hover:animate-pulse" />
                        <span className="text-xs font-bold tracking-[0.4em] uppercase">Authenticate</span>
                    </button>
                </form>

                {/* Bottom Metadata */}
                <div className="mt-12 flex justify-between items-center text-[8px] text-gray-600 tracking-[0.2em]">
                    <span>PROTOCOL_V4.0</span>
                    <span>SESSION_ENCRYPTED</span>
                    <span>LATVAL_NODE_7</span>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
