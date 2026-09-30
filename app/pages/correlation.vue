<template>
  <div class="correlation-page">
    <div class="oi-container">
      <!-- Header -->
      <section class="page-header">
        <span class="meta-tag font-mono oi-xs">// 03. MACRO ASSET ALLOCATION & CO-MOVEMENT</span>
        <h1 class="oi-display">
          Global Cross-Index Correlation, <span class="oi-serif">matrix & diversification.</span>
        </h1>
        <p class="oi-body">
          Pairwise statistical dependency across 18 world benchmarks. Assess cross-border co-movement, structural decoupling, and genuine portfolio diversification benefits.
        </p>

        <!-- Macro Stats Ribbon -->
        <div class="stats-ribbon">
          <div class="ribbon-card oi-card-box">
            <span class="ribbon-label font-mono oi-xs">HIGHEST CO-MOVEMENT</span>
            <div class="ribbon-val font-mono">
              <span>{{ highestPair.label }}</span>
              <span class="num-tabular is-pos">r = {{ highestPair.r.toFixed(2) }}</span>
            </div>
            <span class="ribbon-desc oi-xs oi-muted">Synchronized domestic regulatory & monetary regime</span>
          </div>

          <div class="ribbon-card oi-card-box">
            <span class="ribbon-label font-mono oi-xs">TRANSATLANTIC COUPLING</span>
            <div class="ribbon-val font-mono">
              <span>🇺🇸 S&P 500 ⟷ 🇩🇪 DAX 40</span>
              <span class="num-tabular is-pos">r = {{ transatlanticR.toFixed(2) }}</span>
            </div>
            <span class="ribbon-desc oi-xs oi-muted">High multinational enterprise & dollar liquidity beta</span>
          </div>

          <div class="ribbon-card oi-card-box">
            <span class="ribbon-label font-mono oi-xs">MAXIMUM DECOUPLING</span>
            <div class="ribbon-val font-mono">
              <span>{{ lowestPair.label }}</span>
              <span class="num-tabular" style="color: #60a5fa;">r = {{ lowestPair.r.toFixed(2) }}</span>
            </div>
            <span class="ribbon-desc oi-xs oi-muted">Uncorrelated domestic monetary & industrial policy cycles</span>
          </div>
        </div>
      </section>

      <!-- Main Interactive Heatmap -->
      <section class="matrix-section">
        <CorrelationMatrixHeatmap />
      </section>

      <!-- Educational & Institutional Reference Box -->
      <section class="theory-section oi-card-box">
        <div class="theory-header">
          <span class="meta-tag font-mono oi-xs">// METHODOLOGICAL PRINCIPLES</span>
          <h3 class="oi-h3">Modern Portfolio Theory & The "Correlation Spike" Phenomenon</h3>
        </div>

        <div class="theory-grid">
          <div class="theory-col">
            <span class="theory-title font-mono oi-xs">1. THE DIVERSIFICATION FREE LUNCH</span>
            <p class="oi-sm">
              Harry Markowitz's Modern Portfolio Theory (MPT) established that combining assets with correlation coefficient <span class="font-mono">r &lt; 1.0</span> reduces overall portfolio standard deviation (volatility) without sacrificing expected returns. Benchmarks with correlations below 0.40 provide powerful risk dampening.
            </p>
          </div>

          <div class="theory-col">
            <span class="theory-title font-mono oi-xs">2. THE LIQUIDITY PANIC ASYMMETRY</span>
            <p class="oi-sm">
              During severe liquidity shocks (e.g. March 2020 or October 2008), cross-market correlations surge toward 0.90+. As global multi-asset funds face margin calls, they liquidate liquid foreign equities simultaneously, creating transient global contagion regardless of underlying domestic fundamentals.
            </p>
          </div>

          <div class="theory-col">
            <span class="theory-title font-mono oi-xs">3. STRUCTURAL VS TACTICAL DECOUPLING</span>
            <p class="oi-sm">
              Shorter windows (3M) frequently exhibit elevated beta co-movement around US Federal Reserve policy and US inflation releases. Longer windows (3Y, 5Y) reveal true structural economic decoupling driven by local demographic growth, commodity balances, and domestic interest rate cycles.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { correlationIndexIds, getCorrelation } from '~/data/correlations'
import { globalIndices } from '~/data/indices'

function getName(id: string): string {
  const found = globalIndices.find(i => i.id === id)
  return found ? `${found.flag} ${found.shortName}` : id
}

const highestPair = computed(() => {
  let maxR = -2
  let pair = { label: '🇮🇳 Nifty 50 ⟷ Sensex', r: 0.99 }
  for (let i = 0; i < correlationIndexIds.length; i++) {
    for (let j = i + 1; j < correlationIndexIds.length; j++) {
      const a = correlationIndexIds[i]
      const b = correlationIndexIds[j]
      const r = getCorrelation(a, b, '1Y')
      if (r > maxR) {
        maxR = r
        pair = { label: `${getName(a)} ⟷ ${getName(b)}`, r }
      }
    }
  }
  return pair
})

const transatlanticR = computed(() => {
  return getCorrelation('sp500', 'dax40', '1Y')
})

const lowestPair = computed(() => {
  let minR = 2
  let pair = { label: '🇺🇸 S&P 500 ⟷ 🇭🇰 Hang Seng', r: -0.04 }
  for (let i = 0; i < correlationIndexIds.length; i++) {
    for (let j = i + 1; j < correlationIndexIds.length; j++) {
      const a = correlationIndexIds[i]
      const b = correlationIndexIds[j]
      const r = getCorrelation(a, b, '1Y')
      if (r < minR) {
        minR = r
        pair = { label: `${getName(a)} ⟷ ${getName(b)}`, r }
      }
    }
  }
  return pair
})

useHead({
  title: 'Cross-Index Correlation Matrix — INDEX // STUDY',
  meta: [
    { name: 'description', content: 'Interactive NxN global stock market correlation matrix and diversification analysis across 18 major world benchmarks.' }
  ]
})
</script>

<style scoped>
.correlation-page {
  padding-top: var(--oi-s5);
  padding-bottom: var(--oi-s7);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s5);
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.stats-ribbon {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--oi-s3);
  margin-top: var(--oi-s3);
}

@media (max-width: 900px) {
  .stats-ribbon {
    grid-template-columns: 1fr;
  }
}

.ribbon-card {
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ribbon-label {
  color: var(--oi-ink-3);
}

.ribbon-val {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--oi-ink);
}

.ribbon-desc {
  line-height: 1.4;
}

.matrix-section {
  display: flex;
  flex-direction: column;
}

.theory-section {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
  margin-top: var(--oi-s4);
}

.theory-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.theory-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--oi-s4);
}

@media (max-width: 900px) {
  .theory-grid {
    grid-template-columns: 1fr;
  }
}

.theory-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.theory-title {
  color: var(--oi-ink-2);
}
</style>
