import React, { Suspense, lazy } from 'react';
import useIsMobile from './hooks/useIsMobile';
import Logo from './components/Logo';

// Use lazy loading for the massive component files to optimize initial load
const CenthropyDesktop = lazy(() => import('./CenthropyDesktop'));
const CenthropyMobile = lazy(() => import('./CenthropyMobile'));

const CenthropyApp = () => {
    const isMobile = useIsMobile();

    return (
        <Suspense fallback={
            <div className="w-screen h-screen bg-white dark:bg-[#222944] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Logo className="text-[#222944] dark:text-[#BCC5DC]" />
                    <div className="w-12 h-[1px] bg-[#222944]/20 dark:bg-[#BCC5DC]/20 animate-pulse" />
                </div>
            </div>
        }>
            {isMobile ? <CenthropyMobile /> : <CenthropyDesktop />}
        </Suspense>
    );
};

export default CenthropyApp;
