<template>
  <div class="overview-page">
    <div class="oi-container">
      <!-- Editorial Hero Header -->
      <section class="hero-section">
        <span class="meta-tag font-mono oi-xs">// 01. GLOBAL BENCHMARK REGISTRY</span>
        <h1 class="oi-display hero-title">
          World Stock Market Indices, <span class="oi-serif">tracked in real-time.</span>
        </h1>
        <p class="oi-body hero-subtitle">
          Institutional telemetry, valuation multiples, 52-week ranges, and constituent weightings for {{ globalIndices.length }} major global equity benchmarks across 5 continents.
        </p>
      </section>

      <!-- Market Pulse Highlight Cards -->
      <section class="pulse-highlights">
        <!-- Top Gainer -->
        <div class="pulse-card oi-card-box">
          <div class="pulse-meta font-mono oi-xs">
            <span class="oi-dot"></span>
            <span>TOP 24H PERFORMER</span>
          </div>
          <div class="pulse-content" v-if="topGainer">
            <span class="pulse-name oi-h3">{{ topGainer.shortName }}</span>
            <span class="pulse-value num-tabular is-pos">+{{ topGainer.changePercent.toFixed(2) }}%</span>
          </div>
        </div>

        <!-- Lowest Valuation P/E -->
        <div class="pulse-card oi-card-box">
          <div class="pulse-meta font-mono oi-xs">
            <span class="oi-dot"></span>
            <span>ATTRACTIVE VALUATION</span>
          </div>
          <div class="pulse-content" v-if="lowestPE">
            <span class="pulse-name oi-h3">{{ lowestPE.shortName }}</span>
            <span class="pulse-value num-tabular font-mono">{{ lowestPE.valuations.peRatio }}x P/E</span>
          </div>
        </div>

        <!-- Highest Dividend Yield -->
        <div class="pulse-card oi-card-box">
          <div class="pulse-meta font-mono oi-xs">
            <span class="oi-dot"></span>
            <span>HIGHEST DIVIDEND YIELD</span>
          </div>
          <div class="pulse-content" v-if="highestYield">
            <span class="pulse-name oi-h3">{{ highestYield.shortName }}</span>
            <span class="pulse-value num-tabular font-mono">{{ highestYield.valuations.dividendYield.toFixed(2) }}%</span>
          </div>
        </div>

        <!-- Largest Market Cap -->
        <div class="pulse-card oi-card-box">
          <div class="pulse-meta font-mono oi-xs">
            <span class="oi-dot"></span>
            <span>LARGEST CAPITALIZATION</span>
          </div>
          <div class="pulse-content" v-if="largestCap">
            <span class="pulse-name oi-h3">{{ largestCap.shortName }}</span>
            <span class="pulse-value num-tabular font-mono">{{ largestCap.marketCapUSD }}</span>
          </div>
        </div>
      </section>

      <!-- Filter & Controls Toolbar -->
      <section class="toolbar-section">
        <!-- Search Input -->
        <div class="search-box">
          <span class="search-icon font-mono">⌕</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by index, ticker, or country..."
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-btn font-mono" @click="searchQuery = ''">✕</button>
        </div>

        <!-- Regional Filter Pills -->
        <div class="regions-filter">
          <button
            class="oi-pill"
            :class="{ 'is-active': selectedRegion === 'Watchlist' }"
            @click="selectedRegion = 'Watchlist'"
          >
            ★ Watchlist ({{ watchlist.length }})
          </button>
          <button
            v-for="region in regions"
            :key="region"
            class="oi-pill"
            :class="{ 'is-active': selectedRegion === region }"
            @click="selectedRegion = region"
          >
            {{ region }}
          </button>
        </div>

        <!-- Performance Range Toggle -->
        <div class="perf-timeframe">
          <button
            v-for="tf in perfTimeframes"
            :key="tf"
            class="oi-pill"
            :class="{ 'is-active': selectedPerf === tf }"
            @click="selectedPerf = tf"
          >
            {{ tf }}
          </button>
        </div>
      </section>

      <!-- Active Filter Status -->
      <div class="filter-count-row font-mono oi-xs oi-muted">
        <span>SHOWING {{ filteredIndices.length }} OF {{ globalIndices.length }} INDICES</span>
        <span v-if="searchQuery || selectedRegion !== 'All'" class="reset-link" @click="resetFilters">
          Reset filters ↗︎
        </span>
      </div>

      <!-- Indices Grid -->
      <section class="indices-grid">
        <IndexCard
          v-for="idx in filteredIndices"
          :key="idx.id"
          :index="idx"
        />
      </section>

      <!-- Empty State -->
      <div v-if="filteredIndices.length === 0" class="empty-state oi-card-box">
        <p class="oi-h3">No matching global indices found</p>
        <p class="oi-body">Try adjusting your search query or region filter.</p>
        <button class="oi-btn is-white" @click="resetFilters">Clear Search</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { globalIndices, type IndexData } from '~/data/indices'
