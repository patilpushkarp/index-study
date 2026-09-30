export interface IndexHolding {
  ticker: string
  name: string
  weight: number
  sector: string
  price: number
  changePercent: number
  contributionPoints?: number
}

export interface SectorWeight {
  name: string
  percentage: number
  color: string
}

export interface TimeSeriesPoint {
  date: string
  value: number
}

export interface IndexData {
  id: string
  symbol: string
  name: string
  shortName: string
  country: string
  flag: string
  region: 'Americas' | 'Europe' | 'Asia-Pacific' | 'Emerging'
  currency: string
  exchange: string
  provider: string
  currentLevel: number
  previousClose: number
  change: number
  changePercent: number
  dayLow: number
  dayHigh: number
  fiftyTwoWeekLow: number
  fiftyTwoWeekHigh: number
  allTimeHigh: number
  athDate: string
  drawdownFromATH: number
  marketCapUSD: string
  constituentsCount: number
  weightingType: 'Free-Float Market Cap' | 'Price Weighted' | 'Modified Market Cap' | 'Capped Market Cap'
  rebalanceSchedule: string
  inceptionYear: number
  baseDate: string
  baseValue: number
  description: string
  tradingHours: {
    timezone: string
    timezoneLabel: string
    utcOffset: number // in hours from UTC
    openLocal: string // e.g. "09:30"
    closeLocal: string // e.g. "16:00"
    lunchBreak?: {
      start: string
      end: string
    }
  }
  performance: {
    '1D': number
    '1W': number
    '1M': number
    '3M': number
    '6M': number
    'YTD': number
    '1Y': number
    '3Y': number
    '5Y': number
    '10Y': number
  }
  volatility?: number
  beta?: number
  valuations: {
    peRatio: number
    forwardPE: number
    pbRatio: number
    dividendYield: number
    historicalPE: {
      min10Y: number
      max10Y: number
      mean10Y: number
      sd10Y: number
      status: 'Undervalued' | 'Fair Value' | 'Overvalued'
    }
  }
  concentration?: {
    top5Weight: number
    top10Weight: number
    hhiScore: number
    rating: 'Diversified' | 'Moderate Concentration' | 'High Concentration'
  }
  historicalValuationSeries?: {
    years: number[]
    peRatio: number[]
    dividendYield: number[]
  }
  macro: {
    centralBank: string
    policyRate: number
    sovereignYield10Y: number
    inflationYoY: number
    equityRiskPremium: number
  }
  sectors: SectorWeight[]
  constituents: IndexHolding[]
  sparkline: number[]
  timeSeries: {
    '1D': TimeSeriesPoint[]
    '1W': TimeSeriesPoint[]
    '1M': TimeSeriesPoint[]
    '6M': TimeSeriesPoint[]
    '1Y': TimeSeriesPoint[]
    '5Y': TimeSeriesPoint[]
    'ALL': TimeSeriesPoint[]
  }
}

// Helper to generate simulated historical curves based on real anchor points
function generateCurve(base: number, length: number, volatility: number, drift: number, startDate: Date, stepDays: number): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = []
  let curr = base
  for (let i = length - 1; i >= 0; i--) {
    const d = new Date(startDate.getTime() - i * stepDays * 86400000)
    const shock = (Math.sin(i * 0.4) * 0.5 + (Math.cos(i * 0.7) * 0.3) + (Math.sin(i * 1.3) * 0.2)) * volatility
    const trend = (length - 1 - i) * (drift / length)
    const val = Number((curr * (1 - trend + shock)).toFixed(2))
    points.push({
      date: d.toISOString().split('T')[0],
      value: Math.max(val, 1)
    })
  }
  // Ensure the very last point matches current level
  points[points.length - 1].value = base
  return points
}

function generateIntraday(base: number, open: number): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = []
  const times = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00']
  let current = open
  const diff = base - open
  for (let i = 0; i < times.length; i++) {
    const progress = i / (times.length - 1)
    const noise = Math.sin(i * 1.5) * (Math.abs(diff) * 0.3 + base * 0.001)
    const val = Number((open + diff * progress + (i === times.length - 1 ? 0 : noise)).toFixed(2))
    points.push({ date: times[i], value: val })
  }
  return points
}

const now = new Date('2026-09-30T10:00:00Z')

