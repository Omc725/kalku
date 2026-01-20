
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DateMode } from '../types';
import DatePickerKeypad from './DatePickerKeypad';

// Hook to manage Date Calculator logic
export const useDateCalculator = (mode: DateMode) => {
    const { language, t } = useLanguage();
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [years, setYears] = useState<string>('');
    const [months, setMonths] = useState<string>('');
    const [days, setDays] = useState<string>('');
    const [operation, setOperation] = useState<'add' | 'subtract'>('add');
    const [activeField, setActiveField] = useState<'start' | 'end' | 'years' | 'months' | 'days'>('start');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    useEffect(() => {
        setResult(null);
        setIsPickerOpen(false); 
        if (mode === 'diff') setActiveField('start');
        else setActiveField('start');
    }, [mode]);

    const calculateDiff = () => {
        const d1 = new Date(startDate);
        const d2 = new Date(endDate);
        d1.setHours(0,0,0,0);
        d2.setHours(0,0,0,0);

        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const diffDaysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let y = d2.getFullYear() - d1.getFullYear();
        let m = d2.getMonth() - d1.getMonth();
        let d = d2.getDate() - d1.getDate();

        if (d < 0) {
            m--;
            const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
            d += prevMonth.getDate();
        }
        if (m < 0) {
            y--;
            m += 12;
        }
        
        if (d1 > d2) {
             const min = d1 < d2 ? d1 : d2;
             const max = d1 < d2 ? d2 : d1;
             
             let yy = max.getFullYear() - min.getFullYear();
             let mm = max.getMonth() - min.getMonth();
             let dd = max.getDate() - min.getDate();
             
             if (dd < 0) {
                mm--;
                const prevMonth = new Date(max.getFullYear(), max.getMonth(), 0);
                dd += prevMonth.getDate();
             }
             if (mm < 0) {
                yy--;
                mm += 12;
             }
             setResult(`${yy} ${t('years')}, ${mm} ${t('months')}, ${dd} ${t('days')} (${diffDaysTotal} ${t('days')})`);
        } else {
             setResult(`${y} ${t('years')}, ${m} ${t('months')}, ${d} ${t('days')} (${diffDaysTotal} ${t('days')})`);
        }
    };

    const calculateAddSub = () => {
        const d = new Date(startDate);
        const y = parseInt(years) || 0;
        const m = parseInt(months) || 0;
        const dy = parseInt(days) || 0;

        if (operation === 'add') {
            d.setFullYear(d.getFullYear() + y);
            d.setMonth(d.getMonth() + m);
            d.setDate(d.getDate() + dy);
        } else {
            d.setFullYear(d.getFullYear() - y);
            d.setMonth(d.getMonth() - m);
            d.setDate(d.getDate() - dy);
        }
        setResult(d.toLocaleDateString(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };

    const handlePadClick = (value: string) => {
        if (isPickerOpen) return;

        // In Diff mode, keypad is inactive unless picker is open (which handles itself)
        if (mode === 'diff') return; 

        if (activeField === 'start' && mode === 'addsub') {
             setIsPickerOpen(true);
             return;
        }

        const setMap = {
            'years': setYears,
            'months': setMonths,
            'days': setDays,
            'start': () => {},
            'end': () => {}
        };
        const setter = setMap[activeField];
        if (activeField === 'start' || activeField === 'end') return; 

        if (value === 'backspace') {
            setter(prev => prev.length > 0 ? prev.slice(0, -1) : '');
        } else if (value === 'AC') {
            setYears(''); setMonths(''); setDays('');
        } else if (value >= '0' && value <= '9') {
            setter(prev => prev + value);
        }
    };

    return {
        startDate, setStartDate,
        endDate, setEndDate,
        years, setYears,
        months, setMonths,
        days, setDays,
        operation, setOperation,
        activeField, setActiveField,
        isPickerOpen, setIsPickerOpen,
        result,
        calculateDiff,
        calculateAddSub,
        handlePadClick
    };
};

export interface DateCalculatorViewProps {
    mode: DateMode;
    logic: ReturnType<typeof useDateCalculator>;
}

export const DateCalculatorView: React.FC<DateCalculatorViewProps> = ({ mode, logic }) => {
    const { t, language } = useLanguage();
    const {
        startDate, endDate, years, months, days, operation, activeField,
        setIsPickerOpen, setActiveField, setOperation,
        result, calculateDiff, calculateAddSub
    } = logic;

    const formatDateDisplay = (d: Date) => d.toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' });
    const openPicker = (field: 'start' | 'end') => {
        setActiveField(field);
        setIsPickerOpen(true);
    };

    const inputContainerBase = "w-full rounded-2xl py-4 px-5 transition-all duration-300 border cursor-pointer relative overflow-hidden group flex flex-col justify-center min-h-0 flex-1";
    const inputContainerInactive = "bg-surface border-transparent hover:bg-surface/80";
    const inputContainerActive = "bg-surface border-primary shadow-[0_4px_20px_-8px_var(--color-primary)] ring-1 ring-primary/20";
    
    const labelClass = "text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 block";
    const valueClass = "text-xl font-bold text-text-color truncate";
    
    const miniInputContainer = (isActive: boolean) => `
        flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 cursor-pointer border h-full
        ${isActive ? 'bg-surface border-primary shadow-sm' : 'bg-surface border-transparent hover:bg-surface/80'}
    `;

    // Render for Diff Mode
    const diffContent = (
        <div className="h-full w-full flex flex-col p-4">
             <div className="flex-1 flex flex-col gap-3 min-h-0">
                <div onClick={() => openPicker('start')} className={`${inputContainerBase} ${activeField === 'start' ? inputContainerActive : inputContainerInactive}`}>
                    <span className={labelClass}>{t('from')}</span>
                    <div className={valueClass}>{formatDateDisplay(startDate)}</div>
                </div>
                
                <div onClick={() => openPicker('end')} className={`${inputContainerBase} ${activeField === 'end' ? inputContainerActive : inputContainerInactive}`}>
                    <span className={labelClass}>{t('to')}</span>
                    <div className={valueClass}>{formatDateDisplay(endDate)}</div>
                </div>

                 <button onClick={calculateDiff} className="shrink-0 w-full rounded-2xl bg-secondary py-3 text-lg font-bold text-text-on-secondary shadow-lg active:scale-95 transition-transform hover:brightness-110 mt-auto">
                    {t('calculate')}
                </button>
            </div>
            
            {result && (
                <div className="animate-pop-in shrink-0 w-full mt-3">
                    <div className="rounded-2xl bg-surface border border-primary/20 p-4 text-center shadow-lg">
                        <p className="text-sm font-bold text-text-muted uppercase mb-1">{t('result')}</p>
                        <p className="text-xl font-bold text-primary break-words leading-tight">{result}</p>
                    </div>
                </div>
            )}
        </div>
    );

    // Render for Add/Sub Mode
    const addSubContent = (
         <div className="h-full w-full flex flex-col p-4">
            <div className="flex-1 flex flex-col gap-3 min-h-0">
                <div onClick={() => openPicker('start')} className={`${inputContainerBase} ${activeField === 'start' ? inputContainerActive : inputContainerInactive}`}>
                    <span className={labelClass}>{t('startDate')}</span>
                    <div className={valueClass}>{formatDateDisplay(startDate)}</div>
                </div>

                <div className="flex gap-3 h-24 shrink-0 w-full">
                    <div className="w-14 bg-surface rounded-full p-1.5 flex flex-col justify-between border border-text-color/5 shadow-inner shrink-0">
                        <button onClick={() => setOperation('add')} className={`w-full aspect-square flex items-center justify-center rounded-full transition-all duration-300 ${operation === 'add' ? 'bg-primary text-text-on-primary shadow-md scale-100' : 'text-text-muted hover:bg-text-color/5 scale-90'}`}><span className="material-symbols-outlined text-xl font-bold">add</span></button>
                        <div className="flex-1 w-px bg-text-color/10 mx-auto my-1"></div>
                        <button onClick={() => setOperation('subtract')} className={`w-full aspect-square flex items-center justify-center rounded-full transition-all duration-300 ${operation === 'subtract' ? 'bg-primary text-text-on-primary shadow-md scale-100' : 'text-text-muted hover:bg-text-color/5 scale-90'}`}><span className="material-symbols-outlined text-xl font-bold">remove</span></button>
                    </div>

                    <div className="flex-1 grid grid-cols-3 gap-2">
                        <div onClick={() => { setActiveField('years'); setIsPickerOpen(false); }} className={miniInputContainer(activeField === 'years')}>
                            <span className="text-xl font-bold text-text-color">{years || '0'}</span>
                            <span className={`text-[9px] font-bold uppercase mt-1 ${activeField === 'years' ? 'text-primary' : 'text-text-muted'}`}>{t('years')}</span>
                        </div>
                        <div onClick={() => { setActiveField('months'); setIsPickerOpen(false); }} className={miniInputContainer(activeField === 'months')}>
                            <span className="text-xl font-bold text-text-color">{months || '0'}</span>
                            <span className={`text-[9px] font-bold uppercase mt-1 ${activeField === 'months' ? 'text-primary' : 'text-text-muted'}`}>{t('months')}</span>
                        </div>
                        <div onClick={() => { setActiveField('days'); setIsPickerOpen(false); }} className={miniInputContainer(activeField === 'days')}>
                            <span className="text-xl font-bold text-text-color">{days || '0'}</span>
                            <span className={`text-[9px] font-bold uppercase mt-1 ${activeField === 'days' ? 'text-primary' : 'text-text-muted'}`}>{t('days')}</span>
                        </div>
                    </div>
                </div>

                 <button onClick={calculateAddSub} className="shrink-0 w-full rounded-2xl bg-secondary py-3 text-lg font-bold text-text-on-secondary shadow-lg active:scale-95 transition-transform hover:brightness-110 mt-auto">
                    {t('calculate')}
                </button>
            </div>

            {result && (
                <div className="animate-pop-in shrink-0 w-full mt-3">
                    <div className="rounded-2xl bg-surface border border-primary/20 p-3 text-center shadow-lg">
                        <p className="text-xs font-bold text-text-muted uppercase mb-1">{t('result')}</p>
                        <p className="text-lg font-bold text-primary break-words">{result}</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="relative w-full h-full overflow-hidden">
             {/* Diff Mode Slide */}
            <div 
                className={`absolute inset-0 transition-transform duration-500 ease-spring ${mode === 'diff' ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ willChange: 'transform' }}
            >
                {diffContent}
            </div>

            {/* AddSub Mode Slide */}
            <div 
                className={`absolute inset-0 transition-transform duration-500 ease-spring ${mode === 'addsub' ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ willChange: 'transform' }}
            >
                {addSubContent}
            </div>
        </div>
    );
};

export const DateCalculatorDrawer: React.FC<{ logic: ReturnType<typeof useDateCalculator> }> = ({ logic }) => {
    const { t } = useLanguage();
    const { isPickerOpen, setIsPickerOpen, activeField, startDate, endDate, setStartDate, setEndDate } = logic;

    return (
        <>
            <div 
                className={`fixed inset-x-0 bottom-0 z-50 flex flex-col bg-background rounded-t-[2.5rem] shadow-2xl transition-transform duration-500 ease-spring max-w-lg mx-auto ${isPickerOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ height: '55dvh', left: 0, right: 0 }}
            >
                <div className="flex items-center justify-between p-4 border-b border-text-color/5">
                    <span className="text-lg font-bold ml-2">{t('dateCalculator')}</span>
                    <button 
                        onClick={() => setIsPickerOpen(false)}
                        className="px-4 py-2 bg-primary text-text-on-primary rounded-full font-bold text-sm hover:brightness-110 transition-all active:scale-95"
                    >
                        {t('close')}
                    </button>
                </div>
                <div className="flex-1 relative overflow-hidden">
                   <DatePickerKeypad 
                        date={activeField === 'start' ? startDate : endDate}
                        onChange={(d) => activeField === 'start' ? setStartDate(d) : setEndDate(d)}
                    />
                </div>
            </div>
             {isPickerOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
                    onClick={() => setIsPickerOpen(false)}
                />
             )}
        </>
    );
};

const DateCalculator: React.FC<{ mode: DateMode }> = ({ mode }) => {
    const logic = useDateCalculator(mode);
    return (
        <div className="flex h-full flex-col relative">
            <div className="flex-1 overflow-hidden relative">
                <DateCalculatorView mode={mode} logic={logic} />
            </div>
            <DateCalculatorDrawer logic={logic} />
        </div>
    );
}

export default DateCalculator;
