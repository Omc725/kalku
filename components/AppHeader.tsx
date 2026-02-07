
import React, { useState, useEffect } from 'react';
import { View, AppMode, DateMode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AppHeaderProps {
    onNavigate: (view: View, e: React.MouseEvent<HTMLButtonElement>) => void;
    calculatorMode: 'scientific' | 'basic';
    setCalculatorMode: (mode: 'scientific' | 'basic') => void;
    appMode: AppMode;
    setAppMode: (mode: AppMode) => void;
    onSwapUnits: () => void;
    dateMode?: DateMode;
    setDateMode?: (mode: DateMode) => void;
    financeOrder?: 'discountFirst' | 'taxFirst';
    setFinanceOrder?: (order: 'discountFirst' | 'taxFirst') => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
    onNavigate, 
    calculatorMode, 
    setCalculatorMode, 
    appMode, 
    setAppMode, 
    onSwapUnits, 
    dateMode, 
    setDateMode, 
    financeOrder, 
    setFinanceOrder 
}) => {
    const { t } = useLanguage();
    const [isAnimatingSwap, setIsAnimatingSwap] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [isMorphing, setIsMorphing] = useState(false);

    // Trigger morph animation on appMode change
    useEffect(() => {
        setIsMorphing(true);
        const timer = setTimeout(() => setIsMorphing(false), 500);
        return () => clearTimeout(timer);
    }, [appMode]);

    const handleSwapClick = () => {
        if (isAnimatingSwap) return;
        setIsAnimatingSwap(true);
        setRotation(r => r + 180);
        onSwapUnits();
        setTimeout(() => setIsAnimatingSwap(false), 400);
    };

    const modes: AppMode[] = ['calculator', 'converter', 'date', 'finance', 'bmi'];
    const activeIndex = modes.indexOf(appMode);
    
    const icons: Record<AppMode, string> = {
        calculator: 'calculate',
        converter: 'straighten',
        date: 'calendar_month',
        finance: 'attach_money',
        bmi: 'accessibility_new'
    };

    // Premium Segmented Control Styles with Recessed Depth
    const containerClass = "flex bg-black/30 rounded-full p-1 border-b border-white/5 shadow-inner-depth backdrop-blur-md";
    const activeBtnClass = "bg-surface text-text-color shadow-card ring-1 ring-white/10";
    const inactiveBtnClass = "text-text-muted hover:text-text-color hover:bg-white/5";
    const btnBaseClass = "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300";

    return (
        <header className="z-30 relative px-4 pt-4 pb-0 transition-all duration-300 flex flex-col gap-3">
            
            {/* NEW MENU DESIGN: Floating Glass Dock */}
            {/* GPU Optimization: Separated backdrop-blur layer to prevent continuous repaints of blur during child animations */}
            <nav className="relative w-full rounded-2xl shadow-float overflow-hidden z-10">
                 <div className="absolute inset-0 bg-surface/40 backdrop-blur-xl border border-white/10 border-b-black/10 pointer-events-none" />
                
                <div className="relative w-full h-10 grid grid-cols-5 p-1.5">
                    {/* The Sliding Pill - GPU Accelerated */}
                    {/* Replaced 'left' with 'transform' to avoid layout thrashing */}
                    {/* MORPH ANIMATION: Scales slightly on change to simulate fluid movement */}
                    <div
                        className={`absolute top-1.5 bottom-1.5 left-1.5 rounded-xl bg-primary shadow-lg ring-1 ring-white/20 transition-all duration-500 ease-premium z-0 will-change-transform overflow-hidden ${isMorphing ? 'scale-x-110 scale-y-90 brightness-110' : 'scale-100 brightness-100'}`}
                        style={{
                            width: 'calc((100% - 0.75rem) / 5)', 
                            transform: `translateX(${activeIndex * 100}%) translateZ(0)`
                        }}
                    >
                        {/* Glass Shine */}
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl"></div>
                    </div>

                    {/* The Buttons - Z-10 */}
                    {modes.map((mode) => {
                        const isActive = appMode === mode;
                        return (
                            <button
                                key={mode}
                                onClick={() => setAppMode(mode)}
                                className="group z-10 flex items-center justify-center relative active:scale-95 transition-transform duration-200"
                                aria-label={t(`mode_${mode}` as any)}
                                title={t(`mode_${mode}` as any)}
                            >
                                <span className={`
                                    material-symbols-outlined !text-[22px] transition-all duration-500 ease-out filter
                                    ${isActive 
                                        ? 'text-white drop-shadow-md scale-110' 
                                        : 'text-text-muted group-hover:text-text-color group-hover:drop-shadow-sm scale-100'}
                                `}>
                                    {icons[mode]}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </nav>

            {/* SECONDARY CONTROLS - COMPACT & DEEP */}
            <div className="flex items-center justify-between px-1 h-9">
                 {/* Left: Context Controls */}
                 <div className="flex items-center gap-2">
                     {appMode === 'calculator' && (
                        <div className={containerClass}>
                             <button onClick={() => setCalculatorMode('basic')} className={`${btnBaseClass} ${calculatorMode === 'basic' ? activeBtnClass : inactiveBtnClass}`}>{t('toggle_basic')}</button>
                             <button onClick={() => setCalculatorMode('scientific')} className={`${btnBaseClass} ${calculatorMode === 'scientific' ? activeBtnClass : inactiveBtnClass}`}>{t('toggle_scientific')}</button>
                        </div>
                     )}
                     
                     {appMode === 'converter' && (
                        <button onClick={handleSwapClick} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface/50 hover:bg-surface rounded-full border border-white/10 border-b-black/20 text-[10px] font-bold text-text-muted hover:text-primary transition-all active:scale-95 group backdrop-blur-md shadow-card">
                            <span style={{ transform: `rotate(${rotation}deg)` }} className="material-symbols-outlined !text-[16px] transition-transform duration-500 text-text-color group-hover:text-primary">swap_horiz</span>
                        </button>
                     )}
                     
                     {appMode === 'date' && setDateMode && (
                         <div className={containerClass}>
                            <button onClick={() => setDateMode('diff')} className={`${btnBaseClass} ${dateMode === 'diff' ? activeBtnClass : inactiveBtnClass}`}>{t('toggle_diff')}</button>
                            <button onClick={() => setDateMode('addsub')} className={`${btnBaseClass} ${dateMode === 'addsub' ? activeBtnClass : inactiveBtnClass}`}>{t('toggle_add')}</button>
                            <button onClick={() => setDateMode('convert')} className={`${btnBaseClass} ${dateMode === 'convert' ? activeBtnClass : inactiveBtnClass}`}>{t('toggle_convert')}</button>
                        </div>
                     )}

                     {appMode === 'finance' && setFinanceOrder && (
                        <button onClick={() => setFinanceOrder(financeOrder === 'discountFirst' ? 'taxFirst' : 'discountFirst')} className="px-4 py-1.5 bg-surface/50 hover:bg-surface rounded-full border border-white/10 text-[10px] font-bold text-text-muted hover:text-text-color transition-all active:scale-95 backdrop-blur-md shadow-card">
                            {financeOrder === 'discountFirst' ? t('discountFirst') : t('taxFirst')}
                        </button>
                     )}
                 </div>

                 {/* Right: Global Tools */}
                 <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => onNavigate(View.HISTORY, e)} 
                        className="w-9 h-9 p-0 flex items-center justify-center rounded-full bg-surface/60 hover:bg-surface text-text-muted hover:text-text-color transition-all border border-white/10 active:scale-90 backdrop-blur-md shadow-card group"
                        title={t('historyTitle')}
                    >
                        <span className="material-symbols-outlined !text-[20px] leading-none group-hover:rotate-12 transition-transform">history</span>
                    </button>
                    <button 
                        onClick={(e) => onNavigate(View.SETTINGS, e)} 
                        className="w-9 h-9 p-0 flex items-center justify-center rounded-full bg-surface/60 hover:bg-surface text-text-muted hover:text-text-color transition-all border border-white/10 active:scale-90 backdrop-blur-md shadow-card group"
                        title={t('settingsTitle')}
                    >
                        <span className="material-symbols-outlined !text-[20px] leading-none group-hover:rotate-90 transition-transform">settings</span>
                    </button>
                 </div>
            </div>
        </header>
    );
};

export default AppHeader;
