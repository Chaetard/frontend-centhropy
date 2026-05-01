import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { useIsDarkMode } from '../hooks/useIsDarkMode';
import worldData from '../assets/world-110m.json';

const OPERATION_POINTS = [
    { name: 'Venezuela', city: 'Caracas', lat: 10.4806, lng: -66.9036, status: 'Hub Principal' },
    { name: 'Colombia', city: 'Cartagena', lat: 10.3910, lng: -75.4794, status: 'Operación Activa' },
    { name: 'México', city: 'Jalisco', lat: 20.6595, lng: -103.3496, status: 'Operación Activa' },
    { name: 'Chile', city: 'Santiago', lat: -33.4489, lng: -70.6693, status: 'Operación Activa' },
    { name: 'Estados Unidos (WA)', city: 'Spokane', lat: 47.6588, lng: -117.4260, status: 'Operación Activa' },
    { name: 'Perú', city: 'Lima', lat: -12.0464, lng: -77.0428, status: 'Operación Activa' },
    { name: 'Estados Unidos (TX)', city: 'Dallas', lat: 32.7767, lng: -96.7970, status: 'Operación Activa' },
    { name: 'Estados Unidos (IL)', city: 'Chicago', lat: 41.8781, lng: -87.6298, status: 'Operación Activa' },
    { name: 'Estados Unidos (FL)', city: 'Orlando', lat: 28.5384, lng: -81.3789, status: 'Operación Activa' },
    { name: 'Países Bajos', city: 'Rotterdam', lat: 51.9225, lng: 4.4792, status: 'Hub Europa' },
    { name: 'Portugal', city: 'Vila Real', lat: 41.3003, lng: -7.7457, status: 'Operación Activa' },
    { name: 'Argentina', city: 'Buenos Aires', lat: -34.6037, lng: -58.3816, status: 'Operación Activa' },
    { name: 'España', city: 'Madrid', lat: 40.4168, lng: -3.7038, status: 'Hub Europa' },
];

const METRICS = [
    { label: 'Desde', value: '2025' },
    { label: 'Mercados', value: '13' },
    { label: 'Nodos GC', value: '160' },
    { label: 'Uptime SLA', value: '99.9%' },
    { label: 'Latencia', value: '<900ms' },
];

