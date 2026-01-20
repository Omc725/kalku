import React, { useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface DatePickerKeypadProps {
    date: Date;
    onChange: (date: Date) => void;
}

const ITEM_HEIGHT = 48; 
const RADIUS = 110; 
const VISIBLE_ITEMS = 21; 

interface PickerColumnProps {
    items: string[];
    value: number; // Current index
    onChange: (index: number) => void;
    loop?: boolean;
}

const PickerColumn: React.FC<PickerColumnProps> = ({ items, value, onChange, loop = false }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wheelRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    
    // Physics state
    const state = useRef({
        angle: 0,
        isDragging: false,
        lastY: 0,
        velocity: 0,
        lastInt: 0,
        rafId: 0
    });

    useEffect(() => {
        if (!state.current.isDragging) {
            state.current.angle = value;
            state.current.velocity = 0;
            state.current.lastInt = Math.round(value);
            render();
        }
    }, [value]);

    useEffect(() => {
        return () => {
            if (state.current.rafId) cancelAnimationFrame(state.current.rafId);
        };
    }, []);

    const render = () => {
        if (!wheelRef.current) return;
        const s = state.current;
        const centerIndex = Math.floor(s.angle);
        const currentInt = Math.round(s.angle);
        if (currentInt !== s.lastInt) {
            if (navigator.vibrate) navigator.vibrate(10);
            s.lastInt = currentInt;
        }

        itemRefs.current.forEach((item, i) => {
            if (!item) return;
            const offset = i - Math.floor(VISIBLE_ITEMS / 2);
            const itemIndex = centerIndex + offset;
            let content = "";
            let dataIndex = itemIndex;

            if (loop) {
                const len = items.length;
                dataIndex = ((itemIndex % len) + len) % len;
                content = items[dataIndex];
            } else {
                if (itemIndex >= 0 && itemIndex < items.length) {
                    content = items[itemIndex];
                }
            }

            if (item.innerText !== content) item.innerText = content;

            const angleDiff = (itemIndex - s.angle); 
            const rotateX = angleDiff * 22; 

            if (rotateX > 90 || rotateX < -90) {
                item.style.display = 'none';
            } else {
                item.style.display = 'flex';
                item.style.transform = `rotateX(${-rotateX}deg) translateZ(${RADIUS}px) translateY(2px)`;
                const dist = Math.abs(angleDiff);
                const opacity = Math.max(0.1, 1 - dist * 0.6);
                item.style.opacity = opacity.toString();
                
                if (dist < 0.25) {
                    item.style.color = 'var(--color-text)';
                    item.style.fontWeight = '700';
                    item.style.fontSize = '1.5rem'; 
                } else {
                    item.style.color = 'var(--color-text-muted)';
                    item.style.fontWeight = '500';
                    item.style.fontSize = '1.125rem'; 
                }
            }
        });
    };

    const triggerChange = () => {
        let rawIndex = Math.round(state.current.angle);
        let finalIndex = rawIndex;
        if (loop) {
            const len = items.length;
            finalIndex = ((rawIndex % len) + len) % len;
        } else {
            if (finalIndex < 0) finalIndex = 0;
            if (finalIndex >= items.length) finalIndex = items.length - 1;
        }
        if (finalIndex !== value) onChange(finalIndex);
    };

    const loopAnim = () => {
        const s = state.current;
        if (s.isDragging) return;
        s.velocity *= 0.92;
        s.angle += s.velocity;

        if (!loop) {
            const maxIndex = items.length - 1;
            if (s.angle < -0.5) { s.angle += (-0.5 - s.angle) * 0.2; s.velocity *= 0.8; } 
            else if (s.angle > maxIndex + 0.5) { s.angle += ((maxIndex + 0.5) - s.angle) * 0.2; s.velocity *= 0.8; }
        }

        if (Math.abs(s.velocity) < 0.005) {
            const target = Math.round(s.angle);
            const diff = target - s.angle;
            if (Math.abs(diff) < 0.005) {
                s.angle = target;
                render();
                triggerChange();
                return; 
            }
            s.angle += diff * 0.2;
        }
        render();
        s.rafId = requestAnimationFrame(loopAnim);
    };

    const handleStart = (y: number) => {
        state.current.isDragging = true;
        state.current.lastY = y;
        state.current.velocity = 0;
        cancelAnimationFrame(state.current.rafId);
    };

    const handleMove = (y: number) => {
        if (!state.current.isDragging) return;
        const delta = state.current.lastY - y;
        state.current.lastY = y;
        const angleDelta = delta / ITEM_HEIGHT;
        state.current.angle += angleDelta;
        state.current.velocity = angleDelta;
        render();
    };

    const handleEnd = () => {
        state.current.isDragging = false;
        loopAnim();
    };

    return (
        <div 
            className="flex-1 h-full relative touch-none cursor-grab active:cursor-grabbing group select-none"
            ref={containerRef}
            onPointerDown={(e) => { e.preventDefault(); (e.target as Element).setPointerCapture(e.pointerId); handleStart(e.clientY); }}
            onPointerMove={(e) => { e.preventDefault(); handleMove(e.clientY); }}
            onPointerUp={(e) => { (e.target as Element).releasePointerCapture(e.pointerId); handleEnd(); }}
            onPointerCancel={() => handleEnd()}
            onPointerLeave={() => { if(state.current.isDragging) handleEnd(); }}
        >
            <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden" style={{ perspective: '1000px' }}>
                <div ref={wheelRef} className="absolute top-1/2 left-0 right-0 h-0 w-full" style={{ transformStyle: 'preserve-3d' }}>
                    {Array.from({ length: VISIBLE_ITEMS }).map((_, i) => (
                        <div 
                            key={i}
                            ref={(el) => { itemRefs.current[i] = el; }}
                            className="absolute left-0 right-0 flex items-center justify-center backface-hidden"
                            style={{ height: ITEM_HEIGHT, marginTop: -ITEM_HEIGHT / 2, backfaceVisibility: 'hidden', willChange: 'transform, opacity' }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const DatePickerKeypad: React.FC<DatePickerKeypadProps> = ({ date, onChange }) => {
    const { language, t } = useLanguage();
    const days = useMemo(() => Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')), []);
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleString(language, { month: 'short' }).toUpperCase()), [language]);
    const startYear = 1900;
    const years = useMemo(() => Array.from({ length: 201 }, (_, i) => (startYear + i).toString()), []);

    const updateDay = (index: number) => {
        const d = index + 1;
        const newDate = new Date(date);
        const maxDays = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
        newDate.setDate(Math.min(d, maxDays));
        onChange(newDate);
    };

    const updateMonth = (index: number) => {
        const newDate = new Date(date);
        const maxDays = new Date(newDate.getFullYear(), index + 1, 0).getDate();
        if (newDate.getDate() > maxDays) newDate.setDate(maxDays);
        newDate.setMonth(index);
        onChange(newDate);
    };

    const updateYear = (index: number) => {
        const y = startYear + index;
        const newDate = new Date(date);
        const maxDays = new Date(y, newDate.getMonth() + 1, 0).getDate();
        if (newDate.getDate() > maxDays) newDate.setDate(maxDays);
        newDate.setFullYear(y);
        onChange(newDate);
    };

    return (
        <div className="relative h-full w-full bg-keypad flex flex-col font-display animate-fade-in select-none">
            {/* Headers with more contrast or separation */}
            <div className="absolute top-6 left-0 right-0 z-30 flex px-4 pointer-events-none">
                <div className="flex-1 text-center text-xs font-extrabold text-text-color uppercase tracking-widest opacity-80">{t('days')}</div>
                <div className="flex-1 text-center text-xs font-extrabold text-text-color uppercase tracking-widest opacity-80">{t('months')}</div>
                <div className="flex-1 text-center text-xs font-extrabold text-text-color uppercase tracking-widest opacity-80">{t('years')}</div>
            </div>

            {/* Background Contrast for the Wheels Area */}
            <div className="absolute inset-x-4 top-14 bottom-14 bg-surface/30 rounded-3xl z-0" />

            {/* Masking Gradients */}
            <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-keypad via-keypad/95 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-keypad via-keypad/95 to-transparent z-10 pointer-events-none" />

            {/* Selection Highlight Bar */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0 pointer-events-none" style={{ height: ITEM_HEIGHT + 4 }}>
                <div className="absolute inset-x-4 inset-y-0 bg-primary/20 rounded-lg" />
            </div>

            {/* Columns */}
            <div className="flex-1 flex px-4 relative z-0 mt-4">
                <PickerColumn items={days} value={date.getDate() - 1} onChange={updateDay} loop={true} />
                <PickerColumn items={months} value={date.getMonth()} onChange={updateMonth} loop={true} />
                <PickerColumn items={years} value={date.getFullYear() - startYear} onChange={updateYear} loop={false} />
            </div>
        </div>
    );
};

export default DatePickerKeypad;