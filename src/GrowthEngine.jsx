import React from 'react';
import useIsMobile from './hooks/useIsMobile';
import GrowthEngineDesktop from './GrowthEngineDesktop';
import GrowthEngineMobile from './GrowthEngineMobile';

const GrowthEngine = () => {
    const isMobile = useIsMobile();
    return isMobile ? <GrowthEngineMobile /> : <GrowthEngineDesktop />;
};

export default GrowthEngine;
