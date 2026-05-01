import React from 'react';
import { motion } from 'framer-motion';
import { useIsDarkMode } from '../hooks/useIsDarkMode';

// SVG Inlinings to prevent path/cache issues
const hikoruDarkSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1379.3 446">
    <rect x="100.4" y="86.6" fill="#FFFFFF" width="666.6" height="272.9"/>
    <g fill="#303A5F">
        <path d="M200.7,237v47.7h-25.5V161.3h25.5v51.9h49.2v-51.9h25.5v123.4h-25.5V237H200.7z"/>
        <path d="M321.6,195.3v89.4H296v-89.4H321.6z M321.4,173.7c0-6.9-5.6-12.4-12.4-12.4s-12.4,5.6-12.4,12.4 c0,6.9,5.6,12.4,12.4,12.4S321.4,180.6,321.4,173.7z"/>
        <path d="M366.9,250.7v34h-25.5V161.4h25.5v65.5h12.5l21.4-31.6h30.7l-30,43.6l31.9,45.8h-30.7l-23.3-34H366.9z"/>
        <path d="M436.3,238.7c0-27.7,15.3-47.9,44.8-47.9s44.8,20.3,44.8,47.9c0,27.7-15.3,47.8-44.8,47.8 S436.3,266.4,436.3,238.7z M500.2,238.7c0-17.6-4.9-24.1-19.2-24.1c-14.1,0-19.2,6.5-19.2,24.1c0,17.6,5.1,24,19.2,24 C495.3,262.7,500.2,256.3,500.2,238.7z"/>
        <path d="M565.8,216.3v68.4h-25.5v-92.2h59.4v23.8H565.8z"/>
        <path d="M617.2,246v-53.4h25.5v49c0,15.9,5.1,21.1,19.2,21.1c14.3,0,19.2-5.3,19.2-21.1v-49h25.5V246 c0,29.4-17.4,40.5-44.8,40.5C634.8,286.5,617.2,275.4,617.2,246z"/>
        <rect x="452.2" y="161.4" width="57.7" height="20.1"/>
    </g>
    <g fill="#FFFFFF">
        <path d="M861.7,258.8v-97.5l24.6,6.6v29.9c23.8-2.9,47-8.3,69.5-16.3l9.3,21.6c-27.4,9.2-53.7,15-78.8,17.4v32.6 c0,3.4,0.6,5.8,1.8,7c1.2,1.3,3.2,1.9,6,1.9h71l-3.4,22.7h-72.6c-8.4,0-15.1-2.2-20.1-6.6C864.2,273.8,861.7,267.3,861.7,258.8z"/>
        <path d="M995.2,273v-22.5h85.4v-48.2h-85.2v-22.7h110.2v105.2h-24.9V273H995.2z"/>
        <path d="M1130,269.8c9.4-8.7,16.3-18.4,20.6-28.9c4.4-10.6,6.6-22.6,6.6-36.3v-33.9l24.6,6.6v27.3c0,31.7-10.7,58.1-32.1,79.5 L1130,269.8z M1195.8,263.7v-99.5l24.8,6.6v81.4c16.6-11.3,31.2-25.2,43.8-41.6l14.5,18.9c-9.7,12.8-21.3,24.2-34.8,34.3 c-13.5,10.1-25,17.1-34.5,21l-8.3-7.9C1197.8,273.4,1195.8,268.6,1195.8,263.7z"/>
    </g>
