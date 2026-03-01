import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const connectorsData = [
    { id: 1, name: "Google", logo: "/connectors/01_google_1.svg" },
    { id: 2, name: "Meta", logo: "/connectors/02_meta_2-02.svg" },
    { id: 3, name: "AWS", logo: "/connectors/03_aws_2-03.svg" },
    { id: 4, name: "Oracle", logo: "/connectors/04_oracle_8.svg" },
    { id: 5, name: "Shopify", logo: "/connectors/05_shopify_11.svg" },
    { id: 6, name: "WooCommerce", logo: "/connectors/06_woocommerce_12.svg" },
    { id: 7, name: "Zoho", logo: "/connectors/07_zoho_4.svg" },
    { id: 8, name: "Hubspot", logo: "/connectors/08_hubspot_5.svg" },
    { id: 9, name: "Salesforce", logo: "/connectors/09_salesforce_10.svg" },
    { id: 10, name: "Stripe", logo: "/connectors/10_stripe_13.svg" },
    { id: 11, name: "Twilio", logo: "/connectors/11_twilio_14.svg" },
    { id: 12, name: "Snowflake", logo: "/connectors/12_snowflake_15.svg" },
    { id: 13, name: "MongoDB", logo: "/connectors/13_mongodb_6.svg" },
    { id: 14, name: "MySQL", logo: "/connectors/14_mysql_7.svg" },
    { id: 15, name: "PostgreSQL", logo: "/connectors/15_postgres_9.svg" },
    { id: 16, name: "Files", logo: "/connectors/16_filesconnectors_16.svg" }
];

const ConnectorsSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [visibleCount, setVisibleCount] = useState(8);
    const [animateOnLoad, setAnimateOnLoad] = useState(false);

    // Detectar si es mobile para ajustar el conteo inicial.
    // IMPORTANTE: solo reseteamos visibleCount cuando cambia el breakpoint
    // (mobile ↔ desktop). Los navegadores móviles disparan 'resize' en cada
    // scroll cuando la barra de URL aparece/desaparece, lo que causaba que
    // los conectores se colapsaran al hacer scroll luego de "Cargar Más".
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(prev => {
                if (prev !== mobile) {
                    // Solo reseteamos el conteo si cambia realmente el breakpoint
                    setVisibleCount(mobile ? 4 : 8);
                }
                return mobile;
            });
        };

        // Inicialización: establecemos el estado sin pasar por setIsMobile funcional
        const initialMobile = window.innerWidth < 768;
        setIsMobile(initialMobile);
        setVisibleCount(initialMobile ? 4 : 8);

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const filteredConnectors = connectorsData.filter(connector =>
        connector.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleConnectors = filteredConnectors.slice(0, visibleCount);
    const initialCount = isMobile ? 4 : 8;
    const increment = isMobile ? 4 : 8;

    const handleLoadMore = () => {
        setAnimateOnLoad(true);
        setVisibleCount(prev => Math.min(prev + increment, filteredConnectors.length));
    };

    return (
        <div className="mt-20 md:mt-20 mb-12 md:mb-24 pt-0 md:pt-20 text-black">
            <div className="w-full h-[1px] bg-black/15 mb-10" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-8 w-full">
                <h3 className="text-[45px] md:text-[70px] font-medium tracking-tighter leading-none m-0">Integraciones</h3>
                <div className="w-full md:w-auto relative mb-1">
                    <input
                        type="text"
                        placeholder="Buscar conector..."
                        value={searchTerm}
                        onChange={(e) => {
                            setAnimateOnLoad(false);
                            setSearchTerm(e.target.value);
                            setVisibleCount(initialCount);
                        }}
                        className="w-full md:w-[350px] border border-black/20 bg-white px-6 py-4 text-sm focus:outline-none focus:border-black transition-colors uppercase font-funnel tracking-widest placeholder:text-black/30"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-black/20 pointer-events-none">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
                <AnimatePresence>
                    {visibleConnectors.map((connector, idx) => (
                        <motion.div
                            key={connector.id}
                            initial={animateOnLoad ? { opacity: 0, scale: 0.9, y: 20 } : false}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={animateOnLoad ? {
                                duration: 0.5,
                                delay: (idx % initialCount) * 0.05,
                                ease: [0.16, 1, 0.3, 1]
                            } : { duration: 0 }}
                            className="relative bg-[#f5f5f5] aspect-[4/3] md:aspect-[20/9] flex items-center justify-center p-0 md:p-8 group hover:bg-[#ebebeb] transition-all duration-300"
                            style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)" }}
                        >
                            <img
                                src={connector.logo}
                                alt={connector.name}
                                className="w-full h-full max-w-none max-h-none md:max-w-[360px] md:max-h-[180px] md:w-[80%] md:h-auto object-contain p-0 md:p-0 opacity-70 group-hover:opacity-100 transition-all duration-300 scale-[1.25] md:scale-100 group-hover:scale-[1.35] md:group-hover:scale-110 transform"
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredConnectors.length === 0 && (
                <div className="w-full py-20 text-center">
                    <p className="text-black/40 uppercase tracking-widest font-bold text-sm">No se encontraron conectores que coincidan con "{searchTerm}"</p>
                </div>
            )}

            {visibleCount < filteredConnectors.length && (
                <div className="flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        className="border border-black text-black bg-transparent px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 flex items-center active:scale-95"
                    >
                        Cargar Más
                    </button>
                </div>
            )}
        </div>
    );
};

export default ConnectorsSection;
