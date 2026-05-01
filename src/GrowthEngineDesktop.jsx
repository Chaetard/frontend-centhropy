import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Navbar from './components/Navbar';

const phases = [
    { 
        id: 'PHASE.01', 
        title: 'Despliegue Tecnológico', 
        desc: 'Activación de Unify, desarrollo personalizado de eCommerce inteligente e integración con la infraestructura del negocio.'
    },
    { 
        id: 'PHASE.02', 
        title: 'Análisis y Optimización',
        desc: 'Análisis de realidad y potencial de negocio, identificación de oportunidades de crecimiento, medición de riesgo y predicciones de impacto.'
    },
    { 
        id: 'PHASE.03', 
        title: 'Escala de Adquisición',
        desc: 'Despliegue de metodologías de captación, conversión y gestión especializada de Paid Media bajo el enfoque Data—Driven.'
    },
    { 
        id: 'PHASE.04', 
        title: 'Expansión de Resultados',
        desc: 'Activación de sistemas de retención diseñados para multiplicar el valor por cliente y reducir la dependencia de captación.'
    },
    { 
        id: 'PHASE.05', 
        title: 'Consolidación de Crecimiento',
        desc: 'El objetivo consiste en solidificar el crecimiento como una constante en la división de eCommerce de cada negocio, por medio de la implementación del enfoque Data—Driven Growth.'
    },
];

const fullLines = [
    "Crecimiento y Optimización",
    "del 20—30% en "
];

const words = ["Rentabilidad", "Ventas", "ROI", "ROAS", "Ingresos"];

