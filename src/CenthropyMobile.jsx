import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronRight, ChevronLeft, ArrowRight, Plus, Minus, ArrowUpRight, CornerDownRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Navbar from './components/Navbar';
import OperationGlobe from './components/OperationGlobe';
import OrganizationsCarousel from './components/OrganizationsCarousel';
import { useIsDarkMode } from './hooks/useIsDarkMode';

// 1. ISOLATED CANVAS COMPONENT
const SphereCanvasMobile = React.memo(({ probeDataRef, hudRef }) => {
    const containerRef = useRef(null);
    const isDark = useIsDarkMode();
    const isDarkRef = useRef(isDark);

    useEffect(() => {
        isDarkRef.current = isDark;
    }, [isDark]);

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
            const targetHex = isDarkRef.current ? 0xBCC5DC : 0x222944;

            for (let i = 0; i < ringCount; i++) {
                const ring = rings[i];
                if (ring.mesh.material.color.getHex() !== targetHex) {
                    ring.mesh.material.color.setHex(targetHex);
                }
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


    const [openModule, setOpenModule] = useState(0);

    // Unify Chart expansion — precision-timed card-stretch choreography
    const unifyCardRef = useRef(null);
    const isUnifyChartInView = useInView(unifyCardRef, { once: true, margin: "0px 0px -15% 0px" });
    const [unifyBarsVisible, setUnifyBarsVisible] = useState(true);
    const [isCollapseReturn, setIsCollapseReturn] = useState(false);
    const showUnifyBars = unifyBarsVisible && isUnifyChartInView;
    const [isUnifyStudyExpanded, setIsUnifyStudyExpanded] = useState(false);
    const [unifyCardOrigin, setUnifyCardOrigin] = useState(null);

    const handleUnifyChartExpand = () => {
        if (unifyCardRef.current) {
            const rect = unifyCardRef.current.getBoundingClientRect();
            setUnifyCardOrigin({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
        }
        setIsCollapseReturn(false);
        setUnifyBarsVisible(false);
        // Tiny delay so bars start fading before overlay appears
        setTimeout(() => setIsUnifyStudyExpanded(true), 80);
    };

    const handleUnifyChartCollapse = () => {
        setIsUnifyStudyExpanded(false);
        // Mark as collapse return so bars use fast (0-delay) animation
        setIsCollapseReturn(true);
        // Fire bars immediately — they animate in sync with the overlay shrinking
        setUnifyBarsVisible(true);
        setTimeout(() => {
            setUnifyCardOrigin(null);
            setIsCollapseReturn(false);
        }, 600);
    };

    // Unify Actions (GOS) expansion
    const gosCardRef = useRef(null);
    const [gosFeaturesVisible, setGosFeaturesVisible] = useState(true);
    const [isGosExpanded, setIsGosExpanded] = useState(false);
    const [gosCardOrigin, setGosCardOrigin] = useState(null);

    const handleGosExpand = () => {
        if (gosCardRef.current) {
            const rect = gosCardRef.current.getBoundingClientRect();
            setGosCardOrigin({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
        }
        setGosFeaturesVisible(false);
        setTimeout(() => setIsGosExpanded(true), 150);
    };

    const handleGosCollapse = () => {
        setIsGosExpanded(false);
        setGosFeaturesVisible(true);
        setTimeout(() => {
            setGosCardOrigin(null);
        }, 550);
    };

    // Apollo Chart expansion — mirrors Unify card-stretch choreography
    const apolloCardRef = useRef(null);
    const isApolloChartInView = useInView(apolloCardRef, { once: true, margin: "0px 0px -15% 0px" });
    const [apolloDotsVisible, setApolloDotsVisible] = useState(true);
    const [isApolloCollapseReturn, setIsApolloCollapseReturn] = useState(false);
    const showApolloDots = apolloDotsVisible && isApolloChartInView;
    const [isApolloChartExpanded, setIsApolloChartExpanded] = useState(false);
    const [apolloCardOrigin, setApolloCardOrigin] = useState(null);
    const apolloScrollRef = useRef(null);

    const handleApolloChartExpand = () => {
        if (apolloCardRef.current) {
            const rect = apolloCardRef.current.getBoundingClientRect();
            setApolloCardOrigin({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
        }
        setIsApolloCollapseReturn(false);
        setApolloDotsVisible(false);
        // Wait for dots to visibly dissolve before overlay stretches in
        setTimeout(() => setIsApolloChartExpanded(true), 350);
    };

    const handleApolloChartCollapse = () => {
        // Scroll back to top so exit animations are visible
        if (apolloScrollRef.current) {
            apolloScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
        setIsApolloChartExpanded(false);
        setIsApolloCollapseReturn(true);
        // Delay dot re-entry so overlay has time to shrink and reveal the card
        setTimeout(() => {
            setApolloDotsVisible(true);
        }, 200);
        setTimeout(() => {
            setApolloCardOrigin(null);
            setIsApolloCollapseReturn(false);
        }, 900);
    };

    // Apollo Actions (Solución Integral) expansion — mirrors GOS pattern
    const apolloActionsCardRef = useRef(null);
    const [apolloActionsFeaturesVisible, setApolloActionsFeaturesVisible] = useState(true);
    const [isApolloActionsExpanded, setIsApolloActionsExpanded] = useState(false);
    const [apolloActionsCardOrigin, setApolloActionsCardOrigin] = useState(null);

    const apolloActions = [
        { id: 'a1', name: 'Unify DC Serverless', action: 'Apollo Protocol funciona con el motor análisis y decisiones (Unify DC). El procesamiento de datos en Unify DC permite detectar, en tiempo real, oportunidades de rentabilidad ocultas, alertar sobre riesgos de margen, optimización de precios e inventario y generar estrategias accionables enfocadas en el crecimiento y la expansión de resultados.' },
        { id: 'a2', name: 'Canal Digital de Conversión Inteligente', action: 'El equipo técnico asignado desarrolla y gestiona en su totalidad la infraestructura eCommerce de las organizaciones. Se garantiza que cada SKU esté posicionado con precisión quirúrgica en la tienda online (descripciones de alto impacto, variantes lógicas y precios sincronizados) para transformar el tráfico en transacciones efectivas.' },
        { id: 'a3', name: 'Inventario Inteligente (Ingeniería de Liquidez)', action: 'Mediante la vigilancia continua del stock, el protocolo activa mecanismos de defensa (reposición) o de ataque (liquidación) antes de que el problema afecte el balance. Se asegura que el inventario fluya a su máxima velocidad, maximizando el retorno sobre el capital invertido en mercancía.' },
        { id: 'a4', name: 'Escalabilidad de Adquisición (Paid Media)', action: 'Ejecución de ingeniería publicitaria en Meta y Google Ads centrada en impulsar ventas y rentabilidad. El protocolo elimina el riesgo de "quema de presupuesto" mediante la optimización técnica potenciada por análisis continuos en Unify Data Center, asegurando que la expansión de la pauta sea una consecuencia directa del éxito matemático y lógico.' },
        { id: 'a5', name: 'Maximización de Valor por Transacción', action: 'Extracción del máximo beneficio posible de cada visitante, elevando el ticket promedio de forma sistemática. Despliegue de tácticas de choque (Flash Sales, Bundles inteligentes y Recuperación de Carritos) que fuerzan la conversión en momentos críticos.' },
        { id: 'a6', name: 'Dominio Estratégico y Verdad Matemática', action: 'Certeza absoluta en la toma de decisiones y eliminación total de las "suposiciones" en el centro de mando. Procesamiento de datos a través del núcleo Unify para detectar oportunidades de rentabilidad ocultas y alertar sobre riesgos de margen en tiempo real.' },
        { id: 'a7', name: 'Sistematización, Control y Transparencia', action: 'Roadmaps enfocados hacia el dominio del mercado, con planes de acción ejecutables. Entrega sistemática de inteligencia operativa y protocolos de acción específicos. Cada reporte es un documento de ingeniería que dicta el siguiente paso para ganar cuota de mercado.' },
        { id: 'a8', name: 'Blindaje Técnico y Estabilidad All—Time', action: 'Paz mental operativa. Una infraestructura blindada, segura y disponible "All—Time". Gestión de la seguridad, actualizaciones y estabilidad del ecosistema digital. El protocolo garantiza que la tienda sea un activo de alta disponibilidad.' },
    ];

    const handleApolloActionsExpand = () => {
        if (apolloActionsCardRef.current) {
            const rect = apolloActionsCardRef.current.getBoundingClientRect();
            setApolloActionsCardOrigin({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
        }
        setApolloActionsFeaturesVisible(false);
        setTimeout(() => setIsApolloActionsExpanded(true), 150);
    };

    const handleApolloActionsCollapse = () => {
        setIsApolloActionsExpanded(false);
        setApolloActionsFeaturesVisible(true);
        setTimeout(() => {
            setApolloActionsCardOrigin(null);
        }, 550);
    };

    // Lock body scroll when study overlay is expanded
    useEffect(() => {
        if (isUnifyStudyExpanded || isGosExpanded || isApolloChartExpanded || isApolloActionsExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isUnifyStudyExpanded, isGosExpanded, isApolloChartExpanded, isApolloActionsExpanded]);
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
        { w: 'Control', desc: 'Establecimiento de una autoridad centralizada mediante la síntesis de flujos de datos multicanal, unificando la arquitectura de análisis y decisión en un núcleo técnico único que elimina la fragmentación informativa y el sesgo operativo.' },
        { w: 'Optimización', desc: 'Perfeccionamiento dinámico de procesos y recursos críticos, permitiendo el ajuste de estrategias de negocio en tiempo real para maximizar el rendimiento operativo y eliminar cualquier fricción técnica en la cadena de valor comercial.' },
        { w: 'Escalabilidad', desc: 'Detección sistemática de vectores de expansión y apertura de mercados mediante el análisis continuo de la capacidad estructural de los activos, permitiendo la diversificación de recursos y la integración de nuevas líneas de negocio con alta eficiencia.' },
        { w: 'Crecimiento', desc: 'Activación del potencial multiplicador de la organización, impulsando el volumen de transacciones y la aceleración de ingresos a través de una ingeniería comercial diseñada para escalar los resultados de manera exponencial y predecible.' },
        { w: 'Rentabilidad', desc: 'Maximización de la capacidad empresarial para capturar valor neto, blindando la sostenibilidad financiera y superando sistemáticamente los umbrales de beneficio establecidos mediante una gestión científica del margen y el retorno operativo.' }
    ];

    const systemModules = [
        { id: 'SYS.01', t1: 'Cordyceps', t2: '', short: 'CP', img: '/Unifyprotocol.jpg', desc: 'Protocolo ontológico diseñado para descifrar el estado real y potencial de la organización, desplegando métodos científicos para codificar repositorios centralizados de analítica avanzada.' },
        { id: 'SYS.02', t1: 'Unify', t2: '', short: 'DC', img: '/Unifydc.jpg', desc: 'Núcleo de unificación de datos AI—Driven con funciones de gobernanaza de decisiones para organizaciones de alto valor. Integración total con Optimus 2.0.' },
        { id: 'SYS.03', t1: 'Optimus', t2: '2.0', short: 'UA', img: '/Unifyagent3.0.jpg', desc: 'Copiloto de razonamiento avanzado, entrenado para para la explotación de activos de datos centralizados por Cordyceps. Optimus 2.0 agiliza la toma decisiones, descubriendo insights de alto valor y generando estrategias accionables en lenguaje humano.' },
        { id: 'SYS.04', t1: 'Unify', t2: 'Team', short: 'UT', img: '/Unifyteam.jpg', desc: 'Equipo de élite especializado y enfocado en garantizar la confiabilidad, eficacia y sostenibilidad de todo el ecosistema de Centhropy.' }
    ];

    const systemActions = [
        {
            level: 'NIVEL 1',
            title: 'Análisis Descriptivo',
            objective: 'Elimina la ceguera operativa y consolida el dominio en la toma de decisiones estratégica de la organización.',
            actions: [
                {
                    id: '1a',
                    name: 'Auditoría Operativa',
                    action: 'Centralización de silos (Shopify, Meta Ads, ERP, Bancos) en una única interfaz de alta fidelidad.',
                    result: 'Un "Mapa Global" en tiempo real que refleja el estado exacto del negocio.'
                },
                {
                    id: '1b',
                    name: 'Verdad Única',
                    action: 'Estandarización de métricas bajo una ontología única centralizada.',
                    result: 'Eliminación de discrepancias entre departamentos; todos operan bajo la misma cifra oficial.'
                },
                {
                    id: '1c',
                    name: 'Monitoreo de Activos',
                    action: 'Seguimiento granular de presupuestos y flujo de inventario.',
                    result: 'Visibilidad total sobre el ciclo de vida del capital invertido en tiempo real.'
                }
            ]
        },
        {
            level: 'NIVEL 2',
            title: 'Análisis Diagnóstico',
            objective: 'Descubrir razones causales del comportamiento del negocio mediante la inegniería forense de datos.',
            actions: [
                {
                    id: '2a',
                    name: 'Detección de Anomalías',
                    action: 'Identificación instantánea de desviaciones fuera de la norma (caídas de conversión, picos de costo, rupturas de stock).',
                    result: 'Alertas tempranas que señalan exactamente dónde se rompió la cadena de valor.'
                },
                {
                    id: '2b',
                    name: 'Rastreo Forense',
                    action: 'Navegación multidimensional desde el KPI global hasta la transacción individual en segundos.',
                    result: 'Identificación de la causa raíz de una pérdida o ineficiencia, minimizando suposiciones.'
                },
                {
                    id: '2c',
                    name: 'Auditoría Lógica UCoT',
                    action: 'Visualización del hilo de razonamiento que Optimus utilizó para clasificar un evento.',
                    result: 'Transparencia total sobre por qué el sistema detectó un patrón, reforzando la confianza.'
                }
            ]
        },
        {
            level: 'NIVEL 3',
            title: 'Análisis Predictivo',
            objective: 'Proyecciones estratégicas que permiten anticipar escenarios de alto impacto para la organización.',
            actions: [
                {
                    id: '3a',
                    name: 'Trayectorias de Crecimiento',
                    action: 'Inferencia de tendencias futuras basadas en modelos de Vertex AI aplicados a tu data histórica.',
                    result: 'Proyecciones de ingresos y demanda con un alto nivel de confianza comercial.'
                },
                {
                    id: '3b',
                    name: 'Simulador de Riesgo',
                    action: 'Modelado de eventos de estrés (ej. escenario con alto CPM).',
                    result: 'Evaluación de la resiliencia del negocio ante crisis externas antes de que ocurran.'
                },
                {
                    id: '3c',
                    name: 'Insights de Oportunidades',
                    action: 'Identificación de nichos o productos con potencial de escalabilidad desaprovechado.',
                    result: 'Priorización de inversiones en áreas con la mayor probabilidad de retorno a corto plazo.'
                }
            ]
        },
        {
            level: 'NIVEL 4',
            title: 'Análisis Prescriptivo',
            objective: 'Intervención directa de Optimus 2.0 en la generación de estrategias accionables bajo filtros de seguridad y control de riesgos.',
            actions: [
                {
                    id: '4a',
                    name: 'Protocolos Directos',
                    action: 'Generación de planes de ejecución paso a paso para resolver problemas o capturar oportunidades.',
                    result: 'Reducción del tiempo de respuesta; se pasa de "analizar" a "actuar" con guía técnica.'
                },
                {
                    id: '4b',
                    name: 'Blindaje de Margen',
                    action: 'Ajuste dinámico sugerido de precios o presupuestos de pauta para proteger rentabilidad.',
                    result: 'Maximización de beneficios operativos sin requerir intervención humana constante.'
                },
                {
                    id: '4c',
                    name: 'Asignación de Capital',
                    action: 'Recomendación técnica de dónde mover presupuesto para optimizar el crecimiento neto.',
                    result: 'Eficiencia máxima, asegurando que cada dólar se coloque con impacto.'
                }
            ]
        }
    ];

    const [expandedActionId, setExpandedActionId] = useState(null);
    const solutionsMobileData = [
        {
            id: 'SERV.01',
            title: 'Unify Data Center',
            short: 'UDC',
            tagline: 'Plataforma de análisis avanzado para decisiones.',
            desc: 'Centro de análisis y unificación de datos para la toma de decisiones estratégicas, impulsado por AI-Data de última generación. Interfaz dirigida a CEOs y CFOs.',
            metrics: [
                { value: '2.3X', desc: 'Las empresas con análisis unificado toman decisiones estratégicas 2.3 veces más rápido.' },
                { value: '645%', desc: 'De ROI reportado debido al aumento en ingresos según Nucleus Research.' }
            ],
            features: ['Insights de Crecimiento', 'Diagnóstico de Fugas', 'Generación de Estrategias'],
            actionsTitle: "Sistema Operativo de Crecimiento — GOS",
            actions: [
                { id: '1a', name: 'Auditoría Operativa', action: 'Centralización de silos en una única interfaz de alta fidelidad.' },
                { id: '1b', name: 'Verdad Única', action: 'Estandarización de métricas bajo una ontología única centralizada.' },
                { id: '2a', name: 'Modelado Predictivo', action: 'Detección proactiva de anomalías y fugas de capital ocultas en el entorno.' },
                { id: '3a', name: 'Optimus 2.0', action: 'Agente avanzado para consulta de datos y exploración técnica.' }
            ]
        },
        {
            id: 'SERV.02',
            title: 'Apollo Protocol',
            short: 'AP',
            tagline: 'Solución de eCommerce inteligente para rentabilidad.',
            desc: 'Infraestructura de eCommerce diseñada para blindar la conversión y optimizar el crecimiento. Ejecución gestionada bajo la gobernanza técnica de Centhropy.',
            metrics: [
                { value: '20—30%', desc: 'Índice de elevación (LIFT) de rentabilidad real o incremento de captación.' },
                { value: '> 2:1', desc: 'Garantía de ratio: cada dólar invertido en pauta genera al menos el doble.' }
            ],
            features: ['Integración Total de Unify', 'Desarrollo & Operación', 'Investigación & Estrategia'],
            actionsTitle: "Solución Integral Gestionada",
            actions: [
                { id: 'p1', name: 'Unify Ingestion', action: 'Implementación del ecosistema para recolección absoluta de datos y unificación del Business Manager, Shopify y pasarelas.' },
                { id: 'p2', name: 'Liquidación de Inventario', action: 'Liquidación acelerada aplicando análisis predictivo para despachar stock viejo sin castigar la rentabilidad en masa.' },
                { id: 'p3', name: 'Conversion Rate', action: 'Reestructuración técnica de embudos UI/UX en la tienda para potenciar porcentajes de conversión orgánica y pagada.' },
                { id: 'p4', name: 'Escalamiento Agresivo', action: 'Configuración y despliegue del presupuesto con modelado multi-touch de atribución garantizando el LTV a 30 días.' }
            ]
        }
    ];



    return (
        <div className="font-funnel no-select w-full bg-white dark:bg-[#1B2136] text-[#222944] dark:text-[#BCC5DC] min-h-screen relative">
            {/* CANVAS LAYER */}
            <SphereCanvasMobile probeDataRef={probeDataRef} hudRef={hudRef} />

            {/* HEADER */}
            <Navbar />

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
                <div className="animate-ping absolute inset-0 rounded-full border border-[#222944]/20 dark:border-[#BCC5DC]/20" />
                <div className="absolute rounded-full border border-[#222944]/15 dark:border-[#BCC5DC]/15" style={{ inset: 10 }} />
                <div className="absolute w-2 h-2 rounded-full bg-[#222944] dark:bg-[#BCC5DC] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-white dark:border-[#222944]" />
            </div>

            {/* HERO SPACER */}
            <section className="h-screen w-full pointer-events-none relative" />

            {/* HUD / INSIGHTS PANEL */}
            <div className="fixed bottom-6 left-6 right-6 z-10 pointer-events-auto">
                <div className="w-full border-t border-[#222944]/15 dark:border-[#BCC5DC]/15 pt-5 flex flex-col gap-3">
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

                    <div className="flex flex-col font-funnel text-xs text-[#222944] dark:text-[#BCC5DC]">
                        <div className="flex justify-between border-b border-transparent py-2">
                            <span className="text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest font-bold text-[10px]">Lat. Core</span>
                            <span className="font-bold tabular-nums text-[12px]">{probeMetrics.lat}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest font-bold text-[10px]">Lon. Core</span>
                            <span className="font-bold tabular-nums text-[12px]">{probeMetrics.lon}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-0">
                        <div className="w-full h-[1.5px] bg-[#222944]/10 dark:bg-[#BCC5DC]/10 relative overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 bg-[#222944] dark:bg-[#BCC5DC] transition-all duration-300"
                                style={{ width: probeMetrics.progress }}
                            />
                        </div>
                        <div className="flex justify-between text-[9px] font-funnel uppercase font-bold text-[#222944]/30 dark:text-[#BCC5DC]/50">
                            <span className="tabular-nums tracking-widest">{probeMetrics.timer}</span>
                            <span className="tracking-widest text-[8px]">Active Stream</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="relative z-20 bg-white dark:bg-[#1B2136] pt-20 pb-24 px-6 flex flex-col gap-8">
                <div className="flex flex-col gap-6 text-center items-center w-full">
                    <h2 className="text-[8vw] min-[380px]:text-[32px] font-medium tracking-tight leading-[1.2] text-[#222944] dark:text-[#BCC5DC] text-center flex flex-col gap-0 w-full">
                        {[
                            "Soberanía analítica, dominio",
                            "de datos y toma de decisiones",
                            "potenciadas con AI—Driven"
                        ].map((line, i) => (
                            <span
                                key={i}
                                className="block will-change-transform"
                                style={{
                                    transform: `translateY(${-introInertia * (1.2 + i * 0.6)}px)`
                                }}
                            >
                                {line}
                            </span>
                        ))}
                    </h2>
                </div>

                <div className="flex justify-center mt-8">
                    <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                        <path d="M10 5L30 25L50 5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="square" strokeLinejoin="miter" className="text-[#222944] dark:text-[#BCC5DC]" />
                        <path d="M10 5L30 25L50 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" className="energy-path text-[#222944] dark:text-[#BCC5DC]" />
                    </svg>
                </div>



                {/* SECCIÓN ECOSISTEMA UNIFY */}
                <div className="flex flex-col pt-4 pb-8 -mx-6 bg-white dark:bg-[#1B2136]">
                    {systemModules.map((comp, idx) => (
                        <div key={idx} className={`flex flex-col py-10 px-6 ${idx !== systemModules.length - 1 ? 'border-b border-[#222944]/5 dark:border-[#BCC5DC]/5' : ''}`}>
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-[60px] font-normal text-[#222944] dark:text-[#BCC5DC] tracking-tighter leading-none whitespace-nowrap">
                                    {comp.t1}{comp.t2 ? ` ${comp.t2}` : ''}
                                </h3>
                                <span className="text-[14px] font-light text-[#222944]/40 dark:text-[#BCC5DC]/50 pt-3">
                                    /0.{idx + 1}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[17px] font-light text-[#222944]/70 dark:text-[#BCC5DC]/70 leading-relaxed tracking-tight">
                                    {comp.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SECCIÓN SOLUCIONES */}
                <div className="flex flex-col pt-20 pb-12 -mx-6 bg-white dark:bg-[#1B2136]">
                    <div className="flex flex-col px-6">
                        <div className="w-full h-[1px] bg-[#222944]/15 dark:bg-[#BCC5DC]/15 mb-2" />
                    </div>
                    <div className="flex flex-col">
                        {solutionsMobileData.map((sol, idx) => (
                            <div key={idx} className="flex flex-col pt-10 pb-16 px-6 border-b border-[#222944]/5 dark:border-[#BCC5DC]/5 last:border-b-0 border-t-0 border-x-0">

                                {/* 1. Full Bleed Title & Tagline */}
                                <div className="mb-8">
                                    <h3 className="text-[44px] font-light text-[#222944] dark:text-[#BCC5DC] tracking-tighter leading-[1.0] mb-4">
                                        {sol.title}
                                    </h3>

                                </div>

                                {/* 2. Exact Desktop Social Proof */}
                                <div className="flex flex-row items-center gap-6 mb-8">
                                    <div className="flex -space-x-4">
                                        <div className="w-12 h-12 rounded-full border-[1px] border-[#222944]/30 dark:border-[#BCC5DC]/30 relative z-0 flex items-center justify-center p-1">
                                            <div className="w-full h-full rounded-full border-[1px] border-[#222944]/40 dark:border-[#BCC5DC]/40 pattern-concentric" />
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-[#222944]/5 dark:bg-[#BCC5DC]/5 relative z-10 border border-white dark:border-[#1B2136] backdrop-blur-sm" />
                                        <div className="w-12 h-12 rounded-full bg-[#222944] dark:bg-[#BCC5DC] flex items-center justify-center relative z-20 border-2 border-white dark:border-[#1B2136] shadow-md">
                                            <ArrowRight strokeWidth={2} className="w-4 h-4 text-white dark:text-[#222944] -rotate-45" />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-5 items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[28px] font-light tracking-tighter text-[#222944] dark:text-[#BCC5DC] leading-none mb-0.5">
                                                {idx === 0 ? '+750' : '+450'}
                                            </span>
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-[#222944]/40 dark:text-[#BCC5DC]/40">
                                                CONECTORES
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[28px] font-light tracking-tighter text-[#222944] dark:text-[#BCC5DC] leading-none mb-0.5">
                                                {idx === 0 ? '1645' : '98%'}
                                            </span>
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-[#222944]/40 dark:text-[#BCC5DC]/40">
                                                Data Points
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Contextual Details */}
                                <div className="mb-10 w-full sm:w-[85%] pr-4">
                                    <p className="text-[17px] font-light leading-relaxed text-[#222944]/70 dark:text-[#BCC5DC]/70">
                                        {sol.desc}
                                    </p>
                                </div>

                                {/* 4. Full-Bleed Bento Cards (Desktop Replica) */}
                                <div className="flex flex-col mt-4 gap-[2px]">
                                    {idx === 0 ? (
                                        <>
                                            {/* Tarjeta B: Statistics (TOP for Unify) — Stretch-to-fullscreen */}

                                            {/* Collapsed card — always in DOM, hidden via visibility when overlay is active */}
                                            <div
                                                ref={unifyCardRef}
                                                className="bg-[#F3F5F7] dark:bg-[#303A5F] p-6 flex flex-col overflow-hidden relative -mx-6 h-[460px]"
                                                style={{ visibility: isUnifyStudyExpanded ? 'hidden' : 'visible' }}
                                            >
                                                <button onClick={handleUnifyChartExpand} className="absolute top-5 right-5 group cursor-pointer pointer-events-auto z-10">
                                                    <ArrowUpRight strokeWidth={1} className="w-6 h-6 text-[#222944] dark:text-[#BCC5DC] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                                                </button>
                                                <motion.div className="mb-6 mt-1" animate={{ opacity: showUnifyBars ? 1 : 0, y: showUnifyBars ? 0 : -12 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: showUnifyBars ? (isCollapseReturn ? 0.1 : 0.15) : 0 }}>
                                                    <span className="text-[36px] font-light tracking-tight text-[#222944] dark:text-[#BCC5DC] leading-[1.1] block">
                                                        +23—30% <br />
                                                        en Ingresos
                                                    </span>
                                                </motion.div>
                                                <div className="flex-1 flex gap-1.5 items-end min-h-0 relative">
                                                    {[
                                                        { top: 30, bottom: 9, v: '45%' },
                                                        { top: 34, bottom: 10, v: '52%' },
                                                        { top: 43, bottom: 13, v: '68%' },
                                                        { top: 38, bottom: 12, v: '62%' },
                                                        { top: 55, bottom: 13, v: '78%' },
                                                        { top: 49, bottom: 15, v: '72%' },
                                                        { top: 60, bottom: 13, v: '85%' },
                                                        { top: 53, bottom: 12, v: '76%' },
                                                        { top: 64, bottom: 13, v: '90%' },
                                                        { top: 56, bottom: 14, v: '88%' },
                                                        { top: 70, bottom: 12, v: '96%' },
                                                        { top: 68, bottom: 15, v: '95%' },
                                                    ].map((d, i) => (
                                                        <div key={i} className="flex-1 flex flex-col h-full">
                                                            <div className="flex-1 w-full relative flex flex-col justify-end">
                                                                <motion.span
                                                                    className="absolute left-1/2 -translate-x-1/2 text-[8px] font-medium text-[#222944]/45 dark:text-[#BCC5DC]/80 whitespace-nowrap"
                                                                    style={{ bottom: `calc(${d.top + d.bottom}% + 8px)` }}
                                                                    animate={{ opacity: showUnifyBars ? 1 : 0, y: showUnifyBars ? 0 : 10 }}
                                                                    transition={{ duration: 0.3, delay: showUnifyBars ? (isCollapseReturn ? 0.35 + i * 0.025 : 0.8 + i * 0.04) : (11 - i) * 0.015, ease: [0.34, 1.56, 0.64, 1] }}
                                                                >
                                                                    {d.v}
                                                                </motion.span>
                                                                <motion.div
                                                                    className="w-full bg-[#30385F]/20 dark:bg-[#BCC5DC]/[0.18]"
                                                                    animate={{ height: showUnifyBars ? `${d.bottom}%` : '0%' }}
                                                                    transition={{ duration: 0.32, delay: showUnifyBars ? (isCollapseReturn ? 0.15 + i * 0.025 : 0.4 + i * 0.04) : (11 - i) * 0.015, ease: [0.25, 0.1, 0.25, 1] }}
                                                                />
                                                                <motion.div
                                                                    className="w-full bg-[#30385F]/90 dark:bg-[#BCC5DC]"
                                                                    animate={{ height: showUnifyBars ? `${d.top}%` : '0%' }}
                                                                    transition={{ duration: 0.35, delay: showUnifyBars ? (isCollapseReturn ? 0.17 + i * 0.025 : 0.5 + i * 0.04) : (11 - i) * 0.015, ease: [0.25, 0.1, 0.25, 1] }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Expanded card — stretches from original rect to fullscreen */}
                                            <AnimatePresence>
                                                {isUnifyStudyExpanded && (
                                                    <motion.div
                                                        className="fixed z-[100] bg-[#F3F5F7] dark:bg-[#303A5F] overflow-hidden pointer-events-auto"
                                                        initial={{
                                                            top: unifyCardOrigin?.top ?? 400,
                                                            left: unifyCardOrigin?.left ?? 0,
                                                            width: unifyCardOrigin?.width ?? '100%',
                                                            height: unifyCardOrigin?.height ?? 460,
                                                        }}
                                                        animate={{
                                                            top: 60,
                                                            left: 0,
                                                            width: '100vw',
                                                            height: 'calc(100dvh - 60px)',
                                                            transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] }
                                                        }}
                                                        exit={{
                                                            top: unifyCardOrigin?.top ?? 400,
                                                            left: unifyCardOrigin?.left ?? 0,
                                                            width: unifyCardOrigin?.width ?? '100%',
                                                            height: unifyCardOrigin?.height ?? 460,
                                                            transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
                                                        }}
                                                    >
                                                        <div className="w-full h-full overflow-y-auto overscroll-contain pt-14 px-6 pb-0 flex flex-col">
                                                            <div className="flex-1 flex flex-col min-h-full pb-16">
                                                            {/* Close Button */}
                                                            <motion.button
                                                                onClick={handleUnifyChartCollapse}
                                                                className="absolute top-8 right-6 group cursor-pointer z-10"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.3 } }}
                                                                exit={{ opacity: 0, transition: { duration: 0.12, delay: 0 } }}
                                                            >
                                                                <X strokeWidth={1} className="w-6 h-6 text-[#222944] dark:text-[#BCC5DC]" />
                                                            </motion.button>

                                                            {/* Headline — slide-up reveal / slide-up exit */}
                                                            <div className="mb-6 max-w-[600px]">
                                                                <div className="overflow-hidden mb-4">
                                                                    <motion.div
                                                                        initial={{ y: '110%' }}
                                                                        animate={{ y: '0%', transition: { duration: 0.45, delay: 0.2, ease: [0.76, 0, 0.24, 1] } }}
                                                                        exit={{ y: '-110%', transition: { duration: 0.22, delay: 0, ease: [0.76, 0, 0.24, 1] } }}
                                                                    >
                                                                        <span className="text-[28px] font-light tracking-tight text-[#222944] dark:text-white leading-[1.15] block">
                                                                            La unificación de datos y los sistemas AI—Data facultan a las organizaciones con ventajas medibles y escalables
                                                                        </span>
                                                                    </motion.div>
                                                                </div>

                                                                <div className="overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ y: '110%' }}
                                                                        animate={{ y: '0%', transition: { duration: 0.45, delay: 0.25, ease: [0.76, 0, 0.24, 1] } }}
                                                                        exit={{ y: '-110%', transition: { duration: 0.22, delay: 0.03, ease: [0.76, 0, 0.24, 1] } }}
                                                                    >
                                                                        <p className="text-[14px] font-light leading-[1.6] text-[#222944]/60 dark:text-white/80">
                                                                            El 87% de Retailers han logrado capturar mayores ingresos. Con el 97% del mercado global escalando su inversión técnica en IA, la prioridad en el sector es precisa: transformar el inventario y la demanda en activos predecibles para garantizar el dominio sobre el campo comercial.
                                                                        </p>
                                                                    </motion.div>
                                                                </div>
                                                            </div>

                                                            {/* Metrics Grid — 2×2 on mobile */}
                                                            <div className="grid grid-cols-2 gap-[1px] bg-[#222944]/10 dark:bg-[#BCC5DC]/10 mt-auto">
                                                                {[
                                                                    { value: '2.3X', desc: 'Las empresas con análisis unificado toman decisiones estratégicas 2.3 veces más rápido que sus competidores.' },
                                                                    { value: '24%', desc: 'Data to Insights reportó que las empresas que adoptaron AI—Data presentaron un aumento del 23% en ingresos y un 24% en beneficios.' },
                                                                    { value: '$1.4M', desc: 'Ahorro anual promedio reportado por empresas medianas que centralizan su ecosistema de datos.' },
                                                                    { value: '645%', desc: 'Estudios de Nucleus Research documentan implementaciones que alcanzan un 645% de ROI, logrando recuperar la inversión total en apenas 1.9 meses.' },
                                                                ].map((metric, i) => (
                                                                    <div key={i} className="bg-[#F3F5F7] dark:bg-[#303A5F]">
                                                                        <motion.div
                                                                            className="p-5 flex flex-col justify-start h-full"
                                                                            initial={{ y: 30, opacity: 0 }}
                                                                            animate={{ y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.32 + i * 0.06, ease: [0.76, 0, 0.24, 1] } }}
                                                                            exit={{ y: 20, opacity: 0, transition: { duration: 0.18, delay: (3 - i) * 0.025, ease: [0.4, 0, 0.2, 1] } }}
                                                                        >
                                                                            <div className="mb-3">
                                                                                <span className="text-[28px] font-light tracking-[-0.04em] text-[#222944] dark:text-white/80 leading-[1.1] block">
                                                                                    {metric.value}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-[12px] font-light leading-relaxed text-[#222944]/60 dark:text-white/80">
                                                                                {metric.desc}
                                                                            </p>
                                                                        </motion.div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Tarjeta C: Actions (BOTTOM for Unify) */}
                                            <div ref={gosCardRef} className="bg-[#F3F5F7] dark:bg-[#303A5F] p-6 lg:p-8 flex flex-col justify-between overflow-hidden relative -mx-6 h-[280px]">
                                                <button onClick={handleGosExpand} className="absolute top-5 right-5 group cursor-pointer pointer-events-auto z-10 text-[#222944] dark:text-[#BCC5DC]">
                                                    <ArrowUpRight strokeWidth={1} className="w-6 h-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                                                </button>
                                                <motion.div animate={{ opacity: gosFeaturesVisible ? 1 : 0, y: gosFeaturesVisible ? 0 : -8 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: gosFeaturesVisible ? 0.15 : 0 }}>
                                                    <span className="text-[24px] font-normal leading-[1.2] text-[#222944] dark:text-[#BCC5DC] mb-3 block">
                                                        Sistema Operativo de <br />
                                                        Crecimiento — GOS
                                                    </span>
                                                </motion.div>
                                                <div className="flex flex-col gap-3.5 relative mb-3">
                                                    {sol.features.map((f, i) => (
                                                        <motion.div key={f} className="flex items-center gap-2.5" animate={{ x: gosFeaturesVisible ? 0 : -15, opacity: gosFeaturesVisible ? 1 : 0 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: gosFeaturesVisible ? 0.3 + i * 0.05 : (sol.features.length - 1 - i) * 0.02 }}>
                                                            <CornerDownRight className="w-4 h-4 text-[#222944]/40 dark:text-[#BCC5DC]/40" />
                                                            <span className="text-[19px] font-light text-[#222944]/70 dark:text-[#BCC5DC]/70 leading-none">
                                                                {f}
                                                            </span>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                <AnimatePresence>
                                                    {isGosExpanded && (
                                                        <motion.div
                                                            className="fixed z-[100] bg-[#F3F5F7] dark:bg-[#303A5F] overflow-hidden pointer-events-auto"
                                                            initial={{
                                                                top: gosCardOrigin?.top ?? 400,
                                                                left: gosCardOrigin?.left ?? 0,
                                                                width: gosCardOrigin?.width ?? '100%',
                                                                height: gosCardOrigin?.height ?? 280,
                                                            }}
                                                            animate={{
                                                                top: 60,
                                                                left: 0,
                                                                width: '100vw',
                                                                height: 'calc(100dvh - 60px)',
                                                                transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] }
                                                            }}
                                                            exit={{
                                                                top: gosCardOrigin?.top ?? 400,
                                                                left: gosCardOrigin?.left ?? 0,
                                                                width: gosCardOrigin?.width ?? '100%',
                                                                height: gosCardOrigin?.height ?? 280,
                                                                opacity: 0,
                                                                transition: { duration: 0.4, delay: 0.12, ease: [0.76, 0, 0.24, 1] }
                                                            }}
                                                        >
                                                            <div className="w-full h-full overflow-y-auto overscroll-contain pt-14 px-6 pb-16">
                                                                <motion.button
                                                                    onClick={handleGosCollapse}
                                                                    className="absolute top-8 right-6 group cursor-pointer z-10"
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.3 } }}
                                                                    exit={{ opacity: 0, transition: { duration: 0.12, delay: 0 } }}
                                                                >
                                                                    <X strokeWidth={1} className="w-6 h-6 text-[#222944] dark:text-[#BCC5DC]" />
                                                                </motion.button>

                                                                <div className="mb-10 max-w-[600px]">
                                                                    <div className="overflow-hidden mb-2">
                                                                        <motion.div
                                                                            initial={{ y: '110%' }}
                                                                            animate={{ y: '0%', transition: { duration: 0.45, delay: 0.2, ease: [0.76, 0, 0.24, 1] } }}
                                                                            exit={{ y: '-110%', transition: { duration: 0.22, delay: 0, ease: [0.76, 0, 0.24, 1] } }}
                                                                        >
                                                                            <span className="text-[28px] font-normal tracking-tight text-[#222944] dark:text-white leading-[1.15] block">
                                                                                Unify: Sistema Operativo <br />
                                                                                de Crecimiento — GOS
                                                                            </span>
                                                                        </motion.div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col gap-8">
                                                                    {systemActions.map((level, i) => (
                                                                        <motion.div
                                                                            key={i}
                                                                            className="border-t border-[#222944]/10 dark:border-[#BCC5DC]/10 pt-6"
                                                                            initial={{ y: 30, opacity: 0 }}
                                                                            animate={{ y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.32 + i * 0.06, ease: [0.76, 0, 0.24, 1] } }}
                                                                            exit={{ y: 20, opacity: 0, transition: { duration: 0.18, delay: (systemActions.length - 1 - i) * 0.025, ease: [0.4, 0, 0.2, 1] } }}
                                                                        >
                                                                            <div className="mb-4">
                                                                                <span className="text-[20px] font-normal text-[#222944] dark:text-white block mb-2">
                                                                                    {level.title}
                                                                                </span>
                                                                                <p className="text-[14px] font-light leading-relaxed text-[#222944]/70 dark:text-white/80">
                                                                                    {level.objective}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex flex-col gap-4">
                                                                                {level.actions.map((action, j) => {
                                                                                    const isExpanded = expandedActionId === action.id;
                                                                                    return (
                                                                                        <div
                                                                                            key={j}
                                                                                            className="bg-[#222944]/5 dark:bg-[#3E4B7A] flex flex-col cursor-pointer transition-colors"
                                                                                            onClick={() => setExpandedActionId(isExpanded ? null : action.id)}
                                                                                        >
                                                                                            <div className="px-4 py-4 flex items-center justify-between">
                                                                                                <span className="text-[15px] font-medium text-[#222944] dark:text-white">
                                                                                                    {action.name}
                                                                                                </span>
                                                                                                <div className="text-[#222944]/40 dark:text-[#BCC5DC]/40">
                                                                                                    {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                                                                </div>
                                                                                            </div>
                                                                                            <AnimatePresence initial={false}>
                                                                                                {isExpanded && (
                                                                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden">
                                                                                                        <div className="px-4 pb-4 flex flex-col gap-2">
                                                                                                            <p className="text-[13px] font-light leading-relaxed text-[#222944]/80 dark:text-white/90">
                                                                                                                {action.action}
                                                                                                            </p>
                                                                                                            <div className="mt-1 pt-2 border-t border-[#222944]/10 dark:border-white/10">
                                                                                                                <span className="text-[12px] font-light text-[#222944]/70 dark:text-white/80">
                                                                                                                    <span className="font-medium mr-1 text-[#222944] dark:text-white">Resultado:</span>{action.result}
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </motion.div>
                                                                                                )}
                                                                                            </AnimatePresence>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </motion.div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Tarjeta B: Statistics (TOP for Apollo) — Stretch-to-fullscreen */}

                                            {/* Collapsed card — always in DOM, hidden via visibility when overlay is active */}
                                            <div
                                                ref={apolloCardRef}
                                                className="bg-[#F3F5F7] dark:bg-[#303A5F] p-6 flex flex-col overflow-hidden relative -mx-6 h-[460px]"
                                                style={{ visibility: isApolloChartExpanded ? 'hidden' : 'visible' }}
                                            >
                                                <button onClick={handleApolloChartExpand} className="absolute top-5 right-5 group cursor-pointer pointer-events-auto z-10">
                                                    <ArrowUpRight strokeWidth={1} className="w-6 h-6 text-[#222944] dark:text-[#BCC5DC] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                                                </button>
                                                <motion.div className="mb-6 mt-1" animate={{ opacity: showApolloDots ? 1 : 0, y: showApolloDots ? 0 : -12 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: showApolloDots ? (isApolloCollapseReturn ? 0.1 : 0.15) : 0 }}>
                                                    <span className="text-[36px] font-light tracking-tight text-[#222944] dark:text-[#BCC5DC] leading-[1.1] block">
                                                        18—20% de <br />
                                                        Crecimiento
                                                    </span>
                                                </motion.div>
                                                <div className="flex-1 w-full relative flex flex-col min-h-0 mt-2">
                                                    <div className="flex-1 relative w-full h-full">
                                                        <div className="absolute inset-0 flex gap-[3px] items-end w-full h-full pb-2">
                                                            {[9, 9, 10, 10, 11, 11, 11, 10, 10, 10, 9, 9, 9, 9, 9, 10, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 19, 19, 20].map((activeDots, colIndex) => (
                                                                <div key={colIndex} className="flex-1 flex flex-col-reverse justify-start gap-[2px] items-center">
                                                                    {[...Array(20)].map((_, rowIndex) => {
                                                                        const isActive = rowIndex < activeDots;
                                                                        const totalCols = 36;
                                                                        // Entry on first load: columns left→right, dots bottom→top
                                                                        // Entry on collapse-return: visible stagger so user sees construction
                                                                        const entryDelay = isApolloCollapseReturn
                                                                            ? 0.05 + (colIndex * 0.025) + (rowIndex * 0.015)
                                                                            : 0.2 + (colIndex * 0.02) + (rowIndex * 0.012);
                                                                        // Exit: columns right→left, dots top→bottom — visible dissolve
                                                                        const exitDelay = (totalCols - 1 - colIndex) * 0.015 + (activeDots - 1 - Math.min(rowIndex, activeDots - 1)) * 0.008;
                                                                        return (
                                                                            <motion.div
                                                                                key={rowIndex}
                                                                                className={`w-full aspect-square rounded-none ${isActive ? 'bg-[#30385F]/90 dark:bg-[#BCC5DC]' : 'bg-transparent'}`}
                                                                                initial={{ opacity: 0 }}
                                                                                animate={{ opacity: showApolloDots ? 1 : 0 }}
                                                                                transition={{ duration: 0.15, delay: showApolloDots ? entryDelay : exitDelay, ease: 'easeOut' }}
                                                                            />
                                                                        );
                                                                    })}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded card — stretches from original rect to fullscreen */}
                                            <AnimatePresence>
                                                {isApolloChartExpanded && (
                                                    <motion.div
                                                        className="fixed z-[100] bg-[#F3F5F7] dark:bg-[#303A5F] overflow-hidden pointer-events-auto"
                                                        initial={{
                                                            top: apolloCardOrigin?.top ?? 400,
                                                            left: apolloCardOrigin?.left ?? 0,
                                                            width: apolloCardOrigin?.width ?? '100%',
                                                            height: apolloCardOrigin?.height ?? 460,
                                                        }}
                                                        animate={{
                                                            top: 60,
                                                            left: 0,
                                                            width: '100vw',
                                                            height: 'calc(100dvh - 60px)',
                                                            transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] }
                                                        }}
                                                        exit={{
                                                            top: apolloCardOrigin?.top ?? 400,
                                                            left: apolloCardOrigin?.left ?? 0,
                                                            width: apolloCardOrigin?.width ?? '100%',
                                                            height: apolloCardOrigin?.height ?? 460,
                                                            transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
                                                        }}
                                                    >
                                                        <div ref={apolloScrollRef} className="w-full h-full overflow-y-auto overscroll-contain pt-14 px-6 pb-0 flex flex-col">
                                                            <div className="flex-1 flex flex-col min-h-full pb-16">
                                                            {/* Close Button */}
                                                            <motion.button
                                                                onClick={handleApolloChartCollapse}
                                                                className="absolute top-8 right-6 group cursor-pointer z-10"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.3 } }}
                                                                exit={{ opacity: 0, transition: { duration: 0.12, delay: 0 } }}
                                                            >
                                                                <X strokeWidth={1} className="w-6 h-6 text-[#222944] dark:text-[#BCC5DC]" />
                                                            </motion.button>

                                                            {/* Headline — slide-up reveal / slide-up exit */}
                                                            <div className="mb-6 max-w-[600px]">
                                                                <div className="overflow-hidden mb-4">
                                                                    <motion.div
                                                                        initial={{ y: '110%' }}
                                                                        animate={{ y: '0%', transition: { duration: 0.45, delay: 0.2, ease: [0.76, 0, 0.24, 1] } }}
                                                                        exit={{ y: '-110%', transition: { duration: 0.22, delay: 0, ease: [0.76, 0, 0.24, 1] } }}
                                                                    >
                                                                        <span className="text-[28px] font-light tracking-tight text-[#222944] dark:text-white leading-[1.15] block">
                                                                            Optimización garantizada en <br />
                                                                            métricas de crecimiento
                                                                        </span>
                                                                    </motion.div>
                                                                </div>

                                                                <div className="overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ y: '110%' }}
                                                                        animate={{ y: '0%', transition: { duration: 0.45, delay: 0.25, ease: [0.76, 0, 0.24, 1] } }}
                                                                        exit={{ y: '-110%', transition: { duration: 0.22, delay: 0.03, ease: [0.76, 0, 0.24, 1] } }}
                                                                    >
                                                                        <p className="text-[14px] font-light leading-[1.6] text-[#222944]/60 dark:text-white/80">
                                                                            Consolidamos una estructura de crecimiento que transforma la complejidad técnica en una ventaja institucional absoluta y medible, mediante la implementación de protocolos cuidadosamente diseñados. Centhropy asume la carga estratégica y operativa de Apollo Protocol para blindar la generación de resultados.
                                                                        </p>
                                                                    </motion.div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-8" />

                                                            {/* Metrics Grid — 2×2 on mobile */}
                                                            <div className="grid grid-cols-2 gap-[1px] bg-[#222944]/10 dark:bg-[#BCC5DC]/10 mt-auto">
                                                                {[
                                                                    { value: '20—30%', desc: 'Expansión directa de rentabilidad real después de inversión y costos operativos de Apollo Protocol.' },
                                                                    { value: '+40%', desc: 'Liberación de flujo de caja mediante estrategias de optimización y liquidación técnica de stock de baja rotación.' },
                                                                    { value: '+50%', desc: 'Transferencia total de inteligencia y gestión, adquiriendo mayor agilidad operativa.' },
                                                                    { value: '> 2:1', desc: 'Garantía de que cada dólar invertido en pauta genera al menos 2 veces su valor en el tiempo.' },
                                                                ].map((metric, i) => (
                                                                    <div key={i} className="bg-[#F3F5F7] dark:bg-[#303A5F]">
                                                                        <motion.div
                                                                            className="p-5 flex flex-col justify-start h-full"
                                                                            initial={{ y: 30, opacity: 0 }}
                                                                            animate={{ y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.32 + i * 0.06, ease: [0.76, 0, 0.24, 1] } }}
                                                                            exit={{ y: 20, opacity: 0, transition: { duration: 0.18, delay: (3 - i) * 0.025, ease: [0.4, 0, 0.2, 1] } }}
                                                                        >
                                                                            <div className="mb-3">
                                                                                <span className="text-[28px] font-light tracking-[-0.04em] text-[#222944] dark:text-white/80 leading-[1.1] block">
                                                                                    {metric.value}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-[12px] font-light leading-relaxed text-[#222944]/60 dark:text-white/80">
                                                                                {metric.desc}
                                                                            </p>
                                                                        </motion.div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Tarjeta C: Actions (BOTTOM for Apollo) — Expandable */}
                                            <div ref={apolloActionsCardRef} className="bg-[#F3F5F7] dark:bg-[#303A5F] p-6 lg:p-8 flex flex-col justify-between overflow-hidden relative -mx-6 h-[280px]">
                                                <button onClick={handleApolloActionsExpand} className="absolute top-5 right-5 group cursor-pointer pointer-events-auto z-10 text-[#222944] dark:text-[#BCC5DC]">
                                                    <ArrowUpRight strokeWidth={1} className="w-6 h-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                                                </button>
                                                <motion.div animate={{ opacity: apolloActionsFeaturesVisible ? 1 : 0, y: apolloActionsFeaturesVisible ? 0 : -8 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: apolloActionsFeaturesVisible ? 0.15 : 0 }}>
                                                    <span className="text-[24px] font-normal leading-[1.2] text-[#222944] dark:text-[#BCC5DC] mb-3 block">
                                                        Solución Gestionada <br />
                                                        por Centhropy
                                                    </span>
                                                </motion.div>
                                                <div className="flex flex-col gap-3.5 relative mb-3">
                                                    {sol.features.map((f, i) => (
                                                        <motion.div key={f} className="flex items-center gap-2.5" animate={{ x: apolloActionsFeaturesVisible ? 0 : -15, opacity: apolloActionsFeaturesVisible ? 1 : 0 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: apolloActionsFeaturesVisible ? 0.3 + i * 0.05 : (sol.features.length - 1 - i) * 0.02 }}>
                                                            <CornerDownRight className="w-4 h-4 text-[#222944]/40 dark:text-[#BCC5DC]/40" />
                                                            <span className="text-[19px] font-light text-[#222944]/70 dark:text-[#BCC5DC]/70 leading-none">
                                                                {f}
                                                            </span>
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                <AnimatePresence>
                                                    {isApolloActionsExpanded && (
                                                        <motion.div
                                                            className="fixed z-[100] bg-[#F3F5F7] dark:bg-[#303A5F] overflow-hidden pointer-events-auto"
                                                            initial={{
                                                                top: apolloActionsCardOrigin?.top ?? 400,
                                                                left: apolloActionsCardOrigin?.left ?? 0,
                                                                width: apolloActionsCardOrigin?.width ?? '100%',
                                                                height: apolloActionsCardOrigin?.height ?? 280,
                                                            }}
                                                            animate={{
                                                                top: 60,
                                                                left: 0,
                                                                width: '100vw',
                                                                height: 'calc(100dvh - 60px)',
                                                                transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] }
                                                            }}
                                                            exit={{
                                                                top: apolloActionsCardOrigin?.top ?? 400,
                                                                left: apolloActionsCardOrigin?.left ?? 0,
                                                                width: apolloActionsCardOrigin?.width ?? '100%',
                                                                height: apolloActionsCardOrigin?.height ?? 280,
                                                                opacity: 0,
                                                                transition: { duration: 0.4, delay: 0.12, ease: [0.76, 0, 0.24, 1] }
                                                            }}
                                                        >
                                                            <div className="w-full h-full overflow-y-auto overscroll-contain pt-14 px-6 pb-16">
                                                                <motion.button
                                                                    onClick={handleApolloActionsCollapse}
                                                                    className="absolute top-8 right-6 group cursor-pointer z-10"
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.3 } }}
                                                                    exit={{ opacity: 0, transition: { duration: 0.12, delay: 0 } }}
                                                                >
                                                                    <X strokeWidth={1} className="w-6 h-6 text-[#222944] dark:text-[#BCC5DC]" />
                                                                </motion.button>

                                                                <div className="mb-10 max-w-[600px]">
                                                                    <div className="overflow-hidden mb-2">
                                                                        <motion.div
                                                                            initial={{ y: '110%' }}
                                                                            animate={{ y: '0%', transition: { duration: 0.45, delay: 0.2, ease: [0.76, 0, 0.24, 1] } }}
                                                                            exit={{ y: '-110%', transition: { duration: 0.22, delay: 0, ease: [0.76, 0, 0.24, 1] } }}
                                                                        >
                                                                            <span className="text-[28px] font-normal tracking-tight text-[#222944] dark:text-white leading-[1.15] block">
                                                                                Solución Gestionada <br />
                                                                                por Centhropy
                                                                            </span>
                                                                        </motion.div>
                                                                    </div>
                                                                    <div className="overflow-hidden">
                                                                        <motion.div
                                                                            initial={{ y: '110%' }}
                                                                            animate={{ y: '0%', transition: { duration: 0.45, delay: 0.25, ease: [0.76, 0, 0.24, 1] } }}
                                                                            exit={{ y: '-110%', transition: { duration: 0.22, delay: 0.03, ease: [0.76, 0, 0.24, 1] } }}
                                                                        >
                                                                            <p className="text-[14px] font-light leading-[1.6] text-[#222944]/60 dark:text-white/80">
                                                                                Conectar Apollo Protocol significa desplegar una capacidad de ejecución táctica gestionada por Centhropy. Transformamos la complejidad de los datos en un vector de crecimiento garantizado, operando la infraestructura técnica para que su organización lidere con agilidad en el mercado y capture oportunidades de rentabilidad.
                                                                            </p>
                                                                        </motion.div>
                                                                    </div>
                                                                </div>

                                                                {/* Componentes y Procesos Integrados */}
                                                                <div className="mb-6">
                                                                    <motion.span
                                                                        className="text-[11px] font-bold uppercase tracking-widest text-[#222944] dark:text-[#AABBDD] block"
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.3, ease: [0.76, 0, 0.24, 1] } }}
                                                                        exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
                                                                    >
                                                                        Componentes y Procesos Integrados
                                                                    </motion.span>
                                                                </div>

                                                                <div className="flex flex-col gap-4">
                                                                    {apolloActions.map((action, i) => {
                                                                        const isExpanded = expandedActionId === action.id;
                                                                        return (
                                                                            <motion.div
                                                                                key={action.id}
                                                                                initial={{ y: 30, opacity: 0 }}
                                                                                animate={{ y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.32 + i * 0.05, ease: [0.76, 0, 0.24, 1] } }}
                                                                                exit={{ y: 20, opacity: 0, transition: { duration: 0.18, delay: (apolloActions.length - 1 - i) * 0.02, ease: [0.4, 0, 0.2, 1] } }}
                                                                            >
                                                                                <div
                                                                                    className="bg-[#222944]/5 dark:bg-[#3E4B7A] flex flex-col cursor-pointer transition-colors"
                                                                                    onClick={() => setExpandedActionId(isExpanded ? null : action.id)}
                                                                                >
                                                                                    <div className="px-4 py-4 flex items-center justify-between">
                                                                                        <span className="text-[15px] font-medium text-[#222944] dark:text-white">
                                                                                            {action.name}
                                                                                        </span>
                                                                                        <div className="text-[#222944]/40 dark:text-[#BCC5DC]/40">
                                                                                            {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                                                        </div>
                                                                                    </div>
                                                                                    <AnimatePresence initial={false}>
                                                                                        {isExpanded && (
                                                                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden">
                                                                                                <div className="px-4 pb-4 flex flex-col gap-2">
                                                                                                    <p className="text-[13px] font-light leading-relaxed text-[#222944]/80 dark:text-white/90">
                                                                                                        {action.action}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </motion.div>
                                                                                        )}
                                                                                    </AnimatePresence>
                                                                                </div>
                                                                            </motion.div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1B2136] -mx-6">
                    <OperationGlobe />
                </div>

                <div className="bg-white dark:bg-[#1B2136] -mx-6">
                    <OrganizationsCarousel />
                </div>

                <div className="bg-white dark:bg-[#1B2136] text-[#222944] dark:text-[#BCC5DC] -mx-6 px-6 pt-20 pb-20">
                    <div className="w-full h-[1px] bg-[#222944]/15 dark:bg-[#BCC5DC]/15 mb-10" />
                    <div className="flex flex-row justify-between items-center">
                        <h4 className="text-[12vw] min-[400px]:text-[45px] font-medium tracking-tighter text-[#222944] dark:text-[#BCC5DC] leading-none m-0">
                            CONECTAR
                        </h4>
                        <Link
                            to="/waitlist"
                            className="w-14 h-14 border-2 border-[#222944] dark:border-[#BCC5DC] rounded-none flex items-center justify-center group active:bg-[#222944] active:border-[#222944] active:text-white transition-all duration-300 shrink-0"
                        >
                            <ChevronRight size={28} />
                        </Link>
                    </div>
                </div>
            </main >
        </div >
    );
};

export default CenthropyMobile;
