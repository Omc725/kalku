
import React from 'react';
import { ButtonConfig, scientificButtons, basicButtons, numericButtons } from '../constants';

export const formatNumber = (numStr: string): string => {
    if (!numStr || numStr === 'Error') return numStr;
    // Scientific notation check to prevent BigInt errors
    if (numStr.includes('e') || numStr.includes('E')) return numStr;
    
    const [integer, decimal] = numStr.split('.');
    // Handle cases like "-" or empty string
    if (!integer || integer === '-') return numStr;

    try {
        const formattedInteger = new Intl.NumberFormat('en-US').format(BigInt(integer.replace(/,/g, '')));
        return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
    } catch (error) {
        return numStr;
    }
};

export const formatFormula = (expr: string): string => {
    // Split by operators: +, -, *, /, ^, (, )
    const parts = expr.split(/([+\-*/^()])/);
    
    return parts.map(part => {
        if (!part) return '';
        
        // Handle Operators with spaces for better readability
        if (['*', '/', '-', '+', '^'].includes(part)) {
            const map: Record<string, string> = {
                '*': ' × ',
                '/': ' ÷ ',
                '-': ' − ',
                '+': ' + ',
                '^': ' ^ '
            };
            return map[part];
        }

        if (part === '(' || part === ')') return part;

        // Handle Special Keywords
        if (part === 'pi') return 'π';
        if (part === 'sqrt') return '√';
        
        // Handle Numbers (including incomplete decimals like "4.")
        if (/^\d+\.?\d*$/.test(part)) {
            return formatNumber(part);
        }
        
        // Handle Functions/Other
        return part;
    }).join('');
};

export const evaluateExpression = (expr: string): string => {
    try {
        let evalExpr = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/\^/g, '**')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/cbrt/g, 'Math.cbrt')
            .replace(/log10/g, 'Math.log10')
            .replace(/log/g, 'Math.log')
            .replace(/abs/g, 'Math.abs')
            .replace(/floor/g, 'Math.floor')
            .replace(/ceil/g, 'Math.ceil')
            .replace(/round/g, 'Math.round')
            .replace(/random/g, 'Math.random')
            .replace(/pi/g, 'Math.PI')
            .replace(/e/g, 'Math.E');

        // Trig conversions (Degrees to Radians)
        evalExpr = evalExpr.replace(/(sin|cos|tan)\(([^)]+)\)/g, (_, func, angle) => `Math.${func}(${angle} * Math.PI / 180)`);
        evalExpr = evalExpr.replace(/(asin|acos|atan)\(([^)]+)\)/g, (_, func, val) => `(Math.${func}(${val}) * 180 / Math.PI)`);

        // Factorial and power helpers
        // We construct a function body that includes the factorial helper
        const factDef = `
            const fact = (n) => {
                if (n < 0) return NaN;
                if (n === 0 || n === 1) return 1;
                let result = 1;
                for (let i = 2; i <= n; i++) result *= i;
                return result;
            };
        `;
        
        const result = (new Function(`${factDef} return ${evalExpr};`) as () => number)();
        
        if (isNaN(result) || !isFinite(result)) return 'Error';
        // Cap precision to avoid floating point mess, but keep enough for scientific calc
        return parseFloat(result.toPrecision(12)).toString();
    } catch (error) { 
        // console.error(error); // Suppress errors during typing
        return 'Error'; 
    }
};


export const calculateLayout = (mode: 'scientific' | 'basic' | 'converter' | 'numeric' | 'date' | 'finance' | 'bmi', containerWidth: number, btnHeight: number, btnGap: number): Record<string, React.CSSProperties> => {
    const styles: Record<string, React.CSSProperties> = {};
    let buttons: ButtonConfig[];
    let COLS: number;
    const PADDING = 16;

    if (mode === 'scientific') {
        buttons = scientificButtons;
        COLS = 5;
    } else if (mode === 'basic') {
        buttons = basicButtons;
        COLS = 4;
    } else if (mode === 'numeric') {
        buttons = numericButtons;
        COLS = 3;
    } else { // converter, date, finance, bmi modes
        buttons = basicButtons
            .filter(btn => btn.type !== 'operator' && btn.value !== '=');
        COLS = 3;
    }

    const totalGapWidth = (COLS - 1) * btnGap;
    const btnWidth = (containerWidth - (PADDING * 2) - totalGapWidth) / COLS;

    let x = PADDING, y = PADDING, col = 0;

    buttons.forEach(btn => {
        const isWide = !!btn.wide;
        // In scientific mode (5 cols), wide buttons span 2 columns.
        // In basic mode (4 cols), wide buttons span 2 columns.
        const colSpan = isWide ? 2 : 1;

        if (col > 0 && col + colSpan > COLS) {
            x = PADDING;
            y += btnHeight + btnGap;
            col = 0;
        }

        const currentBtnWidth = isWide ? (btnWidth * 2) + btnGap : btnWidth;

        styles[btn.value] = {
            width: currentBtnWidth,
            height: btnHeight,
            '--tw-translate-x': `${x}px`,
            '--tw-translate-y': `${y}px`,
        } as any;

        x += currentBtnWidth + btnGap;
        col += colSpan;

        if (col >= COLS) {
            x = PADDING;
            y += btnHeight + btnGap;
            col = 0;
        }
    });

    return styles;
};
