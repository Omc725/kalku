
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { formatNumber } from '../utils';

export const useFinanceCalculator = () => {
    const [price, setPrice] = useState<string>('');
    const [discount, setDiscount] = useState<string>('');
    const [tax, setTax] = useState<string>('');
    const [activeInput, setActiveInput] = useState<'price' | 'discount' | 'tax'>('price');
    const [calcOrder, setCalcOrder] = useState<'discountFirst' | 'taxFirst'>('discountFirst');

    const [finalPrice, setFinalPrice] = useState<string>('0');
    const [discountAmount, setDiscountAmount] = useState<string>('0');
    const [taxAmount, setTaxAmount] = useState<string>('0');

    useEffect(() => {
        const p = parseFloat(price) || 0;
        const d = parseFloat(discount) || 0;
        const tx = parseFloat(tax) || 0;

        let discAmt = 0;
        let taxAmt = 0;
        let final = 0;

        if (calcOrder === 'discountFirst') {
            // Standard: Discount first, then tax on discounted price
            discAmt = p * (d / 100);
            const saleP = p - discAmt;
            taxAmt = saleP * (tx / 100);
            final = saleP + taxAmt;
        } else {
            // Tax first, then discount (usually implies discount on taxed price or tax on original price)
            // Interpret as: Tax on original price, then Discount on (Price + Tax)
            taxAmt = p * (tx / 100);
            const priceWithTax = p + taxAmt;
            discAmt = priceWithTax * (d / 100);
            final = priceWithTax - discAmt;
        }

        setDiscountAmount(discAmt.toFixed(2));
        setTaxAmount(taxAmt.toFixed(2));
        setFinalPrice(final.toFixed(2));
    }, [price, discount, tax, calcOrder]);

    const handlePadClick = (value: string) => {
        const setMap = {
            'price': setPrice,
            'discount': setDiscount,
            'tax': setTax
        };
        const currentVal = { price, discount, tax }[activeInput];
        const setter = setMap[activeInput];

        if (value === 'backspace') {
            setter(prev => prev.length > 0 ? prev.slice(0, -1) : '');
        } else if (value === 'AC') {
            setPrice('');
            setDiscount('');
            setTax('');
        } else if (value === '.') {
            if (!currentVal.includes('.')) setter(prev => prev + '.');
        } else if (value >= '0' && value <= '9') {
            setter(prev => prev + value);
        }
    };

    return {
        price, setPrice,
        discount, setDiscount,
        tax, setTax,
        activeInput, setActiveInput,
        finalPrice, discountAmount, taxAmount,
        handlePadClick,
        calcOrder, setCalcOrder
    };
};

export const FinanceCalculatorView: React.FC<{ logic: ReturnType<typeof useFinanceCalculator> }> = ({ logic }) => {
    const { t } = useLanguage();
    const {
        price, discount, tax, activeInput, setActiveInput,
        finalPrice, discountAmount, taxAmount
    } = logic;

    const inputClass = "w-full rounded-3xl bg-surface p-5 text-xl outline-none ring-1 ring-text-color/10 transition-all text-right font-mono caret-primary h-full flex items-center justify-end shadow-sm";
    const activeInputClass = "ring-2 ring-primary bg-background shadow-md";
    const labelClass = "mb-2 block text-xs font-bold text-text-muted uppercase tracking-wider pl-2";

    return (
        <div className="flex-1 overflow-hidden p-6 flex flex-col h-full w-full">
            <div className="flex-1 flex flex-col gap-5 min-h-0">
                <div className="flex flex-col flex-1 min-h-0">
                    <div className="flex justify-between items-center mb-1">
                        <label className={labelClass} onClick={() => setActiveInput('price')}>{t('price')}</label>
                    </div>
                    <div onClick={() => setActiveInput('price')} className="flex-1 relative">
                         <input readOnly type="text" value={price} placeholder="0" className={`${inputClass} ${activeInput === 'price' ? activeInputClass : ''} cursor-pointer transition-colors duration-200 absolute inset-0 text-3xl`} />
                    </div>
                </div>
                
                <div className="flex gap-4 h-28 shrink-0">
                    <div className="flex-1 flex flex-col" onClick={() => setActiveInput('discount')}>
                        <label className={labelClass}>{t('discountRate')}</label>
                        <div className="flex-1 relative">
                            <input readOnly type="text" value={discount} placeholder="0" className={`${inputClass} ${activeInput === 'discount' ? activeInputClass : ''} cursor-pointer transition-colors duration-200 absolute inset-0`} />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col" onClick={() => setActiveInput('tax')}>
                        <label className={labelClass}>{t('taxRate')}</label>
                        <div className="flex-1 relative">
                            <input readOnly type="text" value={tax} placeholder="0" className={`${inputClass} ${activeInput === 'tax' ? activeInputClass : ''} cursor-pointer transition-colors duration-200 absolute inset-0`} />
                        </div>
                    </div>
                </div>

                <div className="rounded-[2rem] bg-surface p-6 space-y-3 shadow-lg shrink-0 mt-auto border border-white/5">
                    <div className="flex justify-between items-center pb-3 border-b border-text-color/10">
                        <span className="text-text-muted text-sm font-bold uppercase tracking-wide">{t('finalPrice')}</span>
                        <span className="text-3xl font-bold text-primary">{formatNumber(finalPrice)}</span>
                    </div>
                    <div className="space-y-2 text-sm pt-2">
                        <div className="flex justify-between text-text-muted">
                            <span>{t('discountAmount')}</span>
                            <span className="font-mono text-text-color font-bold">- {formatNumber(discountAmount)}</span>
                        </div>
                        <div className="flex justify-between text-text-muted">
                            <span>{t('taxAmount')}</span>
                            <span className="font-mono text-text-color font-bold">+ {formatNumber(taxAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FinanceCalculator: React.FC = () => {
    const logic = useFinanceCalculator();
    return (
        <div className="flex h-full flex-col">
            <FinanceCalculatorView logic={logic} />
        </div>
    );
};

export default FinanceCalculator;
