<template>
  <NuxtLink :to="`/indices/${index.id}`" class="index-card-link">
    <div class="oi-card-box card-content">
      <!-- Top Row: Flag, Name, Symbol & Market Status -->
      <div class="card-header">
        <div class="header-main">
          <span class="flag-icon" :title="index.country">{{ index.flag }}</span>
          <div class="identity-info">
            <h3 class="index-title">{{ index.shortName }}</h3>
            <span class="index-symbol font-mono">{{ index.symbol }} • {{ index.exchange }}</span>
          </div>
        </div>

        <div class="status-indicator">
          <button
            class="star-btn"
            :class="{ 'is-pinned': isPinned(index.id) }"
            :title="isPinned(index.id) ? 'Remove from Watchlist' : 'Add to Watchlist'"
            @click.prevent.stop="togglePin(index.id)"
          >
            ★
          </button>
          <span
            class="oi-dot"
            :class="{
              'closed': !marketStatus.isOpen,
              'pulse': marketStatus.isOpen
            }"
            :title="marketStatus.statusLabel"
          ></span>
          <span class="status-label oi-xs font-mono">{{ marketStatus.statusLabel }}</span>
        </div>
      </div>

      <!-- Price Level & Daily Change -->
      <div class="price-row">
        <div class="price-value-box">
          <span class="currency-symbol">{{ convertedPrice.symbol }}</span>
          <span class="current-price num-tabular">{{ convertedPrice.formatted }}</span>
        </div>

        <div
          class="change-badge num-tabular"
          :class="{
            'is-positive': index.change >= 0,
            'is-negative': index.change < 0
          }"
        >
          <span class="change-icon">{{ index.change >= 0 ? '+' : '' }}</span>
          <span>{{ index.changePercent >= 0 ? '+' : '' }}{{ index.changePercent.toFixed(2) }}%</span>
        </div>
      </div>

      <!-- Sparkline Trend Chart -->
      <div class="sparkline-wrapper">
        <svg
          class="sparkline-svg"
          viewBox="0 0 160 40"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient :id="`grad-${index.id}`" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                :stop-color="index.change >= 0 ? 'var(--oi-green)' : 'var(--oi-loss)'"
                stop-opacity="0.25"
              />
              <stop
                offset="100%"
                :stop-color="index.change >= 0 ? 'var(--oi-green)' : 'var(--oi-loss)'"
                stop-opacity="0.0"
              />
            </linearGradient>
          </defs>

          <!-- Area Fill -->
          <polygon
            :points="sparklineAreaPoints"
            :fill="`url(#grad-${index.id})`"
          />

          <!-- Line -->
          <polyline
            :points="sparklinePoints"
            fill="none"
            :stroke="index.change >= 0 ? 'var(--oi-green)' : 'var(--oi-loss)'"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <!-- Bottom Details: 52-Week Range & Valuation Badge -->
      <div class="card-footer">
        <div class="range-box">
          <div class="range-labels font-mono oi-xs">
            <span>52W L: {{ formatCompact(index.fiftyTwoWeekLow) }}</span>
            <span>52W H: {{ formatCompact(index.fiftyTwoWeekHigh) }}</span>
          </div>
          <div class="range-bar-track">
            <div
              class="range-bar-fill"
              :style="{ width: `${rangePercentage}%` }"
            ></div>
            <div
              class="range-pin"
              :style="{ left: `${rangePercentage}%` }"
            ></div>
          </div>
        </div>

        <div class="valuation-meta">
          <span class="pe-tag num-tabular font-mono">P/E {{ index.valuations.peRatio }}</span>
          <span
            class="val-status-badge"
            :class="index.valuations.historicalPE.status.toLowerCase().replace(' ', '-')"
          >
            {{ index.valuations.historicalPE.status }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IndexData } from '~/data/indices'
import { useMarketStatus } from '~/composables/useMarketStatus'
import { useCurrencyConverter } from '~/composables/useCurrencyConverter'
import { useWatchlist } from '~/composables/useWatchlist'

const props = defineProps<{
  index: IndexData
}>()

