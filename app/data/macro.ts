export interface CentralBankInfo {
  id: string
  name: string
  country: string
  flag: string
  policyRate: number
  previousRate: number
  lastChange: string
  nextMeetingDate: string
  monetaryStance: 'Aggressive Easing' | 'Gradual Easing' | 'Restrictive Hold' | 'Hawkish Normalization' | 'Hawkish Tightening'
  inflationTarget: string
  currentInflation: number
  tenYearYield: number
  realYield: number
  description: string
}

export interface IndexMacroProfile {
  indexId: string
  indexName: string
  flag: string
  currency: string
  policyRate: number
  tenYearYield: number
  cpiInflation: number
  realYield: number
  peRatio: number
  earningsYield: number
  equityRiskPremium: number
  erpRating: 'Equities Highly Attractive' | 'Moderate Equity Premium' | 'Tight / Debt Favorable' | 'Negative Premium (Overvalued)'
  fxVsUSD_1Y: number // % change in currency vs USD over 1Y
  localReturn1Y: number
  usdAdjustedReturn1Y: number
  fxDragBoostPercent: number
  rebalanceSchedule: {
    frequency: 'Quarterly' | 'Semi-Annually' | 'Annually'
    reviewMonths: string[]
    nextReconstitution: string
    cappingRule: string
    bufferRule: string
  }
}

