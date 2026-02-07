
import React, { useState } from 'react';
import { View, HistoryEntry, AppMode, DateMode } from '../types';
import AppHeader from './AppHeader';
import MainView from './MainView';
import { useFinanceCalculator } from './FinanceCalculator';

interface CalculatorViewProps {
    onNavigate: (view: View, e: React.MouseEvent<HTMLButtonElement>) => void;
    history: HistoryEntry[];
    setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
    isOverlayActive: boolean;
}

const CalculatorView: React.FC<CalculatorViewProps> = ({ onNavigate, history, setHistory, isOverlayActive }) => {
    const [calculatorMode, setCalculatorMode] = useState<'scientific' | 'basic'>('basic');
    const [appMode, setAppMode] = useState<AppMode>('calculator');
    const [dateMode, setDateMode] = useState<DateMode>('diff');
    const [swapUnitsTrigger, setSwapUnitsTrigger] = useState<() => void>(() => () => {});

    // Lift finance state here so it can be passed to Header
    const financeLogic = useFinanceCalculator();

    return (
        <div className="flex h-full flex-col">
            <div className={`transition-all duration-500 transform ${isOverlayActive ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                <AppHeader
                    onNavigate={onNavigate}
                    calculatorMode={calculatorMode}
                    setCalculatorMode={setCalculatorMode}
                    appMode={appMode}
                    setAppMode={setAppMode}
                    onSwapUnits={swapUnitsTrigger}
                    dateMode={dateMode}
                    setDateMode={setDateMode}
                    financeOrder={financeLogic.calcOrder}
                    setFinanceOrder={financeLogic.setCalcOrder}
                />
            </div>
            {/* MainView Shell */}
            <div className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 h-full w-full">
                    <MainView
                        history={history}
                        setHistory={setHistory}
                        calculatorMode={calculatorMode}
                        appMode={appMode}
                        setAppMode={setAppMode}
                        dateMode={dateMode}
                        setSwapUnitsTrigger={(fn) => setSwapUnitsTrigger(() => fn)}
                        financeLogic={financeLogic}
                    />
                </div>
            </div>
        </div>
    );
};

export default CalculatorView;
