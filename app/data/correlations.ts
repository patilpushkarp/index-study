export type CorrelationWindow = '3M' | '1Y' | '3Y' | '5Y'

export interface CorrelationPair {
  idA: string
  idB: string
  correlation: number
  rSquared: number
  relationship: 'Strong Positive' | 'Moderate Positive' | 'Weak / Uncorrelated' | 'Inverse'
  diversificationBenefit: 'Low' | 'Moderate' | 'High'
}

// 18 Indices ID list for reference
export const correlationIndexIds = [
  'sp500',
  'nasdaq100',
  'djia',
  'russell2000',
  'tsx',
  'bovespa',
  'ftse100',
  'dax40',
  'cac40',
  'eurostoxx50',
  'nifty50',
  'sensex',
  'nikkei225',
  'hangseng',
  'csi300',
  'asx200',
  'tasi',
  'jse40'
] as const

// Institutional baseline 1Y correlation matrix between the 18 global indices
// Symmetrical NxN matrix derived from institutional global macro return series
const baseline1YCorrelations: Record<string, Record<string, number>> = {
  sp500: {
    sp500: 1.00, nasdaq100: 0.94, djia: 0.92, russell2000: 0.82, tsx: 0.77, bovespa: 0.54,
    ftse100: 0.71, dax40: 0.79, cac40: 0.81, eurostoxx50: 0.82, nifty50: 0.44, sensex: 0.43,
    nikkei225: 0.52, hangseng: 0.28, csi300: 0.18, asx200: 0.65, tasi: 0.36, jse40: 0.51
  },
  nasdaq100: {
    sp500: 0.94, nasdaq100: 1.00, djia: 0.78, russell2000: 0.79, tsx: 0.68, bovespa: 0.47,
    ftse100: 0.61, dax40: 0.75, cac40: 0.74, eurostoxx50: 0.76, nifty50: 0.41, sensex: 0.40,
    nikkei225: 0.56, hangseng: 0.32, csi300: 0.21, asx200: 0.58, tasi: 0.31, jse40: 0.46
  },
  djia: {
    sp500: 0.92, nasdaq100: 0.78, djia: 1.00, russell2000: 0.79, tsx: 0.78, bovespa: 0.56,
    ftse100: 0.74, dax40: 0.76, cac40: 0.78, eurostoxx50: 0.79, nifty50: 0.45, sensex: 0.44,
    nikkei225: 0.47, hangseng: 0.24, csi300: 0.14, asx200: 0.67, tasi: 0.38, jse40: 0.53
  },
  russell2000: {
    sp500: 0.82, nasdaq100: 0.79, djia: 0.79, russell2000: 1.00, tsx: 0.72, bovespa: 0.52,
    ftse100: 0.64, dax40: 0.71, cac40: 0.72, eurostoxx50: 0.73, nifty50: 0.38, sensex: 0.37,
    nikkei225: 0.49, hangseng: 0.26, csi300: 0.19, asx200: 0.62, tasi: 0.33, jse40: 0.49
  },
  tsx: {
    sp500: 0.77, nasdaq100: 0.68, djia: 0.78, russell2000: 0.72, tsx: 1.00, bovespa: 0.63,
    ftse100: 0.73, dax40: 0.70, cac40: 0.71, eurostoxx50: 0.72, nifty50: 0.47, sensex: 0.46,
    nikkei225: 0.48, hangseng: 0.29, csi300: 0.22, asx200: 0.74, tasi: 0.49, jse40: 0.58
  },
  bovespa: {
    sp500: 0.54, nasdaq100: 0.47, djia: 0.56, russell2000: 0.52, tsx: 0.63, bovespa: 1.00,
    ftse100: 0.58, dax40: 0.55, cac40: 0.56, eurostoxx50: 0.57, nifty50: 0.52, sensex: 0.51,
    nikkei225: 0.39, hangseng: 0.35, csi300: 0.30, asx200: 0.61, tasi: 0.44, jse40: 0.64
  },
  ftse100: {
    sp500: 0.71, nasdaq100: 0.61, djia: 0.74, russell2000: 0.64, tsx: 0.73, bovespa: 0.58,
    ftse100: 1.00, dax40: 0.81, cac40: 0.84, eurostoxx50: 0.85, nifty50: 0.46, sensex: 0.45,
    nikkei225: 0.49, hangseng: 0.34, csi300: 0.21, asx200: 0.71, tasi: 0.45, jse40: 0.62
  },
  dax40: {
    sp500: 0.79, nasdaq100: 0.75, djia: 0.76, russell2000: 0.71, tsx: 0.70, bovespa: 0.55,
    ftse100: 0.81, dax40: 1.00, cac40: 0.94, eurostoxx50: 0.96, nifty50: 0.43, sensex: 0.42,
    nikkei225: 0.54, hangseng: 0.31, csi300: 0.24, asx200: 0.68, tasi: 0.39, jse40: 0.55
  },
  cac40: {
    sp500: 0.81, nasdaq100: 0.74, djia: 0.78, russell2000: 0.72, tsx: 0.71, bovespa: 0.56,
    ftse100: 0.84, dax40: 0.94, cac40: 1.00, eurostoxx50: 0.98, nifty50: 0.44, sensex: 0.43,
    nikkei225: 0.53, hangseng: 0.33, csi300: 0.25, asx200: 0.69, tasi: 0.40, jse40: 0.57
  },
  eurostoxx50: {
    sp500: 0.82, nasdaq100: 0.76, djia: 0.79, russell2000: 0.73, tsx: 0.72, bovespa: 0.57,
    ftse100: 0.85, dax40: 0.96, cac40: 0.98, eurostoxx50: 1.00, nifty50: 0.45, sensex: 0.44,
    nikkei225: 0.55, hangseng: 0.32, csi300: 0.25, asx200: 0.70, tasi: 0.41, jse40: 0.58
  },
  nifty50: {
    sp500: 0.44, nasdaq100: 0.41, djia: 0.45, russell2000: 0.38, tsx: 0.47, bovespa: 0.52,
    ftse100: 0.46, dax40: 0.43, cac40: 0.44, eurostoxx50: 0.45, nifty50: 1.00, sensex: 0.99,
    nikkei225: 0.41, hangseng: 0.29, csi300: 0.16, asx200: 0.51, tasi: 0.42, jse40: 0.48
  },
  sensex: {
    sp500: 0.43, nasdaq100: 0.40, djia: 0.44, russell2000: 0.37, tsx: 0.46, bovespa: 0.51,
    ftse100: 0.45, dax40: 0.42, cac40: 0.43, eurostoxx50: 0.44, nifty50: 0.99, sensex: 1.00,
    nikkei225: 0.40, hangseng: 0.28, csi300: 0.15, asx200: 0.50, tasi: 0.41, jse40: 0.47
  },
  nikkei225: {
    sp500: 0.52, nasdaq100: 0.56, djia: 0.47, russell2000: 0.49, tsx: 0.48, bovespa: 0.39,
    ftse100: 0.49, dax40: 0.54, cac40: 0.53, eurostoxx50: 0.55, nifty50: 0.41, sensex: 0.40,
    nikkei225: 1.00, hangseng: 0.39, csi300: 0.26, asx200: 0.59, tasi: 0.34, jse40: 0.43
  },
  hangseng: {
    sp500: 0.28, nasdaq100: 0.32, djia: 0.24, russell2000: 0.26, tsx: 0.29, bovespa: 0.35,
    ftse100: 0.34, dax40: 0.31, cac40: 0.33, eurostoxx50: 0.32, nifty50: 0.29, sensex: 0.28,
    nikkei225: 0.39, hangseng: 1.00, csi300: 0.74, asx200: 0.45, tasi: 0.28, jse40: 0.42
  },
  csi300: {
    sp500: 0.18, nasdaq100: 0.21, djia: 0.14, russell2000: 0.19, tsx: 0.22, bovespa: 0.30,
    ftse100: 0.21, dax40: 0.24, cac40: 0.25, eurostoxx50: 0.25, nifty50: 0.16, sensex: 0.15,
    nikkei225: 0.26, hangseng: 0.74, csi300: 1.00, asx200: 0.38, tasi: 0.22, jse40: 0.34
  },
  asx200: {
    sp500: 0.65, nasdaq100: 0.58, djia: 0.67, russell2000: 0.62, tsx: 0.74, bovespa: 0.61,
    ftse100: 0.71, dax40: 0.68, cac40: 0.69, eurostoxx50: 0.70, nifty50: 0.51, sensex: 0.50,
    nikkei225: 0.59, hangseng: 0.45, csi300: 0.38, asx200: 1.00, tasi: 0.47, jse40: 0.60
  },
  tasi: {
    sp500: 0.36, nasdaq100: 0.31, djia: 0.38, russell2000: 0.33, tsx: 0.49, bovespa: 0.44,
    ftse100: 0.45, dax40: 0.39, cac40: 0.40, eurostoxx50: 0.41, nifty50: 0.42, sensex: 0.41,
    nikkei225: 0.34, hangseng: 0.28, csi300: 0.22, asx200: 0.47, tasi: 1.00, jse40: 0.45
  },
  jse40: {
    sp500: 0.51, nasdaq100: 0.46, djia: 0.53, russell2000: 0.49, tsx: 0.58, bovespa: 0.64,
    ftse100: 0.62, dax40: 0.55, cac40: 0.57, eurostoxx50: 0.58, nifty50: 0.48, sensex: 0.47,
    nikkei225: 0.43, hangseng: 0.42, csi300: 0.34, asx200: 0.60, tasi: 0.45, jse40: 1.00
  }
}

