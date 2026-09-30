import { ref } from 'vue'

export type TargetCurrency = 'LOCAL' | 'USD' | 'EUR' | 'INR' | 'GBP'

import macroLive from '~/data/generated/macro_live.json'

// Exchange rates relative to USD (1 USD = X target currency)
const fxToUSD: Record<string, number> = {
  USD: 1.0,
  EUR: 0.90,
  GBP: 0.75,
  INR: 83.75,
  JPY: 143.50,
  HKD: 7.78,
  CNY: 7.02,
  CAD: 1.35,
  BRL: 5.45,
  AUD: 1.46,
  SAR: 3.75,
  ZAR: 17.40
}

// Overlay live ECB reference rates if available
if (macroLive && macroLive.fxRates) {
  Object.assign(fxToUSD, macroLive.fxRates)
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  HKD: 'HK$',
  CNY: '¥',
  CAD: 'CA$',
  BRL: 'R$',
  AUD: 'A$',
  SAR: 'SAR ',
  ZAR: 'R '
}

// Global reactive currency state
const selectedCurrency = ref<TargetCurrency>('LOCAL')

export function useCurrencyConverter() {
  function setCurrency(curr: TargetCurrency) {
    selectedCurrency.value = curr
  }

  function convertValue(amount: number, fromCurrency: string, targetOverride?: TargetCurrency): { value: number; formatted: string; symbol: string; code: string } {
    const target = targetOverride || selectedCurrency.value

    if (target === 'LOCAL' || target === fromCurrency) {
      const sym = currencySymbols[fromCurrency] || ''
      return {
        value: amount,
        formatted: formatNumber(amount),
        symbol: sym,
        code: fromCurrency
      }
    }

    // Convert from Currency -> USD -> Target Currency
    const rateFromUSD = fxToUSD[fromCurrency] || 1.0
    const valueInUSD = amount / rateFromUSD
    const rateTargetFromUSD = fxToUSD[target] || 1.0
    const converted = valueInUSD * rateTargetFromUSD

    const sym = currencySymbols[target] || ''
    return {
      value: converted,
      formatted: formatNumber(converted),
      symbol: sym,
      code: target
    }
  }

  function formatNumber(num: number): string {
    if (num >= 10000) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } else if (num >= 1000) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } else {
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }

  return {
    selectedCurrency,
    setCurrency,
    convertValue,
    formatNumber,
    availableCurrencies: ['LOCAL', 'USD', 'EUR', 'INR', 'GBP'] as TargetCurrency[]
  }
}