</svg>`;

const hikoruLightSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1379.3 446">
    <rect x="100.4" y="86.6" fill="#222944" width="666.6" height="272.9"/>
    <g fill="#FFFFFF">
        <path d="M200.7,237v47.7h-25.5V161.3h25.5v51.9h49.2v-51.9h25.5v123.4h-25.5V237H200.7z"/>
        <path d="M321.6,195.3v89.4H296v-89.4H321.6z M321.4,173.7c0-6.9-5.6-12.4-12.4-12.4s-12.4,5.6-12.4,12.4 c0,6.9,5.6,12.4,12.4,12.4S321.4,180.6,321.4,173.7z"/>
        <path d="M366.9,250.7v34h-25.5V161.4h25.5v65.5h12.5l21.4-31.6h30.7l-30,43.6l31.9,45.8h-30.7l-23.3-34H366.9z"/>
        <path d="M436.3,238.7c0-27.7,15.3-47.9,44.8-47.9s44.8,20.3,44.8,47.9c0,27.7-15.3,47.8-44.8,47.8 S436.3,266.4,436.3,238.7z M500.2,238.7c0-17.6-4.9-24.1-19.2-24.1c-14.1,0-19.2,6.5-19.2,24.1c0,17.6,5.1,24,19.2,24 C495.3,262.7,500.2,256.3,500.2,238.7z"/>
        <path d="M565.8,216.3v68.4h-25.5v-92.2h59.4v23.8H565.8z"/>
        <path d="M617.2,246v-53.4h25.5v49c0,15.9,5.1,21.1,19.2,21.1c14.3,0,19.2-5.3,19.2-21.1v-49h25.5V246 c0,29.4-17.4,40.5-44.8,40.5C634.8,286.5,617.2,275.4,617.2,246z"/>
        <rect x="452.2" y="161.4" width="57.7" height="20.1"/>
    </g>
    <g fill="#222944">
        <path d="M861.7,258.8v-97.5l24.6,6.6v29.9c23.8-2.9,47-8.3,69.5-16.3l9.3,21.6c-27.4,9.2-53.7,15-78.8,17.4v32.6 c0,3.4,0.6,5.8,1.8,7c1.2,1.3,3.2,1.9,6,1.9h71l-3.4,22.7h-72.6c-8.4,0-15.1-2.2-20.1-6.6C864.2,273.8,861.7,267.3,861.7,258.8z"/>
        <path d="M995.2,273v-22.5h85.4v-48.2h-85.2v-22.7h110.2v105.2h-24.9V273H995.2z"/>
        <path d="M1130,269.8c9.4-8.7,16.3-18.4,20.6-28.9c4.4-10.6,6.6-22.6,6.6-36.3v-33.9l24.6,6.6v27.3c0,31.7-10.7,58.1-32.1,79.5 L1130,269.8z M1195.8,263.7v-99.5l24.8,6.6v81.4c16.6-11.3,31.2-25.2,43.8-41.6l14.5,18.9c-9.7,12.8-21.3,24.2-34.8,34.3 c-13.5,10.1-25,17.1-34.5,21l-8.3-7.9C1197.8,273.4,1195.8,268.6,1195.8,263.7z"/>
    </g>
</svg>`;

const hikoruDarkDataUrl = `data:image/svg+xml;base64,${typeof window !== 'undefined' ? window.btoa(hikoruDarkSvg) : ''}`;
const hikoruLightDataUrl = `data:image/svg+xml;base64,${typeof window !== 'undefined' ? window.btoa(hikoruLightSvg) : ''}`;

const testimonials = [
    {
        id: 1,
        author: "Jorge Solano",
        role: "Director de Finanzas",
        quote: "Centhropy permite materializar nuevos sistemas de negocio; nuestro modelo y su tecnología han hecho sinergia de inmediato.",
        companyLogo: "/customers/07_bestok_9.svg"
    },
    {
        id: 2,
        author: "Eglee Rodríguez",
        role: "Dirección Administrativa",
        quote: "Nuestro enfoque es alcanzar el crecimiento sostenido en las empresas, y Unify es una herramienta perfecta para lograrlo.",
        companyLogo: "/customers/01_qualitystate_1.svg"
    },
    {
        id: 3,
        author: "Mariangel Flores",
        role: "Directora Creativa",
        quote: "Con el stack tecnológico de Centhropy, podremos continuar innovando y consolidando nuestro ecosistema digital para la industria de alimentos.",
        companyLogo: "/customers/02_firekitch_2.svg"
    },
    {
        id: 4,
        author: "Yoletty Rodríguez",
        role: "Fundadora",
        quote: "En Citiwork creemos que la metodología es tan importante como la tecnología y en Centhropy entienden esto a la perfección.",
        companyLogo: "/customers/03_citywork_3.svg"
    },
    {
        id: 5,
        author: "Luis Castillo",
        role: "CEO",
        quote: "Unify Agent es como tener a un analista senior disponible 24/7. Nuestra toma de decisiones es más efectiva.",
        companyLogo: "/customers/08_awua_8.svg"
    },
    {
        id: 6,
        author: "David Arteaga",
        role: "CEO & CTO",
        quote: "Con la integración de Unify en nuestro SGE, hemos logrado incrementar nuestra propuesta de valor. Esta es una alianza con un impacto real.",
        companyLogo: "/customers/04_realgestion_7.svg"
    },
    {
        id: 7,
        author: "Jonas Villegas",
        role: "Director Creativo",
        quote: "La solución \"Growth Engine\" de Centhropy nos ha permitido comenzar a construir nuestro sueño de llegar a todos los hogares.",
        companyLogo: "/customers/05_hikoru_5.svg"
    }
];

