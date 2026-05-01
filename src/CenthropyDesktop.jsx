import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Activity, ShieldCheck, Zap, Globe, Cpu, ChevronRight, ArrowRight, ArrowUpRight, CornerDownRight, X, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
// import ConnectorsSection from './components/ConnectorsSection'; // Desactivado temporalmente
import OperationGlobe from './components/OperationGlobe';
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

// ========== SCROLL-DRIVEN BENTO SOLUTIONS ==========
const solutionsData = [
    {
        id: 'SERV.01',
        title: 'Unify Data Center',
        short: 'UDC',
        tagline: 'Plataforma de análisis avanzado y unificación de datos para la toma de decisiones estratégicas.',
        desc: 'Unify DC es el núcleo donde el caos de la información, se transforma en control real para las organizaciones. Con una interfaz potenciada con AI-Data de última generación, la directiva de la empresa adquiere el poder de dirigir efectivamente.',
        features: ['Insights de Crecimiento', 'Diagnóstico de Fugas', 'Generación de Estrategias'],
        video: null
    },
    {
        id: 'SERV.02',
        title: 'Apollo Protocol',
        short: 'AP',
        tagline: 'Solución de eCommerce inteligente para maximizar conversión y optimizar la rentabilidad.',
        desc: 'Apollo Protocol es una solución de ejecución integral que Centhropy ha diseñado para la absorción, gestión y escalabilidad de canales digitales de comercio para el sector Retail / eCommerce. El protocolo establece una estructura de mando donde la ingeniería de datos, la operación comercial estratégica y la pauta de adquisición convergen en un solo ecosistema de crecimiento.',
        features: ['Integración Total de Unify', 'Desarrollo & Operación', 'Investigación & Estrategia'],
        video: null
    }
];
const SolutionCard = ({ solution, idx, scrollYProgress }) => {
    // Card 1 base = -0.04, Card 2 base = 0.32
    // These are carefully timed so animations COMPLETE before next card covers
    const base = idx === 0 ? -0.04 : 0.32;

    // Title slides from left — POSITION ONLY
    const titleX = useTransform(scrollYProgress, [base, base + 0.06], [-1500, 0]);

    // Description slides from right — POSITION ONLY
    const descX = useTransform(scrollYProgress, [base + 0.02, base + 0.08], [1500, 0]);

    // CTA button slides from right with delay
    const btnX = useTransform(scrollYProgress, [base + 0.08, base + 0.12], [300, 0]);

    // Bento cards rise from below — POSITION ONLY, staggered
    const bentoY1 = useTransform(scrollYProgress, [base + 0.04, base + 0.12], [800, 0]);
    const bentoY2 = useTransform(scrollYProgress, [base + 0.06, base + 0.14], [800, 0]);

    // BARC Study expansion state
    const [isStudyExpanded, setIsStudyExpanded] = useState(false);
    const [barsVisible, setBarsVisible] = useState(true);
    const cardARef = useRef(null);
    const bentoGridRef = useRef(null);

    // BARC study metrics data
    const barcMetrics = [
        { value: '2.3X', desc: 'Las empresas con análisis unificado toman decisiones estratégicas 2.3 veces más rápido que sus competidores.' },
        { value: '24%', desc: 'Data to Insights reportó que las empresas que adoptaron AI—Data presentaron un aumento del 23% en ingresos y un 24% en beneficios.' },
        { value: '$1.4M', desc: 'Ahorro anual promedio reportado por empresas medianas que centralizan su ecosistema de datos.' },
        { value: '645%', desc: 'Estudios de Nucleus Research documentan implementaciones que alcanzan un 645% de ROI, logrando recuperar la inversión total en apenas 1.9 meses' },
    ];

    const apolloMetricsData = [
        { value: <>20—30% <br /> Índice LIFT</>, desc: "Expansión directa de rentabilidad real después de inversión y costos operativos de Apollo Protocol." },
        { value: "+40% de Rotación", desc: "Liberación de flujo de caja mediante estrategias de optimización y liquidación técnica de stock de baja rotación." },
        { value: "+50% de Agilidad", desc: "Transferencia total de inteligencia y gestión, adquiriendo mayor agilidad operativa." },
        { value: <>Ratio <br /> &gt; 2:1</>, desc: "Garantía de que cada dólar invertido en pauta genera al menos 2 veces su valor en el tiempo." }
    ];

    const metricsToDisplay = idx === 0 ? barcMetrics : apolloMetricsData;

    const handleExpandStudy = () => {
        setBarsVisible(false);
        setTimeout(() => setIsStudyExpanded(true), 200);
    };

    const handleCollapseStudy = () => {
        setIsStudyExpanded(false);
        setBarsVisible(true);
    };

    // Actions expansion state
    const [isActionsExpanded, setIsActionsExpanded] = useState(false);
    const [featuresVisible, setFeaturesVisible] = useState(true);
    const [expandedActionId, setExpandedActionId] = useState(null);

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
            objective: 'Proyecciones estratégicas que permiten anticipar escenarios de alto impacto para la organización y sus resultados.',
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
            objective: 'Intervención directa de Optimus 2.0 en la generación de estrategias accionables con enfoque en el control de riesgo.',
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

    const apolloActions = [
        {
            level: '',
            title: 'Componentes y Procesos Integrados',
            objective: '',
            actions: [
                { 
                    id: 'a1', 
                    name: 'Unify DC Serverless', 
                    action: 'Apollo Protocol funciona con el motor análisis y decisiones (Unify DC). El procesamiento de datos en Unify DC permite detectar, en tiempo real, oportunidades de rentabilidad ocultas, alertar sobre riesgos de margen, optimización de precios e inventario y generar estrategias accionables enfocadas en el crecimiento y la expansión de resultados.', 
                    result: '' 
                },
                { id: 'a2', name: 'Canal Digital de Conversión Inteligente', action: 'El equipo técnico asignado desarrolla y gestiona en su totalidad la infraestructura eCommerce de las organizaciones. Se garantiza que cada SKU esté posicionado con precisión quirúrgica en la tienda online (descripciones de alto impacto, variantes lógicas y precios sincronizados) para transformar el tráfico en transacciones efectivas.', result: '' },
                { id: 'a3', name: 'Inventario Inteligente (Ingeniería de Liquidez)', action: 'Mediante la vigilancia continua del stock, el protocolo activa mecanismos de defensa (reposición) o de ataque (liquidación) antes de que el problema afecte el balance. Se asegura que el inventario fluya a su máxima velocidad, maximizando el retorno sobre el capital invertido en mercancía.', result: '' },
                { id: 'a4', name: 'Escalabilidad de Adquisición (Paid Media)', action: 'Ejecución de ingeniería publicitaria en Meta y Google Ads centrada en impulsar ventas y rentabilidad. El protocolo elimina el riesgo de "quema de presupuesto" mediante la optimización técnica potenciada por análisis continuos en Unify Data Center, asegurando que la expansión de la pauta sea una consecuencia directa del éxito matemático y lógico.', result: '' },
            ]
        },
        {
            level: '',
            title: 'Componentes y Procesos Integrados',
            objective: '',
            actions: [
                { id: 'a5', name: 'Maximización de Valor por Transacción', action: 'Extracción del máximo beneficio posible de cada visitante, elevando el ticket promedio de forma sistemática. Despliegue de tácticas de choque (Flash Sales, Bundles inteligentes y Recuperación de Carritos) que fuerzan la conversión en momentos críticos. El protocolo no solo atrae clientes; implementa la lógica necesaria para que cada cliente compre más y con mayor frecuencia.', result: '' },
                { id: 'a6', name: 'Dominio Estratégico y Verdad Matemática', action: 'Certeza absoluta en la toma de decisiones y eliminación total de las "suposiciones" en el centro de mando. Procesamiento de datos a través del núcleo Unify para detectar oportunidades de rentabilidad ocultas y alertar sobre riesgos de margen en tiempo real. Se entrega el control total sobre los márgenes por producto, asegurando que el negocio crezca sobre cimientos financieros sólidos.', result: '' },
                { id: 'a7', name: 'Sistematización, Control y Transparencia', action: 'Roadmaps enfocados hacia el dominio del mercado, con planes de acción ejecutables. Entrega sistemática de inteligencia operativa y protocolos de acción específicos. Cada reporte es un documento de ingeniería que dicta el siguiente paso para ganar cuota de mercado, eliminando la parálisis por análisis.', result: '' },
                { id: 'a8', name: 'Blindaje Técnico y Estabilidad All—Time', action: 'Paz mental operativa. Una infraestructura blindada, segura y disponible "All—Time". Gestión de la seguridad, actualizaciones y estabilidad del ecosistema digital. El protocolo garantiza que la tienda sea un activo de alta disponibilidad, eliminando cualquier punto de fallo técnico que pueda comprometer la integridad de la marca o el flujo de ingresos.', result: '' },
            ]
        }
    ];

    const actionsToDisplay = idx === 0 ? systemActions : apolloActions;

    const handleExpandActions = () => {
        setFeaturesVisible(false);
        setTimeout(() => setIsActionsExpanded(true), 200);
    };

    const handleCollapseActions = () => {
        setIsActionsExpanded(false);
        setFeaturesVisible(true);
        setTimeout(() => {
            setExpandedActionId(null);
        }, 400);
    };

    return (
        <div
            className={`sticky top-0 h-screen w-full bg-white dark:bg-[#1B2136] overflow-hidden flex flex-col pt-0 pointer-events-auto`}
            style={{ zIndex: (idx + 1) * 10 }}
        >
            <div className="h-full flex flex-col w-full pt-28 pb-0">
                
                {/* 1. ZONA SUPERIOR - (Macro-Header) */}
                <div className="max-w-[1800px] mx-auto w-full px-10 shrink-0">
                    <div className="grid grid-cols-12 gap-8 md:gap-10 items-center mb-6 lg:mb-10 w-full">
                    
                    {/* Título Comercial */}
                    <motion.div style={{ x: titleX }} className="col-span-12 xl:col-span-5 flex flex-col">
                        <div className="text-[34px] lg:text-[50px] font-light tracking-tighter leading-[1.05] text-[#222944] dark:text-[#BCC5DC] pr-4">
                            <span className="font-normal">{solution.title}</span>
                        </div>
                    </motion.div>
                    
                    {/* Social Proof + Tagline Cluster */}
                    <motion.div style={{ x: descX }} className="col-span-12 xl:col-span-7 flex flex-row items-stretch gap-8 pl-0 xl:pl-4 py-2">
                        
                        {/* Bloque de Social Proof (Métricas + Gráfico) */}
                        <div className="flex items-center gap-6 border-r border-[#222944]/15 dark:border-[#BCC5DC]/15 pr-8 shrink-0">
                             {/* Gráfico de círculos superpuestos */}
                             <div className="flex -space-x-4">
                                 <div className="w-12 h-12 rounded-full border-[1px] border-[#222944]/30 dark:border-[#BCC5DC]/30 relative z-0 flex items-center justify-center p-1">
                                     <div className="w-full h-full rounded-full border-[1px] border-[#222944]/40 dark:border-[#BCC5DC]/40 pattern-concentric" />
                                 </div>
                                 <div className="w-12 h-12 rounded-full bg-[#222944]/5 dark:bg-[#BCC5DC]/5 relative z-10 border border-white dark:border-[#1B2136] backdrop-blur-sm" />
                                 <div className="w-12 h-12 rounded-full bg-[#222944] dark:bg-[#BCC5DC] flex items-center justify-center relative z-20 border-2 border-white dark:border-[#1B2136] shadow-md">
                                     <ArrowRight className="w-4 h-4 text-white dark:text-[#222944] -rotate-45" />
                                 </div>
                             </div>
                             
                             {/* Métricas */}
                             <div className="flex flex-row gap-5">
                                 <div className="flex flex-col">
                                     <span className="text-[32px] font-medium tracking-tighter text-[#222944] dark:text-[#BCC5DC] leading-none mb-1">
                                         {idx === 0 ? '+750' : '+450'}
                                     </span>
                                     <span className="text-[9px] font-bold tracking-widest text-[#222944]/40 dark:text-[#BCC5DC]/40">
                                         CONECTORES
                                     </span>
                                 </div>
                                 <div className="flex flex-col">
                                     <span className="text-[32px] font-medium tracking-tighter text-[#222944] dark:text-[#BCC5DC] leading-none mb-1">
                                         {idx === 0 ? '1645' : '98%'}
                                     </span>
                                     <span className="text-[9px] font-bold uppercase tracking-widest text-[#222944]/40 dark:text-[#BCC5DC]/40">
                                         Data Points
                                     </span>
                                 </div>
                             </div>
                        </div>

                        {/* Descripción (Caja más estrecha) */}
                        <div className="flex-1 max-w-[400px] flex items-center">
                            <p className="text-[13px] lg:text-[14px] font-light text-[#222944]/70 dark:text-[#BCC5DC]/70 leading-relaxed">
                                {idx === 0 
                                    ? "Centro de análisis avanzado y unificación de datos para la toma de decisiones estratégicas, impulsado por AI-Data de última generación. Interfaz dirigida a CEOs y CFOs." 
                                    : "Infraestructura de eCommerce diseñada para blindar la conversión y optimizar el crecimiento. Ejecución gestionada bajo la gobernanza técnica de Centhropy."}
                            </p>
                        </div>
                    </motion.div>
                </div>
                </div>

                {/* 2. BENTO GRID INFERIOR (Sub-Sistema) */}
                <div ref={bentoGridRef} className="flex-1 w-full grid grid-cols-12 min-h-0 pb-0 bg-white dark:bg-[#1B2136] relative">
                    
                    {/* LA ZONA IZQUIERDA (Info Cards - 5 Columns) */}
                    <motion.div style={{ y: bentoY1, gridTemplateRows: idx === 0 ? '1.2fr 0.8fr' : '0.8fr 1.2fr' }} className="col-span-12 lg:col-span-5 grid grid-cols-2 h-full bg-white dark:bg-[#1B2136] border-r-[2px] border-white dark:border-[#1B2136]">
                        
                          {/* Tarjeta A: Contexto/Hero Vertical (col-span-1 de la sub-grilla) */}
                          <div ref={cardARef} className="bg-[#F3F5F7] dark:bg-[#303A5F] p-8 flex flex-col justify-between col-span-1 row-span-2 relative z-20 border-r-[2px] border-white dark:border-[#1B2136]">
                               <div>
                                  <span className="text-[20px] font-normal leading-[1.2] text-[#222944] dark:text-[#BCC5DC] mb-8 block">
                                     {idx === 0 ? (
                                         <>
                                             Centralización <br />
                                             AI—Data y Ontología <br />
                                             de Negocio Avanzada.
                                         </>
                                     ) : (
                                         <>
                                             Crecimiento Accionable <br />
                                             Impulsado por el Enfoque <br />
                                             Data Driven Growth
                                         </>
                                     )}
                                  </span>
                                  <div className="w-12 h-[1.5px] bg-[#222944] dark:bg-[#BCC5DC] mb-8" />
                                  <p className="text-[13px] font-light leading-relaxed text-[#222944]/80 dark:text-[#BCC5DC]/90">
                                      {solution.desc}
                                  </p>
                               </div>

                               <Link to="/waitlist" className="group flex items-center gap-2 mt-8 pointer-events-auto">
                                   <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#222944]/80 dark:text-[#BCC5DC]/80 group-hover:text-[#222944] dark:group-hover:text-white transition-colors">
                                       Conectar
                                   </span>
                                   <ArrowRight className="w-4 h-4 text-[#222944] dark:text-[#BCC5DC] group-hover:translate-x-1 group-hover:text-[#222944] dark:group-hover:text-white transition-all duration-300" />
                               </Link>
                          </div>

                        {/* Tarjetas B y C con orden condicional */}
                        {idx === 0 ? (
                            <>
                                {/* Tarjeta B: Statistics (TOP for Unify) */}
                                <div className="bg-[#F3F5F7] dark:bg-[#303A5F] p-6 lg:p-8 flex flex-col col-span-1 row-span-1 overflow-hidden relative border-b-[2px] border-white dark:border-[#1B2136]">
                                    <button onClick={handleExpandStudy} className="absolute top-5 right-5 lg:top-7 lg:right-7 group cursor-pointer pointer-events-auto z-10">
                                        <ArrowUpRight strokeWidth={1} className="w-6 h-6 text-[#222944] dark:text-[#BCC5DC] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                                    </button>
                                    <motion.div className="mb-6 mt-1" animate={{ opacity: barsVisible ? 1 : 0, y: barsVisible ? 0 : -8 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: barsVisible ? 0.15 : 0 }}>
                                        <span className="text-[28px] lg:text-[34px] font-light tracking-tight text-[#222944] dark:text-[#BCC5DC] leading-none">
                                            +23% en Ingresos
                                        </span>
                                    </motion.div>
                                    <div className="flex-1 flex gap-2 items-end min-h-0">
                                        {[
                                            { m: 'ENE', top: 50, bottom: 15, v: '68%' },
                                            { m: 'FEB', top: 70, bottom: 15, v: '76%' },
                                            { m: 'MAR', top: 58, bottom: 18, v: '82%' },
                                            { m: 'ABR', top: 62, bottom: 14, v: '91%' },
                                            { m: 'MAY', top: 66, bottom: 16, v: '88%' },
                                            { m: 'JUN', top: 80, bottom: 18, v: '95%' },
                                        ].map((d, i) => (
                                            <motion.div key={i} className="flex-1 flex flex-col h-full group cursor-pointer" whileHover={barsVisible ? { y: -5 } : {}} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                                                <div className="flex-1 w-full relative flex flex-col justify-end">
                                                    <motion.span className="absolute left-1/2 -translate-x-1/2 text-[8px] font-semibold text-[#222944]/45 dark:text-[#BCC5DC]/80 transition-colors group-hover:text-[#222944] dark:group-hover:text-[#BCC5DC] whitespace-nowrap" style={{ bottom: `calc(${d.top + d.bottom}% + 6px)` }} animate={{ opacity: barsVisible ? 1 : 0, y: barsVisible ? 0 : 10 }} transition={{ duration: 0.3, delay: barsVisible ? 0.85 + i * 0.06 : (5 - i) * 0.02, ease: [0.34, 1.56, 0.64, 1] }}>{d.v}</motion.span>
                                                    <motion.div className="w-full bg-[#30385F]/20 dark:bg-[#BCC5DC]/[0.18] group-hover:bg-[#30385F]/30 dark:group-hover:bg-[#BCC5DC]/[0.25] transition-colors" animate={{ height: barsVisible ? `${d.bottom}%` : '0%' }} transition={{ duration: 0.3, delay: barsVisible ? 0.4 + i * 0.06 : (5 - i) * 0.02, ease: [0.25, 0.1, 0.25, 1] }} />
                                                    <motion.div className="w-full bg-[#30385F]/90 dark:bg-[#BCC5DC] group-hover:bg-[#30385F] dark:group-hover:bg-[#BCC5DC]/90 transition-colors" animate={{ height: barsVisible ? `${d.top}%` : '0%' }} transition={{ duration: 0.35, delay: barsVisible ? 0.5 + i * 0.06 : (5 - i) * 0.02, ease: [0.25, 0.1, 0.25, 1] }} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tarjeta C: Actions (BOTTOM for Unify) */}
                                <div className="bg-[#F3F5F7] dark:bg-[#303A5F] p-6 lg:p-8 flex flex-col justify-between col-span-1 row-span-1 relative overflow-hidden">
                                    <button onClick={handleExpandActions} className="absolute top-5 right-5 lg:top-7 lg:right-7 group cursor-pointer pointer-events-auto z-10">
                                        <ArrowUpRight strokeWidth={1} className="w-6 h-6 text-[#222944] dark:text-[#BCC5DC] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                                    </button>
                                    <motion.div animate={{ opacity: featuresVisible ? 1 : 0, y: featuresVisible ? 0 : -8 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: featuresVisible ? 0.15 : 0 }}>
                                        <span className="text-[20px] font-normal leading-[1.2] text-[#222944] dark:text-[#BCC5DC] mb-6 block">
                                            Sistema Operativo de <br />
                                            Crecimiento — GOS
                                        </span>
                                    </motion.div>
                                    <div className="flex flex-col gap-3.5 relative">
                                        {solution.features.map((f, i) => (
                                            <motion.div key={f} className="flex items-center gap-2.5 group cursor-pointer" animate={{ x: featuresVisible ? 0 : -15, opacity: featuresVisible ? 1 : 0 }} whileHover={featuresVisible ? { x: 6 } : {}} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: featuresVisible ? 0.3 + i * 0.05 : (solution.features.length - 1 - i) * 0.02 }}>
                                                <CornerDownRight className="w-4 h-4 text-[#222944]/40 dark:text-[#BCC5DC]/40 group-hover:text-[#222944] dark:group-hover:text-[#BCC5DC] transition-colors" />
                                                <span className="text-[16px] font-normal text-[#222944]/70 dark:text-[#BCC5DC]/70 group-hover:text-[#222944] dark:group-hover:text-[#BCC5DC] transition-colors leading-none">
                                                    {f}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Tarjeta C: Actions (TOP for Apollo) */}
                                <div className="bg-[#F3F5F7] dark:bg-[#303A5F] p-6 lg:p-8 flex flex-col justify-between col-span-1 row-span-1 relative overflow-hidden border-b-[2px] border-white dark:border-[#1B2136]">
                                    <button onClick={handleExpandActions} className="absolute top-5 right-5 lg:top-7 lg:right-7 group cursor-pointer pointer-events-auto z-10">
                                        <ArrowUpRight strokeWidth={1} className="w-6 h-6 text-[#222944] dark:text-[#BCC5DC] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                                    </button>
                                    <motion.div animate={{ opacity: featuresVisible ? 1 : 0, y: featuresVisible ? 0 : -8 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: featuresVisible ? 0.15 : 0 }}>
                                        <span className="text-[20px] font-normal leading-[1.2] text-[#222944] dark:text-[#BCC5DC] mb-6 block">
                                            Solución Gestionada <br />
                                            por Centhropy
                                        </span>
                                    </motion.div>
                                    <div className="flex flex-col gap-3.5 relative">
                                        {solution.features.map((f, i) => (
                                            <motion.div key={f} className="flex items-center gap-2.5 group cursor-pointer" animate={{ x: featuresVisible ? 0 : -15, opacity: featuresVisible ? 1 : 0 }} whileHover={featuresVisible ? { x: 6 } : {}} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: featuresVisible ? 0.3 + i * 0.05 : (solution.features.length - 1 - i) * 0.02 }}>
                                                <CornerDownRight className="w-4 h-4 text-[#222944]/40 dark:text-[#BCC5DC]/40 group-hover:text-[#222944] dark:group-hover:text-[#BCC5DC] transition-colors" />
                                                <span className="text-[16px] font-normal text-[#222944]/70 dark:text-[#BCC5DC]/70 group-hover:text-[#222944] dark:group-hover:text-[#BCC5DC] transition-colors leading-none">
                                                    {f}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tarjeta B: Statistics (BOTTOM for Apollo) */}
                                <div className="bg-[#F3F5F7] dark:bg-[#303A5F] p-6 lg:p-8 flex flex-col col-span-1 row-span-1 overflow-hidden relative">
                                    <button onClick={handleExpandStudy} className="absolute top-5 right-5 lg:top-7 lg:right-7 group cursor-pointer pointer-events-auto z-10">
                                        <ArrowUpRight strokeWidth={1} className="w-6 h-6 text-[#222944] dark:text-[#BCC5DC] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                                    </button>
                                    <motion.div className="mb-6 mt-1" animate={{ opacity: barsVisible ? 1 : 0, y: barsVisible ? 0 : -8 }} transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: barsVisible ? 0.15 : 0 }}>
                                        <span className="text-[28px] lg:text-[34px] font-light tracking-tight text-[#222944] dark:text-[#BCC5DC] leading-none">
                                            18—20% de Crecimiento
                                        </span>
                                    </motion.div>
                                    <div className="flex-1 w-full relative flex flex-col min-h-0">
                                        <div className="flex-1 relative w-full">
                                            
                                            {/* Dot Matrix Drawing */}
                                            <div className="absolute inset-0 flex justify-between items-end w-full h-full">
                                                {[
                                                    11, 12, 13, 14, 14, 14, 13, 12, 12, 11, 11, 11, 11, 11, 12, 13, 14, 15, 15, 16, 17, 17, 18, 19, 19, 20, 21, 21, 22, 23, 23, 24
                                                ].map((activeDots, colIndex) => {
                                                    const totalCols = 32;
                                                    
                                                    return (
                                                        <div key={colIndex} className="flex flex-col-reverse justify-start gap-[1px] lg:gap-[2px] items-center">
                                                            {[...Array(24)].map((_, rowIndex) => {
                                                                const isActive = rowIndex < activeDots;
                                                                // Entry: columns left→right, dots bottom→top within each column
                                                                const entryDelay = 0.2 + colIndex * 0.03 + rowIndex * 0.012;
                                                                // Exit: columns right→left, dots top→bottom within each column  
                                                                const exitDelay = (totalCols - 1 - colIndex) * 0.015 + (activeDots - 1 - rowIndex) * 0.008;
                                                                
                                                                return (
                                                                    <motion.div
                                                                        key={rowIndex}
                                                                        className={`w-[4px] h-[4px] sm:w-[5px] sm:h-[5px] lg:w-[6px] lg:h-[6px] rounded-none ${isActive ? 'bg-[#30385F]/90 dark:bg-[#BCC5DC]' : 'bg-transparent'}`}
                                                                        animate={{ 
                                                                            opacity: barsVisible ? 1 : 0
                                                                        }}
                                                                        transition={{
                                                                            duration: 0.15,
                                                                            delay: barsVisible ? entryDelay : exitDelay,
                                                                            ease: 'easeOut'
                                                                        }}
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* LA ZONA DERECHA (Media Card - 7 Columns) */}
                    <motion.div style={{ y: bentoY2 }} className="col-span-12 lg:col-span-7 bg-[#F3F5F7] dark:bg-[#303A5F] flex items-center justify-center overflow-hidden relative h-[300px] lg:h-auto">
                        {solution.video ? (
                            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                                <source src={solution.video} type="video/mp4" />
                            </video>
                        ) : (
                            <span className="relative z-10 text-[120px] lg:text-[180px] font-black text-[#222944]/[0.04] dark:text-[#BCC5DC]/[0.04] leading-none select-none tracking-tighter">{solution.short}</span>
                        )}
                    </motion.div>

                    {/* EXPANDED BARC STUDY OVERLAY */}
                    <AnimatePresence>
                        {isStudyExpanded && (
                            <motion.div
                                className="absolute inset-0 z-30 pointer-events-auto overflow-hidden"
                                style={{ left: cardARef.current ? cardARef.current.offsetWidth + 2 : '20.8%' }}
                                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                                exit={{ clipPath: 'inset(0 100% 0 0)' }}
                                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                            >
                                <div className="w-full h-full bg-[#F3F5F7] dark:bg-[#303A5F] p-6 lg:p-8 flex flex-col">

                                    {/* Close Button */}
                                    <button 
                                        onClick={handleCollapseStudy} 
                                        className="absolute top-6 right-6 lg:top-8 lg:right-8 group cursor-pointer z-10"
                                    >
                                        <X strokeWidth={1} className="w-6 h-6 text-[#222944] dark:text-[#BCC5DC] transition-all duration-300 group-hover:rotate-90" />
                                    </button>

                                    {/* Headline & Description Section */}
                                    <div className="mb-8 lg:mb-10 max-w-[800px]">
                                        <div className="overflow-hidden mb-4">
                                            <motion.div 
                                                initial={{ y: '100%' }}
                                                animate={{ y: '0%' }}
                                                exit={{ y: '-100%' }}
                                                transition={{ duration: 0.5, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                                            >
                                                <span className="text-[24px] lg:text-[32px] font-light tracking-tight text-[#222944] dark:text-white leading-[1.15]">
                                                    {idx === 0 ? (
                                                        "La unificación de datos y los sistemas AI—Data facultan a las organizaciones con ventajas medibles y escalables"
                                                    ) : (
                                                        "Optimización garantizada en métricas de crecimiento"
                                                    )}
                                                </span>
                                            </motion.div>
                                        </div>

                                        <div className="overflow-hidden">
                                            <motion.div 
                                                initial={{ y: '100%' }}
                                                animate={{ y: '0%' }}
                                                exit={{ y: '-100%' }}
                                                transition={{ duration: 0.5, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
                                            >
                                                <p className="text-[14px] lg:text-[15px] font-light leading-[1.6] text-[#222944]/60 dark:text-white/80">
                                                    {idx === 0 
                                                        ? "El 87% de Retailers han logrado capturar mayores ingresos. Con el 97% del mercado global escalando su inversión técnica en IA, la prioridad en el sector es precisa: transformar el inventario y la demanda en activos predecibles para garantizar el dominio sobre el campo comercial."
                                                        : "Consolidamos una estructura de crecimiento que transforma la complejidad técnica en una ventaja institucional absoluta y medible, mediante la implementación de protocolos cuidadosamente diseñados. Centhropy asume la carga estratégica y operativa de Apollo Protocol para blindar la generación de resultados."
                                                    }
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>

                                    <div className="mt-4" />

                                    {/* 4-Column Metrics Grid — Precision dividers stretched to absolute bottom edge */}
                                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 -mb-6 lg:-mb-8">
                                        {(idx === 0 ? barcMetrics : apolloMetricsData).map((metric, i) => (
                                            <div key={i} className={`bg-[#F3F5F7] dark:bg-[#303A5F] h-full ${i !== (idx === 0 ? barcMetrics.length : apolloMetricsData.length) - 1 ? 'border-r border-[#222944]/10 dark:border-[#BCC5DC]/10' : ''}`}>
                                                <motion.div
                                                    className="p-5 lg:p-6 lg:pb-12 flex flex-col justify-start h-full"
                                                    initial={{ y: '100%' }}
                                                    animate={{ y: '0%' }}
                                                    exit={{ y: '100%' }}
                                                    transition={{ 
                                                        duration: 0.55, 
                                                        delay: 0.3 + i * 0.08, 
                                                        ease: [0.76, 0, 0.24, 1],
                                                        exit: { delay: (3 - i) * 0.06, duration: 0.45, ease: [0.76, 0, 0.24, 1] }
                                                    }}
                                                >
                                                    {/* Giant number on top */}
                                                    <div className="mb-4 lg:mb-6">
                                                        <span className="text-[28px] lg:text-[34px] font-light tracking-[-0.04em] text-[#222944] dark:text-white leading-[1.1] block">
                                                            {metric.value}
                                                        </span>
                                                    </div>
                                                    {/* Description text on bottom */}
                                                    <p className="text-[11px] lg:text-[14px] font-light leading-relaxed text-[#222944]/60 dark:text-white/80">
                                                        {metric.desc}
                                                    </p>
                                                </motion.div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* EXPANDED ACTIONS OVERLAY */}
                    <AnimatePresence>
                        {isActionsExpanded && (
                            <motion.div
                                className="absolute inset-0 z-30 pointer-events-auto overflow-hidden bg-[#F3F5F7] dark:bg-[#303A5F]"
                                style={{ left: cardARef.current ? cardARef.current.offsetWidth + 2 : '20.8%' }}
                                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                                exit={{ clipPath: 'inset(0 100% 0 0)' }}
                                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                            >
                                <div className="w-full h-full p-6 lg:p-8 flex flex-col relative overflow-hidden custom-scrollbar">
                                    
                                    {/* Close Button */}
                                    <button 
                                        onClick={handleCollapseActions} 
                                        className="absolute top-6 right-6 lg:top-8 lg:right-8 group cursor-pointer z-10"
                                    >
                                        <X strokeWidth={1} className="w-6 h-6 text-[#222944] dark:text-[#BCC5DC] transition-all duration-300 group-hover:rotate-90" />
                                    </button>

                                    {/* Header Section */}
                                    <div className="mb-8 max-w-[800px]">
                                        {/* Titles */}
                                        <div className="overflow-hidden mb-4">
                                            <motion.div 
                                                initial={{ y: '100%' }}
                                                animate={{ y: '0%' }}
                                                exit={{ y: '-100%' }}
                                                transition={{ duration: 0.5, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
                                            >
                                                <h2 className="text-[24px] lg:text-[32px] font-light leading-[1.15] text-[#222944] dark:text-white tracking-tight">
                                                    {idx === 0 ? "Sistema Operativo de Crecimiento — GOS" : "Solución Gestionada por Centhropy"}
                                                </h2>
                                            </motion.div>
                                        </div>
                                        {/* Description */}
                                        <div className="overflow-hidden">
                                            <motion.div 
                                                initial={{ y: '100%' }}
                                                animate={{ y: '0%' }}
                                                exit={{ y: '-100%' }}
                                                transition={{ duration: 0.5, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
                                            >
                                                <p className="text-[14px] lg:text-[15px] font-light leading-[1.6] text-[#222944]/60 dark:text-white/80">
                                                    {idx === 0 
                                                        ? "Las organizaciones dejan de ser reactivas y se convierten en entidades proactivas que operan con precisión de grado militar, minimizando el error humano y maximizando el crecimiento sostenible."
                                                        : "Conectar Apollo Protocol significa desplegar una capacidad de ejecución táctica gestionada por Centhropy. Transformamos la complejidad de los datos en un vector de crecimiento garantizado, operando la infraestructura técnica para que su organización lidere con agilidad en el mercado y capture oportunidades de rentabilidad."
                                                    }
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* The Stages Grid */}
                                    <div className={`flex-1 ${idx === 0 ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 -mx-5 lg:-mx-6 mt-2' : 'flex flex-col mt-4'} min-h-[400px]`}>
                                        
                                        {/* UNIFY DATA CENTER (Original 4-column layout) */}
                                        {idx === 0 && actionsToDisplay.map((stage, i) => (
                                            <div 
                                                key={stage.title} 
                                                className={`flex flex-col py-6 px-5 lg:px-6 ${i !== actionsToDisplay.length - 1 ? 'lg:border-r border-[#222944]/10 dark:border-[#BCC5DC]/10' : ''}`}
                                            >
                                                <motion.div 
                                                    className="mb-5"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                                >
                                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#222944] dark:text-white block mb-2">
                                                        {stage.level} &mdash; {stage.title}
                                                    </span>
                                                    {stage.objective && (
                                                        <p className="text-[13px] font-light text-[#222944]/60 dark:text-white/80 leading-[1.4] mb-2">
                                                            {stage.objective}
                                                        </p>
                                                    )}
                                                </motion.div>

                                                <div className="flex flex-col gap-1.5">
                                                    {stage.actions.map((act) => {
                                                        const isExpanded = expandedActionId === act.id;
                                                        return (
                                                            <div
                                                                key={act.id}
                                                                className="w-full overflow-hidden flex flex-col transition-colors cursor-pointer border border-transparent bg-[#DAE0E7] dark:bg-[#3E4B7A] shadow-sm"
                                                                onClick={() => setExpandedActionId(isExpanded ? null : act.id)}
                                                            >
                                                                <div className="px-3 py-3 flex items-center justify-between">
                                                                    <span className="text-[12px] lg:text-[14px] font-medium text-[#222944]/90 dark:text-white">
                                                                        {act.name}
                                                                    </span>
                                                                    <div className="text-[#222944]/40 dark:text-white/40">
                                                                        {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                                                    </div>
                                                                </div>
                                                                <AnimatePresence initial={false}>
                                                                    {isExpanded && (
                                                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden">
                                                                            <div className="px-3 pb-3 border-t border-[#222944]/10 dark:border-white/10 pt-2">
                                                                                <p className="text-[12px] font-light leading-[1.4] text-[#222944]/80 dark:text-white/90">
                                                                                    {act.action}{act.result ? ` ${act.result}` : ''}
                                                                                </p>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}

                                        {/* APOLLO PROTOCOL (Clean 2-column layout) */}
                                        {idx === 1 && (
                                            <div className="flex flex-col">
                                                <div className="mb-6">
                                                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#222944] dark:text-white block">
                                                        {apolloActions[0].title}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                                    {[0, 1].map((colIdx) => (
                                                        <div key={colIdx} className="flex flex-col gap-1.5 pt-1 pb-4">
                                                            {apolloActions[colIdx].actions.map((act) => {
                                                                const isExpanded = expandedActionId === act.id;
                                                                return (
                                                                    <div
                                                                        key={act.id}
                                                                        className="w-full overflow-hidden flex flex-col transition-colors cursor-pointer border border-transparent bg-[#DAE0E7] dark:bg-[#3E4B7A] shadow-sm"
                                                                        onClick={() => setExpandedActionId(isExpanded ? null : act.id)}
                                                                    >
                                                                        <div className="px-3 py-3 flex items-center justify-between">
                                                                            <span className="text-[12px] lg:text-[14px] font-medium text-[#222944]/90 dark:text-white">
                                                                                {act.name}
                                                                            </span>
                                                                            <div className="text-[#222944]/60 dark:text-white/60">
                                                                                {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                                                            </div>
                                                                        </div>
                                                                        <AnimatePresence initial={false}>
                                                                            {isExpanded && (
                                                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden">
                                                                                    <div className="px-3 pb-3 border-t border-[#222944]/10 dark:border-white/10 pt-2">
                                                                                        <p className="text-[12px] font-light leading-[1.4] text-[#222944]/90 dark:text-white/95 mb-2">{act.action}</p>
                                                                                        {act.result && <p className="text-[12px] font-light leading-[1.4] text-[#222944]/80 dark:text-white/90">{act.result}</p>}
                                                                                    </div>
                                                                                </motion.div>
                                                                            )}
                                                                        </AnimatePresence>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const SolutionsSection = React.memo(({ children }) => {
    const wrapperRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: wrapperRef,
        offset: ["start end", "end end"]
    });

    return (
        <div ref={wrapperRef} className="relative w-full z-20 pointer-events-none" style={{ height: '1500vh', willChange: 'transform' }}>
            {/* Card 1 */}
            <SolutionCard solution={solutionsData[0]} idx={0} scrollYProgress={scrollYProgress} />

            {/* 400vh spacer — gives card 1 animations time to complete before card 2 covers it */}
            <div className="h-[400vh] pointer-events-none" />

            {/* Card 2 */}
            <SolutionCard solution={solutionsData[1]} idx={1} scrollYProgress={scrollYProgress} />

            {/* 400vh spacer — gives card 2 animations time to complete before children covers it */}
            <div className="h-[400vh] pointer-events-none" />

            {/* Rest of page slides over card 2 */}
            <div className="sticky top-0 w-full bg-white dark:bg-[#1B2136] pointer-events-auto" style={{ zIndex: 30, transform: 'translateZ(0)', willChange: 'transform' }}>
                {children}
            </div>
        </div>
    );
});

const CenthropyDesktop = () => {
    const hudRef = useRef(null);
    const probeDataRef = useRef({ phi: Math.PI * 0.5, theta: Math.PI * 0.5 });
    const [openModule, setOpenModule] = useState(0);
    const solutionsWrapperRef = useRef(null);
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
            desc: 'Establecimiento de una autoridad centralizada, unificando la arquitectura de análisis y decisiones en un núcleo que elimina la fragmentación informativa y el sesgo operativo.'
        },
        {
            l: 'Logic_02',
            w: 'Optimización',
            desc: 'Perfeccionamiento dinámico de acciones, permitiendo agilizar la gestión de negocios en tiempo real para maximizar el rendimiento comercial y eliminar cualquier fricción técnica en la cadena de valor.'
        },
        {
            l: 'Core_03',
            w: 'Inteligencia',
            desc: 'Detección sistemática de vectores de expansión financiera mediante el análisis continuo impulsado por AI—Data, permitiendo la diversificación de recursos y la integración de nuevas líneas de negocio con alta eficiencia.'
        },
        {
            l: 'Goal_04',
            w: 'Crecimiento',
            desc: 'Activación del potencial multiplicador de la organización, impulsando el volumen de transacciones y la aceleración de ingresos a través de una ingeniería comercial diseñada para escalar los resultados de manera exponencial y predecible.'
        },
        {
            l: 'Yield_05',
            w: 'Rentabilidad',
            desc: 'Maximización de la capacidad empresarial para capturar valor neto, blindando la sostenibilidad financiera y superando sistemáticamente los umbrales de beneficio establecidos mediante una gestión científica del margen y el retorno operativo.'
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
                                        <p className="text-[16px] font-funnel font-light leading-relaxed text-[#222944]/80 dark:text-[#BCC5DC] whitespace-normal">
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
                            <span className="text-[11px] font-bold uppercase tracking-tight text-[#222944] dark:text-[#BCC5DC]">Optimus 2.0</span>
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

                <div id="status-panel" className="relative z-[5000] bg-white dark:bg-[#1B2136] pointer-events-auto">
                    <div className="w-full px-5 py-12 md:px-10 md:pt-28 md:pb-0 bg-white dark:bg-[#1B2136]">
                        <div className="max-w-[1800px] mx-auto">


                            <div className="max-w-6xl mx-auto mb-24 text-center">
                                <h2 className="text-3xl md:text-[64px] font-light tracking-tight leading-[1.0] text-[#222944] dark:text-[#BCC5DC] flex flex-col gap-0">
                                    {[
                                        "Soberanía analítica, dominio de datos",
                                        "y toma de decisiones potenciadas",
                                        "con AI—Driven"
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
                                    { id: 'SYS.01', t1: 'Cordyceps', t2: '', short: 'CP', desc: 'Protocolo ontológico diseñado para descifrar el estado real y potencial de la organización, desplegando métodos científicos para codificar repositorios centralizados de analítica avanzada.' },
                                    { id: 'SYS.02', t1: 'Unify', t2: '', short: 'DC', desc: 'Núcleo de unificación de datos AI—Driven con funciones de gobernanaza de decisiones para organizaciones de alto valor. Integración total con Optimus 2.0.' },
                                    { id: 'SYS.03', t1: 'Optimus', t2: '2.0', short: 'UA', desc: 'Copiloto de razonamiento avanzado, entrenado para para la explotación de activos de datos centralizados por Cordyceps. Optimus 2.0 agiliza la toma decisiones, descubriendo insights de alto valor y generando estrategias accionables en lenguaje humano.' },
                                    { id: 'SYS.04', t1: 'Unify', t2: 'Team', short: 'UT', desc: 'Equipo de élite especializado y enfocado en garantizar la confiabilidad, eficacia y sostenibilidad de todo el ecosistema de Centhropy.' }
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
                                                <h4 className="text-5xl md:text-[85px] font-normal tracking-tighter leading-[0.8] text-[#222944] dark:text-[#BCC5DC] transition-transform duration-700 group-hover:translate-x-[-20px]">
                                                    {comp.t1}{comp.t2 ? ` ${comp.t2}` : ''}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Solutions scroll wrapper with the rest of the page passed as children */}
                    <SolutionsSection>
                        {/* ConnectorsSection desactivado temporalmente */}
                        {/* <div className="w-full px-5 md:px-10 bg-white dark:bg-[#1B2136]">
                            <div className="max-w-[1800px] mx-auto">
                                <ConnectorsSection />
                            </div>
                        </div> */}

                        {React.useMemo(() => (
                            <>
                                <OperationGlobe />

                                <OrganizationsCarousel />

                                <div className="w-full px-5 py-4 md:px-10 md:pt-4 md:pb-16 bg-white dark:bg-[#1B2136]">
                                    <div className="max-w-[1800px] mx-auto">
                                        <div className="mt-8 pt-8">
                                            <div className="w-full h-[1px] bg-[#222944]/15 dark:bg-[#BCC5DC]/15 mb-10" />
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col w-full">
                                                    <h5 className="text-[70px] font-black uppercase tracking-tighter leading-none">CONECTAR</h5>
                                                </div>
                                                <div className="flex items-center">
                                                    <Link to="/waitlist" className="w-16 h-16 border-2 border-[#222944] dark:border-[#BCC5DC] rounded-none flex items-center justify-center group cursor-pointer hover:bg-[#222944] hover:border-[#222944] hover:text-white dark:hover:text-[#222944] dark:hover:bg-[#BCC5DC] transition-all duration-300">
                                                        <ChevronRight size={32} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ), [])}
                    </SolutionsSection>
                </div>
            </main>
        </div>
    );
};

export default CenthropyDesktop;
