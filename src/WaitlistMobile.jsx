import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Logo from './components/Logo';

const InfoSquareIcon = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
    >
        <path d="M3 3h18v18H3z" />
        <line x1="12" y1="16" x2="12" y2="11" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

const shimmerStyle = `
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.shimmer-text {
  background: linear-gradient(90deg, #9ca3af 20%, #111 50%, #9ca3af 80%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 5s linear infinite;
  display: block;
  width: 100%;
}
`;

const countries = [
    { code: "AR", name: "Argentina" },
    { code: "BO", name: "Bolivia" },
    { code: "BR", name: "Brasil" },
    { code: "CL", name: "Chile" },
    { code: "CO", name: "Colombia" },
    { code: "CR", name: "Costa Rica" },
    { code: "CU", name: "Cuba" },
    { code: "EC", name: "Ecuador" },
    { code: "SV", name: "El Salvador" },
    { code: "ES", name: "España" },
    { code: "US", name: "Estados Unidos" },
    { code: "GT", name: "Guatemala" },
    { code: "HN", name: "Honduras" },
    { code: "MX", name: "México" },
    { code: "NI", name: "Nicaragua" },
    { code: "PA", name: "Panamá" },
    { code: "PY", name: "Paraguay" },
    { code: "PE", name: "Perú" },
    { code: "PR", name: "Puerto Rico" },
    { code: "DO", name: "República Dominicana" },
    { code: "UY", name: "Uruguay" },
    { code: "VE", name: "Venezuela" },
    { code: "OT", name: "Otro..." }
];

