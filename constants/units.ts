
import { UnitData } from '../types';

export const conversionData: UnitData = {
    Currency: { 
        icon: 'currency_exchange', 
        units: { 
            USD: 1, 
            EUR: 1.09, 
            TRY: 0.029, 
            GBP: 1.30, 
            JPY: 0.0065,
            CAD: 0.73,
            AUD: 0.65,
            RUB: 0.011,
            CNY: 0.14
        }, 
        baseUnit: 'USD' 
    },
    Length: { icon: 'straighten', units: { Kilometer: 1000, Meter: 1, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.34, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 }, baseUnit: 'Meter' },
    Weight: { icon: 'weight', units: { Tonne: 1000, Kilogram: 1, Gram: 0.001, Milligram: 0.000001, Pound: 0.453592, Ounce: 0.0283495 }, baseUnit: 'Kilogram' },
    Volume: { icon: 'science', units: { Liter: 1, Milliliter: 0.001, CubicMeter: 1000, CubicCentimeter: 0.001, Gallon: 3.78541, Quart: 0.946353 }, baseUnit: 'Liter' },
    Speed: { icon: 'speed', units: { Kps: 1000, Mps: 1, Kph: 0.277778, Mph: 0.44704 }, baseUnit: 'Mps' },
    Temperature: { icon: 'thermostat', units: { Celsius: 0, Fahrenheit: 0, Kelvin: 0 }, baseUnit: 'Celsius' },
    Time: { 
        icon: 'schedule', 
        units: { 
            Year: 31536000, 
            Month: 2592000, 
            Week: 604800, 
            Day: 86400, 
            Hour: 3600, 
            Minute: 60, 
            Second: 1, 
            Millisecond: 0.001 
        }, 
        baseUnit: 'Second' 
    }
};
