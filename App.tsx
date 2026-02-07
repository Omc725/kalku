
import React, { useState, useEffect } from 'react';
import { View, HistoryEntry } from './types';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import CalculatorView from './components/CalculatorView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';

type AnimationOrigin = { top: string; right: string; bottom: string; left: string; } | null;

const AppContent: React.FC = () => {
    const [view, setView] = useState<View>(View.CALCULATOR);
    const [animationOrigin, setAnimationOrigin] = useState<AnimationOrigin>(null);
    const [history, setHistory] = useState<HistoryEntry[]>(() => {
        try {
            const savedHistory = localStorage.getItem('calcHistory');
            return savedHistory ? JSON.parse(savedHistory) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('calcHistory', JSON.stringify(history));
    }, [history]);

    const handleNavigate = (targetView: View, event: React.MouseEvent<HTMLButtonElement>) => {
        // Try to find the header container by ID first (reliable), then fall back to class
        const islandElement = document.getElementById('header-main') || event.currentTarget.closest('.bg-surface') || event.currentTarget.closest('.bg-surface\\/90');
        
        if (islandElement) {
            const rect = islandElement.getBoundingClientRect();
            const container = islandElement.closest('.max-w-lg');
            if (container) {
                const containerRect = container.getBoundingClientRect();
                setAnimationOrigin({
                    top: `${rect.top - containerRect.top}px`,
                    right: `${containerRect.right - rect.right}px`,
                    bottom: `${containerRect.bottom - rect.bottom}px`,
                    left: `${rect.left - containerRect.left}px`,
                });
            }
        } else {
             // Fallback: If element not found, just reset animation origin so it opens normally (fade in)
             setAnimationOrigin(null);
        }
        
        setView(targetView);
    };
    
    return (
        <>
            <CalculatorView 
                onNavigate={handleNavigate} 
                history={history} 
                setHistory={setHistory} 
                isOverlayActive={view !== View.CALCULATOR}
            />
            {view === View.HISTORY && (
                <HistoryView
                    setView={() => setView(View.CALCULATOR)}
                    history={history}
                    setHistory={setHistory}
                    animationOrigin={animationOrigin}
                />
            )}
            {view === View.SETTINGS && (
                <SettingsView
                    setView={() => setView(View.CALCULATOR)}
                    animationOrigin={animationOrigin}
                />
            )}
        </>
    );
}

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <div className="h-[100dvh] w-full max-w-lg mx-auto bg-background relative overflow-hidden shadow-2xl">
                   <AppContent />
                </div>
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default App;
