import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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

const ShopifyLogo = ({ isDark }) => (
    <svg viewBox="0 0 1000 1000" className="w-full h-full max-w-none max-h-none md:max-w-[360px] md:max-h-[180px] md:w-[80%] md:h-auto object-contain p-0 md:p-0 transition-all duration-700 scale-[1.25] md:scale-100 group-hover:scale-[1.35] md:group-hover:scale-110 transform">
        <g>
            {/* Bag Front */}
            <path fill="#222944" d="M310.3,441.2c-0.1-1-1-1.4-1.6-1.4s-14.9-1.1-14.9-1.1s-9.9-9.9-11.1-10.9c-1.1-1.1-3.2-0.8-4-0.5c-0.1,0-2.2,0.7-5.5,1.7c-3.4-9.7-9.1-18.5-19.5-18.5h-1c-2.8-3.7-6.5-5.4-9.6-5.4c-23.9,0-35.5,29.9-39,45.1c-9.4,2.9-16,4.9-16.7,5.2c-5.2,1.6-5.3,1.7-6,6.6c-0.5,3.7-14.1,108.9-14.1,108.9L273,590.7l57.4-12.4C330.5,578.1,310.4,442.1,310.3,441.2z M267.2,430.5c-2.6,0.8-5.8,1.7-8.9,2.8v-2c0-5.9-0.8-10.7-2.2-14.5C261.5,417.6,264.9,423.5,267.2,430.5L267.2,430.5z M249.5,418.1c1.4,3.7,2.4,8.9,2.4,16.1v1.1c-5.9,1.8-12.1,3.7-18.5,5.8C237,427.3,243.8,420.6,249.5,418.1L249.5,418.1z M242.5,411.4c1.1,0,2.2,0.4,3,1.1c-7.7,3.6-15.9,12.6-19.3,30.9c-5.1,1.6-10,3-14.7,4.6C215.5,434,225.3,411.4,242.5,411.4z" />
            {/* Bag Side */}
            <path fill="#1B2136" d="M308.6,439.5c-0.7,0-14.9-1.1-14.9-1.1s-9.9-9.9-11.1-10.9c-0.4-0.4-1-0.7-1.4-0.7l-7.9,163.8l57.4-12.4c0,0-20.1-136.2-20.2-137.1C310.1,440.2,309.3,439.7,308.6,439.5z" />
            {/* The S */}
            <path className={isDark ? "fill-[#303A5F]" : "fill-[#F8F9FA]"} d="M253.6,471.3l-7,21c0,0-6.3-3.4-13.8-3.4c-11.2,0-11.7,7.1-11.7,8.8c0,9.6,25,13.3,25,35.8c0,17.7-11.2,29.1-26.3,29.1c-18.3,0-27.4-11.3-27.4-11.3l4.9-16.1c0,0,9.6,8.3,17.6,8.3c5.3,0,7.5-4.1,7.5-7.2c0-12.5-20.4-13.1-20.4-33.7c0-17.3,12.4-34,37.5-34C248.8,468.5,253.6,471.3,253.6,471.3z" />
            {/* Shopify Text */}
            <path fill={isDark ? "#BCC5DC" : "#222944"} d="M397.4,510.8c-5.8-3-8.7-5.8-8.7-9.4c0-4.6,4.1-7.5,10.5-7.5c7.5,0,14.1,3,14.1,3l5.2-16c0,0-4.8-3.7-18.9-3.7c-19.7,0-33.4,11.3-33.4,27.2c0,9,6.4,15.9,14.9,20.8c7,3.8,9.4,6.6,9.4,10.8c0,4.2-3.5,7.7-9.9,7.7c-9.5,0-18.5-4.9-18.5-4.9l-5.5,16c0,0,8.3,5.5,22.2,5.5c20.2,0,34.9-10,34.9-28C413.5,522.6,406.2,515.9,397.4,510.8z M478.1,477.1c-10,0-17.8,4.8-23.8,12l-0.2-0.1l8.7-45.2h-22.5l-22,115.3h22.5l7.5-39.4c2.9-14.9,10.7-24.1,17.8-24.1c5.1,0,7.1,3.5,7.1,8.4c0,3-0.2,7-1,10l-8.5,45.1h22.5l8.8-46.5c1-4.9,1.6-10.8,1.6-14.8C496.6,484.7,489.9,477.1,478.1,477.1L478.1,477.1z M547.6,477.1c-27.2,0-45.1,24.5-45.1,51.8c0,17.4,10.8,31.5,31,31.5c26.6,0,44.6-23.8,44.6-51.8C578.1,492.4,568.8,477.1,547.6,477.1z M536.5,543.2c-7.7,0-10.9-6.5-10.9-14.8c0-12.9,6.6-33.9,18.9-33.9c7.9,0,10.7,7,10.7,13.6C555.2,521.9,548.3,543.2,536.5,543.2L536.5,543.2z M635.8,477.1c-15.2,0-23.8,13.5-23.8,13.5h-0.2l1.3-12.1h-20c-1,8.2-2.8,20.7-4.6,29.9l-15.6,82.5h22.5l6.3-33.4h0.5c0,0,4.7,2.9,13.2,2.9c26.5,0,43.8-27.2,43.8-54.6C659.2,490.6,652.3,477.1,635.8,477.1z M614.3,543.4c-5.9,0-9.4-3.4-9.4-3.4l3.7-21c2.6-14.1,10-23.4,17.8-23.4c7,0,9,6.4,9,12.4C635.6,522.6,626.9,543.4,614.3,543.4L614.3,543.4z M691.4,444.8c-7.2,0-12.9,5.8-12.9,13.1c0,6.6,4.2,11.3,10.7,11.3h0.2c7.1,0,13.1-4.8,13.2-13.1C702.6,449.4,698.1,444.8,691.4,444.8z M659.8,558.8h22.5l15.2-80h-22.6 M755,478.7h-15.7l0.8-3.7c1.3-7.7,5.9-14.5,13.5-14.5c4,0,7.2,1.2,7.2,1.2l4.4-17.7c0,0-3.8-2-12.3-2c-7.9,0-16,2.3-22.1,7.5c-7.7,6.5-11.3,16-13.1,25.6l-0.7,3.7h-10.5l-3.4,17.1h10.5l-12,63.1h22.5l12-63.1h15.6L755,478.7L755,478.7z M809.3,478.8c0,0-14.1,35.6-20.3,55h-0.2c-0.4-6.3-5.5-55-5.5-55h-23.7l13.6,73.3c0.2,1.6,0.1,2.6-0.5,3.7c-2.6,5.1-7.1,10-12.3,13.6c-4.2,3-9,5.1-12.8,6.4l6.3,19.1c4.6-1,14.1-4.8,22.1-12.3c10.2-9.6,19.8-24.5,29.6-44.7l27.5-59.3h-23.6V478.8z" />
        </g>
    </svg>
);

