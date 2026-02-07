
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeMode, ThemeName, Themes, ColorPalette } from '../types';
import { Capacitor } from '@capacitor/core';
import { triggerVibration as triggerVibrationUtil } from '../utils/vibration';

export const themes: Themes = {
    default: {
        light: { primary: '#f97316', secondary: '#6366f1', background: '#f8fafc', surface: '#ffffff', keypad: '#f1f5f9', 'number-key': '#e2e8f0', text: '#0f172a', 'text-muted': '#475569', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        // Default dark #1c1c1e is already good (Apple dark gray), kept as is.
        dark: { primary: '#fb923c', secondary: '#818cf8', background: '#1c1c1e', surface: '#2c2c2e', keypad: '#242426', 'number-key': '#3a3a3c', text: '#ffffff', 'text-muted': '#a1a1aa', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' }
    },
    ocean: {
        light: { primary: '#0284c7', secondary: '#0d9488', background: '#f0f9ff', surface: '#ffffff', keypad: '#e0f2fe', 'number-key': '#bae6fd', text: '#0c4a6e', 'text-muted': '#0369a1', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        // Softened from #020617 to #0f172a (Slate-900) to avoid void black
        dark: { primary: '#38bdf8', secondary: '#2dd4bf', background: '#0f172a', surface: '#1e293b', keypad: '#0f172a', 'number-key': '#334155', text: '#f0f9ff', 'text-muted': '#bae6fd', 'text-on-primary': '#0f172a', 'text-on-secondary': '#0f172a' }
    },
    sunset: {
        light: { primary: '#e11d48', secondary: '#c026d3', background: '#fff1f2', surface: '#ffffff', keypad: '#ffe4e6', 'number-key': '#fecdd3', text: '#881337', 'text-muted': '#be123c', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#fb7185', secondary: '#e879f9', background: '#2a0a10', surface: '#4c0519', keypad: '#1a0508', 'number-key': '#500724', text: '#fff1f2', 'text-muted': '#fbcfe8', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' }
    },
    forest: {
        light: { primary: '#4d7c0f', secondary: '#a16207', background: '#f7fee7', surface: '#ffffff', keypad: '#ecfccb', 'number-key': '#d9f99d', text: '#1a2e05', 'text-muted': '#3f6212', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#a3e635', secondary: '#facc15', background: '#142109', surface: '#1a2e05', keypad: '#142109', 'number-key': '#283d10', text: '#ecfccb', 'text-muted': '#bef264', 'text-on-primary': '#1a2e05', 'text-on-secondary': '#422006' }
    },
    graphite: {
        light: { primary: '#334155', secondary: '#64748b', background: '#f1f5f9', surface: '#ffffff', keypad: '#e2e8f0', 'number-key': '#cbd5e1', text: '#0f172a', 'text-muted': '#475569', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        // Graphite is naturally gray, ensured it's not black
        dark: { primary: '#e2e8f0', secondary: '#94a3b8', background: '#111827', surface: '#1f2937', keypad: '#111827', 'number-key': '#374151', text: '#f8fafc', 'text-muted': '#cbd5e1', 'text-on-primary': '#0f172a', 'text-on-secondary': '#0f172a' }
    },
    sakura: {
        light: { primary: '#db2777', secondary: '#9333ea', background: '#fdf2f8', surface: '#ffffff', keypad: '#fce7f3', 'number-key': '#fbcfe8', text: '#831843', 'text-muted': '#be185d', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#f472b6', secondary: '#c084fc', background: '#250c1b', surface: '#3f152b', keypad: '#250c1b', 'number-key': '#501736', text: '#fce7f3', 'text-muted': '#fbcfe8', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' }
    },
    matrix: {
        light: { primary: '#15803d', secondary: '#16a34a', background: '#f0fdf4', surface: '#ffffff', keypad: '#dcfce7', 'number-key': '#bbf7d0', text: '#052e16', 'text-muted': '#15803d', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        // Avoid pitch black #022c22 -> #032d24 (just slight tint) or keep as is, but ensure surfaces are lighter
        dark: { primary: '#4ade80', secondary: '#86efac', background: '#032d24', surface: '#064e3b', keypad: '#011e16', 'number-key': '#0a5c48', text: '#dcfce7', 'text-muted': '#86efac', 'text-on-primary': '#022c22', 'text-on-secondary': '#022c22' }
    },
    royal: {
        light: { primary: '#b45309', secondary: '#6b21a8', background: '#fffbeb', surface: '#ffffff', keypad: '#fef3c7', 'number-key': '#fde68a', text: '#451a03', 'text-muted': '#92400e', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#fbbf24', secondary: '#a855f7', background: '#1e0c29', surface: '#36184a', keypad: '#1e0c29', 'number-key': '#4c2363', text: '#fef3c7', 'text-muted': '#fcd34d', 'text-on-primary': '#1e1b4b', 'text-on-secondary': '#ffffff' }
    },
    mocha: {
        light: { primary: '#92400e', secondary: '#b45309', background: '#fff7ed', surface: '#ffffff', keypad: '#ffedd5', 'number-key': '#fed7aa', text: '#431407', 'text-muted': '#9a3412', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#fdba74', secondary: '#fcd34d', background: '#291b10', surface: '#3f2818', keypad: '#1f1308', 'number-key': '#52341f', text: '#ffedd5', 'text-muted': '#fdba74', 'text-on-primary': '#431407', 'text-on-secondary': '#431407' }
    },
    mint: {
        light: { primary: '#0f766e', secondary: '#3f3f46', background: '#f0fdfa', surface: '#ffffff', keypad: '#ccfbf1', 'number-key': '#99f6e4', text: '#042f2e', 'text-muted': '#0f766e', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#2dd4bf', secondary: '#a1a1aa', background: '#051f1c', surface: '#0a3530', keypad: '#041815', 'number-key': '#115e59', text: '#ccfbf1', 'text-muted': '#5eead4', 'text-on-primary': '#042f2e', 'text-on-secondary': '#1f2937' }
    },
    lavender: {
        light: { primary: '#6d28d9', secondary: '#7c3aed', background: '#f5f3ff', surface: '#ffffff', keypad: '#ede9fe', 'number-key': '#ddd6fe', text: '#2e1065', 'text-muted': '#6d28d9', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#c084fc', secondary: '#a78bfa', background: '#180d26', surface: '#2e1065', keypad: '#12081f', 'number-key': '#4c1d95', text: '#ede9fe', 'text-muted': '#d8b4fe', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' }
    },
    ruby: {
        light: { primary: '#be123c', secondary: '#9f1239', background: '#fff1f2', surface: '#ffffff', keypad: '#ffe4e6', 'number-key': '#fecdd3', text: '#5f0012', 'text-muted': '#9f1239', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#fb7185', secondary: '#f43f5e', background: '#260a10', surface: '#4c0519', keypad: '#1c050a', 'number-key': '#881337', text: '#ffe4e6', 'text-muted': '#fda4af', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' }
    },
    custom: {
        // Placeholders, will be overridden by state
        light: { primary: '#f97316', secondary: '#6366f1', background: '#f8fafc', surface: '#ffffff', keypad: '#f1f5f9', 'number-key': '#e2e8f0', text: '#0f172a', 'text-muted': '#475569', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#fb923c', secondary: '#818cf8', background: '#1c1c1e', surface: '#2c2c2e', keypad: '#242426', 'number-key': '#3a3a3c', text: '#ffffff', 'text-muted': '#a1a1aa', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' }
    }
};

interface ThemeContextType {
    themeMode: ThemeMode;
    effectiveThemeMode: 'light' | 'dark';
    themeName: ThemeName;
    setThemeMode: (mode: ThemeMode) => void;
    setThemeName: (name: ThemeName) => void;
    isGlassmorphismEnabled: boolean;
    setGlassmorphismEnabled: (enabled: boolean) => void;
    glassBlur: number;
    setGlassBlur: (blur: number) => void;
    glassOpacity: number;
    setGlassOpacity: (opacity: number) => void;
    vibrationEnabled: boolean;
    setVibrationEnabled: (enabled: boolean) => void;
    vibrationIntensity: number;
    setVibrationIntensity: (intensity: number) => void;
    triggerVibration: (customIntensity?: number) => void;
    theme: ColorPalette;
    // Custom Theme Props
    customPrimary: string;
    setCustomPrimary: (color: string) => void;
    customSecondary: string;
    setCustomSecondary: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};

const hexToRgbValues = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    }
    return `${r}, ${g}, ${b}`;
};

const hexToRgba = (hex: string, alpha: number) => {
    return `rgba(${hexToRgbValues(hex)}, ${alpha})`;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeName, setThemeName] = useState<ThemeName>(() => (localStorage.getItem('themeName') as ThemeName) || 'default');
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem('themeMode') as ThemeMode) || 'system');
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');

    const [isGlassmorphismEnabled, setGlassmorphismEnabled] = useState<boolean>(() => localStorage.getItem('isGlassmorphismEnabled') === 'true');
    const [glassBlur, setGlassBlur] = useState<number>(() => parseInt(localStorage.getItem('glassBlur') || '8', 10));
    const [glassOpacity, setGlassOpacity] = useState<number>(() => parseFloat(localStorage.getItem('glassOpacity') || '0.2'));

    // Titreşim Ayarları
    const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(() => localStorage.getItem('vibrationEnabled') !== 'false');
    const [vibrationIntensity, setVibrationIntensity] = useState<number>(() => parseInt(localStorage.getItem('vibrationIntensity') || '15', 10));

    // Custom Colors
    const [customPrimary, setCustomPrimary] = useState<string>(() => localStorage.getItem('customPrimary') || '#f97316');
    const [customSecondary, setCustomSecondary] = useState<string>(() => localStorage.getItem('customSecondary') || '#6366f1');

    // Handle System Preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setSystemTheme(e.matches ? 'dark' : 'light');
        };

        // Initial set
        handleChange(mediaQuery);

        // Listener
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const effectiveThemeMode = themeMode === 'system' ? systemTheme : themeMode;

    const triggerVibration = useCallback(async (customIntensity?: number) => {
        if (!vibrationEnabled) return;
        await triggerVibrationUtil(customIntensity || vibrationIntensity);
    }, [vibrationEnabled, vibrationIntensity]);

    // Persist Custom Colors
    useEffect(() => {
        localStorage.setItem('customPrimary', customPrimary);
        localStorage.setItem('customSecondary', customSecondary);
    }, [customPrimary, customSecondary]);

    useEffect(() => {
        const root = window.document.documentElement;
        let newTheme = { ...themes[themeName][effectiveThemeMode] };

        // Apply Custom Override if 'custom' is selected
        if (themeName === 'custom') {
            // Use defaults as base, but override primary/secondary
            const base = themes.default[effectiveThemeMode];
            newTheme = {
                ...base,
                primary: customPrimary,
                secondary: customSecondary,
                // Ensure text on primary is readable (simple check or force white)
                'text-on-primary': '#ffffff',
                'text-on-secondary': '#ffffff'
            };
        }

        root.classList.remove('dark', 'light');
        root.classList.add(effectiveThemeMode);

        root.style.setProperty('--color-primary-rgb', hexToRgbValues(newTheme.primary));
        root.style.setProperty('--color-secondary-rgb', hexToRgbValues(newTheme.secondary));

        if (isGlassmorphismEnabled) {
            root.classList.add('glass-mode');
            root.style.setProperty('--glass-blur', `${glassBlur}px`);
            root.style.setProperty('--glass-opacity', glassOpacity.toString());
            root.style.setProperty('--color-primary', newTheme.primary);
            root.style.setProperty('--color-secondary', newTheme.secondary);

            const buttonAlpha = Math.max(0.7, glassOpacity * 1.6);
            root.style.setProperty('--color-primary-glass', hexToRgba(newTheme.primary, buttonAlpha));
            root.style.setProperty('--color-secondary-glass', hexToRgba(newTheme.secondary, buttonAlpha));
            root.style.setProperty('--color-background', 'transparent');

            const baseAlpha = Math.max(0.12, glassOpacity * 0.9);
            root.style.setProperty('--color-surface', hexToRgba(newTheme.surface, baseAlpha));
            root.style.setProperty('--color-keypad', hexToRgba(newTheme.keypad, Math.min(0.6, baseAlpha + 0.15)));

            const numberKeyAlpha = Math.min(0.7, baseAlpha + 0.2);
            root.style.setProperty('--color-number-key', hexToRgba(newTheme['number-key'], numberKeyAlpha));

            root.style.setProperty('--color-overlay', hexToRgba(newTheme.surface, 0.85));
            root.style.setProperty('--color-text', newTheme.text);
            root.style.setProperty('--color-text-muted', newTheme['text-muted']);
            root.style.setProperty('--color-text-on-primary', newTheme['text-on-primary']);
            root.style.setProperty('--color-text-on-secondary', newTheme['text-on-secondary']);

            const bgHex = newTheme.background;

            // Optimized Gradient: Simpler layering, ensuring not too dark
            const pStrong = hexToRgba(newTheme.primary, 0.4);
            const sStrong = hexToRgba(newTheme.secondary, 0.4); // Increased opacity for better visibility

            const gradient = `
                radial-gradient(circle at 15% 15%, ${pStrong} 0%, transparent 40%),
                radial-gradient(circle at 85% 85%, ${sStrong} 0%, transparent 40%),
                linear-gradient(180deg, ${bgHex} 0%, ${hexToRgba(newTheme.keypad, 0.95)} 100%)
            `;
            root.style.setProperty('--glass-background', gradient);

        } else {
            root.classList.remove('glass-mode');
            root.style.removeProperty('--glass-background');
            root.style.removeProperty('--glass-blur');
            root.style.removeProperty('--glass-opacity');
            root.style.removeProperty('--color-overlay');
            root.style.removeProperty('--color-primary-glass');
            root.style.removeProperty('--color-secondary-glass');

            for (const [key, value] of Object.entries(newTheme)) {
                root.style.setProperty(`--color-${key}`, value as string);
            }
        }

        localStorage.setItem('themeName', themeName);
        localStorage.setItem('themeMode', themeMode);
        localStorage.setItem('isGlassmorphismEnabled', isGlassmorphismEnabled.toString());
        localStorage.setItem('glassBlur', glassBlur.toString());
        localStorage.setItem('glassOpacity', glassOpacity.toString());
        localStorage.setItem('vibrationEnabled', vibrationEnabled.toString());
        localStorage.setItem('vibrationIntensity', vibrationIntensity.toString());
    }, [themeName, themeMode, effectiveThemeMode, isGlassmorphismEnabled, glassBlur, glassOpacity, vibrationEnabled, vibrationIntensity, customPrimary, customSecondary]);

    const value = useMemo(() => ({
        themeMode,
        effectiveThemeMode,
        themeName,
        setThemeMode,
        setThemeName,
        isGlassmorphismEnabled,
        setGlassmorphismEnabled,
        glassBlur,
        setGlassBlur,
        glassOpacity,
        setGlassOpacity,
        vibrationEnabled,
        setVibrationEnabled,
        vibrationIntensity,
        setVibrationIntensity,
        triggerVibration,
        theme: themeName === 'custom'
            ? { ...themes.default[effectiveThemeMode], primary: customPrimary, secondary: customSecondary }
            : themes[themeName][effectiveThemeMode],
        customPrimary,
        setCustomPrimary,
        customSecondary,
        setCustomSecondary
    }), [themeMode, effectiveThemeMode, themeName, isGlassmorphismEnabled, glassBlur, glassOpacity, vibrationEnabled, vibrationIntensity, triggerVibration, customPrimary, customSecondary]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
