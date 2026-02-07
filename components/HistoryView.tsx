
import React, { useState } from 'react';
import { View, HistoryEntry } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { formatNumber } from '../utils';

type AnimationOrigin = { top: string; right: string; bottom: string; left: string; } | null;

interface HistoryViewProps {
    setView: () => void;
    history: HistoryEntry[];
    setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
    animationOrigin: AnimationOrigin;
}

const HistoryView: React.FC<HistoryViewProps> = ({ setView, history, setHistory, animationOrigin }) => {
    const { t } = useLanguage();
    const [isClosing, setIsClosing] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    
    const handleClearHistory = () => {
        const items = Array.from(document.querySelectorAll('.history-item'));
        if (items.length === 0) return;
        items.forEach((item, index) => {
            (item as HTMLElement).style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            (item as HTMLElement).style.transitionDelay = `${(items.length - 1 - index) * 40}ms`;
            (item as HTMLElement).style.opacity = '0';
            (item as HTMLElement).style.transform = 'translateX(20px)';
        });
        setTimeout(() => {
            setHistory([]);
        }, (items.length * 40) + 600);
    };

    const handleClose = () => {
        setIsClosing(true);
    };

    const handleCopy = (e: React.MouseEvent, text: string, index: number) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    const toggleExpand = (index: number) => {
        setExpandedIndex(prev => prev === index ? null : index);
    };

    const onAnimationEnd = (e: React.AnimationEvent) => {
        // Ensure we only react to the view's main animation ending, not children's animations
        if (e.target !== e.currentTarget) return;
        
        if (isClosing) {
            setView();
        }
    };

    return (
        <div
            className={`absolute inset-0 z-20 flex h-full flex-col bg-background glass-view ${isClosing ? 'animate-morph-out' : 'animate-morph-in'}`}
            style={animationOrigin ? {
                '--clip-top': animationOrigin.top,
                '--clip-right': animationOrigin.right,
                '--clip-bottom': animationOrigin.bottom,
                '--clip-left': animationOrigin.left,
            } as React.CSSProperties : {}}
            onAnimationEnd={onAnimationEnd}
        >
            <header className="flex items-center justify-between p-4 pt-6 pb-4 opacity-0 animate-slide-up-soft" style={{ animationDelay: '100ms' }}>
                <button 
                    onClick={handleClose} 
                    className="group flex h-11 w-11 items-center justify-center rounded-2xl bg-surface/50 border border-white/10 text-text-muted shadow-card backdrop-blur-md transition-all duration-300 hover:bg-surface hover:text-text-color hover:shadow-float hover:border-white/20 active:scale-90"
                >
                    <span className="material-symbols-outlined text-2xl transition-transform duration-300 group-hover:-translate-x-1">arrow_back</span>
                </button>
                <h2 className="text-2xl font-bold">{t('historyTitle')}</h2>
                <div className="w-11" />
            </header>
            <main className="flex-grow space-y-4 overflow-y-auto px-4 custom-scrollbar">
                {history.length === 0 ? (
                    <div className="flex h-full items-center justify-center"><p className="text-text-muted text-lg">{t('noHistory')}</p></div>
                ) : (
                    history.map((item, index) => (
                        <div 
                            key={index} 
                            onClick={() => toggleExpand(index)}
                            className="history-item relative opacity-0 animate-slide-up-soft cursor-pointer rounded-2xl bg-surface p-4 pl-14 text-right transition-all duration-400 ease-premium hover:brightness-110 dark:hover:brightness-125 active:scale-[0.98] group" 
                            style={{ animationDelay: `${200 + index * 60}ms` }}
                        >
                             {/* Copy Button */}
                             <button 
                                onClick={(e) => handleCopy(e, item.result, index)}
                                className={`absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/50 text-text-muted transition-all duration-300 hover:bg-primary hover:text-text-on-primary active:scale-90 z-10 ${copiedIndex === index ? 'bg-green-500 !text-white' : ''}`}
                                aria-label="Copy result"
                                title="Copy result"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {copiedIndex === index ? 'check' : 'content_copy'}
                                </span>
                            </button>

                            <div className="flex flex-col gap-1">
                                <p className={`text-lg text-text-muted transition-all duration-300 ${expandedIndex === index ? 'break-all whitespace-normal' : 'truncate'}`}>
                                    {item.expression}
                                </p>
                                <p className="text-3xl font-bold text-text-color">= {formatNumber(item.result)}</p>
                            </div>
                        </div>
                    ))
                )}
            </main>
            <footer className="p-4 opacity-0 animate-slide-up-soft" style={{ animationDelay: `${400 + (history.length > 0 ? Math.min(history.length, 10) : 1) * 60}ms` }}>
                <button onClick={handleClearHistory} className="w-full flex items-center justify-center rounded-full border-2 border-primary/50 py-3 text-xl font-bold text-primary transition-all duration-400 ease-premium hover:border-primary hover:bg-primary/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" disabled={history.length === 0}>
                    {t('clearHistory')}
                </button>
            </footer>
        </div>
    );
};

export default HistoryView;