const ConnectorItem = ({ connector, isNew, newIdx, isMobile }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const isDark = document.documentElement.classList.contains('dark');

    return (
        <motion.div
            initial={isNew ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={isNew ? {
                duration: 0.45,
                delay: isMobile ? 0 : (newIdx * 0.04),
                ease: [0.22, 1, 0.36, 1]
            } : { duration: 0 }}
            className="relative bg-[#F8F9FA] dark:bg-[#303A5F] aspect-[4/3] md:aspect-[20/9] flex items-center justify-center p-0 md:p-8 group hover:bg-[#F1F3F5] dark:hover:bg-[#3a4672] transition-colors duration-300"
            style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)" }}
        >
            {connector.name === "Shopify" ? (
                <ShopifyLogo isDark={isDark} />
            ) : (
                <img
                    src={connector.logo}
                    alt={connector.name}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full max-w-none max-h-none md:max-w-[360px] md:max-h-[180px] md:w-[80%] md:h-auto object-contain p-0 md:p-0 transition-all duration-700 scale-[1.25] md:scale-100 group-hover:scale-[1.35] md:group-hover:scale-110 transform ${imageLoaded ? 'opacity-80 group-hover:opacity-100' : 'opacity-0'} [filter:invert(13%)_sepia(31%)_saturate(1469%)_hue-rotate(193deg)_brightness(97%)_contrast(92%)] dark:invert dark:brightness-150 dark:opacity-80`}
                />
            )}
        </motion.div>
    );
};

const ConnectorsSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [visibleCount, setVisibleCount] = useState(8);

    // Ref que guarda desde qué índice empiezan las tarjetas NUEVAS.
    const newStartRef = useRef(-1);

    // Precarga de imágenes solo para mobile
    useEffect(() => {
        if (isMobile) {
            connectorsData.forEach((connector) => {
                const img = new Image();
                img.src = connector.logo;
            });
        }
    }, [isMobile]);

    // Detectar mobile
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(prev => {
                if (prev !== mobile) {
                    newStartRef.current = -1;
                    setVisibleCount(mobile ? 4 : 8);
                }
                return mobile;
            });
        };

        const initialMobile = window.innerWidth < 768;
        setIsMobile(initialMobile);
        setVisibleCount(initialMobile ? 4 : 8);

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const filteredConnectors = connectorsData.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleConnectors = filteredConnectors.slice(0, visibleCount);
    const initialCount = isMobile ? 4 : 8;
    const increment = isMobile ? 4 : 8;

    const handleLoadMore = () => {
        newStartRef.current = visibleCount;
        setVisibleCount(prev => Math.min(prev + increment, filteredConnectors.length));
    };

    return (
        <div className="mt-6 md:mt-20 mb-12 md:mb-24 pt-0 md:pt-20 text-[#222944] dark:text-[#BCC5DC]">
            <div className="w-full h-[1px] bg-[#222944]/15 dark:bg-[#BCC5DC]/15 mb-10" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-8 w-full">
                <h3 className="text-[45px] md:text-[70px] font-medium tracking-tighter leading-none m-0">
                    Integraciones
                </h3>
                <div className="w-full md:w-auto relative mb-1">
                    <input
                        type="text"
                        placeholder="Buscar conector..."
                        value={searchTerm}
                        onChange={(e) => {
                            newStartRef.current = -1;
                            setSearchTerm(e.target.value);
                            setVisibleCount(initialCount);
                        }}
                        className="w-full md:w-[350px] border border-[#222944]/20 dark:border-[#BCC5DC]/20 bg-white dark:bg-[#222944] px-6 py-4 text-sm focus:outline-none focus:border-[#222944] dark:focus:border-[#BCC5DC] transition-colors uppercase font-funnel tracking-widest text-[#222944] dark:text-[#BCC5DC] placeholder:text-[#222944]/30 dark:placeholder:text-[#BCC5DC]/50"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#222944]/20 dark:text-[#BCC5DC]/40 pointer-events-none">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
                {visibleConnectors.map((connector, idx) => {
                    const isNew = newStartRef.current >= 0 && idx >= newStartRef.current;
                    const newIdx = isNew ? idx - newStartRef.current : 0;

                    return (
                        <ConnectorItem
                            key={connector.id}
                            connector={connector}
                            isNew={isNew}
                            newIdx={newIdx}
                            isMobile={isMobile}
                        />
                    );
                })}
            </div>

            {filteredConnectors.length === 0 && (
                <div className="w-full py-20 text-center">
                    <p className="text-[#222944]/40 dark:text-[#BCC5DC]/60 uppercase tracking-widest font-bold text-sm">
                        No se encontraron conectores que coincidan con "{searchTerm}"
                    </p>
                </div>
            )}

            {visibleCount < filteredConnectors.length && (
                <div className="flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        className="border border-[#222944] dark:border-[#BCC5DC] text-[#222944] dark:text-[#BCC5DC] bg-transparent px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#222944] hover:border-[#222944] hover:text-white dark:hover:bg-[#BCC5DC] dark:hover:text-[#222944] transition-all duration-300 flex items-center active:scale-95"
                    >
                        Cargar Más
                    </button>
                </div>
            )}
        </div>
    );
};

export default ConnectorsSection;