export const centralBanks: CentralBankInfo[] = [
  {
    id: 'fed',
    name: 'Federal Reserve (Fed)',
    country: 'United States',
    flag: '🇺🇸',
    policyRate: 4.875,
    previousRate: 5.375,
    lastChange: '-50 bps (Sep 2024)',
    nextMeetingDate: 'Nov 07, 2024',
    monetaryStance: 'Gradual Easing',
    inflationTarget: '2.0%',
    currentInflation: 2.5,
    tenYearYield: 4.28,
    realYield: 1.78,
    description: 'Began policy easing cycle with a 50 bps reduction, recalibrating rates toward a neutral estimate around 3.0%.'
  },
  {
    id: 'ecb',
    name: 'European Central Bank (ECB)',
    country: 'Eurozone',
    flag: '🇪🇺',
    policyRate: 3.25,
    previousRate: 3.50,
    lastChange: '-25 bps (Oct 2024)',
    nextMeetingDate: 'Dec 12, 2024',
    monetaryStance: 'Gradual Easing',
    inflationTarget: '2.0%',
    currentInflation: 1.8,
    tenYearYield: 2.38,
    realYield: 0.58,
    description: 'Consecutive rate cuts responding to disinflation below 2% and sluggish manufacturing activity across Germany.'
  },
  {
    id: 'rbi',
    name: 'Reserve Bank of India (RBI)',
    country: 'India',
    flag: '🇮🇳',
    policyRate: 6.50,
    previousRate: 6.50,
    lastChange: 'Unchanged (Neutral stance shifted)',
    nextMeetingDate: 'Dec 06, 2024',
    monetaryStance: 'Restrictive Hold',
    inflationTarget: '4.0% (±2%)',
    currentInflation: 4.8,
    tenYearYield: 6.82,
    realYield: 2.02,
    description: 'Maintained benchmark repo rate at 6.50% while shifting stance to Neutral, balancing rapid 7%+ GDP growth against food inflation.'
  },
  {
    id: 'boj',
    name: 'Bank of Japan (BoJ)',
    country: 'Japan',
    flag: '🇯🇵',
    policyRate: 0.25,
    previousRate: 0.10,
    lastChange: '+15 bps (Jul 2024)',
    nextMeetingDate: 'Oct 31, 2024',
    monetaryStance: 'Hawkish Normalization',
    inflationTarget: '2.0%',
    currentInflation: 2.8,
    tenYearYield: 0.95,
    realYield: -1.85,
    description: 'Exited negative interest rate policy (NIRP) and yield curve control, pursuing gradual tightening as wage growth takes root.'
  },
  {
    id: 'boe',
    name: 'Bank of England (BoE)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    policyRate: 5.00,
    previousRate: 5.25,
    lastChange: '-25 bps (Aug 2024)',
    nextMeetingDate: 'Nov 07, 2024',
    monetaryStance: 'Gradual Easing',
    inflationTarget: '2.0%',
    currentInflation: 2.2,
    tenYearYield: 4.22,
    realYield: 2.02,
    description: 'Commenced policy normalization as headline CPI cooled, monitoring sticky services inflation and wage pressure.'
  },
  {
    id: 'pboc',
    name: "People's Bank of China (PBoC)",
    country: 'China',
    flag: '🇨🇳',
    policyRate: 3.10,
    previousRate: 3.35,
    lastChange: '-25 bps (Oct 2024)',
    nextMeetingDate: 'Nov 20, 2024',
    monetaryStance: 'Aggressive Easing',
    inflationTarget: '3.0%',
    currentInflation: 0.4,
    tenYearYield: 2.14,
    realYield: 1.74,
    description: 'Delivered landmark stimulus bazooka including reserve requirement ratio (RRR) cuts, mortgage rate cuts, and equity liquidity swaps.'
  },
  {
    id: 'boc',
    name: 'Bank of Canada (BoC)',
    country: 'Canada',
    flag: '🇨🇦',
    policyRate: 3.75,
    previousRate: 4.25,
    lastChange: '-50 bps (Oct 2024)',
    nextMeetingDate: 'Dec 11, 2024',
    monetaryStance: 'Aggressive Easing',
    inflationTarget: '2.0%',
    currentInflation: 1.6,
    tenYearYield: 3.25,
    realYield: 1.65,
    description: 'Accelerated rate cuts with a jumbo 50 bps reduction after inflation dipped below the 2% midpoint target.'
  },
  {
    id: 'rba',
    name: 'Reserve Bank of Australia (RBA)',
    country: 'Australia',
    flag: '🇦🇺',
    policyRate: 4.35,
    previousRate: 4.35,
    lastChange: 'Unchanged (Nov 2023)',
    nextMeetingDate: 'Nov 05, 2024',
    monetaryStance: 'Restrictive Hold',
    inflationTarget: '2-3%',
    currentInflation: 3.8,
    tenYearYield: 4.42,
    realYield: 0.62,
    description: 'Holding policy restrictive due to persistent underlying inflation and tight domestic labor conditions.'
  },
  {
    id: 'bcb',
    name: 'Banco Central do Brasil (BCB)',
    country: 'Brazil',
    flag: '🇧🇷',
    policyRate: 10.75,
    previousRate: 10.50,
    lastChange: '+25 bps (Sep 2024)',
    nextMeetingDate: 'Nov 06, 2024',
    monetaryStance: 'Hawkish Tightening',
    inflationTarget: '3.0%',
    currentInflation: 4.4,
    tenYearYield: 12.35,
    realYield: 7.95,
    description: 'Resumed interest rate hikes (Copom) to anchor fiscal risk expectations and counter currency depreciation.'
  },
  {
    id: 'sama',
    name: 'Saudi Central Bank (SAMA)',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    policyRate: 5.50,
    previousRate: 6.00,
    lastChange: '-50 bps (Sep 2024)',
    nextMeetingDate: 'Nov 07, 2024',
    monetaryStance: 'Gradual Easing',
    inflationTarget: '2.0%',
    currentInflation: 1.7,
    tenYearYield: 4.95,
    realYield: 3.25,
    description: 'Maintains fixed currency peg to the US Dollar, matching Federal Reserve policy moves in lockstep.'
  },
  {
    id: 'sarb',
    name: 'South African Reserve Bank (SARB)',
    country: 'South Africa',
    flag: '🇿🇦',
    policyRate: 8.00,
    previousRate: 8.25,
    lastChange: '-25 bps (Sep 2024)',
    nextMeetingDate: 'Nov 21, 2024',
    monetaryStance: 'Gradual Easing',
    inflationTarget: '3-6%',
    currentInflation: 4.4,
    tenYearYield: 10.15,
    realYield: 5.75,
    description: 'Enacted first policy rate cut in four years following rand appreciation and moderating food inflation.'
  }
]