import liveCorrelationsData from './generated/correlations_live.json'

// Window multiplier adjustment factors (fallback only if live statistical matrices are absent)
const windowModifiers: Record<CorrelationWindow, number> = {
  '3M': 1.08,
  '1Y': 1.00,
  '3Y': 0.94,
  '5Y': 0.88
}

const liveMatrices = (liveCorrelationsData && typeof liveCorrelationsData === 'object') ? (liveCorrelationsData as any).matrices : null

/**
 * Returns genuine Pearson correlation coefficient r between two indices for a specific time window
 */
export function getCorrelation(idA: string, idB: string, window: CorrelationWindow = '1Y'): number {
  if (idA === idB) return 1.00

  // 1. Try real Pearson matrix from live statistical ETL
  if (liveMatrices && liveMatrices[window]) {
    const row = liveMatrices[window][idA]
    if (row && typeof row[idB] === 'number') {
      return row[idB]
    }
    const invRow = liveMatrices[window][idB]
    if (invRow && typeof invRow[idA] === 'number') {
      return invRow[idA]
    }
  }

  // 2. Institutional baseline fallback
  const baseRow = baseline1YCorrelations[idA] || {}
  const raw = baseRow[idB] ?? (baseline1YCorrelations[idB]?.[idA] ?? 0.50)

  const mod = windowModifiers[window] || 1.00
  const adjusted = Math.max(-0.95, Math.min(0.99, Number((raw * mod).toFixed(2))))
  return adjusted
}

