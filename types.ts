
export enum View {
  CALCULATOR,
  HISTORY,
  SETTINGS,
}

export type AppMode = 'calculator' | 'converter' | 'date' | 'finance' | 'bmi';

export type DateMode = 'diff' | 'addsub' | 'convert';

export interface HistoryEntry {
  expression: string;
  result: string;
}

export type UnitCategoryKey = 'Length' | 'Temperature' | 'Weight' | 'Volume' | 'Speed' | 'Currency' | 'Time';

export interface ConversionRates {
  [key: string]: number;
}

export type UnitData = {
  [key in UnitCategoryKey]: {
      icon: string;
      units: ConversionRates;
      baseUnit: string;
  };
};

export type Language = 'tr' | 'en' | 'es' | 'de' | 'fr' | 'it' | 'pt' | 'ja' | 'ru';

export type TranslationKey =
  | 'historyTitle'
  | 'settingsTitle'
  | 'noHistory'
  | 'clearHistory'
  | 'appearance'
  | 'darkMode'
  | 'themeMode'
  | 'system'
  | 'light'
  | 'dark'
  | 'glassmorphism'
  | 'blur'
  | 'opacity'
  | 'language'
  | 'about'
  | 'appVersion'
  | 'close'
  | 'unitSelectionTitle'
  | 'colorTheme'
  | 'unit_Length'
  | 'unit_Weight'
  | 'unit_Volume'
  | 'unit_Speed'
  | 'unit_Temperature'
  | 'unit_Currency'
  | 'unit_Time'
  | 'unit_Kilometer'
  | 'unit_Meter'
  | 'unit_Centimeter'
  | 'unit_Millimeter'
  | 'unit_Mile'
  | 'unit_Yard'
  | 'unit_Foot'
  | 'unit_Inch'
  | 'unit_Tonne'
  | 'unit_Kilogram'
  | 'unit_Gram'
  | 'unit_Milligram'
  | 'unit_Pound'
  | 'unit_Ounce'
  | 'unit_Liter'
  | 'unit_Milliliter'
  | 'unit_CubicMeter'
  | 'unit_CubicCentimeter'
  | 'unit_Gallon'
  | 'unit_Quart'
  | 'unit_Kps'
  | 'unit_Mps'
  | 'unit_Kph'
  | 'unit_Mph'
  | 'unit_Celsius'
  | 'unit_Fahrenheit'
  | 'unit_Kelvin'
  | 'unit_USD'
  | 'unit_EUR'
  | 'unit_TRY'
  | 'unit_GBP'
  | 'unit_JPY'
  | 'unit_CAD'
  | 'unit_AUD'
  | 'unit_RUB'
  | 'unit_CNY'
  | 'unit_Year'
  | 'unit_Month'
  | 'unit_Week'
  | 'unit_Day'
  | 'unit_Hour'
  | 'unit_Minute'
  | 'unit_Second'
  | 'unit_Millisecond'
  | 'dateCalculator'
  | 'dateDifference'
  | 'addSubtractDate'
  | 'startDate'
  | 'endDate'
  | 'years'
  | 'months'
  | 'days'
  | 'calculate'
  | 'result'
  | 'operation'
  | 'add'
  | 'subtract'
  | 'from'
  | 'to'
  | 'financeCalculator'
  | 'price'
  | 'taxRate'
  | 'discountRate'
  | 'finalPrice'
  | 'taxAmount'
  | 'discountAmount'
  | 'salePrice'
  | 'discountFirst'
  | 'taxFirst'
  | 'bmiCalculator'
  | 'weight'
  | 'height'
  | 'bmiScore'
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese'
  | 'gender'
  | 'male'
  | 'female'
  | 'mode_calculator'
  | 'mode_converter'
  | 'mode_date'
  | 'mode_finance'
  | 'mode_bmi'
  | 'toggle_basic'
  | 'toggle_scientific'
  | 'toggle_diff'
  | 'toggle_add'
  | 'toggle_convert'
  | 'customThemeSettings'
  | 'primaryColor'
  | 'secondaryColor'
  | 'calendarConverter'
  | 'inputDate'
  | 'selectCalendar'
  | 'calendar_gregorian'
  | 'calendar_hijri'
  | 'calendar_rumi'
  | 'calendar_julian'
  | 'calendar_persian'
  | 'calendar_hebrew'
  | 'calendar_chinese'
  | 'calendar_mayan';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeName = 'default' | 'ocean' | 'sunset' | 'forest' | 'graphite' | 'sakura' | 'matrix' | 'royal' | 'mocha' | 'mint' | 'lavender' | 'ruby' | 'custom';

export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  keypad: string;
  'number-key': string;
  text: string;
  'text-muted': string;
  'text-on-primary': string;
  'text-on-secondary': string;
}

export interface Theme {
  light: ColorPalette;
  dark: ColorPalette;
}

export interface Themes {
  [key: string]: Theme;
}
