import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Activity, ShieldCheck, Zap, Globe, Cpu, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ConnectorsSection from './components/ConnectorsSection';
import OrganizationsCarousel from './components/OrganizationsCarousel';

const SphereCanvas = React.memo(({ probeDataRef, hudRef }) => {
    const containerRef = useRef(null);

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

            rings.forEach((ring) => {
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
    const [activeService, setActiveService] = useState(0);
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
            desc: 'Tecnología desarrollada para elevar el control empresarial, mediante la centralización y unificación de tres elementos: Datos, Análisis y Decisiones.'
        },
        {
            l: 'Logic_02',
            w: 'Optimización',
            desc: 'Impulsar el refinamiento continuo de procesos, recursos y estrategias de negocio, por medio de la generación constante de insights accionables y de alto impacto.'
        },
        {
            l: 'Core_03',
            w: 'Escalabilidad',
            desc: 'Otorgar a las organizaciones, la capacidad de multiplicar sus propios resultados exponencialmente, mediante la implementación de estrategias generadas en Unify.'
        },
        {
            l: 'Goal_04',
            w: 'Crecimiento',
            desc: 'Generar estrategias de negocio accionables, mediante la detección constante y en tiempo real, de oportunidades para incrementar ventas y ganancias.'
        },
        {
            l: 'Yield_05',
            w: 'Rentabilidad',
            desc: 'Crear la tecnología Unify bajo el enfoque “Data Driven Growth”, permite garantizar que las organizaciones aumenten su capacidad de alcanzar y superar sus objetivos de rentabilización.'
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
            inertiaRef.current = diff * 0.25;
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
        <div className="font-funnel no-select w-full bg-white text-black min-h-screen relative overflow-x-hidden">
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
                                        <span className={`text-2xl font-bold uppercase transition-all duration-300 ${openModule === i ? 'text-black' : 'text-black/80 hover:text-black'}`}>
                                            {item.w}
                                        </span>
                                        <div className={`transition-transform duration-500 ${openModule === i ? 'rotate-90' : 'rotate-0'}`}>
                                            <ChevronRight size={18} className="text-black" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${openModule === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden">
                                    <div className="relative mt-2 py-2 w-full pr-4">
                                        <span className="text-[9px] font-funnel text-black/40 mb-2 tracking-[0.2em] uppercase block font-bold">{item.l}</span>
                                        <p className="text-[13px] font-funnel font-medium leading-relaxed text-black/80 whitespace-normal">
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
            <div className="fixed right-0 top-1/2 -translate-y-1/2 pr-10 hidden lg:flex flex-col items-end text-right justify-between h-[65vh] pointer-events-none text-black z-[1000] py-2">
                {[
                    { icon: <Activity size={14} />, label: 'Data Stream', m1: 'V_SYNC', v1: metrics.vSync, m2: 'FREQ', v2: metrics.freq },
                    { icon: <Cpu size={14} />, label: 'Analytic Engine', m1: 'X_OVER', v1: metrics.xover, m2: 'HEAT', v2: metrics.heat },
                    { icon: <Globe size={14} />, label: 'Global Sync', m1: 'DRIFT', v1: metrics.drift, m2: 'ENTROPY', v2: metrics.entropyMini },
                    { icon: <ShieldCheck size={14} />, label: 'Quantum Vault', m1: 'SEC_BIT', v1: metrics.secBit, m2: 'NODE', v2: 'X-07' },
                    { icon: <Zap size={14} />, label: 'Link Status', m1: 'LATENCY', v1: metrics.latency, m2: 'MESH', v2: metrics.meshNet }
                ].map((mod, i) => (
                    <div key={i} className="flex flex-col border-r border-black/20 pr-6 items-end">
                        <span className="text-[11px] font-funnel font-bold flex items-center gap-2 text-black uppercase tracking-tighter">
                            {mod.icon} {mod.label}
                        </span>
                        <div className="flex flex-col font-funnel text-[10px] text-black">
                            <div className="flex justify-between w-48 border-b border-black/10 py-1.5 flex-row-reverse">
                                <span>{mod.m1}</span><span className="font-bold">{mod.v1}</span>
                            </div>
                            <div className="flex justify-between w-48 border-b border-black/10 py-1.5 flex-row-reverse">
                                <span>{mod.m2}</span><span className="font-bold">{mod.v2}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FLOATING SPHERE HUD */}
            <div ref={hudRef} className="fixed top-0 left-0 pointer-events-none opacity-0 transform-gpu z-[40] flex flex-col items-center">
                <div className="relative flex items-center justify-center mb-1">
                    <div className="absolute w-6 h-6 border border-black/20 rounded-full animate-ping"></div>
                    <div className="w-2.5 h-2.5 bg-black rounded-full border border-white"></div>
                </div>
                <div className="tactical-card p-3 min-w-[180px] flex flex-col gap-2">
                    <div className="flex justify-between items-start border-b border-black/10 pb-1.5">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-funnel font-bold text-gray-500 uppercase leading-none">Node</span>
                            <span className="text-[11px] font-bold uppercase tracking-tight">Unify Agent</span>
                        </div>
                        <span className="text-[8px] font-funnel bg-black text-white px-1 py-0.5 whitespace-nowrap">X-7</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[8px] font-funnel uppercase text-gray-500">
                            <span>Lat. Core</span>
                            <span className="text-black font-bold">{metrics.coordX}</span>
                        </div>
                        <div className="flex justify-between text-[8px] font-funnel uppercase text-gray-500">
                            <span>Lon. Core</span>
                            <span className="text-black font-bold">{metrics.coordY}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                        <div className="w-full h-0.5 bg-black/10 relative overflow-hidden">
                            <div className="absolute inset-y-0 left-0 bg-black" style={{ width: metrics.progress }}></div>
                        </div>
                        <div className="flex justify-between text-[7px] font-funnel uppercase pt-0.5">
                            <span>{metrics.timer}</span>
                            <span className="text-gray-500 tracking-tighter">Active Sync</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT LAYER */}
            <main className="relative z-[5000] w-full pointer-events-none">
                <section className="h-screen" />

                <div id="status-panel" className="relative z-[5000] bg-white pointer-events-auto">
                    <div className="w-full px-5 py-12 md:px-10 md:pt-16 md:pb-0 bg-white">
                        <div className="max-w-[1800px] mx-auto">
                            <div className="flex flex-wrap justify-between gap-8 font-funnel text-[10px] uppercase tracking-[0.2em] border-b border-black/10 pb-12 mb-24 text-black">
                                <div className="flex flex-col gap-1">
                                    <span className="text-black/30">Sync Status</span>
                                    <span className="font-bold flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" /> CORE_OPTIMIZED
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-black/30">Encryption</span>
                                    <span className="font-bold">UNIFY_VAULT_ACTIVE</span>
                                </div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="text-black/30">Location</span>
                                    <span className="font-bold uppercase">Multi-Node_Global</span>
                                </div>
                            </div>

                            <div className="max-w-6xl mx-auto mb-32 text-center">
                                <h2 className="text-3xl md:text-[64px] font-normal tracking-tight leading-[1.0] text-black flex flex-col gap-0">
                                    {[
                                        "Ecosistema creado para potenciar la",
                                        "toma de decisiones en tiempo real,",
                                        "en organizaciones de alto valor."
                                    ].map((line, i) => (
                                        <span
                                            key={i}
                                            className="block aria-hidden:true will-change-transform"
                                            style={{
                                                transform: `translateY(${-introInertia * (8 + i * 2.5)}px)`
                                            }}
                                        >
                                            {line}
                                        </span>
                                    ))}
                                </h2>
                            </div>

                            <div className="flex justify-center mb-32">
                                <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                                    <path d="M10 5L30 25L50 5" stroke="black" strokeWidth="1.5" strokeOpacity="0.1" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 5L30 25L50 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="energy-path" />
                                </svg>
                            </div>

                            <div className="flex flex-col">
                                {[
                                    { id: 'SYS.01', t1: 'Unify', t2: 'Protocol', short: 'UP', desc: 'Protocolo de ontología de datos, diseñado para descifrar, con grado de precisión militar, el comportamiento real y potencial de las organizaciones, permitiendo garantizar resultados de alto impacto.' },
                                    { id: 'SYS.02', t1: 'Unify Data', t2: 'Center', short: 'DC', desc: 'Centro de unificación y análisis avanzado de datos, desarrollado como plataforma para potenciar la toma de decisión en las organizaciones. UDC es una interfaz intuitiva, impulsada por nuestro Unify Agent (Analista Inteligente de Datos de Última Generación).' },
                                    { id: 'SYS.03', t1: 'Unify', t2: 'Agent', short: 'UA', desc: 'Analista de datos de última generación, creado para ser el copiloto ideal en la dirección corporativa, impulsando la agilidad y efectividad en la toma decisiones centradas en el crecimiento.' },
                                    { id: 'SYS.04', t1: 'Unify', t2: 'Team', short: 'UT', desc: 'Equipo humano de élite, especializado y enfocado en garantizar la confiabilidad, eficacia y sostenibilidad del ecosistema Unify.' }
                                ].map((comp, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row items-center border-t border-black/10 py-16 md:py-32 gap-24 group transition-all duration-500 hover:bg-black/[0.01]">
                                        <div className="w-full md:w-[240px] flex flex-col gap-6">
                                            <span className="text-[14px] font-bold text-black font-funnel">{comp.id}</span>
                                            <p className="text-[15px] font-light leading-relaxed text-black max-w-[240px]">
                                                {comp.desc}
                                            </p>
                                        </div>

                                        <div className="hidden md:flex flex-1 justify-center items-center relative h-[250px] overflow-hidden">
                                            <span className="text-[220px] font-black text-black/[0.02] leading-none select-none tracking-tighter transition-all duration-700 group-hover:opacity-0 group-hover:scale-95">
                                                {comp.short}
                                            </span>

                                            <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
                                                <div className="w-0 group-hover:w-[450px] transition-all duration-700 ease-in-out flex items-center justify-end overflow-hidden opacity-0 group-hover:opacity-100 origin-right border border-black/10 bg-black">
                                                    <img
                                                        src={
                                                            idx === 0 ? "/Unifyprotocol.jpg" :
                                                                idx === 1 ? "/Unifydc.jpg" :
                                                                    idx === 2 ? "/Unifyagent3.0.jpg" :
                                                                        "/Unifyteam.jpg"
                                                        }
                                                        alt={`${comp.t1} ${comp.t2} Illustration`}
                                                        className="h-auto block"
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
                                                <h4 className="text-5xl md:text-[100px] font-black tracking-tighter uppercase leading-[0.8] text-black transition-transform duration-700 group-hover:translate-x-[-20px]">
                                                    {comp.t1} <br />
                                                    <span className="text-black">{comp.t2}</span>
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <ConnectorsSection />

                            <div className="mt-16 mb-24">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 mb-2">Sistemas de Crecimiento</span>
                                        <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Soluciones</h3>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 h-[500px] w-full">
                                    {[
                                        {
                                            id: 'SERV.01',
                                            title: 'Unify Data Center',
                                            subtitle: 'Centro de Datos y Decisiones',
                                            desc: 'Interfaz simple e intuitiva, desarrollada para centralizar y unificar datos, análisis y decisiones, con el objetivo de optimizar el control y el crecimiento empresarial. UDC posee integración nativa con nuestro agente de datos inteligente Unify Agent.',
                                            features: ['Insights to Growth', 'Advanced Analytics', 'Intelligent Agent']
                                        },
                                        {
                                            id: 'SERV.02',
                                            title: 'TI Outsourcing',
                                            subtitle: 'Digitalización de Datos',
                                            desc: 'Gestión integral de infraestructura de datos. Desde la ingesta, limpieza y transformación, hasta la digitalización almacenamiento, sistemas de búsqueda semántica y RAG.',
                                            features: ['Conexiones e Ingesta', 'Almacenamiento & Backup', 'Gestión de Documentos']
                                        },
                                        {
                                            id: 'SERV.03',
                                            title: 'Retail Intelligence',
                                            subtitle: 'Intelligent eCommerce',
                                            desc: 'Gestión de Crecimiento 360°: Desarrollo y gestión de eCommerce, dirección de estratégica y operativa, investigación de mercado y toda la potencia del ecosistema Unify, enfocada en maximizar la conversión, impulsar el crecimiento y elevar la rentabilidad.',
                                            features: ['Desarrollo & Operación', 'Integración Unify', 'Investigación & Estrategia']
                                        }
                                    ].map((service, sIdx) => {
                                        const isActive = sIdx === activeService;
                                        return (
                                            <Link
                                                to="/waitlist"
                                                key={service.id}
                                                onMouseEnter={() => setActiveService(sIdx)}
                                                className={`relative cursor-pointer transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] bg-black overflow-hidden flex flex-col p-10 group ${isActive ? 'flex-[4]' : 'flex-[1]'}`}
                                            >
                                                <div className="flex justify-between items-start z-10">
                                                    <span className={`text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-700 ${isActive ? 'text-white/60 translate-x-0' : 'text-white/10 -translate-x-2'}`}>
                                                        {service.id}
                                                    </span>
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-white transition-all duration-700 ${isActive ? 'opacity-100 scale-125' : 'opacity-10 scale-50'}`} />
                                                </div>

                                                <div className="mt-auto flex flex-col z-10 w-full">
                                                    <h4 className={`font-black uppercase tracking-tighter text-sm md:text-xl text-white ${isActive ? 'opacity-0 transition-none pointer-events-none' : 'opacity-100 transition-opacity duration-300 ease-out'
                                                        }`}>
                                                        {service.title}
                                                    </h4>

                                                    <h4 className={`font-black uppercase tracking-tighter text-5xl md:text-7xl text-white mb-4 ${isActive
                                                        ? 'opacity-100 translate-y-0 transition-all duration-700 delay-[150ms] ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto'
                                                        : 'opacity-0 translate-y-16 transition-none absolute pointer-events-none'
                                                        }`}>
                                                        {service.title}
                                                    </h4>

                                                    <div className={`flex flex-col transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-12 pointer-events-none absolute'}`}>
                                                        <span className={`text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] block mb-6 transition-all duration-700 delay-[100ms] ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                                            {service.subtitle}
                                                        </span>
                                                        <p className={`text-white/70 text-lg font-light leading-tight mb-8 max-w-xl transition-all duration-700 delay-[200ms] ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                                            {service.desc}
                                                        </p>

                                                        <div className={`flex flex-wrap gap-3 transition-all duration-700 delay-[300ms] ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                                            {service.features.map(f => (
                                                                <span key={f} className="text-[8px] font-bold uppercase tracking-[0.2em] border border-white/10 px-3 py-1.5 text-white/40 bg-white/5 hover:bg-white/10 transition-colors duration-300">
                                                                    {f}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={`absolute -bottom-10 -right-10 text-[280px] font-black leading-none select-none pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'text-white/[0.04] translate-y-0 rotate-0 scale-100' : 'text-white/[0.01] translate-y-40 rotate-12 scale-110'}`}>
                                                    0{sIdx + 1}
                                                </div>

                                                {/* CTA Arrow Button */}
                                                <div className={`absolute bottom-10 right-10 w-14 h-14 rounded-none border border-white/20 flex items-center justify-center text-white z-30 transition-all duration-500 hover:bg-white hover:text-black hover:border-white ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                                    <ChevronRight size={28} />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <OrganizationsCarousel />

                    <div className="w-full px-5 py-12 md:px-10 md:pt-16 md:pb-0 bg-white">
                        <div className="max-w-[1800px] mx-auto">
                            <div className="mt-24 py-8 border-t border-black flex justify-between items-center">
                                <div className="flex flex-col">
                                    <h5 className="text-6xl font-black uppercase tracking-tighter leading-none">CONECTAR</h5>
                                </div>
                                <div className="flex items-center">
                                    <Link to="/waitlist" className="w-16 h-16 border-2 border-black rounded-none flex items-center justify-center group cursor-pointer hover:bg-black hover:text-white transition-all duration-300">
                                        <ChevronRight size={32} />
                                    </Link>
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
