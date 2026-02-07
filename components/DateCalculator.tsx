
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DateMode, TranslationKey } from '../types';
import DatePickerKeypad from './DatePickerKeypad';
import { useDateCalculator, DateCalculatorLogic } from '../hooks/useDateCalculator';
import { DateDiffView, DateAddSubView, DateConversionView } from './DateViews';
import { HIJRI_MONTHS, PERSIAN_MONTHS, HEBREW_MONTHS } from '../utils/dateAlgorithms';

// Re-export hook for MainView.tsx compatibility
export { useDateCalculator } from '../hooks/useDateCalculator';

export const DateCalculatorView: React.FC<{ mode: DateMode; logic: DateCalculatorLogic }> = ({ mode, logic }) => {
    const { setIsPickerOpen, setActiveField } = logic;
    const openPicker = (field: 'start' | 'end' | 'convert') => { 
        setActiveField(field as any); 
        setIsPickerOpen(true); 
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            <div className={`absolute inset-0 transition-transform duration-500 ease-spring ${mode === 'diff' ? 'translate-x-0' : '-translate-x-full'}`}>
                <DateDiffView logic={logic} openPicker={openPicker} />
            </div>
            <div className={`absolute inset-0 transition-transform duration-500 ease-spring ${mode === 'addsub' ? 'translate-x-0' : (mode === 'diff' ? 'translate-x-full' : '-translate-x-full')}`}>
                <DateAddSubView logic={logic} openPicker={openPicker} setActiveField={setActiveField} />
            </div>
            <div className={`absolute inset-0 transition-transform duration-500 ease-spring ${mode === 'convert' ? 'translate-x-0' : 'translate-x-full'}`}>
                <DateConversionView logic={logic} openPicker={openPicker} />
            </div>
        </div>
    );
};

export const DateCalculatorDrawer: React.FC<{ logic: DateCalculatorLogic }> = ({ logic }) => {
    const { t } = useLanguage();
    const { 
        isPickerOpen, setIsPickerOpen, activeField, 
        startDate, setStartDate, endDate, setEndDate,
        inputState, handleInputDateChange, inputCalendar, setInputCalendar
    } = logic;

    const isConvertMode = logic.currentMode === 'convert';
    
    // Determine Target & Config for Picker
    let currentDate = startDate;
    let onChangeDate = setStartDate;
    let pickerMode = 'gregorian';
    let monthNames: string[] | undefined = undefined;
    let minY = 1900;
    let maxY = 2100;
    let daysInMonth = 31;
    let labelYear = undefined;
    let labelMonth = undefined;
    let labelDay = undefined;

    if (activeField === 'end') {
        currentDate = endDate;
        onChangeDate = setEndDate;
    } else if (isConvertMode && activeField === 'start') {
        // Convert Mode Input Configuration
        pickerMode = 'generic'; 
        if (inputCalendar === 'hijri') {
            monthNames = HIJRI_MONTHS;
            minY = 1300; maxY = 1500;
        } else if (inputCalendar === 'persian') {
            monthNames = PERSIAN_MONTHS;
            minY = 1300; maxY = 1500;
        } else if (inputCalendar === 'rumi') {
            minY = 1300; maxY = 1500;
        } else if (inputCalendar === 'hebrew') {
            monthNames = HEBREW_MONTHS;
            minY = 5600; maxY = 5900;
        } else if (inputCalendar === 'chinese') {
            // Using numbers 1-12 for months
            monthNames = Array.from({length: 12}, (_, i) => `${i+1}`);
            minY = 1900; maxY = 2100; // Related Gregorian Year
        } else if (inputCalendar === 'mayan') {
            // Mayan Input: Baktun (Year col), Katun (Month col), Tun (Day col)
            // Baktun 0-20
            minY = 0; maxY = 20;
            // Katun 0-19 (used as months)
            monthNames = Array.from({length: 20}, (_, i) => `${i}`); 
            // Tun 0-19 (used as days)
            daysInMonth = 20; 
            
            labelYear = "Baktun";
            labelMonth = "Katun";
            labelDay = "Tun";
        } else {
            // Gregorian / Julian
            minY = 1000; maxY = 3000;
        }
    }

    // Expanded list including Chinese and Mayan
    const availableCalendars = ['gregorian', 'hijri', 'julian', 'persian', 'rumi', 'hebrew', 'chinese', 'mayan'];

    return (
        <>
            <div 
                className={`fixed inset-x-0 bottom-0 z-50 flex flex-col bg-surface/95 backdrop-blur-xl rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-spring max-w-lg mx-auto border-t border-white/10 ${isPickerOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ height: isConvertMode ? '60dvh' : '50dvh', left: 0, right: 0 }}
            >
                {/* Header */}
                <div className="flex flex-col border-b border-white/5 relative z-40">
                    <div className="flex items-center justify-between p-4 px-6">
                        <span className="text-lg font-bold tracking-tight text-text-color">{t('dateCalculator')}</span>
                        <button onClick={() => setIsPickerOpen(false)} className="h-8 px-4 flex items-center justify-center bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors font-bold text-sm tracking-wide">{t('close')}</button>
                    </div>
                    
                    {/* Calendar Type Selector (Only in Convert Mode & Start Field) */}
                    {isConvertMode && activeField === 'start' && (
                        <div className="px-6 pb-4 overflow-x-auto no-scrollbar">
                            <div className="flex gap-2">
                                {availableCalendars.map(cal => (
                                    <button 
                                        key={cal}
                                        onClick={() => setInputCalendar(cal as any)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${inputCalendar === cal ? 'bg-primary border-primary text-text-on-primary shadow-md' : 'bg-surface/50 border-white/10 text-text-muted hover:bg-surface hover:text-text-color'}`}
                                    >
                                        {t(`calendar_${cal}` as TranslationKey)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Picker Area */}
                <div className="flex-1 relative overflow-hidden bg-background/50">
                   <DatePickerKeypad 
                        date={currentDate}
                        onChange={onChangeDate}
                        // Generic Input Props
                        inputState={pickerMode === 'generic' ? inputState : undefined}
                        onInputChange={pickerMode === 'generic' ? handleInputDateChange : undefined}
                        monthNames={monthNames}
                        minYear={minY}
                        maxYear={maxY}
                        daysInMonth={daysInMonth}
                        // Custom Labels
                        labelYear={labelYear}
                        labelMonth={labelMonth}
                        labelDay={labelDay}
                    />
                </div>
            </div>
             {isPickerOpen && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in" onClick={() => setIsPickerOpen(false)}/>)}
        </>
    );
};

const DateCalculator: React.FC<{ mode: DateMode }> = ({ mode }) => {
    const logic = useDateCalculator(mode);
    
    return (
        <div className="flex h-full flex-col relative">
            <div className="flex-1 overflow-hidden relative">
                <DateCalculatorView mode={mode} logic={logic} />
            </div>
            <DateCalculatorDrawer logic={logic} />
        </div>
    );
}

export default DateCalculator;
