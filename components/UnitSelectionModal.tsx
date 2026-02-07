
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface UnitOption {
    key: string;
    label: string;
}

interface UnitSelectionModalProps {
    isOpen: boolean;
    units: UnitOption[];
    selectedUnitKey: string;
    onSelect: (unitKey: string) => void;
    onClose: () => void;
    category: string;
}

const UnitSelectionModal: React.FC<UnitSelectionModalProps> = ({ isOpen, units, selectedUnitKey, onSelect, onClose, category }) => {
    const { t } = useLanguage();
    const [isClosing, setIsClosing] = useState(false);
    const [pendingAction, setPendingAction] = useState<'close' | { select: string } | null>(null);

    const handleClose = () => {
        if (isClosing) return;
        setIsClosing(true);
        setPendingAction('close');
    };

    const handleSelect = (key: string) => {
        if (isClosing) return;
        setIsClosing(true);
        setPendingAction({ select: key });
    };

    // Safety fallback: Ensure action is taken even if animation event fails
    useEffect(() => {
        if (isClosing && pendingAction) {
            const timer = setTimeout(() => {
                if (pendingAction === 'close') {
                    onClose();
                } else {
                    onSelect(pendingAction.select);
                }
            }, 350); // Slightly longer than 300ms animation
            return () => clearTimeout(timer);
        }
    }, [isClosing, pendingAction, onClose, onSelect]);

    const onAnimationEnd = (e: React.AnimationEvent) => {
        // Sadece modalın ana animasyonu bittiğinde tetiklenmesini sağla
        if (e.target !== e.currentTarget) return;

        if (isClosing && pendingAction) {
            if (pendingAction === 'close') {
                onClose();
            } else {
                onSelect(pendingAction.select);
            }
        }
    };

    return (
        // 'fixed inset-0' ve yüksek z-index (z-[100]) sayesinde header dahil tüm ekranı kaplar
        <div 
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} 
            onClick={handleClose}
            onAnimationEnd={onAnimationEnd}
        >
            <div 
                className={`flex flex-col w-11/12 max-w-sm max-h-[80dvh] rounded-[2.5rem] bg-surface shadow-2xl border border-white/10 ${isClosing ? 'animate-fade-scale-out' : 'animate-fade-scale-in-up'}`} 
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-6 border-b border-text-color/10">
                    <h3 className="text-xl font-bold text-center tracking-tight text-text-color">{t('unitSelectionTitle', { category })}</h3>
                </header>
                <div className="flex-grow p-3 overflow-y-auto custom-scrollbar">
                    <ul className="space-y-2">
                        {units.map((unit, index) => (
                            <li key={unit.key} className={!isClosing ? 'opacity-0 animate-fade-in-up' : ''} style={!isClosing ? { animationDelay: `${index * 30}ms` } : {}}>
                                <button 
                                    onClick={() => handleSelect(unit.key)} 
                                    className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 text-lg font-bold ${unit.key === selectedUnitKey ? 'bg-primary text-text-on-primary shadow-lg scale-100' : 'hover:bg-text-color/5 active:scale-95 text-text-color'}`}
                                >
                                    {unit.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <footer className="flex-shrink-0 p-4">
                    <button onClick={handleClose} className="w-full py-4 text-xl font-bold rounded-full bg-secondary/20 text-secondary hover:bg-secondary/30 transition-all active:scale-95 border border-secondary/20">
                        {t('close')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default UnitSelectionModal;
