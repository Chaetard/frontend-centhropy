import React from 'react';
import { motion } from 'framer-motion';

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

// Double the array for seamless looping
const duplicatedTestimonials = [...testimonials, ...testimonials];

const OrganizationsCarousel = () => {
    return (
        <section className="py-24 bg-white overflow-hidden w-full">
            <div className="max-w-[1800px] mx-auto px-5 md:px-10 mb-16">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40 mb-2 block">Our Reviews</span>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black">
                    ORGANIZACIONES
                </h2>
            </div>

            <div className="relative flex overflow-hidden">
                <motion.div
                    className="flex"
                    animate={{
                        x: [0, -((testimonials.length * 450) + (testimonials.length * 32))] // Adjust based on card width + gap
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
                    {duplicatedTestimonials.map((item, idx) => (
                        <div
                            key={`${item.id}-${idx}`}
                            className="w-[350px] md:w-[450px] shrink-0 mx-4 bg-[#f8f9fa] p-10 flex flex-col justify-between"
                            style={{ minHeight: '550px' }}
                        >
                            <div className="flex justify-between items-start mb-12">
                                <div className="w-14 h-14 rounded-full overflow-hidden border border-black/5">
                                    <img src={item.avatar} alt={item.author} className="w-full h-full object-cover grayscale" />
                                </div>
                                <div className="bg-transparent px-6 py-4 rounded-none border border-black flex items-center justify-center min-w-[150px] h-[65px]">
                                    <img
                                        src={item.companyLogo}
                                        alt={`${item.author} Company Logo`}
                                        className="max-h-full max-w-full w-auto h-auto block object-contain"
                                        onError={(e) => {
                                            console.error("Logo failed to load:", item.companyLogo);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                <span className="text-6xl text-black/20 mb-6 font-funnel leading-none font-black italic">“</span>
                                <p className="text-2xl md:text-3xl font-medium text-black leading-tight mb-8">
                                    {item.quote}
                                </p>
                            </div>

                            <div className="pt-8">
                                <h4 className="text-lg font-black text-black uppercase tracking-tight mb-1">{item.author}</h4>
                                <p className="text-[11px] font-bold text-black/50 uppercase tracking-widest leading-[1.3]">
                                    {item.role} <br />
                                    {item.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default OrganizationsCarousel;
