import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const DocumentationConstruction = () => {
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 0;
                return prev + 0.5;
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-8 left-8 flex items-center gap-2 group cursor-pointer"
            >
                <div className="w-8 h-8 rounded-none border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <ChevronLeft size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] ml-1">Volver</span>
            </button>
            <div className="flex flex-col items-center max-w-xl w-full">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 mb-3"
                >
                    System Status: Building
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-black mb-12 text-center"
                >
                    DESARROLLANDO DOCUMENTACIÓN
                </motion.h1>

                <div className="w-48 h-[1px] bg-black/5 relative overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-black"
                        style={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                    />
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-[9px] font-bold text-black/30 uppercase tracking-[0.3em] font-funnel"
                >
                    Unify Data Center — Unified Data Engine — 2026
                </motion.p>
            </div>
        </div>
    );
};

export default DocumentationConstruction;
