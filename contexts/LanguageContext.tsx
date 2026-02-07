
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Language, TranslationKey } from '../types';

const translations = {
    tr: {
        historyTitle: 'Hesaplama Geçmişi', settingsTitle: 'Ayarlar', noHistory: 'Henüz hesaplama yok.', clearHistory: 'Geçmişi Temizle', appearance: 'Görünüm', darkMode: 'Koyu Mod', themeMode: 'Tema Modu', system: 'Sistem', light: 'Açık', dark: 'Koyu', glassmorphism: 'Glassmorphism', blur: 'Bulanıklık', opacity: 'Saydamlık', language: 'Dil', about: 'Hakkında', appVersion: 'Uygulama Versiyonu', close: 'Kapat', 
        unitSelectionTitle: '{category} Birimleri', 
        unit_Length: 'Uzunluk', unit_Weight: 'Ağırlık', unit_Volume: 'Hacim', unit_Speed: 'Hız', unit_Temperature: 'Sıcaklık', unit_Currency: 'Para Birimi', unit_Time: 'Zaman Birimleri',
        unit_Kilometer: 'Kilometre', unit_Meter: 'Metre', unit_Centimeter: 'Santimetre', unit_Millimeter: 'Milimetre', unit_Mile: 'Mil', unit_Yard: 'Yard', unit_Foot: 'Fit', unit_Inch: 'İnç', 
        unit_Tonne: 'Ton', unit_Kilogram: 'Kilogram', unit_Gram: 'Gram', unit_Milligram: 'Miligram', unit_Pound: 'Pound', unit_Ounce: 'Ons', 
        unit_Liter: 'Litre', unit_Milliliter: 'Mililitre', unit_CubicMeter: 'Metreküp', unit_CubicCentimeter: 'Santimetreküp', unit_Gallon: 'Galon', unit_Quart: 'Kuart', 
        unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mil/h', 
        unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', 
        unit_USD: 'Amerikan Doları', unit_EUR: 'Euro', unit_TRY: 'Türk Lirası', unit_GBP: 'İngiliz Sterlini', unit_JPY: 'Japon Yeni', unit_CAD: 'Kanada Doları', unit_AUD: 'Avustralya Doları', unit_RUB: 'Rus Rublesi', unit_CNY: 'Çin Yuanı',
        unit_Year: 'Yıl', unit_Month: 'Ay', unit_Week: 'Hafta', unit_Day: 'Gün', unit_Hour: 'Saat', unit_Minute: 'Dakika', unit_Second: 'Saniye', unit_Millisecond: 'Milisaniye',
        colorTheme: 'Renk Teması',
        dateCalculator: 'Tarih Hesaplayıcı', dateDifference: 'Tarih Farkı', addSubtractDate: 'Tarih Ekle/Çıkar', startDate: 'Başlangıç Tarihi', endDate: 'Bitiş Tarihi', years: 'Yıl', months: 'Ay', days: 'Gün', calculate: 'Hesapla', result: 'Sonuç', operation: 'İşlem', add: 'Ekle', subtract: 'Çıkar', from: 'Gelen', to: 'Giden',
        financeCalculator: 'Finans Hesaplayıcı', price: 'Fiyat', taxRate: 'Vergi Oranı (%)', discountRate: 'İndirim Oranı (%)', finalPrice: 'Son Fiyat', taxAmount: 'Vergi Tutarı', discountAmount: 'İndirim Tutarı', salePrice: 'İndirimli Fiyat', discountFirst: 'Önce İndirim', taxFirst: 'Önce Vergi',
        bmiCalculator: 'VKE Hesaplayıcı', weight: 'Ağırlık (kg)', height: 'Boy (cm)', bmiScore: 'VKE Skoru', underweight: 'Zayıf', normal: 'Normal', overweight: 'Fazla Kilolu', obese: 'Obez',
        gender: 'Cinsiyet', male: 'Erkek', female: 'Kadın',
        mode_calculator: 'Hesap Makinesi', mode_converter: 'Dönüştürücü', mode_date: 'Tarih', mode_finance: 'Finans', mode_bmi: 'VKE',
        toggle_basic: 'Basit', toggle_scientific: 'Bilim', toggle_diff: 'Fark', toggle_add: 'Ekle', toggle_convert: 'Çevir',
        customThemeSettings: 'Özel Tema Ayarları', primaryColor: 'Birincil Renk', secondaryColor: 'İkincil Renk',
        calendarConverter: 'Takvim Çevirici', inputDate: 'Tarih Seç', selectCalendar: 'Takvim Tipi',
        calendar_gregorian: 'Miladi', calendar_hijri: 'Hicri', calendar_rumi: 'Rumi',
        calendar_julian: 'Julyen', calendar_persian: 'İran (Celali)', calendar_hebrew: 'İbrani', calendar_chinese: 'Çin', calendar_mayan: 'Maya (Long Count)'
    },
    en: {
        historyTitle: 'Calculation History', settingsTitle: 'Settings', noHistory: 'No calculations yet.', clearHistory: 'Clear History', appearance: 'Appearance', darkMode: 'Dark Mode', themeMode: 'Theme Mode', system: 'System', light: 'Light', dark: 'Dark', glassmorphism: 'Glassmorphism', blur: 'Blur', opacity: 'Opacity', language: 'Language', about: 'About', appVersion: 'App Version', close: 'Close', 
        unitSelectionTitle: '{category} Units', 
        unit_Length: 'Length', unit_Weight: 'Weight', unit_Volume: 'Volume', unit_Speed: 'Speed', unit_Temperature: 'Temperature', unit_Currency: 'Currency', unit_Time: 'Time Units',
        unit_Kilometer: 'Kilometer', unit_Meter: 'Meter', unit_Centimeter: 'Centimeter', unit_Millimeter: 'Millimeter', unit_Mile: 'Mile', unit_Yard: 'Yard', unit_Foot: 'Foot', unit_Inch: 'Inch', 
        unit_Tonne: 'Tonne', unit_Kilogram: 'Kilogram', unit_Gram: 'Gram', unit_Milligram: 'Milligram', unit_Pound: 'Pound', unit_Ounce: 'Ounce', 
        unit_Liter: 'Liter', unit_Milliliter: 'Milliliter', unit_CubicMeter: 'Cubic Meter', unit_CubicCentimeter: 'Cubic Centimeter', unit_Gallon: 'Gallon', unit_Quart: 'Quart', 
        unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mph', 
        unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', 
        unit_USD: 'US Dollar', unit_EUR: 'Euro', unit_TRY: 'Turkish Lira', unit_GBP: 'British Pound', unit_JPY: 'Japanese Yen', unit_CAD: 'Canadian Dollar', unit_AUD: 'Australian Dollar', unit_RUB: 'Russian Ruble', unit_CNY: 'Chinese Yuan',
        unit_Year: 'Year', unit_Month: 'Month', unit_Week: 'Week', unit_Day: 'Day', unit_Hour: 'Hour', unit_Minute: 'Minute', unit_Second: 'Second', unit_Millisecond: 'Millisecond',
        colorTheme: 'Color Theme',
        dateCalculator: 'Date Calculator', dateDifference: 'Date Difference', addSubtractDate: 'Add/Subtract Date', startDate: 'Start Date', endDate: 'End Date', years: 'Years', months: 'Months', days: 'Days', calculate: 'Calculate', result: 'Result', operation: 'Operation', add: 'Add', subtract: 'Subtract', from: 'From', to: 'To',
        financeCalculator: 'Finance Calculator', price: 'Price', taxRate: 'Tax Rate (%)', discountRate: 'Discount Rate (%)', finalPrice: 'Final Price', taxAmount: 'Tax Amount', discountAmount: 'Discount Amount', salePrice: 'Sale Price', discountFirst: 'Discount First', taxFirst: 'Tax First',
        bmiCalculator: 'BMI Calculator', weight: 'Weight (kg)', height: 'Height (cm)', bmiScore: 'BMI Score', underweight: 'Underweight', normal: 'Normal', overweight: 'Overweight', obese: 'Obese',
        gender: 'Gender', male: 'Male', female: 'Female',
        mode_calculator: 'Calculator', mode_converter: 'Converter', mode_date: 'Date', mode_finance: 'Finance', mode_bmi: 'BMI',
        toggle_basic: 'Basic', toggle_scientific: 'Sci', toggle_diff: 'Diff', toggle_add: 'Add', toggle_convert: 'Conv',
        customThemeSettings: 'Custom Theme Settings', primaryColor: 'Primary Color', secondaryColor: 'Secondary Color',
        calendarConverter: 'Calendar Converter', inputDate: 'Select Date', selectCalendar: 'Calendar Type',
        calendar_gregorian: 'Gregorian', calendar_hijri: 'Hijri', calendar_rumi: 'Rumi',
        calendar_julian: 'Julian', calendar_persian: 'Persian (Solar)', calendar_hebrew: 'Hebrew', calendar_chinese: 'Chinese', calendar_mayan: 'Mayan'
    },
    // ... other languages would need similar updates, defaulting to english for now if missing
    es: {
        // ... previous translations ...
        historyTitle: 'Historial de Cálculos', settingsTitle: 'Ajustes', noHistory: 'Aún no hay cálculos.', clearHistory: 'Limpiar Historial', appearance: 'Apariencia', darkMode: 'Modo Oscuro', themeMode: 'Modo Tema', system: 'Sistema', light: 'Claro', dark: 'Oscuro', glassmorphism: 'Glassmorphism', blur: 'Desenfoque', opacity: 'Opacidad', language: 'Idioma', about: 'Acerca de', appVersion: 'Versión de la App', close: 'Cerrar', 
        unitSelectionTitle: 'Unidades de {category}', 
        unit_Length: 'Longitud', unit_Weight: 'Peso', unit_Volume: 'Volumen', unit_Speed: 'Velocidad', unit_Temperature: 'Temperatura', unit_Currency: 'Moneda', unit_Time: 'Unidades de Tiempo',
        unit_Kilometer: 'Kilómetro', unit_Meter: 'Metro', unit_Centimeter: 'Centímetro', unit_Millimeter: 'Milímetro', unit_Mile: 'Milla', unit_Yard: 'Yarda', unit_Foot: 'Pie', unit_Inch: 'Pulgada', 
        unit_Tonne: 'Tonelada', unit_Kilogram: 'Kilogramo', unit_Gram: 'Gramo', unit_Milligram: 'Miligramo', unit_Pound: 'Libra', unit_Ounce: 'Onza', 
        unit_Liter: 'Litro', unit_Milliliter: 'Mililitro', unit_CubicMeter: 'Metro Cúbico', unit_CubicCentimeter: 'Centímetro Cúbico', unit_Gallon: 'Galón', unit_Quart: 'Cuarto de Galón', 
        unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mph', 
        unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', 
        unit_USD: 'Dólar Estadounidense', unit_EUR: 'Euro', unit_TRY: 'Lira Turca', unit_GBP: 'Libra Esterlina', unit_JPY: 'Yen Japonés', unit_CAD: 'Dólar Canadiense', unit_AUD: 'Dólar Australiano', unit_RUB: 'Rublo Ruso', unit_CNY: 'Yuan Chino',
        unit_Year: 'Año', unit_Month: 'Mes', unit_Week: 'Semana', unit_Day: 'Día', unit_Hour: 'Hora', unit_Minute: 'Minuto', unit_Second: 'Segundo', unit_Millisecond: 'Milisegundo',
        colorTheme: 'Tema de Color',
        dateCalculator: 'Calculadora de Fechas', dateDifference: 'Diferencia de Fechas', addSubtractDate: 'Sumar/Restar Fecha', startDate: 'Fecha de Inicio', endDate: 'Fecha Final', years: 'Años', months: 'Meses', days: 'Días', calculate: 'Calcular', result: 'Resultado', operation: 'Operación', add: 'Añadir', subtract: 'Restar', from: 'Desde', to: 'Hasta',
        financeCalculator: 'Calculadora Financiera', price: 'Precio', taxRate: 'Tasa de Impuesto (%)', discountRate: 'Tasa de Descuento (%)', finalPrice: 'Precio Final', taxAmount: 'Monto de Impuesto', discountAmount: 'Monto de Descuento', salePrice: 'Precio de Venta', discountFirst: 'Descuento Primero', taxFirst: 'Impuesto Primero',
        bmiCalculator: 'Calculadora IMC', weight: 'Peso (kg)', height: 'Altura (cm)', bmiScore: 'Puntuación IMC', underweight: 'Bajo peso', normal: 'Normal', overweight: 'Sobrepeso', obese: 'Obeso',
        gender: 'Género', male: 'Masculino', female: 'Femenino',
        mode_calculator: 'Calculadora', mode_converter: 'Convertidor', mode_date: 'Fecha', mode_finance: 'Finanzas', mode_bmi: 'IMC',
        toggle_basic: 'Bás.', toggle_scientific: 'Cient.', toggle_diff: 'Dif', toggle_add: 'Sumar', toggle_convert: 'Conv',
        customThemeSettings: 'Ajustes de Tema Personalizado', primaryColor: 'Color Primario', secondaryColor: 'Color Secundario',
        calendarConverter: 'Conversor de Calendario', inputDate: 'Seleccionar Fecha', selectCalendar: 'Tipo de Calendario',
        calendar_gregorian: 'Gregoriano', calendar_hijri: 'Hijri', calendar_rumi: 'Rumi',
        calendar_julian: 'Juliano', calendar_persian: 'Persa', calendar_hebrew: 'Hebreo', calendar_chinese: 'Chino', calendar_mayan: 'Maya'
    },
    de: {
        historyTitle: 'Verlauf', settingsTitle: 'Einstellungen', noHistory: 'Noch keine Berechnungen.', clearHistory: 'Verlauf löschen', appearance: 'Erscheinungsbild', darkMode: 'Dunkelmodus', themeMode: 'Themenmodus', system: 'System', light: 'Hell', dark: 'Dunkel', glassmorphism: 'Glassmorphism', blur: 'Weichzeichnen', opacity: 'Deckkraft', language: 'Sprache', about: 'Über', appVersion: 'App-Version', close: 'Schließen', 
        unitSelectionTitle: 'Einheiten für {category}', 
        unit_Length: 'Länge', unit_Weight: 'Gewicht', unit_Volume: 'Volumen', unit_Speed: 'Geschwindigkeit', unit_Temperature: 'Temperatur', unit_Currency: 'Währung', unit_Time: 'Zeiteinheiten',
        unit_Kilometer: 'Kilometer', unit_Meter: 'Meter', unit_Centimeter: 'Zentimeter', unit_Millimeter: 'Millimeter', unit_Mile: 'Meile', unit_Yard: 'Yard', unit_Foot: 'Fuß', unit_Inch: 'Zoll', 
        unit_Tonne: 'Tonne', unit_Kilogram: 'Kilogramm', unit_Gram: 'Gramm', unit_Milligram: 'Milligramm', unit_Pound: 'Pfund', unit_Ounce: 'Unze', 
        unit_Liter: 'Liter', unit_Milliliter: 'Milliliter', unit_CubicMeter: 'Kubikmeter', unit_CubicCentimeter: 'Kubikzentimeter', unit_Gallon: 'Gallone', unit_Quart: 'Quart', 
        unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mph', 
        unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', 
        unit_USD: 'US-Dollar', unit_EUR: 'Euro', unit_TRY: 'Türkische Lira', unit_GBP: 'Britisches Pfund', unit_JPY: 'Japanischer Yen', unit_CAD: 'Kanadischer Dollar', unit_AUD: 'Australischer Dollar', unit_RUB: 'Russischer Rubel', unit_CNY: 'Chinesischer Yuan',
        unit_Year: 'Jahr', unit_Month: 'Monat', unit_Week: 'Woche', unit_Day: 'Tag', unit_Hour: 'Stunde', unit_Minute: 'Minute', unit_Second: 'Sekunde', unit_Millisecond: 'Millisekunde',
        colorTheme: 'Farbthema',
        dateCalculator: 'Datumsrechner', dateDifference: 'Datumsdifferenz', addSubtractDate: 'Datum hinzufügen/entfernen', startDate: 'Startdatum', endDate: 'Enddatum', years: 'Jahre', months: 'Monate', days: 'Tage', calculate: 'Berechnen', result: 'Ergebnis', operation: 'Operation', add: 'Hinzufügen', subtract: 'Abziehen', from: 'Von', to: 'Bis',
        financeCalculator: 'Finanzrechner', price: 'Preis', taxRate: 'Steuersatz (%)', discountRate: 'Rabattsatz (%)', finalPrice: 'Endpreis', taxAmount: 'Steuerbetrag', discountAmount: 'Rabattbetrag', salePrice: 'Verkaufspreis', discountFirst: 'Rabatt zuerst', taxFirst: 'Steuer zuerst',
        bmiCalculator: 'BMI Rechner', weight: 'Gewicht (kg)', height: 'Höhe (cm)', bmiScore: 'BMI-Wert', underweight: 'Untergewicht', normal: 'Normal', overweight: 'Übergewicht', obese: 'Fettleibig',
        gender: 'Geschlecht', male: 'Männlich', female: 'Weiblich',
        mode_calculator: 'Rechner', mode_converter: 'Konverter', mode_date: 'Datum', mode_finance: 'Finanzen', mode_bmi: 'BMI',
        toggle_basic: 'Basis', toggle_scientific: 'Wiss.', toggle_diff: 'Diff', toggle_add: 'Add.', toggle_convert: 'Konv',
        customThemeSettings: 'Benutzerdefinierte Themeneinstellungen', primaryColor: 'Primärfarbe', secondaryColor: 'Sekundärfarbe',
        calendarConverter: 'Kalenderkonverter', inputDate: 'Datum auswählen', selectCalendar: 'Kalendertyp',
        calendar_gregorian: 'Gregorianisch', calendar_hijri: 'Hidschra', calendar_rumi: 'Rumi',
        calendar_julian: 'Julianisch', calendar_persian: 'Persisch', calendar_hebrew: 'Hebräisch', calendar_chinese: 'Chinesisch', calendar_mayan: 'Maya'
    },
    fr: {
        // ... previous translations ...
        historyTitle: 'Historique des calculs', settingsTitle: 'Réglages', noHistory: 'Aucun calcul pour le moment.', clearHistory: 'Effacer l’historique', appearance: 'Apparence', darkMode: 'Mode Sombre', themeMode: 'Mode Thème', system: 'Système', light: 'Clair', dark: 'Sombre', glassmorphism: 'Glassmorphism', blur: 'Flou', opacity: 'Opacité', language: 'Langue', about: 'À propos', appVersion: 'Version de l’application', close: 'Fermer', 
        unitSelectionTitle: 'Unités de {category}', 
        unit_Length: 'Longueur', unit_Weight: 'Poids', unit_Volume: 'Volume', unit_Speed: 'Vitesse', unit_Temperature: 'Température', unit_Currency: 'Devise', unit_Time: 'Unités de Temps',
        unit_Kilometer: 'Kilomètre', unit_Meter: 'Mètre', unit_Centimeter: 'Centimètre', unit_Millimeter: 'Millimètre', unit_Mile: 'Mile', unit_Yard: 'Yard', unit_Foot: 'Pied', unit_Inch: 'Pouce', 
        unit_Tonne: 'Tonne', unit_Kilogram: 'Kilogramme', unit_Gram: 'Gramme', unit_Milligram: 'Milligramme', unit_Pound: 'Livre', unit_Ounce: 'Once', 
        unit_Liter: 'Litre', unit_Milliliter: 'Millilitre', unit_CubicMeter: 'Mètre cube', unit_CubicCentimeter: 'Centimètre cube', unit_Gallon: 'Gallon', unit_Quart: 'Quart', 
        unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mph', 
        unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', 
        unit_USD: 'Dollar américain', unit_EUR: 'Euro', unit_TRY: 'Lire turque', unit_GBP: 'Livre sterling', unit_JPY: 'Yen japonais', unit_CAD: 'Dollar canadien', unit_AUD: 'Dollar australien', unit_RUB: 'Rouble russe', unit_CNY: 'Yuan chinois',
        unit_Year: 'Année', unit_Month: 'Mois', unit_Week: 'Semaine', unit_Day: 'Jour', unit_Hour: 'Heure', unit_Minute: 'Minute', unit_Second: 'Seconde', unit_Millisecond: 'Milliseconde',
        colorTheme: 'Thème de couleur',
        dateCalculator: 'Calculateur de date', dateDifference: 'Différence de date', addSubtractDate: 'Ajouter/Soustraire une date', startDate: 'Date de début', endDate: 'Date de fin', years: 'Années', months: 'Mois', days: 'Jours', calculate: 'Calculer', result: 'Résultat', operation: 'Opération', add: 'Ajouter', subtract: 'Soustraire', from: 'De', to: 'À',
        financeCalculator: 'Calculateur Financier', price: 'Prix', taxRate: 'Taux de taxe (%)', discountRate: 'Taux de remise (%)', finalPrice: 'Prix Final', taxAmount: 'Montant de la taxe', discountAmount: 'Montant de la remise', salePrice: 'Prix de vente', discountFirst: 'Remise d\'abord', taxFirst: 'Taxe d\'abord',
        bmiCalculator: 'Calculateur IMC', weight: 'Poids (kg)', height: 'Taille (cm)', bmiScore: 'Score IMC', underweight: 'Insuffisance pondérale', normal: 'Normal', overweight: 'Surpoids', obese: 'Obèse',
        gender: 'Genre', male: 'Homme', female: 'Femme',
        mode_calculator: 'Calculatrice', mode_converter: 'Convertisseur', mode_date: 'Date', mode_finance: 'Finance', mode_bmi: 'IMC',
        toggle_basic: 'Base', toggle_scientific: 'Sci', toggle_diff: 'Diff', toggle_add: 'Ajout', toggle_convert: 'Conv',
        customThemeSettings: 'Paramètres du thème personnalisé', primaryColor: 'Couleur primaire', secondaryColor: 'Couleur secondaire',
        calendarConverter: 'Convertisseur de calendrier', inputDate: 'Sélectionner une date', selectCalendar: 'Type de calendrier',
        calendar_gregorian: 'Grégorien', calendar_hijri: 'Hégirien', calendar_rumi: 'Rumi',
        calendar_julian: 'Julien', calendar_persian: 'Persan', calendar_hebrew: 'Hébreu', calendar_chinese: 'Chinois', calendar_mayan: 'Maya'
    },
    it: {
        // ... previous translations ...
        historyTitle: 'Cronologia Calcoli', settingsTitle: 'Impostazioni', noHistory: 'Nessun calcolo ancora.', clearHistory: 'Cancella Cronologia', appearance: 'Aspetto', darkMode: 'Modalità Scura', themeMode: 'Modalità Tema', system: 'Sistema', light: 'Chiaro', dark: 'Scuro', glassmorphism: 'Glassmorphism', blur: 'Sfocatura', opacity: 'Opacità', language: 'Lingua', about: 'Informazioni', appVersion: 'Versione App', close: 'Chiudi', 
        unitSelectionTitle: 'Unità di {category}', 
        unit_Length: 'Lunghezza', unit_Weight: 'Peso', unit_Volume: 'Volume', unit_Speed: 'Velocità', unit_Temperature: 'Temperatura', unit_Currency: 'Valuta', unit_Time: 'Unità di Tempo',
        unit_Kilometer: 'Chilometro', unit_Meter: 'Metro', unit_Centimeter: 'Centimetro', unit_Millimeter: 'Millimetro', unit_Mile: 'Miglio', unit_Yard: 'Iarda', unit_Foot: 'Piede', unit_Inch: 'Pollice', 
        unit_Tonne: 'Tonnellata', unit_Kilogram: 'Chilogrammo', unit_Gram: 'Grammo', unit_Milligram: 'Milligrammo', unit_Pound: 'Libbra', unit_Ounce: 'Oncia', 
        unit_Liter: 'Litro', unit_Milliliter: 'Millilitro', unit_CubicMeter: 'Metro Cubo', unit_CubicCentimeter: 'Centimetro Cubo', unit_Gallon: 'Gallone', unit_Quart: 'Quarto', 
        unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mph', 
        unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', 
        unit_USD: 'Dollaro USA', unit_EUR: 'Euro', unit_TRY: 'Lira Turca', unit_GBP: 'Sterlina Britannica', unit_JPY: 'Yen Giapponese', unit_CAD: 'Dollaro Canadese', unit_AUD: 'Dollaro Australiano', unit_RUB: 'Rublo Russo', unit_CNY: 'Yuan Cinese',
        unit_Year: 'Anno', unit_Month: 'Mese', unit_Week: 'Settimana', unit_Day: 'Giorno', unit_Hour: 'Ora', unit_Minute: 'Minuto', unit_Second: 'Secondo', unit_Millisecond: 'Millisecondo',
        colorTheme: 'Tema Colore',
        dateCalculator: 'Calcolatore di date', dateDifference: 'Differenza di date', addSubtractDate: 'Aggiungi/Sottrai data', startDate: 'Data di inizio', endDate: 'Data di fine', years: 'Anni', months: 'Mesi', days: 'Giorni', calculate: 'Calcola', result: 'Risultato', operation: 'Operazione', add: 'Aggiungi', subtract: 'Sottrai', from: 'Da', to: 'A',
        financeCalculator: 'Calcolatrice Finanziaria', price: 'Prezzo', taxRate: 'Aliquota Fiscale (%)', discountRate: 'Tasso di Sconto (%)', finalPrice: 'Prezzo Finale', taxAmount: 'Importo Tassa', discountAmount: 'Importo Sconto', salePrice: 'Prezzo di Vendita', discountFirst: 'Sconto Prima', taxFirst: 'Tassa Prima',
        bmiCalculator: 'Calcolatore IMC', weight: 'Peso (kg)', height: 'Altezza (cm)', bmiScore: 'Punteggio IMC', underweight: 'Sottopeso', normal: 'Normale', overweight: 'Sovrappeso', obese: 'Obeso',
        gender: 'Genere', male: 'Maschio', female: 'Femmina',
        mode_calculator: 'Calcolatrice', mode_converter: 'Convertitore', mode_date: 'Data', mode_finance: 'Finanza', mode_bmi: 'IMC',
        toggle_basic: 'Base', toggle_scientific: 'Sci', toggle_diff: 'Diff', toggle_add: 'Agg.', toggle_convert: 'Conv',
        customThemeSettings: 'Impostazioni Tema Personalizzato', primaryColor: 'Colore Primario', secondaryColor: 'Colore Secondario',
        calendarConverter: 'Convertitore di calendario', inputDate: 'Seleziona Data', selectCalendar: 'Tipo di Calendario',
        calendar_gregorian: 'Gregoriano', calendar_hijri: 'Hijri', calendar_rumi: 'Rumi',
        calendar_julian: 'Giuliano', calendar_persian: 'Persiano', calendar_hebrew: 'Ebraico', calendar_chinese: 'Cinese', calendar_mayan: 'Maya'
    },
    pt: {
        // ... previous translations ...
        historyTitle: 'Histórico de Cálculos', settingsTitle: 'Configurações', noHistory: 'Nenhum cálculo ainda.', clearHistory: 'Limpar Histórico', appearance: 'Aparência', darkMode: 'Modo Escuro', themeMode: 'Modo Tema', system: 'Sistema', light: 'Claro', dark: 'Escuro', glassmorphism: 'Glassmorphism', blur: 'Desfoque', opacity: 'Opacidade', language: 'Idioma', about: 'Sobre', appVersion: 'Versão do App', close: 'Fechar', 
        unitSelectionTitle: 'Unidades de {category}', 
        unit_Length: 'Comprimento', unit_Weight: 'Peso', unit_Volume: 'Volume', unit_Speed: 'Velocidade', unit_Temperature: 'Temperatura', unit_Currency: 'Moeda', unit_Time: 'Unidades de Tempo',
        unit_Kilometer: 'Quilômetro', unit_Meter: 'Metro', unit_Centimeter: 'Centímetro', unit_Millimeter: 'Milímetro', unit_Mile: 'Milha', unit_Yard: 'Jarda', unit_Foot: 'Pé', unit_Inch: 'Polegada', 
        unit_Tonne: 'Tonelada', unit_Kilogram: 'Quilograma', unit_Gram: 'Grama', unit_Milligram: 'Miligrama', unit_Pound: 'Libra', unit_Ounce: 'Onça', 
        unit_Liter: 'Litro', unit_Milliliter: 'Mililitro', unit_CubicMeter: 'Metro Cúbico', unit_CubicCentimeter: 'Centímetro Cúbico', unit_Gallon: 'Galão', unit_Quart: 'Quarto', 
        unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mph', 
        unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Kelvin', 
        unit_USD: 'Dólar Americano', unit_EUR: 'Euro', unit_TRY: 'Lira Turca', unit_GBP: 'Libra Esterlina', unit_JPY: 'Iene Japonês', unit_CAD: 'Dólar Canadense', unit_AUD: 'Dólar Australiano', unit_RUB: 'Rublo Russo', unit_CNY: 'Yuan Chinês',
        unit_Year: 'Ano', unit_Month: 'Mês', unit_Week: 'Semana', unit_Day: 'Dia', unit_Hour: 'Hora', unit_Minute: 'Minuto', unit_Second: 'Segundo', unit_Millisecond: 'Milissegundo',
        colorTheme: 'Tema de Cores',
        dateCalculator: 'Calculadora de Data', dateDifference: 'Diferença de Data', addSubtractDate: 'Adicionar/Subtrair Data', startDate: 'Data de Início', endDate: 'Data Final', years: 'Anos', months: 'Meses', days: 'Dias', calculate: 'Calcular', result: 'Resultado', operation: 'Operação', add: 'Adicionar', subtract: 'Subtrair', from: 'De', to: 'Para',
        financeCalculator: 'Calculadora Financeira', price: 'Preço', taxRate: 'Taxa de Imposto (%)', discountRate: 'Taxa de Desconto (%)', finalPrice: 'Preço Final', taxAmount: 'Valor do Imposto', discountAmount: 'Valor do Desconto', salePrice: 'Preço de Venda', discountFirst: 'Desconto Primeiro', taxFirst: 'Imposto Primeiro',
        bmiCalculator: 'Calculadora IMC', weight: 'Peso (kg)', height: 'Altura (cm)', bmiScore: 'Índice IMC', underweight: 'Abaixo do peso', normal: 'Normal', overweight: 'Sobrepeso', obese: 'Obeso',
        gender: 'Gênero', male: 'Masculino', female: 'Femenino',
        mode_calculator: 'Calculadora', mode_converter: 'Conversor', mode_date: 'Data', mode_finance: 'Finanças', mode_bmi: 'IMC',
        toggle_basic: 'Bás.', toggle_scientific: 'Cient.', toggle_diff: 'Dif', toggle_add: 'Adic.', toggle_convert: 'Conv',
        customThemeSettings: 'Configurações de Tema Personalizado', primaryColor: 'Cor Primária', secondaryColor: 'Cor Secundária',
        calendarConverter: 'Conversor de Calendário', inputDate: 'Selecionar Data', selectCalendar: 'Tipo de Calendário',
        calendar_gregorian: 'Gregoriano', calendar_hijri: 'Hijri', calendar_rumi: 'Rumi',
        calendar_julian: 'Juliano', calendar_persian: 'Persa', calendar_hebrew: 'Hebraico', calendar_chinese: 'Chinês', calendar_mayan: 'Maia'
    },
    ja: {
        // ... previous translations ...
        historyTitle: '計算履歴', settingsTitle: '設定', noHistory: '計算履歴はありません。', clearHistory: '履歴を消去', appearance: '外観', darkMode: 'ダークモード', themeMode: 'テーマモード', system: 'システム', light: 'ライト', dark: 'ダーク', glassmorphism: 'グラスモーフィズム', blur: 'ぼかし', opacity: '不透明度', language: '言語', about: '情報', appVersion: 'アプリバージョン', close: '閉じる', 
        unitSelectionTitle: '{category}の単位', 
        unit_Length: '長さ', unit_Weight: '重さ', unit_Volume: '体積', unit_Speed: '速度', unit_Temperature: '温度', unit_Currency: '通貨', unit_Time: '時間単位',
        unit_Kilometer: 'キロメートル', unit_Meter: 'メートル', unit_Centimeter: 'センチメートル', unit_Millimeter: 'ミリメートル', unit_Mile: 'マイル', unit_Yard: 'ヤード', unit_Foot: 'フィート', unit_Inch: 'インチ', 
        unit_Tonne: 'トン', unit_Kilogram: 'キログラム', unit_Gram: 'グラム', unit_Milligram: 'ミリグラム', unit_Pound: 'ポンド', unit_Ounce: 'オンス', 
        unit_Liter: 'リットル', unit_Milliliter: 'ミリリットル', unit_CubicMeter: '立方メートル', unit_CubicCentimeter: '立方センチメートル', unit_Gallon: 'ガロン', unit_Quart: 'クォート', 
        unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'マイル/時', 
        unit_Celsius: '摂氏', unit_Fahrenheit: '華氏', unit_Kelvin: 'ケルビン', 
        unit_USD: '米ドル', unit_EUR: 'ユーロ', unit_TRY: 'トルコリラ', unit_GBP: '英ポンド', unit_JPY: '日本円', unit_CAD: 'カナダドル', unit_AUD: '豪ドル', unit_RUB: 'ロシアルーブル', unit_CNY: '中国元',
        unit_Year: '年', unit_Month: '月', unit_Week: '週', unit_Day: '日', unit_Hour: '時間', unit_Minute: '分', unit_Second: '秒', unit_Millisecond: 'ミリ秒',
        colorTheme: 'カラーテーマ',
        dateCalculator: '日付計算機', dateDifference: '日付の差', addSubtractDate: '日付の加算/減算', startDate: '開始日', endDate: '終了日', years: '年', months: '月', days: '日', calculate: '計算する', result: '結果', operation: '操作', add: '追加', subtract: '減算', from: 'から', to: 'まで',
        financeCalculator: '金融電卓', price: '価格', taxRate: '税率 (%)', discountRate: '割引率 (%)', finalPrice: '最終価格', taxAmount: '税額', discountAmount: '割引額', salePrice: '販売価格', discountFirst: '割引優先', taxFirst: '税優先',
        bmiCalculator: 'BMI計算機', weight: '体重 (kg)', height: '身長 (cm)', bmiScore: 'BMIスコア', underweight: '低体重', normal: '標準', overweight: '過体重', obese: '肥満',
        gender: '性別', male: '男性', female: '女性',
        mode_calculator: '電卓', mode_converter: 'コンバーター', mode_date: '日付', mode_finance: '金融', mode_bmi: 'BMI',
        toggle_basic: '基本', toggle_scientific: '関数', toggle_diff: '差分', toggle_add: '加算', toggle_convert: '変換',
        customThemeSettings: 'カスタムテーマ設定', primaryColor: 'メインカラー', secondaryColor: 'サブカラー',
        calendarConverter: 'カレンダー変換', inputDate: '日付を選択', selectCalendar: 'カレンダータイプ',
        calendar_gregorian: 'グレゴリオ暦', calendar_hijri: 'ヒジュラ暦', calendar_rumi: 'ルーミー暦',
        calendar_julian: 'ユリウス暦', calendar_persian: 'ペルシャ暦', calendar_hebrew: 'ユダヤ暦', calendar_chinese: '中国暦', calendar_mayan: 'マヤ暦'
    },
    ru: {
        // ... previous translations ...
        historyTitle: 'История вычислений', settingsTitle: 'Настройки', noHistory: 'Вычислений пока нет.', clearHistory: 'Очистить историю', appearance: 'Внешний вид', darkMode: 'Темный режим', themeMode: 'Режим темы', system: 'Система', light: 'Светлый', dark: 'Темный', glassmorphism: 'Стекломорфизм', blur: 'Размытие', opacity: 'Непрозрачность', language: 'Язык', about: 'О приложении', appVersion: 'Версия приложения', close: 'Закрыть', 
        unitSelectionTitle: 'Единицы {category}', 
        unit_Length: 'Длина', unit_Weight: 'Вес', unit_Volume: 'Объем', unit_Speed: 'Скорость', unit_Temperature: 'Температура', unit_Currency: 'Валюта', unit_Time: 'Единицы времени',
        unit_Kilometer: 'Километр', unit_Meter: 'Метр', unit_Centimeter: 'Сантиметр', unit_Millimeter: 'Миллиметр', unit_Mile: 'Миля', unit_Yard: 'Ярд', unit_Foot: 'Фут', unit_Inch: 'Дюйм', 
        unit_Tonne: 'Тонна', unit_Kilogram: 'Килограмм', unit_Gram: 'Грамм', unit_Milligram: 'Миллиграмм', unit_Pound: 'Фунт', unit_Ounce: 'Унция', 
        unit_Liter: 'Литр', unit_Milliliter: 'Миллилитр', unit_CubicMeter: 'Кубический метр', unit_CubicCentimeter: 'Кубический сантиметр', unit_Gallon: 'Галлон', unit_Quart: 'Кварта', 
        unit_Kps: 'km/s', unit_Mps: 'm/s', unit_Kph: 'km/h', unit_Mph: 'mph', 
        unit_Celsius: 'Celsius', unit_Fahrenheit: 'Fahrenheit', unit_Kelvin: 'Кельвин', 
        unit_USD: 'Доллар США', unit_EUR: 'Евро', unit_TRY: 'Турецкая лира', unit_GBP: 'Фунт стерлингов', unit_JPY: 'Японская иена', unit_CAD: 'Канадский доллар', unit_AUD: 'Австралийский доллар', unit_RUB: 'Российский рубль', unit_CNY: 'Китайский юань',
        unit_Year: 'Год', unit_Month: 'Месяц', unit_Week: 'Неделя', unit_Day: 'День', unit_Hour: 'Час', unit_Minute: 'Минута', unit_Second: 'Секунда', unit_Millisecond: 'Миллисекунда',
        colorTheme: 'Цветовая тема',
        dateCalculator: 'Калькулятор дат', dateDifference: 'Разница дат', addSubtractDate: 'Прибавить/Вычесть дату', startDate: 'Дата начала', endDate: 'Дата окончания', years: 'Лет', months: 'Месяцев', days: 'Дней', calculate: 'Рассчитать', result: 'Результат', operation: 'Операция', add: 'Прибавить', subtract: 'Вычесть', from: 'От', to: 'До',
        financeCalculator: 'Финансовый калькулятор', price: 'Цена', taxRate: 'Налоговая ставка (%)', discountRate: 'Ставка дисконтирования (%)', finalPrice: 'Конечная цена', taxAmount: 'Сумма налога', discountAmount: 'Сумма скидки', salePrice: 'Цена продажи', discountFirst: 'Сначала скидка', taxFirst: 'Сначала налог',
        bmiCalculator: 'BMI Калькулятор', weight: 'Вес (kg)', height: 'Рост (cm)', bmiScore: 'ИМТ', underweight: 'Недостаточный вес', normal: 'Норма', overweight: 'Избыточный вес', obese: 'Ожирение',
        gender: 'Пол', male: 'Мужской', female: 'Женский',
        mode_calculator: 'Калькулятор', mode_converter: 'Конвертер', mode_date: 'Дата', mode_finance: 'Финансы', mode_bmi: 'ИМТ',
        toggle_basic: 'Баз.', toggle_scientific: 'Науч', toggle_diff: 'Разн', toggle_add: 'Доб.', toggle_convert: 'Конв',
        customThemeSettings: 'Настройки пользовательской темы', primaryColor: 'Основной цвет', secondaryColor: 'Вторичный цвет',
        calendarConverter: 'Конвертер календарей', inputDate: 'Выбрать дату', selectCalendar: 'Тип календаря',
        calendar_gregorian: 'Григорианский', calendar_hijri: 'Хиджра', calendar_rumi: 'Руми',
        calendar_julian: 'Юлианский', calendar_persian: 'Персидский', calendar_hebrew: 'Еврейский', calendar_chinese: 'Китайский', calendar_mayan: 'Майя'
    }
};

export const nativeLanguageNames: Record<Language, string> = {
    tr: 'Türkçe 🇹🇷',
    en: 'English 🇬🇧',
    es: 'Español 🇪🇸',
    de: 'Deutsch 🇩🇪',
    fr: 'Français 🇫🇷',
    it: 'Italiano 🇮🇹',
    pt: 'Português 🇵🇹',
    ja: '日本語 🇯🇵',
    ru: 'Русский 🇷🇺',
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'tr');

     useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = useCallback((key: TranslationKey, replacements?: Record<string, string>): string => {
        let translation = (translations[language] as any)[key] || translations.tr[key];
        if (replacements) {
            Object.entries(replacements).forEach(([placeholder, value]) => {
                translation = translation.replace(`{${placeholder}}`, value);
            });
        }
        return translation;
    }, [language]);

    const languageContextValue = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

    return (
        <LanguageContext.Provider value={languageContextValue}>
            {children}
        </LanguageContext.Provider>
    );
};
