
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DateMode } from '../types';
import { 
    gregorianToJdn, jdnToGregorian, julianToJdn, jdnToJulian,
    g2h, h2g, rumiToGregorian, jdnToMayanParts
} from '../utils/dateAlgorithms';

export const useDateCalculator = (mode: DateMode) => {
    const { language, t } = useLanguage();
    
    // Standard States
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [years, setYears] = useState<string>('');
    const [months, setMonths] = useState<string>('');
    const [days, setDays] = useState<string>('');
    const [operation, setOperation] = useState<'add' | 'subtract'>('add');
    const [activeField, setActiveField] = useState<'start' | 'end' | 'years' | 'months' | 'days'>('start');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    // CONVERTER MODE STATES
    // The "Master Date" is always Gregorian for truth
    const [masterDate, setMasterDate] = useState<Date>(new Date());
    const [inputCalendar, setInputCalendar] = useState<'gregorian' | 'hijri' | 'rumi' | 'julian' | 'persian' | 'hebrew' | 'chinese' | 'mayan'>('gregorian');
    
    const [inputState, setInputState] = useState<{year: number, month: number, day: number}>({
        year: masterDate.getFullYear(),
        month: masterDate.getMonth(),
        day: masterDate.getDate()
    });

    // Reset on mode change ONLY
    useEffect(() => {
        setResult(null);
        setIsPickerOpen(false);
        setActiveField('start');
        if (mode === 'convert') {
            syncInputStateFromMaster(masterDate, inputCalendar);
        }
    }, [mode]);

    // Sync when calendar changes (but keep picker open)
    useEffect(() => {
        if (mode === 'convert') {
            syncInputStateFromMaster(masterDate, inputCalendar);
        }
    }, [inputCalendar]);

    const syncInputStateFromMaster = (date: Date, cal: string) => {
        if (cal === 'gregorian') {
            setInputState({ year: date.getFullYear(), month: date.getMonth(), day: date.getDate() });
        } else if (cal === 'hijri') {
            const h = g2h(date);
            setInputState(h);
        } else if (cal === 'julian') {
            const jdn = gregorianToJdn(date.getFullYear(), date.getMonth(), date.getDate());
            const j = jdnToJulian(jdn);
            setInputState(j);
        } else if (cal === 'rumi') {
            const jdn = gregorianToJdn(date.getFullYear(), date.getMonth(), date.getDate());
            const j = jdnToJulian(jdn);
            setInputState({ ...j, year: j.year - 584 });
        } else if (cal === 'persian') {
            const parts = new Intl.DateTimeFormat('en-u-ca-persian', { year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date);
            const y = parseInt(parts.find(p => p.type === 'year')?.value || '1400');
            const m = parseInt(parts.find(p => p.type === 'month')?.value || '1');
            const d = parseInt(parts.find(p => p.type === 'day')?.value || '1');
            setInputState({ year: y, month: m - 1, day: d });
        } else if (cal === 'hebrew') {
            const parts = new Intl.DateTimeFormat('en-u-ca-hebrew', { year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date);
            const y = parseInt(parts.find(p => p.type === 'year')?.value || '5780');
            const m = parseInt(parts.find(p => p.type === 'month')?.value || '1'); 
            const d = parseInt(parts.find(p => p.type === 'day')?.value || '1');
            setInputState({ year: y, month: m - 1, day: d });
        } else if (cal === 'chinese') {
            const parts = new Intl.DateTimeFormat('en-u-ca-chinese', { year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date);
            // Fix: Cast p.type to string because 'relatedYear' is not in standard types
            const y = parseInt(parts.find(p => (p.type as string) === 'relatedYear')?.value || parts.find(p => p.type === 'year')?.value || '2024');
            const m = parseInt(parts.find(p => p.type === 'month')?.value || '1');
            const d = parseInt(parts.find(p => p.type === 'day')?.value || '1');
            setInputState({ year: y, month: m - 1, day: d });
        } else if (cal === 'mayan') {
            const jdn = gregorianToJdn(date.getFullYear(), date.getMonth(), date.getDate());
            const parts = jdnToMayanParts(jdn);
            // Map Baktun to Year, Katun to Month, Tun to Day for the 3-column input
            setInputState({ year: parts.baktun, month: parts.katun, day: parts.tun + 1 });
        }
    };

    const handleInputDateChange = (y: number, m: number, d: number) => {
        setInputState({ year: y, month: m, day: d });
        
        let newMaster: Date;
        try {
            if (inputCalendar === 'gregorian') {
                newMaster = new Date(y, m, d);
            } else if (inputCalendar === 'hijri') {
                newMaster = h2g(y, m, d);
            } else if (inputCalendar === 'julian') {
                const jdn = julianToJdn(y, m, d);
                newMaster = jdnToGregorian(jdn);
            } else if (inputCalendar === 'rumi') {
                newMaster = rumiToGregorian(y, m, d);
            } else if (inputCalendar === 'persian') {
                let guess = new Date(y + 621, m, d);
                for(let i=0; i<15; i++) {
                    const parts = new Intl.DateTimeFormat('en-u-ca-persian', { year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(guess);
                    const py = parseInt(parts.find(p => p.type === 'year')?.value || '0');
                    const pm = parseInt(parts.find(p => p.type === 'month')?.value || '0');
                    const pd = parseInt(parts.find(p => p.type === 'day')?.value || '0');
                    const diffDays = (y - py) * 365 + (m + 1 - pm) * 30 + (d - pd);
                    if (Math.abs(diffDays) < 1) break; 
                    guess.setDate(guess.getDate() + Math.ceil(diffDays * 0.9));
                }
                newMaster = guess;
            } else if (inputCalendar === 'hebrew') {
                let guess = new Date(y - 3760, m, d);
                for(let i=0; i<15; i++) {
                    const parts = new Intl.DateTimeFormat('en-u-ca-hebrew', { year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(guess);
                    const hy = parseInt(parts.find(p => p.type === 'year')?.value || '0');
                    const hm = parseInt(parts.find(p => p.type === 'month')?.value || '0');
                    const hd = parseInt(parts.find(p => p.type === 'day')?.value || '0');
                    const diffDays = (y - hy) * 354 + (m + 1 - hm) * 29 + (d - hd);
                    if (y === hy && m + 1 === hm && d === hd) break;
                    if (Math.abs(diffDays) < 1) break;
                    guess.setDate(guess.getDate() + Math.ceil(diffDays * 0.9));
                }
                newMaster = guess;
            } else if (inputCalendar === 'chinese') {
                // Iterative search for Chinese
                // Approx: Gregorian Year = Chinese Related Year
                let guess = new Date(y, m, d);
                for(let i=0; i<20; i++) {
                    const parts = new Intl.DateTimeFormat('en-u-ca-chinese', { year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(guess);
                    // Fix: Cast p.type to string because 'relatedYear' is not in standard types
                    const cy = parseInt(parts.find(p => (p.type as string) === 'relatedYear')?.value || parts.find(p => p.type === 'year')?.value || '0');
                    const cm = parseInt(parts.find(p => p.type === 'month')?.value || '0');
                    const cd = parseInt(parts.find(p => p.type === 'day')?.value || '0');
                    
                    // Simple lunar approximation: Year~354 days, Month~29.5
                    const diffDays = (y - cy) * 354 + (m + 1 - cm) * 29 + (d - cd);
                    
                    if (Math.abs(diffDays) < 1) break;
                    guess.setDate(guess.getDate() + Math.ceil(diffDays * 0.9));
                }
                newMaster = guess;
            } else if (inputCalendar === 'mayan') {
                // Mayan Calculation (Inverse of JDN parts)
                // Inputs: y=Baktun, m=Katun, d=Tun+1
                const baktun = y;
                const katun = m;
                const tun = d - 1; 
                // Default Uinal and Kin to 0 for the "Start" of that period
                const jdn = 584283 + (baktun * 144000) + (katun * 7200) + (tun * 360);
                newMaster = jdnToGregorian(jdn);
            } else {
                newMaster = new Date();
            }
            setMasterDate(newMaster);
        } catch (e) {
            // Invalid date handling
        }
    };

    const calculateDiff = () => {
        const d1 = new Date(startDate);
        const d2 = new Date(endDate);
        d1.setHours(0,0,0,0);
        d2.setHours(0,0,0,0);
        
        let y = d2.getFullYear() - d1.getFullYear();
        let m = d2.getMonth() - d1.getMonth();
        let d = d2.getDate() - d1.getDate();

        if (d < 0) { m--; d += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate(); }
        if (m < 0) { y--; m += 12; }
        
        let resStr = '';
        if (d1 > d2) {
             const min = d1 < d2 ? d1 : d2;
             const max = d1 < d2 ? d2 : d1;
             let yy = max.getFullYear() - min.getFullYear();
             let mm = max.getMonth() - min.getMonth();
             let dd = max.getDate() - min.getDate();
             if (dd < 0) { mm--; dd += new Date(max.getFullYear(), max.getMonth(), 0).getDate(); }
             if (mm < 0) { yy--; mm += 12; }
             resStr = `${yy} ${t('years')}, ${mm} ${t('months')}, ${dd} ${t('days')}`;
        } else {
             resStr = `${y} ${t('years')}, ${m} ${t('months')}, ${d} ${t('days')}`;
        }
        setResult(resStr);
    };

    const calculateAddSub = () => {
        const d = new Date(startDate);
        const y = parseInt(years) || 0;
        const m = parseInt(months) || 0;
        const dy = parseInt(days) || 0;
        if (operation === 'add') { d.setFullYear(d.getFullYear() + y); d.setMonth(d.getMonth() + m); d.setDate(d.getDate() + dy); } 
        else { d.setFullYear(d.getFullYear() - y); d.setMonth(d.getMonth() - m); d.setDate(d.getDate() - dy); }
        setResult(d.toLocaleDateString(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };

    const handlePadClick = (value: string) => {
        if (isPickerOpen || mode !== 'addsub') return;
        const setMap = { 'years': setYears, 'months': setMonths, 'days': setDays, 'start': () => {}, 'end': () => {} };
        const setter = setMap[activeField];
        if (activeField === 'start' || activeField === 'end') return; 
        if (value === 'backspace') setter(prev => prev.length > 0 ? prev.slice(0, -1) : '');
        else if (value === 'AC') { setYears(''); setMonths(''); setDays(''); } 
        else if (value >= '0' && value <= '9') setter(prev => prev + value);
    };

    return {
        startDate, setStartDate, endDate, setEndDate,
        years, setYears, months, setMonths, days, setDays,
        operation, setOperation, activeField, setActiveField,
        isPickerOpen, setIsPickerOpen, result,
        calculateDiff, calculateAddSub, handlePadClick,
        // New Converter Props
        masterDate, inputCalendar, setInputCalendar,
        inputState, handleInputDateChange,
        currentMode: mode
    };
};

export type DateCalculatorLogic = ReturnType<typeof useDateCalculator>;
