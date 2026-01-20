
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

    const handleSwapClick = () => {
        if (isAnimatingSwap) return;
        setIsAnimatingSwap(true);
        setRotation(r => r + 180);
        onSwapUnits();
        setTimeout(() => setIsAnimatingSwap(false), 400);
    };

    return (
        <header className="z-10 px-4 pt-6 pb-2 transition-opacity duration-300">
            {/* Arka plan bg-surface olarak güncellendi, rengi artık ThemeContext'teki opaque-glass belirler */}
            <div className="flex items-center justify-between gap-2 rounded-[2rem] bg-surface p-1.5 shadow-2xl backdrop-blur-2xl border border-white/10">
                
                {/* Left Island: Mode Specific Actions */}
                <div className="flex h-12 min-w-[3.5rem] items-center justify-start overflow-hidden relative">
                    <div key={appMode} className="flex items-center animate-pop-in-fast w-full">
                        {appMode === 'calculator' && (
                            <div className="flex items-center gap-1 rounded-full bg-background/50 p-1 ring-1 ring-white/5">
                                <button 
                                    onClick={() => setCalculatorMode('basic')} 
                                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${calculatorMode === 'basic' ? 'bg-primary text-text-on-primary shadow-md' : 'text-text-muted hover:text-text-color'}`}
                                >
                                    <span className="material-symbols-outlined !text-xl">calculate</span>
                                </button>
                                <button 
                                    onClick={() => setCalculatorMode('scientific')} 
                                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${calculatorMode === 'scientific' ? 'bg-primary text-text-on-primary shadow-md' : 'text-text-muted hover:text-text-color'}`}
                                >
                                    <span className="material-symbols-outlined !text-xl">science</span>
                                </button>
                            </div>
                        )}
                        {appMode === 'converter' && (
                            <button 
                                onClick={handleSwapClick} 
                                className="flex h-12 w-14 items-center justify-center rounded-[1.5rem] bg-primary text-text-on-primary shadow-lg transition-all duration-400 ease-spring active:scale-90 hover:brightness-110"
                            >
                                <span style={{ transform: `rotate(${rotation}deg)` }} className="material-symbols-outlined !text-2xl transition-transform duration-400 ease-spring">swap_horiz</span>
                            </button>
                        )}
                        {appMode === 'date' && setDateMode && (
                            <div className="flex items-center gap-1 rounded-full bg-background/50 p-1 ring-1 ring-white/5">
                                <button 
                                    onClick={() => setDateMode('diff')} 
                                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${dateMode === 'diff' ? 'bg-primary text-text-on-primary shadow-md' : 'text-text-muted hover:text-text-color'}`}
                                >
                                    <span className="material-symbols-outlined !text-xl">date_range</span>
                                </button>
                                <button 
                                    onClick={() => setDateMode('addsub')} 
                                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${dateMode === 'addsub' ? 'bg-primary text-text-on-primary shadow-md' : 'text-text-muted hover:text-text-color'}`}
                                >
                                    <span className="material-symbols-outlined !text-xl">edit_calendar</span>
                                </button>
                            </div>
                        )}
                        {appMode === 'finance' && financeOrder && setFinanceOrder && (
                            <button 
                                onClick={() => setFinanceOrder(financeOrder === 'discountFirst' ? 'taxFirst' : 'discountFirst')}
                                className="h-10 px-3 flex items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary border border-primary/30 whitespace-nowrap active:scale-95 transition-all hover:bg-primary/30"
                            >
                                {financeOrder === 'discountFirst' ? t('discountFirst') : t('taxFirst')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Center Island: Global App Mode Switcher */}
                <div className="flex items-center gap-0.5 rounded-full bg-background/50 p-1 ring-1 ring-white/5">
                    {(['calculator', 'converter', 'date', 'finance', 'bmi'] as AppMode[]).map((mode) => {
                        const icons: Record<AppMode, string> = {
                            calculator: 'calculate',
                            converter: 'straighten',
                            date: 'calendar_month',
                            finance: 'attach_money',
                            bmi: 'accessibility_new'
                        };
                        const isActive = appMode === mode;
                        return (
                            <button 
                                key={mode}
                                onClick={() => setAppMode(mode)} 
                                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${isActive ? 'text-text-on-secondary' : 'text-text-muted hover:text-text-color'}`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 z-0 scale-100 rounded-full bg-secondary shadow-md animate-pop-in-fast" />
                                )}
                                <span className="material-symbols-outlined relative z-10 !text-xl">{icons[mode]}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Right Island: History & Settings */}
                <div className="flex h-12 min-w-[3.5rem] items-center justify-end">
                    <div className="flex h-10 items-center gap-0.5 rounded-full bg-background/50 p-1 ring-1 ring-white/5">
                        <button 
                            onClick={(e) => onNavigate(View.HISTORY, e)} 
                            className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:text-primary active:scale-90"
                        >
                            <span className="material-symbols-outlined !text-xl">history</span>
                        </button>
                        <div className="h-4 w-px bg-white/10" />
                        <button 
                            onClick={(e) => onNavigate(View.SETTINGS, e)} 
                            className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:text-primary active:scale-90"
                        >
                            <span className="material-symbols-outlined !text-xl">settings</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
