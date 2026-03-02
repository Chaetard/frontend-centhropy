import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ConnectorsSection from './components/ConnectorsSection';
import OrganizationsCarousel from './components/OrganizationsCarousel';

// 1. ISOLATED CANVAS COMPONENT
const SphereCanvasMobile = React.memo(({ probeDataRef, hudRef }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const w = window.innerWidth;
        const h = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        const clock = new THREE.Clock();

        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);

        const organismGroup = new THREE.Group();
        scene.add(organismGroup);

        const ringCount = 80;
        const segments = 90;
        const rings = [];
        const sphereRadius = 11.5;

        for (let i = 0; i < ringCount; i++) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array((segments + 1) * 3);
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const t = i / ringCount;
            const poleFactor = Math.sin(t * Math.PI);
            const material = new THREE.LineBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: poleFactor * 0.35
            });
            const line = new THREE.Line(geometry, material);
            const latitude = t * Math.PI - Math.PI / 2;
            rings.push({ mesh: line, lat: latitude, id: i, baseRadius: sphereRadius * Math.cos(latitude) });
            organismGroup.add(line);
        }

        const targetAnchor = new THREE.Vector3(5.5, 4.5, 5.5);
        camera.position.set(0, -5.0, 48);

        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            for (let i = 0; i < ringCount; i++) {
                const ring = rings[i];
                const rBase = ring.baseRadius;
                if (rBase < 0.1) continue;
                const positions = ring.mesh.geometry.attributes.position.array;
                const lat = ring.lat;
                const id = ring.id;
                for (let j = 0; j <= segments; j++) {
                    const lon = (j / segments) * Math.PI * 2;
                    const wave = Math.sin(lon * 4 + time + id * 0.1) * 0.35 + Math.cos(lat * 7 - time * 0.4) * 0.2;
                    const r = rBase + wave;
                    const idx = j * 3;
                    positions[idx] = Math.cos(lon) * r;
                    positions[idx + 1] = Math.sin(lat) * sphereRadius + wave * 0.25;
                    positions[idx + 2] = Math.sin(lon) * r;
                }
                ring.mesh.geometry.attributes.position.needsUpdate = true;
            }

            organismGroup.rotation.y = time * 0.08;
            organismGroup.rotation.x = Math.sin(time * 0.1) * 0.05;
            organismGroup.updateMatrixWorld();

            if (hudRef.current) {
                const phi = Math.PI * 0.5 + Math.sin(time * 0.03) * 0.8
                    + Math.sin(time * 0.012) * 0.3;
                const theta = Math.PI * 0.42 + Math.sin(time * 0.05) * 0.6
                    + Math.sin(time * 0.018) * 0.2;
                const r = sphereRadius * 0.75;

                probeDataRef.current = { phi, theta };

                targetAnchor.set(
                    r * Math.sin(theta) * Math.cos(phi),
                    r * Math.cos(theta),
                    r * Math.sin(theta) * Math.sin(phi)
                );

                const vector = targetAnchor.clone();
                vector.applyMatrix4(organismGroup.matrixWorld);
                vector.project(camera);

                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (vector.y * -0.5 + 0.5) * window.innerHeight;

                hudRef.current.style.transform = `translate(${x}px, ${y}px)`;
                hudRef.current.style.opacity = (vector.z < 1) ? '1' : '0';
            }

            renderer.render(scene, camera);
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(frameId);
            renderer.dispose();
            rings.forEach(ring => {
                ring.mesh.geometry.dispose();
                ring.mesh.material.dispose();
            });
        };
    }, []);

    return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />;
});

