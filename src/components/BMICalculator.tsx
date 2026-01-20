
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { formatNumber } from '../utils';

export const useBMICalculator = () => {
    const [weight, setWeight] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [activeInput, setActiveInput] = useState<'weight' | 'height'>('weight');
    const [bmi, setBmi] = useState<string>('0');
    const [category, setCategory] = useState<string>('');

    useEffect(() => {
        const w = parseFloat(weight);
        const h = parseFloat(height);

        if (w > 0 && h > 0) {
            // BMI = weight (kg) / (height (m))^2
            const heightInMeters = h / 100;
            const bmiValue = w / (heightInMeters * heightInMeters);
            setBmi(bmiValue.toFixed(1));
        } else {
            setBmi('0');
        }
    }, [weight, height]);

    const handlePadClick = (value: string) => {
        const setMap = {
            'weight': setWeight,
            'height': setHeight,
        };
        const currentVal = { weight, height }[activeInput];
        const setter = setMap[activeInput];

        if (value === 'backspace') {
            setter(prev => prev.length > 0 ? prev.slice(0, -1) : '');
        } else if (value === 'AC') {
            setWeight('');
            setHeight('');
        } else if (value === '.') {
            if (!currentVal.includes('.')) setter(prev => prev + '.');
        } else if (value >= '0' && value <= '9') {
            setter(prev => prev + value);
        }
    };

    return {
        weight, setWeight,
        height, setHeight,
        gender, setGender,
        activeInput, setActiveInput,
        bmi, category,
        handlePadClick
    };
};

export const BMICalculatorView: React.FC<{ logic: ReturnType<typeof useBMICalculator> }> = ({ logic }) => {
    const { t } = useLanguage();
    const {
        weight, height, gender, setGender, activeInput, setActiveInput,
        bmi
    } = logic;

    const bmiNum = parseFloat(bmi);
    let categoryText = '';
    let categoryColor = 'text-text-muted';

    if (bmiNum > 0) {
        if (bmiNum < 18.5) {
            categoryText = t('underweight');
            categoryColor = 'text-blue-400';
        } else if (bmiNum < 25) {
            categoryText = t('normal');
            categoryColor = 'text-green-500';
        } else if (bmiNum < 30) {
            categoryText = t('overweight');
            categoryColor = 'text-yellow-500';
        } else {
            categoryText = t('obese');
            categoryColor = 'text-red-500';
        }
    }

    const inputClass = "w-full rounded-2xl bg-surface p-4 text-2xl outline-none ring-1 ring-text-color/20 transition-all text-right font-mono caret-primary";
    const activeInputClass = "ring-2 ring-primary bg-background shadow-[0_4px_20px_-8px_var(--color-primary)]";
    const labelClass = "mb-2 block text-xs font-bold text-text-muted uppercase tracking-wider";

    return (
        <div className="flex-1 overflow-hidden p-4 flex flex-col h-full w-full">
            <div className="flex-1 flex flex-col gap-4 min-h-0">
                
                {/* Gender Selection */}
                <div className="flex gap-4 shrink-0">
                    <button 
                        onClick={() => setGender('male')}
                        className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 border ${gender === 'male' ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'bg-surface border-transparent text-text-muted hover:bg-surface/80'}`}
                    >
                        <span className="material-symbols-outlined text-3xl mb-1">male</span>
                        <span className="text-xs font-bold uppercase">{t('male')}</span>
                    </button>
                    <button 
                        onClick={() => setGender('female')}
                        className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 border ${gender === 'female' ? 'bg-pink-500/10 border-pink-500 text-pink-500' : 'bg-surface border-transparent text-text-muted hover:bg-surface/80'}`}
                    >
                        <span className="material-symbols-outlined text-3xl mb-1">female</span>
                        <span className="text-xs font-bold uppercase">{t('female')}</span>
                    </button>
                </div>

                <div className="flex gap-4 min-h-0 flex-1">
                    <div onClick={() => setActiveInput('weight')} className="flex-1 flex flex-col justify-end">
                        <label className={labelClass}>{t('weight')}</label>
                        <input readOnly type="text" value={weight} placeholder="0" className={`${inputClass} ${activeInput === 'weight' ? activeInputClass : ''} cursor-pointer transition-colors duration-200 h-full max-h-24`} />
                    </div>
                    <div onClick={() => setActiveInput('height')} className="flex-1 flex flex-col justify-end">
                        <label className={labelClass}>{t('height')}</label>
                        <input readOnly type="text" value={height} placeholder="0" className={`${inputClass} ${activeInput === 'height' ? activeInputClass : ''} cursor-pointer transition-colors duration-200 h-full max-h-24`} />
                    </div>
                </div>

                <div className="rounded-2xl bg-surface p-4 shadow-lg shrink-0 text-center space-y-2 mt-auto">
                    <div className="text-text-muted text-xs font-bold uppercase tracking-widest">{t('bmiScore')}</div>
                    <div className={`text-6xl font-bold ${categoryColor} transition-colors duration-500`}>
                        {formatNumber(bmi)}
                    </div>
                    {bmiNum > 0 && (
                        <div className={`text-xl font-medium ${categoryColor} animate-pop-in`}>
                            {categoryText}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const BMICalculator: React.FC = () => {
    const logic = useBMICalculator();
    return (
        <div className="flex h-full flex-col">
            <BMICalculatorView logic={logic} />
        </div>
    );
};

export default BMICalculator;
