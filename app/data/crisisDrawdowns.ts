export interface CrisisEpisode {
  id: string
  name: string
  shortLabel: string
  period: string
  peakDate: string
  troughDate: string
  catalyst: string
  transmissionMechanism: string
  centralBankResponse: string
  keyTakeaway: string
  globalAverageDrawdown: number
  benchmarkLeader: {
    name: string
    drawdown: number
    reason: string
  }
  benchmarkLaggard: {
    name: string
    drawdown: number
    reason: string
  }
}

export interface IndexCrisisMetric {
  crisisId: string
  indexId: string
  drawdownPercent: number
  daysToTrough: number
  daysToRecovery: number | 'Ongoing'
  recoveredInMonths: number | null
  resilienceRating: 'A' | 'B' | 'C' | 'D'
  observation: string
}

export interface StressScenario {
  id: string
  name: string
  description: string
  macroTriggers: string[]
  expectedGlobalImpact: number
  indexImpacts: Record<string, { expectedChange: number; rationale: string }>
}

export const historicalCrises: CrisisEpisode[] = [
  {
    id: 'dotcom-2000',
    name: '2000–2002 Dot-Com Bubble Collapse',
    shortLabel: '2000 Dot-Com',
    period: 'Mar 2000 – Oct 2002',
    peakDate: '2000-03-24',
    troughDate: '2002-10-09',
    catalyst: 'Extreme speculative valuation multiples in internet and telecom equities decoupling from underlying cash flows.',
    transmissionMechanism: 'Tech earnings downgrades, unviable capital expenditures, IPO bubble collapse, followed by the 2001 recession and 9/11 geopolitical shock.',
    centralBankResponse: 'Federal Reserve slashed Fed Funds rate from 6.50% down to 1.00% to stimulate capital expenditure.',
    keyTakeaway: 'Valuation discipline is non-negotiable. Price-to-sales multiples of 40x+ resulted in an 82.9% Nasdaq collapse taking 15 years to reclaim.',
    globalAverageDrawdown: -54.2,
    benchmarkLeader: {
      name: 'TSX Composite (Canada)',
      drawdown: -44.2,
      reason: 'Strong resource, mining, and financial weighting insulated against pure software losses.'
    },
    benchmarkLaggard: {
      name: 'Nasdaq 100 (USA)',
      drawdown: -82.9,
      reason: 'Epicenter of internet mania; massive multiple de-rating across hardware, telecom, and dot-coms.'
    }
  },
  {
    id: 'gfc-2008',
    name: '2007–2009 Global Financial Crisis (Lehman)',
    shortLabel: '2008 Lehman GFC',
    period: 'Oct 2007 – Mar 2009',
    peakDate: '2007-10-09',
    troughDate: '2009-03-09',
    catalyst: 'Collapse of US subprime mortgage securitization and Lehman Brothers bankruptcy causing an interbank liquidity freeze.',
    transmissionMechanism: 'Cross-border banking insolvency fears, forced deleveraging, commercial paper collapse, global synchronized economic contraction.',
    centralBankResponse: 'Coordinated global zero interest rate policies (ZIRP) and the invention of Quantitative Easing (QE1) by the Federal Reserve and Bank of England.',
    keyTakeaway: 'Financial leverage creates synchronized cross-border co-movement. Diversification failed during the peak panic as correlations surged to 0.90+.',
    globalAverageDrawdown: -58.4,
    benchmarkLeader: {
      name: 'FTSE 100 (UK)',
      drawdown: -48.5,
      reason: 'Heavy defensive consumer staples and pharmaceutical weightings partially cushioned banking hits.'
    },
    benchmarkLaggard: {
      name: 'CSI 300 (China)',
      drawdown: -72.3,
      reason: 'Massive speculative local equity bubble burst simultaneously with the collapse of global export demand.'
    }
  },
  {
    id: 'covid-2020',
    name: '2020 COVID-19 Flash Crash',
    shortLabel: '2020 COVID Flash',
    period: 'Feb 2020 – Mar 2020',
    peakDate: '2020-02-19',
    troughDate: '2020-03-23',
    catalyst: 'Worldwide pandemic lockdowns and sudden economic stop halting global consumer activity and trade.',
    transmissionMechanism: 'Sudden demand shock, retail/travel revenue zeroing, severe corporate credit dash-for-cash, circuit breakers triggered repeatedly.',
    centralBankResponse: 'Unprecedented fiscal stimulus packages (CARES Act) and emergency unlimited Fed QE, backstopping corporate credit and municipal debt.',
    keyTakeaway: 'The fastest 30% crash in stock market history (22 trading days) was met with the fastest recovery due to swift monetary and digital platform adoption.',
    globalAverageDrawdown: -34.8,
    benchmarkLeader: {
      name: 'CSI 300 (China)',
      drawdown: -16.1,
      reason: 'Early containment lockdown protocols and decisive PBOC liquidity injections softened peak domestic selling.'
    },
    benchmarkLaggard: {
      name: 'Bovespa (Brazil)',
      drawdown: -45.0,
      reason: 'Commodity collapse, currency flight (Real depreciation), and severe pandemic healthcare stress.'
    }
  },
  {
    id: 'rates-2022',
    name: '2022 Global Rate Hike & Inflation Bear Market',
    shortLabel: '2022 Inflation & Rates',
    period: 'Jan 2022 – Oct 2022',
    peakDate: '2022-01-03',
    troughDate: '2022-10-12',
    catalyst: 'Post-pandemic 40-year high inflation (US CPI 9.1%) driven by supply chain bottlenecks, fiscal overhang, and Ukraine energy shock.',
    transmissionMechanism: 'Rapid central bank tightening (+525 bps Fed rate hikes), real yield spike from -1.0% to +1.7%, valuation multiple compression in long-duration tech.',
    centralBankResponse: 'Quantitative tightening (QT) balance sheet reduction and synchronized 75 bps consecutive rate hikes across US, Europe, and emerging banks.',
    keyTakeaway: 'Inflation destroys the traditional 60/40 equity-bond hedge. Value, commodity, and energy-dense indices dramatically outperformed tech growth.',
    globalAverageDrawdown: -23.5,
    benchmarkLeader: {
      name: 'FTSE 100 (UK)',
      drawdown: -6.8,
      reason: 'Major oil (Shell, BP), mining (Rio Tinto, Glencore), and banking weights thrived in a high commodity & rate environment.'
    },
    benchmarkLaggard: {
      name: 'Hang Seng (Hong Kong)',
      drawdown: -36.5,
      reason: 'Property sector liquidity crisis (Evergrande defaults) compounded by zero-COVID lockdowns and US tech ADR delisting fears.'
    }
  }
]