const OperationMap = () => {
    const isDark = useIsDarkMode();
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const sectionRef = React.useRef(null);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);

        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getAnchor = (city) => {
        const endCities = ['Spokane', 'Dallas', 'Jalisco', 'Cartagena', 'Lima', 'Santiago', 'Vila Real'];
        return endCities.includes(city) ? 'end' : 'start';
    };

    const getXOffset = (city) => {
        return getAnchor(city) === 'end' ? (isMobile ? -24 : -8) : (isMobile ? 24 : 8);
    };

    const mapContent = (
        <>
            <Geographies geography={worldData}>
                {({ geographies }) =>
                    geographies.map((geo) => (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            className="fill-[#E8EAEF] dark:fill-[#303A5F] stroke-white dark:stroke-[#1B2136] transition-colors duration-500"
                            strokeWidth={0.4}
                            style={{
                                default: { outline: 'none' },
                                hover: { outline: 'none', fill: isDark ? '#3D4870' : '#DDE0E7' },
                                pressed: { outline: 'none' },
                            }}
                        />
                    ))
                }
            </Geographies>

            {/* Operation Point Markers */}
            {OPERATION_POINTS.filter(point => !isMobile || !['Rotterdam', 'Vila Real', 'Madrid'].includes(point.city)).map((point, i) => (
                <Marker key={point.name} coordinates={[point.lng, point.lat]}>
                    {/* Core solid dot */}
                    <motion.circle
                        r={isMobile ? 4 : 3}
                        className="fill-[#30385F] dark:fill-[#BCC5DC]"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isVisible ? { scale: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.12, type: 'spring', stiffness: 300, damping: 20 }}
                    />
                    {/* Label */}
                    <motion.text
                        textAnchor={getAnchor(point.city)}
                        x={getXOffset(point.city)}
                        y={isMobile ? 3 : 4}
                        className="fill-[#222944] dark:fill-white pointer-events-none"
                        style={{
                            fontSize: isMobile ? 32 : 9,
                            fontWeight: 400,
                            letterSpacing: '0.06em',
                        }}
                        initial={{ opacity: 0 }}
                        animate={isVisible ? { opacity: isMobile ? 1 : 0.8 } : {}}
                        transition={{ duration: 0.5, delay: 0.8 + i * 0.12 }}
                    >
                        {point.city}
                    </motion.text>
                </Marker>
            ))}
        </>
    );


    return (
        <div
            ref={sectionRef}
            className="w-full bg-white dark:bg-[#1B2136] relative overflow-hidden"
        >
            <div className="flex flex-col max-w-[1800px] mx-auto px-5 md:px-10 pt-6 md:pt-16 pb-0 w-full">
                <div className="md:hidden">
                    <div className="w-full h-[1px] bg-[#222944]/15 dark:bg-[#BCC5DC]/15 mb-6" />
                    <h2 className="text-[36px] font-light tracking-tighter text-[#222944] dark:text-[#BCC5DC] leading-none mb-2">
                        Operación Global
                    </h2>
                </div>

                {/* CENTER — Map + Floating Metrics */}
                <motion.div
                    className="relative w-full flex flex-col md:flex-row align-bottom -mt-8 md:mt-0 md:translate-y-[6%]"
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : {}}
                    transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                    
                    {/* Floating Metrics (Left Side) - 100% Symmetrical to Map */}
                    <div className="absolute top-[4%] bottom-[8%] left-0 z-10 hidden md:flex flex-col w-[160px] lg:w-[200px] divide-y divide-[#222944]/10 dark:divide-[#BCC5DC]/10">
                        {METRICS.map((m, i) => (
                            <motion.div
                                key={m.label}
                                className="bg-transparent flex-1 flex flex-col justify-center pr-6"
                                initial={{ x: -20, opacity: 0 }}
                                animate={isVisible ? { x: 0, opacity: 1 } : {}}
                                transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#222944]/40 dark:text-[#BCC5DC]/40 block mb-1.5">
                                    {m.label}
                                </span>
                                <span className="text-[28px] lg:text-[34px] font-light tracking-tight text-[#222944] dark:text-[#BCC5DC] leading-none block">
                                    {m.value}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Solid World Map */}
                    <div className="w-[calc(100%+40px)] -mx-5 md:w-full md:mx-0 relative overflow-hidden flex justify-center pointer-events-none md:pointer-events-auto">
                        <ComposableMap
                            projection="geoNaturalEarth1"
                            projectionConfig={
                                isMobile 
                                    ? { scale: 225, center: [-75, 15] }
                                    : { scale: 155, center: [-20, 8] }
                            }
                            width={isMobile ? 400 : 900}
                            height={isMobile ? 600 : 430}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        >
                            {mapContent}
                        </ComposableMap>
                    </div>
                </motion.div>

                {/* Mobile Metrics Bento Grid (Bottom) */}
                <div className="md:hidden w-full mt-4 grid grid-cols-2 gap-[2px] pb-10">
                    {METRICS.map((m, i) => (
                        <motion.div
                            key={m.label}
                            className={`bg-[#F3F5F7] dark:bg-[#303A5F] p-4 flex flex-col justify-center ${i === 4 ? 'col-span-2 items-center' : 'items-start'}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={isVisible ? { y: 0, opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#222944]/40 dark:text-[#BCC5DC]/40 block mb-1">
                                {m.label}
                            </span>
                            <span className="text-[24px] font-light tracking-tight text-[#222944] dark:text-[#BCC5DC] leading-none block">
                                {m.value}
                            </span>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default React.memo(OperationMap);