export const indexMacroProfiles: IndexMacroProfile[] = [
  {
    indexId: 'sp500',
    indexName: 'S&P 500',
    flag: '🇺🇸',
    currency: 'USD',
    policyRate: 4.88,
    tenYearYield: 4.28,
    cpiInflation: 2.5,
    realYield: 1.78,
    peRatio: 27.8,
    earningsYield: 3.60,
    equityRiskPremium: -0.68,
    erpRating: 'Negative Premium (Overvalued)',
    fxVsUSD_1Y: 0.0,
    localReturn1Y: 28.4,
    usdAdjustedReturn1Y: 28.4,
    fxDragBoostPercent: 0.0,
    rebalanceSchedule: {
      frequency: 'Quarterly',
      reviewMonths: ['March', 'June', 'September', 'December'],
      nextReconstitution: 'Third Friday of December',
      cappingRule: 'None (Modified cap for tech peers)',
      bufferRule: 'Index Committee discretion on profitability criteria'
    }
  },
  {
    indexId: 'nasdaq100',
    indexName: 'Nasdaq 100',
    flag: '🇺🇸',
    currency: 'USD',
    policyRate: 4.88,
    tenYearYield: 4.28,
    cpiInflation: 2.5,
    realYield: 1.78,
    peRatio: 33.4,
    earningsYield: 2.99,
    equityRiskPremium: -1.29,
    erpRating: 'Negative Premium (Overvalued)',
    fxVsUSD_1Y: 0.0,
    localReturn1Y: 34.2,
    usdAdjustedReturn1Y: 34.2,
    fxDragBoostPercent: 0.0,
    rebalanceSchedule: {
      frequency: 'Annually',
      reviewMonths: ['December'],
      nextReconstitution: 'Third Friday of December',
      cappingRule: 'Top 5 companies capped at 38.5% if aggregate exceeds 40%',
      bufferRule: 'Rank buffer 1-100 retained, 101-125 ranked by weighting'
    }
  },
  {
    indexId: 'djia',
    indexName: 'Dow Jones Industrial',
    flag: '🇺🇸',
    currency: 'USD',
    policyRate: 4.88,
    tenYearYield: 4.28,
    cpiInflation: 2.5,
    realYield: 1.78,
    peRatio: 22.1,
    earningsYield: 4.52,
    equityRiskPremium: 0.24,
    erpRating: 'Tight / Debt Favorable',
    fxVsUSD_1Y: 0.0,
    localReturn1Y: 21.6,
    usdAdjustedReturn1Y: 21.6,
    fxDragBoostPercent: 0.0,
    rebalanceSchedule: {
      frequency: 'Quarterly',
      reviewMonths: ['Ad-hoc', 'Corporate Actions'],
      nextReconstitution: 'Discretionary by Averages Committee',
      cappingRule: 'Price-weighted (Highest share price holds highest weight)',
      bufferRule: 'Preserves long-term industrial continuity'
    }
  },
  {
    indexId: 'russell2000',
    indexName: 'Russell 2000',
    flag: '🇺🇸',
    currency: 'USD',
    policyRate: 4.88,
    tenYearYield: 4.28,
    cpiInflation: 2.5,
    realYield: 1.78,
    peRatio: 26.5,
    earningsYield: 3.77,
    equityRiskPremium: -0.51,
    erpRating: 'Tight / Debt Favorable',
    fxVsUSD_1Y: 0.0,
    localReturn1Y: 18.2,
    usdAdjustedReturn1Y: 18.2,
    fxDragBoostPercent: 0.0,
    rebalanceSchedule: {
      frequency: 'Annually',
      reviewMonths: ['June'],
      nextReconstitution: 'Final Friday of June',
      cappingRule: 'Free-float market capitalization weighted',
      bufferRule: 'Band of ±2.5% market cap around rank 2000'
    }
  },
  {
    indexId: 'tsx',
    indexName: 'S&P/TSX Composite',
    flag: '🇨🇦',
    currency: 'CAD',
    policyRate: 3.75,
    tenYearYield: 3.25,
    cpiInflation: 1.6,
    realYield: 1.65,
    peRatio: 16.8,
    earningsYield: 5.95,
    equityRiskPremium: 2.70,
    erpRating: 'Moderate Equity Premium',
    fxVsUSD_1Y: -3.2,
    localReturn1Y: 22.4,
    usdAdjustedReturn1Y: 18.5,
    fxDragBoostPercent: -3.9,
    rebalanceSchedule: {
      frequency: 'Quarterly',
      reviewMonths: ['March', 'June', 'September', 'December'],
      nextReconstitution: 'Third Friday of December',
      cappingRule: '10% individual issuer cap',
      bufferRule: '0.04% relative market capitalization cutoff'
    }
  },
  {
    indexId: 'ftse100',
    indexName: 'FTSE 100',
    flag: '🇬🇧',
    currency: 'GBP',
    policyRate: 5.00,
    tenYearYield: 4.22,
    cpiInflation: 2.2,
    realYield: 2.02,
    peRatio: 12.8,
    earningsYield: 7.81,
    equityRiskPremium: 3.59,
    erpRating: 'Equities Highly Attractive',
    fxVsUSD_1Y: +3.8,
    localReturn1Y: 10.4,
    usdAdjustedReturn1Y: 14.6,
    fxDragBoostPercent: +4.2,
    rebalanceSchedule: {
      frequency: 'Quarterly',
      reviewMonths: ['March', 'June', 'September', 'December'],
      nextReconstitution: 'First Friday of December',
      cappingRule: 'Free float weighted, no single stock cap',
      bufferRule: 'Rank 90 automatically promoted, rank 111 demoted'
    }
  },
  {
    indexId: 'dax40',
    indexName: 'DAX 40',
    flag: '🇩🇪',
    currency: 'EUR',
    policyRate: 3.25,
    tenYearYield: 2.38,
    cpiInflation: 1.8,
    realYield: 0.58,
    peRatio: 14.2,
    earningsYield: 7.04,
    equityRiskPremium: 4.66,
    erpRating: 'Equities Highly Attractive',
    fxVsUSD_1Y: -1.9,
    localReturn1Y: 21.8,
    usdAdjustedReturn1Y: 19.5,
    fxDragBoostPercent: -2.3,
    rebalanceSchedule: {
      frequency: 'Quarterly',
      reviewMonths: ['March', 'June', 'September', 'December'],
      nextReconstitution: 'Third Friday of December',
      cappingRule: '15% single constituent weight cap',
      bufferRule: 'Fast Exit (Rank > 47) / Fast Entry (Rank < 33)'
    }
  },
  {
    indexId: 'cac40',
    indexName: 'CAC 40',
    flag: '🇫🇷',
    currency: 'EUR',
    policyRate: 3.25,
    tenYearYield: 3.08,
    cpiInflation: 1.5,
    realYield: 1.58,
    peRatio: 13.9,
    earningsYield: 7.19,
    equityRiskPremium: 4.11,
    erpRating: 'Equities Highly Attractive',
    fxVsUSD_1Y: -1.9,
    localReturn1Y: 7.6,
    usdAdjustedReturn1Y: 5.6,
    fxDragBoostPercent: -2.0,
    rebalanceSchedule: {
      frequency: 'Quarterly',
      reviewMonths: ['March', 'June', 'September', 'December'],
      nextReconstitution: 'Third Friday of December',
      cappingRule: '15% capping threshold per company',
      bufferRule: 'Conseil Scientifique committee review'
    }
  },
  {
    indexId: 'eurostoxx50',
    indexName: 'Euro Stoxx 50',
    flag: '🇪🇺',
    currency: 'EUR',
    policyRate: 3.25,
    tenYearYield: 2.38,
    cpiInflation: 1.8,
    realYield: 0.58,
    peRatio: 14.6,
    earningsYield: 6.85,
    equityRiskPremium: 4.47,
    erpRating: 'Equities Highly Attractive',
    fxVsUSD_1Y: -1.9,
    localReturn1Y: 17.5,
    usdAdjustedReturn1Y: 15.3,
    fxDragBoostPercent: -2.2,
    rebalanceSchedule: {
      frequency: 'Annually',
      reviewMonths: ['September'],
      nextReconstitution: 'Third Friday of September',
      cappingRule: '10% maximum weighting for any single component',
      bufferRule: 'Rank 40 auto inclusion, rank 61 auto deletion'
    }
  },
  {
    indexId: 'nifty50',
    indexName: 'Nifty 50',
    flag: '🇮🇳',
    currency: 'INR',
    policyRate: 6.50,
    tenYearYield: 6.82,
    cpiInflation: 4.8,
    realYield: 2.02,
    peRatio: 23.4,
    earningsYield: 4.27,
    equityRiskPremium: -2.55,
    erpRating: 'Tight / Debt Favorable',
    fxVsUSD_1Y: -1.4,
    localReturn1Y: 26.2,
    usdAdjustedReturn1Y: 24.4,
    fxDragBoostPercent: -1.8,
    rebalanceSchedule: {
      frequency: 'Semi-Annually',
      reviewMonths: ['March', 'September'],
      nextReconstitution: 'Last trading day of March & September',
      cappingRule: 'Free float market capitalization weighted',
      bufferRule: 'Must rank within top 1.5x of universe by free-float cap'
    }
  },
  {
    indexId: 'sensex',
    indexName: 'BSE Sensex',
    flag: '🇮🇳',
    currency: 'INR',
    policyRate: 6.50,
    tenYearYield: 6.82,
    cpiInflation: 4.8,
    realYield: 2.02,
    peRatio: 24.1,
    earningsYield: 4.15,
    equityRiskPremium: -2.67,
    erpRating: 'Tight / Debt Favorable',
    fxVsUSD_1Y: -1.4,
    localReturn1Y: 24.8,
    usdAdjustedReturn1Y: 23.1,
    fxDragBoostPercent: -1.7,
    rebalanceSchedule: {
      frequency: 'Semi-Annually',
      reviewMonths: ['June', 'December'],
      nextReconstitution: 'Third Friday of December',
      cappingRule: 'Free float weighted',
      bufferRule: 'Top 30 liquid large caps on BSE'
    }
  },
  {
    indexId: 'nikkei225',
    indexName: 'Nikkei 225',
    flag: '🇯🇵',
    currency: 'JPY',
    policyRate: 0.25,
    tenYearYield: 0.95,
    cpiInflation: 2.8,
    realYield: -1.85,
    peRatio: 17.5,
    earningsYield: 5.71,
    equityRiskPremium: 4.76,
    erpRating: 'Equities Highly Attractive',
    fxVsUSD_1Y: -8.5,
    localReturn1Y: 20.8,
    usdAdjustedReturn1Y: 10.5,
    fxDragBoostPercent: -10.3,
    rebalanceSchedule: {
      frequency: 'Semi-Annually',
      reviewMonths: ['April', 'October'],
      nextReconstitution: 'First trading day of April & October',
      cappingRule: 'Price-weighted adjusted by deemed par value divisor',
      bufferRule: 'Sector balance rule maintained across 6 industry groups'
    }
  },
  {
    indexId: 'hangseng',
    indexName: 'Hang Seng',
    flag: '🇭🇰',
    currency: 'HKD',
    policyRate: 5.00,
    tenYearYield: 3.45,
    cpiInflation: 1.9,
    realYield: 1.55,
    peRatio: 9.8,
    earningsYield: 10.20,
    equityRiskPremium: 6.75,
    erpRating: 'Equities Highly Attractive',
    fxVsUSD_1Y: +0.2,
    localReturn1Y: 14.2,
    usdAdjustedReturn1Y: 14.4,
    fxDragBoostPercent: +0.2,
    rebalanceSchedule: {
      frequency: 'Quarterly',
      reviewMonths: ['March', 'June', 'September', 'December'],
      nextReconstitution: 'First Friday of December',
      cappingRule: '8% individual constituent weight cap',
      bufferRule: 'Target range of 80 to 100 constituent members'
    }
  },
  {
    indexId: 'csi300',
    indexName: 'CSI 300',
    flag: '🇨🇳',
    currency: 'CNY',
    policyRate: 3.10,
    tenYearYield: 2.14,
    cpiInflation: 0.4,
    realYield: 1.74,
    peRatio: 12.6,
    earningsYield: 7.94,
    equityRiskPremium: 5.80,
    erpRating: 'Equities Highly Attractive',
    fxVsUSD_1Y: -0.8,
    localReturn1Y: 11.2,
    usdAdjustedReturn1Y: 10.3,
    fxDragBoostPercent: -0.9,
    rebalanceSchedule: {
      frequency: 'Semi-Annually',
      reviewMonths: ['June', 'December'],
      nextReconstitution: 'Second Friday of December',
      cappingRule: 'Free float adjusted market cap',
      bufferRule: 'Rank within top 240 auto included, below 360 deleted'
    }
  },
  {
    indexId: 'asx200',
    indexName: 'S&P/ASX 200',
    flag: '🇦🇺',
    currency: 'AUD',
    policyRate: 4.35,
    tenYearYield: 4.42,
    cpiInflation: 3.8,
    realYield: 0.62,
    peRatio: 18.2,
    earningsYield: 5.49,
    equityRiskPremium: 1.07,
    erpRating: 'Moderate Equity Premium',
    fxVsUSD_1Y: -1.8,
    localReturn1Y: 17.8,
    usdAdjustedReturn1Y: 15.7,
    fxDragBoostPercent: -2.1,
    rebalanceSchedule: {
      frequency: 'Quarterly',
      reviewMonths: ['March', 'June', 'September', 'December'],
      nextReconstitution: 'Third Friday of December',
      cappingRule: 'Free-float market capitalization',
      bufferRule: 'Rank 180 auto included, rank 221 removed'
    }
  },
  {
    indexId: 'bovespa',
    indexName: 'Ibovespa',
    flag: '🇧🇷',
    currency: 'BRL',
    policyRate: 10.75,
    tenYearYield: 12.35,
    cpiInflation: 4.4,
    realYield: 7.95,
    peRatio: 8.4,
    earningsYield: 11.90,
    equityRiskPremium: -0.45,
    erpRating: 'Tight / Debt Favorable',
    fxVsUSD_1Y: -12.4,
    localReturn1Y: 12.4,
    usdAdjustedReturn1Y: -1.5,
    fxDragBoostPercent: -13.9,
    rebalanceSchedule: {
      frequency: 'Quarterly (Every 4 Months)',
      reviewMonths: ['January', 'May', 'September'],
      nextReconstitution: 'First Monday of January',
      cappingRule: 'Free float weighted with 20% max single weight',
      bufferRule: 'Liquidity tradability ratio (IN) ranking filter'
    }
  },
  {
    indexId: 'tasi',
    indexName: 'Tadawul All Share',
    flag: '🇸🇦',
    currency: 'SAR',
    policyRate: 5.50,
    tenYearYield: 4.95,
    cpiInflation: 1.7,
    realYield: 3.25,
    peRatio: 17.2,
    earningsYield: 5.81,
    equityRiskPremium: 0.86,
    erpRating: 'Tight / Debt Favorable',
    fxVsUSD_1Y: 0.0,
    localReturn1Y: 8.5,
    usdAdjustedReturn1Y: 8.5,
    fxDragBoostPercent: 0.0,
    rebalanceSchedule: {
      frequency: 'Quarterly',
      reviewMonths: ['March', 'June', 'September', 'December'],
      nextReconstitution: 'Third Thursday of December',
      cappingRule: '15% single company cap limit',
      bufferRule: 'Free-float shares minimum 30% or regulatory approval'
    }
  },
  {
    indexId: 'jse40',
    indexName: 'FTSE/JSE Top 40',
    flag: '🇿🇦',
    currency: 'ZAR',
    policyRate: 8.00,
    tenYearYield: 10.15,
    cpiInflation: 4.4,
    realYield: 5.75,
    peRatio: 11.8,
    earningsYield: 8.47,
    equityRiskPremium: -1.68,
    erpRating: 'Tight / Debt Favorable',
    fxVsUSD_1Y: +5.4,
    localReturn1Y: 15.6,
    usdAdjustedReturn1Y: 21.8,
    fxDragBoostPercent: +6.2,
    rebalanceSchedule: {
      frequency: 'Quarterly',
      reviewMonths: ['March', 'June', 'September', 'December'],
      nextReconstitution: 'Third Friday of December',
      cappingRule: '10% single company capping',
      bufferRule: 'Top 35 automatic inclusion, below 45 deletion'
    }
  }
]

