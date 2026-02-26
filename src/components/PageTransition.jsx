import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ stage }) => {
    const [visible, setVisible] = useState(stage === 'covering');
    const [translateX, setTranslateX] = useState('0vw');
    const [progress, setProgress] = useState(stage === 'covering' ? 20 : 0);
    const timerRef = useRef([]);

    const clearTimers = () => {
        timerRef.current.forEach(clearTimeout);
        timerRef.current = [];
    };

    const schedule = (fn, delay) => {
        const id = setTimeout(fn, delay);
        timerRef.current.push(id);
    };

    useEffect(() => {
        if (stage === 'covering') {
            clearTimers();
            setVisible(true);
            setTranslateX('0vw');
            setProgress(0);

            // Artificial progress while waiting for router to swap
            schedule(() => setProgress(40), 10);
        }

        if (stage === 'revealing' && visible) {
            setProgress(70);

            // Short delay to ensure the new content has rendered behind the curtain
            schedule(() => {
                setProgress(100);
                schedule(() => {
                    setTranslateX('100vw');
                    schedule(() => {
                        setVisible(false);
                        // Prepare for next time
                        setTranslateX('0vw');
                    }, 600);
                }, 150);
            }, 200);
        }

        // Safety: if stage becomes idle, make sure we are not visible
        if (stage === 'idle') {
            setVisible(false);
        }

        return clearTimers;
    }, [stage, visible]);

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 2147483647,
                backgroundColor: '#ffffff',
                transform: `translateX(${translateX})`,
                transition: translateX === '0vw'
                    ? 'none'
                    : 'transform 600ms cubic-bezier(0.77, 0, 0.175, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                willChange: 'transform',
                pointerEvents: 'all'
            }}
        >
            <div style={{
                width: '160px',
                height: '1px',
                backgroundColor: '#e8e8e8',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${progress}%`,
                        backgroundColor: '#000000',
                        transition: 'width 400ms cubic-bezier(0.165, 0.84, 0.44, 1)',
                    }}
                />
            </div>
        </div>
    );
};

export default PageTransition;