const WaitlistMobile = () => {
    const [selectedCountry, setSelectedCountry] = React.useState(null);
    const [selectedSolutions, setSelectedSolutions] = React.useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [isSolutionsOpen, setIsSolutionsOpen] = React.useState(false);
    const [isInfoOpen, setIsInfoOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);
    const solutionsRef = React.useRef(null);
    const infoRef = React.useRef(null);

    const [formData, setFormData] = React.useState({
        fullName: '',
        orgName: '',
        sector: '',
        email: '',
        orgContext: ''
    });

    const isFormValid = formData.fullName && formData.orgName && selectedCountry && formData.sector && formData.email && formData.orgContext && selectedSolutions.length > 0;

    const solutionsOptions = [
        "Unify Data Center",
        "TI Outsourcing",
        "Retail Intelligence"
    ];

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (solutionsRef.current && !solutionsRef.current.contains(event.target)) {
                setIsSolutionsOpen(false);
            }
            if (infoRef.current && !infoRef.current.contains(event.target)) {
                setIsInfoOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleSolution = (solution) => {
        setSelectedSolutions(prev =>
            prev.includes(solution)
                ? prev.filter(s => s !== solution)
                : [...prev, solution]
        );
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="font-funnel bg-white text-black selection:bg-black selection:text-white min-h-screen flex flex-col items-center p-6 pt-32 pb-24 overflow-x-hidden relative">
            <style>{shimmerStyle}</style>

            {/* Logo at the top */}
            <div className="absolute top-10 left-6 z-20">
                <Link to="/" className="hover:opacity-70 transition-opacity block">
                    <Logo className="text-black scale-90 origin-left" />
                </Link>
            </div>

            {/* Info Icon top right - Sharp Edges */}
            <div className="absolute top-10 right-6 z-20" ref={infoRef}>
                <button
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    className="focus:outline-none"
                >
                    <InfoSquareIcon className={`w-6 h-6 transition-colors ${isInfoOpen ? 'text-black' : 'text-gray-300'}`} />
                </button>

                {/* Tactical Info Card - Smaller for mobile */}
                <div className={`absolute top-10 right-0 w-64 bg-white border border-black p-5 transition-all duration-300 z-30 pointer-events-none ${isInfoOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                    <div className="mb-3 flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-black">EXCLUSIVITY_PROTOCOL</span>
                        <span className="text-[9px] font-mono text-black/30">[01]</span>
                    </div>
                    <p className="text-[10px] font-mono leading-relaxed text-gray-600 uppercase tracking-wider text-justify">
                        Nuestra lista de espera actúa como filtro de integridad y control de calidad para asegurar una respuesta operativa de alta precisión y personalizada para cada entidad admitida.
                    </p>
                    <div className="mt-4 pt-2 border-t border-black/5">
                        <span className="text-[8px] font-mono italic text-black/40">Exclusividad funcional autogestionada.</span>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">

                <form className="space-y-10 bg-white" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                    {/* Full Name */}
                    <div className="group relative">
                        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 block mb-1">
                            Nombre y Apellido
                        </label>
                        <input type="text" placeholder="Ej. Alex Mercer" name="fullName" value={formData.fullName} onChange={handleInputChange}
                            className="w-full bg-transparent border-b border-black/10 py-3 text-lg font-medium rounded-none outline-none focus:border-black transition-all placeholder:text-black/20 text-black" />
                    </div>

                    {/* Email */}
                    <div className="group relative">
                        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 block mb-1">
                            Correo de Contacto
                        </label>
                        <input type="email" placeholder="contact@domain.com" name="email" value={formData.email} onChange={handleInputChange}
                            className="w-full bg-transparent border-b border-black/10 py-3 text-lg font-medium rounded-none outline-none focus:border-black transition-all placeholder:text-black/20 text-black" />
                    </div>

                    {/* Organization */}
                    <div className="group relative">
                        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 block mb-1">
                            Organización
                        </label>
                        <input type="text" placeholder="Centhropy Inc." name="orgName" value={formData.orgName} onChange={handleInputChange}
                            className="w-full bg-transparent border-b border-black/10 py-3 text-lg font-medium rounded-none outline-none focus:border-black transition-all placeholder:text-black/20 text-black" />
                    </div>

                    {/* Country Custom Dropdown */}
                    <div className="group relative" ref={dropdownRef}>
                        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 block mb-1">
                            País de Operación
                        </label>
                        <div
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full border-b border-black/10 py-3 text-lg font-medium cursor-pointer flex justify-between items-center transition-all ${isDropdownOpen ? 'border-black' : ''}`}
                        >
                            <span className={selectedCountry ? "text-black" : "text-black/20 font-light"}>
                                {selectedCountry ? selectedCountry.name : "Seleccionar..."}
                            </span>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-300 text-black/20 ${isDropdownOpen ? 'rotate-[-90deg]' : 'rotate-90'}`} />
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-[calc(100%+1px)] left-0 w-full bg-black z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-y-auto max-h-60 border border-white/10 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-none">
                                <div className="flex flex-col">
                                    {countries.map((c) => (
                                        <div
                                            key={c.code}
                                            onClick={() => {
                                                setSelectedCountry(c);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-white/60 active:text-white active:bg-white/10 cursor-pointer transition-all border-b border-white/5 last:border-0"
                                        >
                                            {c.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sector */}
                    <div className="group relative">
                        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 block mb-1">
                            Sector Específico
                        </label>
                        <input type="text" placeholder="Fintech / AI" name="sector" value={formData.sector} onChange={handleInputChange}
                            className="w-full bg-transparent border-b border-black/10 py-3 text-lg font-medium rounded-none outline-none focus:border-black transition-all placeholder:text-black/20 text-black" />
                    </div>

                    {/* Solution Custom Dropdown (Multi-select) */}
                    <div className="group relative" ref={solutionsRef}>
                        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 block mb-1">
                            Solución
                        </label>
                        <div
                            onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                            className={`w-full border-b border-black/10 py-3 text-lg font-medium cursor-pointer flex justify-between items-center transition-all ${isSolutionsOpen ? 'border-black' : ''}`}
                        >
                            <span className={selectedSolutions.length > 0 ? "text-black text-sm" : "text-black/20 font-light"}>
                                {selectedSolutions.length > 0 ? selectedSolutions.join(", ") : "Seleccionar..."}
                            </span>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-300 text-black/20 ${isSolutionsOpen ? 'rotate-[-90deg]' : 'rotate-90'}`} />
                        </div>

                        {/* Dropdown Menu */}
                        {isSolutionsOpen && (
                            <div className="absolute top-[calc(100%+1px)] left-0 w-full bg-black z-50 animate-in fade-in slide-in-from-top-2 duration-200 border border-white/10">
                                <div className="flex flex-col">
                                    {solutionsOptions.map((opt) => (
                                        <div
                                            key={opt}
                                            onClick={() => toggleSolution(opt)}
                                            className="px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-white/60 active:text-white active:bg-white/10 cursor-pointer transition-all border-b border-white/5 last:border-0 flex items-center justify-between"
                                        >
                                            <span>{opt}</span>
                                            {selectedSolutions.includes(opt) && (
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Organization Context */}
                    <div className="group relative">
                        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 block mb-3">
                            Contexto de la Organización
                        </label>
                        <textarea
                            placeholder="Describa brevemente su organización, sus objetivos principales y sus desafíos"
                            rows="3"
                            name="orgContext"
                            value={formData.orgContext}
                            onChange={handleInputChange}
                            className="w-full bg-transparent border border-black/10 p-4 text-sm font-extralight rounded-none outline-none focus:border-black transition-all placeholder:text-black/20 text-black resize-none leading-relaxed"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-0">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`w-full py-5 font-black uppercase tracking-[0.3em] text-xs transition-all rounded-none flex items-center justify-center gap-3 active:scale-[0.98] ${isFormValid
                                ? "bg-black text-white hover:bg-gray-900"
                                : "bg-transparent border border-black text-black cursor-not-allowed opacity-50"
                                }`}
                        >
                            <span>Ingresar</span>
                            <ChevronRight className={`w-4 h-4 transition-transform ${isFormValid ? "translate-x-0" : ""}`} />
                        </button>
                        <p className="shimmer-text text-[10px] mt-12 text-center font-mono uppercase tracking-widest leading-relaxed">
                            Será evaluado y contactado por nuestro departamento de<br />integración estratégica.
                        </p>
                    </div>
                </form>
            </div>

            {/* Bottom Footer Section - Mobile Version */}
            <div className="mt-20 w-full flex flex-col items-center gap-8 text-[8px] font-mono text-black/20 tracking-[0.2em] uppercase pb-8">
                <Link to="/" className="text-black font-bold border-b border-black/20 pb-0.5 mb-2">VOLVER A HOME</Link>
                <div className="flex justify-between w-full px-4">
                    <span>Authenticity_Guaranteed</span>
                    <span>v.04</span>
                </div>
            </div>
        </div>
    );
};

export default WaitlistMobile;