// ==========================================
// Dynamic Live Macro & Yield Overlay
// ==========================================
import macroLive from './generated/macro_live.json'
import { globalIndices } from './indices'

// 1. Overlay live US 10Y Yield on Federal Reserve
if (macroLive && typeof (macroLive as any).us10YYield === 'number') {
  const liveUS10Y = (macroLive as any).us10YYield
  const fed = centralBanks.find(b => b.id === 'fed')
  if (fed) {
    fed.tenYearYield = liveUS10Y
    fed.realYield = Number((fed.tenYearYield - fed.currentInflation).toFixed(2))
  }
}

// 2. Synchronize IndexMacroProfiles with live index valuations, returns, and ECB FX deltas
const liveFXDeltas = (macroLive && (macroLive as any).fxDeltas1Y) || {}

indexMacroProfiles.forEach(prof => {
  const idx = globalIndices.find(i => i.id === prof.indexId)
  if (idx) {
    prof.peRatio = idx.valuations.peRatio
    prof.earningsYield = Number((100 / (idx.valuations.peRatio || 1)).toFixed(2))

    // Update US 10Y sovereign yield if US index
    if (idx.currency === 'USD' && macroLive && typeof (macroLive as any).us10YYield === 'number') {
      prof.tenYearYield = (macroLive as any).us10YYield
    }

    prof.equityRiskPremium = Number((prof.earningsYield - prof.tenYearYield).toFixed(2))
    if (prof.equityRiskPremium >= 2.0) {
      prof.erpRating = 'Equities Highly Attractive'
    } else if (prof.equityRiskPremium >= 0.5) {
      prof.erpRating = 'Moderate Equity Premium'
    } else if (prof.equityRiskPremium >= -1.0) {
      prof.erpRating = 'Tight / Debt Favorable'
    } else {
      prof.erpRating = 'Negative Premium (Overvalued)'
    }

    prof.localReturn1Y = idx.performance['1Y']
  }

  // Live 1Y FX Delta vs USD from ECB
  if (prof.currency in liveFXDeltas) {
    prof.fxVsUSD_1Y = liveFXDeltas[prof.currency]
  }

  const localR = prof.localReturn1Y / 100
  const fxR = prof.fxVsUSD_1Y / 100
  prof.usdAdjustedReturn1Y = Number((((1 + localR) * (1 + fxR) - 1) * 100).toFixed(1))
  prof.fxDragBoostPercent = Number((prof.usdAdjustedReturn1Y - prof.localReturn1Y).toFixed(1))
})