// Index performance metrics across the 4 major crises
export const indexCrisisData: Record<string, Record<string, IndexCrisisMetric>> = {
  sp500: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'sp500',
      drawdownPercent: -49.1,
      daysToTrough: 929,
      daysToRecovery: 1720,
      recoveredInMonths: 56,
      resilienceRating: 'C',
      observation: 'Tech heavy weight dragged the broader index down over a grinding 2.5-year bear market.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'sp500',
      drawdownPercent: -56.8,
      daysToTrough: 517,
      daysToRecovery: 1475,
      recoveredInMonths: 49,
      resilienceRating: 'D',
      observation: 'Financial sector insolvencies wiped out decades of bank equity value; bottomed at 666 in March 2009.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'sp500',
      drawdownPercent: -33.9,
      daysToTrough: 33,
      daysToRecovery: 148,
      recoveredInMonths: 5,
      resilienceRating: 'B',
      observation: 'Record velocity drawdown followed by aggressive tech-fueled recovery reclaiming ATH in under 6 months.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'sp500',
      drawdownPercent: -25.4,
      daysToTrough: 282,
      daysToRecovery: 460,
      recoveredInMonths: 15,
      resilienceRating: 'B',
      observation: 'PE contraction from 22x to 15x; reclaimed all-time highs by late 2023 on resilient corporate earnings.'
    }
  },
  nasdaq100: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'nasdaq100',
      drawdownPercent: -82.9,
      daysToTrough: 929,
      daysToRecovery: 5540,
      recoveredInMonths: 182,
      resilienceRating: 'D',
      observation: 'Unprecedented tech crash. Required 15.2 years to surpass its March 2000 peak of 4,816.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'nasdaq100',
      drawdownPercent: -54.0,
      daysToTrough: 418,
      daysToRecovery: 1040,
      recoveredInMonths: 34,
      resilienceRating: 'C',
      observation: 'Strong corporate balance sheets with low debt allowed faster recovery than financial-heavy benchmarks.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'nasdaq100',
      drawdownPercent: -28.0,
      daysToTrough: 31,
      daysToRecovery: 110,
      recoveredInMonths: 3.5,
      resilienceRating: 'A',
      observation: 'Digital work-from-home revolution accelerated software adoption; index gained +48% in full-year 2020.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'nasdaq100',
      drawdownPercent: -35.6,
      daysToTrough: 280,
      daysToRecovery: 430,
      recoveredInMonths: 14,
      resilienceRating: 'C',
      observation: 'Long-duration cash flows suffered from 500bps of Fed hikes before the generative AI supercycle igniting in 2023.'
    }
  },
  djia: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'djia',
      drawdownPercent: -37.8,
      daysToTrough: 929,
      daysToRecovery: 1460,
      recoveredInMonths: 48,
      resilienceRating: 'B',
      observation: 'Industrial and blue-chip composition defended better than tech-concentrated peers.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'djia',
      drawdownPercent: -53.8,
      daysToTrough: 517,
      daysToRecovery: 1460,
      recoveredInMonths: 48,
      resilienceRating: 'D',
      observation: 'Hit hard by Citigroup, AIG, General Motors and GE restructuring.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'djia',
      drawdownPercent: -37.1,
      daysToTrough: 33,
      daysToRecovery: 260,
      recoveredInMonths: 8.5,
      resilienceRating: 'C',
      observation: 'Aviation (Boeing) and hospitality exposures delayed recovery compared to Nasdaq.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'djia',
      drawdownPercent: -21.9,
      daysToTrough: 275,
      daysToRecovery: 420,
      recoveredInMonths: 14,
      resilienceRating: 'B',
      observation: 'Defensive healthcare (UnitedHealth) and energy held up during the inflation spike.'
    }
  },
  russell2000: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'russell2000',
      drawdownPercent: -45.8,
      daysToTrough: 929,
      daysToRecovery: 1350,
      recoveredInMonths: 44,
      resilienceRating: 'C',
      observation: 'Small caps suffered from illiquidity and venture contraction.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'russell2000',
      drawdownPercent: -58.9,
      daysToTrough: 517,
      daysToRecovery: 1100,
      recoveredInMonths: 36,
      resilienceRating: 'D',
      observation: 'High exposure to regional banks and cyclical domestic suppliers created deep drawdown.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'russell2000',
      drawdownPercent: -41.8,
      daysToTrough: 33,
      daysToRecovery: 240,
      recoveredInMonths: 8,
      resilienceRating: 'D',
      observation: 'Main Street small businesses bore the initial brunt of pandemic shutdown orders.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'russell2000',
      drawdownPercent: -32.4,
      daysToTrough: 280,
      daysToRecovery: 'Ongoing',
      recoveredInMonths: null,
      resilienceRating: 'D',
      observation: 'Floating rate debt (~40% of small cap liabilities) severely compressed net profit margins.'
    }
  },
  tsx: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'tsx',
      drawdownPercent: -44.2,
      daysToTrough: 910,
      daysToRecovery: 1800,
      recoveredInMonths: 59,
      resilienceRating: 'B',
      observation: 'Nortel Networks collapse caused localized drag, but mining and energy cushioned broader index.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'tsx',
      drawdownPercent: -50.1,
      daysToTrough: 440,
      daysToRecovery: 1120,
      recoveredInMonths: 37,
      resilienceRating: 'C',
      observation: 'Canadian banks proved far more capitalized than US/European peers, enabling a swifter rebound.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'tsx',
      drawdownPercent: -37.4,
      daysToTrough: 32,
      daysToRecovery: 320,
      recoveredInMonths: 10.5,
      resilienceRating: 'C',
      observation: 'Oil price plunge to negative territory briefly pressured Canadian energy producers.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'tsx',
      drawdownPercent: -17.8,
      daysToTrough: 260,
      daysToRecovery: 380,
      recoveredInMonths: 12.5,
      resilienceRating: 'A',
      observation: 'Oil, gas, and fertilizer export windfalls provided robust earnings resilience.'
    }
  },
  dax40: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'dax40',
      drawdownPercent: -72.7,
      daysToTrough: 1090,
      daysToRecovery: 2650,
      recoveredInMonths: 87,
      resilienceRating: 'D',
      observation: 'Neuer Markt tech collapse and severe German economic stagnation.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'dax40',
      drawdownPercent: -54.4,
      daysToTrough: 490,
      daysToRecovery: 1400,
      recoveredInMonths: 46,
      resilienceRating: 'D',
      observation: 'Heavy export orientation caused industrial order book contraction as world trade froze.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'dax40',
      drawdownPercent: -38.8,
      daysToTrough: 29,
      daysToRecovery: 280,
      recoveredInMonths: 9.2,
      resilienceRating: 'C',
      observation: 'Automotive and chemical plant shutdowns sparked fast panic, relieved by ECB stimulus.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'dax40',
      drawdownPercent: -25.0,
      daysToTrough: 260,
      daysToRecovery: 390,
      recoveredInMonths: 13,
      resilienceRating: 'B',
      observation: 'Russian gas shutoff fears spiked German power prices; averted deep recession by fast LNG adaptation.'
    }
  },
  ftse100: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'ftse100',
      drawdownPercent: -52.6,
      daysToTrough: 1100,
      daysToRecovery: 2700,
      recoveredInMonths: 89,
      resilienceRating: 'C',
      observation: 'Vodafone telecom acquisition overhang and global market malaise.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'ftse100',
      drawdownPercent: -48.5,
      daysToTrough: 510,
      daysToRecovery: 1250,
      recoveredInMonths: 41,
      resilienceRating: 'B',
      observation: 'UK banks (RBS, HBOS) bailed out; high dividend defensive staples helped limit overall index drop.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'ftse100',
      drawdownPercent: -34.8,
      daysToTrough: 28,
      daysToRecovery: 720,
      recoveredInMonths: 24,
      resilienceRating: 'C',
      observation: 'Sluggish post-Brexit growth and oil dividend cuts prolonged full recovery.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'ftse100',
      drawdownPercent: -6.8,
      daysToTrough: 260,
      daysToRecovery: 110,
      recoveredInMonths: 3.5,
      resilienceRating: 'A',
      observation: 'Global star performer in 2022 due to heavy weighting in energy (Shell/BP) and mining giants.'
    }
  },
  cac40: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'cac40',
      drawdownPercent: -64.2,
      daysToTrough: 920,
      daysToRecovery: 2800,
      recoveredInMonths: 92,
      resilienceRating: 'D',
      observation: 'Telecom (France Telecom) and media conglomerates took multi-year write-downs.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'cac40',
      drawdownPercent: -59.5,
      daysToTrough: 510,
      daysToRecovery: 1800,
      recoveredInMonths: 59,
      resilienceRating: 'D',
      observation: 'Eurozone banking systemic vulnerabilities and sovereign debt crisis reverberations.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'cac40',
      drawdownPercent: -38.6,
      daysToTrough: 29,
      daysToRecovery: 360,
      recoveredInMonths: 11.8,
      resilienceRating: 'C',
      observation: 'Luxury (LVMH, Hermès, Kering) dropped sharply on tourist stops, but roared back as Asia reopened.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'cac40',
      drawdownPercent: -20.6,
      daysToTrough: 260,
      daysToRecovery: 320,
      recoveredInMonths: 10.5,
      resilienceRating: 'B',
      observation: 'Luxury pricing power and aerospace defense resilience helped outpace Germany.'
    }
  },
  eurostoxx50: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'eurostoxx50',
      drawdownPercent: -66.3,
      daysToTrough: 1090,
      daysToRecovery: 3100,
      recoveredInMonths: 102,
      resilienceRating: 'D',
      observation: 'Pan-European blue chips struggled through tech de-rating and eurozone structural fiscal friction.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'eurostoxx50',
      drawdownPercent: -60.1,
      daysToTrough: 515,
      daysToRecovery: 2400,
      recoveredInMonths: 79,
      resilienceRating: 'D',
      observation: 'Deep crisis exacerbated by subsequent 2011 European sovereign debt crisis.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'eurostoxx50',
      drawdownPercent: -38.3,
      daysToTrough: 29,
      daysToRecovery: 330,
      recoveredInMonths: 10.8,
      resilienceRating: 'C',
      observation: 'Synchronized continental lockdowns met by €1.85T ECB Pandemic Emergency Purchase Programme.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'eurostoxx50',
      drawdownPercent: -22.7,
      daysToTrough: 260,
      daysToRecovery: 350,
      recoveredInMonths: 11.5,
      resilienceRating: 'B',
      observation: 'European banking net interest income expanded for the first time in 8 years with positive ECB rates.'
    }
  },
  nifty50: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'nifty50',
      drawdownPercent: -53.9,
      daysToTrough: 580,
      daysToRecovery: 1250,
      recoveredInMonths: 41,
      resilienceRating: 'C',
      observation: 'Early Indian IT services multiple compression followed by rapid domestic economic expansion.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'nifty50',
      drawdownPercent: -64.4,
      daysToTrough: 350,
      daysToRecovery: 690,
      recoveredInMonths: 22.5,
      resilienceRating: 'B',
      observation: 'Massive foreign institutional capital withdrawal, but domestic growth drove one of the fastest global recoveries.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'nifty50',
      drawdownPercent: -38.4,
      daysToTrough: 33,
      daysToRecovery: 215,
      recoveredInMonths: 7,
      resilienceRating: 'B',
      observation: 'Strict national lockdown caused swift crash; retail domestic demat accounts surge fueled historic bull market.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'nifty50',
      drawdownPercent: -16.8,
      daysToTrough: 160,
      daysToRecovery: 240,
      recoveredInMonths: 8,
      resilienceRating: 'A',
      observation: 'Unmatched global resilience. FII outflows of $30B were fully absorbed by Indian domestic SIP mutual fund inflows.'
    }
  },
  sensex: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'sensex',
      drawdownPercent: -56.3,
      daysToTrough: 580,
      daysToRecovery: 1280,
      recoveredInMonths: 42,
      resilienceRating: 'C',
      observation: 'Ketan Parekh scam compounding dot-com fallout; bottomed in 2001 before a multi-year supercycle.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'sensex',
      drawdownPercent: -65.2,
      daysToTrough: 350,
      daysToRecovery: 700,
      recoveredInMonths: 23,
      resilienceRating: 'B',
      observation: 'Peak-to-trough plunge from 21,200 to 7,697, followed by 100% surge across 2009-2010.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'sensex',
      drawdownPercent: -38.0,
      daysToTrough: 33,
      daysToRecovery: 215,
      recoveredInMonths: 7,
      resilienceRating: 'B',
      observation: 'Financial heavy weighting suffered during loan moratoriums before banking NPAs proved pristine.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'sensex',
      drawdownPercent: -15.8,
      daysToTrough: 160,
      daysToRecovery: 230,
      recoveredInMonths: 7.5,
      resilienceRating: 'A',
      observation: 'Highest resilience in the Indo-Pacific region, establishing new all-time highs while US/Europe stayed in bear markets.'
    }
  },
  nikkei225: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'nikkei225',
      drawdownPercent: -63.5,
      daysToTrough: 1120,
      daysToRecovery: 3200,
      recoveredInMonths: 105,
      resilienceRating: 'D',
      observation: 'Prolonged deflationary decade and banking non-performing loans in Japan.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'nikkei225',
      drawdownPercent: -61.4,
      daysToTrough: 510,
      daysToRecovery: 1800,
      recoveredInMonths: 59,
      resilienceRating: 'D',
      observation: 'Yen surged as global carry trades unwound, crippling Japanese exporters.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'nikkei225',
      drawdownPercent: -30.7,
      daysToTrough: 32,
      daysToRecovery: 180,
      recoveredInMonths: 6,
      resilienceRating: 'B',
      observation: 'Bank of Japan ETF purchase program and modest domestic lockdown measures contained losses.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'nikkei225',
      drawdownPercent: -16.5,
      daysToTrough: 260,
      daysToRecovery: 240,
      recoveredInMonths: 8,
      resilienceRating: 'A',
      observation: 'BoJ yield curve control (YCC) kept interest rates negative, driving massive yen depreciation and record exporter profits.'
    }
  },
  hangseng: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'hangseng',
      drawdownPercent: -53.2,
      daysToTrough: 750,
      daysToRecovery: 1600,
      recoveredInMonths: 52,
      resilienceRating: 'C',
      observation: 'Asian Financial Crisis aftershocks still lingered, compounded by dot-com liquidation.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'hangseng',
      drawdownPercent: -65.6,
      daysToTrough: 380,
      daysToRecovery: 1200,
      recoveredInMonths: 39,
      resilienceRating: 'C',
      observation: 'Plunge from 31,958 to 10,676; recovered on China 4-trillion yuan stimulus program.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'hangseng',
      drawdownPercent: -26.3,
      daysToTrough: 28,
      daysToRecovery: 210,
      recoveredInMonths: 7,
      resilienceRating: 'B',
      observation: 'Initial drop cushioned by defensive local utilities and banking dividends.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'hangseng',
      drawdownPercent: -36.5,
      daysToTrough: 290,
      daysToRecovery: 'Ongoing',
      recoveredInMonths: null,
      resilienceRating: 'D',
      observation: 'Severe mainland property sector credit defaults, Zero-COVID shutdowns, and geopolitical capital flight.'
    }
  },
  csi300: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'csi300',
      drawdownPercent: -50.0,
      daysToTrough: 800,
      daysToRecovery: 1400,
      recoveredInMonths: 46,
      resilienceRating: 'C',
      observation: 'Simulated mainland domestic market series before official 2005 index launch.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'csi300',
      drawdownPercent: -72.3,
      daysToTrough: 380,
      daysToRecovery: 1100,
      recoveredInMonths: 36,
      resilienceRating: 'D',
      observation: 'One of the sharpest equity bubble bursts in modern market history from 5,877 to 1,627.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'csi300',
      drawdownPercent: -16.1,
      daysToTrough: 28,
      daysToRecovery: 90,
      recoveredInMonths: 3,
      resilienceRating: 'A',
      observation: 'World-leading pandemic resilience due to aggressive early containment and state industrial support.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'csi300',
      drawdownPercent: -28.9,
      daysToTrough: 280,
      daysToRecovery: 'Ongoing',
      recoveredInMonths: null,
      resilienceRating: 'D',
      observation: 'Domestic real estate deceleration, consumer confidence softness, and regulatory tech reshuffling.'
    }
  },
  asx200: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'asx200',
      drawdownPercent: -22.3,
      daysToTrough: 650,
      daysToRecovery: 1100,
      recoveredInMonths: 36,
      resilienceRating: 'A',
      observation: 'World-class dot-com outperformer; lack of speculative tech companies shielded Australia.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'asx200',
      drawdownPercent: -54.5,
      daysToTrough: 510,
      daysToRecovery: 1800,
      recoveredInMonths: 59,
      resilienceRating: 'C',
      observation: 'Australian Big 4 banks avoided direct subprime toxic assets, but wholesale credit markets tightened.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'asx200',
      drawdownPercent: -36.5,
      daysToTrough: 31,
      daysToRecovery: 320,
      recoveredInMonths: 10.5,
      resilienceRating: 'C',
      observation: 'Mining dividend resilience and iron ore demand from China accelerated normalization.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'asx200',
      drawdownPercent: -14.6,
      daysToTrough: 220,
      daysToRecovery: 290,
      recoveredInMonths: 9.5,
      resilienceRating: 'A',
      observation: 'BHP and Rio Tinto commodity revenues offset RBA interest rate headwinds.'
    }
  },
  bovespa: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'bovespa',
      drawdownPercent: -58.4,
      daysToTrough: 750,
      daysToRecovery: 1200,
      recoveredInMonths: 39,
      resilienceRating: 'D',
      observation: 'Currency devaluation and emerging market risk aversion.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'bovespa',
      drawdownPercent: -60.0,
      daysToTrough: 380,
      daysToRecovery: 650,
      recoveredInMonths: 21,
      resilienceRating: 'B',
      observation: 'V-shaped recovery powered by Chinese infrastructure commodity supercycle (Vale and Petrobras).'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'bovespa',
      drawdownPercent: -45.0,
      daysToTrough: 33,
      daysToRecovery: 260,
      recoveredInMonths: 8.5,
      resilienceRating: 'D',
      observation: 'Deepest emerging market drawdown due to political volatility and steep currency drops.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'bovespa',
      drawdownPercent: -18.2,
      daysToTrough: 190,
      daysToRecovery: 280,
      recoveredInMonths: 9.2,
      resilienceRating: 'A',
      observation: 'Banco Central do Brasil raised rates proactively before the Fed, providing massive carry trade support.'
    }
  },
  tasi: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'tasi',
      drawdownPercent: -28.0,
      daysToTrough: 450,
      daysToRecovery: 700,
      recoveredInMonths: 23,
      resilienceRating: 'A',
      observation: 'Isolated domestic investor base and minimal foreign tech exposure insulated Saudi Arabia.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'tasi',
      drawdownPercent: -68.0,
      daysToTrough: 400,
      daysToRecovery: 2200,
      recoveredInMonths: 72,
      resilienceRating: 'D',
      observation: 'Crude oil crashed from $147/bbl to $32/bbl, collapsing petrochemical and banking revenues.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'tasi',
      drawdownPercent: -29.8,
      daysToTrough: 30,
      daysToRecovery: 190,
      recoveredInMonths: 6.2,
      resilienceRating: 'B',
      observation: 'OPEC+ supply coordination stabilized energy markets quickly.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'tasi',
      drawdownPercent: -25.4,
      daysToTrough: 240,
      daysToRecovery: 380,
      recoveredInMonths: 12.5,
      resilienceRating: 'B',
      observation: 'Saudi Aramco and national banking sector generated record free cash flow as Brent oil averaged $100/bbl.'
    }
  },
  jse40: {
    'dotcom-2000': {
      crisisId: 'dotcom-2000',
      indexId: 'jse40',
      drawdownPercent: -36.5,
      daysToTrough: 650,
      daysToRecovery: 1100,
      recoveredInMonths: 36,
      resilienceRating: 'B',
      observation: 'Commodities and gold miners benefited from safe-haven flows.'
    },
    'gfc-2008': {
      crisisId: 'gfc-2008',
      indexId: 'jse40',
      drawdownPercent: -45.0,
      daysToTrough: 380,
      daysToRecovery: 780,
      recoveredInMonths: 25.5,
      resilienceRating: 'B',
      observation: 'Mining and Naspers (Tencent investment) cushioned domestic banking stress.'
    },
    'covid-2020': {
      crisisId: 'covid-2020',
      indexId: 'jse40',
      drawdownPercent: -32.5,
      daysToTrough: 32,
      daysToRecovery: 230,
      recoveredInMonths: 7.5,
      resilienceRating: 'B',
      observation: 'Gold and platinum miners surged to record profitability during the crisis.'
    },
    'rates-2022': {
      crisisId: 'rates-2022',
      indexId: 'jse40',
      drawdownPercent: -19.4,
      daysToTrough: 220,
      daysToRecovery: 310,
      recoveredInMonths: 10,
      resilienceRating: 'A',
      observation: 'Naspers/Prosus restructuring and strong commodity exports limited index downside.'
    }
  }
}

