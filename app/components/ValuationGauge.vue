<template>
  <div class="val-card oi-card-box">
    <div class="val-header">
      <div class="title-meta">
        <h3 class="oi-h3">Fundamental Valuation</h3>
        <span class="meta-tag font-mono oi-xs">HISTORICAL 10Y METRICS</span>
      </div>

      <span
        class="val-badge"
        :class="historical.status.toLowerCase().replace(' ', '-')"
      >
        {{ historical.status }}
      </span>
    </div>

    <!-- Key Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-item">
        <span class="metric-label font-mono oi-xs">TRAILING P/E</span>
        <span class="metric-val num-tabular">{{ pe.toFixed(1) }}x</span>
      </div>
      <div class="metric-item">
        <span class="metric-label font-mono oi-xs">FORWARD P/E</span>
        <span class="metric-val num-tabular">{{ forwardPe.toFixed(1) }}x</span>
      </div>
      <div class="metric-item">
        <span class="metric-label font-mono oi-xs">PRICE TO BOOK</span>
        <span class="metric-val num-tabular">{{ pb.toFixed(2) }}x</span>
      </div>
      <div class="metric-item">
        <span class="metric-label font-mono oi-xs">DIVIDEND YIELD</span>
        <span class="metric-val num-tabular">{{ dividendYield.toFixed(2) }}%</span>
      </div>
    </div>

    <!-- Visual P/E Thermometer / Range Gauge -->
    <div class="pe-gauge-container">
      <div class="gauge-labels font-mono oi-xs">
        <span>Min {{ historical.min10Y }}x</span>
        <span>10Y Mean {{ historical.mean10Y }}x</span>
        <span>Max {{ historical.max10Y }}x</span>
      </div>

      <div class="gauge-bar-track">
        <!-- Mean Marker -->
        <div
          class="mean-marker"
          :style="{ left: `${meanPercent}%` }"
          title="10Y Mean"
        ></div>

        <!-- Current PE Pin -->
        <div
          class="current-pin"
          :style="{ left: `${currentPercent}%` }"
          :title="`Current PE: ${pe}x`"
        >
          <div class="pin-triangle"></div>
          <span class="pin-label font-mono">{{ pe }}x</span>
        </div>
      </div>

      <div class="gauge-zones font-mono oi-xs">
        <span class="zone-cheap">Undervalued &lt; {{ (historical.mean10Y - historical.sd10Y).toFixed(1) }}x</span>
        <span class="zone-rich">Overvalued &gt; {{ (historical.mean10Y + historical.sd10Y).toFixed(1) }}x</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  pe: number
  forwardPe: number
  pb: number
  dividendYield: number
  historical: {
    min10Y: number
    max10Y: number
    mean10Y: number
    sd10Y: number
    status: 'Undervalued' | 'Fair Value' | 'Overvalued'
  }
}>()

const currentPercent = computed(() => {
  const range = props.historical.max10Y - props.historical.min10Y || 1
  const pct = ((props.pe - props.historical.min10Y) / range) * 100
  return Math.min(Math.max(pct, 2), 98)
})

const meanPercent = computed(() => {
  const range = props.historical.max10Y - props.historical.min10Y || 1
  const pct = ((props.historical.mean10Y - props.historical.min10Y) / range) * 100
  return Math.min(Math.max(pct, 5), 95)
})
</script>

<style scoped>
.val-card {
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.val-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.val-badge {
  padding: 3px 8px;
  border-radius: var(--oi-r-s);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.val-badge.undervalued {
  background-color: rgba(0, 226, 0, 0.12);
  color: var(--oi-green);
}

.val-badge.fair-value {
  background-color: var(--oi-hairline);
  color: var(--oi-ink);
}

.val-badge.overvalued {
  background-color: rgba(255, 176, 32, 0.15);
  color: var(--oi-warning);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--oi-s2);
}

@media (max-width: 600px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: var(--oi-hairline-light);
  padding: 10px;
  border-radius: var(--oi-r-s);
}

.metric-label {
  color: var(--oi-ink-3);
  font-size: 10.5px;
}

.metric-val {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--oi-ink);
}

.pe-gauge-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--oi-hairline);
}

.gauge-labels {
  display: flex;
  justify-content: space-between;
  color: var(--oi-ink-3);
}

.gauge-bar-track {
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, rgba(0, 226, 0, 0.3) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 176, 32, 0.4) 100%);
  border-radius: 3px;
  position: relative;
  margin: 14px 0 10px 0;
}

.mean-marker {
  position: absolute;
  top: -4px;
  bottom: -4px;
  width: 2px;
  background-color: var(--oi-ink-2);
  transform: translateX(-50%);
}

.current-pin {
  position: absolute;
  top: -18px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pin-label {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--oi-ink);
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  padding: 1px 4px;
  border-radius: 2px;
  white-space: nowrap;
}

.pin-triangle {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid var(--oi-ink);
  margin-top: 1px;
}

.gauge-zones {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--oi-ink-3);
}

.zone-cheap {
  color: var(--oi-green);
}

.zone-rich {
  color: var(--oi-warning);
}
</style>
