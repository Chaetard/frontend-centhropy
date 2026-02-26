import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';

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
    const [openModule, setOpenModule] = useState(null);
    const [probeMetrics, setProbeMetrics] = useState({
        lat: '0.00° N', lon: '0.00° E',
        roi: '28.6%', margin: '41.0%',
        progress: '50%', timer: '00:00:00'
    });

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
            inertiaRef.current = diff * 0.25;
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
        { w: 'Control', desc: 'Gestión enfocada en elevar el control general de las organizaciones, mediante la centralización de flujos de datos, análisis avanzados y toma de decisiones.' },
        { w: 'Optimización', desc: 'Refinamiento continuo de esfuerzos, recursos y estrategias de negocio, por medio de la generación constante de insights accionables de alto impacto.' },
        { w: 'Escalabilidad', desc: 'Aumento en la capacidad organizacional de multiplicar resultados exponencialmente, aplicando tácticas de negocio avanzadas en tiempo real.' },
        { w: 'Crecimiento', desc: 'Estrategias de expansión impulsadas por inteligencia de datos, que detectan oportunidades de mercado, optimizan el rendimiento e incrementan las ventas.' },
        { w: 'Rentabilidad', desc: 'El enfoque "Data-Driven-Growth" aumenta la capacidad en las organizaciones de alcanzar y superar sus propios objetivos de rentabilización.' }
    ];

    const systemModules = [
        { id: 'SYS.01', t1: 'Unify', t2: 'Protocol', short: 'UP', img: '/Unifyprotocol.jpg', desc: 'Protocolo de ontología diseñado para descifrar el pulso de vida de las organizaciones con un grado de precisión militar.' },
        { id: 'SYS.02', t1: 'Unify Data', t2: 'Center', short: 'DC', img: '/Unifydc.jpg', desc: 'Centro de unificación y análisis avanzado de datos, desarrollado para impulsar decisiones de negocio enfocadas en el crecimiento y el control de las organizaciones. UDC cuenta con una interfaz simplificada e intuitiva, potenciada por nuestro Unify Agent (Analista de Datos en Lenguaje Natural de Última Generación).' },
        { id: 'SYS.03', t1: 'Unify', t2: 'Agent', short: 'UA', img: '/Unifyagent3.0.jpg', desc: 'Agente de inteligencia avanzada de datos, es un copiloto ideal para la toma de decisiones ágiles centradas en el crecimiento, la optimización y el control.' },
        { id: 'SYS.04', t1: 'Unify', t2: 'Team', short: 'UT', img: '/Unifyteam.jpg', desc: 'Equipo de élite especializado en Data-Driven-Growth y enfocado en garantizar la confiabilidad de todo el ecosistema Unify.' }
    ];

    // Solutions Accordion State
    const [activeSolution, setActiveSolution] = useState(0);
    const solutions = [
        { id: '01', title: 'Unify Data Center', img: '/Unifydc.jpg', desc: 'Centro de unificación y análisis avanzado de datos, desarrollado para impulsar decisiones de negocio enfocadas en el crecimiento y el control de las organizaciones. UDC cuenta con una interfaz simplificada e intuitiva, potenciada por nuestro Unify Agent (Analista de Datos en Lenguaje Natural de Última Generación).' },
        { id: '02', title: 'TI Outsourcing', img: '/Unifyprotocol.jpg', desc: 'Gestión integral de infraestructura de datos, desde la ingesta, limpieza y transformación, hasta la digitalización, almacenamiento, sistemas de búsqueda semántica y RAG.' },
        { id: '03', title: 'Retail Intelligence', img: '/Unifyagent3.0.jpg', desc: 'Gestión 360° eCommerce: desarrollo, operación estratégica, investigaciones de mercados y toma de decisiones accionables enfocadas en maximizar la conversión, el crecimiento y la rentabilidad.' }
    ];

    // Reveal Logic State
    const [reveals, setReveals] = useState([0, 0, 0, 0]);
    const moduleRefs = useRef(systemModules.map(() => React.createRef()));

    useEffect(() => {
        const handleScroll = () => {
            const h = window.innerHeight;
            const focusLine = h * 0.45;
            const newReveals = moduleRefs.current.map(ref => {
                if (!ref.current) return 0;
                const rect = ref.current.getBoundingClientRect();
                const center = rect.top + rect.height / 2;
                const distFromFocus = Math.abs(center - focusLine);
                const range = h * 0.35;
                let factor = 1 - (distFromFocus / range);
                return Math.max(0, Math.min(1, factor));
            });
            setReveals(newReveals);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Live probe metrics
    useEffect(() => {
        const interval = setInterval(() => {
            const { phi, theta } = probeDataRef.current;
            const t = performance.now() * 0.001;
            const now = new Date();
            const latDeg = Math.cos(theta) * 90;
            const lonDeg = ((phi % (2 * Math.PI)) / (2 * Math.PI)) * 360 - 180;
            setProbeMetrics({
                lat: `${Math.abs(latDeg).toFixed(2)}° ${latDeg >= 0 ? 'N' : 'S'}`,
                lon: `${Math.abs(lonDeg).toFixed(2)}° ${lonDeg >= 0 ? 'E' : 'W'}`,
                roi: (28.6 + Math.cos(t * 0.5) * 5.1).toFixed(1) + '%',
                progress: (50 + Math.sin(t * 0.6) * 35).toFixed(0) + '%',
                timer: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
            });
        }, 80);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-funnel no-select w-full bg-white text-black min-h-screen relative flex flex-col">
            {/* BACKGROUND CANVAS */}
            <SphereCanvasMobile probeDataRef={probeDataRef} hudRef={hudRef} />

            <Navbar subtitle="Mobile Data Sync" />

            {/* FLOATING PROBE */}
            <div
                ref={hudRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
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
                <div className="w-full border-t border-black/15 pt-5 flex flex-col gap-5">
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

                    <div className="w-full flex flex-col gap-2">
                        <div className="flex flex-col font-funnel text-xs text-black">
                            <div className="flex justify-between border-b border-black/10 py-2">
                                <span className="text-black/40 uppercase tracking-widest font-bold text-[10px]">Lat. Core</span>
                                <span className="font-bold tabular-nums text-[12px]">{probeMetrics.lat}</span>
                            </div>
                            <div className="flex justify-between border-b border-black/10 py-2">
                                <span className="text-black/40 uppercase tracking-widest font-bold text-[10px]">Lon. Core</span>
                                <span className="font-bold tabular-nums text-[12px]">{probeMetrics.lon}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-black/40 uppercase tracking-widest font-bold text-[10px]">ROI Logic</span>
                                <span className="font-bold tabular-nums text-[12px]">{probeMetrics.roi}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 pt-3">
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
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="relative z-20 bg-white pt-16 pb-24 px-6 flex flex-col gap-16">
                <div className="flex flex-col gap-5 text-center items-center w-full mb-12">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">Centhropy // Unify Ecosystem</span>
                    <h2 className="text-[32px] font-medium tracking-tight leading-[1.0] text-black flex flex-col gap-0 w-full">
                        {[
                            "Ecosistema que optimiza",
                            "decisiones en tiempo real en",
                            "organizaciones de alto valor,",
                            "potenciadas con inteligencia",
                            "de datos avanzada."
                        ].map((line, i) => (
                            <span
                                key={i}
                                className="block aria-hidden:true will-change-transform"
                                style={{
                                    transform: `translateY(${-introInertia * (2.5 + i * 1.2)}px)`
                                }}
                            >
                                {line}
                            </span>
                        ))}
                    </h2>
                </div>

                <div className="flex justify-center -mt-8 mb-8">
                    <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                        <path d="M10 5L30 25L50 5" stroke="black" strokeWidth="1.5" strokeOpacity="0.1" strokeLinecap="square" strokeLinejoin="miter" />
                        <path d="M10 5L30 25L50 5" stroke="black" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className="energy-path" />
                    </svg>
                </div>

                <div className="flex flex-col gap-4">
                    {modules.map((m, i) => (
                        <div
                            key={i}
                            onClick={() => setOpenModule(openModule === i ? null : i)}
                            className={`border border-black/5 p-6 transition-all duration-500 ease-out ${openModule === i ? 'bg-black text-white' : 'bg-white text-black'}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-black uppercase tracking-tight">{m.w}</span>
                                <ChevronRight
                                    className={`transition-transform duration-500 ${openModule === i ? 'rotate-90' : 'rotate-0 text-black/20'}`}
                                    size={20}
                                />
                            </div>
                            <div className={`grid transition-all duration-500 ${openModule === i ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <p className="overflow-hidden text-sm font-light leading-relaxed opacity-70">{m.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col border-t border-black/10 pt-16 -mx-6 px-6 bg-white">
                    <div className="flex flex-col mb-12 px-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">Core Ecosystem // Nodes</span>
                    </div>
                    <div className="flex flex-col gap-12">
                        {systemModules.map((comp, idx) => {
                            const isOpen = reveals[idx] > 0.4;
                            return (
                                <div
                                    key={idx}
                                    ref={moduleRefs.current[idx]}
                                    className="relative w-full aspect-[3/2] overflow-hidden bg-white border border-black/5"
                                >
                                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 gap-6 bg-white">
                                        <div className="flex justify-between items-start border-b border-black/5 pb-4">
                                            <span className="text-[12px] font-bold text-black font-funnel">{comp.id}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">{comp.short}</span>
                                        </div>
                                        <h4 className="text-[40px] font-black tracking-tighter uppercase leading-[0.85] text-black">
                                            {comp.t1} <br />
                                            <span className="text-black">{comp.t2}</span>
                                        </h4>
                                        <p className="text-sm font-light leading-relaxed text-black/70">{comp.desc}</p>
                                    </div>
                                    <div
                                        className="absolute inset-0 z-20 transition-transform duration-700 ease-in-out will-change-transform"
                                        style={{ transform: `translateY(${isOpen ? '-100%' : '0%'})` }}
                                    >
                                        <img src={comp.img} alt={comp.t1} className="w-full h-full object-cover grayscale brightness-50" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-10 border-t border-black/10 pt-16 -mx-6 px-6 bg-white">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-black">Soluciones</h2>
                        <p className="text-lg font-medium text-black/60 leading-tight">
                            Impulsamos el control, la optimización y la expansión de organizaciones en sectores de eCommerce y Retail.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        {solutions.map((s, idx) => {
                            const isActive = activeSolution === idx;
                            return (
                                <div
                                    key={idx}
                                    onClick={() => setActiveSolution(idx)}
                                    className={`flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden border ${isActive ? 'bg-black text-white border-black p-6' : 'bg-white text-black border-white py-6 px-0'}`}
                                >
                                    <div className={`grid transition-all duration-700 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100 mb-8' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden">
                                            <div className="w-full aspect-video overflow-hidden">
                                                <img src={s.img} alt={s.title} className="w-full h-full object-cover grayscale brightness-75" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black uppercase tracking-tight">{s.title}</h3>
                                        <div className={`transition-all duration-500 ${isActive ? 'opacity-0 scale-0' : 'opacity-20'}`}>
                                            <ChevronRight size={24} />
                                        </div>
                                    </div>
                                    <div className={`grid transition-all duration-700 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden flex flex-col gap-6">
                                            <p className="text-sm font-light leading-relaxed opacity-70">{s.desc}</p>
                                            <Link
                                                to="/waitlist"
                                                className="w-full flex items-center justify-center border-[0.3px] border-white p-4 group active:bg-white active:text-black transition-all duration-300"
                                            >
                                                <span className="text-[11px] font-medium uppercase tracking-[0.3em]">Conectar</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white text-black py-24 flex flex-col gap-12 border-t border-black/10 -mx-6 px-6">
                    <h4 className="text-7xl font-black uppercase tracking-tighter leading-[0.85]">
                        Get <br /> Started
                    </h4>
                    <Link
                        to="/waitlist"
                        className="w-20 h-20 border-2 border-black rounded-full flex items-center justify-center group active:bg-black active:text-white transition-all duration-300"
                    >
                        <ChevronRight size={40} />
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default CenthropyMobile;