// Interactive Macroeconomic Stress Scenarios
export const stressScenarios: StressScenario[] = [
  {
    id: 'tech-shock',
    name: 'Tech Valuation De-Rating (-25% Sector Shock)',
    description: 'Hypothetical shock driven by AI monetization skepticism and antitrust breakups, causing high-multiple tech to de-rate by 25%.',
    macroTriggers: ['Regulatory antitrust action on Big Tech', 'Server CapEx spend slowdown', 'PE multiple compression in cloud SaaS'],
    expectedGlobalImpact: -12.4,
    indexImpacts: {
      nasdaq100: { expectedChange: -24.2, rationale: 'Epicenter of high-duration software, semis, and cloud giants.' },
      sp500: { expectedChange: -16.5, rationale: '32%+ weighting in Magnificent Seven and semiconductor leaders.' },
      dax40: { expectedChange: -9.8, rationale: 'SAP exposed, but balanced by industrial engineering and healthcare.' },
      nifty50: { expectedChange: -7.2, rationale: 'IT services (TCS/Infosys ~12%) pressured, but offset by domestic banks & infra.' },
      ftse100: { expectedChange: -2.8, rationale: 'Minimal tech exposure (<2%); defensive energy and pharma anchor value.' },
      nikkei225: { expectedChange: -14.1, rationale: 'Tokyo Electron, Advantest, and SoftBank create tech sensitivity.' }
    }
  },
  {
    id: 'energy-shock',
    name: 'Middle East Geopolitical & Oil Spike ($120/bbl)',
    description: 'Strait of Hormuz disruptions send Brent crude to $120/bbl, creating an energy shock and stagflationary pressures.',
    macroTriggers: ['Strait transit blockade', 'Crude supply deficit of 3M bpd', 'Global transport freight surcharge'],
    expectedGlobalImpact: -8.6,
    indexImpacts: {
      tasi: { expectedChange: +14.5, rationale: 'Saudi Aramco and national fiscal surplus expand exponentially.' },
      tsx: { expectedChange: +8.2, rationale: 'Canadian oil sands and gas pipelines see massive cash generation.' },
      ftse100: { expectedChange: +5.4, rationale: 'Shell and BP constitute over 14% of the UK index.' },
      nifty50: { expectedChange: -11.2, rationale: 'India imports 85% of crude; trade deficit and rupee pressure increase.' },
      nikkei225: { expectedChange: -10.5, rationale: 'Japan imports 99% of energy needs; terms-of-trade deteriorates.' },
      sp500: { expectedChange: -6.4, rationale: 'US energy sector gains offset airline, retail, and consumer spending squeeze.' }
    }
  },
  {
    id: 'rate-spike',
    name: 'Resurgent Inflation & Synchronized +150 bps Hikes',
    description: 'Sticky wage and service inflation forces central banks to reverse rate cuts and hike terminal rates by 150 basis points.',
    macroTriggers: ['Wage-price spiral acceleration', '10Y US Treasury yield spikes to 5.50%', 'Commercial real estate refinancing wave'],
    expectedGlobalImpact: -15.8,
    indexImpacts: {
      russell2000: { expectedChange: -22.5, rationale: 'High percentage of unprofitable small caps with floating-rate debt.' },
      nasdaq100: { expectedChange: -19.8, rationale: 'Discount rate spike directly reduces present value of future cash flows.' },
      sp500: { expectedChange: -14.2, rationale: 'Equity risk premium compresses against 5.5% risk-free yield.' },
      eurostoxx50: { expectedChange: -12.6, rationale: 'Eurozone real estate and utilities face heavy debt rollover burdens.' },
      nifty50: { expectedChange: -9.5, rationale: 'Strong domestic corporate balance sheets and low leverage cushion RBI tightening.' },
      ftse100: { expectedChange: -6.1, rationale: 'UK banks benefit from higher net interest margins; low duration index.' }
    }
  }
]