// 2. MAIN COMPONENT
const CenthropyMobile = () => {
    const hudRef = useRef(null);
    const probeDataRef = useRef({ phi: Math.PI * 0.5, theta: Math.PI * 0.5 });
    const solutionsScrollRef = useRef(null);
    const [scrollIndex, setScrollIndex] = useState(0);

    const scrollSolutions = (direction) => {
        if (solutionsScrollRef.current) {
            const container = solutionsScrollRef.current;
            const width = container.offsetWidth;
            const totalItems = solutions.length;

            // Calculate current index based on scroll position
            const currentIndex = Math.round(container.scrollLeft / width);

            let nextIndex;
            if (direction === 'left') {
                nextIndex = currentIndex - 1;
                if (nextIndex < 0) nextIndex = totalItems - 1;
            } else {
                nextIndex = currentIndex + 1;
                if (nextIndex >= totalItems) nextIndex = 0;
            }

            container.scrollTo({
                left: nextIndex * width,
                behavior: 'smooth'
            });
        }
    };

    const handleCarouselScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const width = e.target.offsetWidth;
        if (width > 0) {
            const newIndex = Math.round(scrollLeft / width);
            if (newIndex !== scrollIndex) {
                setScrollIndex(newIndex);
            }
        }
    };

    const [openModule, setOpenModule] = useState(0);
    const [probeMetrics, setProbeMetrics] = useState({
        lat: '0.00° N', lon: '0.00° E',
        roi: '28.6%', margin: '41.0%',
        progress: '50%', timer: '00:00:00'
    });

    // Metrics dynamic logic
    useEffect(() => {
        const interval = setInterval(() => {
            const { phi, theta } = probeDataRef.current;
            const time = performance.now() * 0.001;
            const now = new Date();
            const latDeg = Math.cos(theta) * 90;
            const lonDeg = ((phi % (2 * Math.PI)) / (2 * Math.PI)) * 360 - 180;

            setProbeMetrics(prev => ({
                ...prev,
                lat: `${Math.abs(latDeg).toFixed(2)}° ${latDeg >= 0 ? 'N' : 'S'}`,
                lon: `${Math.abs(lonDeg).toFixed(2)}° ${lonDeg >= 0 ? 'E' : 'W'}`,
                progress: (40 + Math.sin(time * 1.5) * 30).toFixed(0) + "%",
                timer: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
            }));
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Strategy Cycling Logic
    const objectives = ["RENTABILITY INSIGHT", "GROWTH TACTIC", "OPTIMIZATION STRATEGIC"];
    const tags = ["X-7", "X-8", "X-9"];
    const [objIdx, setObjIdx] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        let timeout;
        const fullText = objectives[objIdx];

        const type = (i) => {
            if (i <= fullText.length) {
                setDisplayText(fullText.substring(0, i));
                setIsTyping(true);
                timeout = setTimeout(() => type(i + 1), 65);
            } else {
                setIsTyping(false);
                timeout = setTimeout(() => erase(fullText.length), 3000);
            }
        };

        const erase = (i) => {
            if (i >= 0) {
                setDisplayText(fullText.substring(0, i));
                setIsTyping(true);
                timeout = setTimeout(() => erase(i - 1), 35);
            } else {
                setIsTyping(false);
                setObjIdx(prev => (prev + 1) % objectives.length);
            }
        };

        type(0);
        return () => clearTimeout(timeout);
    }, [objIdx]);

    // Scroll Inertia Logic
    const [introInertia, setIntroInertia] = useState(0);
    const scrollPos = useRef(0);
    const inertiaRef = useRef(0);
    const frameIdRef = useRef(null);

    useEffect(() => {
        scrollPos.current = window.pageYOffset;

        const handleScroll = () => {
            const currentPos = window.pageYOffset;
            const diff = currentPos - scrollPos.current;
            // Aplicamos un límite a la inercia a 8 para evitar que las líneas toquen la flecha en mobile
            inertiaRef.current = Math.max(-8, Math.min(8, diff * 0.25));
            scrollPos.current = currentPos;
        };

        const updateInertia = () => {
            inertiaRef.current *= 0.96;
            if (Math.abs(inertiaRef.current) < 0.01) inertiaRef.current = 0;
            setIntroInertia(prev => prev + (inertiaRef.current - prev) * 0.025);
            frameIdRef.current = requestAnimationFrame(updateInertia);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        frameIdRef.current = requestAnimationFrame(updateInertia);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
        };
    }, []);

    const modules = [
        { w: 'Control', desc: 'Elevar el control organizacional, centralizando y unificando: Datos, Análisis y Decisiones.' },
        { w: 'Optimización', desc: 'Impulsar la optimización de procesos, recursos y estrategias de negocio de alto impacto, en tiempo real.' },
        { w: 'Escalabilidad', desc: 'Detectar continuamente, oportunidades de expansión, apertura de mercados, líneas de negocio y diversificación de recursos.' },
        { w: 'Crecimiento', desc: 'Generar en las organizaciones el potencial de multiplicar resultados, impulsar ventas y aumentar ganancias.' },
        { w: 'Rentabilidad', desc: 'Potenciar la capacidad empresarial de cumplir y superar sus propios objetivos de rentabilización y sostenibilidad financiera.' }
    ];

    const systemModules = [
        { id: 'SYS.01', t1: 'Unify', t2: 'Protocol', short: 'UP', img: '/Unifyprotocol.jpg', desc: 'Protocolo de ontología de datos, diseñado para descifrar, con grado de precisión militar, el comportamiento real y potencial de las organizaciones, permitiendo garantizar resultados de alto impacto.' },
        { id: 'SYS.02', t1: 'Unify Data', t2: 'Center', short: 'DC', img: '/Unifydc.jpg', desc: 'Interfaz de unificación y análisis avanzado de datos, desarrollada para potenciar la toma de decisiones (Impulsada Unify Agent).' },
        { id: 'SYS.03', t1: 'Unify', t2: 'Agent', short: 'UA', img: '/Unifyagent3.0.jpg', desc: 'Analista inteligente de última generación, creado para potenciar decisiones de crecimiento, generando estrategias accionables de alto impacto y en tiempo real.' },
        { id: 'SYS.04', t1: 'Unify', t2: 'Team', short: 'UT', img: '/Unifyteam.jpg', desc: 'Equipo humano de élite, especializado y enfocado en garantizar la confiabilidad, la eficacia y sostenibilidad del ecosistema Unify.' }
    ];

    // Solutions Accordion State
    const [activeSolution, setActiveSolution] = useState(0);
    const solutions = [
        { id: '03', title: 'Retail Intelligence', img: '/Unifyagent3.0.jpg', desc: 'Gestión 360: Desarrollo y mantenimiento de eCommerce, dirección estratégica y operativa, investigación de mercados e integración total del ecosistema Unify; una solución enfocada en maximizar la conversión, impulsar el crecimiento y elevar la rentabilidad.' },
        { id: '01', title: 'Unify Data Center', img: '/Unifydc.jpg', desc: 'Interfaz inteligente, desarrollada para unificar datos, análisis y decisiones, enfocada en la optimización y el crecimiento empresarial. UDC es potenciada por la integración nativa de Unify Agent (Agente Inteligente de Análisis de Negocio Avanzado).' },
        { id: '02', title: 'TI Outsourcing', img: '/Unifyprotocol.jpg', desc: 'Gestión integral de infraestructura de datos. Desde la ingesta, limpieza y transformación, hasta la digitalización, almacenamiento, mantenimiento y seguridad de los datos.' }
    ];

    // State for sticky reveal of system nodes
    const [openedNodes, setOpenedNodes] = useState(new Array(systemModules.length).fill(false));

    const moduleRefs = useRef(systemModules.map(() => React.createRef()));

    // Removed old reveal logic for sectionRef and activeIndex
    // const sectionRef = useRef(null);
    // const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const observerOptions = {
            // Umbral más exigente para asegurar que la tarjeta esté bien encuadrada
            threshold: 0.4,
            // Matamos el 55% inferior del viewport: la tarjeta debe subir hasta
            // la zona media-superior para activarse y que el usuario vea el despliegue.
            rootMargin: '0px 0px -55% 0px'
        };

        const observers = moduleRefs.current.map((ref, idx) => {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setOpenedNodes(prev => {
                        const next = [...prev];
                        next[idx] = true;
                        return next;
                    });
                }
            }, observerOptions);

            const current = ref.current;
            if (current) observer.observe(current);
            return observer;
        });

        return () => {
            observers.forEach(obs => obs.disconnect());
        };
    }, []);

    return (
        <div className="font-funnel no-select w-full bg-white text-black min-h-screen relative overflow-x-hidden">
            {/* CANVAS LAYER */}
            <SphereCanvasMobile probeDataRef={probeDataRef} hudRef={hudRef} />

            {/* HEADER */}
            <Navbar subtitle="Unified Data Engine" />

            {/* FLOATING PROBE HUD (MOBILE) */}
            <div
                ref={hudRef}
                className="fixed top-0 left-0 transform-gpu"
                style={{
                    zIndex: 15,
                    pointerEvents: 'none',
                    opacity: 0,
                    width: 44,
                    height: 44,
                    marginLeft: -22,
                    marginTop: -22,
                }}
            >
                <div className="animate-ping" style={{
                    position: 'absolute', inset: 0,
                    borderRadius: '50%',
                    border: '1px solid rgba(0,0,0,0.2)',
                }} />
                <div style={{
                    position: 'absolute', inset: 10,
                    borderRadius: '50%',
                    border: '1px solid rgba(0,0,0,0.12)',
                }} />
                <div style={{
                    position: 'absolute',
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: '#111',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                }} />
            </div>

            {/* HERO SPACER */}
            <section className="h-screen w-full pointer-events-none relative" />

            {/* HUD / INSIGHTS PANEL */}
            <div className="fixed bottom-6 left-6 right-6 z-10 pointer-events-auto">
                <div className="w-full border-t border-black/15 pt-5 flex flex-col gap-3">
                    <div className="flex justify-between items-end w-full">
                        <div className="flex flex-col">
                            <span className="text-xl font-black uppercase tracking-tighter leading-none min-h-[1.2em]">
                                {displayText}
                                <span className={`${isTyping ? 'opacity-100' : 'opacity-0'} animate-pulse ml-0.5`}>|</span>
                            </span>
                        </div>
                        <div className="hud-tag-parent-mobile">
                            <div className={`hud-tag-cube-mobile rotate-face-${objIdx}`}>
                                <div className="hud-tag-face-mobile hud-tag-f1">{tags[0]}</div>
                                <div className="hud-tag-face-mobile hud-tag-f2">{tags[1]}</div>
                                <div className="hud-tag-face-mobile hud-tag-f3">{tags[2]}</div>
                                <div className="hud-tag-face-mobile hud-tag-f4">{tags[0]}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col font-funnel text-xs text-black">
                        <div className="flex justify-between border-b border-black/10 py-2">
                            <span className="text-black/40 uppercase tracking-widest font-bold text-[10px]">Lat. Core</span>
                            <span className="font-bold tabular-nums text-[12px]">{probeMetrics.lat}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-black/40 uppercase tracking-widest font-bold text-[10px]">Lon. Core</span>
                            <span className="font-bold tabular-nums text-[12px]">{probeMetrics.lon}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-0">
                        <div className="w-full h-[1.5px] bg-black/10 relative overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 bg-black transition-all duration-300"
                                style={{ width: probeMetrics.progress }}
                            />
                        </div>
                        <div className="flex justify-between text-[9px] font-funnel uppercase font-bold text-black/30">
                            <span className="tabular-nums tracking-widest">{probeMetrics.timer}</span>
                            <span className="tracking-widest text-[8px]">Active Stream</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="relative z-20 bg-white pt-16 pb-24 px-6 flex flex-col gap-8">
                <div className="flex flex-col gap-6 text-center items-center w-full">

                    <h2
                        className="text-[8vw] min-[380px]:text-[28px] font-medium tracking-tight leading-[1.2] text-black text-center w-full mx-auto"
                        style={{
                            textWrap: 'balance',
                            textAlign: 'center',
                            transform: `translateY(${-introInertia * 1.5}px)`
                        }}
                    >
                        Ecosistema creado para potenciar, en tiempo real, la toma de decisiones en organizaciones de alto valor.
                    </h2>
                </div>

                <div className="flex justify-center mt-8">
                    <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                        <path d="M10 5L30 25L50 5" stroke="black" strokeWidth="1.5" strokeOpacity="0.1" strokeLinecap="square" strokeLinejoin="miter" />
                        <path d="M10 5L30 25L50 5" stroke="black" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className="energy-path" />
                    </svg>
                </div>

                <div className="flex flex-col gap-4 mt-12">
                    {modules.map((m, i) => (
                        <div
                            key={i}
                            onClick={() => setOpenModule(openModule === i ? null : i)}
                            className="bg-[#f5f5f5] border border-black/[0.03] p-6 transition-all duration-500 ease-out"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-black uppercase tracking-tight text-black">{m.w}</span>
                                <ChevronRight
                                    className={`transition-transform duration-500 ${openModule === i ? 'rotate-90 text-black' : 'rotate-0 text-black/20'}`}
                                    size={20}
                                />
                            </div>
                            <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${openModule === i ? 'grid-rows-[1fr] mt-5' : 'grid-rows-[0fr]'}`}>
                                <p className="overflow-hidden text-[16px] font-light leading-relaxed text-black/60 tracking-tight">
                                    {m.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SECCIÓN ECOSISTEMA UNIFY */}
                <div className="flex flex-col gap-6 border-t border-white/20 pt-24 -mx-6 px-6 bg-white">
                    <div className="flex flex-col mb-6">
                        <div className="w-full h-[1px] bg-black/15 mb-10" />
                        <h2 className="text-[45px] font-medium tracking-tighter text-black leading-none">Ecosistema Unify</h2>
                    </div>
                    <div className="flex flex-col gap-12">
                        {systemModules.map((comp, idx) => {
                            const isOpened = openedNodes[idx];
                            return (
                                <div
                                    key={idx}
                                    ref={moduleRefs.current[idx]}
                                    className="relative w-full bg-[#f5f5f5] border border-black/[0.05] p-8 flex flex-col overflow-hidden"
                                >
                                    {/* ID y Marcador */}
                                    <div className={`flex justify-between items-center border-b border-black/10 pb-4 mb-8 transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-30'}`}>
                                        <span className="text-[10px] font-bold text-black/40 tracking-[0.3em]">{comp.id}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/30">{comp.short}</span>
                                    </div>

                                    {/* Imagen Superior */}
                                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-white/50">
                                        <img
                                            src={comp.img}
                                            alt={comp.t1}
                                            className={`w-full h-full object-cover grayscale transition-all duration-1000 ${isOpened ? 'brightness-100 scale-100' : 'brightness-50 scale-110'}`}
                                        />
                                    </div>

                                    {/* Contenido que emerge */}
                                    <div
                                        className={`grid transition-[grid-template-rows,opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpened ? 'grid-rows-[1fr] opacity-100 translate-y-0' : 'grid-rows-[0fr] opacity-0 translate-y-[-20px]'}`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="pt-10 flex flex-col gap-8">
                                                <h4 className="text-[42px] font-black tracking-tighter uppercase leading-[0.85] text-black">
                                                    {comp.t1} <br />
                                                    {comp.t2}
                                                </h4>

                                                <p className="text-[17px] font-light leading-relaxed text-black/70">
                                                    {comp.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Etiquetas Inferiores */}
                                    <div className="flex flex-col mt-8">
                                        <div className="w-full border-t border-black/10 pt-4 flex justify-between items-center transition-opacity duration-1000">
                                            <div className={`flex flex-col transition-all duration-1000 ${isOpened ? 'opacity-100' : 'opacity-30'}`}>
                                                <span className="text-[9px] font-bold text-black/40 tracking-[0.3em] uppercase">Status // Encrypted</span>
                                            </div>
                                            <div className={`flex flex-col transition-all duration-1000 ${isOpened ? 'opacity-100' : 'opacity-30'}`}>
                                                <span className="text-[9px] font-bold text-black/30 tracking-[0.2em] uppercase">Verified System</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* SECCIÓN SOLUCIONES */}
                <div className="flex flex-col gap-6 border-t border-white/20 pt-32 pb-12 -mx-6 px-6 bg-white">
                    <div className="flex flex-col gap-6">
                        <div className="w-full h-[1px] bg-black/15 mb-6" />
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-[45px] font-medium tracking-tighter text-black leading-none m-0">Soluciones</h2>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => scrollSolutions('left')}
                                    className="w-[43px] h-[43px] border border-black flex items-center justify-center active:bg-black transition-all duration-300 group/btn"
                                    aria-label="Anterior"
                                >
                                    <ChevronLeft size={22} className="text-black group-active/btn:text-white" />
                                </button>
                                <button
                                    onClick={() => scrollSolutions('right')}
                                    className="w-[43px] h-[43px] border border-black flex items-center justify-center active:bg-black transition-all duration-300 group/btn"
                                    aria-label="Siguiente"
                                >
                                    <ChevronRight size={22} className="text-black group-active/btn:text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div
                            ref={solutionsScrollRef}
                            onScroll={handleCarouselScroll}
                            className="flex overflow-x-auto snap-x snap-mandatory gap-0 no-scrollbar -mx-6 pb-6"
                        >
                            {solutions.map((s, idx) => (
                                <div key={idx} className="w-screen flex-shrink-0 snap-center px-6">
                                    <div className="bg-black border border-white/5 p-8 flex flex-col gap-8 min-h-[500px] h-full">
                                        <h3 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">
                                            {s.title}
                                        </h3>

                                        <div className="w-full aspect-video overflow-hidden bg-white/10 shrink-0">
                                            <img
                                                src={s.img}
                                                alt={s.title}
                                                className="w-full h-full object-cover grayscale brightness-90 active:grayscale-0 transition-all duration-700"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-6 flex-grow justify-between">
                                            <p className="text-[12px] font-light leading-relaxed text-white/70">
                                                {s.desc}
                                            </p>

                                            <div className="mt-4 flex justify-end">
                                                <Link
                                                    to="/waitlist"
                                                    className="inline-flex items-center gap-2 group p-2 -mr-2 active:opacity-50 transition-opacity"
                                                >
                                                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white">Conectar</span>
                                                    <ChevronRight size={18} className="text-white group-active:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Dots de Navegación (Activos) */}
                        <div className="flex justify-center gap-2.5 mt-4 pb-12">
                            {solutions.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${scrollIndex === i ? 'bg-black scale-125' : 'bg-black/10'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white px-6 -mx-6">
                    <ConnectorsSection />
                </div>

                <div className="bg-white -mx-6">
                    <OrganizationsCarousel />
                </div>

                <div className="bg-white text-black py-8 flex flex-row justify-between items-center border-t border-black/10 -mx-6 px-6">
                    <h4 className="text-[12vw] min-[400px]:text-[45px] font-medium tracking-tighter text-black leading-none m-0">
                        CONECTAR
                    </h4>
                    <Link
                        to="/waitlist"
                        className="w-14 h-14 border-2 border-black rounded-none flex items-center justify-center group active:bg-black active:text-white transition-all duration-300 shrink-0"
                    >
                        <ChevronRight size={28} />
                    </Link>
                </div>
            </main >
        </div >
    );
};

export default CenthropyMobile;
