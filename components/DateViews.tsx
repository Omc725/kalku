
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { TranslationKey } from '../types';
import { DateCalculatorLogic } from '../hooks/useDateCalculator';
import { 
    gregorianToJdn, jdnToJulian, jdnToMayan, 
    HIJRI_MONTHS, PERSIAN_MONTHS, HEBREW_MONTHS 
} from '../utils/dateAlgorithms';

// Common Styles
const inputCardClass = (isActive: boolean) => `relative w-full rounded-3xl p-5 cursor-pointer transition-all duration-300 border group overflow-hidden ${isActive ? 'bg-surface border-primary ring-1 ring-primary/30 shadow-md' : 'bg-surface/50 border-white/5 hover:bg-surface hover:border-white/10 hover:shadow-lg'}`;
const valueClass = "text-2xl font-bold text-text-color font-display leading-tight tracking-tight mt-1 truncate";
const miniInputContainer = (isActive: boolean) => `flex flex-col items-center justify-center p-2 rounded-2xl border transition-all duration-300 cursor-pointer h-20 ${isActive ? 'bg-surface border-primary ring-1 ring-primary/30 shadow-md scale-105' : 'bg-surface/30 border-white/5 hover:bg-surface/50 hover:border-white/10'}`;

// --- SUB-COMPONENTS ---

export const DateDiffView: React.FC<{ logic: DateCalculatorLogic; openPicker: (f: 'start'|'end')=>void }> = ({ logic, openPicker }) => {
    const { t, language } = useLanguage();
    const { startDate, endDate, activeField, result, calculateDiff } = logic;
    const formatDateDisplay = (d: Date) => d.toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="h-full w-full flex flex-col p-6 pt-2">
             <div className="flex-1 flex flex-col gap-4 min-h-0">
                <div onClick={() => openPicker('start')} className={inputCardClass(activeField === 'start')}><span className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5 flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">flight_takeoff</span>{t('from')}</span><div className="flex items-center justify-between"><div className={valueClass}>{formatDateDisplay(startDate)}</div><span className={`material-symbols-outlined text-2xl ${activeField === 'start' ? 'text-primary' : 'text-text-muted/30'}`}>calendar_month</span></div></div>
                <div onClick={() => openPicker('end')} className={inputCardClass(activeField === 'end')}><span className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5 flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">flight_land</span>{t('to')}</span><div className="flex items-center justify-between"><div className={valueClass}>{formatDateDisplay(endDate)}</div><span className={`material-symbols-outlined text-2xl ${activeField === 'end' ? 'text-primary' : 'text-text-muted/30'}`}>event</span></div></div>
                <div className="mt-auto"></div>
                {result && <div className="animate-pop-in shrink-0 w-full mb-4"><div className="rounded-[1.5rem] bg-gradient-to-br from-surface to-surface/50 border border-white/10 p-5 shadow-xl relative overflow-hidden"><div className="relative z-10"><p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{t('result')}</p><p className="text-xl font-bold text-primary break-words leading-tight">{result}</p></div></div></div>}
                 <button onClick={calculateDiff} className="shrink-0 w-full rounded-full bg-primary py-4 text-lg font-bold text-text-on-primary shadow-lg active:scale-[0.98] active:shadow-none transition-all duration-300 border border-white/10 relative overflow-hidden group"><span className="relative z-10 flex items-center justify-center gap-2">{t('calculate')}<span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span></span><div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div></button>
            </div>
        </div>
    );
};

