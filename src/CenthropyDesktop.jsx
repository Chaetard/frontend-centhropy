import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Activity, ShieldCheck, Zap, Globe, Cpu, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ConnectorsSection from './components/ConnectorsSection';
import OrganizationsCarousel from './components/OrganizationsCarousel';
import { useIsDarkMode } from './hooks/useIsDarkMode';

const SphereCanvas = React.memo(({ probeDataRef, hudRef }) => {
    const containerRef = useRef(null);
    const isDark = useIsDarkMode();
    const isDarkRef = useRef(isDark);

    useEffect(() => {
        isDarkRef.current = isDark;
    }, [isDark]);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        const clock = new THREE.Clock();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);

        const organismGroup = new THREE.Group();
        scene.add(organismGroup);

        const ringCount = 145;
        const segments = 180; // Optimized segments
        const rings = [];
        const sphereRadius = 12.8;

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

            rings.push({
                mesh: line,
                lat: latitude,
                id: i,
                baseRadius: sphereRadius * Math.cos(latitude)
            });
            organismGroup.add(line);
        }

        const targetAnchor = new THREE.Vector3(5.5, 4.5, 5.5);
        camera.position.set(0, 0, 48);

        let frameId;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            const targetHex = isDarkRef.current ? 0xBCC5DC : 0x222944;

            rings.forEach((ring) => {
                if (ring.mesh.material.color.getHex() !== targetHex) {
                    ring.mesh.material.color.setHex(targetHex);
                }
                const positions = ring.mesh.geometry.attributes.position.array;
                const lat = ring.lat;
                const rBase = ring.baseRadius;

                if (rBase < 0.1) return;

                for (let j = 0; j <= segments; j++) {
                    const lon = (j / segments) * Math.PI * 2;
                    const wave =
                        Math.sin(lon * 4 + time + ring.id * 0.1) * 0.4 +
                        Math.cos(lat * 7 - time * 0.4) * 0.25;

                    const r = rBase + wave;
                    const idx = j * 3;
                    positions[idx] = Math.cos(lon) * r;
                    positions[idx + 1] = Math.sin(lat) * sphereRadius + (wave * 0.3);
                    positions[idx + 2] = Math.sin(lon) * r;
                }
                ring.mesh.geometry.attributes.position.needsUpdate = true;
            });

            organismGroup.rotation.y = time * 0.08;
            organismGroup.rotation.x = Math.sin(time * 0.1) * 0.05;

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

                hudRef.current.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 20px))`;
                hudRef.current.style.opacity = (vector.z < 1) ? "1" : "0";
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
            rings.forEach(ring => {
                ring.mesh.geometry.dispose();
                ring.mesh.material.dispose();
            });
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />;
});

const CenthropyDesktop = () => {
    const hudRef = useRef(null);
    const probeDataRef = useRef({ phi: Math.PI * 0.5, theta: Math.PI * 0.5 });
    const [openModule, setOpenModule] = useState(0);
    const [activeService, setActiveService] = useState(2);
    const [metrics, setMetrics] = useState({
        coordX: "12.45° N",
        coordY: "88.10° E",
        progress: "66%",
        entropy: "0.003%",
        freq: "144.02 MHZ",
        xover: "0.12%",
        heat: "32°C",
        drift: "0.4ms",
        entropyMini: "LOW",
        timer: "00:00:00",
        vSync: "STABLE",
        latency: "0.12ms",
        secBit: "SECURED",
        meshNet: "SYNCED"
    });

    const leftModules = [
        {
            l: 'Metric_01',
            w: 'Control',
            desc: 'Elevar el control organizacional, centralizando y unificando: Datos, Análisis y Decisiones.'
        },
        {
            l: 'Logic_02',
            w: 'Optimización',
            desc: 'Impulsar la optimización de procesos, recursos y estrategias de negocio de alto impacto, en tiempo real.'
        },
        {
            l: 'Core_03',
            w: 'Escalabilidad',
            desc: 'Detectar continuamente, oportunidades de expansión, apertura de mercados, líneas de negocio y diversificación de recursos.'
        },
        {
            l: 'Goal_04',
            w: 'Crecimiento',
            desc: 'Generar en las organizaciones el potencial de multiplicar resultados, impulsar ventas y aumentar ganancias.'
        },
        {
            l: 'Yield_05',
            w: 'Rentabilidad',
            desc: 'Potenciar la capacidad empresarial de cumplir y superar sus propios objetivos de rentabilización y sostenibilidad financiera.'
        }
    ];

    // Scroll Inertia Effect (Responsive & Aggressive)
    const [scrollInertia, setScrollInertia] = useState(0);
    const [introInertia, setIntroInertia] = useState(0);
    const scrollPos = useRef(0);
    const inertiaRef = useRef(0);
    const frameIdRef = useRef(null);

    useEffect(() => {
        scrollPos.current = window.pageYOffset;

        const handleScroll = () => {
            const currentPos = window.pageYOffset;
            const diff = currentPos - scrollPos.current;
            // Reducimos el límite a 8 para que la expansión de líneas no toque la flecha
            inertiaRef.current = Math.max(-8, Math.min(8, diff * 0.25));
            scrollPos.current = currentPos;
        };

        const updateInertia = () => {
            inertiaRef.current *= 0.96;
            if (Math.abs(inertiaRef.current) < 0.01) inertiaRef.current = 0;
            setScrollInertia(prev => prev + (inertiaRef.current - prev) * 0.1);
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

    // Metrics Logic
    useEffect(() => {
        const interval = setInterval(() => {
            const { phi, theta } = probeDataRef.current;
            const time = performance.now() * 0.001;
            const now = new Date();
            const latDeg = Math.cos(theta) * 90;
            const lonDeg = ((phi % (2 * Math.PI)) / (2 * Math.PI)) * 360 - 180;

            setMetrics(prev => ({
                ...prev,
                coordX: `${Math.abs(latDeg).toFixed(2)}° ${latDeg >= 0 ? 'N' : 'S'}`,
                coordY: `${Math.abs(lonDeg).toFixed(2)}° ${lonDeg >= 0 ? 'E' : 'W'}`,
                progress: (40 + Math.sin(time * 1.5) * 30).toFixed(0) + "%",
                entropy: (0.003 + Math.random() * 0.0005).toFixed(4) + "%",
                freq: (144.00 + Math.random() * 1.5).toFixed(2) + " MHZ",
                xover: (0.10 + Math.random() * 0.05).toFixed(2) + "%",
                heat: Math.floor(31 + Math.sin(time * 0.5) * 4) + "°C",
                drift: (0.3 + Math.random() * 0.15).toFixed(2) + "ms",
                entropyMini: Math.random() > 0.95 ? "STABLE" : "LOW",
                timer: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
                vSync: Math.random() > 0.98 ? "RE-SYNC" : "STABLE",
                latency: (0.10 + Math.random() * 0.04).toFixed(2) + "ms",
                secBit: Math.random() > 0.99 ? "ENCRYPTING" : "SECURED",
                meshNet: Math.random() > 0.97 ? "OPTIMIZING" : "SYNCED"
            }));
        }, 80);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-funnel no-select w-full bg-white dark:bg-[#1B2136] text-[#222944] dark:text-[#BCC5DC] min-h-screen relative">
            {/* CANVAS LAYER */}
            <SphereCanvas probeDataRef={probeDataRef} hudRef={hudRef} />

            {/* HEADER */}
            <Navbar subtitle="Unified Data Engine" />

            {/* LEFT SIDE ACCORDION */}
            <div className="fixed left-0 top-1/2 -translate-y-1/2 pl-12 z-[1000] flex flex-col h-[65vh] pointer-events-none py-2">
                {leftModules.map((item, i) => (
                    <React.Fragment key={i}>
                        <div className="flex flex-col relative pointer-events-auto w-[350px] group">
                            <div
                                className="cursor-pointer select-none flex items-center gap-4 transition-all duration-300 ease-out"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenModule(openModule === i ? null : i);
                                }}
                            >
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-2xl font-bold uppercase transition-all duration-300 ${openModule === i ? 'text-[#222944] dark:text-[#BCC5DC]' : 'text-[#222944]/80 dark:text-[#BCC5DC] hover:text-[#222944] dark:text-[#BCC5DC]'}`}>
                                            {item.w}
                                        </span>
                                        <div className={`transition-transform duration-500 ${openModule === i ? 'rotate-90' : 'rotate-0'}`}>
                                            <ChevronRight size={18} className="text-[#222944] dark:text-[#BCC5DC]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${openModule === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden">
                                    <div className="relative mt-2 py-2 w-full pr-4">
                                        <p className="text-[16px] font-funnel font-medium leading-relaxed text-[#222944]/80 dark:text-[#BCC5DC] whitespace-normal">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {i !== leftModules.length - 1 && (
                            <div className="flex-1 flex items-center pointer-events-none">
                                <div className="w-32 h-[1px] bg-transparent" />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>


            {/* RIGHT SIDE DATA HUD */}
            <div className="fixed right-0 top-1/2 -translate-y-1/2 pr-10 hidden lg:flex flex-col items-end text-right justify-between h-[65vh] pointer-events-none text-[#222944] dark:text-[#BCC5DC] z-[1000] py-2">
                {[
                    { icon: <Activity size={14} />, label: 'Data Stream', m1: 'V_SYNC', v1: metrics.vSync, m2: 'FREQ', v2: metrics.freq },
                    { icon: <Cpu size={14} />, label: 'Analytic Engine', m1: 'X_OVER', v1: metrics.xover, m2: 'HEAT', v2: metrics.heat },
                    { icon: <Globe size={14} />, label: 'Global Sync', m1: 'DRIFT', v1: metrics.drift, m2: 'ENTROPY', v2: metrics.entropyMini },
                    { icon: <ShieldCheck size={14} />, label: 'Quantum Vault', m1: 'SEC_BIT', v1: metrics.secBit, m2: 'NODE', v2: 'X-07' },
                    { icon: <Zap size={14} />, label: 'Link Status', m1: 'LATENCY', v1: metrics.latency, m2: 'MESH', v2: metrics.meshNet }
                ].map((mod, i) => (
                    <div key={i} className="flex flex-col border-r border-[#222944]/20 dark:border-[#BCC5DC]/20 pr-6 items-end">
                        <span className="text-[11px] font-funnel font-bold flex items-center gap-2 text-[#222944] dark:text-[#BCC5DC] uppercase tracking-tighter">
                            {mod.icon} {mod.label}
                        </span>
                        <div className="flex flex-col font-funnel text-[10px] text-[#222944] dark:text-[#BCC5DC]">
                            <div className="flex justify-between w-48 border-b border-[#222944]/10 dark:border-[#BCC5DC]/10 py-1.5 flex-row-reverse">
                                <span>{mod.m1}</span><span className="font-bold">{mod.v1}</span>
                            </div>
                            <div className="flex justify-between w-48 border-b border-[#222944]/10 dark:border-[#BCC5DC]/10 py-1.5 flex-row-reverse">
                                <span>{mod.m2}</span><span className="font-bold">{mod.v2}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FLOATING SPHERE HUD */}
            <div ref={hudRef} className="fixed top-0 left-0 pointer-events-none opacity-0 transform-gpu z-[40] flex flex-col items-center">
                <div className="relative flex items-center justify-center mb-1">
                    <div className="absolute w-6 h-6 border border-[#222944]/20 dark:border-[#BCC5DC]/20 rounded-full animate-ping"></div>
                    <div className="w-2.5 h-2.5 bg-[#222944] dark:bg-[#BCC5DC] rounded-full border border-white dark:border-[#222944]"></div>
                </div>
                <div className="tactical-card p-3 min-w-[180px] flex flex-col gap-2">
                    <div className="flex justify-between items-start border-b border-[#222944]/10 dark:border-[#BCC5DC]/10 pb-1.5">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-funnel font-bold text-[#222944]/50 dark:text-[#BCC5DC]/50 uppercase leading-none">Node</span>
                            <span className="text-[11px] font-bold uppercase tracking-tight text-[#222944] dark:text-[#BCC5DC]">Unify Agent</span>
                        </div>
                        <span className="text-[8px] font-funnel bg-[#222944] dark:bg-[#BCC5DC] text-white dark:text-[#222944] px-1 py-0.5 whitespace-nowrap">X-7</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[8px] font-funnel uppercase text-[#222944]/50 dark:text-[#BCC5DC]/50">
                            <span>Lat. Core</span>
                            <span className="text-[#222944] dark:text-[#BCC5DC] font-bold">{metrics.coordX}</span>
                        </div>
                        <div className="flex justify-between text-[8px] font-funnel uppercase text-[#222944]/50 dark:text-[#BCC5DC]/50">
                            <span>Lon. Core</span>
                            <span className="text-[#222944] dark:text-[#BCC5DC] font-bold">{metrics.coordY}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                        <div className="w-full h-0.5 bg-[#222944]/10 dark:bg-[#BCC5DC]/10 relative overflow-hidden">
                            <div className="absolute inset-y-0 left-0 bg-[#222944] dark:bg-[#BCC5DC]" style={{ width: metrics.progress }}></div>
                        </div>
                        <div className="flex justify-between text-[7px] font-funnel uppercase pt-0.5 text-[#222944]/80 dark:text-[#BCC5DC]/80">
                            <span>{metrics.timer}</span>
                            <span className="text-[#222944]/50 dark:text-[#BCC5DC]/50 tracking-tighter">Active Sync</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT LAYER */}
            <main className="relative z-[5000] w-full pointer-events-none">
                <section className="h-screen" />

                <div id="status-panel" className="relative z-[5000] bg-white dark:bg-[#222944] pointer-events-auto">
                    <div className="w-full px-5 py-12 md:px-10 md:pt-16 md:pb-0 bg-white dark:bg-[#222944]">
                        <div className="max-w-[1800px] mx-auto">
                            <div className="flex flex-wrap justify-between gap-8 font-funnel text-[10px] uppercase tracking-[0.2em] border-b border-[#222944]/10 dark:border-[#BCC5DC]/10 pb-12 mb-24 text-[#222944] dark:text-[#BCC5DC]">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#222944]/30 dark:text-[#BCC5DC]/50">Sync Status</span>
                                    <span className="font-bold flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" /> CORE_OPTIMIZED
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#222944]/30 dark:text-[#BCC5DC]/50">Encryption</span>
                                    <span className="font-bold">UNIFY_VAULT_ACTIVE</span>
                                </div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="text-[#222944]/30 dark:text-[#BCC5DC]/50">Location</span>
                                    <span className="font-bold uppercase">Multi-Node_Global</span>
                                </div>
                            </div>

                            <div className="max-w-6xl mx-auto mb-16 text-center">
                                <h2 className="text-3xl md:text-[64px] font-normal tracking-tight leading-[1.0] text-[#222944] dark:text-[#BCC5DC] flex flex-col gap-0">
                                    {[
                                        "Ecosistema creado para potenciar,",
                                        "en tiempo real, la toma de decisiones",
                                        "en organizaciones de alto valor."
                                    ].map((line, i) => (
                                        <span
                                            key={i}
                                            className="block aria-hidden:true will-change-transform"
                                            style={{
                                                transform: `translateY(${-introInertia * (3.5 + i * 1.5)}px)`
                                            }}
                                        >
                                            {line}
                                        </span>
                                    ))}
                                </h2>
                            </div>

                            <div className="flex justify-center mb-16">
                                <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                                    <path d="M10 5L30 25L50 5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="square" strokeLinejoin="miter" className="text-[#222944] dark:text-[#BCC5DC]" />
                                    <path d="M10 5L30 25L50 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className="energy-path text-[#222944] dark:text-[#BCC5DC]" />
                                </svg>
                            </div>


                            <div className="flex flex-col">
                                {[
                                    { id: 'SYS.01', t1: 'Cordyceps', t2: 'Protocol', short: 'CP', desc: 'Ontología de datos creada para descifrar el estado real y potencial oculto de las organizaciones.' },
                                    { id: 'SYS.02', t1: 'Unify Data', t2: 'Center', short: 'DC', desc: 'Interfaz de análisis avanzado y unificación de datos, desarrollada para potenciar la toma de decisiones. Integración nativa con Unify Agent.' },
                                    { id: 'SYS.03', t1: 'Unify', t2: 'Agent', short: 'UA', desc: 'Analista inteligente de última generación, entrenado para descubrir insights de alto impacto y generar estrategias accionables en lenguaje natural.' },
                                    { id: 'SYS.04', t1: 'Unify', t2: 'Team', short: 'UT', desc: 'Equipo humano de élite, especializado en garantizar la confiabilidad, eficacia y sostenibilidad del ecosistema Unify.' }
                                ].map((comp, idx) => (
                                    <div key={idx} className={`flex flex-col md:flex-row items-center ${idx === 0 ? '' : 'border-t border-[#222944]/10 dark:border-[#BCC5DC]/10'} py-16 md:py-32 gap-24 group transition-all duration-500`}>
                                        <div className="w-full md:w-[240px] flex flex-col gap-6">
                                            <span className="text-[14px] font-bold text-[#222944] dark:text-[#BCC5DC] font-funnel">{comp.id}</span>
                                            <p className="text-[15px] font-light leading-relaxed text-[#222944] dark:text-[#BCC5DC] max-w-[240px]">
                                                {comp.desc}
                                            </p>
                                        </div>

                                        <div className="hidden md:flex flex-1 justify-center items-center relative h-[250px] overflow-hidden">
                                            <span className="text-[220px] font-black text-[#222944]/[0.03] dark:text-[#BCC5DC]/[0.02] leading-none select-none tracking-tighter transition-all duration-700 group-hover:opacity-0 group-hover:scale-95">
                                                {comp.short}
                                            </span>

                                            <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
                                                <div className="w-0 group-hover:w-[450px] transition-all duration-700 ease-in-out flex items-center justify-end overflow-hidden opacity-0 group-hover:opacity-100 origin-right border border-[#222944]/10 dark:border-[#BCC5DC]/10 bg-black">
                                                    <img
                                                        src={
                                                            idx === 0 ? "/Unifyprotocol.jpg" :
                                                                idx === 1 ? "/Unifydc.jpg" :
                                                                    idx === 2 ? "/Unifyagent3.0.jpg" :
                                                                        "/Unifyteam.jpg"
                                                        }
                                                        alt={`${comp.t1} ${comp.t2} Illustration`}
                                                        className="h-auto block dark:invert"
                                                        style={{ width: '450px', minWidth: '450px' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-[500px] text-left md:text-right">
                                            <div
                                                className="will-change-transform"
                                                style={{ transform: `translateY(${-scrollInertia * 0.4}px)` }}
                                            >
                                                <h4 className="text-5xl md:text-[85px] font-black tracking-tighter uppercase leading-[0.8] text-[#222944] dark:text-[#BCC5DC] transition-transform duration-700 group-hover:translate-x-[-20px]">
                                                    {comp.t1} <br />
                                                    <span className="text-[#222944] dark:text-[#BCC5DC]">{comp.t2}</span>
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-40 mb-24">
                                <div className="flex flex-col w-full mb-8">
                                    <div className="w-full h-[1px] bg-[#222944]/15 dark:bg-[#BCC5DC]/15 mb-10" />
                                    <h3 className="text-4xl md:text-[70px] font-medium tracking-tighter text-[#222944] dark:text-[#BCC5DC] leading-none">Soluciones</h3>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 h-[500px] w-full">
                                    {[
                                        {
                                            id: 'SERV.02',
                                            title: 'TI Outsourcing',
                                            subtitle: 'Digitalización de Datos',
                                            desc: 'Desplegamos la arquitectura necesaria para la ingesta, purificación y síntesis de información, garantizando la integridad, soberanía y seguridad del flujo operativo desde su origen hasta su explotación estratégica.',
                                            features: ['Conexiones e Ingesta', 'Almacenamiento & Backup', 'Gestión de Documentos']
                                        },
                                        {
                                            id: 'SERV.01',
                                            title: 'Unify Data Center',
                                            subtitle: 'Centro de Datos y Decisiones',
                                            desc: 'Un entorno de alta fidelidad diseñado para la síntesis de datos, analítica prescriptiva y ejecución táctica, orientado a la optimización de activos y la escalabilidad del capital. UDC es propulsado por la integración nativa de Unify Agent: nuestra unidad de inteligencia autónoma para el diagnóstico y la aceleración de decisiones estratégicas.',
                                            features: ['Insights to Growth', 'Advanced Analytics', 'Intelligent Agent']
                                        },
                                        {
                                            id: 'SERV.03',
                                            title: 'Growth Engine',
                                            subtitle: 'Intelligent eCommerce',
                                            desc: 'Maximizamos su conversión y rentabilidad mediante el ecosistema Unify y nuestra metodología Data-Driven Growth. Implementamos soluciones de precisión para optimizar la toma de decisiones y escalar su modelo de negocio de forma sostenible.',
                                            features: ['Desarrollo & Operación', 'Integración Unify', 'Investigación & Estrategia']
                                        }
                                    ].map((service, sIdx) => {
                                        const isActive = sIdx === activeService;
                                        return (
                                             <Link
                                                to="/waitlist"
                                                key={service.id}
                                                onMouseEnter={() => setActiveService(sIdx)}
                                                className={`relative cursor-pointer transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#F8F9FA] dark:bg-[#303A5F] overflow-hidden flex flex-col p-10 group ${isActive ? 'flex-[4]' : 'flex-[1]'}`}
                                            >
                                                {/* TOP SECTION: Legend, Title and Description */}
                                                <div className="z-10 w-full flex flex-col gap-10">
                                                    {/* Legend and Title (Active ONLY) */}
                                                    <div className="flex flex-col gap-3">
                                                        <span className={`text-[10px] font-bold text-[#222944]/40 dark:text-white/40 uppercase tracking-[0.3em] transition-all ${isActive 
                                                            ? 'opacity-100 translate-y-0 duration-700' 
                                                            : 'opacity-0 -translate-x-4 absolute duration-0'}`}>
                                                            {service.subtitle}
                                                        </span>

                                                        {/* Active Title (Large) */}
                                                        <h4 className={`font-black uppercase tracking-tighter text-5xl md:text-7xl text-[#222944] dark:text-white transition-all ${isActive
                                                            ? 'opacity-100 translate-y-0 duration-700 delay-[100ms]'
                                                            : 'opacity-0 translate-y-8 absolute pointer-events-none duration-0'
                                                            }`}>
                                                            {service.title}
                                                        </h4>
                                                    </div>

                                                    {/* Decorative Fine Line */}
                                                    <div className={`h-[1px] bg-[#222944] dark:bg-white transition-all ${isActive 
                                                        ? 'w-10 opacity-100 duration-700 delay-[150ms]' 
                                                        : 'w-0 opacity-0 duration-0'}`} 
                                                    />

                                                    {/* Description (Top) */}
                                                    <div className={`flex flex-col transition-all ${isActive 
                                                        ? 'opacity-100 translate-y-0 pointer-events-auto duration-700' 
                                                        : 'opacity-0 translate-y-12 pointer-events-none absolute duration-0'}`}>
                                                        
                                                        <p className={`text-[#222944]/70 dark:text-white/70 text-[15px] font-light leading-relaxed max-w-xl transition-all ${isActive 
                                                            ? 'opacity-100 translate-y-0 duration-700 delay-[200ms]' 
                                                            : 'opacity-0 translate-y-4 duration-0'}`}>
                                                            {service.desc}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* BOTTOM SECTION: Features (Chips) and Folded Title */}
                                                <div className="mt-auto z-10 w-full">
                                                    {/* Inactive Title (Small) - Shows at the BOTTOM when folded */}
                                                    <h4 className={`font-black uppercase tracking-tighter text-sm md:text-xl text-[#222944] dark:text-white transition-all ${!isActive 
                                                        ? 'opacity-100 duration-500 delay-200' 
                                                        : 'opacity-0 absolute pointer-events-none duration-0'
                                                        }`}>
                                                        {service.title}
                                                    </h4>

                                                    {/* Chips (Active only) */}
                                                    <div className={`flex flex-wrap gap-4 transition-all ${isActive 
                                                            ? 'opacity-100 translate-y-0 pointer-events-auto duration-700 delay-[300ms]' 
                                                            : 'opacity-0 translate-y-4 pointer-events-none absolute duration-0'}`}>
                                                         {service.features.map(f => (
                                                            <span key={f} className="text-[9px] font-bold uppercase tracking-[0.2em] border border-[#222944]/10 dark:border-white/10 px-4 py-2 text-[#222944]/40 dark:text-white/40 bg-transparent hover:bg-[#222944]/5 dark:hover:bg-white/5 transition-colors duration-300">
                                                                {f}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>



                                                {/* CTA Arrow Button */}
                                                <div className={`absolute bottom-10 right-10 w-14 h-14 rounded-none border border-[#222944] dark:border-white/20 flex items-center justify-center text-[#222944] dark:text-white z-30 hover:bg-[#222944] dark:hover:bg-white hover:text-white dark:hover:text-[#222944] transition-all duration-200 ${isActive 
                                                    ? 'opacity-100' 
                                                    : 'opacity-0 pointer-events-none'}`}>
                                                    <ChevronRight size={28} />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            <ConnectorsSection />
                        </div>
                    </div>

                    <OrganizationsCarousel />

                    <div className="w-full px-5 py-4 md:px-10 md:pt-4 md:pb-16 bg-white dark:bg-[#222944]">
                        <div className="max-w-[1800px] mx-auto">
                            <div className="mt-8 pt-20">
                                <div className="w-full h-[1px] bg-[#222944]/15 dark:bg-[#BCC5DC]/15 mb-10" />
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col w-full">
                                        <h5 className="text-[70px] font-black uppercase tracking-tighter leading-none">CONECTAR</h5>
                                    </div>
                                    <div className="flex items-center">
                                        <Link to="/waitlist" className="w-16 h-16 border-2 border-[#222944] dark:border-[#BCC5DC] rounded-none flex items-center justify-center group cursor-pointer hover:bg-[#222944] hover:border-[#222944] hover:text-white transition-all duration-300">
                                            <ChevronRight size={32} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CenthropyDesktop;