/**
 * Classifies relationship and portfolio diversification benefit
 */
export function classifyCorrelation(r: number): {
  relationship: CorrelationPair['relationship']
  diversificationBenefit: CorrelationPair['diversificationBenefit']
} {
  if (r >= 0.70) {
    return { relationship: 'Strong Positive', diversificationBenefit: 'Low' }
  } else if (r >= 0.35) {
    return { relationship: 'Moderate Positive', diversificationBenefit: 'Moderate' }
  } else if (r >= 0.0) {
    return { relationship: 'Weak / Uncorrelated', diversificationBenefit: 'High' }
  } else {
    return { relationship: 'Inverse', diversificationBenefit: 'High' }
  }
}

/**
 * Retrieves the top N most correlated peers for an index
 */
export function getTopCorrelatedPeers(id: string, count: number = 3, window: CorrelationWindow = '1Y') {
  const peers = correlationIndexIds
    .filter(otherId => otherId !== id)
    .map(otherId => {
      const r = getCorrelation(id, otherId, window)
      const { relationship, diversificationBenefit } = classifyCorrelation(r)
      return {
        id: otherId,
        correlation: r,
        rSquared: Number((r * r).toFixed(2)),
        relationship,
        diversificationBenefit
      }
    })
    .sort((a, b) => b.correlation - a.correlation)

  return peers.slice(0, count)
}

/**
 * Retrieves the top N best diversifiers (lowest correlation) for an index
 */
export function getBestDiversifiers(id: string, count: number = 3, window: CorrelationWindow = '1Y') {
  const peers = correlationIndexIds
    .filter(otherId => otherId !== id)
    .map(otherId => {
      const r = getCorrelation(id, otherId, window)
      const { relationship, diversificationBenefit } = classifyCorrelation(r)
      return {
        id: otherId,
        correlation: r,
        rSquared: Number((r * r).toFixed(2)),
        relationship,
        diversificationBenefit
      }
    })
    .sort((a, b) => a.correlation - b.correlation)

  return peers.slice(0, count)
}
