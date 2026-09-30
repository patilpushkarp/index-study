<template>
  <div class="erp-chart-wrapper oi-card-box">
    <!-- Header -->
    <div class="chart-header">
      <div class="header-titles">
        <span class="meta-tag font-mono oi-xs">// VALUATION RELATIVE TO SOVEREIGN DEBT</span>
        <h3 class="oi-h3">Global Equity Risk Premium (ERP) Matrix</h3>
        <p class="oi-sm oi-muted">
          Excess yield of equity earnings over 10-year risk-free sovereign debt (<span class="font-mono">ERP = (1/PE) - 10Y Yield</span>).
        </p>
      </div>

      <!-- Sorting Controls -->
      <div class="header-controls">
        <span class="control-label font-mono oi-xs">SORT:</span>
        <div class="pill-group">
          <button
            class="oi-pill"
            :class="{ 'is-active': sortMode === 'erp' }"
            @click="sortMode = 'erp'"
          >
            Highest ERP
          </button>
          <button
            class="oi-pill"
            :class="{ 'is-active': sortMode === 'ey' }"
            @click="sortMode = 'ey'"
          >
            Earnings Yield
          </button>
          <button
            class="oi-pill"
            :class="{ 'is-active': sortMode === 'yield' }"
            @click="sortMode = 'yield'"
          >
            10Y Bond Yield
          </button>
        </div>
      </div>
    </div>

    <!-- Explainer Callout Box -->
    <div class="erp-callout oi-card-box">
      <div class="callout-grid font-mono oi-xs">
        <div class="callout-item">
          <span class="callout-badge is-attractive">POSITIVE ERP (&gt; +2.0%)</span>
          <span class="callout-text oi-muted">
            Equities yield substantially more than government debt. Strong margin of safety (e.g. Hang Seng, DAX, Nikkei, FTSE).
          </span>
        </div>
        <div class="callout-item">
          <span class="callout-badge is-tight">TIGHT / NEGATIVE ERP (&lt; 0.0%)</span>
          <span class="callout-text oi-muted">
            10Y Bond yields exceed equity earnings yields. Equities priced for aggressive earnings growth expectations (e.g. S&P 500, Nifty).
          </span>
        </div>
      </div>
    </div>

    <!-- Diverging Bar Chart Matrix -->
    <div class="erp-bars-container">
      <div
        v-for="item in sortedProfiles"
        :key="item.indexId"
        class="erp-row"
      >
        <!-- Meta Label -->
        <div class="row-meta">
          <span class="row-flag">{{ item.flag }}</span>
          <NuxtLink :to="`/indices/${item.indexId}`" class="row-name">
            {{ item.indexName }}
          </NuxtLink>
        </div>

        <!-- Metric Numbers -->
        <div class="row-yields font-mono oi-xs">
          <div class="yield-badge" title="Earnings Yield = 1 / P/E">
            <span class="oi-muted">EY:</span>
            <span class="num-tabular">{{ item.earningsYield.toFixed(2) }}%</span>
          </div>
          <div class="yield-badge" title="10-Year Sovereign Bond Yield">
            <span class="oi-muted">10Y:</span>
            <span class="num-tabular">{{ item.tenYearYield.toFixed(2) }}%</span>
          </div>
        </div>

        <!-- Center Diverging Visual Bar -->
        <div class="diverging-bar-track">
          <!-- Zero Center Line -->
          <div class="zero-center-line"></div>

          <!-- Negative Bar (Left of Zero) -->
          <div
            v-if="item.equityRiskPremium < 0"
            class="bar-fill-neg"
            :style="{ width: `${Math.min(50, Math.abs(item.equityRiskPremium) * 6.5)}%` }"
          >
            <span class="bar-num font-mono oi-xs is-neg">{{ item.equityRiskPremium.toFixed(2) }}%</span>
          </div>

          <!-- Positive Bar (Right of Zero) -->
          <div
            v-else
            class="bar-fill-pos"
            :style="{ width: `${Math.min(50, item.equityRiskPremium * 6.5)}%` }"
          >
            <span class="bar-num font-mono oi-xs is-pos">+{{ item.equityRiskPremium.toFixed(2) }}%</span>
          </div>
        </div>

        <!-- Rating Pill -->
        <div class="row-rating font-mono oi-xs">
          <span class="rating-chip" :class="getErpRatingClass(item.erpRating)">
            {{ item.erpRating }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { indexMacroProfiles, type IndexMacroProfile } from '~/data/macro'

const sortMode = ref<'erp' | 'ey' | 'yield'>('erp')

const sortedProfiles = computed(() => {
  const list = [...indexMacroProfiles]
  if (sortMode.value === 'erp') {
    return list.sort((a, b) => b.equityRiskPremium - a.equityRiskPremium)
  }
  if (sortMode.value === 'ey') {
    return list.sort((a, b) => b.earningsYield - a.earningsYield)
  }
  if (sortMode.value === 'yield') {
    return list.sort((a, b) => b.tenYearYield - a.tenYearYield)
  }
  return list
})

function getErpRatingClass(rating: IndexMacroProfile['erpRating']) {
  if (rating === 'Equities Highly Attractive') return 'chip-green'
  if (rating === 'Moderate Equity Premium') return 'chip-blue'
  if (rating === 'Tight / Debt Favorable') return 'chip-amber'
  return 'chip-red'
}
</script>

<style scoped>
.erp-chart-wrapper {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s3);
  border-bottom: 1px solid var(--oi-hairline);
  padding-bottom: var(--oi-s3);
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 600px;
}

