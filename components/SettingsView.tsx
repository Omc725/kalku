
import React, { useState, useEffect } from 'react';
import { View, ThemeName, Language, ThemeMode } from '../types';
import { useLanguage, nativeLanguageNames } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../contexts/ThemeContext';
import { ColorPicker } from './ColorPicker';

type AnimationOrigin = { top: string; right: string; bottom: string; left: string; } | null;

interface SettingsViewProps {
    setView: () => void;
    animationOrigin: AnimationOrigin;
}

// Premium Morph Switch Component
const Switch: React.FC<{ checked: boolean; onChange: () => void; id?: string }> = ({ checked, onChange, id }) => (
    <button 
        id={id} 
        onClick={onChange} 
        className={`group relative inline-flex h-[36px] w-[60px] flex-shrink-0 items-center rounded-full border-2 transition-all duration-500 ease-premium cursor-pointer ${checked ? 'border-transparent bg-primary shadow-lg shadow-primary/20' : 'border-white/5 bg-black/20 shadow-inner'}`}
    >
        <span className="sr-only">Toggle</span>
        {/* Track Icons for extra detail */}
        <span className={`absolute left-2.5 text-[10px] font-bold text-white/50 transition-all duration-300 ${checked ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
            OFF
        </span>
        <span className={`absolute right-2.5 text-[10px] font-bold text-white/80 transition-all duration-300 ${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            ON
        </span>

        {/* Morphing Thumb */}
        <span 
            className={`
                absolute left-[2px] inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-switch-thumb transition-all duration-500 ease-morph
                ${checked ? 'translate-x-[24px] scale-x-100' : 'translate-x-0 scale-x-100'}
                group-active:scale-x-125
            `} 
        >
             {/* Subtle micro-icon inside thumb */}
             <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${checked ? 'opacity-100' : 'opacity-0'}`}>
                <span className="material-symbols-outlined text-[14px] text-primary font-bold">check</span>
             </span>
        </span>
    </button>
);

const SettingsView: React.FC<SettingsViewProps> = ({ setView, animationOrigin }) => {
    const { language, setLanguage, t } = useLanguage();
    const { 
        themeMode, setThemeMode, effectiveThemeMode, themeName, setThemeName, 
        isGlassmorphismEnabled, setGlassmorphismEnabled,
        glassBlur, setGlassBlur, glassOpacity, setGlassOpacity,
        vibrationEnabled, setVibrationEnabled,
        vibrationIntensity, setVibrationIntensity,
        customPrimary, setCustomPrimary,
        customSecondary, setCustomSecondary
    } = useTheme();
    const [isClosing, setIsClosing] = useState(false);
    const [isMorphingMode, setIsMorphingMode] = useState(false);

    // Trigger morph animation on themeMode change
    useEffect(() => {
        setIsMorphingMode(true);
        const timer = setTimeout(() => setIsMorphingMode(false), 500);
        return () => clearTimeout(timer);
    }, [themeMode]);
    
    const handleClose = () => {
        setIsClosing(true);
    };

    const onAnimationEnd = (e: React.AnimationEvent) => {
        if (e.target !== e.currentTarget) return;
        if (isClosing) {
            setView();
        }
    };

    // Helper to generate CSS variable for slider track progress
    const getSliderStyle = (value: number, min: number, max: number) => {
        const percentage = ((value - min) / (max - min)) * 100;
        return {
            '--progress': `${percentage}%`
        } as React.CSSProperties;
    };

    const themeModes: ThemeMode[] = ['system', 'light', 'dark'];
    const activeModeIndex = themeModes.indexOf(themeMode);

    // Filter themes to separate Custom from Presets
    const presetThemes = (Object.keys(themes) as ThemeName[]).filter(key => key !== 'custom');
    const isCustomActive = themeName === 'custom';

    return (
        <div
            className={`absolute inset-0 z-20 flex h-full flex-col bg-background glass-view ${isClosing ? 'animate-morph-out' : 'animate-morph-in'}`}
            style={animationOrigin ? {
                '--clip-top': animationOrigin.top,
                '--clip-right': animationOrigin.right,
                '--clip-bottom': animationOrigin.bottom,
                '--clip-left': animationOrigin.left,
            } as React.CSSProperties : {}}
            onAnimationEnd={onAnimationEnd}
        >
            <header className="flex items-center justify-between p-4 pt-6 pb-4 opacity-0 animate-slide-up-soft" style={{ animationDelay: '50ms' }}>
                <button 
                    onClick={handleClose} 
                    className="group flex h-11 w-11 items-center justify-center rounded-2xl bg-surface/50 border border-white/10 text-text-muted shadow-card backdrop-blur-md transition-all duration-300 hover:bg-surface hover:text-text-color hover:shadow-float hover:border-white/20 active:scale-90"
                >
                    <span className="material-symbols-outlined text-2xl transition-transform duration-300 group-hover:-translate-x-1">arrow_back</span>
                </button>
                <h2 className="text-2xl font-bold">{t('settingsTitle')}</h2>
                <div className="w-11" />
            </header>
            
            <main className="flex-grow space-y-8 overflow-y-auto px-5 pb-10 custom-scrollbar">
                {/* Görünüm Bölümü */}
                <section className="opacity-0 animate-slide-up-soft" style={{ animationDelay: '100ms' }}>
                    <h3 className="mb-3 ml-1 text-sm font-bold uppercase tracking-widest text-text-muted">{t('appearance')}</h3>
                    <div className="space-y-6 rounded-3xl bg-surface/30 p-6 border border-white/5 shadow-inner backdrop-blur-sm">
                        
                        {/* Theme Mode Segmented Control */}
                        <div>
                            <div className="mb-3 flex flex-col">
                                <label className="text-lg font-bold">{t('themeMode')}</label>
                                <span className="text-xs text-text-muted">
                                    {t(themeMode)} 
                                    {themeMode === 'system' && ` (${t(effectiveThemeMode)})`}
                                </span>
                            </div>
                            
                            <div className="relative w-full h-14 bg-black/20 rounded-2xl border border-white/5 shadow-inner p-1.5 grid grid-cols-3 overflow-hidden">
                                {/* The Sliding Pill - Animated Background */}
                                <div
                                    className={`absolute top-1.5 bottom-1.5 left-1.5 rounded-xl bg-surface shadow-lg ring-1 ring-white/10 transition-all duration-500 ease-premium z-0 will-change-transform ${isMorphingMode ? 'scale-x-110 scale-y-90 brightness-110' : 'scale-100 brightness-100'}`}
                                    style={{
                                        width: 'calc((100% - 0.75rem) / 3)', 
                                        transform: `translateX(${activeModeIndex * 100}%) translateZ(0)`
                                    }}
                                >
                                    {/* Glass Shine */}
                                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-xl"></div>
                                </div>

                                {themeModes.map((mode) => {
                                    const isActive = themeMode === mode;
                                    return (
                                        <button 
                                            key={mode}
                                            onClick={() => setThemeMode(mode)}
                                            className="group z-10 flex items-center justify-center relative active:scale-95 transition-transform duration-200"
                                        >
                                            <span className={`
                                                relative z-10 flex items-center justify-center gap-2 text-sm font-bold transition-all duration-500 ease-out
                                                ${isActive 
                                                    ? 'text-primary drop-shadow-md scale-105' 
                                                    : 'text-text-muted group-hover:text-text-color group-hover:drop-shadow-sm scale-100'}
                                            `}>
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {mode === 'system' ? 'brightness_auto' : (mode === 'light' ? 'light_mode' : 'dark_mode')}
                                                </span>
                                                {t(mode as any)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        
                        <div className="h-px bg-white/5" />
                        
                        {/* Glassmorphism */}
                        <div>
                            <div className="flex items-center justify-between group cursor-pointer" onClick={() => setGlassmorphismEnabled(!isGlassmorphismEnabled)}>
                                <div className="flex flex-col">
                                    <label className="text-lg font-bold cursor-pointer">{t('glassmorphism')}</label>
                                    <span className="text-xs text-text-muted">Yarı saydam arayüz efekti</span>
                                </div>
                                <Switch 
                                    id="glass-mode-toggle" 
                                    checked={isGlassmorphismEnabled} 
                                    onChange={() => setGlassmorphismEnabled(!isGlassmorphismEnabled)} 
                                />
                            </div>
                            
                            <div className={`grid transition-all duration-500 ease-premium ${isGlassmorphismEnabled ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden min-h-0 -mx-2 px-2"> {/* Negative margin trick to allow shadow overflow within padding */}
                                    <div className="space-y-6 pt-6 pb-2">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm font-bold text-text-muted uppercase tracking-wider px-1">
                                                <span>{t('blur')}</span>
                                                <span className="text-primary font-mono">{glassBlur}px</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="50" 
                                                value={glassBlur} 
                                                onChange={(e) => setGlassBlur(Number(e.target.value))}
                                                style={getSliderStyle(glassBlur, 0, 50)}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm font-bold text-text-muted uppercase tracking-wider px-1">
                                                <span>{t('opacity')}</span>
                                                <span className="text-primary font-mono">{Math.round(glassOpacity * 100)}%</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0.1" 
                                                max="1.0" 
                                                step="0.05"
                                                value={glassOpacity} 
                                                onChange={(e) => setGlassOpacity(parseFloat(e.target.value))}
                                                style={getSliderStyle(glassOpacity, 0.1, 1.0)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/5" />
                        
                        {/* Vibration */}
                        <div>
                            <div className="flex items-center justify-between group cursor-pointer" onClick={() => setVibrationEnabled(!vibrationEnabled)}>
                                <div className="flex flex-col">
                                    <label className="text-lg font-bold cursor-pointer">Titreşim (Haptic)</label>
                                    <span className="text-xs text-text-muted">Tuş basım geri bildirimi</span>
                                </div>
                                <Switch 
                                    id="vibration-toggle" 
                                    checked={vibrationEnabled} 
                                    onChange={() => setVibrationEnabled(!vibrationEnabled)} 
                                />
                            </div>
                            
                            <div className={`grid transition-all duration-500 ease-premium ${vibrationEnabled ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden min-h-0 -mx-2 px-2">
                                    <div className="space-y-3 pt-6 pb-2">
                                        <div className="flex justify-between items-center text-sm font-bold text-text-muted uppercase tracking-wider px-1">
                                            <span>Şiddet</span>
                                            <span className="text-primary font-mono">{vibrationIntensity}ms</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="50" 
                                            value={vibrationIntensity} 
                                            onChange={(e) => setVibrationIntensity(parseInt(e.target.value))}
                                            style={getSliderStyle(vibrationIntensity, 1, 50)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Renk Teması Bölümü */}
                <section className="opacity-0 animate-slide-up-soft" style={{ animationDelay: '200ms' }}>
                    <h3 className="mb-3 ml-1 text-sm font-bold uppercase tracking-widest text-text-muted">{t('colorTheme')}</h3>
                    <div className="rounded-3xl bg-surface/30 p-4 border border-white/5 shadow-inner backdrop-blur-sm">
                        
                        {/* Feature: Custom Theme Card */}
                        <div className="mb-6">
                            <button
                                onClick={() => setThemeName('custom')}
                                className={`w-full relative group transition-all duration-500 ease-premium rounded-2xl p-4 border overflow-hidden
                                    ${isCustomActive 
                                        ? 'bg-primary/10 border-primary shadow-lg ring-1 ring-primary/20' 
                                        : 'bg-surface/50 border-white/10 hover:bg-surface hover:border-white/20 hover:shadow-md'}
                                `}
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500
                                            ${isCustomActive ? 'bg-primary text-text-on-primary shadow-lg' : 'bg-black/20 text-text-muted group-hover:text-text-color'}
                                        `}>
                                            <span className="material-symbols-outlined text-2xl">palette</span>
                                        </div>
                                        <div className="text-left">
                                            <div className={`text-base font-bold transition-colors ${isCustomActive ? 'text-primary' : 'text-text-color'}`}>
                                                {t('customThemeSettings')}
                                            </div>
                                            <div className="text-xs text-text-muted">Kendi renklerini seç</div>
                                        </div>
                                    </div>

                                    {/* Preview Circles for Custom Colors */}
                                    <div className="flex -space-x-3">
                                        <div className="h-8 w-8 rounded-full ring-2 ring-surface shadow-md" style={{ background: customPrimary }} />
                                        <div className="h-8 w-8 rounded-full ring-2 ring-surface shadow-md" style={{ background: customSecondary }} />
                                    </div>
                                </div>

                                {/* Active Indicator Glow */}
                                {isCustomActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                                )}
                            </button>

                            {/* Collapsible Color Pickers */}
                            <div className={`grid transition-all duration-500 ease-premium ${isCustomActive ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0 pt-0'}`}>
                                <div className="overflow-hidden min-h-0 bg-black/10 rounded-2xl border border-white/5">
                                    <div className="p-4 space-y-4">
                                        <ColorPicker 
                                            label={t('primaryColor')} 
                                            color={customPrimary} 
                                            onChange={setCustomPrimary} 
                                        />
                                        <ColorPicker 
                                            label={t('secondaryColor')} 
                                            color={customSecondary} 
                                            onChange={setCustomSecondary} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/5 my-6 flex items-center justify-center">
                            <span className="bg-background px-3 text-[10px] font-bold text-text-muted uppercase tracking-widest backdrop-blur-md rounded-full border border-white/5">Presets</span>
                        </div>

                        {/* Preset Themes Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            {presetThemes.map(key => {
                                const isActive = themeName === key;
                                const primaryColor = themes[key][effectiveThemeMode].primary;
                                const secondaryColor = themes[key][effectiveThemeMode].secondary;
                                
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setThemeName(key)}
                                        className={`relative group transition-all duration-500 ease-premium rounded-2xl p-1
                                            ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' : 'hover:scale-105 hover:bg-white/5'}
                                        `}
                                        aria-label={`Theme ${key}`}
                                    >
                                        <div
                                            className={`relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 transition-all duration-500
                                                ${isActive ? 'bg-black/20 shadow-inner' : 'bg-black/10 group-hover:bg-black/20'}
                                            `}
                                        >
                                            <div className={`relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-morph ${isActive ? 'rotate-180' : 'rotate-0'}`}>
                                                <div
                                                    className={`absolute h-7 w-7 rounded-full shadow-lg transition-all duration-700 ease-morph z-20 ring-1 ring-white/10
                                                        ${isActive ? 'translate-x-[6px] scale-90' : 'translate-x-[-8px] scale-110'}
                                                    `}
                                                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}
                                                />
                                                <div
                                                    className={`absolute h-7 w-7 rounded-full shadow-lg transition-all duration-700 ease-morph z-10 ring-1 ring-white/10
                                                        ${isActive ? 'translate-x-[-6px] scale-110' : 'translate-x-[8px] scale-90'}
                                                    `}
                                                    style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${secondaryColor}dd)` }}
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Premium Check Indicator */}
                                        {isActive && (
                                            <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-text-on-primary animate-pop-in border-[3px] border-background shadow-lg z-30">
                                                <span className="material-symbols-outlined !text-[12px] font-extrabold drop-shadow-sm">check</span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Dil Bölümü */}
                <section className="opacity-0 animate-slide-up-soft" style={{ animationDelay: '300ms' }}>
                    <h3 className="mb-3 ml-1 text-sm font-bold uppercase tracking-widest text-text-muted">{t('language')}</h3>
                    <div className="overflow-hidden rounded-3xl bg-surface/30 border border-white/5 shadow-inner backdrop-blur-sm">
                        {Object.entries(nativeLanguageNames).map(([code, name], index) => (
                           <button key={code} onClick={() => setLanguage(code as Language)} className={`flex w-full items-center justify-between p-4 px-6 transition-all hover:bg-white/5 active:scale-[0.98] ${language === code ? 'bg-primary/10 text-primary' : 'text-text-color'}`}>
                               <span className="text-lg font-bold">{name}</span>
                               {language === code && <span className="material-symbols-outlined text-primary scale-125">check_circle</span>}
                           </button>
                        ))}
                    </div>
                </section>
                
                {/* Hakkında Bölümü */}
                <section className="opacity-0 animate-slide-up-soft pb-4" style={{ animationDelay: '400ms' }}>
                    <div className="rounded-3xl bg-surface/30 p-5 border border-white/5 flex items-center justify-between backdrop-blur-sm">
                        <span className="text-sm font-bold uppercase tracking-wider text-text-muted">Versiyon</span>
                        <span className="font-bold text-lg bg-white/10 px-3 py-1 rounded-full border border-white/5 shadow-inner text-text-muted">1.0.0</span>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SettingsView;
