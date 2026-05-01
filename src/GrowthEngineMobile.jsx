import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';

const words = ["Rentabilidad", "Ventas", "ROI", "ROAS", "Ingresos"];

const DynamicWord = ({ words }) => {
    const [index, setIndex] = useState(0);
    const [displayText, setDisplayText] = useState(words[0]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

    useEffect(() => {
        let timer;
        const currentFullWord = words[index];

        if (isWaiting) {
            timer = setTimeout(() => setIsWaiting(false), 3000);
            return () => clearTimeout(timer);
        }

        if (isDeleting) {
            if (displayText.length > 0) {
                timer = setTimeout(() => {
                    setDisplayText(prev => prev.slice(0, -1));
                }, 12);
            } else {
                setIsDeleting(false);
                setIndex((prev) => (prev + 1) % words.length);
            }
        } else {
            if (displayText.length < currentFullWord.length) {
                const totalChars = currentFullWord.length || 1;
                const progress = displayText.length / totalChars;
                const delay = 40 - (progress * 15); // Aceleración de 40ms a 25ms
                
                timer = setTimeout(() => {
                    setDisplayText(currentFullWord.slice(0, displayText.length + 1));
                }, delay);
            } else {
                setIsWaiting(true);
                setIsDeleting(true);
            }
        }
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, index, isWaiting, words]);

    return (
        <span className="inline-block text-[#222944] dark:text-[#F8F9FA]/95">
            {displayText}
        </span>
    );
};

const phases = [
    { id: '0.1', title: ['Despliegue', 'Tecnológico'] },
    { id: '0.2', title: ['Análisis y', 'Optimización'] },
    { id: '0.3', title: ['Escala de', 'Adquisición'] },
    { id: '0.4', title: ['Expansión de', 'Resultados'] },
    { id: '0.5', title: ['Consolidación', 'de Crecimiento'] },
];

const GrowthEngineMobile = () => {
    return (
        <div className="font-funnel no-select w-full bg-white dark:bg-[#1B2136] text-[#222944] dark:text-[#BCC5DC] min-h-[100dvh] relative overflow-x-hidden pt-[72px]">
            <Navbar />

            {/* NEW HERO SECTION */}
            <section className="min-h-[calc(100dvh-72px)] w-full flex flex-col items-center justify-center text-center px-6 relative z-10 pb-[20vh] pt-8">
                <h1 className="text-[32px] md:text-5xl leading-[1] font-black tracking-tighter mb-6 text-[#222944] dark:text-[#F8F9FA]/95">
                    Crecimiento y Optimización<br />
                    del 20—30% en <DynamicWord words={words} />
                </h1>
                
                <p className="max-w-[400px] text-[14px] text-[#222944]/70 dark:text-[#BCC5DC]/70 font-light leading-[1.6] mb-8">
                    Solución enfocada en maximizar la conversión y optimizar la rentabilidad, mediante la integración del ecosistema Unify, la implementación de la metodología Data—Driven Growth y el desarrollo de eCommerce inteligente.
                </p>

                <div className="mb-10">
                    <span className="text-[12px] shimmer-text font-medium block text-center mb-4 leading-snug">
                        Última Generación en<br />Soluciones para eCommerce
                    </span>
                    <Link to="/waitlist" className="border border-[#222944] dark:border-[#BCC5DC] text-[#222944] dark:text-[#BCC5DC] px-10 py-4 uppercase tracking-widest text-[11px] font-bold active:bg-[#222944] active:text-white dark:active:bg-[#BCC5DC] dark:active:text-[#222944] transition-all duration-300">
                        CONECTAR
                    </Link>
                </div>
            </section>

            {/* 5 COLUMNS SECTION (Horizontal scrollable) */}
            <section className="h-[100dvh] w-full flex flex-row overflow-x-auto snap-x snap-mandatory hide-scrollbar bg-white dark:bg-[#222944]">
                {phases.map((phase, i) => (
                    <div
                        key={phase.id}
                        className={`min-w-[70vw] snap-center flex-1 flex flex-col justify-end p-8 pb-16 h-full
                            ${i < phases.length - 1 ? 'border-r border-[#222944]/20 dark:border-[#BCC5DC]/10' : ''}`}
                    >
                        <span className="text-[10px] font-bold tracking-wider text-[#222944]/25 dark:text-[#BCC5DC]/25 mb-3">
                            {phase.id}
                        </span>
                        <h2 className="text-[25px] font-semibold uppercase tracking-tighter leading-[1.05]">
                            {phase.title.map((line, j) => (
                                <span key={j} className="block whitespace-nowrap">{line}</span>
                            ))}
                        </h2>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default GrowthEngineMobile;
