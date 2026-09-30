<template>
  <div class="correlation-heatmap-wrapper oi-card-box">
    <!-- Header & Controls -->
    <div class="heatmap-header">
      <div class="header-left">
        <span class="meta-tag font-mono oi-xs">// CROSS-ASSET STATISTICAL DEPENDENCY</span>
        <h3 class="oi-h3">Global NxN Correlation Matrix</h3>
        <p class="oi-sm oi-muted">
          Pairwise Pearson correlation coefficients (<span class="font-mono">r</span>) measuring co-movement across global equity benchmarks.
        </p>
      </div>

      <div class="header-controls">
        <!-- Timeframe Switcher -->
        <div class="control-group">
          <span class="control-label font-mono oi-xs">WINDOW:</span>
          <div class="pill-group">
            <button
              v-for="w in windows"
              :key="w"
              class="oi-pill"
              :class="{ 'is-active': selectedWindow === w }"
              @click="selectedWindow = w"
            >
              {{ w }}
            </button>
          </div>
        </div>

        <!-- Regional Cluster Filter -->
        <div class="control-group">
          <span class="control-label font-mono oi-xs">UNIVERSE:</span>
          <div class="pill-group">
            <button
              v-for="f in regionFilters"
              :key="f.id"
              class="oi-pill"
              :class="{ 'is-active': selectedFilter === f.id }"
              @click="selectedFilter = f.id"
            >
              {{ f.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Color Legend -->
    <div class="heatmap-legend">
      <span class="font-mono oi-xs oi-muted">CORRELATION SCALE:</span>
      <div class="legend-scale">
        <div class="scale-item">
          <span class="scale-color" style="background-color: var(--oi-loss);"></span>
          <span class="font-mono oi-xs">&lt; 0.00 (Inverse)</span>
        </div>
        <div class="scale-item">
          <span class="scale-color" style="background-color: #241f1a; border: 1px solid var(--oi-hairline);"></span>
          <span class="font-mono oi-xs">0.00 - 0.29 (Uncorrelated)</span>
        </div>
        <div class="scale-item">
          <span class="scale-color" style="background-color: #1f3b26;"></span>
          <span class="font-mono oi-xs">0.30 - 0.59 (Moderate)</span>
        </div>
        <div class="scale-item">
          <span class="scale-color" style="background-color: #0b6b28;"></span>
          <span class="font-mono oi-xs">0.60 - 0.79 (High)</span>
        </div>
        <div class="scale-item">
          <span class="scale-color" style="background-color: #00e200; box-shadow: 0 0 6px rgba(0,226,0,0.4);"></span>
          <span class="font-mono oi-xs">&gt; 0.80 (Co-moving)</span>
        </div>
      </div>
    </div>

    <!-- Responsive Matrix Grid Table -->
    <div class="matrix-scroll-container">
      <table class="heatmap-table">
        <thead>
          <tr>
            <th class="corner-header font-mono oi-xs">INDEX / PAIR</th>
            <th
              v-for="col in activeIndices"
              :key="col.id"
              class="col-header font-mono oi-xs"
              :class="{ 'is-hovered': hoveredColId === col.id || selectedPair?.idB === col.id }"
              :title="col.name"
            >
              <span class="col-flag">{{ col.flag }}</span>
              <span class="col-symbol">{{ col.shortName }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in activeIndices" :key="row.id">
            <!-- Row Header -->
            <th
              class="row-header font-mono oi-xs"
              :class="{ 'is-hovered': hoveredRowId === row.id || selectedPair?.idA === row.id }"
            >
              <div class="row-label-inner">
                <span>{{ row.flag }}</span>
                <span class="row-name">{{ row.shortName }}</span>
              </div>
            </th>

            <!-- Cell Data -->
            <td
              v-for="col in activeIndices"
              :key="col.id"
              class="matrix-cell num-tabular font-mono"
              :class="{
                'is-diagonal': row.id === col.id,
                'is-selected': isCellSelected(row.id, col.id),
                'is-active-row-col': isCellActiveRowCol(row.id, col.id)
              }"
              :style="getCellStyle(row.id, col.id)"
              @mouseenter="onCellHover(row.id, col.id)"
              @mouseleave="onCellLeave"
              @click="selectPair(row.id, col.id)"
            >
              <span class="cell-val">
                {{ formatCorrelation(row.id, col.id) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Active Pair Deep-Dive Inspector Card -->
    <div v-if="selectedPairDetail" class="pair-detail-drawer">
      <div class="pair-summary-header">
        <div class="pair-titles">
          <span class="meta-tag font-mono oi-xs">// PAIRWISE STATISTICAL BREAKDOWN ({{ selectedWindow }})</span>
          <div class="pair-names-display">
            <span class="pair-a">{{ selectedPairDetail.idxA.flag }} {{ selectedPairDetail.idxA.name }}</span>
            <span class="pair-operator font-mono">⟷</span>
            <span class="pair-b">{{ selectedPairDetail.idxB.flag }} {{ selectedPairDetail.idxB.name }}</span>
          </div>
        </div>

        <div class="pair-stats-badge">
          <div class="stat-pill">
            <span class="stat-label font-mono oi-xs">PEARSON r</span>
            <span class="stat-value num-tabular font-mono" :class="selectedPairDetail.r >= 0.6 ? 'is-pos' : ''">
              {{ selectedPairDetail.r.toFixed(2) }}
            </span>
          </div>
          <div class="stat-pill">
            <span class="stat-label font-mono oi-xs">R² VARIANCE</span>
            <span class="stat-value num-tabular font-mono">
              {{ (selectedPairDetail.r * selectedPairDetail.r * 100).toFixed(1) }}%
            </span>
          </div>
          <div class="stat-pill">
            <span class="stat-label font-mono oi-xs">DIVERSIFICATION</span>
            <span class="stat-value font-mono oi-xs" :class="getBenefitClass(selectedPairDetail.benefit)">
              {{ selectedPairDetail.benefit }} Benefit
            </span>
          </div>
        </div>
      </div>

      <div class="pair-analysis-grid">
        <div class="analysis-box">
          <span class="analysis-title font-mono oi-xs">PORTFOLIO CO-VARIANCE INTUITION</span>
          <p class="oi-sm">
            <template v-if="selectedPairDetail.r >= 0.80">
              High co-movement. These benchmarks share systemic macro drivers, foreign exchange risk channels, and multinational constituent overlap. Holding both provides minimal diversification.
            </template>
            <template v-else-if="selectedPairDetail.r >= 0.50">
              Moderate co-movement. Broad market direction aligns during major global liquidity swings, but localized monetary cycles and industry mix create healthy dispersion.
            </template>
            <template v-else-if="selectedPairDetail.r >= 0.20">
              Strong diversification benefit. Local economic engines, differing export dependencies, and domestic earnings drivers allow one benchmark to stabilize the portfolio when the other falters.
            </template>
            <template v-else>
              Uncorrelated or inverse decoupling. Exceptional portfolio dampening qualities. Shifts in domestic policy, commodity cycles, or capital flows provide genuine decorrelation.
            </template>
          </p>
        </div>

        <div class="analysis-box">
          <span class="analysis-title font-mono oi-xs">VALUATION & SPREAD DIVERGENCE</span>
          <div class="spread-stats font-mono oi-xs">
            <div class="spread-row">
              <span class="oi-muted">P/E Spread:</span>
              <span class="num-tabular">
                {{ selectedPairDetail.idxA.valuations.peRatio }}x vs {{ selectedPairDetail.idxB.valuations.peRatio }}x
                ({{ Math.abs(selectedPairDetail.idxA.valuations.peRatio - selectedPairDetail.idxB.valuations.peRatio).toFixed(1) }}x spread)
              </span>
            </div>
            <div class="spread-row">
              <span class="oi-muted">Dividend Yield Spread:</span>
              <span class="num-tabular">
                {{ selectedPairDetail.idxA.valuations.dividendYield }}% vs {{ selectedPairDetail.idxB.valuations.dividendYield }}%
              </span>
            </div>
            <div class="spread-row">
              <span class="oi-muted">1-Year Return Delta:</span>
              <span class="num-tabular">
                {{ (selectedPairDetail.idxA.performance['1Y'] - selectedPairDetail.idxB.performance['1Y']).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { globalIndices, type IndexData } from '~/data/indices'
import {
  getCorrelation,
  classifyCorrelation,
  type CorrelationWindow
} from '~/data/correlations'

const windows: CorrelationWindow[] = ['3M', '1Y', '3Y', '5Y']
const selectedWindow = ref<CorrelationWindow>('1Y')

const regionFilters = [
  { id: 'all', label: 'All 18 Benchmarks' },
  { id: 'dm', label: 'US & Europe Core' },
  { id: 'apac', label: 'Asia-Pacific' },
  { id: 'em', label: 'Emerging Markets' }
]
const selectedFilter = ref('all')

const hoveredRowId = ref<string | null>(null)
const hoveredColId = ref<string | null>(null)
const selectedPair = ref<{ idA: string; idB: string }>({ idA: 'sp500', idB: 'nifty50' })

const activeIndices = computed<IndexData[]>(() => {
  if (selectedFilter.value === 'dm') {
    return globalIndices.filter(idx => idx.region === 'Americas' || idx.region === 'Europe')
  }
  if (selectedFilter.value === 'apac') {
    return globalIndices.filter(idx => idx.region === 'Asia-Pacific')
  }
  if (selectedFilter.value === 'em') {
    return globalIndices.filter(idx => idx.region === 'Emerging' || idx.id === 'csi300' || idx.id === 'bovespa')
  }
  return globalIndices
})

function formatCorrelation(idA: string, idB: string): string {
  if (idA === idB) return '1.00'
  const r = getCorrelation(idA, idB, selectedWindow.value)
  return r.toFixed(2)
}

function getCellStyle(idA: string, idB: string) {
  if (idA === idB) {
    return {
      backgroundColor: '#241f1a',
      color: 'var(--oi-ink-3)',
      fontWeight: '400'
    }
  }

  const r = getCorrelation(idA, idB, selectedWindow.value)

  if (r >= 0.80) {
    return {
      backgroundColor: 'rgba(0, 226, 0, 0.28)',
      color: '#ffffff',
      fontWeight: '600'
    }
  } else if (r >= 0.60) {
    return {
      backgroundColor: 'rgba(0, 226, 0, 0.16)',
      color: '#d4eed6',
      fontWeight: '500'
    }
  } else if (r >= 0.35) {
    return {
      backgroundColor: 'rgba(36, 31, 26, 0.85)',
      color: 'var(--oi-ink)',
      fontWeight: '400'
    }
  } else if (r >= 0.15) {
    return {
      backgroundColor: 'rgba(15, 12, 10, 0.9)',
      color: 'var(--oi-ink-2)',
      fontWeight: '400'
    }
  } else if (r >= 0.0) {
    return {
      backgroundColor: 'rgba(8, 6, 5, 0.95)',
      color: 'var(--oi-ink-3)',
      fontWeight: '400'
    }
  } else {
    return {
      backgroundColor: 'rgba(255, 95, 83, 0.25)',
      color: 'var(--oi-loss)',
      fontWeight: '600'
    }
  }
}

function onCellHover(idA: string, idB: string) {
  hoveredRowId.value = idA
  hoveredColId.value = idB
}

function onCellLeave() {
  hoveredRowId.value = null
  hoveredColId.value = null
}

function selectPair(idA: string, idB: string) {
  selectedPair.value = { idA, idB }
}

function isCellSelected(idA: string, idB: string): boolean {
  return (
    (selectedPair.value.idA === idA && selectedPair.value.idB === idB) ||
    (selectedPair.value.idA === idB && selectedPair.value.idB === idA)
  )
}

function isCellActiveRowCol(idA: string, idB: string): boolean {
  if (!hoveredRowId.value || !hoveredColId.value) return false
  return idA === hoveredRowId.value || idB === hoveredColId.value
}

const selectedPairDetail = computed(() => {
  if (!selectedPair.value) return null
  const idxA = globalIndices.find(idx => idx.id === selectedPair.value.idA)
  const idxB = globalIndices.find(idx => idx.id === selectedPair.value.idB)
  if (!idxA || !idxB) return null

  const r = getCorrelation(idxA.id, idxB.id, selectedWindow.value)
  const { relationship, diversificationBenefit } = classifyCorrelation(r)

  return {
    idxA,
    idxB,
    r,
    relationship,
    benefit: diversificationBenefit
  }
})

function getBenefitClass(benefit: string) {
  if (benefit === 'High') return 'is-pos'
  if (benefit === 'Moderate') return 'oi-ink'
  return 'oi-muted'
}
</script>

<style scoped>
.correlation-heatmap-wrapper {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.heatmap-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s3);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 580px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: var(--oi-s3);
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-label {
  color: var(--oi-ink-3);
}

.pill-group {
  display: flex;
  gap: 4px;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: var(--oi-s3);
  padding: 8px 12px;
  background-color: var(--oi-canvas);
  border-radius: var(--oi-r-s);
  border: 1px solid var(--oi-hairline);
  flex-wrap: wrap;
}

.legend-scale {
  display: flex;
  align-items: center;
  gap: var(--oi-s3);
  flex-wrap: wrap;
}

.scale-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.scale-color {
  width: 14px;
  height: 14px;
  border-radius: 2px;
}

/* Scroll Container */
.matrix-scroll-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r);
  background-color: var(--oi-card);
}

.heatmap-table {
  border-collapse: separate;
  border-spacing: 1px;
  width: 100%;
  min-width: 860px;
}

.corner-header {
  background-color: var(--oi-card);
  padding: 10px 12px;
  text-align: left;
  color: var(--oi-ink-3);
  font-weight: 500;
  position: sticky;
  left: 0;
  z-index: 3;
}

.col-header {
  padding: 8px 4px;
  text-align: center;
  color: var(--oi-ink-2);
  background-color: var(--oi-card);
  font-weight: 500;
  font-size: 11px;
  transition: background-color var(--oi-dur) var(--oi-ease), color var(--oi-dur) var(--oi-ease);
}

.col-header.is-hovered {
  color: var(--oi-ink);
  background-color: var(--oi-hairline);
}

.col-flag {
  display: block;
  font-size: 13px;
  margin-bottom: 2px;
}

.col-symbol {
  display: block;
  white-space: nowrap;
}

.row-header {
  padding: 6px 12px;
  text-align: left;
  background-color: var(--oi-card);
  position: sticky;
  left: 0;
  z-index: 2;
  white-space: nowrap;
  font-weight: 500;
  color: var(--oi-ink-2);
  transition: background-color var(--oi-dur) var(--oi-ease), color var(--oi-dur) var(--oi-ease);
}

.row-header.is-hovered {
  color: var(--oi-ink);
  background-color: var(--oi-hairline);
}

.row-label-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.matrix-cell {
  height: 34px;
  min-width: 44px;
  text-align: center;
  font-size: 11.5px;
  cursor: pointer;
  transition: transform 0.1s ease, outline 0.1s ease;
  user-select: none;
}

.matrix-cell:hover {
  outline: 2px solid var(--oi-ink);
  outline-offset: -2px;
  z-index: 4;
}

.matrix-cell.is-selected {
  outline: 2px solid #00e200 !important;
  outline-offset: -2px;
  z-index: 5;
}

.matrix-cell.is-active-row-col {
  filter: brightness(1.2);
}

.matrix-cell.is-diagonal {
  cursor: default;
}

/* Pair Detail Drawer */
.pair-detail-drawer {
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r);
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.pair-summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s3);
  border-bottom: 1px solid var(--oi-hairline);
  padding-bottom: var(--oi-s3);
}

.pair-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pair-names-display {
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--oi-ink);
  display: flex;
  align-items: center;
  gap: 12px;
}

.pair-operator {
  color: var(--oi-ink-3);
  font-size: 14px;
}

.pair-stats-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.stat-pill {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-color: var(--oi-card);
  border: 1px solid var(--oi-hairline);
  padding: 6px 12px;
  border-radius: var(--oi-r-s);
}

.stat-label {
  color: var(--oi-ink-3);
  font-size: 10px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
}

.pair-analysis-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--oi-s3);
}

@media (max-width: 768px) {
  .pair-analysis-grid {
    grid-template-columns: 1fr;
  }
}

.analysis-box {
  background-color: var(--oi-card);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.analysis-title {
  color: var(--oi-ink-3);
}

.spread-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.spread-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px dashed var(--oi-hairline);
}

.spread-row:last-child {
  border-bottom: none;
}
</style>
