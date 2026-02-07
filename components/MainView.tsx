
import React, { useState, useCallback, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { HistoryEntry, UnitCategoryKey, TranslationKey, UnitData, ConversionRates, AppMode, DateMode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { allButtons, scientificButtons, basicButtons, MAX_EXPRESSION_LENGTH, MAX_HISTORY_ITEMS, ANIMATION_DURATION } from '../constants';
import { conversionData } from '../constants/units';
import { formatNumber, formatFormula, evaluateExpression, calculateLayout, LayoutData } from '../utils';
import CalculatorButton from './CalculatorButton';
import UnitSelectionModal from './UnitSelectionModal';
import { useDateCalculator, DateCalculatorView, DateCalculatorDrawer } from './DateCalculator';
import { useFinanceCalculator, FinanceCalculatorView } from './FinanceCalculator';
import { useBMICalculator, BMICalculatorView } from './BMICalculator';

interface MainViewProps {
    history: HistoryEntry[];
    setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
    calculatorMode: 'scientific' | 'basic';
    appMode: AppMode;
    setAppMode: (mode: AppMode) => void;
    dateMode: DateMode;
    setSwapUnitsTrigger: (fn: () => void) => void;
    financeLogic: ReturnType<typeof useFinanceCalculator>;
}

const MainView: React.FC<MainViewProps> = ({ history, setHistory, calculatorMode, appMode, setAppMode, dateMode, setSwapUnitsTrigger, financeLogic }) => {
    const { t } = useLanguage();
    const { triggerVibration } = useTheme();
    
    const [expression, setExpression] = useState('');
    const [display, setDisplay] = useState('0');
    const [lastExpression, setLastExpression] = useState('');
    const [lastActionWasEquals, setLastActionWasEquals] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isShifted, setIsShifted] = useState(false);
    const [category, setCategory] = useState<UnitCategoryKey>('Currency');
    const [fromUnit, setFromUnit] = useState('USD');
    const [toUnit, setToUnit] = useState('EUR');
    const [outputValue, setOutputValue] = useState('0');
    const [isSwapping, setIsSwapping] = useState(false);
    const [isSelectingUnit, setIsSelectingUnit] = useState<'from' | 'to' | null>(null);
    const [unitData, setUnitData] = useState<UnitData>(conversionData);

    const dateLogic = useDateCalculator(dateMode);
    const bmiLogic = useBMICalculator();

    const keypadRef = useRef<HTMLDivElement>(null);
    const [keypadWidth, setKeypadWidth] = useState(0);
    const [dynamicBtnHeight, setDynamicBtnHeight] = useState(48);
    const [dynamicBtnGap, setDynamicBtnGap] = useState(12);

    // Swipe Handling Refs
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const modes: AppMode[] = ['calculator', 'converter', 'date', 'finance', 'bmi'];

    const activeGroupIndex = useMemo(() => {
        if (appMode === 'bmi') return 4;
        if (appMode === 'finance') return 3;
        if (appMode === 'date') return 2;
        if (appMode === 'converter') return 1;
        return 0;
    }, [appMode]);

    const isConverterMode = appMode === 'converter';

    useEffect(() => { if (appMode === 'converter') { setExpression(''); setIsShifted(false); } }, [appMode]);
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => { setIsAnimating(false); }, ANIMATION_DURATION + 100);
        return () => clearTimeout(timer);
    }, [calculatorMode, appMode]);

    useEffect(() => {
        if (category === 'Currency') {
            const fetchRates = async () => {
                try {
                    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                    const data = await res.json();
                    if (data && data.rates) {
                        setUnitData(prev => ({
                            ...prev,
                            Currency: {
                                ...prev.Currency,
                                units: {
                                    ...prev.Currency.units,
                                    ...Object.keys(prev.Currency.units).reduce((acc, key) => {
                                        if (data.rates[key]) {
                                            acc[key] = 1 / data.rates[key];
                                        }
                                        return acc;
                                    }, {} as ConversionRates)
                                }
                            }
                        }));
                    }
                } catch (e) {
                    console.error("Failed to fetch currency rates", e);
                }
            };
            fetchRates();
        }
    }, [category]);

    const calculateConversion = useCallback(() => {
        const inputNum = parseFloat(display);
        if (isNaN(inputNum)) {
            setOutputValue('');
            return;
        }
        const data = unitData[category];
        if (category === 'Temperature') {
            let result: number;
            const actualFromUnit = fromUnit;
            const actualToUnit = toUnit;
            if (actualFromUnit === 'Celsius') {
                if (actualToUnit === 'Fahrenheit') result = inputNum * 9 / 5 + 32;
                else if (actualToUnit === 'Kelvin') result = inputNum + 273.15;
                else result = inputNum;
            } else if (actualFromUnit === 'Fahrenheit') {
                if (actualToUnit === 'Celsius') result = (inputNum - 32) * 5 / 9;
                else if (actualToUnit === 'Kelvin') result = (inputNum - 32) * 5 / 9 + 273.15;
                else result = inputNum;
            } else {
                if (actualToUnit === 'Celsius') result = inputNum - 273.15;
                else if (actualToUnit === 'Fahrenheit') result = (inputNum - 273.15) * 9 / 5 + 32;
                else result = inputNum;
            }
            setOutputValue(parseFloat(result.toPrecision(12)).toString());
        } else {
            const fromFactor = data.units[fromUnit] || 1;
            const toFactor = data.units[toUnit] || 1;
            const baseValue = inputNum * fromFactor;
            const result = baseValue / toFactor;
            setOutputValue(parseFloat(result.toPrecision(12)).toString());
        }
    }, [display, fromUnit, toUnit, category, unitData]);

    useEffect(() => {
        if (isConverterMode) calculateConversion();
    }, [isConverterMode, calculateConversion]);

    const liveResult = useMemo(() => {
        if (isConverterMode || !expression || lastActionWasEquals) return '';
        let cleanExpr = expression;
        const open = (cleanExpr.match(/\(/g) || []).length;
        const close = (cleanExpr.match(/\)/g) || []).length;
        if (open > close) cleanExpr += ')'.repeat(open - close);
        cleanExpr = cleanExpr.replace(/[+\-*/^(.]$/, '');
        if (!cleanExpr) return '';
        const res = evaluateExpression(cleanExpr);
        return res === 'Error' ? '' : res;
    }, [expression, lastActionWasEquals, isConverterMode]);

    useLayoutEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            if (keypadRef.current) {
                const containerHeight = keypadRef.current.offsetHeight;
                const containerWidth = keypadRef.current.offsetWidth;
                const PADDING = 16;
                const numRows = (appMode === 'converter' || appMode === 'date' || appMode === 'finance' || appMode === 'bmi') ? 5 : (calculatorMode === 'scientific' ? 7 : 5);
                const totalParts = (numRows * 4) + (numRows - 1) * 1;
                const availableHeight = containerHeight - (PADDING * 2);
                const partHeight = availableHeight / totalParts;
                const newHeight = Math.floor(Math.max(20, partHeight * 3.8)); 
                const newGap = Math.floor(Math.max(8, partHeight * 1.0)); 
                setDynamicBtnHeight(newHeight);
                setDynamicBtnGap(newGap);
                setKeypadWidth(containerWidth);
            }
        };

        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, 100);
        };

        handleResize();
        window.addEventListener('resize', debouncedResize);
        const resizeObserver = new ResizeObserver(debouncedResize);
        if (keypadRef.current) resizeObserver.observe(keypadRef.current);
        
        return () => {
            window.removeEventListener('resize', debouncedResize);
            if (keypadRef.current) resizeObserver.unobserve(keypadRef.current);
            clearTimeout(timeoutId);
        };
    }, [calculatorMode, appMode]);

    const allLayouts = useMemo(() => {
        if (keypadWidth === 0) return null;
        
        const params = [keypadWidth, dynamicBtnHeight, dynamicBtnGap] as const;
        return {
            scientific: calculateLayout('scientific', ...params),
            basic: calculateLayout('basic', ...params),
            converter: calculateLayout('converter', ...params),
            date: calculateLayout('date', ...params),
            finance: calculateLayout('finance', ...params),
            bmi: calculateLayout('bmi', ...params),
        };
    }, [keypadWidth, dynamicBtnHeight, dynamicBtnGap]);

    const buttonStyles = useMemo(() => {
        if (!allLayouts) return {};
        
        let currentMode: keyof typeof allLayouts = 'basic';
        if (appMode === 'calculator') currentMode = calculatorMode;
        else if (appMode === 'converter') currentMode = 'converter';
        else if (appMode === 'date') currentMode = 'date';
        else if (appMode === 'finance') currentMode = 'finance';
        else if (appMode === 'bmi') currentMode = 'bmi';

        const currentLayout = allLayouts[currentMode];
        const styles: Record<string, React.CSSProperties> = {};
        // Slow, fluid ease (Quintic-like)
        const fluidEase = 'cubic-bezier(0.2, 0.8, 0.2, 1)'; 

        allButtons.forEach(btn => {
            const targetData = currentLayout[btn.value];
            if (targetData) {
                // Increased delay slightly and duration significantly to 700ms
                const delay = (targetData.col * 20) + (targetData.row * 20);
                const style: React.CSSProperties = {
                    position: 'absolute',
                    left: 0, 
                    top: 0,
                    width: `${targetData.width}px`,
                    height: `${targetData.height}px`,
                    opacity: 1,
                    // GPU TRANSLATION: Using pre-calculated integers for x,y
                    transform: `translate3d(${targetData.x}px, ${targetData.y}px, 0)`,
                    transition: `
                        transform 700ms ${fluidEase} ${delay}ms,
                        width 700ms ${fluidEase} ${delay}ms,
                        height 700ms ${fluidEase} ${delay}ms,
                        opacity 500ms ease-out ${delay}ms
                    `,
                };
                
                if (isAnimating) {
                    style.willChange = 'width, height, opacity, transform';
                }
                
                styles[btn.value] = style;
            } else {
                let anchorData = allLayouts.scientific[btn.value] || allLayouts.basic[btn.value];

                if (!anchorData) {
                     anchorData = { x: 0, y: 0, width: 0, height: 0, row: 0, col: 0 };
                }

                styles[btn.value] = {
                    position: 'absolute',
                    left: 0, 
                    top: 0,
                    width: `${anchorData.width}px`,
                    height: `${anchorData.height}px`,
                    opacity: 0,
                    transform: `translate3d(${anchorData.x}px, ${anchorData.y}px, 0) scale(0.5)`,
                    pointerEvents: 'none',
                    transition: `
                        transform 600ms ${fluidEase},
                        width 600ms ${fluidEase}, 
                        height 600ms ${fluidEase},
                        opacity 300ms ease-in
                    `,
                };
            }
        });
        return styles;
    }, [allLayouts, appMode, calculatorMode, isAnimating]);

    const swapUnits = useCallback(() => {
        if (isSwapping) return;
        setIsSwapping(true);
        setTimeout(() => {
            const cF = fromUnit; const cT = toUnit; const cO = outputValue;
            setFromUnit(cT); setToUnit(cF); setDisplay(cO);
        }, 300); // Slightly longer delay for swap
        setTimeout(() => setIsSwapping(false), 800);
    }, [fromUnit, toUnit, outputValue, isSwapping]);

    useEffect(() => { setSwapUnitsTrigger(swapUnits); }, [swapUnits, setSwapUnitsTrigger]);

    const handleUnitSelect = (unitKey: string) => {
        if (isSelectingUnit === 'from') setFromUnit(unitKey);
        else if (isSelectingUnit === 'to') setToUnit(unitKey);
        setIsSelectingUnit(null);
    };

    // --- Swipe Handlers ---
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchStartX.current - touchEndX;
        const deltaY = touchStartY.current - touchEndY;
        
        // Swipe threshold: 50px, and horizontal distance must be significantly greater than vertical
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            const currentIndex = modes.indexOf(appMode);
            if (deltaX > 0) {
                // Swipe Left -> Go Next
                if (currentIndex < modes.length - 1) {
                    setAppMode(modes[currentIndex + 1]);
                }
            } else {
                // Swipe Right -> Go Prev
                if (currentIndex > 0) {
                    setAppMode(modes[currentIndex - 1]);
                }
            }
        }
        
        touchStartX.current = null;
        touchStartY.current = null;
    };

    // --- PERFORMANCE OPTIMIZATION: Ref-based Handler ---
    const clickHandlerState = useRef({
        expression, display, lastExpression, lastActionWasEquals, 
        isConverterMode, appMode, dateLogic, financeLogic, bmiLogic, 
        isAnimating, isShifted
    });

    useEffect(() => {
        clickHandlerState.current = {
            expression, display, lastExpression, lastActionWasEquals, 
            isConverterMode, appMode, dateLogic, financeLogic, bmiLogic, 
            isAnimating, isShifted
        };
    });

    const handleButtonClick = useCallback((value: string) => {
        const { 
            expression, display, lastExpression, lastActionWasEquals, 
            isConverterMode, appMode, dateLogic, financeLogic, bmiLogic, 
            isAnimating 
        } = clickHandlerState.current;

        if (isAnimating) return;
        
        if (appMode === 'date') { dateLogic.handlePadClick(value); return; }
        if (appMode === 'finance') { financeLogic.handlePadClick(value); return; }
        if (appMode === 'bmi') { bmiLogic.handlePadClick(value); return; }

        if (isConverterMode) {
             setDisplay(prevDisplay => {
                if (prevDisplay.length > MAX_EXPRESSION_LENGTH && !['AC', '=', 'backspace'].includes(value)) return prevDisplay;
                switch (value) {
                    case 'AC': setIsClearing(true); setTimeout(() => { setDisplay('0'); setIsClearing(false); }, 400); return '0';
                    case 'backspace': return prevDisplay.length > 1 ? prevDisplay.slice(0, -1) : '0';
                    case '+/-': return prevDisplay !== '0' ? (prevDisplay.startsWith('-') ? prevDisplay.slice(1) : '-' + prevDisplay) : prevDisplay;
                    case '.': return !prevDisplay.includes('.') ? prevDisplay + '.' : prevDisplay;
                    default: 
                        if (value >= '0' && value <= '9') return prevDisplay === '0' ? value : prevDisplay + value;
                        return prevDisplay;
                }
            });
            return;
        }

        // Calculator Logic
        if (expression.length > MAX_EXPRESSION_LENGTH && !['AC', '=', 'backspace'].includes(value)) return;
        
        switch (value) {
            case 'AC': 
                setIsClearing(true); 
                setTimeout(() => { setExpression(''); setLastExpression(''); setDisplay('0'); setIsClearing(false); }, 400); 
                setLastActionWasEquals(false); 
                break;
            case 'backspace': 
                if (lastActionWasEquals) { 
                    setExpression(''); setLastExpression(''); setDisplay('0'); setLastActionWasEquals(false); 
                } else if (expression.length > 0) {
                    const newExpression = expression.slice(0, -1);
                    setExpression(newExpression);
                    const lastNumber = newExpression.match(/(\d+(\.\d+)?|pi|e)$/);
                    if(lastNumber) setDisplay(lastNumber[0]); else setDisplay('0');
                } 
                break;
            case 'shift': 
                setIsShifted(prev => !prev); 
                break;
            case '()': 
                const openCount = (expression.match(/\(/g) || []).length; 
                const closeCount = (expression.match(/\)/g) || []).length; 
                const shouldClose = openCount > closeCount && (/\d$/.test(expression) || expression.endsWith(')') || expression.endsWith('pi') || expression.endsWith('e'));
                setExpression(prev => prev + (shouldClose ? ')' : '(')); 
                setLastActionWasEquals(false); 
                break; 
            case '=': 
                if (expression) { 
                    setLastExpression(expression); 
                    const result = evaluateExpression(expression); 
                    setDisplay(result); 
                    setLastActionWasEquals(true); 
                    if (result !== 'Error') setHistory(h => [{ expression, result }, ...h.slice(0, MAX_HISTORY_ITEMS - 1)]); 
                    setExpression(result !== 'Error' ? result : ''); 
                } 
                break;
            case '+/-': 
                if (lastActionWasEquals) { 
                    const newVal = display.startsWith('-') ? display.slice(1) : '-' + display; 
                    setExpression(newVal); setDisplay(newVal); setLastActionWasEquals(false); 
                } else if (display !== '0' && display !== 'Error') { 
                    const newDisplay = display.startsWith('-') ? display.slice(1) : '-' + display; 
                    setDisplay(newDisplay); 
                    if (expression.endsWith(display)) setExpression(prev => prev.slice(0, prev.length - display.length) + newDisplay); 
                } 
                break;
            case '%': 
                if (lastActionWasEquals) { 
                    const val = (parseFloat(display) / 100).toString(); 
                    setExpression(val); setDisplay(val); setLastActionWasEquals(false); 
                } else if (display !== 'Error' && display !== '0') { 
                    const num = parseFloat(display) / 100; 
                    const strNum = num.toString(); 
                    setDisplay(strNum); 
                    setExpression(prev => prev.slice(0, prev.length - display.length) + strNum); 
                } 
                break;
            case '.': 
                if (lastActionWasEquals) { 
                    setExpression('0.'); setDisplay('0.'); setLastActionWasEquals(false); 
                } else if (!display.includes('.')) { 
                    if (['+', '−', '×', '÷', '*', '/', '-', '+', '^', '('].some(op => expression.endsWith(op)) || expression === '') { 
                        setExpression(prev => prev + '0.'); setDisplay('0.'); 
                    } else { 
                        setExpression(prev => prev + '.'); setDisplay(prev => prev + '.'); 
                    } 
                } 
                break;
            default: 
                if (lastActionWasEquals) {
                     if (['+', '−', '×', '÷', '^', '*', '/', '-', '+'].includes(value) || value === '^2' || value === '^3' || value === '^(-1)') { 
                         setLastActionWasEquals(false); setExpression(prev => prev + value); setDisplay('0'); 
                     } else { 
                         setLastActionWasEquals(false); setLastExpression(''); setExpression(value); setDisplay(value); 
                     }
                     return;
                }
                
                if (['+', '−', '×', '÷', '*', '/', '-', '+', '^', '(', ')'].includes(value)) {
                    setDisplay('0');
                } else if (value >= '0' && value <= '9') { 
                    if (display === '0' || ['+', '−', '×', '÷', '*', '/', '-', '+', '^', '(', ')'].some(op => expression.endsWith(op))) setDisplay(value); 
                    else setDisplay(prev => prev + value); 
                }
                
                if (expression === '0' || expression === 'Error') setExpression(value); 
                else setExpression(prev => prev + value);
        }

    }, [setHistory]);

    // EVENT DELEGATION HANDLER
    const handleFooterClick = (e: React.MouseEvent<HTMLElement>) => {
        // Traverse up to find the button
        const target = (e.target as HTMLElement).closest('button');
        if (target && target.dataset.value) {
            triggerVibration();
            handleButtonClick(target.dataset.value);
        }
    };

    // OPTIMIZATION: Memoize the button list rendering.
    // Removed onClick prop passing to CalculatorButton
    const renderedButtons = useMemo(() => {
        return (
            <div className={`absolute inset-0 z-10 ${isAnimating ? 'fast-anim' : ''}`}>
                {allButtons.map(btn => {
                    const finalStyle = buttonStyles[btn.value];
                    if (!finalStyle) return null;
                    let finalConfig = btn;
                    const sciBtn = scientificButtons.find(b => b.value === btn.value);
                    if (calculatorMode === 'scientific' && isShifted && sciBtn?.shiftedDisplay && appMode === 'calculator') {
                        finalConfig = { ...btn, display: sciBtn.shiftedDisplay, value: sciBtn.shiftedValue || btn.value };
                    }
                    let buttonSpecificClass = '';
                    if (btn.value === 'shift' && isShifted && appMode === 'calculator') buttonSpecificClass = '!bg-primary !text-text-on-primary';
                    else if (sciBtn?.shiftedDisplay && isShifted && appMode === 'calculator') buttonSpecificClass = '!bg-surface brightness-150 shadow-inner';
                    
                    return (
                        <CalculatorButton 
                            key={btn.value} 
                            config={finalConfig} 
                            style={finalStyle} 
                            className={`${buttonSpecificClass}`} 
                        />
                    );
                })}
            </div>
        );
    }, [buttonStyles, calculatorMode, isShifted, appMode, isAnimating]); // handleButtonClick removed from dependencies


    return (
        <div 
            className="flex h-full flex-col relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <main className="flex-1 relative overflow-hidden"> 
                {/* Slot 0: Calculator */}
                <div className={`absolute inset-0 transition-transform duration-700 ease-premium transform-gpu ${activeGroupIndex === 0 ? 'translate-y-0' : '-translate-y-full'}`}>
                     <div className="h-full flex flex-col justify-end p-8 pb-10 text-right overflow-hidden relative">
                        {/* Display background effect */}
                        {/* FIXED: Moving top up significantly (-top-[2000px]) so the hard edge is well above the visible area */}
                        <div className="absolute -top-[2000px] left-0 right-0 bottom-0 bg-recessed-gradient pointer-events-none opacity-20" />
                        
                        <div className={`mb-3 h-8 text-xl font-medium text-text-muted truncate transition-opacity duration-300 relative z-10 ${isClearing ? 'animate-clear-out' : ''}`}>
                            {lastActionWasEquals ? `(${formatFormula(lastExpression)})` : (liveResult ? formatNumber(liveResult) : ' ')}
                        </div>
                        <div key={expression} className={`font-light break-all text-7xl tracking-tight leading-none relative z-10 drop-shadow-sm ${isClearing ? 'animate-clear-out' : (appMode==='calculator' && lastActionWasEquals) ? 'animate-pop-in' : 'animate-pop-in'} transition-all duration-300 ease-premium`}>
                            {formatFormula(expression || '0')}
                        </div>
                     </div>
                </div>

                {/* Slot 1: Converter */}
                <div className={`absolute inset-0 transition-transform duration-700 ease-premium transform-gpu ${activeGroupIndex === 1 ? 'translate-y-0' : activeGroupIndex > 1 ? '-translate-y-full' : 'translate-y-full'}`}>
                     <div className="h-full flex flex-col p-6 text-right">
                         <div className="mb-6 flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                            {(Object.keys(unitData) as UnitCategoryKey[]).map((catKey) => (
                                <button key={catKey} onClick={() => { setCategory(catKey); const units = Object.keys(unitData[catKey].units); setFromUnit(units[0]); setToUnit(units[1] || units[0]); setDisplay('1'); }} 
                                    className={`flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 transition-all duration-500 border backdrop-blur-sm ${category === catKey ? (catKey === 'Currency' ? 'bg-emerald-600 border-emerald-500 border-t-emerald-400 text-white shadow-lg' : 'bg-primary border-primary border-t-white/30 text-text-on-primary shadow-lg') : 'bg-surface/50 border-white/10 border-b-black/20 text-text-muted hover:bg-surface hover:text-text-color'}`}>
                                    <span className="material-symbols-outlined text-lg">{unitData[catKey].icon}</span>
                                    <span className="text-sm font-bold tracking-wide">{t(`unit_${catKey}` as TranslationKey)}</span>
                                </button>
                            ))}
                        </div>
                        <div className="relative flex-1 flex w-full flex-col gap-6 text-left px-2">
                            {/* FROM CARD - Depth Enhanced */}
                            <div className={`z-10 flex-1 flex flex-col justify-between rounded-[2rem] p-6 bg-surface border-t border-t-white/10 border-b border-b-black/30 shadow-card transition-all duration-700 ease-premium hover:shadow-float transform-gpu ${isSwapping ? 'translate-y-[calc(50%_+_0.75rem)] scale-90' : ''}`}>
                                <div className={`transition-opacity duration-300 ${isSwapping ? 'opacity-0' : 'opacity-100'}`}>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1 mb-2 block">{t('from')}</span>
                                    <div className="flex items-center justify-between gap-4">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setIsSelectingUnit('from'); }} 
                                            className="flex items-center gap-2 bg-black/20 hover:bg-black/30 active:bg-black/40 border border-white/5 shadow-inner-depth rounded-full pl-4 pr-2 py-2.5 transition-all duration-300 group/btn"
                                        >
                                            <span className="text-lg font-bold text-text-color group-hover/btn:text-primary transition-colors max-w-[140px] truncate">
                                                {t(`unit_${fromUnit}` as TranslationKey)}
                                            </span>
                                            <span className="material-symbols-outlined text-text-muted group-hover/btn:text-primary transition-colors text-xl bg-white/5 rounded-full p-0.5">
                                                expand_more
                                            </span>
                                        </button>
                                        
                                        <p className={`text-4xl font-light text-right transition-all duration-300 break-all truncate flex-1 ${isClearing ? 'animate-clear-out' : ''}`}>
                                            {formatNumber(display)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* TO CARD - Depth Enhanced */}
                            <div className={`flex-1 flex flex-col justify-between rounded-[2rem] p-6 bg-surface border-t border-t-white/10 border-b border-b-black/30 shadow-card transition-all duration-700 ease-premium hover:shadow-float transform-gpu ${isSwapping ? '-translate-y-[calc(50%_+_0.75rem)] scale-90' : ''}`}>
                                <div className={`transition-opacity duration-300 ${isSwapping ? 'opacity-0' : 'opacity-100'}`}>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1 mb-2 block">{t('to')}</span>
                                    <div className="flex items-center justify-between gap-4">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setIsSelectingUnit('to'); }} 
                                            className="flex items-center gap-2 bg-black/20 hover:bg-black/30 active:bg-black/40 border border-white/5 shadow-inner-depth rounded-full pl-4 pr-2 py-2.5 transition-all duration-300 group/btn"
                                        >
                                            <span className="text-lg font-bold text-text-color group-hover/btn:text-primary transition-colors max-w-[140px] truncate">
                                                {t(`unit_${toUnit}` as TranslationKey)}
                                            </span>
                                            <span className="material-symbols-outlined text-text-muted group-hover/btn:text-primary transition-colors text-xl bg-white/5 rounded-full p-0.5">
                                                expand_more
                                            </span>
                                        </button>

                                        <p className={`text-4xl font-light text-primary text-right transition-all duration-300 break-all truncate flex-1 ${isClearing ? 'animate-clear-out' : ''}`}>
                                            {formatNumber(outputValue)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slot 2: Date Calculator */}
                <div className={`absolute inset-0 transition-transform duration-700 ease-premium transform-gpu ${activeGroupIndex === 2 ? 'translate-y-0' : activeGroupIndex > 2 ? '-translate-y-full' : 'translate-y-full'}`}>
                    <DateCalculatorView mode={dateMode} logic={dateLogic} />
                </div>

                {/* Slot 3: Finance Calculator */}
                <div className={`absolute inset-0 transition-transform duration-700 ease-premium transform-gpu ${activeGroupIndex === 3 ? 'translate-y-0' : activeGroupIndex > 3 ? '-translate-y-full' : 'translate-y-full'}`}>
                    <FinanceCalculatorView logic={financeLogic} />
                </div>

                {/* Slot 4: BMI Calculator */}
                <div className={`absolute inset-0 transition-transform duration-700 ease-premium transform-gpu ${activeGroupIndex === 4 ? 'translate-y-0' : 'translate-y-full'}`}>
                    <BMICalculatorView logic={bmiLogic} />
                </div>

            </main>

            {/* OPTIMIZED FOOTER KEYPAD */}
            {/* Added Event Delegation Listener (onClick) */}
            <footer 
                ref={keypadRef} 
                className="relative rounded-t-[3rem] overflow-hidden transition-all duration-700 ease-premium shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.6)] z-20 border-t border-white/10 ring-1 ring-white/5 touch-manipulation" 
                style={{ height: '45dvh', contain: 'strict' }}
                onClick={handleFooterClick}
            >
                
                {/* 1. Static Blur Layer */}
                <div className={`absolute inset-0 bg-keypad/50 backdrop-blur-2xl gpu-accelerated pointer-events-none ${isAnimating ? 'fast-anim' : ''}`} />
                
                {/* 2. Gradient Overlay */}
                <div className="absolute inset-0 bg-glass-gradient opacity-30 pointer-events-none gpu-accelerated" />

                {/* 3. Button Container */}
                {renderedButtons}
            </footer>

            {isSelectingUnit !== null && (
                <UnitSelectionModal isOpen={true} units={Object.keys(unitData[category].units).map(unitKey => ({ key: unitKey, label: t(`unit_${unitKey}` as TranslationKey) }))} selectedUnitKey={isSelectingUnit === 'from' ? fromUnit : toUnit} onSelect={handleUnitSelect} onClose={() => setIsSelectingUnit(null)} category={t(`unit_${category}` as TranslationKey)} />
            )}
            <DateCalculatorDrawer logic={dateLogic} />
        </div>
    );
};

export default MainView;
