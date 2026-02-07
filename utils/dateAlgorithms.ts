
// --- CALENDAR ALGORITHMS ---

// 1. JULIAN DAY NUMBER (JDN) UTILITIES
export const gregorianToJdn = (y: number, m: number, d: number) => {
    let year = y;
    let month = m + 1;
    let day = d;
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
};

export const jdnToGregorian = (jdn: number) => {
    const Z = Math.floor(jdn + 0.5);
    const W = Math.floor((Z - 1867216.25) / 36524.25);
    const X = Math.floor(W / 4);
    const A = Z + 1 + W - X;
    const B = A + 1524;
    const C = Math.floor((B - 122.1) / 365.25);
    const D = Math.floor(365.25 * C);
    const E = Math.floor((B - D) / 30.6001);
    const day = B - D - Math.floor(30.6001 * E);
    let month = E - 1;
    if (month > 12) month -= 12;
    let year = C - 4715;
    if (month > 2) year -= 1;
    return new Date(year, month - 1, day);
};

// 2. JULIAN CALENDAR
export const julianToJdn = (y: number, m: number, d: number) => {
    let year = y;
    let month = m + 1;
    if (month <= 2) {
        year--;
        month += 12;
    }
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + d - 1524.5;
};

export const jdnToJulian = (jdn: number) => {
    const z = Math.floor(jdn + 0.5);
    const a = z + 1524;
    const b = Math.floor((a - 122.1) / 365.25);
    const c = Math.floor(365.25 * b);
    const d = Math.floor((a - c) / 30.6001);
    const day = a - c - Math.floor(30.6001 * d);
    let month = d - 1;
    if (month > 12) month -= 12;
    let year = b - 4715;
    if (month > 2) year--;
    return { year, month: month - 1, day };
};

// 4. HIJRI (Tabular)
export const g2h = (dt: Date) => {
    const jdn = gregorianToJdn(dt.getFullYear(), dt.getMonth(), dt.getDate());
    let iyear = 10631.0 / 30.0;
    let epochastro = 1948084;
    let shift1 = 8.01 / 60.0;
    let zz = jdn - epochastro;
    let ccyc = Math.floor(zz / 10631.0);
    zz = zz - 10631 * ccyc;
    let j = Math.floor((zz - shift1) / iyear);
    let iy = 30 * ccyc + j;
    zz = zz - Math.floor(j * iyear + shift1);
    let im = Math.floor((zz + 28.5001) / 29.5);
    if (im === 13) im = 12;
    let id = zz - Math.floor(29.5 * im - 29.001);
    return { year: iy, month: im - 1, day: Math.floor(id) };
};

export const h2g = (year: number, month: number, day: number) => {
    let iy = year;
    let im = month + 1; 
    let id = day;
    let ii = iy - 1;
    let iyear = 10631.0 / 30.0;
    let epochastro = 1948084;
    let jd = 1 + Math.floor((11 * ii + 3) / 30) + 354 * ii + 30 * (im - 1) - Math.floor((im - 1) / 2) + id + epochastro - 1;
    return jdnToGregorian(jd);
};

// 5. MAYAN LONG COUNT
export const jdnToMayan = (jdn: number) => {
    const mayanEpoch = 584283; 
    let days = Math.floor(jdn - mayanEpoch);
    const baktun = Math.floor(days / 144000);
    days %= 144000;
    const katun = Math.floor(days / 7200);
    days %= 7200;
    const tun = Math.floor(days / 360);
    days %= 360;
    const uinal = Math.floor(days / 20);
    const kin = Math.floor(days % 20);
    return `${baktun}.${katun}.${tun}.${uinal}.${kin}`;
};

export const jdnToMayanParts = (jdn: number) => {
    const mayanEpoch = 584283; 
    let days = Math.floor(jdn - mayanEpoch);
    const baktun = Math.floor(days / 144000);
    days %= 144000;
    const katun = Math.floor(days / 7200);
    days %= 7200;
    const tun = Math.floor(days / 360);
    // For 3-column input, we typically ignore Uinal/Kin or return them for display
    return { baktun, katun, tun };
};

// 6. RUMI
export const rumiToGregorian = (y: number, m: number, d: number) => {
    const julianYear = y + 584;
    const julianJdn = julianToJdn(julianYear, m, d);
    return jdnToGregorian(julianJdn);
};

// --- DATA LISTS ---

export const HIJRI_MONTHS = [
    "Muharram", "Safar", "Rabi' al-awwal", "Rabi' al-thani", "Jumada al-awwal", "Jumada al-thani", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qidah", "Dhu al-Hijjah"
];

export const PERSIAN_MONTHS = [
    "Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"
];

// Typical Civil Hebrew Months (Tishri first). Note: Adar/Adar I/Adar II complexity handled simplistically here for UI
export const HEBREW_MONTHS = [
    "Tishri", "Heshvan", "Kislev", "Tevet", "Shevat", "Adar I", "Adar II", "Nisan", "Iyar", "Sivan", "Tamuz", "Av", "Elul"
];