const DynamicWord = ({ words, baseDelay, startAnim, startCycle }) => {
    const [index, setIndex] = useState(0);
    const [displayText, setDisplayText] = useState(words[0]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isWaiting, setIsWaiting] = useState(true);

    useEffect(() => {
        if (startCycle) {
            const timer = setTimeout(() => setIsWaiting(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [startCycle]);

    useEffect(() => {
        if (isWaiting) return;

        let timer;
        const currentFullWord = words[index];

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
                const delay = 40 - (progress * 15); // De 40ms a 25ms (Aceleración)
                
                timer = setTimeout(() => {
                    setDisplayText(currentFullWord.slice(0, displayText.length + 1));
                }, delay);
            } else {
                timer = setTimeout(() => {
                    setIsDeleting(true);
                }, 3000);
            }
        }
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, index, isWaiting, words]);

    if (isWaiting && index === 0 && displayText === words[0]) {
        return (
            <span className="inline-block">
                {words[0].split('').map((char, i) => (
                    <span
                        key={i}
                        className="inline-block"
                        style={{
                            transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease',
                            transitionDelay: `${baseDelay + (i * 25)}ms`,
                            transform: startAnim ? 'translateY(0)' : 'translateY(35px)',
                            opacity: startAnim ? 1 : 0,
                            whiteSpace: 'pre'
                        }}
                    >
                        {char}
                    </span>
                ))}
            </span>
        );
    }

    return (
        <span className="inline-block text-[#222944] dark:text-[#F8F9FA]/95">
            {displayText}
        </span>
    );
};


const GrowthEngineDesktop = () => {
    const [startAnim, setStartAnim] = useState(false);
    const [showButtonEntry, setShowButtonEntry] = useState(false);
    const [showFullAction, setShowFullAction] = useState(false);
    const [showLabel, setShowLabel] = useState(false);
    const [cardsAnchored, setCardsAnchored] = useState(false);

    // Ref for the tall scroll wrapper that drives everything
    const scrollWrapperRef = useRef(null);

    // Track scroll progress across the entire tall wrapper (800vh)
    const { scrollYProgress } = useScroll({
        target: scrollWrapperRef,
        offset: ["start start", "end end"]
    });

    // --- SCROLL-DRIVEN TRANSFORMS ---
    // 0.0 to 0.12 approx = Hero Section to Panel 1 Transition
    
    // PANEL 1 (STATUS PANEL) TRANSFORMS
    // Entry/Hero Exit: 0.05-0.16 | Staying for Panel 2 entry
    const titleX = useTransform(scrollYProgress, [0.05, 0.14], [-1500, 0]);
    const descX = useTransform(scrollYProgress, [0.08, 0.16], [1500, 0]);

    const card1Y = useTransform(scrollYProgress, [0.10, 0.18], [800, 0]);
    const card2Y = useTransform(scrollYProgress, [0.12, 0.20], [800, 0]);
    const card3Y = useTransform(scrollYProgress, [0.14, 0.22], [800, 0]);
    const card4Y = useTransform(scrollYProgress, [0.16, 0.24], [800, 0]);
    const card5Y = useTransform(scrollYProgress, [0.18, 0.26], [800, 0]);

    const firstBtnX = useTransform(scrollYProgress, [0.26, 0.34], [300, 0]);
    const firstBtnOpacity = useTransform(scrollYProgress, [0.26, 0.32], [0, 1]);

    // PANEL 2 (SECONDARY PANEL) TRANSFORMS
    const secondPanelY = useTransform(scrollYProgress, [0.55, 0.70], ["100vh", "0vh"]);
    
    const secondTitleX = useTransform(scrollYProgress, [0.70, 0.80], [-1500, 0]);

    const scard1Y = useTransform(scrollYProgress, [0.82, 0.90], [800, 0]);
    const scard2Y = useTransform(scrollYProgress, [0.84, 0.92], [800, 0]);
    const scard3Y = useTransform(scrollYProgress, [0.86, 0.94], [800, 0]);
    const scard4Y = useTransform(scrollYProgress, [0.88, 0.96], [800, 0]);
    const scard5Y = useTransform(scrollYProgress, [0.90, 0.98], [800, 0]);

    const secondBtnX = useTransform(scrollYProgress, [0.96, 0.99], [300, 0]);
    const secondBtnOpacity = useTransform(scrollYProgress, [0.96, 0.98], [0, 1]);



    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest >= 0.26 && latest < 0.55) {
            setCardsAnchored(true);
        } else {
            setCardsAnchored(false);
        }
    });

    useEffect(() => {
        const initTimeout = setTimeout(() => {
            setStartAnim(true);
            setTimeout(() => {
                setShowButtonEntry(true);
                setTimeout(() => {
                    setShowFullAction(true);
                    setTimeout(() => {
                        setShowLabel(true);
                    }, 500);
                }, 800);
            }, 1550);
        }, 950);

        return () => clearTimeout(initTimeout);
    }, []);

    let globalCharIndex = 0;

    return (
        <div className="font-funnel no-select w-full text-[#222944] dark:text-[#BCC5DC] relative">
            <Navbar />

            {/* ========== FIXED HERO (behind everything) ========== */}
            <div className="fixed inset-0 z-0 flex flex-col pt-[84px] bg-white dark:bg-[#1B2136]">
                <motion.section 
                    className="w-full flex-1 flex flex-col items-center justify-center text-center max-w-[1800px] mx-auto px-5 md:px-10 pb-[25vh] pt-[9.4vh] md:pt-[13.6vh] pointer-events-auto relative z-10"
                >
                    <span
                        className="text-[14px] md:text-[17px] text-[#222944]/50 dark:text-[#BCC5DC]/50 font-medium mb-1 block uppercase tracking-[0.15em] transition-all duration-1000 ease-out"
                        style={{
                            opacity: showLabel ? 1 : 0,
                            transform: showLabel ? 'translateY(0)' : 'translateY(-20px)'
                        }}
                    >
                        GROWTH ENGINE
                    </span>

                    <div className="max-w-[1500px] w-full flex flex-col items-center">
                        <div className="text-[40px] md:text-[75px] leading-[1.1] font-light tracking-tighter text-[#222944] dark:text-[#F8F9FA]/95">
                            {fullLines.map((line, li) => (
                                <div key={li} className="overflow-hidden pb-3 -mb-3">
                                    {line.split('').map((char, ci) => {
                                        const delay = (globalCharIndex++) * 25;
                                        return (
                                            <span
                                                key={ci}
                                                className="inline-block"
                                                style={{
                                                    transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease',
                                                    transitionDelay: `${delay}ms`,
                                                    transform: startAnim ? 'translateY(0)' : 'translateY(35px)',
                                                    opacity: startAnim ? 1 : 0,
                                                    whiteSpace: 'pre'
                                                }}
                                            >
                                                {char}
                                            </span>
                                        );
                                    })}
                                    {li === 1 && (
                                        <DynamicWord 
                                            words={words} 
                                            baseDelay={globalCharIndex * 25} 
                                            startAnim={startAnim}
                                            startCycle={showLabel}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-8 md:mt-10 overflow-visible h-[50px] md:h-[60px] relative w-full">
                            <div className="flex items-center relative">
                                <div 
                                    className="relative flex items-center transition-transform duration-700 ease-in-out z-20"
                                    style={{
                                        transform: showFullAction 
                                            ? `translateX(${typeof window !== 'undefined' && window.innerWidth < 768 ? '90px' : '95px'})` 
                                            : 'translateX(0px)',
                                    }}
                                >
                                    <div
                                        className="absolute right-full top-1/2 -translate-y-1/2 overflow-hidden flex justify-end transition-all duration-700 ease-in-out z-0"
                                        style={{
                                            width: showFullAction 
                                                ? (typeof window !== 'undefined' && window.innerWidth < 768 ? '300px' : '308px') 
                                                : '0px',
                                            opacity: showFullAction ? 1 : 0,
                                        }}
                                    >
                                        <div 
                                            className="flex justify-end w-full"
                                            style={{ 
                                                paddingRight: typeof window !== 'undefined' && window.innerWidth < 768 ? '20px' : '28px' 
                                            }}
                                        >
                                            <span
                                                className="text-[13px] md:text-[15px] shimmer-text font-medium leading-[1.3] min-w-[170px] md:min-w-[240px] tracking-normal inline-block text-right transition-transform duration-700 ease-out py-1 flex-shrink-0"
                                                style={{
                                                    transform: showFullAction ? 'translateX(0px)' : 'translateX(100%)',
                                                }}
                                            >
                                                Última Generación en <br /> Soluciones para eCommerce
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        to="/waitlist"
                                        className="relative z-[100] border border-[#222944] dark:border-[#BCC5DC] bg-white dark:bg-[#1B2136] text-[#222944] dark:text-[#BCC5DC] hover:bg-[#222944] hover:text-white dark:hover:bg-[#BCC5DC] dark:hover:text-[#222944] transition-all duration-300 rounded-none px-7 py-3 md:px-9 md:py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest shrink-0 flex items-center h-[45px] md:h-[50px] pointer-events-auto"
                                        style={{
                                            opacity: showButtonEntry ? 1 : 0,
                                            transform: showButtonEntry ? 'translateY(0)' : 'translateY(30px) scale(0.95)',
                                            pointerEvents: showButtonEntry ? 'auto' : 'none'
                                        }}
                                    >
                                        CONECTAR
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <div className="absolute bottom-8 md:bottom-12 left-0 w-full flex justify-center pointer-events-none z-10">
                    <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80 rotate-180">
                        <path d="M50 5L30 25L10 5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="square" strokeLinejoin="miter" className="text-[#222944] dark:text-[#BCC5DC]" />
                        <path d="M50 5L30 25L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className="energy-path text-[#222944] dark:text-[#BCC5DC]" />
                    </svg>
                </div>
            </div>

            {/* ========== SCROLL WRAPPER (drives everything) ========== */}
            <main ref={scrollWrapperRef} className="relative z-10 w-full pointer-events-none" style={{ height: '800vh' }}>
                <div className="h-screen pointer-events-none" />

                {/* FIRST RISING PANEL (Status Panel) */}
                <div id="status-panel" className="sticky top-0 h-screen w-full bg-white dark:bg-[#1B2136] overflow-hidden flex flex-col pt-28 pointer-events-auto">
                    <div className="max-w-[1800px] mx-auto w-full px-5 md:px-10 shrink-0">
                        <div className="grid grid-cols-12 gap-8 md:gap-10 items-start mb-10">
                            <motion.div style={{ x: titleX }} className="col-span-12 md:col-span-5">
                                <div className="text-[42px] leading-[1.05] font-light tracking-tighter text-[#222944] dark:text-[#BCC5DC]">
                                    Ecosistema inteligente de<br />
                                    alta precisión — <span className="font-normal">Impulsado<br />
                                    por Unify</span>
                                </div>
                            </motion.div>
                            <motion.div style={{ x: descX }} className="col-span-12 md:col-span-6 md:col-start-7">
                                <p className="text-[18px] leading-[1.7] font-light text-[#222944]/70 dark:text-[#BCC5DC]/70">
                                    Especialistas y sistemas enfocados en potenciar la rentabilidad,<br className="hidden lg:block" />
                                    optimizar las operaciones digitales y generar crecimiento sostenible para<br className="hidden lg:block" />
                                    organizaciones de alto valor en la industria del <span className="whitespace-nowrap">Retail — eCommerce.</span>
                                </p>
                                <motion.div style={{ x: firstBtnX, opacity: firstBtnOpacity }}>
                                    <Link to="/waitlist" className="inline-flex items-center mt-8 text-[11px] font-bold tracking-widest uppercase text-[#222944] dark:text-[#BCC5DC] hover:opacity-70 transition-opacity">
                                        CONECTAR <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="flex-1 w-full bg-white dark:bg-[#1B2136]">
                        <div className="grid grid-cols-5 h-full w-full divide-x-2 divide-white dark:divide-[#1B2136]">
                            {phases.map((card, i) => (
                                <motion.div 
                                    key={i} 
                                    style={{ y: [card1Y, card2Y, card3Y, card4Y, card5Y][i] }}
                                    className={`relative h-full flex flex-col justify-between p-10 bg-[#F8F9FA] dark:bg-[#303A5F] group overflow-hidden cursor-default transition-all duration-300 ${cardsAnchored ? 'pointer-events-auto' : 'pointer-events-none'}`}
                                >
                                    <div className="absolute inset-0 bg-[#222944] dark:bg-[#F8F9FA] translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-150 group-hover:delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                                    <div className="relative z-10 w-0 h-[1.5px] bg-white/40 dark:bg-[#222944]/40 group-hover:w-20 transition-all duration-500 delay-150 group-hover:delay-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                                    <div className="relative z-10 w-full">
                                        <h3 className="text-[20px] lg:text-[24px] leading-[1.05] font-normal tracking-tight uppercase group-hover:text-white dark:group-hover:text-[#222944] transition-colors duration-300 delay-150 group-hover:delay-150">
                                            {card.title}
                                        </h3>
                                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 delay-150 group-hover:delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                            <div className="overflow-hidden">
                                                <div className="pt-6">
                                                    <p className="text-[16.5px] font-light leading-[1.6] text-white/80 dark:text-[#222944]/80">
                                                        {card.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECOND RISING PANEL (Overlaps Panel 1) */}
                <motion.div
                    id="secondary-panel"
                    style={{ y: secondPanelY }}
                    className="fixed top-0 left-0 h-screen w-full bg-white dark:bg-[#1B2136] overflow-hidden flex flex-col pt-28 pointer-events-auto z-30 shadow-none border-none"
                >
                    <div className="max-w-[1800px] mx-auto w-full px-5 md:px-10 shrink-0">
                        <div className="grid grid-cols-12 gap-8 md:gap-10 items-center mb-10">
                            <motion.div style={{ x: secondTitleX }} className="col-span-6">
                                <div className="text-[42px] leading-[1.05] font-light tracking-tighter text-[#222944] dark:text-[#BCC5DC]">
                                    Protocolos Growth Engine
                                </div>
                            </motion.div>
                            <motion.div style={{ x: secondBtnX, opacity: secondBtnOpacity }} className="col-span-6 flex justify-end">
                                <Link to="/waitlist" className="inline-flex items-center text-[11px] font-bold tracking-widest uppercase text-[#222944] dark:text-[#BCC5DC] hover:bg-[#222944] hover:text-white dark:hover:bg-[#BCC5DC] dark:hover:text-[#222944] hover:border-transparent transition-all duration-300 border border-[#222944] dark:border-[#BCC5DC] px-9 py-4 bg-white dark:bg-[#1B2136]">
                                    CONECTAR <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    <div className="flex-1 w-full bg-white dark:bg-[#1B2136] overflow-hidden">
                        <div className="grid grid-cols-3 gap-[2px] h-full w-full bg-white dark:bg-[#1B2136]">
                            {/* LEFT STACK */}
                            <div className="grid grid-rows-2 gap-[2px] h-full">
                                {[
                                    { id: 'PROT.01', title: 'Auditoría', desc: 'Diagnóstico profundo de infraestructura y arquitectura de datos para identificar puntos de fricción.' },
                                    { id: 'PROT.02', title: 'Integración', desc: 'Conexión nativa de Unify con el ecosistema de eCommerce y sistemas de captación.' }
                                ].map((card, i) => (
                                    <motion.div 
                                        key={i} 
                                        style={{ y: [scard1Y, scard2Y][i] }}
                                        className="relative h-full flex flex-col justify-end p-10 bg-[#F8F9FA] dark:bg-[#303A5F] group overflow-hidden cursor-default transition-all duration-300 delay-150 group-hover:delay-150"
                                    >
                                        <div className="absolute inset-0 bg-[#222944] dark:bg-[#F8F9FA] translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-150 group-hover:delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                                        <div className="relative z-10 w-full">
                                            <span className="text-[9px] font-bold tracking-widest text-[#222944]/30 dark:text-[#BCC5DC]/30 mb-2 block uppercase">{card.id}</span>
                                            <h3 className="text-[22px] leading-[1.1] font-normal tracking-tight uppercase group-hover:text-white dark:group-hover:text-[#222944] transition-colors duration-300 delay-150 group-hover:delay-150">
                                                {card.title}
                                            </h3>
                                            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 delay-150 group-hover:delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                                <div className="overflow-hidden">
                                                    <p className="pt-4 text-[14px] font-light leading-[1.5] text-white/80 dark:text-[#222944]/80">
                                                        {card.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CENTER LARGE CARD */}
                            <motion.div 
                                style={{ y: scard3Y }}
                                className="relative h-full flex flex-col justify-end p-10 bg-[#F8F9FA] dark:bg-[#303A5F] group overflow-hidden cursor-default transition-all duration-300 delay-150 group-hover:delay-150"
                            >
                                <div className="absolute inset-0 bg-[#222944] dark:bg-[#F8F9FA] translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-150 group-hover:delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                                <div className="relative z-10 w-full mb-10">
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#222944]/30 dark:text-[#BCC5DC]/30 mb-4 block uppercase leading-none">PROTOCOL CORE — 03</span>
                                    <h3 className="text-[32px] lg:text-[45px] leading-[1] font-light tracking-tighter uppercase group-hover:text-white dark:group-hover:text-[#222944] transition-colors duration-300 delay-150 group-hover:delay-150">
                                        Escalamiento <br /> Progresivo
                                    </h3>
                                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 delay-150 group-hover:delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                        <div className="overflow-hidden">
                                            <p className="pt-8 text-[18px] font-light leading-[1.7] text-white/70 dark:text-[#222944]/70 max-w-[400px]">
                                                Metodología propietaria diseñada para expandir el alcance comercial sin comprometer los márgenes de rentabilidad operativa.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* RIGHT STACK */}
                            <div className="grid grid-rows-2 gap-[2px] h-full">
                                {[
                                    { id: 'PROT.04', title: 'Predicción', desc: 'Algoritmos avanzados para anticipar tendencias de compra y estacionalidad del mercado.' },
                                    { id: 'PROT.05', title: 'Optimización', desc: 'Ajuste dinámico de presupuestos y audiencias bajo el enfoque High-Performance.' }
                                ].map((card, i) => (
                                    <motion.div 
                                        key={i} 
                                        style={{ y: [scard4Y, scard5Y][i] }}
                                        className="relative h-full flex flex-col justify-end p-10 bg-[#F8F9FA] dark:bg-[#303A5F] group overflow-hidden cursor-default transition-all duration-300 delay-150 group-hover:delay-150"
                                    >
                                        <div className="absolute inset-0 bg-[#222944] dark:bg-[#F8F9FA] translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-150 group-hover:delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                                        <div className="relative z-10 w-full">
                                            <span className="text-[9px] font-bold tracking-widest text-[#222944]/30 dark:text-[#BCC5DC]/30 mb-2 block uppercase">{card.id}</span>
                                            <h3 className="text-[22px] leading-[1.1] font-normal tracking-tight uppercase group-hover:text-white dark:group-hover:text-[#222944] transition-colors duration-300 delay-150 group-hover:delay-150">
                                                {card.title}
                                            </h3>
                                            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 delay-150 group-hover:delay-150 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                                <div className="overflow-hidden">
                                                    <p className="pt-4 text-[14px] font-light leading-[1.5] text-white/80 dark:text-[#222944]/80">
                                                        {card.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default GrowthEngineDesktop;