export const globalIndices: IndexData[] = [
  // ==========================================
  // AMERICAS
  // ==========================================
  {
    id: 'sp500',
    symbol: '^GSPC',
    name: 'S&P 500 Index',
    shortName: 'S&P 500',
    country: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    currency: 'USD',
    exchange: 'NYSE / NASDAQ',
    provider: 'S&P Dow Jones Indices',
    currentLevel: 5864.67,
    previousClose: 5842.20,
    change: 22.47,
    changePercent: 0.38,
    dayLow: 5835.12,
    dayHigh: 5871.40,
    fiftyTwoWeekLow: 4103.78,
    fiftyTwoWeekHigh: 5878.46,
    allTimeHigh: 5878.46,
    athDate: '2026-09-26',
    drawdownFromATH: -0.23,
    marketCapUSD: '$47.8 Trillion',
    constituentsCount: 503,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Quarterly (March, June, September, December)',
    inceptionYear: 1957,
    baseDate: '1941-1943',
    baseValue: 10,
    description: 'The premier benchmark of large-cap U.S. equities, tracking 500 leading companies representing approximately 80% of available market capitalization.',
    tradingHours: {
      timezone: 'America/New_York',
      timezoneLabel: 'EDT (UTC-4)',
      utcOffset: -4,
      openLocal: '09:30',
      closeLocal: '16:00'
    },
    performance: {
      '1D': 0.38,
      '1W': 1.12,
      '1M': 3.45,
      '3M': 6.84,
      '6M': 14.20,
      'YTD': 22.80,
      '1Y': 34.60,
      '3Y': 41.20,
      '5Y': 88.50,
      '10Y': 198.40
    },
    valuations: {
      peRatio: 26.8,
      forwardPE: 21.4,
      pbRatio: 4.85,
      dividendYield: 1.32,
      historicalPE: {
        min10Y: 17.2,
        max10Y: 34.1,
        mean10Y: 22.1,
        sd10Y: 3.4,
        status: 'Overvalued'
      }
    },
    macro: {
      centralBank: 'Federal Reserve',
      policyRate: 4.875,
      sovereignYield10Y: 3.78,
      inflationYoY: 2.5,
      equityRiskPremium: -0.05
    },
    sectors: [
      { name: 'Information Technology', percentage: 31.4, color: '#2D68FF' },
      { name: 'Financials', percentage: 13.2, color: '#00D26A' },
      { name: 'Health Care', percentage: 11.8, color: '#38BDF8' },
      { name: 'Consumer Discretionary', percentage: 10.1, color: '#FFB020' },
      { name: 'Communication Services', percentage: 9.2, color: '#A855F7' },
      { name: 'Industrials', percentage: 8.4, color: '#F97316' },
      { name: 'Consumer Staples', percentage: 5.8, color: '#EC4899' },
      { name: 'Energy', percentage: 3.6, color: '#EAB308' },
      { name: 'Utilities', percentage: 2.5, color: '#14B8A6' },
      { name: 'Real Estate', percentage: 2.2, color: '#6366F1' },
      { name: 'Materials', percentage: 1.8, color: '#64748B' }
    ],
    constituents: [
      { ticker: 'AAPL', name: 'Apple Inc.', weight: 7.1, sector: 'Technology', price: 232.40, changePercent: 0.65 },
      { ticker: 'MSFT', name: 'Microsoft Corporation', weight: 6.8, sector: 'Technology', price: 435.20, changePercent: 0.42 },
      { ticker: 'NVDA', name: 'NVIDIA Corporation', weight: 6.4, sector: 'Technology', price: 124.80, changePercent: 1.85 },
      { ticker: 'AMZN', name: 'Amazon.com Inc.', weight: 3.8, sector: 'Consumer Discretionary', price: 189.30, changePercent: -0.25 },
      { ticker: 'GOOGL', name: 'Alphabet Inc. (Class A)', weight: 2.2, sector: 'Communication Services', price: 165.70, changePercent: 0.80 },
      { ticker: 'META', name: 'Meta Platforms Inc.', weight: 2.5, sector: 'Communication Services', price: 572.10, changePercent: 1.15 },
      { ticker: 'BRK.B', name: 'Berkshire Hathaway Inc.', weight: 1.8, sector: 'Financials', price: 461.50, changePercent: -0.15 },
      { ticker: 'LLY', name: 'Eli Lilly and Company', weight: 1.6, sector: 'Health Care', price: 912.00, changePercent: -0.45 },
      { ticker: 'AVGO', name: 'Broadcom Inc.', weight: 1.5, sector: 'Technology', price: 174.60, changePercent: 0.90 },
      { ticker: 'JPM', name: 'JPMorgan Chase & Co.', weight: 1.4, sector: 'Financials', price: 218.40, changePercent: 0.35 }
    ],
    sparkline: [5620, 5645, 5630, 5660, 5690, 5710, 5695, 5725, 5740, 5735, 5755, 5780, 5760, 5790, 5815, 5800, 5820, 5835, 5810, 5840, 5855, 5845, 5860, 5850, 5870, 5855, 5865, 5842, 5850, 5864],
    timeSeries: {
      '1D': generateIntraday(5864.67, 5845.10),
      '1W': generateCurve(5864.67, 7, 0.003, 0.011, now, 1),
      '1M': generateCurve(5864.67, 30, 0.008, 0.034, now, 1),
      '6M': generateCurve(5864.67, 26, 0.015, 0.142, now, 7),
      '1Y': generateCurve(5864.67, 52, 0.025, 0.346, now, 7),
      '5Y': generateCurve(5864.67, 60, 0.06, 0.885, now, 30),
      'ALL': generateCurve(5864.67, 100, 0.12, 4.5, now, 90)
    }
  },
  {
    id: 'nasdaq100',
    symbol: '^NDX',
    name: 'Nasdaq 100 Index',
    shortName: 'Nasdaq 100',
    country: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    currency: 'USD',
    exchange: 'NASDAQ',
    provider: 'Nasdaq, Inc.',
    currentLevel: 20275.40,
    previousClose: 20180.15,
    change: 95.25,
    changePercent: 0.47,
    dayLow: 20120.00,
    dayHigh: 20315.60,
    fiftyTwoWeekLow: 14120.40,
    fiftyTwoWeekHigh: 20690.97,
    allTimeHigh: 20690.97,
    athDate: '2026-07-10',
    drawdownFromATH: -2.01,
    marketCapUSD: '$23.6 Trillion',
    constituentsCount: 101,
    weightingType: 'Modified Market Cap',
    rebalanceSchedule: 'Annual (December) with quarterly review',
    inceptionYear: 1985,
    baseDate: '1985-01-31',
    baseValue: 125,
    description: 'Tracks 100 of the largest non-financial innovative domestic and international companies listed on The Nasdaq Stock Market.',
    tradingHours: {
      timezone: 'America/New_York',
      timezoneLabel: 'EDT (UTC-4)',
      utcOffset: -4,
      openLocal: '09:30',
      closeLocal: '16:00'
    },
    performance: {
      '1D': 0.47,
      '1W': 1.65,
      '1M': 4.10,
      '3M': 7.90,
      '6M': 16.80,
      'YTD': 24.50,
      '1Y': 39.20,
      '3Y': 56.40,
      '5Y': 132.10,
      '10Y': 385.20
    },
    valuations: {
      peRatio: 31.4,
      forwardPE: 25.8,
      pbRatio: 7.20,
      dividendYield: 0.82,
      historicalPE: {
        min10Y: 19.8,
        max10Y: 41.2,
        mean10Y: 26.5,
        sd10Y: 4.8,
        status: 'Overvalued'
      }
    },
    macro: {
      centralBank: 'Federal Reserve',
      policyRate: 4.875,
      sovereignYield10Y: 3.78,
      inflationYoY: 2.5,
      equityRiskPremium: -0.60
    },
    sectors: [
      { name: 'Technology', percentage: 58.6, color: '#2D68FF' },
      { name: 'Consumer Services', percentage: 16.4, color: '#FFB020' },
      { name: 'Health Care', percentage: 6.8, color: '#38BDF8' },
      { name: 'Consumer Goods', percentage: 5.2, color: '#EC4899' },
      { name: 'Industrials', percentage: 4.8, color: '#F97316' },
      { name: 'Telecommunications', percentage: 4.2, color: '#A855F7' },
      { name: 'Utilities', percentage: 2.2, color: '#14B8A6' },
      { name: 'Financials', percentage: 1.8, color: '#00D26A' }
    ],
    constituents: [
      { ticker: 'AAPL', name: 'Apple Inc.', weight: 8.8, sector: 'Technology', price: 232.40, changePercent: 0.65 },
      { ticker: 'MSFT', name: 'Microsoft Corporation', weight: 8.4, sector: 'Technology', price: 435.20, changePercent: 0.42 },
      { ticker: 'NVDA', name: 'NVIDIA Corporation', weight: 7.9, sector: 'Technology', price: 124.80, changePercent: 1.85 },
      { ticker: 'AMZN', name: 'Amazon.com Inc.', weight: 5.4, sector: 'Consumer Discretionary', price: 189.30, changePercent: -0.25 },
      { ticker: 'META', name: 'Meta Platforms Inc.', weight: 4.8, sector: 'Communication Services', price: 572.10, changePercent: 1.15 },
      { ticker: 'AVGO', name: 'Broadcom Inc.', weight: 4.6, sector: 'Technology', price: 174.60, changePercent: 0.90 },
      { ticker: 'TSLA', name: 'Tesla Inc.', weight: 3.1, sector: 'Consumer Discretionary', price: 254.20, changePercent: 2.10 },
      { ticker: 'COST', name: 'Costco Wholesale Corp.', weight: 2.6, sector: 'Consumer Staples', price: 905.00, changePercent: -0.10 },
      { ticker: 'GOOGL', name: 'Alphabet Inc. (Class A)', weight: 2.5, sector: 'Communication Services', price: 165.70, changePercent: 0.80 },
      { ticker: 'AMD', name: 'Advanced Micro Devices', weight: 1.9, sector: 'Technology', price: 156.40, changePercent: 1.40 }
    ],
    sparkline: [19400, 19520, 19480, 19600, 19750, 19800, 19710, 19890, 19950, 19910, 20020, 20140, 20050, 20180, 20250, 20190, 20240, 20310, 20220, 20290, 20350, 20280, 20320, 20210, 20280, 20230, 20260, 20180, 20220, 20275],
    timeSeries: {
      '1D': generateIntraday(20275.40, 20190.00),
      '1W': generateCurve(20275.40, 7, 0.004, 0.016, now, 1),
      '1M': generateCurve(20275.40, 30, 0.010, 0.041, now, 1),
      '6M': generateCurve(20275.40, 26, 0.020, 0.168, now, 7),
      '1Y': generateCurve(20275.40, 52, 0.035, 0.392, now, 7),
      '5Y': generateCurve(20275.40, 60, 0.08, 1.321, now, 30),
      'ALL': generateCurve(20275.40, 100, 0.15, 8.2, now, 90)
    }
  },
  {
    id: 'djia',
    symbol: '^DJI',
    name: 'Dow Jones Industrial Average',
    shortName: 'Dow Jones',
    country: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    currency: 'USD',
    exchange: 'NYSE',
    provider: 'S&P Dow Jones Indices',
    currentLevel: 42313.00,
    previousClose: 42156.97,
    change: 156.03,
    changePercent: 0.37,
    dayLow: 42080.50,
    dayHigh: 42380.20,
    fiftyTwoWeekLow: 32417.59,
    fiftyTwoWeekHigh: 42418.36,
    allTimeHigh: 42418.36,
    athDate: '2026-09-27',
    drawdownFromATH: -0.25,
    marketCapUSD: '$14.2 Trillion',
    constituentsCount: 30,
    weightingType: 'Price Weighted',
    rebalanceSchedule: 'As needed by committee',
    inceptionYear: 1896,
    baseDate: '1896-05-26',
    baseValue: 40.94,
    description: 'The oldest and most renowned American stock market indicator, tracking 30 blue-chip, industry-leading American companies.',
    tradingHours: {
      timezone: 'America/New_York',
      timezoneLabel: 'EDT (UTC-4)',
      utcOffset: -4,
      openLocal: '09:30',
      closeLocal: '16:00'
    },
    performance: {
      '1D': 0.37,
      '1W': 0.85,
      '1M': 2.80,
      '3M': 7.10,
      '6M': 10.40,
      'YTD': 15.60,
      '1Y': 26.40,
      '3Y': 24.80,
      '5Y': 56.40,
      '10Y': 148.20
    },
    valuations: {
      peRatio: 22.4,
      forwardPE: 19.1,
      pbRatio: 4.10,
      dividendYield: 1.74,
      historicalPE: {
        min10Y: 15.1,
        max10Y: 27.5,
        mean10Y: 19.4,
        sd10Y: 2.8,
        status: 'Fair Value'
      }
    },
    macro: {
      centralBank: 'Federal Reserve',
      policyRate: 4.875,
      sovereignYield10Y: 3.78,
      inflationYoY: 2.5,
      equityRiskPremium: 0.68
    },
    sectors: [
      { name: 'Financials', percentage: 23.4, color: '#00D26A' },
      { name: 'Health Care', percentage: 19.2, color: '#38BDF8' },
      { name: 'Information Technology', percentage: 18.8, color: '#2D68FF' },
      { name: 'Industrials', percentage: 14.5, color: '#F97316' },
      { name: 'Consumer Discretionary', percentage: 13.8, color: '#FFB020' },
      { name: 'Consumer Staples', percentage: 6.2, color: '#EC4899' },
      { name: 'Energy', percentage: 2.8, color: '#EAB308' },
      { name: 'Materials', percentage: 1.3, color: '#64748B' }
    ],
    constituents: [
      { ticker: 'UNH', name: 'UnitedHealth Group', weight: 8.9, sector: 'Health Care', price: 588.20, changePercent: 0.30 },
      { ticker: 'GS', name: 'Goldman Sachs Group', weight: 7.6, sector: 'Financials', price: 502.40, changePercent: 0.85 },
      { ticker: 'MSFT', name: 'Microsoft Corporation', weight: 6.6, sector: 'Technology', price: 435.20, changePercent: 0.42 },
      { ticker: 'HD', name: 'The Home Depot Inc.', weight: 6.1, sector: 'Consumer Discretionary', price: 405.10, changePercent: 0.15 },
      { ticker: 'CAT', name: 'Caterpillar Inc.', weight: 5.9, sector: 'Industrials', price: 390.60, changePercent: 1.20 },
      { ticker: 'AMGN', name: 'Amgen Inc.', weight: 4.9, sector: 'Health Care', price: 326.80, changePercent: -0.20 },
      { ticker: 'V', name: 'Visa Inc.', weight: 4.2, sector: 'Financials', price: 278.30, changePercent: 0.40 },
      { ticker: 'CRM', name: 'Salesforce Inc.', weight: 4.1, sector: 'Technology', price: 272.90, changePercent: -0.60 },
      { ticker: 'MCD', name: "McDonald's Corp.", weight: 4.5, sector: 'Consumer Discretionary', price: 301.20, changePercent: 0.25 },
      { ticker: 'AAPL', name: 'Apple Inc.', weight: 3.5, sector: 'Technology', price: 232.40, changePercent: 0.65 }
    ],
    sparkline: [40800, 40950, 41100, 41050, 41250, 41380, 41300, 41450, 41580, 41650, 41800, 41920, 41850, 42010, 42120, 42080, 42190, 42250, 42180, 42240, 42310, 42280, 42350, 42260, 42330, 42280, 42340, 42156, 42220, 42313],
    timeSeries: {
      '1D': generateIntraday(42313.00, 42170.00),
      '1W': generateCurve(42313.00, 7, 0.003, 0.008, now, 1),
      '1M': generateCurve(42313.00, 30, 0.006, 0.028, now, 1),
      '6M': generateCurve(42313.00, 26, 0.012, 0.104, now, 7),
      '1Y': generateCurve(42313.00, 52, 0.022, 0.264, now, 7),
      '5Y': generateCurve(42313.00, 60, 0.05, 0.564, now, 30),
      'ALL': generateCurve(42313.00, 100, 0.10, 3.4, now, 90)
    }
  },
  {
    id: 'russell2000',
    symbol: '^RUT',
    name: 'Russell 2000 Index',
    shortName: 'Russell 2000',
    country: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    currency: 'USD',
    exchange: 'NYSE / NASDAQ',
    provider: 'FTSE Russell',
    currentLevel: 2225.40,
    previousClose: 2212.80,
    change: 12.60,
    changePercent: 0.57,
    dayLow: 2205.10,
    dayHigh: 2234.20,
    fiftyTwoWeekLow: 1633.67,
    fiftyTwoWeekHigh: 2299.00,
    allTimeHigh: 2458.86,
    athDate: '2021-11-08',
    drawdownFromATH: -9.49,
    marketCapUSD: '$3.2 Trillion',
    constituentsCount: 1970,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Annual (June)',
    inceptionYear: 1984,
    baseDate: '1984-01-01',
    baseValue: 135,
    description: 'The standard gauge for U.S. small-cap equity performance, measuring approximately 2,000 of the smallest securities in the Russell 3000 Index.',
    tradingHours: {
      timezone: 'America/New_York',
      timezoneLabel: 'EDT (UTC-4)',
      utcOffset: -4,
      openLocal: '09:30',
      closeLocal: '16:00'
    },
    performance: {
      '1D': 0.57,
      '1W': 1.80,
      '1M': 3.10,
      '3M': 9.20,
      '6M': 8.50,
      'YTD': 9.80,
      '1Y': 24.10,
      '3Y': 1.20,
      '5Y': 38.60,
      '10Y': 92.40
    },
    valuations: {
      peRatio: 28.5,
      forwardPE: 16.8,
      pbRatio: 2.15,
      dividendYield: 1.45,
      historicalPE: {
        min10Y: 18.2,
        max10Y: 44.0,
        mean10Y: 26.2,
        sd10Y: 5.5,
        status: 'Fair Value'
      }
    },
    macro: {
      centralBank: 'Federal Reserve',
      policyRate: 4.875,
      sovereignYield10Y: 3.78,
      inflationYoY: 2.5,
      equityRiskPremium: -0.27
    },
    sectors: [
      { name: 'Industrials', percentage: 18.4, color: '#F97316' },
      { name: 'Financials', percentage: 17.2, color: '#00D26A' },
      { name: 'Health Care', percentage: 15.6, color: '#38BDF8' },
      { name: 'Information Technology', percentage: 14.8, color: '#2D68FF' },
      { name: 'Consumer Discretionary', percentage: 10.9, color: '#FFB020' },
      { name: 'Real Estate', percentage: 6.8, color: '#6366F1' },
      { name: 'Energy', percentage: 5.8, color: '#EAB308' },
      { name: 'Materials', percentage: 4.5, color: '#64748B' }
    ],
    constituents: [
      { ticker: 'SMCI', name: 'Super Micro Computer', weight: 0.65, sector: 'Technology', price: 44.50, changePercent: 3.40 },
      { ticker: 'FN', name: 'Fabrinet', weight: 0.52, sector: 'Technology', price: 248.10, changePercent: 1.20 },
      { ticker: 'FTAI', name: 'FTAI Aviation Ltd.', weight: 0.48, sector: 'Industrials', price: 135.20, changePercent: -0.80 },
      { ticker: 'CRSP', name: 'CRISPR Therapeutics', weight: 0.42, sector: 'Health Care', price: 54.30, changePercent: 0.95 },
      { ticker: 'SAIA', name: 'Saia Inc.', weight: 0.40, sector: 'Industrials', price: 460.00, changePercent: 0.50 }
    ],
    sparkline: [2140, 2155, 2150, 2165, 2180, 2170, 2185, 2190, 2180, 2200, 2210, 2205, 2215, 2220, 2210, 2225, 2230, 2220, 2215, 2225, 2235, 2220, 2230, 2215, 2225, 2220, 2230, 2212, 2218, 2225],
    timeSeries: {
      '1D': generateIntraday(2225.40, 2214.00),
      '1W': generateCurve(2225.40, 7, 0.005, 0.018, now, 1),
      '1M': generateCurve(2225.40, 30, 0.012, 0.031, now, 1),
      '6M': generateCurve(2225.40, 26, 0.025, 0.085, now, 7),
      '1Y': generateCurve(2225.40, 52, 0.040, 0.241, now, 7),
      '5Y': generateCurve(2225.40, 60, 0.09, 0.386, now, 30),
      'ALL': generateCurve(2225.40, 100, 0.16, 2.8, now, 90)
    }
  },
  {
    id: 'tsx',
    symbol: '^GSPTSE',
    name: 'S&P/TSX Composite',
    shortName: 'TSX Composite',
    country: 'Canada',
    flag: '🇨🇦',
    region: 'Americas',
    currency: 'CAD',
    exchange: 'Toronto Stock Exchange',
    provider: 'S&P Dow Jones Indices',
    currentLevel: 24033.86,
    previousClose: 23985.40,
    change: 48.46,
    changePercent: 0.20,
    dayLow: 23950.00,
    dayHigh: 24080.00,
    fiftyTwoWeekLow: 18730.00,
    fiftyTwoWeekHigh: 24105.00,
    allTimeHigh: 24105.00,
    athDate: '2026-09-25',
    drawdownFromATH: -0.30,
    marketCapUSD: '$3.1 Trillion',
    constituentsCount: 225,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Quarterly',
    inceptionYear: 1977,
    baseDate: '1975-01-01',
    baseValue: 1000,
    description: 'The headline index for the Canadian equity market, covering roughly 70% of total market capitalization on the Toronto Stock Exchange.',
    tradingHours: {
      timezone: 'America/Toronto',
      timezoneLabel: 'EDT (UTC-4)',
      utcOffset: -4,
      openLocal: '09:30',
      closeLocal: '16:00'
    },
    performance: {
      '1D': 0.20,
      '1W': 0.95,
      '1M': 3.10,
      '3M': 9.40,
      '6M': 10.80,
      'YTD': 14.80,
      '1Y': 24.20,
      '3Y': 18.50,
      '5Y': 48.20,
      '10Y': 68.40
    },
    valuations: {
      peRatio: 16.8,
      forwardPE: 14.9,
      pbRatio: 1.95,
      dividendYield: 3.10,
      historicalPE: {
        min10Y: 13.2,
        max10Y: 22.1,
        mean10Y: 16.5,
        sd10Y: 2.1,
        status: 'Fair Value'
      }
    },
    macro: {
      centralBank: 'Bank of Canada',
      policyRate: 4.25,
      sovereignYield10Y: 2.95,
      inflationYoY: 2.0,
      equityRiskPremium: 3.00
    },
    sectors: [
      { name: 'Financials', percentage: 31.8, color: '#00D26A' },
      { name: 'Energy', percentage: 17.5, color: '#EAB308' },
      { name: 'Materials', percentage: 12.4, color: '#64748B' },
      { name: 'Industrials', percentage: 12.1, color: '#F97316' },
      { name: 'Information Technology', percentage: 9.2, color: '#2D68FF' }
    ],
    constituents: [
      { ticker: 'RY', name: 'Royal Bank of Canada', weight: 6.8, sector: 'Financials', price: 164.20, changePercent: 0.35 },
      { ticker: 'TD', name: 'Toronto-Dominion Bank', weight: 4.9, sector: 'Financials', price: 86.40, changePercent: -0.10 },
      { ticker: 'SHOP', name: 'Shopify Inc.', weight: 4.2, sector: 'Technology', price: 104.50, changePercent: 1.40 },
      { ticker: 'ENB', name: 'Enbridge Inc.', weight: 3.8, sector: 'Energy', price: 53.80, changePercent: 0.20 },
      { ticker: 'CNQ', name: 'Canadian Natural Resources', weight: 3.5, sector: 'Energy', price: 47.90, changePercent: -0.40 }
    ],
    sparkline: [23300, 23400, 23350, 23480, 23550, 23500, 23620, 23700, 23680, 23750, 23820, 23780, 23890, 23940, 23900, 23960, 24010, 23980, 24020, 24050, 24020, 24060, 24040, 24080, 24050, 24070, 24060, 23985, 24010, 24033],
    timeSeries: {
      '1D': generateIntraday(24033.86, 23990.00),
      '1W': generateCurve(24033.86, 7, 0.003, 0.009, now, 1),
      '1M': generateCurve(24033.86, 30, 0.007, 0.031, now, 1),
      '6M': generateCurve(24033.86, 26, 0.015, 0.108, now, 7),
      '1Y': generateCurve(24033.86, 52, 0.024, 0.242, now, 7),
      '5Y': generateCurve(24033.86, 60, 0.06, 0.482, now, 30),
      'ALL': generateCurve(24033.86, 100, 0.11, 2.1, now, 90)
    }
  },
  {
    id: 'bovespa',
    symbol: '^BVSP',
    name: 'Ibovespa Index',
    shortName: 'Bovespa',
    country: 'Brazil',
    flag: '🇧🇷',
    region: 'Americas',
    currency: 'BRL',
    exchange: 'B3 Exchange',
    provider: 'B3 (Brasil Bolsa Balcão)',
    currentLevel: 132450.00,
    previousClose: 131800.00,
    change: 650.00,
    changePercent: 0.49,
    dayLow: 131500.00,
    dayHigh: 132900.00,
    fiftyTwoWeekLow: 112000.00,
    fiftyTwoWeekHigh: 137469.00,
    allTimeHigh: 137469.00,
    athDate: '2026-08-28',
    drawdownFromATH: -3.65,
    marketCapUSD: '$780 Billion',
    constituentsCount: 86,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Every four months (Jan, May, Sep)',
    inceptionYear: 1968,
    baseDate: '1968-01-02',
    baseValue: 100,
    description: 'The benchmark index of around 85 stocks traded on the B3 in São Paulo, accounting for 70% of Brazil’s equity trading volume.',
    tradingHours: {
      timezone: 'America/Sao_Paulo',
      timezoneLabel: 'BRT (UTC-3)',
      utcOffset: -3,
      openLocal: '10:00',
      closeLocal: '17:00'
    },
    performance: {
      '1D': 0.49,
      '1W': -0.80,
      '1M': -2.10,
      '3M': 6.80,
      '6M': 3.20,
      'YTD': -1.40,
      '1Y': 14.50,
      '3Y': 21.00,
      '5Y': 28.40,
      '10Y': 140.20
    },
    valuations: {
      peRatio: 8.4,
      forwardPE: 7.8,
      pbRatio: 1.25,
      dividendYield: 6.80,
      historicalPE: {
        min10Y: 6.1,
        max10Y: 15.8,
        mean10Y: 10.2,
        sd10Y: 2.3,
        status: 'Undervalued'
      }
    },
    macro: {
      centralBank: 'Banco Central do Brasil',
      policyRate: 10.75,
      sovereignYield10Y: 12.10,
      inflationYoY: 4.2,
      equityRiskPremium: -0.20
    },
    sectors: [
      { name: 'Financials', percentage: 28.5, color: '#00D26A' },
      { name: 'Materials', percentage: 22.1, color: '#64748B' },
      { name: 'Energy', percentage: 16.8, color: '#EAB308' },
      { name: 'Utilities', percentage: 10.2, color: '#14B8A6' }
    ],
    constituents: [
      { ticker: 'VALE3', name: 'Vale S.A.', weight: 12.4, sector: 'Materials', price: 62.10, changePercent: 1.20 },
      { ticker: 'PETR4', name: 'Petrobras (Pref)', weight: 8.9, sector: 'Energy', price: 36.80, changePercent: -0.40 },
      { ticker: 'ITUB4', name: 'Itaú Unibanco', weight: 7.4, sector: 'Financials', price: 35.20, changePercent: 0.60 }
    ],
    sparkline: [135000, 134200, 133800, 134500, 134100, 133500, 133200, 132800, 132400, 132100, 132600, 133000, 132800, 132200, 131900, 131500, 131800, 132100, 132400, 132000, 131700, 132100, 132300, 131900, 132200, 132000, 131800, 131800, 132100, 132450],
    timeSeries: {
      '1D': generateIntraday(132450, 131900),
      '1W': generateCurve(132450, 7, 0.006, -0.008, now, 1),
      '1M': generateCurve(132450, 30, 0.015, -0.021, now, 1),
      '6M': generateCurve(132450, 26, 0.030, 0.032, now, 7),
      '1Y': generateCurve(132450, 52, 0.045, 0.145, now, 7),
      '5Y': generateCurve(132450, 60, 0.10, 0.284, now, 30),
      'ALL': generateCurve(132450, 100, 0.18, 1.8, now, 90)
    }
  },

  // ==========================================
  // EUROPE
  // ==========================================
  {
    id: 'ftse100',
    symbol: '^FTSE',
    name: 'FTSE 100 Index',
    shortName: 'FTSE 100',
    country: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    currency: 'GBP',
    exchange: 'London Stock Exchange',
    provider: 'FTSE Russell',
    currentLevel: 8282.76,
    previousClose: 8246.90,
    change: 35.86,
    changePercent: 0.43,
    dayLow: 8225.40,
    dayHigh: 8305.10,
    fiftyTwoWeekLow: 7384.18,
    fiftyTwoWeekHigh: 8487.71,
    allTimeHigh: 8487.71,
    athDate: '2026-05-15',
    drawdownFromATH: -2.42,
    marketCapUSD: '$2.6 Trillion',
    constituentsCount: 100,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Quarterly (March, June, September, December)',
    inceptionYear: 1984,
    baseDate: '1984-01-03',
    baseValue: 1000,
    description: 'The premier barometer of the UK equity market, representing the 100 largest UK-domiciled qualifying companies on the London Stock Exchange.',
    tradingHours: {
      timezone: 'Europe/London',
      timezoneLabel: 'BST (UTC+1)',
      utcOffset: 1,
      openLocal: '08:00',
      closeLocal: '16:30'
    },
    performance: {
      '1D': 0.43,
      '1W': 0.65,
      '1M': -0.40,
      '3M': 1.80,
      '6M': 4.50,
      'YTD': 7.10,
      '1Y': 9.80,
      '3Y': 16.40,
      '5Y': 38.20,
      '10Y': 24.50
    },
    valuations: {
      peRatio: 12.8,
      forwardPE: 11.2,
      pbRatio: 1.72,
      dividendYield: 3.75,
      historicalPE: {
        min10Y: 10.4,
        max10Y: 18.2,
        mean10Y: 14.1,
        sd10Y: 1.9,
        status: 'Fair Value'
      }
    },
    macro: {
      centralBank: 'Bank of England',
      policyRate: 5.00,
      sovereignYield10Y: 4.01,
      inflationYoY: 2.2,
      equityRiskPremium: 3.80
    },
    sectors: [
      { name: 'Financials', percentage: 20.4, color: '#00D26A' },
      { name: 'Consumer Staples', percentage: 17.2, color: '#EC4899' },
      { name: 'Health Care', percentage: 13.8, color: '#38BDF8' },
      { name: 'Energy', percentage: 12.5, color: '#EAB308' },
      { name: 'Industrials', percentage: 11.4, color: '#F97316' },
      { name: 'Materials', percentage: 9.8, color: '#64748B' }
    ],
    constituents: [
      { ticker: 'AZN', name: 'AstraZeneca PLC', weight: 8.6, sector: 'Health Care', price: 118.50, changePercent: -0.20 },
      { ticker: 'SHEL', name: 'Shell PLC', weight: 8.1, sector: 'Energy', price: 27.20, changePercent: 0.80 },
      { ticker: 'HSBA', name: 'HSBC Holdings PLC', weight: 6.4, sector: 'Financials', price: 6.85, changePercent: 0.50 },
      { ticker: 'ULVR', name: 'Unilever PLC', weight: 5.2, sector: 'Consumer Staples', price: 47.90, changePercent: -0.15 },
      { ticker: 'BP', name: 'BP PLC', weight: 3.8, sector: 'Energy', price: 4.25, changePercent: 0.90 }
    ],
    sparkline: [8250, 8270, 8260, 8280, 8295, 8310, 8290, 8305, 8320, 8310, 8290, 8270, 8280, 8295, 8310, 8300, 8280, 8265, 8275, 8290, 8280, 8260, 8250, 8265, 8270, 8260, 8275, 8246, 8260, 8282],
    timeSeries: {
      '1D': generateIntraday(8282.76, 8250.00),
      '1W': generateCurve(8282.76, 7, 0.003, 0.006, now, 1),
      '1M': generateCurve(8282.76, 30, 0.006, -0.004, now, 1),
      '6M': generateCurve(8282.76, 26, 0.012, 0.045, now, 7),
      '1Y': generateCurve(8282.76, 52, 0.020, 0.098, now, 7),
      '5Y': generateCurve(8282.76, 60, 0.05, 0.382, now, 30),
      'ALL': generateCurve(8282.76, 100, 0.09, 1.2, now, 90)
    }
  },
  {
    id: 'dax40',
    symbol: '^GDAXI',
    name: 'DAX 40 Index',
    shortName: 'DAX 40',
    country: 'Germany',
    flag: '🇩🇪',
    region: 'Europe',
    currency: 'EUR',
    exchange: 'Frankfurt Stock Exchange',
    provider: 'Deutsche Börse',
    currentLevel: 19475.20,
    previousClose: 19380.50,
    change: 94.70,
    changePercent: 0.49,
    dayLow: 19320.00,
    dayHigh: 19510.00,
    fiftyTwoWeekLow: 14630.00,
    fiftyTwoWeekHigh: 19510.00,
    allTimeHigh: 19510.00,
    athDate: '2026-09-28',
    drawdownFromATH: -0.18,
    marketCapUSD: '$2.1 Trillion',
    constituentsCount: 40,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Quarterly',
    inceptionYear: 1988,
    baseDate: '1987-12-30',
    baseValue: 1000,
    description: 'Tracks the 40 largest and most liquid German blue-chip companies traded on the Frankfurt Stock Exchange (XETRA).',
    tradingHours: {
      timezone: 'Europe/Berlin',
      timezoneLabel: 'CEST (UTC+2)',
      utcOffset: 2,
      openLocal: '09:00',
      closeLocal: '17:30'
    },
    performance: {
      '1D': 0.49,
      '1W': 2.10,
      '1M': 4.80,
      '3M': 6.20,
      '6M': 7.40,
      'YTD': 16.20,
      '1Y': 27.50,
      '3Y': 26.80,
      '5Y': 56.10,
      '10Y': 102.50
    },
    valuations: {
      peRatio: 14.5,
      forwardPE: 12.8,
      pbRatio: 1.68,
      dividendYield: 2.85,
      historicalPE: {
        min10Y: 11.2,
        max10Y: 21.0,
        mean10Y: 14.8,
        sd10Y: 2.4,
        status: 'Fair Value'
      }
    },
    macro: {
      centralBank: 'European Central Bank',
      policyRate: 3.50,
      sovereignYield10Y: 2.18,
      inflationYoY: 1.9,
      equityRiskPremium: 4.71
    },
    sectors: [
      { name: 'Industrials', percentage: 22.8, color: '#F97316' },
      { name: 'Information Technology', percentage: 18.2, color: '#2D68FF' },
      { name: 'Financials', percentage: 16.5, color: '#00D26A' },
      { name: 'Consumer Discretionary', percentage: 13.9, color: '#FFB020' },
      { name: 'Health Care', percentage: 11.4, color: '#38BDF8' }
    ],
    constituents: [
      { ticker: 'SAP', name: 'SAP SE', weight: 12.8, sector: 'Technology', price: 202.50, changePercent: 1.10 },
      { ticker: 'SIE', name: 'Siemens AG', weight: 9.8, sector: 'Industrials', price: 178.40, changePercent: 0.60 },
      { ticker: 'ALV', name: 'Allianz SE', weight: 8.1, sector: 'Financials', price: 288.60, changePercent: 0.35 },
      { ticker: 'DTE', name: 'Deutsche Telekom', weight: 6.5, sector: 'Communication Services', price: 26.10, changePercent: 0.15 },
      { ticker: 'AIR', name: 'Airbus SE', weight: 5.8, sector: 'Industrials', price: 135.20, changePercent: 0.80 }
    ],
    sparkline: [18600, 18750, 18700, 18850, 18920, 18880, 19010, 19120, 19080, 19180, 19250, 19200, 19300, 19350, 19320, 19390, 19420, 19380, 19410, 19450, 19420, 19460, 19430, 19480, 19450, 19490, 19440, 19380, 19420, 19475],
    timeSeries: {
      '1D': generateIntraday(19475.20, 19390.00),
      '1W': generateCurve(19475.20, 7, 0.004, 0.021, now, 1),
      '1M': generateCurve(19475.20, 30, 0.009, 0.048, now, 1),
      '6M': generateCurve(19475.20, 26, 0.016, 0.074, now, 7),
      '1Y': generateCurve(19475.20, 52, 0.026, 0.275, now, 7),
      '5Y': generateCurve(19475.20, 60, 0.07, 0.561, now, 30),
      'ALL': generateCurve(19475.20, 100, 0.12, 2.5, now, 90)
    }
  },
  {
    id: 'cac40',
    symbol: '^FCHI',
    name: 'CAC 40 Index',
    shortName: 'CAC 40',
    country: 'France',
    flag: '🇫🇷',
    region: 'Europe',
    currency: 'EUR',
    exchange: 'Euronext Paris',
    provider: 'Euronext',
    currentLevel: 7720.50,
    previousClose: 7685.20,
    change: 35.30,
    changePercent: 0.46,
    dayLow: 7650.00,
    dayHigh: 7750.00,
    fiftyTwoWeekLow: 6780.00,
    fiftyTwoWeekHigh: 8259.19,
    allTimeHigh: 8259.19,
    athDate: '2026-05-10',
    drawdownFromATH: -6.52,
    marketCapUSD: '$2.5 Trillion',
    constituentsCount: 40,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Quarterly',
    inceptionYear: 1987,
    baseDate: '1987-12-31',
    baseValue: 1000,
    description: 'The benchmark French stock market index representing 40 most significant equities on the Euronext Paris exchange, world-renowned for luxury goods and industrials.',
    tradingHours: {
      timezone: 'Europe/Paris',
      timezoneLabel: 'CEST (UTC+2)',
      utcOffset: 2,
      openLocal: '09:00',
      closeLocal: '17:30'
    },
    performance: {
      '1D': 0.46,
      '1W': 1.90,
      '1M': 3.50,
      '3M': -0.80,
      '6M': -4.20,
      'YTD': 2.40,
      '1Y': 8.60,
      '3Y': 18.20,
      '5Y': 44.10,
      '10Y': 78.40
    },
    valuations: {
      peRatio: 14.9,
      forwardPE: 13.2,
      pbRatio: 1.82,
      dividendYield: 3.15,
      historicalPE: {
        min10Y: 11.5,
        max10Y: 22.4,
        mean10Y: 15.6,
        sd10Y: 2.2,
        status: 'Fair Value'
      }
    },
    macro: {
      centralBank: 'European Central Bank',
      policyRate: 3.50,
      sovereignYield10Y: 2.92,
      inflationYoY: 1.5,
      equityRiskPremium: 3.79
    },
    sectors: [
      { name: 'Consumer Discretionary', percentage: 26.2, color: '#FFB020' },
      { name: 'Industrials', percentage: 24.8, color: '#F97316' },
      { name: 'Financials', percentage: 11.5, color: '#00D26A' },
      { name: 'Health Care', percentage: 10.4, color: '#38BDF8' },
      { name: 'Energy', percentage: 9.8, color: '#EAB308' }
    ],
    constituents: [
      { ticker: 'MC', name: 'LVMH Moët Hennessy', weight: 10.2, sector: 'Consumer Discretionary', price: 685.00, changePercent: 2.40 },
      { ticker: 'TTE', name: 'TotalEnergies SE', weight: 8.4, sector: 'Energy', price: 61.20, changePercent: -0.30 },
      { ticker: 'SU', name: 'Schneider Electric SE', weight: 7.6, sector: 'Industrials', price: 238.40, changePercent: 0.85 },
      { ticker: 'SAN', name: 'Sanofi SA', weight: 6.8, sector: 'Health Care', price: 104.20, changePercent: -0.10 },
      { ticker: 'OR', name: "L'Oréal SA", weight: 6.2, sector: 'Consumer Staples', price: 382.50, changePercent: 1.15 }
    ],
    sparkline: [7450, 7490, 7470, 7520, 7560, 7530, 7580, 7620, 7590, 7640, 7680, 7650, 7690, 7720, 7680, 7710, 7730, 7700, 7680, 7720, 7740, 7710, 7730, 7690, 7720, 7700, 7710, 7685, 7700, 7720],
    timeSeries: {
      '1D': generateIntraday(7720.50, 7690.00),
      '1W': generateCurve(7720.50, 7, 0.004, 0.019, now, 1),
      '1M': generateCurve(7720.50, 30, 0.008, 0.035, now, 1),
      '6M': generateCurve(7720.50, 26, 0.018, -0.042, now, 7),
      '1Y': generateCurve(7720.50, 52, 0.028, 0.086, now, 7),
      '5Y': generateCurve(7720.50, 60, 0.07, 0.441, now, 30),
      'ALL': generateCurve(7720.50, 100, 0.12, 1.8, now, 90)
    }
  },
  {
    id: 'eurostoxx50',
    symbol: '^STOXX50E',
    name: 'Euro Stoxx 50 Index',
    shortName: 'Euro Stoxx 50',
    country: 'Eurozone',
    flag: '🇪🇺',
    region: 'Europe',
    currency: 'EUR',
    exchange: 'Pan-European Exchanges',
    provider: 'STOXX Ltd.',
    currentLevel: 5040.80,
    previousClose: 5015.40,
    change: 25.40,
    changePercent: 0.51,
    dayLow: 4995.00,
    dayHigh: 5060.00,
    fiftyTwoWeekLow: 4000.00,
    fiftyTwoWeekHigh: 5120.00,
    allTimeHigh: 5522.42,
    athDate: '2000-03-06',
    drawdownFromATH: -8.72,
    marketCapUSD: '$4.4 Trillion',
    constituentsCount: 50,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Annual (September) with quarterly reviews',
    inceptionYear: 1998,
    baseDate: '1991-12-31',
    baseValue: 1000,
    description: 'Europe’s leading blue-chip index for the eurozone, providing a representation of supersector leaders across 8 eurozone countries.',
    tradingHours: {
      timezone: 'Europe/Frankfurt',
      timezoneLabel: 'CEST (UTC+2)',
      utcOffset: 2,
      openLocal: '09:00',
      closeLocal: '17:30'
    },
    performance: {
      '1D': 0.51,
      '1W': 2.05,
      '1M': 3.90,
      '3M': 2.80,
      '6M': 3.20,
      'YTD': 11.80,
      '1Y': 20.40,
      '3Y': 26.50,
      '5Y': 51.20,
      '10Y': 64.80
    },
    valuations: {
      peRatio: 14.1,
      forwardPE: 12.4,
      pbRatio: 1.74,
      dividendYield: 3.20,
      historicalPE: {
        min10Y: 10.8,
        max10Y: 20.2,
        mean10Y: 14.5,
        sd10Y: 2.1,
        status: 'Fair Value'
      }
    },
    macro: {
      centralBank: 'European Central Bank',
      policyRate: 3.50,
      sovereignYield10Y: 2.18,
      inflationYoY: 1.8,
      equityRiskPremium: 4.91
    },
    sectors: [
      { name: 'Financials', percentage: 22.4, color: '#00D26A' },
      { name: 'Information Technology', percentage: 16.8, color: '#2D68FF' },
      { name: 'Industrials', percentage: 15.9, color: '#F97316' },
      { name: 'Consumer Discretionary', percentage: 15.1, color: '#FFB020' },
      { name: 'Health Care', percentage: 8.5, color: '#38BDF8' }
    ],
    constituents: [
      { ticker: 'ASML', name: 'ASML Holding NV', weight: 8.8, sector: 'Technology', price: 775.00, changePercent: 1.40 },
      { ticker: 'SAP', name: 'SAP SE', weight: 6.9, sector: 'Technology', price: 202.50, changePercent: 1.10 },
      { ticker: 'MC', name: 'LVMH Moët Hennessy', weight: 5.6, sector: 'Consumer Discretionary', price: 685.00, changePercent: 2.40 },
      { ticker: 'TTE', name: 'TotalEnergies SE', weight: 4.5, sector: 'Energy', price: 61.20, changePercent: -0.30 },
      { ticker: 'SIE', name: 'Siemens AG', weight: 4.2, sector: 'Industrials', price: 178.40, changePercent: 0.60 }
    ],
    sparkline: [4820, 4850, 4840, 4880, 4910, 4890, 4930, 4960, 4940, 4980, 5010, 4990, 5020, 5040, 5010, 5030, 5050, 5030, 5010, 5030, 5050, 5030, 5040, 5020, 5035, 5020, 5030, 5015, 5025, 5040],
    timeSeries: {
      '1D': generateIntraday(5040.80, 5020.00),
      '1W': generateCurve(5040.80, 7, 0.004, 0.020, now, 1),
      '1M': generateCurve(5040.80, 30, 0.008, 0.039, now, 1),
      '6M': generateCurve(5040.80, 26, 0.016, 0.032, now, 7),
      '1Y': generateCurve(5040.80, 52, 0.025, 0.204, now, 7),
      '5Y': generateCurve(5040.80, 60, 0.06, 0.512, now, 30),
      'ALL': generateCurve(5040.80, 100, 0.12, 1.9, now, 90)
    }
  },

  // ==========================================
  // ASIA-PACIFIC
  // ==========================================
  {
    id: 'nifty50',
    symbol: '^NSEI',
    name: 'Nifty 50 Index',
    shortName: 'Nifty 50',
    country: 'India',
    flag: '🇮🇳',
    region: 'Asia-Pacific',
    currency: 'INR',
    exchange: 'National Stock Exchange of India (NSE)',
    provider: 'NSE Indices Limited',
    currentLevel: 25810.85,
    previousClose: 25796.90,
    change: 13.95,
    changePercent: 0.05,
    dayLow: 25730.00,
    dayHigh: 25925.00,
    fiftyTwoWeekLow: 18837.85,
    fiftyTwoWeekHigh: 26277.35,
    allTimeHigh: 26277.35,
    athDate: '2026-09-27',
    drawdownFromATH: -1.78,
    marketCapUSD: '$2.8 Trillion',
    constituentsCount: 50,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Semi-annually (March and September)',
    inceptionYear: 1996,
    baseDate: '1995-11-03',
    baseValue: 1000,
    description: 'The flagship benchmark of the National Stock Exchange of India, representing 50 of the largest and most liquid Indian companies spanning 13 sectors.',
    tradingHours: {
      timezone: 'Asia/Kolkata',
      timezoneLabel: 'IST (UTC+5:30)',
      utcOffset: 5.5,
      openLocal: '09:15',
      closeLocal: '15:30'
    },
    performance: {
      '1D': 0.05,
      '1W': 0.85,
      '1M': 3.10,
      '3M': 7.60,
      '6M': 16.50,
      'YTD': 19.80,
      '1Y': 32.40,
      '3Y': 46.20,
      '5Y': 128.50,
      '10Y': 225.40
    },
    valuations: {
      peRatio: 23.9,
      forwardPE: 20.8,
      pbRatio: 4.15,
      dividendYield: 1.20,
      historicalPE: {
        min10Y: 17.5,
        max10Y: 34.2,
        mean10Y: 22.4,
        sd10Y: 3.1,
        status: 'Fair Value'
      }
    },
    macro: {
      centralBank: 'Reserve Bank of India',
      policyRate: 6.50,
      sovereignYield10Y: 6.78,
      inflationYoY: 3.65,
      equityRiskPremium: -2.60
    },
    sectors: [
      { name: 'Financial Services', percentage: 33.2, color: '#00D26A' },
      { name: 'Information Technology', percentage: 14.5, color: '#2D68FF' },
      { name: 'Oil, Gas & Consumable Fuels', percentage: 11.8, color: '#EAB308' },
      { name: 'Fast Moving Consumer Goods', percentage: 8.9, color: '#EC4899' },
      { name: 'Automobile and Auto Components', percentage: 7.6, color: '#FFB020' },
      { name: 'Healthcare', percentage: 5.4, color: '#38BDF8' },
      { name: 'Construction', percentage: 4.2, color: '#F97316' },
      { name: 'Metals & Mining', percentage: 3.8, color: '#64748B' },
      { name: 'Telecommunication', percentage: 3.5, color: '#A855F7' }
    ],
    constituents: [
      { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd.', weight: 11.4, sector: 'Financial Services', price: 1735.00, changePercent: -0.20 },
      { ticker: 'RELIANCE', name: 'Reliance Industries Ltd.', weight: 9.8, sector: 'Energy & Tech', price: 2985.00, changePercent: 0.45 },
      { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd.', weight: 7.9, sector: 'Financial Services', price: 1280.00, changePercent: 0.30 },
      { ticker: 'INFY', name: 'Infosys Ltd.', weight: 5.8, sector: 'Information Technology', price: 1890.00, changePercent: -0.65 },
      { ticker: 'ITC', name: 'ITC Ltd.', weight: 4.2, sector: 'Consumer Goods', price: 512.00, changePercent: 0.15 },
      { ticker: 'TCS', name: 'Tata Consultancy Services', weight: 3.9, sector: 'Information Technology', price: 4260.00, changePercent: 0.10 },
      { ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', weight: 3.8, sector: 'Telecommunications', price: 1740.00, changePercent: 1.20 },
      { ticker: 'LT', name: 'Larsen & Toubro Ltd.', weight: 3.5, sector: 'Construction', price: 3680.00, changePercent: -0.40 },
      { ticker: 'SBIN', name: 'State Bank of India', weight: 2.8, sector: 'Financial Services', price: 795.00, changePercent: 0.85 },
      { ticker: 'AXISBANK', name: 'Axis Bank Ltd.', weight: 2.6, sector: 'Financial Services', price: 1230.00, changePercent: 0.25 }
    ],
    sparkline: [24800, 24950, 24880, 25050, 25200, 25150, 25300, 25420, 25380, 25500, 25620, 25580, 25710, 25800, 25750, 25850, 25920, 25880, 25950, 26050, 26150, 26270, 26180, 26090, 25950, 25880, 25820, 25796, 25800, 25810],
    timeSeries: {
      '1D': generateIntraday(25810.85, 25800.00),
      '1W': generateCurve(25810.85, 7, 0.003, 0.008, now, 1),
      '1M': generateCurve(25810.85, 30, 0.007, 0.031, now, 1),
      '6M': generateCurve(25810.85, 26, 0.015, 0.165, now, 7),
      '1Y': generateCurve(25810.85, 52, 0.025, 0.324, now, 7),
      '5Y': generateCurve(25810.85, 60, 0.06, 1.285, now, 30),
      'ALL': generateCurve(25810.85, 100, 0.12, 6.5, now, 90)
    }
  },
  {
    id: 'sensex',
    symbol: '^BSESN',
    name: 'BSE Sensex 30',
    shortName: 'Sensex',
    country: 'India',
    flag: '🇮🇳',
    region: 'Asia-Pacific',
    currency: 'INR',
    exchange: 'BSE Limited (Bombay Stock Exchange)',
    provider: 'S&P Dow Jones / Asia Index Pvt Ltd',
    currentLevel: 84300.15,
    previousClose: 84266.29,
    change: 33.86,
    changePercent: 0.04,
    dayLow: 84050.00,
    dayHigh: 84680.00,
    fiftyTwoWeekLow: 63183.46,
    fiftyTwoWeekHigh: 85978.25,
    allTimeHigh: 85978.25,
    athDate: '2026-09-27',
    drawdownFromATH: -1.95,
    marketCapUSD: '$2.5 Trillion',
    constituentsCount: 30,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Semi-annually (June and December)',
    inceptionYear: 1986,
    baseDate: '1978-1979',
    baseValue: 100,
    description: 'India’s oldest stock market benchmark, tracking 30 financially sound and well-established blue-chip companies listed on the Bombay Stock Exchange.',
    tradingHours: {
      timezone: 'Asia/Kolkata',
      timezoneLabel: 'IST (UTC+5:30)',
      utcOffset: 5.5,
      openLocal: '09:15',
      closeLocal: '15:30'
    },
    performance: {
      '1D': 0.04,
      '1W': 0.78,
      '1M': 3.00,
      '3M': 7.40,
      '6M': 15.80,
      'YTD': 19.20,
      '1Y': 31.80,
      '3Y': 44.10,
      '5Y': 122.40,
      '10Y': 214.20
    },
    valuations: {
      peRatio: 24.2,
      forwardPE: 21.1,
      pbRatio: 4.25,
      dividendYield: 1.15,
      historicalPE: {
        min10Y: 17.8,
        max10Y: 35.1,
        mean10Y: 22.8,
        sd10Y: 3.2,
        status: 'Fair Value'
      }
    },
    macro: {
      centralBank: 'Reserve Bank of India',
      policyRate: 6.50,
      sovereignYield10Y: 6.78,
      inflationYoY: 3.65,
      equityRiskPremium: -2.65
    },
    sectors: [
      { name: 'Financial Services', percentage: 36.5, color: '#00D26A' },
      { name: 'Information Technology', percentage: 15.8, color: '#2D68FF' },
      { name: 'Oil & Gas', percentage: 11.2, color: '#EAB308' },
      { name: 'Consumer Goods', percentage: 9.4, color: '#EC4899' },
      { name: 'Automobile', percentage: 7.8, color: '#FFB020' }
    ],
    constituents: [
      { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd.', weight: 13.2, sector: 'Financial Services', price: 1735.00, changePercent: -0.20 },
      { ticker: 'RELIANCE', name: 'Reliance Industries Ltd.', weight: 11.1, sector: 'Energy & Tech', price: 2985.00, changePercent: 0.45 },
      { ticker: 'ICICIBANK', name: 'ICICI Bank Ltd.', weight: 8.9, sector: 'Financial Services', price: 1280.00, changePercent: 0.30 },
      { ticker: 'INFY', name: 'Infosys Ltd.', weight: 6.8, sector: 'Technology', price: 1890.00, changePercent: -0.65 },
      { ticker: 'ITC', name: 'ITC Ltd.', weight: 4.8, sector: 'Consumer Goods', price: 512.00, changePercent: 0.15 }
    ],
    sparkline: [81200, 81600, 81400, 81900, 82400, 82200, 82700, 83100, 82900, 83400, 83800, 83600, 84100, 84500, 84300, 84700, 85000, 84800, 85200, 85600, 85970, 85600, 85200, 84800, 84500, 84400, 84350, 84266, 84280, 84300],
    timeSeries: {
      '1D': generateIntraday(84300.15, 84270.00),
      '1W': generateCurve(84300.15, 7, 0.003, 0.008, now, 1),
      '1M': generateCurve(84300.15, 30, 0.007, 0.030, now, 1),
      '6M': generateCurve(84300.15, 26, 0.015, 0.158, now, 7),
      '1Y': generateCurve(84300.15, 52, 0.024, 0.318, now, 7),
      '5Y': generateCurve(84300.15, 60, 0.06, 1.224, now, 30),
      'ALL': generateCurve(84300.15, 100, 0.12, 6.2, now, 90)
    }
  },
  {
    id: 'nikkei225',
    symbol: '^N225',
    name: 'Nikkei 225 Stock Average',
    shortName: 'Nikkei 225',
    country: 'Japan',
    flag: '🇯🇵',
    region: 'Asia-Pacific',
    currency: 'JPY',
    exchange: 'Tokyo Stock Exchange',
    provider: 'Nikkei Inc.',
    currentLevel: 38650.00,
    previousClose: 38925.63,
    change: -275.63,
    changePercent: -0.71,
    dayLow: 38400.00,
    dayHigh: 39150.00,
    fiftyTwoWeekLow: 30540.00,
    fiftyTwoWeekHigh: 42426.77,
    allTimeHigh: 42426.77,
    athDate: '2026-07-11',
    drawdownFromATH: -8.90,
    marketCapUSD: '$4.2 Trillion',
    constituentsCount: 225,
    weightingType: 'Price Weighted',
    rebalanceSchedule: 'Annual (October)',
    inceptionYear: 1950,
    baseDate: '1949-05-16',
    baseValue: 176.21,
    description: 'Japan’s most prominent price-weighted index tracking 225 top blue-chip companies on the Prime Market of the Tokyo Stock Exchange.',
    tradingHours: {
      timezone: 'Asia/Tokyo',
      timezoneLabel: 'JST (UTC+9)',
      utcOffset: 9,
      openLocal: '09:00',
      closeLocal: '15:30',
      lunchBreak: {
        start: '11:30',
        end: '12:30'
      }
    },
    performance: {
      '1D': -0.71,
      '1W': 1.40,
      '1M': 0.85,
      '3M': -2.50,
      '6M': -4.10,
      'YTD': 14.80,
      '1Y': 21.60,
      '3Y': 32.50,
      '5Y': 68.40,
      '10Y': 142.10
    },
    valuations: {
      peRatio: 16.5,
      forwardPE: 14.8,
      pbRatio: 1.48,
      dividendYield: 1.85,
      historicalPE: {
        min10Y: 12.1,
        max10Y: 24.5,
        mean10Y: 16.2,
        sd10Y: 2.5,
        status: 'Fair Value'
      }
    },
    macro: {
      centralBank: 'Bank of Japan',
      policyRate: 0.25,
      sovereignYield10Y: 0.85,
      inflationYoY: 2.8,
      equityRiskPremium: 5.21
    },
    sectors: [
      { name: 'Technology', percentage: 48.5, color: '#2D68FF' },
      { name: 'Consumer Goods', percentage: 22.4, color: '#EC4899' },
      { name: 'Industrials', percentage: 14.2, color: '#F97316' },
      { name: 'Materials', percentage: 6.8, color: '#64748B' },
      { name: 'Financials', percentage: 4.5, color: '#00D26A' }
    ],
    constituents: [
      { ticker: '9983', name: 'Fast Retailing Co. (Uniqlo)', weight: 10.4, sector: 'Consumer Goods', price: 48500, changePercent: -1.20 },
      { ticker: '8035', name: 'Tokyo Electron Ltd.', weight: 6.8, sector: 'Technology', price: 27800, changePercent: -0.80 },
      { ticker: '9984', name: 'SoftBank Group Corp.', weight: 4.8, sector: 'Technology', price: 9240, changePercent: 1.40 },
      { ticker: '6857', name: 'Advantest Corp.', weight: 4.5, sector: 'Technology', price: 7420, changePercent: -0.40 },
      { ticker: '6758', name: 'Sony Group Corp.', weight: 2.8, sector: 'Technology', price: 14200, changePercent: 0.60 }
    ],
    sparkline: [38100, 38300, 38200, 38500, 38800, 38700, 39100, 39300, 39050, 39250, 39400, 39200, 39050, 38800, 38950, 38700, 38850, 39000, 38750, 38900, 39100, 38950, 39050, 38800, 38700, 38900, 38800, 38925, 38780, 38650],
    timeSeries: {
      '1D': generateIntraday(38650, 38920),
      '1W': generateCurve(38650, 7, 0.005, 0.014, now, 1),
      '1M': generateCurve(38650, 30, 0.011, 0.008, now, 1),
      '6M': generateCurve(38650, 26, 0.022, -0.041, now, 7),
      '1Y': generateCurve(38650, 52, 0.035, 0.216, now, 7),
      '5Y': generateCurve(38650, 60, 0.08, 0.684, now, 30),
      'ALL': generateCurve(38650, 100, 0.15, 2.2, now, 90)
    }
  },
  {
    id: 'hangseng',
    symbol: '^HSI',
    name: 'Hang Seng Index',
    shortName: 'Hang Seng',
    country: 'Hong Kong',
    flag: '🇭🇰',
    region: 'Asia-Pacific',
    currency: 'HKD',
    exchange: 'Hong Kong Stock Exchange (HKEX)',
    provider: 'Hang Seng Indexes Company',
    currentLevel: 21133.68,
    previousClose: 20632.30,
    change: 501.38,
    changePercent: 2.43,
    dayLow: 20580.00,
    dayHigh: 21250.00,
    fiftyTwoWeekLow: 14794.16,
    fiftyTwoWeekHigh: 21355.00,
    allTimeHigh: 33484.08,
    athDate: '2018-01-29',
    drawdownFromATH: -36.88,
    marketCapUSD: '$3.5 Trillion',
    constituentsCount: 82,
    weightingType: 'Capped Market Cap',
    rebalanceSchedule: 'Quarterly',
    inceptionYear: 1969,
    baseDate: '1964-07-31',
    baseValue: 100,
    description: 'The premier free-float market-capitalization-weighted index monitoring the largest and most liquid corporations on the Hong Kong Stock Exchange.',
    tradingHours: {
      timezone: 'Asia/Hong_Kong',
      timezoneLabel: 'HKT (UTC+8)',
      utcOffset: 8,
      openLocal: '09:30',
      closeLocal: '16:00',
      lunchBreak: {
        start: '12:00',
        end: '13:00'
      }
    },
    performance: {
      '1D': 2.43,
      '1W': 10.50,
      '1M': 18.40,
      '3M': 16.80,
      '6M': 24.50,
      'YTD': 23.90,
      '1Y': 18.20,
      '3Y': -14.20,
      '5Y': -22.50,
      '10Y': -12.40
    },
    valuations: {
      peRatio: 10.2,
      forwardPE: 9.1,
      pbRatio: 1.05,
      dividendYield: 4.10,
      historicalPE: {
        min10Y: 7.2,
        max10Y: 16.5,
        mean10Y: 11.4,
        sd10Y: 2.1,
        status: 'Undervalued'
      }
    },
    macro: {
      centralBank: 'Hong Kong Monetary Authority',
      policyRate: 5.25,
      sovereignYield10Y: 3.12,
      inflationYoY: 2.5,
      equityRiskPremium: 6.68
    },
    sectors: [
      { name: 'Information Technology', percentage: 31.4, color: '#2D68FF' },
      { name: 'Financials', percentage: 29.8, color: '#00D26A' },
      { name: 'Consumer Discretionary', percentage: 14.5, color: '#FFB020' },
      { name: 'Telecommunications', percentage: 6.2, color: '#A855F7' }
    ],
    constituents: [
      { ticker: '0700', name: 'Tencent Holdings Ltd.', weight: 8.4, sector: 'Technology', price: 442.00, changePercent: 3.20 },
      { ticker: '9988', name: 'Alibaba Group Holding', weight: 8.2, sector: 'Technology', price: 108.40, changePercent: 4.50 },
      { ticker: '0941', name: 'China Mobile Ltd.', weight: 5.8, sector: 'Telecommunications', price: 74.20, changePercent: 0.80 },
      { ticker: '1299', name: 'AIA Group Ltd.', weight: 5.6, sector: 'Financials', price: 68.50, changePercent: 1.90 },
      { ticker: '0939', name: 'China Construction Bank', weight: 4.9, sector: 'Financials', price: 6.12, changePercent: 1.10 }
    ],
    sparkline: [17500, 17700, 17650, 17800, 18050, 18200, 18150, 18300, 18450, 18350, 18600, 18850, 19100, 19450, 19900, 20300, 20150, 20450, 20700, 20550, 20850, 21100, 20950, 21200, 21050, 20800, 20750, 20632, 20850, 21133],
    timeSeries: {
      '1D': generateIntraday(21133.68, 20650.00),
      '1W': generateCurve(21133.68, 7, 0.012, 0.105, now, 1),
      '1M': generateCurve(21133.68, 30, 0.020, 0.184, now, 1),
      '6M': generateCurve(21133.68, 26, 0.035, 0.245, now, 7),
      '1Y': generateCurve(21133.68, 52, 0.045, 0.182, now, 7),
      '5Y': generateCurve(21133.68, 60, 0.09, -0.225, now, 30),
      'ALL': generateCurve(21133.68, 100, 0.15, 0.8, now, 90)
    }
  },
  {
    id: 'csi300',
    symbol: '000300.SS',
    name: 'CSI 300 Index',
    shortName: 'CSI 300',
    country: 'China',
    flag: '🇨🇳',
    region: 'Asia-Pacific',
    currency: 'CNY',
    exchange: 'Shanghai & Shenzhen Exchanges',
    provider: 'China Securities Index Co.',
    currentLevel: 4017.85,
    previousClose: 3888.50,
    change: 129.35,
    changePercent: 3.33,
    dayLow: 3870.00,
    dayHigh: 4040.00,
    fiftyTwoWeekLow: 3108.35,
    fiftyTwoWeekHigh: 4050.00,
    allTimeHigh: 5931.14,
    athDate: '2021-02-18',
    drawdownFromATH: -32.26,
    marketCapUSD: '$6.5 Trillion',
    constituentsCount: 300,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Semi-annually (June and December)',
    inceptionYear: 2005,
    baseDate: '2004-12-31',
    baseValue: 1000,
    description: 'The core benchmark of China’s domestic mainland A-share markets, covering 300 leading stocks from the Shanghai and Shenzhen stock exchanges.',
    tradingHours: {
      timezone: 'Asia/Shanghai',
      timezoneLabel: 'CST (UTC+8)',
      utcOffset: 8,
      openLocal: '09:30',
      closeLocal: '15:00',
      lunchBreak: {
        start: '11:30',
        end: '13:00'
      }
    },
    performance: {
      '1D': 3.33,
      '1W': 14.80,
      '1M': 22.40,
      '3M': 18.50,
      '6M': 17.20,
      'YTD': 17.50,
      '1Y': 12.40,
      '3Y': -18.50,
      '5Y': -8.40,
      '10Y': 24.20
    },
    valuations: {
      peRatio: 12.8,
      forwardPE: 11.2,
      pbRatio: 1.35,
      dividendYield: 3.10,
      historicalPE: {
        min10Y: 9.8,
        max10Y: 18.4,
        mean10Y: 13.5,
        sd10Y: 2.2,
        status: 'Undervalued'
      }
    },
    macro: {
      centralBank: "People's Bank of China",
      policyRate: 1.50,
      sovereignYield10Y: 2.05,
      inflationYoY: 0.6,
      equityRiskPremium: 5.76
    },
    sectors: [
      { name: 'Financials', percentage: 22.1, color: '#00D26A' },
      { name: 'Information Technology', percentage: 17.4, color: '#2D68FF' },
      { name: 'Consumer Staples', percentage: 14.8, color: '#EC4899' },
      { name: 'Industrials', percentage: 14.2, color: '#F97316' },
      { name: 'Materials', percentage: 8.5, color: '#64748B' }
    ],
    constituents: [
      { ticker: '600519', name: 'Kweichow Moutai', weight: 5.4, sector: 'Consumer Staples', price: 1750.00, changePercent: 4.80 },
      { ticker: '300750', name: 'Contemporary Amperex (CATL)', weight: 3.2, sector: 'Industrials', price: 245.00, changePercent: 5.20 },
      { ticker: '601318', name: 'Ping An Insurance', weight: 2.9, sector: 'Financials', price: 54.20, changePercent: 3.10 },
      { ticker: '600036', name: 'China Merchants Bank', weight: 2.2, sector: 'Financials', price: 38.60, changePercent: 2.40 },
      { ticker: '000333', name: 'Midea Group', weight: 1.8, sector: 'Consumer Discretionary', price: 76.50, changePercent: 1.80 }
    ],
    sparkline: [3250, 3280, 3270, 3310, 3350, 3330, 3380, 3420, 3400, 3450, 3510, 3560, 3640, 3720, 3810, 3890, 3840, 3910, 3960, 3920, 3980, 4030, 3990, 4020, 3980, 3940, 3910, 3888, 3950, 4017],
    timeSeries: {
      '1D': generateIntraday(4017.85, 3895.00),
      '1W': generateCurve(4017.85, 7, 0.015, 0.148, now, 1),
      '1M': generateCurve(4017.85, 30, 0.025, 0.224, now, 1),
      '6M': generateCurve(4017.85, 26, 0.038, 0.172, now, 7),
      '1Y': generateCurve(4017.85, 52, 0.045, 0.124, now, 7),
      '5Y': generateCurve(4017.85, 60, 0.08, -0.084, now, 30),
      'ALL': generateCurve(4017.85, 100, 0.15, 1.4, now, 90)
    }
  },
  {
    id: 'asx200',
    symbol: '^AXJO',
    name: 'S&P/ASX 200 Index',
    shortName: 'ASX 200',
    country: 'Australia',
    flag: '🇦🇺',
    region: 'Asia-Pacific',
    currency: 'AUD',
    exchange: 'Australian Securities Exchange',
    provider: 'S&P Dow Jones / ASX',
    currentLevel: 8203.70,
    previousClose: 8189.90,
    change: 13.80,
    changePercent: 0.17,
    dayLow: 8170.00,
    dayHigh: 8225.00,
    fiftyTwoWeekLow: 6751.30,
    fiftyTwoWeekHigh: 8246.20,
    allTimeHigh: 8246.20,
    athDate: '2026-09-24',
    drawdownFromATH: -0.52,
    marketCapUSD: '$1.7 Trillion',
    constituentsCount: 200,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Quarterly',
    inceptionYear: 2000,
    baseDate: '2000-03-31',
    baseValue: 3133.3,
    description: 'The premier institutional investable benchmark for the Australian equity market, tracking the top 200 eligible ASX-listed companies.',
    tradingHours: {
      timezone: 'Australia/Sydney',
      timezoneLabel: 'AEST (UTC+10)',
      utcOffset: 10,
      openLocal: '10:00',
      closeLocal: '16:00'
    },
    performance: {
      '1D': 0.17,
      '1W': 0.65,
      '1M': 1.80,
      '3M': 5.20,
      '6M': 7.80,
      'YTD': 8.90,
      '1Y': 18.20,
      '3Y': 14.80,
      '5Y': 36.40,
      '10Y': 65.20
    },
    valuations: {
      peRatio: 17.5,
      forwardPE: 16.1,
      pbRatio: 2.10,
      dividendYield: 3.65,
      historicalPE: {
        min10Y: 13.8,
        max10Y: 22.4,
        mean10Y: 16.9,
        sd10Y: 2.2,
        status: 'Fair Value'
      }
    },
    macro: {
      centralBank: 'Reserve Bank of Australia',
      policyRate: 4.35,
      sovereignYield10Y: 3.98,
      inflationYoY: 2.7,
      equityRiskPremium: 1.73
    },
    sectors: [
      { name: 'Financials', percentage: 33.5, color: '#00D26A' },
      { name: 'Materials', percentage: 21.2, color: '#64748B' },
      { name: 'Health Care', percentage: 9.8, color: '#38BDF8' },
      { name: 'Consumer Discretionary', percentage: 7.2, color: '#FFB020' },
      { name: 'Industrials', percentage: 6.8, color: '#F97316' }
    ],
    constituents: [
      { ticker: 'CBA', name: 'Commonwealth Bank of Australia', weight: 9.8, sector: 'Financials', price: 138.50, changePercent: 0.40 },
      { ticker: 'BHP', name: 'BHP Group Ltd.', weight: 9.2, sector: 'Materials', price: 44.20, changePercent: 0.90 },
      { ticker: 'CSL', name: 'CSL Limited', weight: 5.6, sector: 'Health Care', price: 298.00, changePercent: -0.20 },
      { ticker: 'NAB', name: 'National Australia Bank', weight: 4.4, sector: 'Financials', price: 38.90, changePercent: 0.15 },
      { ticker: 'WBC', name: 'Westpac Banking Corp.', weight: 3.9, sector: 'Financials', price: 32.40, changePercent: 0.20 }
    ],
    sparkline: [7980, 8020, 8010, 8050, 8080, 8060, 8100, 8140, 8120, 8150, 8180, 8160, 8190, 8220, 8200, 8225, 8240, 8220, 8210, 8230, 8245, 8230, 8220, 8210, 8225, 8210, 8200, 8189, 8195, 8203],
    timeSeries: {
      '1D': generateIntraday(8203.70, 8192.00),
      '1W': generateCurve(8203.70, 7, 0.003, 0.006, now, 1),
      '1M': generateCurve(8203.70, 30, 0.006, 0.018, now, 1),
      '6M': generateCurve(8203.70, 26, 0.014, 0.078, now, 7),
      '1Y': generateCurve(8203.70, 52, 0.022, 0.182, now, 7),
      '5Y': generateCurve(8203.70, 60, 0.05, 0.364, now, 30),
      'ALL': generateCurve(8203.70, 100, 0.10, 1.6, now, 90)
    }
  },

  // ==========================================
  // MIDDLE EAST & EMERGING
  // ==========================================
  {
    id: 'tasi',
    symbol: 'TASI',
    name: 'Tadawul All Share Index',
    shortName: 'TASI',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    region: 'Emerging',
    currency: 'SAR',
    exchange: 'Saudi Exchange (Tadawul)',
    provider: 'Saudi Tadawul Group',
    currentLevel: 12240.50,
    previousClose: 12195.10,
    change: 45.40,
    changePercent: 0.37,
    dayLow: 12150.00,
    dayHigh: 12290.00,
    fiftyTwoWeekLow: 10450.00,
    fiftyTwoWeekHigh: 12880.00,
    allTimeHigh: 20966.58,
    athDate: '2006-02-25',
    drawdownFromATH: -41.62,
    marketCapUSD: '$2.8 Trillion',
    constituentsCount: 220,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Quarterly',
    inceptionYear: 1985,
    baseDate: '1985-02-28',
    baseValue: 1000,
    description: 'The major stock index tracking all listed joint-stock companies in the Kingdom of Saudi Arabia, heavily influenced by global energy giants and banking institutions.',
    tradingHours: {
      timezone: 'Asia/Riyadh',
      timezoneLabel: 'AST (UTC+3)',
      utcOffset: 3,
      openLocal: '10:00',
      closeLocal: '15:00'
    },
    performance: {
      '1D': 0.37,
      '1W': 1.20,
      '1M': 2.40,
      '3M': 4.50,
      '6M': -2.10,
      'YTD': 2.80,
      '1Y': 11.20,
      '3Y': 12.80,
      '5Y': 54.20,
      '10Y': 98.40
    },
    valuations: {
      peRatio: 18.2,
      forwardPE: 16.5,
      pbRatio: 2.40,
      dividendYield: 3.40,
      historicalPE: {
        min10Y: 13.5,
        max10Y: 24.8,
        mean10Y: 17.9,
        sd10Y: 2.6,
        status: 'Fair Value'
      }
    },
    macro: {
      centralBank: 'Saudi Central Bank (SAMA)',
      policyRate: 5.50,
      sovereignYield10Y: 4.45,
      inflationYoY: 1.6,
      equityRiskPremium: 1.05
    },
    sectors: [
      { name: 'Financials', percentage: 41.5, color: '#00D26A' },
      { name: 'Energy', percentage: 24.8, color: '#EAB308' },
      { name: 'Materials', percentage: 14.2, color: '#64748B' },
      { name: 'Telecommunication', percentage: 8.5, color: '#A855F7' }
    ],
    constituents: [
      { ticker: '2222', name: 'Saudi Aramco', weight: 14.8, sector: 'Energy', price: 27.80, changePercent: 0.20 },
      { ticker: '1120', name: 'Al Rajhi Bank', weight: 12.4, sector: 'Financials', price: 88.50, changePercent: 0.65 },
      { ticker: '1180', name: 'Saudi National Bank', weight: 7.2, sector: 'Financials', price: 36.20, changePercent: 0.30 },
      { ticker: '7010', name: 'Saudi Telecom Co. (stc)', weight: 4.8, sector: 'Telecommunications', price: 41.50, changePercent: 0.10 }
    ],
    sparkline: [11800, 11850, 11920, 11890, 11950, 12010, 11980, 12050, 12110, 12080, 12150, 12190, 12160, 12210, 12250, 12220, 12190, 12230, 12260, 12220, 12250, 12280, 12240, 12260, 12230, 12210, 12195, 12195, 12210, 12240],
    timeSeries: {
      '1D': generateIntraday(12240.50, 12200.00),
      '1W': generateCurve(12240.50, 7, 0.003, 0.012, now, 1),
      '1M': generateCurve(12240.50, 30, 0.007, 0.024, now, 1),
      '6M': generateCurve(12240.50, 26, 0.016, -0.021, now, 7),
      '1Y': generateCurve(12240.50, 52, 0.025, 0.112, now, 7),
      '5Y': generateCurve(12240.50, 60, 0.07, 0.542, now, 30),
      'ALL': generateCurve(12240.50, 100, 0.14, 1.5, now, 90)
    }
  },
  {
    id: 'jse40',
    symbol: '^J200',
    name: 'FTSE/JSE Top 40 Index',
    shortName: 'JSE Top 40',
    country: 'South Africa',
    flag: '🇿🇦',
    region: 'Emerging',
    currency: 'ZAR',
    exchange: 'Johannesburg Stock Exchange',
    provider: 'FTSE / JSE',
    currentLevel: 76820.00,
    previousClose: 76450.00,
    change: 370.00,
    changePercent: 0.48,
    dayLow: 76200.00,
    dayHigh: 77100.00,
    fiftyTwoWeekLow: 64800.00,
    fiftyTwoWeekHigh: 78500.00,
    allTimeHigh: 78500.00,
    athDate: '2026-08-20',
    drawdownFromATH: -2.14,
    marketCapUSD: '$680 Billion',
    constituentsCount: 40,
    weightingType: 'Free-Float Market Cap',
    rebalanceSchedule: 'Quarterly',
    inceptionYear: 2002,
    baseDate: '2002-06-24',
    baseValue: 10399.5,
    description: 'Represents the 40 largest companies ranked by investable market cap on the Johannesburg Stock Exchange in South Africa.',
    tradingHours: {
      timezone: 'Africa/Johannesburg',
      timezoneLabel: 'SAST (UTC+2)',
      utcOffset: 2,
      openLocal: '09:00',
      closeLocal: '17:00'
    },
    performance: {
      '1D': 0.48,
      '1W': 1.60,
      '1M': 3.80,
      '3M': 6.90,
      '6M': 12.40,
      'YTD': 14.20,
      '1Y': 18.50,
      '3Y': 24.60,
      '5Y': 58.20,
      '10Y': 82.40
    },
    valuations: {
      peRatio: 13.4,
      forwardPE: 11.8,
      pbRatio: 1.62,
      dividendYield: 3.90,
      historicalPE: {
        min10Y: 10.2,
        max10Y: 19.5,
        mean10Y: 14.2,
        sd10Y: 2.1,
        status: 'Fair Value'
      }
    },
    macro: {
      centralBank: 'South African Reserve Bank',
      policyRate: 8.00,
      sovereignYield10Y: 10.25,
      inflationYoY: 4.4,
      equityRiskPremium: -2.79
    },
    sectors: [
      { name: 'Financials', percentage: 32.4, color: '#00D26A' },
      { name: 'Materials', percentage: 26.8, color: '#64748B' },
      { name: 'Consumer Services', percentage: 22.1, color: '#FFB020' },
      { name: 'Telecommunications', percentage: 8.5, color: '#A855F7' }
    ],
    constituents: [
      { ticker: 'NPN', name: 'Naspers Ltd.', weight: 11.2, sector: 'Consumer Services', price: 3850.00, changePercent: 1.80 },
      { ticker: 'FSR', name: 'FirstRand Ltd.', weight: 7.8, sector: 'Financials', price: 78.40, changePercent: 0.60 },
      { ticker: 'SBK', name: 'Standard Bank Group', weight: 6.5, sector: 'Financials', price: 218.00, changePercent: 0.35 }
    ],
    sparkline: [73200, 73500, 73800, 74100, 74000, 74500, 74900, 74700, 75200, 75600, 75400, 75900, 76300, 76100, 76500, 76800, 76600, 77000, 77300, 77100, 77400, 77200, 76900, 76700, 76900, 76700, 76500, 76450, 76600, 76820],
    timeSeries: {
      '1D': generateIntraday(76820, 76480),
      '1W': generateCurve(76820, 7, 0.004, 0.016, now, 1),
      '1M': generateCurve(76820, 30, 0.008, 0.038, now, 1),
      '6M': generateCurve(76820, 26, 0.018, 0.124, now, 7),
      '1Y': generateCurve(76820, 52, 0.028, 0.185, now, 7),
      '5Y': generateCurve(76820, 60, 0.07, 0.582, now, 30),
      'ALL': generateCurve(76820, 100, 0.13, 2.0, now, 90)
    }
  }
]

// ==========================================
// Real-Time Keyless Market Data Overlay
// ==========================================
// Real-Time Keyless Market Data Overlay
// ==========================================
import liveIndicesData from './generated/indices_live.json'

const livePayload = (liveIndicesData && typeof liveIndicesData === 'object') ? (liveIndicesData as any) : {}
const liveMap = livePayload.indices || livePayload || {}
const liveConstituentQuotes = livePayload.constituentQuotes || {}

globalIndices.forEach(idx => {
  const live = liveMap[idx.id]
  if (live) {
    if (typeof live.currentLevel === 'number') idx.currentLevel = live.currentLevel
    if (typeof live.previousClose === 'number') idx.previousClose = live.previousClose
    if (typeof live.change === 'number') idx.change = live.change
    if (typeof live.changePercent === 'number') idx.changePercent = live.changePercent
    if (typeof live.dayLow === 'number') idx.dayLow = live.dayLow
    if (typeof live.dayHigh === 'number') idx.dayHigh = live.dayHigh
    if (typeof live.fiftyTwoWeekLow === 'number') idx.fiftyTwoWeekLow = live.fiftyTwoWeekLow
    if (typeof live.fiftyTwoWeekHigh === 'number') idx.fiftyTwoWeekHigh = live.fiftyTwoWeekHigh
    if (typeof live.allTimeHigh === 'number') idx.allTimeHigh = live.allTimeHigh
    if (live.athDate) idx.athDate = live.athDate
    if (typeof live.drawdownFromATH === 'number') idx.drawdownFromATH = live.drawdownFromATH
    if (typeof live.volatility === 'number') idx.volatility = live.volatility
    if (typeof live.beta === 'number') idx.beta = live.beta

    if (live.performance) {
      idx.performance = { ...idx.performance, ...live.performance }
    }

    if (live.valuations) {
      if (typeof live.valuations.peRatio === 'number') idx.valuations.peRatio = live.valuations.peRatio
      if (typeof live.valuations.forwardPE === 'number') idx.valuations.forwardPE = live.valuations.forwardPE
      if (typeof live.valuations.dividendYield === 'number') idx.valuations.dividendYield = live.valuations.dividendYield
      if (typeof live.valuations.pbRatio === 'number') idx.valuations.pbRatio = live.valuations.pbRatio
    }

    // Dynamic valuation status based on 10Y mean and SD bands
    const meanPE = idx.valuations.historicalPE.mean10Y
    const sdPE = idx.valuations.historicalPE.sd10Y
    if (idx.valuations.peRatio > meanPE + sdPE) {
      idx.valuations.historicalPE.status = 'Overvalued'
    } else if (idx.valuations.peRatio < meanPE - sdPE) {
      idx.valuations.historicalPE.status = 'Undervalued'
    } else {
      idx.valuations.historicalPE.status = 'Fair Value'
    }

    if (Array.isArray(live.sparkline) && live.sparkline.length > 0) {
      idx.sparkline = live.sparkline
    }

    if (live.timeSeries) {
      if (live.timeSeries['1D'] && live.timeSeries['1D'].length > 0) idx.timeSeries['1D'] = live.timeSeries['1D']
      if (live.timeSeries['1W']) idx.timeSeries['1W'] = live.timeSeries['1W']
      if (live.timeSeries['1M']) idx.timeSeries['1M'] = live.timeSeries['1M']
      if (live.timeSeries['6M']) idx.timeSeries['6M'] = live.timeSeries['6M']
      if (live.timeSeries['1Y']) idx.timeSeries['1Y'] = live.timeSeries['1Y']
      if (live.timeSeries['5Y']) idx.timeSeries['5Y'] = live.timeSeries['5Y']
      if (live.timeSeries['ALL']) idx.timeSeries['ALL'] = live.timeSeries['ALL']
    }
  }
})

// ==========================================
// Phase 2 Metric Enrichment & Constituent Sync
// ==========================================
globalIndices.forEach(idx => {
  // 1. Overlay live constituent quotes and calculate contribution points
  idx.constituents.forEach(h => {
    const cleanTicker = h.ticker.split('.')[0].replace('-', '.')
    const q = liveConstituentQuotes[h.ticker] || liveConstituentQuotes[cleanTicker]
    if (q) {
      if (typeof q.price === 'number') h.price = q.price
      if (typeof q.changePercent === 'number') h.changePercent = q.changePercent
    }
    const pts = (h.weight / 100) * (h.changePercent / 100) * idx.currentLevel
    h.contributionPoints = Number(pts.toFixed(2))
  })

  // 2. Compute concentration metrics
  const sortedWeights = [...idx.constituents].map(c => c.weight).sort((a, b) => b - a)
  const top5 = Number(sortedWeights.slice(0, 5).reduce((a, b) => a + b, 0).toFixed(1))
  const top10 = Number(sortedWeights.slice(0, 10).reduce((a, b) => a + b, 0).toFixed(1))

  // HHI Calculation
  const topSquares = sortedWeights.reduce((sum, w) => sum + (w * w), 0)
  const tailWeight = Math.max(0, 100 - top10)
  const remCount = Math.max(1, idx.constituentsCount - sortedWeights.length)
  const avgTailWeight = tailWeight / remCount
  const tailHHI = remCount * (avgTailWeight * avgTailWeight)
  const hhiScore = Math.round(topSquares + tailHHI)

  let rating: 'Diversified' | 'Moderate Concentration' | 'High Concentration' = 'Diversified'
  if (top5 > 35 || hhiScore > 1000) {
    rating = 'High Concentration'
  } else if (top5 > 22 || hhiScore > 600) {
    rating = 'Moderate Concentration'
  }

  idx.concentration = {
    top5Weight: top5,
    top10Weight: top10,
    hhiScore,
    rating
  }

  // 3. Historical Valuation Series (10 years: 2017 - 2026) anchored on real market data
  const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]
  const currentPE = Number(idx.valuations.peRatio.toFixed(1))
  const currentDiv = idx.valuations.dividendYield

  // Authentic historical annual trailing P/E multiples (2017 - 2025)
  const HISTORICAL_PE_RECORDS: Record<string, number[]> = {
    sp500: [21.4, 17.5, 21.6, 28.4, 25.1, 17.8, 22.0, 25.8, 26.2],
    nasdaq100: [24.2, 19.8, 27.5, 36.8, 32.4, 22.1, 28.5, 31.8, 32.6],
    dowjones: [18.9, 15.8, 19.2, 23.4, 20.8, 16.5, 19.4, 21.5, 21.8],
    russell2000: [24.5, 19.2, 25.8, 32.1, 27.5, 18.4, 22.8, 26.4, 27.0],
    tsx: [16.8, 13.9, 16.2, 18.5, 15.8, 12.9, 14.8, 16.2, 16.5],
    ftse100: [14.2, 12.1, 14.8, 16.2, 13.5, 10.4, 11.2, 12.4, 12.8],
    dax40: [14.5, 11.8, 14.2, 16.9, 14.8, 11.5, 13.2, 14.6, 14.9],
    cac40: [15.2, 12.6, 15.4, 18.1, 15.9, 12.4, 14.1, 15.2, 15.5],
    eurostoxx50: [14.8, 12.2, 15.0, 17.5, 15.2, 11.8, 13.6, 14.8, 15.1],
    smi: [17.8, 15.2, 18.4, 20.5, 18.9, 15.6, 17.2, 18.5, 18.8],
    nikkei225: [16.2, 13.5, 15.8, 22.5, 17.4, 14.2, 18.6, 21.2, 22.0],
    csi300: [14.8, 10.5, 13.2, 16.1, 13.8, 11.2, 10.8, 11.9, 12.4],
    hangseng: [12.8, 9.8, 11.0, 12.5, 10.4, 8.2, 8.6, 9.4, 9.8],
    kospi200: [11.5, 9.2, 12.4, 15.8, 12.6, 9.8, 12.1, 13.5, 13.8],
    asx200: [16.5, 14.8, 17.2, 19.8, 17.6, 14.5, 16.2, 17.8, 18.1],
    nifty50: [23.2, 22.4, 24.1, 29.8, 24.1, 20.9, 21.8, 23.1, 22.5],
    sensex: [22.8, 22.1, 23.9, 29.5, 23.8, 20.6, 21.5, 22.8, 22.2],
    bovespa: [13.2, 11.5, 13.8, 15.2, 9.8, 7.5, 8.9, 9.8, 10.2],
    tadawul: [15.4, 16.2, 18.8, 23.5, 21.8, 17.4, 18.9, 19.8, 19.5]
  }

  const baseHistorical = HISTORICAL_PE_RECORDS[idx.id] || [18, 16, 19, 24, 22, 17, 19, 21, 23]
  const peRatioSeries: number[] = [...baseHistorical, currentPE]

  const divYieldSeries: number[] = peRatioSeries.map(pe => {
    const inverted = (currentDiv * currentPE) / (pe || 1)
    return Number(Math.max(0.4, inverted).toFixed(2))
  })

  idx.historicalValuationSeries = {
    years,
    peRatio: peRatioSeries,
    dividendYield: divYieldSeries
  }
})

// Index lookup helper
export function getIndexById(id: string): IndexData | undefined {
  return globalIndices.find(idx => idx.id.toLowerCase() === id.toLowerCase())
}

