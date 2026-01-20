
import React, { useState } from 'react';
import { View, ThemeName, Language } from '../types';
import { useLanguage, nativeLanguageNames } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../contexts/ThemeContext';

type AnimationOrigin = { top: string; right: string; bottom: string; left: string; } | null;

interface SettingsViewProps {
    setView: () => void;
    animationOrigin: AnimationOrigin;
}

const SettingsView: React.FC<SettingsViewProps> = ({ setView, animationOrigin }) => {
    const { language, setLanguage, t } = useLanguage();
    const { 
        themeMode, setThemeMode, themeName, setThemeName, 
        isGlassmorphismEnabled, setGlassmorphismEnabled,
        glassBlur, setGlassBlur, glassOpacity, setGlassOpacity,
        vibrationEnabled, setVibrationEnabled,
        vibrationIntensity, setVibrationIntensity
    } = useTheme();
    const [isClosing, setIsClosing] = useState(false);
    
    const handleClose = () => {
        setIsClosing(true);
    };

    const onAnimationEnd = (e: React.AnimationEvent) => {
        // Ensure we only react to the view's main animation ending, not children's animations
        if (e.target !== e.currentTarget) return;
        
        if (isClosing) {
            setView();
        }
    };

    return (
        <div
            className={`absolute inset-0 z-20 flex h-full flex-col bg-background glass-view ${isClosing ? 'animate-reveal-out' : 'animate-reveal-in'}`}
            style={animationOrigin ? {
                '--clip-top': animationOrigin.top,
                '--clip-right': animationOrigin.right,
                '--clip-bottom': animationOrigin.bottom,
                '--clip-left': animationOrigin.left,
            } as React.CSSProperties : {}}
            onAnimationEnd={onAnimationEnd}
        >
            <header className="flex items-center justify-between p-4 pt-6 pb-4 opacity-0 animate-fade-scale-in-up" style={{ animationDelay: '50ms' }}>
                <button onClick={handleClose} className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-text-on-secondary shadow-lg transition-transform active:scale-95"><span className="material-symbols-outlined">arrow_back</span></button>
                <h2 className="text-2xl font-bold">{t('settingsTitle')}</h2>
                <div className="w-12" />
            </header>
            <main className="flex-grow space-y-6 overflow-y-auto px-4 custom-scrollbar">
                <section className="opacity-0 animate-fade-scale-in-up" style={{ animationDelay: '150ms' }}>
                    <h3 className="mb-2 text-xl font-bold text-text-muted">{t('appearance')}</h3>
                    <div className="space-y-4 rounded-xl bg-surface p-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="dark-mode-toggle" className="text-lg font-semibold">{t('darkMode')}</label>
                            <button id="dark-mode-toggle" onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${themeMode === 'dark' ? 'bg-primary' : 'bg-number-key'}`}>
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${themeMode === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        <div className="border-t border-text-color/10" />
                        
                        {/* Glassmorphism Toggle */}
                        <div className="flex items-center justify-between">
                            <label htmlFor="glass-mode-toggle" className="text-lg font-semibold">{t('glassmorphism')}</label>
                            <button id="glass-mode-toggle" onClick={() => setGlassmorphismEnabled(!isGlassmorphismEnabled)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isGlassmorphismEnabled ? 'bg-primary' : 'bg-number-key'}`}>
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isGlassmorphismEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        
                        {/* Glassmorphism Controls */}
                        {isGlassmorphismEnabled && (
                            <div className="space-y-4 pt-2 animate-fade-in-up">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm font-medium text-text-muted">
                                        <span>{t('blur')}</span>
                                        <span>{glassBlur}px</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="50" 
                                        value={glassBlur} 
                                        onChange={(e) => setGlassBlur(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm font-medium text-text-muted">
                                        <span>{t('opacity')}</span>
                                        <span>{Math.round(glassOpacity * 100)}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0.1" 
                                        max="1.0" 
                                        step="0.05"
                                        value={glassOpacity} 
                                        onChange={(e) => setGlassOpacity(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="border-t border-text-color/10" />
                        
                        {/* Vibration Controls */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label htmlFor="vibration-toggle" className="text-lg font-semibold">Titreşim (Haptic)</label>
                                <button id="vibration-toggle" onClick={() => setVibrationEnabled(!vibrationEnabled)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${vibrationEnabled ? 'bg-primary' : 'bg-number-key'}`}>
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${vibrationEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            
                            {vibrationEnabled && (
                                <div className="space-y-2 animate-fade-in-up">
                                    <div className="flex justify-between items-center text-sm font-medium text-text-muted">
                                        <span>Şiddet</span>
                                        <span>{vibrationIntensity}ms</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="50" 
                                        value={vibrationIntensity} 
                                        onChange={(e) => setVibrationIntensity(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="border-t border-text-color/10" />
                        <div className="space-y-3">
                            <h4 className="text-lg font-semibold">{t('colorTheme')}</h4>
                            <div className="grid grid-cols-3 gap-4">
                                {(Object.keys(themes) as ThemeName[]).map(key => (
                                    <button
                                        key={key}
                                        onClick={() => setThemeName(key)}
                                        className="relative group rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                                    >
                                        <div
                                            className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full transition-all duration-200 group-hover:scale-105"
                                            style={{ backgroundColor: themes[key][themeMode].surface }}
                                        >
                                            <div className="relative flex items-center">
                                                <div
                                                    className="h-8 w-8 rounded-full border-2"
                                                    style={{
                                                        backgroundColor: themes[key][themeMode].primary,
                                                        borderColor: themes[key][themeMode].background,
                                                    }}
                                                />
                                                <div
                                                    className="h-8 w-8 rounded-full border-2 -ml-4"
                                                    style={{
                                                        backgroundColor: themes[key][themeMode].secondary,
                                                        borderColor: themes[key][themeMode].background,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {themeName === key && (
                                            <div className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-text-on-primary animate-pop-in-fast ring-2 ring-surface">
                                                <span className="material-symbols-outlined !text-sm">check</span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="opacity-0 animate-fade-scale-in-up" style={{ animationDelay: '250ms' }}>
                    <h3 className="mb-2 text-xl font-bold text-text-muted">{t('language')}</h3>
                    <div className="divide-y divide-text-color/10 rounded-xl bg-surface">
                        {Object.entries(nativeLanguageNames).map(([code, name], index) => (
                           <button key={code} onClick={() => setLanguage(code as Language)} className={`flex w-full items-center justify-between p-4 transition-colors hover:bg-text-color/5 active:scale-[0.98] ${index === 0 ? 'rounded-t-xl' : ''} ${index === Object.keys(nativeLanguageNames).length - 1 ? 'rounded-b-xl' : ''} ${language !== code ? 'text-text-muted' : ''}`}>
                               <span className="text-lg font-semibold">{name}</span>
                               {language === code && <span className="material-symbols-outlined text-primary">check_circle</span>}
                           </button>
                        ))}
                    </div>
                </section>
                <section className="opacity-0 animate-fade-scale-in-up" style={{ animationDelay: '350ms' }}>
                    <h3 className="mb-2 text-xl font-bold text-text-muted">{t('about')}</h3>
                    <div className="rounded-xl bg-surface p-4">
                        <div className="flex items-center justify-between"><span className="text-lg font-semibold text-text-muted">{t('appVersion')}</span><span className="font-bold text-lg">1.0.0</span></div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SettingsView;