.header-controls {
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

.erp-callout {
  padding: var(--oi-s3);
  background-color: var(--oi-canvas);
}

.callout-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--oi-s3);
}

@media (max-width: 768px) {
  .callout-grid {
    grid-template-columns: 1fr;
  }
}

.callout-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.callout-badge {
  font-weight: 600;
}

.callout-badge.is-attractive {
  color: var(--oi-green);
}

.callout-badge.is-tight {
  color: #fbbf24;
}

.erp-bars-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.erp-row {
  display: grid;
  grid-template-columns: 160px 140px 1fr 180px;
  align-items: center;
  gap: var(--oi-s3);
  padding: 8px 12px;
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
  transition: background-color var(--oi-dur) var(--oi-ease), border-color var(--oi-dur) var(--oi-ease);
}

@media (max-width: 900px) {
  .erp-row {
    grid-template-columns: 140px 120px 1fr;
  }
  .row-rating {
    display: none;
  }
}

.erp-row:hover {
  background-color: var(--oi-card-hover);
  border-color: var(--oi-ink-3);
}

.row-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-flag {
  font-size: 1.15rem;
}

.row-name {
  font-weight: 500;
  color: var(--oi-ink);
  text-decoration: none;
}

.row-name:hover {
  text-decoration: underline;
}

.row-yields {
  display: flex;
  align-items: center;
  gap: 12px;
}

.yield-badge {
  display: flex;
  align-items: center;
  gap: 4px;
}

.diverging-bar-track {
  height: 24px;
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: 3px;
  position: relative;
  display: flex;
  align-items: center;
}

.zero-center-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: var(--oi-ink-3);
  z-index: 2;
}

.bar-fill-neg {
  position: absolute;
  right: 50%;
  height: 100%;
  background-color: rgba(255, 95, 83, 0.35);
  border-right: 2px solid var(--oi-loss);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 6px;
  border-radius: 3px 0 0 3px;
}

.bar-fill-pos {
  position: absolute;
  left: 50%;
  height: 100%;
  background-color: rgba(0, 226, 0, 0.35);
  border-left: 2px solid var(--oi-green);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 6px;
  border-radius: 0 3px 3px 0;
}

.bar-num {
  font-weight: 600;
  white-space: nowrap;
}

.row-rating {
  display: flex;
  justify-content: flex-end;
}

.rating-chip {
  padding: 3px 8px;
  border-radius: var(--oi-r-s);
  font-size: 10px;
  white-space: nowrap;
}

.chip-green {
  background-color: rgba(0, 226, 0, 0.15);
  color: var(--oi-green);
  border: 1px solid var(--oi-green);
}

.chip-blue {
  background-color: rgba(45, 104, 255, 0.15);
  color: #60a5fa;
  border: 1px solid #60a5fa;
}

.chip-amber {
  background-color: rgba(255, 176, 32, 0.15);
  color: #fbbf24;
  border: 1px solid #fbbf24;
}

.chip-red {
  background-color: rgba(255, 95, 83, 0.15);
  color: var(--oi-loss);
  border: 1px solid var(--oi-loss);
}

.is-pos {
  color: var(--oi-green);
}

.is-neg {
  color: var(--oi-loss);
}
</style>