export const DateAddSubView: React.FC<{ logic: DateCalculatorLogic; openPicker: (f: 'start')=>void; setActiveField: (f:any)=>void }> = ({ logic, openPicker, setActiveField }) => {
    const { t, language } = useLanguage();
    const { startDate, years, months, days, operation, setOperation, activeField, result, calculateAddSub, setIsPickerOpen } = logic;
    const formatDateDisplay = (d: Date) => d.toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' });

    return (
         <div className="h-full w-full flex flex-col p-6 pt-2">
            <div className="flex-1 flex flex-col gap-4 min-h-0">
                <div onClick={() => openPicker('start')} className={inputCardClass(activeField === 'start')}><span className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5 flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">calendar_today</span>{t('startDate')}</span><div className="flex items-center justify-between"><div className={valueClass}>{formatDateDisplay(startDate)}</div><span className={`material-symbols-outlined text-2xl ${activeField === 'start' ? 'text-primary' : 'text-text-muted/30'}`}>edit_calendar</span></div></div>
                <div className="flex gap-3 shrink-0 w-full"><div className="w-14 bg-surface/30 rounded-2xl p-1 flex flex-col border border-white/5 shadow-inner shrink-0 overflow-hidden backdrop-blur-md h-20"><button onClick={() => setOperation('add')} className={`flex-1 w-full flex items-center justify-center rounded-xl transition-all duration-300 mb-1 ${operation === 'add' ? 'bg-primary text-text-on-primary shadow-sm' : 'text-text-muted hover:text-text-color'}`}><span className="material-symbols-outlined !text-xl font-bold">add</span></button><button onClick={() => setOperation('subtract')} className={`flex-1 w-full flex items-center justify-center rounded-xl transition-all duration-300 ${operation === 'subtract' ? 'bg-primary text-text-on-primary shadow-sm' : 'text-text-muted hover:text-text-color'}`}><span className="material-symbols-outlined !text-xl font-bold">remove</span></button></div><div className="flex-1 grid grid-cols-3 gap-2"><div onClick={() => { setActiveField('years'); setIsPickerOpen(false); }} className={miniInputContainer(activeField === 'years')}><span className="text-2xl font-bold text-text-color font-display leading-none mt-1">{years || '0'}</span><span className={`text-[10px] font-bold uppercase mt-2 tracking-widest ${activeField === 'years' ? 'text-primary' : 'text-text-muted'}`}>{t('years')}</span></div><div onClick={() => { setActiveField('months'); setIsPickerOpen(false); }} className={miniInputContainer(activeField === 'months')}><span className="text-2xl font-bold text-text-color font-display leading-none mt-1">{months || '0'}</span><span className={`text-[10px] font-bold uppercase mt-2 tracking-widest ${activeField === 'months' ? 'text-primary' : 'text-text-muted'}`}>{t('months')}</span></div><div onClick={() => { setActiveField('days'); setIsPickerOpen(false); }} className={miniInputContainer(activeField === 'days')}><span className="text-2xl font-bold text-text-color font-display leading-none mt-1">{days || '0'}</span><span className={`text-[10px] font-bold uppercase mt-2 tracking-widest ${activeField === 'days' ? 'text-primary' : 'text-text-muted'}`}>{t('days')}</span></div></div></div>
                <div className="mt-auto"></div>
                 {result && <div className="animate-pop-in shrink-0 w-full mb-4"><div className="rounded-[1.5rem] bg-gradient-to-br from-surface to-surface/50 border border-white/10 p-5 shadow-xl relative overflow-hidden"><div className="relative z-10"><p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{t('result')}</p><p className="text-xl font-bold text-primary break-words leading-tight">{result}</p></div></div></div>}
                 <button onClick={calculateAddSub} className="shrink-0 w-full rounded-full bg-primary py-4 text-lg font-bold text-text-on-primary shadow-lg active:scale-[0.98] active:shadow-none transition-all duration-300 border border-white/10 relative overflow-hidden group"><span className="relative z-10 flex items-center justify-center gap-2">{t('calculate')}<span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span></span><div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div></button>
            </div>
        </div>
    );
};

