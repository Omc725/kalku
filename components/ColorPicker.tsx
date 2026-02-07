
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ColorPickerProps {
    label: string;
    color: string;
    onChange: (color: string) => void;
}

const PRESETS = [
    '#f97316', '#ef4444', '#f59e0b', '#eab308', '#84cc16', 
    '#22c55e', '#10b981', '#06b6d4', '#0ea5e9', '#3b82f6', 
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', 
    '#f43f5e', '#64748b', '#94a3b8', '#ffffff', '#000000'
];

// Color Utility Functions
const hexToHSL = (H: string) => {
    let r = 0, g = 0, b = 0;
    if (H.length === 4) {
        r = parseInt("0x" + H[1] + H[1]);
        g = parseInt("0x" + H[2] + H[2]);
        b = parseInt("0x" + H[3] + H[3]);
    } else if (H.length === 7) {
        r = parseInt("0x" + H.substring(1, 3));
        g = parseInt("0x" + H.substring(3, 5));
        b = parseInt("0x" + H.substring(5, 7));
    }
    r /= 255; g /= 255; b /= 255;
    const cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin;
    let h = 0, s = 0, l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
};

const HSLToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    const toHex = (n: number) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
};

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
    const [hue, setHue] = useState(0);
    const [hexInput, setHexInput] = useState(color);
    const isInternalChange = useRef(false);

    // Sync external color prop to local state
    useEffect(() => {
        if (!isInternalChange.current) {
            setHexInput(color);
            const { h } = hexToHSL(color);
            setHue(h);
        }
        isInternalChange.current = false;
    }, [color]);

    const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isInternalChange.current = true;
        const newHue = parseInt(e.target.value);
        setHue(newHue);
        
        // Preserve saturation/lightness of current color to make it feel organic
        const { s, l } = hexToHSL(color);
        // If color is grayscale (S=0), bump S to 100 so hue change is visible
        const activeS = s < 5 ? 100 : s;
        const activeL = (l < 5 || l > 95) ? 50 : l;

        const newHex = HSLToHex(newHue, activeS, activeL);
        setHexInput(newHex);
        onChange(newHex);
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isInternalChange.current = true;
        const val = e.target.value;
        setHexInput(val);
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            const { h } = hexToHSL(val);
            setHue(h);
            onChange(val);
        }
    };

    const handlePresetClick = (preset: string) => {
        isInternalChange.current = true;
        setHexInput(preset);
        const { h } = hexToHSL(preset);
        setHue(h);
        onChange(preset);
    };

    return (
        <div className="flex flex-col gap-3 p-3 rounded-2xl bg-black/5 border border-white/5">
            <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-text-muted uppercase tracking-wider">{label}</span>
                <div className="flex items-center gap-2 bg-surface rounded-lg p-1 pr-3 border border-white/10 shadow-sm focus-within:ring-1 focus-within:ring-primary">
                    <div 
                        className="w-6 h-6 rounded-md shadow-sm border border-white/10" 
                        style={{ backgroundColor: color }}
                    />
                    <input 
                        type="text" 
                        value={hexInput}
                        onChange={handleHexChange}
                        maxLength={7}
                        className="bg-transparent border-none text-xs font-mono font-bold uppercase text-text-color p-0 w-16 focus:ring-0"
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Hue Slider */}
            <div className="relative h-4 w-full rounded-full overflow-hidden shadow-inner ring-1 ring-black/10 group">
                <div 
                    className="absolute inset-0" 
                    style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }}
                />
                <input 
                    type="range" 
                    min="0" 
                    max="360" 
                    value={hue} 
                    onChange={handleHueChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {/* Visual Thumb */}
                <div 
                    className="absolute top-0 bottom-0 w-2 bg-white ring-1 ring-black/20 shadow-md pointer-events-none transition-transform duration-75"
                    style={{ left: `${(hue / 360) * 100}%`, transform: 'translateX(-50%)' }}
                />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 justify-between">
                {PRESETS.map(p => (
                    <button
                        key={p}
                        onClick={() => handlePresetClick(p)}
                        className={`w-6 h-6 rounded-full border border-white/10 shadow-sm transition-transform active:scale-90 hover:scale-110 ${color.toLowerCase() === p.toLowerCase() ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''}`}
                        style={{ backgroundColor: p }}
                        aria-label={`Select color ${p}`}
                    />
                ))}
            </div>
        </div>
    );
};
