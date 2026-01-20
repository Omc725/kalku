
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, ThemeName, Themes, ColorPalette } from '../types';

export const themes: Themes = {
    default: {
        light: { primary: '#f97316', secondary: '#4f46e5', background: '#f1f5f9', surface: '#ffffff', keypad: '#e2e8f0', 'number-key': '#cbd5e1', text: '#1e293b', 'text-muted': '#475569', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#f97316', secondary: '#4f46e5', background: '#191022', surface: '#2c213a', keypad: '#21182c', 'number-key': '#3a2d4a', text: '#ffffff', 'text-muted': '#ffffff99', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' }
    },
    ocean: {
        light: { primary: '#0ea5e9', secondary: '#14b8a6', background: '#f0f9ff', surface: '#ffffff', keypad: '#e0f2fe', 'number-key': '#bae6fd', text: '#0c4a6e', 'text-muted': '#38bdf8', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#0ea5e9', secondary: '#14b8a6', background: '#0c1427', surface: '#1a2238', keypad: '#121a2e', 'number-key': '#283452', text: '#e0f2fe', 'text-muted': '#7dd3fc', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' }
    },
    sunset: {
        light: { primary: '#f43f5e', secondary: '#d946ef', background: '#fff1f2', surface: '#ffffff', keypad: '#ffe4e6', 'number-key': '#fecdd3', text: '#881337', 'text-muted': '#be123c', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#f43f5e', secondary: '#d946ef', background: '#1a001a', surface: '#2e002e', keypad: '#210021', 'number-key': '#3b003b', text: '#fce7f3', 'text-muted': '#f9a8d4', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' }
    },
    forest: {
        light: { primary: '#4d7c0f', secondary: '#a16207', background: '#f7fee7', surface: '#ffffff', keypad: '#ecfccb', 'number-key': '#d9f99d', text: '#1a2e05', 'text-muted': '#365314', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#84cc16', secondary: '#facc15', background: '#1a2e0f', surface: '#2a401f', keypad: '#1f3315', 'number-key': '#375329', text: '#d9f99d', 'text-muted': '#a3e635', 'text-on-primary': '#1a2e05', 'text-on-secondary': '#422006' }
    },
    graphite: {
        light: { primary: '#334155', secondary: '#64748b', background: '#f8fafc', surface: '#ffffff', keypad: '#f1f5f9', 'number-key': '#e2e8f0', text: '#0f172a', 'text-muted': '#475569', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#cbd5e1', secondary: '#94a3b8', background: '#0f172a', surface: '#1e293b', keypad: '#0b1220', 'number-key': '#28344e', text: '#f1f5f9', 'text-muted': '#94a3b8', 'text-on-primary': '#0f172a', 'text-on-secondary': '#0f172a' }
    },
    sakura: {
        light: { primary: '#f472b6', secondary: '#a78bfa', background: '#fdf2f8', surface: '#ffffff', keypad: '#fce7f3', 'number-key': '#fbcfe8', text: '#831843', 'text-muted': '#be185d', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#f472b6', secondary: '#a78bfa', background: '#2B1B34', surface: '#4A2A4C', keypad: '#3E2442', 'number-key': '#58365F', text: '#fce7f3', 'text-muted': '#f9a8d4', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' }
    },
    matrix: {
        light: { primary: '#15803d', secondary: '#16a34a', background: '#f7fff6', surface: '#ffffff', keypad: '#eaffe6', 'number-key': '#d4ffd0', text: '#052e16', 'text-muted': '#14532d', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#4ade80', secondary: '#86efac', background: '#051004', surface: '#0a1f08', keypad: '#040c03', 'number-key': '#102d0d', text: '#dcfce7', 'text-muted': '#bbf7d0', 'text-on-primary': '#052e16', 'text-on-secondary': '#052e16' }
    },
    royal: {
        light: { primary: '#d97706', secondary: '#7e22ce', background: '#fdfcff', surface: '#ffffff', keypad: '#f3e8ff', 'number-key': '#e9d5ff', text: '#2e1065', 'text-muted': '#581c87', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#f59e0b', secondary: '#c084fc', background: '#1e0a2e', surface: '#2d1144', keypad: '#170722', 'number-key': '#3b1c55', text: '#f3e8ff', 'text-muted': '#e9d5ff', 'text-on-primary': '#1e1b4b', 'text-on-secondary': '#ffffff' }
    },
    mocha: {
        light: { primary: '#78350f', secondary: '#a16207', background: '#fefbf6', surface: '#ffffff', keypad: '#f7f2ea', 'number-key': '#f0e9dd', text: '#422006', 'text-muted': '#78350f', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#d28a5d', secondary: '#eab308', background: '#291d12', surface: '#3e2e1e', keypad: '#211810', 'number-key': '#524231', text: '#fde7d4', 'text-muted': '#e4b595', 'text-on-primary': '#422006', 'text-on-secondary': '#422006' }
    },
    mint: {
        light: { primary: '#059669', secondary: '#52525b', background: '#f0fdf4', surface: '#ffffff', keypad: '#dcfce7', 'number-key': '#bbf7d0', text: '#064e3b', 'text-muted': '#059669', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#34d399', secondary: '#a1a1aa', background: '#0f1f18', surface: '#1a3026', keypad: '#11241c', 'number-key': '#284d3c', text: '#d1fae5', 'text-muted': '#a7f3d0', 'text-on-primary': '#064e3b', 'text-on-secondary': '#1f2937' }
    },
    lavender: {
        light: { primary: '#7e22ce', secondary: '#7c3aed', background: '#faf5ff', surface: '#ffffff', keypad: '#f3e8ff', 'number-key': '#e9d5ff', text: '#3b0764', 'text-muted': '#581c87', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#a855f7', secondary: '#c084fc', background: '#1e1b2e', surface: '#2d2844', keypad: '#171422', 'number-key': '#3b3555', text: '#e9d5ff', 'text-muted': '#d8b4fe', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' }
    },
    ruby: {
        light: { primary: '#be123c', secondary: '#9f1239', background: '#fff1f2', surface: '#ffffff', keypad: '#ffe4e6', 'number-key': '#fecdd3', text: '#5f0012', 'text-muted': '#881337', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' },
        dark: { primary: '#f43f5e', secondary: '#e11d48', background: '#2c0007', surface: '#45000f', keypad: '#3b000c', 'number-key': '#580013', text: '#ffe4e6', 'text-muted': '#fda4af', 'text-on-primary': '#ffffff', 'text-on-secondary': '#ffffff' }
    }
};

interface ThemeContextType {
    themeMode: ThemeMode;
    themeName: ThemeName;
    setThemeMode: (mode: ThemeMode) => void;
    setThemeName: (name: ThemeName) => void;
    isGlassmorphismEnabled: boolean;
    setGlassmorphismEnabled: (enabled: boolean) => void;
    glassBlur: number;
    setGlassBlur: (blur: number) => void;
    glassOpacity: number;
    setGlassOpacity: (opacity: number) => void;
    theme: ColorPalette;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};

const hexToRgba = (hex: string, alpha: number) => {
    if (!hex) return '';
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
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeName, setThemeName] = useState<ThemeName>(() => (localStorage.getItem('themeName') as ThemeName) || 'default');
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem('themeMode') as ThemeMode) || 'dark');
    const [isGlassmorphismEnabled, setGlassmorphismEnabled] = useState<boolean>(() => localStorage.getItem('isGlassmorphismEnabled') === 'true');
    const [glassBlur, setGlassBlur] = useState<number>(() => parseInt(localStorage.getItem('glassBlur') || '20', 10));
    const [glassOpacity, setGlassOpacity] = useState<number>(() => parseFloat(localStorage.getItem('glassOpacity') || '0.45'));

    useEffect(() => {
        const root = window.document.documentElement;
        const newTheme = themes[themeName][themeMode];

        root.classList.remove('dark', 'light');
        root.classList.add(themeMode);

        if (isGlassmorphismEnabled) {
            root.classList.add('glass-mode');
            
            root.style.setProperty('--glass-blur', `${glassBlur}px`);
            root.style.setProperty('--glass-opacity', glassOpacity.toString());
            
            root.style.setProperty('--color-primary', newTheme.primary);
            root.style.setProperty('--color-secondary', newTheme.secondary);
            
            root.style.setProperty('--color-background', 'transparent'); 
            
            // SURFACE ve KEYPAD için opaklığı her zaman yüksek tut (0.90), böylece "renkli" ve "dolu" görünürler.
            // glassOpacity ise sadece genel 'blur' ve yardımcı alanları etkiler.
            const containerOpacity = 0.90;
            root.style.setProperty('--color-surface', hexToRgba(newTheme.surface, containerOpacity));
            root.style.setProperty('--color-keypad', hexToRgba(newTheme.keypad, containerOpacity));
            root.style.setProperty('--color-number-key', hexToRgba(newTheme['number-key'], Math.min(1, containerOpacity + 0.05)));
            
            const overlayOpacity = 0.95; 
            root.style.setProperty('--color-overlay', hexToRgba(newTheme.surface, overlayOpacity));
            
            root.style.setProperty('--color-text', newTheme.text);
            root.style.setProperty('--color-text-muted', newTheme['text-muted']);
            root.style.setProperty('--color-text-on-primary', newTheme['text-on-primary']);
            root.style.setProperty('--color-text-on-secondary', newTheme['text-on-secondary']);

            const bgHex = newTheme.background;
            
            const pStrong = hexToRgba(newTheme.primary, 0.75);
            const sStrong = hexToRgba(newTheme.secondary, 0.75);
            const pWeak = hexToRgba(newTheme.primary, 0.45);
            const sWeak = hexToRgba(newTheme.secondary, 0.45);
            
            const gradient = `
                radial-gradient(circle at 0% 0%, ${pStrong} 0%, transparent 55%),
                radial-gradient(circle at 100% 0%, ${sWeak} 0%, transparent 50%),
                radial-gradient(circle at 100% 100%, ${sStrong} 0%, transparent 55%),
                radial-gradient(circle at 0% 100%, ${pWeak} 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, ${hexToRgba(newTheme.secondary, 0.15)} 0%, transparent 40%),
                linear-gradient(${bgHex}, ${bgHex})
            `;
            root.style.setProperty('--glass-background', gradient);

        } else {
            root.classList.remove('glass-mode');
            root.style.removeProperty('--glass-background');
            root.style.removeProperty('--glass-blur');
            root.style.removeProperty('--glass-opacity');
            root.style.removeProperty('--color-overlay');
            
            for (const [key, value] of Object.entries(newTheme)) {
                root.style.setProperty(`--color-${key}`, value as string);
            }
        }

        localStorage.setItem('themeName', themeName);
        localStorage.setItem('themeMode', themeMode);
        localStorage.setItem('isGlassmorphismEnabled', isGlassmorphismEnabled.toString());
        localStorage.setItem('glassBlur', glassBlur.toString());
        localStorage.setItem('glassOpacity', glassOpacity.toString());
    }, [themeName, themeMode, isGlassmorphismEnabled, glassBlur, glassOpacity]);

    const value = {
        themeMode,
        themeName,
        setThemeMode,
        setThemeName,
        isGlassmorphismEnabled,
        setGlassmorphismEnabled,
        glassBlur,
        setGlassBlur,
        glassOpacity,
        setGlassOpacity,
        theme: themes[themeName][themeMode],
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