export const DateConversionView: React.FC<{ logic: DateCalculatorLogic; openPicker: (f: 'start')=>void }> = ({ logic, openPicker }) => {
    const { t, language } = useLanguage();
    const { triggerVibration } = useTheme();
    const { masterDate, inputState, inputCalendar, activeField } = logic;
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const handleCopy = (text: string, key: string) => {
        triggerVibration(10);
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1500);
    };

    const calendarBorderColors: Record<string, string> = {
        gregorian: 'border-l-primary',
        hijri: 'border-l-emerald-500',
        rumi: 'border-l-amber-500',
        julian: 'border-l-slate-500',
        persian: 'border-l-fuchsia-500',
        hebrew: 'border-l-sky-500',
        chinese: 'border-l-red-500',
        mayan: 'border-l-teal-500'
    };
    const getBorderClass = (cal: string) => calendarBorderColors[cal] || 'border-l-gray-500';

    const renderHeroInput = () => {
        let displayStr = "";
        if (inputCalendar === 'gregorian') {
            displayStr = masterDate.toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' });
        } else if (inputCalendar === 'hijri') {
            displayStr = `${inputState.day} ${HIJRI_MONTHS[inputState.month]} ${inputState.year}`;
        } else if (inputCalendar === 'rumi') {
            displayStr = `${inputState.day} ${new Date(2000, inputState.month, 1).toLocaleString(language, {month:'long'})} ${inputState.year}`;
        } else if (inputCalendar === 'julian') {
            displayStr = `${inputState.day} ${new Date(2000, inputState.month, 1).toLocaleString(language, {month:'long'})} ${inputState.year}`;
        } else if (inputCalendar === 'persian') {
            displayStr = `${inputState.day} ${PERSIAN_MONTHS[inputState.month]} ${inputState.year}`;
        } else if (inputCalendar === 'hebrew') {
            displayStr = `${inputState.day} ${HEBREW_MONTHS[inputState.month] || inputState.month + 1} ${inputState.year}`;
        } else if (inputCalendar === 'chinese') {
            const zodiacs = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
            // Using related year for zodiac calc approximation
            const zodiac = zodiacs[Math.abs(inputState.year - 1924) % 12] || '';
            displayStr = `${inputState.day} Month ${inputState.month + 1} ${inputState.year} (${zodiac})`;
        } else if (inputCalendar === 'mayan') {
            // Displaying Mayan as Baktun.Katun.Tun.Uinal.Kin
            // Input only sets Baktun.Katun.Tun, defaulting Uinal/Kin to 0
            displayStr = `${inputState.year}.${inputState.month}.${inputState.day - 1}.0.0`;
        }

        return (
            <div className="w-full mb-6 mt-1">
                <button 
                    onClick={() => openPicker('start')} 
                    className={`
                        relative w-full h-14 flex items-center justify-between p-2 pl-2
                        rounded-full border transition-all duration-300 group
                        ${activeField === 'start' 
                            ? 'bg-surface border-primary shadow-[0_0_20px_-5px_rgba(var(--color-primary-rgb),0.3)] ring-1 ring-primary/30' 
                            : 'bg-surface/50 border-white/10 hover:border-white/20 hover:bg-surface'}
                    `}
                >
                    {/* Left: Calendar Type Badge (Pill) */}
                    <div className={`
                        h-10 px-4 flex items-center justify-center rounded-full transition-colors duration-300
                        ${activeField === 'start' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-text-muted group-hover:bg-white/10'}
                    `}>
                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">
                            {t(`calendar_${inputCalendar}` as TranslationKey)}
                        </span>
                    </div>

                    {/* Center: Date Value */}
                    <div className="flex-1 text-center truncate px-2">
                        <span className="text-lg font-display font-bold text-text-color tracking-tight">
                            {displayStr}
                        </span>
                    </div>

                    {/* Right: Edit Icon (Circle) */}
                    <div className={`
                        h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                        ${activeField === 'start' 
                            ? 'bg-primary text-text-on-primary' 
                            : 'bg-white/10 text-text-muted group-hover:bg-primary group-hover:text-text-on-primary'}
                    `}>
                        <span className="material-symbols-outlined text-[20px]">edit_calendar</span>
                    </div>
                </button>
            </div>
        );
    };

    const renderCalendarResult = (key: string, label: string, calType: string, value: string, subValue?: string) => {
        const isCopied = copiedKey === key;
        const borderClass = getBorderClass(calType);
        return (
            <div 
                key={key} 
                onClick={() => handleCopy(value, key)}
                className={`
                    group relative rounded-2xl bg-surface/50 border border-white/5 p-3 px-5
                    flex items-center justify-between cursor-pointer transition-all duration-300
                    hover:bg-surface hover:border-white/10 hover:shadow-lg active:scale-[0.99]
                    border-l-[4px] ${borderClass}
                `}
            >
                <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest truncate">{label}</span>
                    <span className="text-lg font-bold text-text-color font-display leading-tight truncate pr-2">{value}</span>
                    {subValue && <span className="text-[11px] text-text-muted/70 truncate">{subValue}</span>}
                </div>
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${isCopied ? 'bg-green-500/20 text-green-500' : 'text-text-muted opacity-0 group-hover:opacity-100 bg-white/5'}`}>
                    <span className="material-symbols-outlined text-[18px]">{isCopied ? 'check' : 'content_copy'}</span>
                </div>
            </div>
        );
    };

    const content = useMemo(() => {
        const jdn = gregorianToJdn(masterDate.getFullYear(), masterDate.getMonth(), masterDate.getDate());
        const gregStr = masterDate.toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' });
        const hijriParts = new Intl.DateTimeFormat(language + '-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' }).formatToParts(masterDate);
        const hijriStr = hijriParts.map(p => p.value).join('');
        const rumiJ = jdnToJulian(jdn);
        const rumiStr = `${rumiJ.day} ${new Date(2000, rumiJ.month, 1).toLocaleString(language, {month:'long'})} ${rumiJ.year - 584}`;
        const julianJ = jdnToJulian(jdn);
        const julianStr = `${julianJ.day} ${new Date(2000, julianJ.month, 1).toLocaleString(language, {month:'long'})} ${julianJ.year}`;
        const persianStr = new Intl.DateTimeFormat(language + '-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' }).format(masterDate);
        const hebrewStr = new Intl.DateTimeFormat(language + '-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' }).format(masterDate);
        const chineseStr = new Intl.DateTimeFormat(language + '-u-ca-chinese', { day: 'numeric', month: 'long', year: 'numeric' }).format(masterDate);
        
        const zodiacs = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
        const chineseYear = masterDate.getFullYear(); 
        const zodiac = zodiacs[Math.abs(chineseYear - 1924) % 12]; 
        const mayanStr = jdnToMayan(jdn);

        return (
            <div className="h-full w-full flex flex-col px-6 pt-3">
                <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar pb-24">
                    {renderHeroInput()}
                    <div className="flex items-center gap-3 px-2 opacity-40 mt-2">
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{t('result')}</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>
                    <div className="flex flex-col gap-3 pb-4">
                        {renderCalendarResult('greg', t('calendar_gregorian'), 'gregorian', gregStr, masterDate.toLocaleDateString(language, { weekday: 'long' }))}
                        {renderCalendarResult('hijri', t('calendar_hijri'), 'hijri', hijriStr)}
                        {renderCalendarResult('rumi', t('calendar_rumi'), 'rumi', rumiStr)}
                        {renderCalendarResult('julian', t('calendar_julian'), 'julian', julianStr)}
                        {renderCalendarResult('persian', t('calendar_persian'), 'persian', persianStr)}
                        {renderCalendarResult('hebrew', t('calendar_hebrew'), 'hebrew', hebrewStr)}
                        {renderCalendarResult('chinese', t('calendar_chinese'), 'chinese', chineseStr, zodiac)}
                        {renderCalendarResult('mayan', t('calendar_mayan'), 'mayan', mayanStr, 'Long Count')}
                    </div>
                </div>
            </div>
        );
    }, [masterDate, inputState, inputCalendar, language, activeField, t, copiedKey]);

    return content;
};