import IndexCard from '~/components/IndexCard.vue'
import { useWatchlist } from '~/composables/useWatchlist'

const { watchlist } = useWatchlist()

// Search and Filter states
const searchQuery = ref('')
const selectedRegion = ref<'All' | 'Watchlist' | 'Americas' | 'Europe' | 'Asia-Pacific' | 'Emerging'>('All')
const selectedPerf = ref<'1D' | '1W' | '1M' | 'YTD' | '1Y'>('1D')

const regions = ['All', 'Americas', 'Europe', 'Asia-Pacific', 'Emerging'] as const
const perfTimeframes = ['1D', '1W', '1M', 'YTD', '1Y'] as const

// Top Highlight Metrics
const topGainer = computed(() => {
  return [...globalIndices].sort((a, b) => b.changePercent - a.changePercent)[0]
})

const lowestPE = computed(() => {
  return [...globalIndices].sort((a, b) => a.valuations.peRatio - b.valuations.peRatio)[0]
})

const highestYield = computed(() => {
  return [...globalIndices].sort((a, b) => b.valuations.dividendYield - a.valuations.dividendYield)[0]
})

const largestCap = computed(() => {
  return [...globalIndices].sort((a, b) => {
    const parseCap = (str: string) => parseFloat(str.replace(/[^0-9.]/g, '')) || 0
    return parseCap(b.marketCapUSD) - parseCap(a.marketCapUSD)
  })[0]
})

// Filtered list
const filteredIndices = computed(() => {
  return globalIndices.filter(item => {
    // Watchlist or Region match
    if (selectedRegion.value === 'Watchlist') {
      if (!watchlist.value.includes(item.id)) return false
    } else if (selectedRegion.value !== 'All' && item.region !== selectedRegion.value) {
      return false
    }

    // Search query match
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const matchName = item.name.toLowerCase().includes(q)
      const matchShort = item.shortName.toLowerCase().includes(q)
      const matchSymbol = item.symbol.toLowerCase().includes(q)
      const matchCountry = item.country.toLowerCase().includes(q)
      return matchName || matchShort || matchSymbol || matchCountry
    }

    return true
  })
})

function resetFilters() {
  searchQuery.value = ''
  selectedRegion.value = 'All'
}
</script>

<style scoped>
.overview-page {
  padding-top: var(--oi-s5);
  padding-bottom: var(--oi-s6);
}

.hero-section {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
  margin-bottom: var(--oi-s5);
}

.hero-title {
  max-width: 24ch;
}

.hero-subtitle {
  max-width: 68ch;
}

.pulse-highlights {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--oi-s3);
  margin-bottom: var(--oi-s5);
}

@media (max-width: 992px) {
  .pulse-highlights {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 580px) {
  .pulse-highlights {
    grid-template-columns: 1fr;
  }
}

.pulse-card {
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s2);
}

.pulse-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--oi-ink-3);
  letter-spacing: 0.08em;
}

.pulse-content {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.pulse-name {
  color: var(--oi-ink);
}

.pulse-value {
  font-size: 1.15rem;
  font-weight: 600;
}

.pulse-value.is-pos {
  color: var(--oi-green);
}

.toolbar-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s3);
  background-color: var(--oi-card);
  border: 1px solid var(--oi-hairline);
  padding: var(--oi-s3);
  border-radius: var(--oi-r-l);
  margin-bottom: var(--oi-s3);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r);
  padding: 6px 12px;
  flex: 1;
  min-width: 260px;
}

.search-icon {
  color: var(--oi-ink-3);
  font-size: 14px;
}

.search-input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--oi-ink);
  font-family: var(--font-body);
  font-size: 13.5px;
  width: 100%;
}

.search-input::placeholder {
  color: var(--oi-ink-3);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--oi-ink-3);
  cursor: pointer;
  padding: 0;
  font-size: 11px;
}

.regions-filter {
  display: flex;
  align-items: center;
  gap: 5px;
  overflow-x: auto;
}

.perf-timeframe {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: var(--oi-canvas);
  padding: 3px;
  border-radius: var(--oi-r);
  border: 1px solid var(--oi-hairline);
}

.filter-count-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--oi-s4);
}

.reset-link {
  cursor: pointer;
  color: var(--oi-ink-2);
}

.reset-link:hover {
  color: var(--oi-ink);
}

.indices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--oi-s4);
}

@media (max-width: 680px) {
  .indices-grid {
    grid-template-columns: 1fr;
  }
}

.empty-state {
  padding: var(--oi-s6);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--oi-s3);
}
</style>
