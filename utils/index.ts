
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
        return parseFloat(result.toPrecision(12)).toString();
    } catch (error) { 
        return 'Error'; 
    }
};

// GPU Optimization: Returning raw numbers instead of CSS strings allows for 'transform: translate3d' construction
export interface LayoutData {
    x: number;
    y: number;
    width: number;
    height: number;
    row: number;
    col: number;
}

export const calculateLayout = (mode: 'scientific' | 'basic' | 'converter' | 'numeric' | 'date' | 'finance' | 'bmi', containerWidth: number, btnHeight: number, btnGap: number): Record<string, LayoutData> => {
    const layout: Record<string, LayoutData> = {};
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
        // Filter out equal sign and operators for unit converters if needed, or use numeric pad
        // Based on previous implementation, we use a cleaner subset of basicButtons
        buttons = basicButtons.filter(btn => btn.type !== 'operator' && btn.value !== '=');
        COLS = 3;
    }

    // Ensure we don't divide by zero or negative space
    const totalGapWidth = (COLS - 1) * btnGap;
    const safeContainerWidth = Math.max(0, containerWidth - (PADDING * 2) - totalGapWidth);
    const btnWidth = Math.floor(safeContainerWidth / COLS);
    
    // Use Math.floor for height to avoid sub-pixel blurring
    const safeBtnHeight = Math.floor(btnHeight);

    let x = PADDING;
    let y = PADDING;
    let col = 0;
    let row = 0;

    buttons.forEach(btn => {
        let currentBtnWidth = btnWidth;
        
        // Enable wide buttons in all modes if configured
        if (btn.wide) {
            currentBtnWidth = (btnWidth * 2) + btnGap;
        }

        layout[btn.value] = {
            x: Math.round(x),
            y: Math.round(y),
            width: Math.round(currentBtnWidth),
            height: safeBtnHeight,
            row,
            col
        };

        // Advance cursor
        if (btn.wide) {
             x += currentBtnWidth + btnGap;
             col += 2;
        } else {
             x += btnWidth + btnGap;
             col += 1;
        }

        if (col >= COLS) {
            col = 0;
            row++;
            x = PADDING;
            y += safeBtnHeight + btnGap;
        }
    });

    return layout;
};
