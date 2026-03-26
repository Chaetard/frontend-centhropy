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
        author: "Juan Pérez",
        role: "CEO, QualityState",
        location: "Santiago, Chile",
        quote: "Su capacidad para centralizar nuestra data ha sido el motor de nuestro crecimiento este año.",
        companyLogo: "/customers/01_qualitystate_1.svg",
        avatar: "https://i.pravatar.cc/150?u=11"
    },
    {
        id: 2,
        author: "Maria García",
        role: "CTO, Firekitch",
        location: "Madrid, España",
        quote: "La integración fue impecable. Ahora tomamos decisiones basadas en realidades, no en intuiciones.",
        companyLogo: "/customers/02_firekitch_2.svg",
        avatar: "https://i.pravatar.cc/150?u=22"
    },
    {
        id: 3,
        author: "Carlos Ruiz",
        role: "Director de Operaciones, CityWork",
        location: "Bogotá, Colombia",
        quote: "Unify transformó la forma en que gestionamos nuestros locales. Una herramienta indispensable.",
        companyLogo: "/customers/03_citywork_3.svg",
        avatar: "https://i.pravatar.cc/150?u=33"
    },
    {
        id: 4,
        author: "Roberto Méndez",
        role: "Lead Engineer, ECS",
        location: "Miami, USA",
        quote: "Robustez y precisión militar. Justo lo que nuestra infraestructura necesitaba para escalar.",
        companyLogo: "/customers/09_ecs_4.svg",
        avatar: "https://i.pravatar.cc/150?u=44"
    },
    {
        id: 5,
        author: "Kenji Tanaka",
        role: "Founder, Hikoru",
        location: "Tokyo, Japan",
        quote: "Hemos reducido en un 40% el tiempo de análisis de datos gracias a la automatización de Unify.",
        companyLogo: "/customers/05_hikoru_5.svg",
        avatar: "https://i.pravatar.cc/150?u=55"
    },
    {
        id: 6,
        author: "Sofía López",
        role: "Marketing VP, Pangea",
        location: "Mexico City, Mexico",
        quote: "La visión 360 de nuestros clientes que nos da el Unify Data Center es simplemente asombrosa.",
        companyLogo: "/customers/06_pangea_6.svg",
        avatar: "https://i.pravatar.cc/150?u=66"
    },
    {
        id: 7,
        author: "Elena Santos",
        role: "Gerente Digital, RealGestión",
        location: "Lima, Perú",
        quote: "El soporte técnico y la flexibilidad de los conectores personalizados son de otro nivel.",
        companyLogo: "/customers/04_realgestion_7.svg",
        avatar: "https://i.pravatar.cc/150?u=77"
    },
    {
        id: 8,
        author: "Laura Bernal",
        role: "Directora de Sostenibilidad, Awua",
        location: "Barcelona, España",
        quote: "Sostenibilidad y datos de la mano. Unify nos ayuda a medir lo que realmente importa.",
        companyLogo: "/customers/08_awua_8.svg",
        avatar: "https://i.pravatar.cc/150?u=88"
    },
    {
        id: 9,
        author: "David Moore",
        role: "Head of Data, BestOk",
        location: "London, UK",
        quote: "Unify Agent es como tener a un analista senior disponible 24/7. Nuestra eficiencia se ha disparado.",
        companyLogo: "/customers/07_bestok_9.svg",
        avatar: "https://i.pravatar.cc/150?u=99"
    }
];

const duplicatedTestimonials = [...testimonials, ...testimonials];

const OrganizationsCarousel = () => {
    const isDarkMode = useIsDarkMode();
    
    return (
        <section className="pt-10 pb-24 bg-white dark:bg-[#222944] overflow-hidden w-full">
            <div className="max-w-[1800px] mx-auto px-5 md:px-10 mb-8">
                <div className="w-full h-[1px] bg-[#222944]/15 dark:bg-[#BCC5DC]/15 mb-10" />
                <h2 className="text-[45px] md:text-[70px] font-medium tracking-tighter text-[#222944] dark:text-[#BCC5DC] leading-none">
                    Organizaciones
                </h2>
            </div>

            <div className="relative flex overflow-hidden">
                <motion.div
                    className="flex"
                    animate={{
                        x: [0, -((testimonials.length * 450) + (testimonials.length * 32))]
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 140,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedTestimonials.map((item, idx) => {
                        const isHikoru = item.id === 5 || item.author.includes("Kenji");
                        
                        // Use inlined logos for Hikoru to avoid any path/cache issues
                        let currentLogoSrc = item.companyLogo;
                        if (isHikoru) {
                            currentLogoSrc = isDarkMode ? hikoruDarkDataUrl : hikoruLightDataUrl;
                        }
                        
                        return (
                            <div
                                key={`${item.id}-${idx}`}
                                className="w-[350px] md:w-[450px] shrink-0 mx-4 bg-[#f8f9fa] dark:bg-[#303A5F] p-10 flex flex-col justify-between"
                                style={{ minHeight: '550px' }}
                            >
                                <div className="flex justify-between items-start mb-12">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border border-[#222944]/15 dark:border-[#BCC5DC]/10">
                                        <img src={item.avatar} alt={item.author} className="w-full h-full object-cover grayscale" />
                                    </div>
                                    <div className="bg-transparent px-6 py-4 rounded-none border border-transparent flex items-center justify-center min-w-[150px] h-[65px]">
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
                                    <p className="text-2xl md:text-3xl font-medium text-[#222944] dark:text-[#BCC5DC] leading-tight mb-8">
                                        {item.quote}
                                    </p>
                                </div>

                                <div className="pt-8">
                                    <h4 className="text-lg font-black text-[#222944] dark:text-[#BCC5DC] uppercase tracking-tight mb-1">{item.author}</h4>
                                    <p className="text-[11px] font-bold text-[#222944]/50 dark:text-[#BCC5DC]/70 uppercase tracking-widest leading-[1.3]">
                                        {item.role} <br />
                                        {item.location}
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

export default OrganizationsCarousel;
