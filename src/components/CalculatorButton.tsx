
import React from 'react';
import { ButtonConfig } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

const CalculatorButton: React.FC<{
    config: ButtonConfig;
    onClick: (value: string) => void;
    style: React.CSSProperties;
    className?: string;
}> = ({ config, onClick, style, className }) => {
    const { triggerVibration } = useTheme();

    const handlePress = () => {
        triggerVibration();
        onClick(config.value);
    };

    // Active: 100ms shrink, Release: 400ms spring bounce back (snappy)
    let btnClass = 'flex items-center justify-center rounded-2xl font-bold text-2xl absolute transition-all duration-400 ease-spring transform active:scale-90 active:rounded-3xl active:duration-100 active:brightness-90';

    if (config.type === 'operator') {
        btnClass += ' bg-primary text-text-on-primary';
    } else if (config.type === 'special') {
        if (['AC', '+/-', '%', 'backspace', '()', 'shift'].includes(config.value)) {
            btnClass += ' bg-secondary text-text-on-secondary';
        } else {
            btnClass += ' bg-primary text-text-on-primary';
            if (config.value === '=') {
                btnClass += ' active:shadow-[0_0_20px_var(--color-primary)]';
            }
        }
    } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(config.value)) {
        btnClass += ' bg-number-key text-text-color hover:brightness-110 dark:hover:brightness-125';
    } else {
        btnClass += ' bg-surface text-text-color hover:brightness-110 dark:hover:brightness-125';
    }

    return <button onClick={handlePress} className={`${btnClass} ${className || ''}`} style={style}>{config.display}</button>;
};

export default CalculatorButton;
