
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface DatePickerKeypadProps {
    date: Date;
    onChange: (date: Date) => void;
    // Generic calendar inputs
    inputState?: { year: number; month: number; day: number };
    onInputChange?: (y: number, m: number, d: number) => void;
    monthNames?: string[]; // Optional override for month names (e.g. Hijri, Persian)
    minYear?: number;
    maxYear?: number;
    daysInMonth?: number; // Optional override if we know max days
    // Column Label Overrides
    labelYear?: string;
    labelMonth?: string;
    labelDay?: string;
}

const ITEM_HEIGHT = 50; 
const RADIUS = 120; 
const VISIBLE_ITEMS = 7; 

interface PickerColumnProps {
    items: string[];
    value: number; // Current index
    onChange: (index: number) => void;
    loop?: boolean;
    align?: 'left' | 'center' | 'right';
}

const PickerColumn: React.FC<PickerColumnProps> = ({ items, value, onChange, loop = false, align = 'center' }) => {
    const { triggerVibration } = useTheme();
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
        
        // Haptic feedback on integer change
        if (currentInt !== s.lastInt) {
            triggerVibration(3); // Softer vibration
            s.lastInt = currentInt;
        }

        itemRefs.current.forEach((item, i) => {
            if (!item) return;
            // Calculate offset relative to the center of the viewport
            // i is the index in DOM (0 to VISIBLE_ITEMS-1)
            const offset = i - Math.floor(VISIBLE_ITEMS / 2); 
            
            // Determine which data item corresponds to this DOM element
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

            // Calculate precise angle difference from center
            const angleDiff = (itemIndex - s.angle); 
            const rotateX = angleDiff * 22; // Degree spread per item

            // Visibility culling
            if (rotateX > 90 || rotateX < -90 || !content) {
                item.style.visibility = 'hidden';
            } else {
                item.style.visibility = 'visible';
                
                // Visual Math
                const cosVal = Math.cos((rotateX * Math.PI) / 180);
                
                // Opacity: Fade out sharply as it leaves center
                const opacity = Math.pow(cosVal, 4); 
                item.style.opacity = opacity.toString();
                
                // Scale: Subtle scaling
                const scale = 0.85 + (Math.pow(cosVal, 2) * 0.15); 
                
                // 3D Transform
                item.style.transform = `rotateX(${-rotateX}deg) translateZ(${RADIUS}px) scale(${scale})`;
                
                // Active State Styling (Dynamic)
                const dist = Math.abs(angleDiff);
                if (dist < 0.3) {
                     item.style.color = 'var(--color-text)';
                     item.style.fontWeight = '600';
                     item.style.filter = 'brightness(1.2)';
                } else {
                     item.style.color = 'var(--color-text-muted)';
                     item.style.fontWeight = '400';
                     item.style.filter = 'none';
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
        
        // Physics
        s.velocity *= 0.92; // Friction
        s.angle += s.velocity;

        // Boundary bounce (if not looping)
        if (!loop) {
            const maxIndex = items.length - 1;
            if (s.angle < -0.3) { 
                s.angle += (-0.3 - s.angle) * 0.2; 
                s.velocity *= 0.6; 
            } else if (s.angle > maxIndex + 0.3) { 
                s.angle += ((maxIndex + 0.3) - s.angle) * 0.2; 
                s.velocity *= 0.6; 
            }
        }

        // Snap to grid
        if (Math.abs(s.velocity) < 0.002) {
            const target = Math.round(s.angle);
            const diff = target - s.angle;
            if (Math.abs(diff) < 0.002) {
                s.angle = target;
                render();
                triggerChange();
                return; // Stop animation
            }
            s.angle += diff * 0.15; // Snap speed
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
        
        // Sensitivity
        const angleDelta = delta / (ITEM_HEIGHT * 0.8);
        
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
            className={`flex-1 h-full relative touch-none cursor-grab active:cursor-grabbing select-none flex ${align === 'left' ? 'justify-start pl-4' : align === 'right' ? 'justify-end pr-4' : 'justify-center'}`}
            ref={containerRef}
            onPointerDown={(e) => { 
                e.preventDefault(); 
                e.currentTarget.setPointerCapture(e.pointerId); 
                handleStart(e.clientY); 
            }}
            onPointerMove={(e) => { 
                e.preventDefault(); 
                handleMove(e.clientY); 
            }}
            onPointerUp={(e) => { 
                e.currentTarget.releasePointerCapture(e.pointerId); 
                handleEnd(); 
            }}
            onPointerCancel={() => handleEnd()}
            style={{ zIndex: 20 }}
        >
            <div className="absolute inset-0 overflow-hidden" style={{ perspective: '800px' }}>
                <div ref={wheelRef} className="absolute top-1/2 w-full h-0" style={{ transformStyle: 'preserve-3d' }}>
                    {Array.from({ length: VISIBLE_ITEMS }).map((_, i) => (
                        <div 
                            key={i}
                            ref={(el) => { itemRefs.current[i] = el; }}
                            className={`absolute left-0 right-0 flex items-center ${align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'} backface-hidden font-display text-2xl tracking-tight`} 
                            style={{ 
                                height: ITEM_HEIGHT, 
                                marginTop: -ITEM_HEIGHT / 2, 
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                willChange: 'transform, opacity, visibility' 
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const DatePickerKeypad: React.FC<DatePickerKeypadProps> = ({ 
    date, onChange, 
    inputState, onInputChange, 
    monthNames, minYear = 1300, maxYear = 2100, daysInMonth = 31,
    labelYear, labelMonth, labelDay
}) => {
    const { language, t } = useLanguage();
    const { isGlassmorphismEnabled } = useTheme();
    
    // Determine which mode we are in: Generic Input or Gregorian Date
    const isGenericInput = inputState !== undefined && onInputChange !== undefined;

    const days = useMemo(() => {
        // If it's a small fixed number (like Mayan Tun/Uinal ranges passed via daysInMonth), adjust array
        return Array.from({ length: daysInMonth }, (_, i) => (i + (isGenericInput && daysInMonth < 28 ? 0 : 1)).toString());
    }, [daysInMonth, isGenericInput]);

    const months = useMemo(() => {
        if (monthNames && monthNames.length > 0) return monthNames;
        // Default Gregorian
        return Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleString(language, { month: 'long' }));
    }, [language, monthNames]);

    const years = useMemo(() => {
        const start = minYear;
        const end = maxYear;
        return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString());
    }, [minYear, maxYear]);

    // HANDLERS
    const updateDay = (index: number) => {
        const d = isGenericInput && daysInMonth < 28 ? index : index + 1; // 0-based if Mayan Tun (0-19), else 1-based
        if (isGenericInput) {
            onInputChange!(inputState!.year, inputState!.month, d);
        } else {
            const newDate = new Date(date);
            const maxDays = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
            newDate.setDate(Math.min(d, maxDays));
            onChange(newDate);
        }
    };

    const updateMonth = (index: number) => {
        if (isGenericInput) {
             onInputChange!(inputState!.year, index, inputState!.day);
        } else {
            const newDate = new Date(date);
            const maxDays = new Date(newDate.getFullYear(), index + 1, 0).getDate();
            if (newDate.getDate() > maxDays) newDate.setDate(maxDays);
            newDate.setMonth(index);
            onChange(newDate);
        }
    };

    const updateYear = (index: number) => {
        const y = minYear + index;
        if (isGenericInput) {
            onInputChange!(y, inputState!.month, inputState!.day);
        } else {
            const newDate = new Date(date);
            const maxDays = new Date(y, newDate.getMonth() + 1, 0).getDate();
            if (newDate.getDate() > maxDays) newDate.setDate(maxDays);
            newDate.setFullYear(y);
            onChange(newDate);
        }
    };

    // CURRENT VALUES
    const currentDayVal = isGenericInput ? (daysInMonth < 28 ? inputState!.day : inputState!.day - 1) : (date.getDate() - 1);
    const currentMonthVal = isGenericInput ? inputState!.month : date.getMonth();
    const currentYearVal = isGenericInput ? (inputState!.year - minYear) : (date.getFullYear() - minYear);

    // Safety checks for indices
    const safeDayVal = Math.max(0, Math.min(currentDayVal, days.length - 1));
    const safeMonthVal = Math.max(0, Math.min(currentMonthVal, months.length - 1));
    const safeYearVal = Math.max(0, Math.min(currentYearVal, years.length - 1));

    return (
        <div className="relative h-full w-full flex flex-col font-display animate-fade-in select-none">
            
            {/* Background Gradients for depth (Top/Bottom Fades) */}
            <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-surface/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-surface/90 to-transparent z-10 pointer-events-none" />

            {/* Header Labels */}
            <div className="absolute top-2 left-0 right-0 z-30 flex px-8 pointer-events-none">
                <div className="flex-1 text-center text-[10px] font-bold text-text-muted/70 uppercase tracking-widest">{labelDay || t('days')}</div>
                <div className="flex-[2] text-center text-[10px] font-bold text-text-muted/70 uppercase tracking-widest">{labelMonth || t('months')}</div>
                <div className="flex-1 text-center text-[10px] font-bold text-text-muted/70 uppercase tracking-widest">{labelYear || t('years')}</div>
            </div>

            {/* The Lens (Active Highlight) */}
            <div 
                className={`absolute top-1/2 left-3 right-3 -translate-y-1/2 z-0 pointer-events-none rounded-xl border shadow-inner transition-all duration-300 ${
                    isGlassmorphismEnabled 
                        ? 'bg-white/5 border-white/10 backdrop-blur-[2px]' 
                        : 'bg-transparent border-white/10'
                }`}
                style={{ height: ITEM_HEIGHT, marginTop: 0 }}
            >
                {/* Subtle shine on top edge */}
                <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                {/* Subtle shadow on bottom edge */}
                <div className="absolute inset-x-4 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            </div>

            {/* Columns */}
            <div className="flex-1 flex px-4 relative z-0 h-full items-center">
                {/* Day */}
                <div className="flex-1 h-full">
                    <PickerColumn items={days} value={safeDayVal} onChange={updateDay} loop={true} />
                </div>
                
                {/* Divider */}
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/5 to-transparent flex-shrink-0" />

                {/* Month - Wider */}
                <div className="flex-[2] h-full">
                    <PickerColumn items={months} value={safeMonthVal} onChange={updateMonth} loop={true} />
                </div>

                {/* Divider */}
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/5 to-transparent flex-shrink-0" />

                {/* Year */}
                <div className="flex-1 h-full">
                    <PickerColumn items={years} value={safeYearVal} onChange={updateYear} loop={false} />
                </div>
            </div>
        </div>
    );
};

export default DatePickerKeypad;
