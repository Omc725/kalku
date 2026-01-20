
import React from 'react';

export const MAX_EXPRESSION_LENGTH = 40;
export const MAX_HISTORY_ITEMS = 50;
export const ANIMATION_DURATION = 450;

export interface ButtonConfig {
    display: string | React.ReactNode;
    shiftedDisplay?: string | React.ReactNode;
    value: string;
    shiftedValue?: string;
    type?: 'special' | 'operator';
    wide?: boolean;
}

export const scientificButtons: ButtonConfig[] = [
    // Row 1: Trig & Logs
    { display: 'sin', shiftedDisplay: 'sin⁻¹', value: 'sin(', shiftedValue: 'asin(' },
    { display: 'cos', shiftedDisplay: 'cos⁻¹', value: 'cos(', shiftedValue: 'acos(' },
    { display: 'tan', shiftedDisplay: 'tan⁻¹', value: 'tan(', shiftedValue: 'atan(' },
    { display: 'log', shiftedDisplay: '10ˣ', value: 'log10(', shiftedValue: '10^' },
    { display: 'ln', shiftedDisplay: 'eˣ', value: 'log(', shiftedValue: 'e^' },
    
    // Row 2: Advanced Math
    { display: '(', value: '(', type: 'special' },
    { display: ')', value: ')', type: 'special' },
    { display: 'x!', value: 'fact(' },
    { display: '√', shiftedDisplay: '³√', value: 'sqrt(', shiftedValue: 'cbrt(' },
    { display: '1/x', value: '^(-1)' },

    // Row 3: Basic Ops & Modifiers
    { display: 'x²', shiftedDisplay: 'x³', value: '^2', shiftedValue: '^3' },
    { display: 'AC', value: 'AC', type: 'special' },
    { display: '±', value: '+/-', type: 'special' },
    { display: React.createElement('span', { className: "material-symbols-outlined" }, 'backspace'), value: 'backspace', type: 'special' },
    { display: '÷', value: '/', type: 'operator' },

    // Row 4: Numbers & Power
    { display: 'xʸ', shiftedDisplay: 'ʸ√x', value: '^', shiftedValue: '^(1/' },
    { display: '7', value: '7' },
    { display: '8', value: '8' },
    { display: '9', value: '9' },
    { display: '×', value: '*', type: 'operator' },

    // Row 5: Numbers & Pi
    { display: 'π', value: 'pi' },
    { display: '4', value: '4' },
    { display: '5', value: '5' },
    { display: '6', value: '6' },
    { display: '−', value: '-', type: 'operator' },

    // Row 6: Numbers & E
    { display: 'e', value: 'e' },
    { display: '1', value: '1' },
    { display: '2', value: '2' },
    { display: '3', 'value': '3' },
    { display: '+', value: '+', type: 'operator' },

    // Row 7: Zero, Dot, Shift, Equals
    { display: React.createElement('span', { className: "material-symbols-outlined !text-2xl" }, 'swap_horiz'), value: 'shift', type: 'special' },
    { display: '0', value: '0', wide: true },
    { display: '.', value: '.' },
    { display: '=', value: '=', type: 'special' },
];

export const basicButtons: ButtonConfig[] = [
    { display: 'AC', value: 'AC', type: 'special' }, { display: '±', value: '+/-', type: 'special' }, { display: React.createElement('span', { className: "material-symbols-outlined" }, 'backspace'), value: 'backspace', type: 'special' }, { display: '÷', value: '/', type: 'operator' },
    { display: '7', value: '7' }, { display: '8', value: '8' }, { display: '9', value: '9' }, { display: '×', value: '*', type: 'operator' },
    { display: '4', value: '4' }, { display: '5', value: '5' }, { display: '6', value: '6' }, { display: '−', value: '-', type: 'operator' },
    { display: '1', value: '1' }, { display: '2', value: '2' }, { display: '3', 'value': '3' }, { display: '+', value: '+', type: 'operator' },
    { display: '0', value: '0', wide: true }, { display: '.', value: '.' }, { display: '=', value: '=', type: 'special' },
];

// Simplified numeric keypad: 3 columns.
// 7 8 9
// 4 5 6
// 1 2 3
// 0 . backspace
export const numericButtons: ButtonConfig[] = [
    { display: '7', value: '7' }, { display: '8', value: '8' }, { display: '9', value: '9' },
    { display: '4', value: '4' }, { display: '5', value: '5' }, { display: '6', value: '6' },
    { display: '1', value: '1' }, { display: '2', value: '2' }, { display: '3', 'value': '3' },
    { display: '0', value: '0' }, { display: '.', value: '.' }, { display: React.createElement('span', { className: "material-symbols-outlined" }, 'backspace'), value: 'backspace', type: 'special' },
];

const baseButtons = [...scientificButtons, ...basicButtons, ...numericButtons].reduce((acc, btn) => {
    if (!acc.find(b => b.value === btn.value)) acc.push(btn);
    return acc;
}, [] as ButtonConfig[]);

export const allButtons = baseButtons;