const { getStatusForIndex } = useMarketStatus()
const { convertValue } = useCurrencyConverter()
const { isPinned, togglePin } = useWatchlist()

const marketStatus = computed(() => getStatusForIndex(props.index))

const convertedPrice = computed(() => {
  return convertValue(props.index.currentLevel, props.index.currency)
})

// 52-Week Range Position
const rangePercentage = computed(() => {
  const min = props.index.fiftyTwoWeekLow
  const max = props.index.fiftyTwoWeekHigh
  const current = props.index.currentLevel
  if (max === min) return 50
  const ratio = (current - min) / (max - min)
  return Math.min(Math.max(ratio * 100, 2), 98)
})

// Sparkline SVG Coordinates
const sparklinePoints = computed(() => {
  const data = props.index.sparkline
  if (!data || data.length === 0) return ''
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 160
  const height = 36
  const padding = 2

  return data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width
      const y = height - ((val - min) / range) * (height - padding * 2) - padding
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
})

const sparklineAreaPoints = computed(() => {
  const points = sparklinePoints.value
  if (!points) return ''
  return `0,40 ${points} 160,40`
})

function formatCompact(val: number): string {
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k'
  return val.toFixed(0)
}
</script>

<style scoped>
.index-card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.card-content {
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
  height: 100%;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--oi-s2);
}

.header-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.flag-icon {
  font-size: 1.45rem;
  line-height: 1;
}

.identity-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.index-title {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--oi-ink);
}

.index-symbol {
  font-size: 11px;
  color: var(--oi-ink-3);
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 6px;
  border-radius: var(--oi-r-s);
  background-color: var(--oi-hairline);
}

.star-btn {
  background: transparent;
  border: none;
  color: var(--oi-ink-3);
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color var(--oi-dur) var(--oi-ease), transform 0.1s;
}

.star-btn:hover {
  color: #ffb020;
  transform: scale(1.2);
}

.star-btn.is-pinned {
  color: #ffb020;
}

.status-label {
  font-size: 10px;
  color: var(--oi-ink-2);
}

.price-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--oi-s2);
}

.price-value-box {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.currency-symbol {
  font-family: var(--font-heading);
  font-size: 1rem;
  color: var(--oi-ink-2);
}

.current-price {
  font-family: var(--font-heading);
  font-size: 1.55rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--oi-ink);
}

.change-badge {
  font-family: var(--font-heading);
  font-size: 12.5px;
  font-weight: 500;
  padding: 3px 7px;
  border-radius: var(--oi-r-s);
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.change-badge.is-positive {
  background-color: rgba(0, 226, 0, 0.12);
  color: var(--oi-green);
}

.change-badge.is-negative {
  background-color: rgba(255, 95, 83, 0.12);
  color: var(--oi-loss);
}

.sparkline-wrapper {
  width: 100%;
  height: 42px;
  margin-top: -4px;
}

.sparkline-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.card-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: var(--oi-s2);
  border-top: 1px solid var(--oi-hairline);
  margin-top: auto;
}

.range-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  color: var(--oi-ink-3);
  font-size: 10.5px;
}

.range-bar-track {
  width: 100%;
  height: 3px;
  background-color: var(--oi-hairline);
  border-radius: 2px;
  position: relative;
}

.range-bar-fill {
  height: 100%;
  background-color: var(--oi-ink-3);
  border-radius: 2px;
}

.range-pin {
  width: 5px;
  height: 7px;
  background-color: var(--oi-ink);
  border-radius: 1px;
  position: absolute;
  top: -2px;
  transform: translateX(-50%);
}

.valuation-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
}

.pe-tag {
  color: var(--oi-ink-2);
}

.val-status-badge {
  padding: 1px 6px;
  border-radius: 2px;
  font-size: 10.5px;
  font-weight: 500;
  text-transform: uppercase;
}

.val-status-badge.undervalued {
  background-color: rgba(0, 226, 0, 0.1);
  color: var(--oi-green);
}

.val-status-badge.fair-value {
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--oi-ink-2);
}

.val-status-badge.overvalued {
  background-color: rgba(255, 176, 32, 0.12);
  color: var(--oi-warning);
}
</style>