const duplicatedTestimonials = [...testimonials, ...testimonials];

const OrganizationsCarousel = () => {
    const isDarkMode = useIsDarkMode();
    const [isMobileCarousel, setIsMobileCarousel] = React.useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    
    React.useEffect(() => {
        const handleResize = () => setIsMobileCarousel(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const cardWidth = isMobileCarousel ? 350 : 450;
    const totalWidth = (testimonials.length * cardWidth) + (testimonials.length * 2);
    const duration = isMobileCarousel ? 80 : 140;
    
    return (
        <section className="pt-10 md:mt-32 pb-16 bg-white dark:bg-[#1B2136] overflow-hidden w-full">
            <div className="max-w-[1800px] mx-auto px-5 md:px-10 mb-8">
                <div className="w-full h-[1px] bg-[#222944]/15 dark:bg-[#BCC5DC]/15 mb-6 md:mb-10" />
                <h2 className="text-[36px] md:text-[56px] font-light tracking-tighter text-[#222944] dark:text-[#BCC5DC] leading-none">
                    Organizaciones
                </h2>
            </div>

            <div className="relative flex overflow-hidden">
                <motion.div
                    className="flex"
                    animate={{
                        x: [0, -totalWidth]
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: duration,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedTestimonials.map((item, idx) => {
                        const isHikoru = item.id === 7 || item.author.includes("Jonas");
                        
                        // Use inlined logos for Hikoru to avoid any path/cache issues
                        let currentLogoSrc = item.companyLogo;
                        if (isHikoru) {
                            currentLogoSrc = isDarkMode ? hikoruDarkDataUrl : hikoruLightDataUrl;
                        }
                        
                        return (
                            <div
                                key={`${item.id}-${idx}`}
                                className="w-[350px] md:w-[450px] shrink-0 mx-[1px] bg-[#F3F5F7] dark:bg-[#303A5F] p-10 pb-11 flex flex-col justify-between"
                                style={{ minHeight: '550px' }}
                            >
                                <div className="flex justify-between items-start mb-12">
                                    <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-[#222944]/5 dark:bg-[#BCC5DC]/5">
                                        <svg className="w-8 h-8 text-[#222944]/30 dark:text-[#BCC5DC]/30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 16.66 14.67 14 12 14Z" fill="currentColor"/>
                                        </svg>
                                    </div>
                                    <div className="bg-transparent pl-6 pr-0 py-4 rounded-none border border-transparent flex items-center justify-end min-w-[150px] h-[65px]">
                                        <img
                                            src={currentLogoSrc}
                                            alt={`${item.author} Company Logo`}
                                            className={`max-h-full max-w-full w-auto h-auto block object-contain ${
                                                (isDarkMode && isHikoru) 
                                                ? 'opacity-100' 
                                                : 'opacity-80 dark:brightness-0 dark:invert dark:opacity-90'
                                            }`}
                                            onError={(e) => {
                                                if (isHikoru) {
                                                    // Emergency fallback to the original file if data URL fails (unlikely)
                                                    e.target.src = item.companyLogo;
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col justify-center">
                                    <span className="text-6xl text-[#222944]/20 dark:text-[#BCC5DC]/40 mb-6 font-funnel leading-none font-black italic">“</span>
                                    <p className="text-xl md:text-[26px] font-medium text-[#222944] dark:text-[#BCC5DC] leading-tight mb-8">
                                        {item.quote}
                                    </p>
                                </div>

                                <div className="pt-8">
                                    <h4 className="text-lg font-black text-[#222944] dark:text-[#BCC5DC] uppercase tracking-tight mb-1">{item.author}</h4>
                                    <p className="text-[11px] font-bold text-[#222944]/50 dark:text-[#BCC5DC]/70 uppercase tracking-widest leading-[1.3]">
                                        {item.role}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default React.memo(OrganizationsCarousel);
