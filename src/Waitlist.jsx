import React from 'react';
import useIsMobile from './hooks/useIsMobile';
import WaitlistDesktop from './WaitlistDesktop';
import WaitlistMobile from './WaitlistMobile';

const Waitlist = () => {
    const isMobile = useIsMobile();
    return isMobile ? <WaitlistMobile /> : <WaitlistDesktop />;
};

export default Waitlist;
