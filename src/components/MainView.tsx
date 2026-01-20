
import React, { useState, useCallback, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { HistoryEntry, UnitCategoryKey, TranslationKey, UnitData, ConversionRates, AppMode, DateMode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { allButtons, scientificButtons, basicButtons, MAX_EXPRESSION_LENGTH, MAX_HISTORY_ITEMS, ANIMATION_DURATION } from '../constants';
import { conversionData } from '../constants/units';
import { formatNumber, formatFormula, evaluateExpression, calculateLayout } from '../utils';
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
    dateMode: DateMode;
    setSwapUnitsTrigger: (fn: () => void) => void;
    financeLogic: ReturnType<typeof useFinanceCalculator>;
}

const MainView: React.FC<MainViewProps> = ({ history, setHistory, calculatorMode, appMode, dateMode, setSwapUnitsTrigger, financeLogic }) => {
    const { t } = useLanguage();
    
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
        const timer = setTimeout(() => { setIsAnimating(false); }, ANIMATION_DURATION + 50);
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
        const handleResize = () => {
            if (keypadRef.current) {
                const containerHeight = keypadRef.current.offsetHeight;
                const containerWidth = keypadRef.current.offsetWidth;
                const PADDING = 16;
                const numRows = (appMode === 'converter' || appMode === 'date' || appMode === 'finance' || appMode === 'bmi') ? 5 : (calculatorMode === 'scientific' ? 7 : 5);
                const totalParts = (numRows * 4) + (numRows - 1) * 1;
                const availableHeight = containerHeight - (PADDING * 2);
                const partHeight = availableHeight / totalParts;
                const newHeight = Math.max(20, partHeight * 4);
                const newGap = Math.max(4, partHeight * 1);
                setDynamicBtnHeight(newHeight);
                setDynamicBtnGap(newGap);
                setKeypadWidth(containerWidth);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        const resizeObserver = new ResizeObserver(handleResize);
        if (keypadRef.current) resizeObserver.observe(keypadRef.current);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (keypadRef.current) resizeObserver.unobserve(keypadRef.current);
        };
    }, [calculatorMode, appMode]);

    const buttonStyles = useMemo(() => {
        if (keypadWidth === 0) return {};
        let layoutMode: 'scientific' | 'basic' | 'converter' | 'numeric' | 'date' | 'finance' = 'basic';
        if (appMode === 'calculator') layoutMode = calculatorMode;
        else if (appMode === 'converter') layoutMode = 'converter';
        else if (appMode === 'date') layoutMode = 'date';
        else if (appMode === 'finance') layoutMode = 'finance';
        else if (appMode === 'bmi') layoutMode = 'finance';

        const currentLayout = calculateLayout(layoutMode, keypadWidth, dynamicBtnHeight, dynamicBtnGap);
        const refLayout = calculateLayout(calculatorMode === 'scientific' ? 'scientific' : 'basic', keypadWidth, dynamicBtnHeight, dynamicBtnGap);

        const styles: Record<string, React.CSSProperties> = {};
        const springEase = 'cubic-bezier(0.4, 1.25, 0.2, 1)'; 

        allButtons.forEach(btn => {
            const targetStyle = currentLayout[btn.value];
            if (targetStyle) {
                styles[btn.value] = {
                    ...targetStyle,
                    transition: `transform ${ANIMATION_DURATION}ms ${springEase}, opacity 300ms ease-out, width ${ANIMATION_DURATION}ms ${springEase}, height ${ANIMATION_DURATION}ms ${springEase}`,
                    willChange: 'transform, opacity, width, height',
                };
            } else {
                let exitStyle: React.CSSProperties = {
                    opacity: 0,
                    transform: 'scale(0.8)',
                    pointerEvents: 'none',
                    transition: `transform ${ANIMATION_DURATION}ms ${springEase}, opacity 200ms ease-out`,
                };
                if ((btn.type === 'operator' || btn.value === '=') && refLayout[btn.value]) {
                    const refStyle = refLayout[btn.value];
                    const originalX = parseFloat((refStyle as any)['--tw-translate-x']);
                    if (!isNaN(originalX)) {
                         exitStyle = {
                            ...refStyle,
                            '--tw-translate-x': `${originalX + keypadWidth + 30}px`,
                            opacity: 1,
                            pointerEvents: 'none',
                            transition: `transform ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                         } as any;
                    }
                }
                styles[btn.value] = exitStyle;
            }
        });
        return styles;
    }, [calculatorMode, keypadWidth, appMode, dynamicBtnHeight, dynamicBtnGap]);

    const swapUnits = useCallback(() => {
        if (isSwapping) return;
        setIsSwapping(true);
        setTimeout(() => {
            const cF = fromUnit; const cT = toUnit; const cO = outputValue;
            setFromUnit(cT); setToUnit(cF); setDisplay(cO);
        }, 200);
        setTimeout(() => setIsSwapping(false), 450);
    }, [fromUnit, toUnit, outputValue, isSwapping]);

    useEffect(() => { setSwapUnitsTrigger(swapUnits); }, [swapUnits, setSwapUnitsTrigger]);

    const handleUnitSelect = (unitKey: string) => {
        if (isSelectingUnit === 'from') setFromUnit(unitKey);
        else if (isSelectingUnit === 'to') setToUnit(unitKey);
        setIsSelectingUnit(null);
    };

    const handleButtonClick = (value: string) => {
        if (isAnimating) return;
        if (appMode === 'date') { dateLogic.handlePadClick(value); return; }
        if (appMode === 'finance') { financeLogic.handlePadClick(value); return; }
        if (appMode === 'bmi') { bmiLogic.handlePadClick(value); return; }

        if (isConverterMode) {
            if (display.length > MAX_EXPRESSION_LENGTH && !['AC', '=', 'backspace'].includes(value)) return;
            switch (value) {
                case 'AC': setIsClearing(true); setTimeout(() => { setDisplay('0'); setIsClearing(false); }, 300); break;
                case 'backspace': setDisplay(val => val.length > 1 ? val.slice(0, -1) : '0'); break;
                case '+/-': if (display !== '0') setDisplay(val => val.startsWith('-') ? val.slice(1) : '-' + val); break;
                case '.': if (!display.includes('.')) setDisplay(val => val + '.'); break;
                default: if (value >= '0' && value <= '9') { if (display === '0') setDisplay(value); else setDisplay(val => val + value); }
            }
        } else {
            if (expression.length > MAX_EXPRESSION_LENGTH && !['AC', '=', 'backspace'].includes(value)) return;
            switch (value) {
                case 'AC': setIsClearing(true); setTimeout(() => { setExpression(''); setLastExpression(''); setDisplay('0'); setIsClearing(false); }, 300); setLastActionWasEquals(false); break;
                case 'backspace': 
                    if (lastActionWasEquals) { setExpression(''); setLastExpression(''); setDisplay('0'); setLastActionWasEquals(false); break; }
                    if (expression.length > 0) {
                        const newExpression = expression.slice(0, -1);
                        setExpression(newExpression);
                        const lastNumber = newExpression.match(/(\d+(\.\d+)?|pi|e)$/);
                        if(lastNumber) setDisplay(lastNumber[0]); else setDisplay('0');
                    } break;
                case 'shift': setIsShifted(prev => !prev); break;
                case '()': 
                    const openCount = (expression.match(/\(/g) || []).length; 
                    const closeCount = (expression.match(/\)/g) || []).length; 
                    const shouldClose = openCount > closeCount && (/\d$/.test(expression) || expression.endsWith(')') || expression.endsWith('pi') || expression.endsWith('e'));
                    setExpression(prev => prev + (shouldClose ? ')' : '(')); setLastActionWasEquals(false); break; 
                case '=': 
                    if (expression) { 
                        setLastExpression(expression); const result = evaluateExpression(expression); setDisplay(result); setLastActionWasEquals(true); 
                        if (result !== 'Error') setHistory([{ expression, result }, ...history.slice(0, MAX_HISTORY_ITEMS - 1)]); 
                        setExpression(result !== 'Error' ? result : ''); 
                    } break;
                case '+/-': 
                    if (lastActionWasEquals) { const newVal = display.startsWith('-') ? display.slice(1) : '-' + display; setExpression(newVal); setDisplay(newVal); setLastActionWasEquals(false); break; }
                    if (display !== '0' && display !== 'Error') { const newDisplay = display.startsWith('-') ? display.slice(1) : '-' + display; setDisplay(newDisplay); if (expression.endsWith(display)) setExpression(prev => prev.slice(0, prev.length - display.length) + newDisplay); } break;
                case '%': 
                    if (lastActionWasEquals) { const val = (parseFloat(display) / 100).toString(); setExpression(val); setDisplay(val); setLastActionWasEquals(false); break; }
                    if (display !== 'Error' && display !== '0') { const num = parseFloat(display) / 100; const strNum = num.toString(); setDisplay(strNum); setExpression(prev => prev.slice(0, prev.length - display.length) + strNum); } break;
                case '.': 
                    if (lastActionWasEquals) { setExpression('0.'); setDisplay('0.'); setLastActionWasEquals(false); break; }
                    if (!display.includes('.')) { if (['+', '−', '×', '÷', '*', '/', '-', '+', '^', '('].some(op => expression.endsWith(op)) || expression === '') { setExpression(expression + '0.'); setDisplay('0.'); } else { setExpression(expression + '.'); setDisplay(display + '.'); } } break;
                default: 
                    if (lastActionWasEquals) {
                         if (['+', '−', '×', '÷', '^', '*', '/', '-', '+'].includes(value) || value === '^2' || value === '^3' || value === '^(-1)') { setLastActionWasEquals(false); setExpression(expression + value); setDisplay('0'); } 
                         else { setLastActionWasEquals(false); setLastExpression(''); setExpression(value); setDisplay(value); }
                         return;
                    }
                    if (['+', '−', '×', '÷', '*', '/', '-', '+', '^', '(', ')'].includes(value)) setDisplay('0');
                    else if (value >= '0' && value <= '9') { if (display === '0' || ['+', '−', '×', '÷', '*', '/', '-', '+', '^', '(', ')'].some(op => expression.endsWith(op))) setDisplay(value); else setDisplay(prev => prev + value); }
                    if (expression === '0' || expression === 'Error') setExpression(value); else setExpression(prev => prev + value);
            }
        }
    };

    return (
        <div className="flex h-full flex-col relative">
            <main className="flex-1 relative overflow-hidden"> 
                {/* Slot 0: Calculator */}
                <div className={`absolute inset-0 transition-transform duration-500 ease-spring ${activeGroupIndex === 0 ? 'translate-y-0' : '-translate-y-full'}`}>
                     <div className="h-full flex flex-col justify-end p-6 text-right overflow-hidden">
                        <div className={`mb-2 h-10 text-2xl font-bold text-text-muted truncate transition-opacity duration-300 ${isClearing ? 'animate-clear-out' : ''}`}>
                            {lastActionWasEquals ? `(${formatFormula(lastExpression)})` : (liveResult ? formatNumber(liveResult) : ' ')}
                        </div>
                        <div key={expression} className={`font-bold break-all text-5xl ${isClearing ? 'animate-clear-out' : (appMode==='calculator' && lastActionWasEquals) ? 'animate-pop-in' : 'animate-pop-in-fast'} transition-all duration-300 ease-spring`}>
                            {formatFormula(expression || '0')}
                        </div>
                     </div>
                </div>

                {/* Slot 1: Converter */}
                <div className={`absolute inset-0 transition-transform duration-500 ease-spring ${activeGroupIndex === 1 ? 'translate-y-0' : activeGroupIndex > 1 ? '-translate-y-full' : 'translate-y-full'}`}>
                     <div className="h-full flex flex-col p-6 text-right">
                         <div className="mb-4 flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                            {(Object.keys(unitData) as UnitCategoryKey[]).map((catKey) => (
                                <button key={catKey} onClick={() => { setCategory(catKey); const units = Object.keys(unitData[catKey].units); setFromUnit(units[0]); setToUnit(units[1] || units[0]); setDisplay('1'); }} 
                                    className={`flex shrink-0 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 transition-all duration-300 ${category === catKey ? (catKey === 'Currency' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-primary text-text-on-primary shadow-lg') : 'bg-surface/50 text-text-muted hover:bg-surface hover:text-text-color'}`}>
                                    <span className="material-symbols-outlined text-xl">{unitData[catKey].icon}</span>
                                    <span className="text-sm font-bold tracking-wide">{t(`unit_${catKey}` as TranslationKey)}</span>
                                </button>
                            ))}
                        </div>
                        <div className="relative flex-1 flex w-full flex-col gap-4 text-left">
                            <div className={`z-10 flex-1 flex w-full items-center justify-between cursor-pointer rounded-3xl p-6 bg-surface shadow-inner backdrop-blur-md border border-white/5 transition-all duration-500 ease-spring ${isSwapping ? 'translate-y-[calc(50%_+_0.5rem)] scale-90' : ''}`}>
                                <div onClick={(e) => { e.stopPropagation(); setIsSelectingUnit('from'); }} className={`flex flex-col gap-1 transition-opacity duration-300 ${isSwapping ? 'opacity-0' : 'opacity-100'}`}>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{t('from')}</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xl font-bold">{t(`unit_${fromUnit}` as TranslationKey)}</span>
                                        <span className="material-symbols-outlined !text-xl text-text-muted">expand_more</span>
                                    </div>
                                </div>
                                <p className={`text-4xl font-bold text-right transition-all duration-300 break-all ${isClearing ? 'animate-clear-out' : ''} ${isSwapping ? 'opacity-0' : 'opacity-100'}`}>{formatNumber(display)}</p>
                            </div>
                            <div className={`flex-1 flex w-full items-center justify-between cursor-pointer rounded-3xl p-6 bg-surface shadow-inner backdrop-blur-md border border-white/5 transition-all duration-500 ease-spring ${isSwapping ? '-translate-y-[calc(50%_+_0.5rem)] scale-90' : ''}`}>
                                <div onClick={(e) => { e.stopPropagation(); setIsSelectingUnit('to'); }} className={`flex flex-col gap-1 transition-opacity duration-300 ${isSwapping ? 'opacity-0' : 'opacity-100'}`}>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{t('to')}</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xl font-bold">{t(`unit_${toUnit}` as TranslationKey)}</span>
                                        <span className="material-symbols-outlined !text-xl text-text-muted">expand_more</span>
                                    </div>
                                </div>
                                <p className={`text-4xl font-bold text-primary text-right transition-all duration-300 break-all ${isClearing ? 'animate-clear-out' : ''} ${isSwapping ? 'opacity-0' : 'opacity-100'}`}>{formatNumber(outputValue)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slot 2: Date Calculator */}
                <div className={`absolute inset-0 transition-transform duration-500 ease-spring ${activeGroupIndex === 2 ? 'translate-y-0' : activeGroupIndex > 2 ? '-translate-y-full' : 'translate-y-full'}`}>
                    <DateCalculatorView mode={dateMode} logic={dateLogic} />
                </div>

                {/* Slot 3: Finance Calculator */}
                <div className={`absolute inset-0 transition-transform duration-500 ease-spring ${activeGroupIndex === 3 ? 'translate-y-0' : activeGroupIndex > 3 ? '-translate-y-full' : 'translate-y-full'}`}>
                    <FinanceCalculatorView logic={financeLogic} />
                </div>

                {/* Slot 4: BMI Calculator */}
                <div className={`absolute inset-0 transition-transform duration-500 ease-spring ${activeGroupIndex === 4 ? 'translate-y-0' : 'translate-y-full'}`}>
                    <BMICalculatorView logic={bmiLogic} />
                </div>

            </main>

            {/* Arka plan bg-keypad olarak güncellendi, rengi artık ThemeContext'teki opaque-glass belirler */}
            <footer ref={keypadRef} className="relative bg-keypad backdrop-blur-3xl rounded-t-[2.5rem] overflow-hidden transition-all duration-500 ease-spring shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.5)] z-20 border-t border-white/10" style={{ height: '46.66dvh' }}>
                <div className="absolute inset-0">
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
                        else if (sciBtn?.shiftedDisplay && isShifted && appMode === 'calculator') buttonSpecificClass = '!bg-surface brightness-125 dark:brightness-150';
                        return <CalculatorButton key={btn.value} config={finalConfig} onClick={handleButtonClick} style={finalStyle} className={`${buttonSpecificClass} will-change-transform shadow-md`} />;
                    })}
                </div>
            </footer>

            {isSelectingUnit !== null && (
                <UnitSelectionModal isOpen={true} units={Object.keys(unitData[category].units).map(unitKey => ({ key: unitKey, label: t(`unit_${unitKey}` as TranslationKey) }))} selectedUnitKey={isSelectingUnit === 'from' ? fromUnit : toUnit} onSelect={handleUnitSelect} onClose={() => setIsSelectingUnit(null)} category={t(`unit_${category}` as TranslationKey)} />
            )}
            <DateCalculatorDrawer logic={dateLogic} />
        </div>
    );
};

export default MainView;
