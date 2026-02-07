
import React from 'react';
import { ButtonConfig } from '../constants';

const CalculatorButton: React.FC<{
    config: ButtonConfig;
    style: React.CSSProperties;
    className?: string;
}> = ({ config, style, className }) => {
    // OPTIMIZATION: 
    // 1. Removed onClick prop (handled by parent via Event Delegation)
    // 2. Faster durations for interactions
    // 3. Refined shadows and gradients
    
    // Increased standard duration to 400ms and active duration to 150ms for softer feel
    let btnClass = 'group flex items-center justify-center rounded-[2rem] font-medium text-[1.7rem] w-full h-full transition-[transform,background-color,box-shadow,opacity,filter] duration-400 ease-premium active:duration-150 active:scale-90 active:rounded-[1.4rem] active:shadow-btn-active active:translate-y-[1px] border border-white/5 select-none relative overflow-hidden shadow-card transform-gpu backface-hidden touch-manipulation';

    const glassHighlight = 'bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12)_0%,_rgba(255,255,255,0)_60%)]';
    const solidHighlight = 'bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25)_0%,_rgba(255,255,255,0)_70%)]';

    if (config.type === 'operator') {
        btnClass += ` bg-primary text-text-on-primary shadow-md border-primary/50 shadow-inner-light ${solidHighlight}`;
    } else if (config.type === 'special') {
        if (['AC', '+/-', '%', 'backspace', '()', 'shift'].includes(config.value)) {
            btnClass += ` bg-secondary text-text-on-secondary font-semibold text-xl shadow-md border-secondary/30 shadow-inner-light ${solidHighlight}`;
        } else {
            // This is mostly for '='
            btnClass += ` bg-primary text-text-on-primary shadow-lg text-[2rem] border-primary/50 shadow-inner-light ${solidHighlight}`;
        }
    } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(config.value)) {
        btnClass += ` bg-number-key text-text-color hover:brightness-110 dark:hover:brightness-125 shadow-sm shadow-inner-light ${glassHighlight}`;
    } else {
        btnClass += ` bg-surface text-text-color hover:brightness-110 dark:hover:brightness-125 shadow-sm shadow-inner-light ${glassHighlight}`;
    }

    return (
        <div style={style} className="absolute flex items-center justify-center p-[4px] pointer-events-none">
            {/* Pointer events auto re-enabled on button to allow clicks to bubble from button but not container div */}
            <button 
                data-value={config.value}
                className={`${btnClass} ${className || ''} pointer-events-auto`}
                type="button"
                aria-label={typeof config.display === 'string' ? config.display : config.value}
            >
                {config.display}
            </button>
        </div>
    );
};

// Simplified props check
const arePropsEqual = (prevProps: any, nextProps: any) => {
    return (
        prevProps.config.value === nextProps.config.value &&
        prevProps.config.display === nextProps.config.display &&
        prevProps.className === nextProps.className &&
        // Style check
        prevProps.style.transform === nextProps.style.transform &&
        prevProps.style.width === nextProps.style.width &&
        prevProps.style.height === nextProps.style.height &&
        prevProps.style.opacity === nextProps.style.opacity
    );
};

export default React.memo(CalculatorButton, arePropsEqual);
