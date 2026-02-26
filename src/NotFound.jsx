import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, AlertTriangle } from 'lucide-react';

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

const NotFound = () => {
    return (
        <div className="font-funnel bg-white text-black selection:bg-black selection:text-white min-h-screen flex flex-col items-center p-6 pt-32 pb-24 overflow-x-hidden relative">
            <style>{shimmerStyle}</style>

            {/* Brand Title at the top */}
            <div className="absolute top-10 left-6 z-20">
                <Link to="/" className="hover:opacity-70 transition-opacity blockOrigin-left">
                    <span className="text-xl font-medium tracking-tighter text-black">Unify Data Center</span>
                </Link>
            </div>

            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both pt-20 flex flex-col items-center text-center">

                <AlertTriangle className="w-16 h-16 text-black mb-8" />

                <div className="mb-6 flex flex-col items-center border-b border-black/10 w-full pb-6">
                    <span className="text-[12px] font-mono font-bold tracking-[0.3em] uppercase text-black mb-2">ERROR_404</span>
                    <h1 className="text-4xl font-bold tracking-tighter mb-2">CONNECTION LOST</h1>
                    <span className="text-[10px] font-mono text-black/50 tracking-[0.2em]">[SYSTEM_FAILURE: SECTOR NOT FOUND]</span>
                </div>

                <p className="text-[10px] font-mono leading-relaxed text-gray-600 uppercase tracking-wider text-center px-4 mb-12 flex-grow">
                    El sector de datos solicitado no existe en nuestros registros o el acceso ha sido revocado.
                    <br /><br />
                    Verifique el protocolo de enrutamiento asignado.
                </p>

                <div className="w-full max-w-xs mt-4">
                    <Link
                        to="/"
                        className="w-full py-5 text-white bg-black hover:bg-gray-900 active:scale-[0.98] flex items-center justify-center gap-3 transition-all rounded-none font-medium uppercase tracking-[0.3em] text-xs"
                    >
                        <span>REINICIAR CONEXIÓN</span>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <p className="shimmer-text text-[10px] mt-12 text-center font-mono uppercase tracking-widest leading-relaxed">
                    Operación de fallo registrada<br />por el sistema de seguridad.
                </p>
            </div>

            {/* Bottom Footer Section */}
            <div className="mt-auto w-full flex flex-col items-center gap-8 text-[8px] font-mono text-black/20 tracking-[0.2em] uppercase pt-16">
                <div className="flex justify-between w-full px-4">
                    <span>Protocol_Status: Disconnected</span>
                    <span>v.26</span>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
