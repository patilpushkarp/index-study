<template>
  <div class="screener-page">
    <div class="oi-container">
      <!-- Header -->
      <section class="screen-header">
        <span class="meta-tag font-mono oi-xs">// 06. MULTI-FACTOR VALUATION & PERFORMANCE FILTER</span>
        <h1 class="oi-display">
          Multi-Factor Index Screener, <span class="oi-serif">filter by fundamentals.</span>
        </h1>
        <p class="oi-body">
          Screen across world benchmarks using trailing valuation multiples, dividend yields, 1-year momentum, and weighting methodology with instant data export.
        </p>
      </section>

      <!-- Filter Controls Panel -->
      <section class="filter-panel oi-card-box">
        <div class="filters-grid">
          <!-- Region Filter -->
          <div class="filter-group">
            <label class="filter-label font-mono oi-xs">REGION</label>
            <select v-model="selectedRegion" class="filter-select font-mono oi-sm">
              <option value="All">All Regions (18)</option>
              <option value="Watchlist">★ My Pinned Watchlist</option>
              <option value="Americas">Americas</option>
              <option value="Europe">Europe</option>
              <option value="Asia-Pacific">Asia-Pacific</option>
              <option value="Emerging">Emerging</option>
            </select>
          </div>

          <!-- Max P/E Slider -->
          <div class="filter-group">
            <div class="filter-label-row">
              <label class="filter-label font-mono oi-xs">MAX P/E RATIO</label>
              <span class="filter-val font-mono oi-xs num-tabular">&le; {{ maxPE }}x</span>
            </div>
            <input
              v-model.number="maxPE"
              type="range"
              min="8"
              max="40"
              step="1"
              class="filter-range"
            />
          </div>

          <!-- Min Dividend Yield Slider -->
          <div class="filter-group">
            <div class="filter-label-row">
              <label class="filter-label font-mono oi-xs">MIN DIVIDEND YIELD</label>
              <span class="filter-val font-mono oi-xs num-tabular">&ge; {{ minYield }}%</span>
            </div>
            <input
              v-model.number="minYield"
              type="range"
              min="0"
              max="6"
              step="0.25"
              class="filter-range"
            />
          </div>

          <!-- Min 1-Year Return Slider -->
          <div class="filter-group">
            <div class="filter-label-row">
              <label class="filter-label font-mono oi-xs">MIN 1Y RETURN</label>
              <span class="filter-val font-mono oi-xs num-tabular">&ge; {{ minReturn }}%</span>
            </div>
            <input
              v-model.number="minReturn"
              type="range"
              min="-20"
              max="35"
              step="2"
              class="filter-range"
            />
          </div>

          <!-- Valuation Status -->
          <div class="filter-group">
            <label class="filter-label font-mono oi-xs">VALUATION STATUS</label>
            <select v-model="valStatus" class="filter-select font-mono oi-sm">
              <option value="All">All Valuation States</option>
              <option value="Undervalued">Undervalued</option>
              <option value="Fair Value">Fair Value</option>
              <option value="Overvalued">Overvalued</option>
            </select>
          </div>

          <!-- Weighting Style -->
          <div class="filter-group">
            <label class="filter-label font-mono oi-xs">WEIGHTING METHODOLOGY</label>
            <select v-model="selectedWeighting" class="filter-select font-mono oi-sm">
              <option value="All">All Methodologies</option>
              <option value="Free-Float Market Cap">Free-Float Market Cap</option>
              <option value="Price Weighted">Price Weighted</option>
            </select>
          </div>
        </div>

        <div class="filter-footer font-mono oi-xs">
          <span>MATCHING BENCHMARKS: {{ filteredList.length }} OF {{ globalIndices.length }}</span>
          <button class="reset-btn" @click="resetFilters">Reset Filters ↺</button>
        </div>
      </section>

      <!-- Screener Results Table & Export Toolbar -->
      <section class="results-section oi-card-box">
        <div class="results-toolbar">
          <div class="results-summary font-mono oi-xs oi-muted">
            SHOWING {{ sortedList.length }} MATCHED BENCHMARKS
          </div>

          <!-- Data Export Buttons -->
          <div class="export-actions">
            <button class="oi-btn oi-xs" @click="handleExportCSV">
              Export CSV ↓
            </button>
            <button class="oi-btn oi-xs" @click="handleExportJSON">
              Export JSON ↓
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="screener-table">
            <thead>
              <tr class="font-mono oi-xs">
                <th>PIN</th>
                <th class="is-sortable" @click="setSort('name')">
                  INDEX <span v-if="sortBy === 'name'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="is-sortable" @click="setSort('country')">
                  REGION <span v-if="sortBy === 'country'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="is-sortable" @click="setSort('peRatio')">
                  P/E (TTM) <span v-if="sortBy === 'peRatio'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="is-sortable" @click="setSort('pbRatio')">
                  P/B <span v-if="sortBy === 'pbRatio'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="is-sortable" @click="setSort('dividendYield')">
                  DIV YIELD <span v-if="sortBy === 'dividendYield'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="is-sortable" @click="setSort('changePercent')">
                  24H CHANGE <span v-if="sortBy === 'changePercent'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="is-sortable" @click="setSort('1Y')">
                  1-YEAR <span v-if="sortBy === '1Y'">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th>VALUATION STATE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="idx in sortedList"
                :key="idx.id"
                class="screen-row"
              >
                <!-- Watchlist Star -->
                <td class="td-pin">
                  <button
                    class="pin-btn"
                    :class="{ 'is-pinned': isPinned(idx.id) }"
                    :title="isPinned(idx.id) ? 'Remove from Watchlist' : 'Add to Watchlist'"
                    @click="togglePin(idx.id)"
                  >
                    ★
                  </button>
                </td>

                <td class="td-index">
                  <span class="flag-icon">{{ idx.flag }}</span>
                  <div class="name-meta">
                    <span class="short-name">{{ idx.shortName }}</span>
                    <span class="symbol-sub font-mono oi-xs">{{ idx.symbol }}</span>
                  </div>
                </td>
                <td class="td-region oi-sm">{{ idx.country }}</td>
                <td class="td-pe num-tabular font-mono oi-sm">{{ idx.valuations.peRatio }}x</td>
                <td class="td-pb num-tabular font-mono oi-sm">{{ idx.valuations.pbRatio }}x</td>
                <td class="td-yield num-tabular font-mono oi-sm">{{ idx.valuations.dividendYield.toFixed(2) }}%</td>
                <td
                  class="td-delta num-tabular font-mono oi-sm"
                  :class="idx.change >= 0 ? 'is-pos' : 'is-neg'"
                >
                  {{ idx.changePercent >= 0 ? '+' : '' }}{{ idx.changePercent.toFixed(2) }}%
                </td>
                <td
                  class="td-1y num-tabular font-mono oi-sm"
                  :class="idx.performance['1Y'] >= 0 ? 'is-pos' : 'is-neg'"
                >
                  {{ idx.performance['1Y'] >= 0 ? '+' : '' }}{{ idx.performance['1Y'] }}%
                </td>
                <td>
                  <span
                    class="status-chip font-mono oi-xs"
                    :class="idx.valuations.historicalPE.status.toLowerCase().replace(' ', '-')"
                  >
                    {{ idx.valuations.historicalPE.status }}
                  </span>
                </td>
                <td>
                  <NuxtLink :to="`/indices/${idx.id}`" class="oi-btn is-white oi-xs">
                    View ↗
                  </NuxtLink>
                </td>
              </tr>
              <tr v-if="sortedList.length === 0">
                <td colspan="10" class="empty-results oi-sm oi-muted font-mono">
                  No global indices match your active filter criteria. Try adjusting the P/E or dividend yield sliders.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { globalIndices, type IndexData } from '~/data/indices'
import { useWatchlist } from '~/composables/useWatchlist'
import { exportToCSV, exportToJSON } from '~/utils/exportData'

const { watchlist, isPinned, togglePin } = useWatchlist()

// Filter State
const selectedRegion = ref('All')
const maxPE = ref(40)
const minYield = ref(0)
const minReturn = ref(-20)
const valStatus = ref('All')
const selectedWeighting = ref('All')

// Sort State
const sortBy = ref<'name' | 'country' | 'peRatio' | 'pbRatio' | 'dividendYield' | 'changePercent' | '1Y'>('peRatio')
const sortDir = ref<'asc' | 'desc'>('asc')

function resetFilters() {
  selectedRegion.value = 'All'
  maxPE.value = 40
  minYield.value = 0
  minReturn.value = -20
  valStatus.value = 'All'
  selectedWeighting.value = 'All'
}

function setSort(col: typeof sortBy.value) {
  if (sortBy.value === col) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = col
    sortDir.value = (col === 'dividendYield' || col === 'changePercent' || col === '1Y') ? 'desc' : 'asc'
  }
}

const filteredList = computed(() => {
  return globalIndices.filter(item => {
    // Watchlist or Region filter
    if (selectedRegion.value === 'Watchlist') {
      if (!watchlist.value.includes(item.id)) return false
    } else if (selectedRegion.value !== 'All' && item.region !== selectedRegion.value) {
      return false
    }

    // PE filter
    if (item.valuations.peRatio > maxPE.value) return false

    // Dividend Yield filter
    if (item.valuations.dividendYield < minYield.value) return false

    // 1Y Return filter
    if (item.performance['1Y'] < minReturn.value) return false

    // Valuation Status
    if (valStatus.value !== 'All' && item.valuations.historicalPE.status !== valStatus.value) {
      return false
    }

    // Weighting filter
    if (selectedWeighting.value !== 'All' && item.weightingType !== selectedWeighting.value) {
      return false
    }

    return true
  })
})

const sortedList = computed(() => {
  return [...filteredList.value].sort((a, b) => {
    let aVal: any
    let bVal: any

    switch (sortBy.value) {
      case 'name':
        aVal = a.name
        bVal = b.name
        break
      case 'country':
        aVal = a.country
        bVal = b.country
        break
      case 'peRatio':
        aVal = a.valuations.peRatio
        bVal = b.valuations.peRatio
        break
      case 'pbRatio':
        aVal = a.valuations.pbRatio
        bVal = b.valuations.pbRatio
        break
      case 'dividendYield':
        aVal = a.valuations.dividendYield
        bVal = b.valuations.dividendYield
        break
      case 'changePercent':
        aVal = a.changePercent
        bVal = b.changePercent
        break
      case '1Y':
        aVal = a.performance['1Y']
        bVal = b.performance['1Y']
        break
      default:
        aVal = a.name
        bVal = b.name
    }

    if (aVal === bVal) return 0
    const res = aVal > bVal ? 1 : -1
    return sortDir.value === 'asc' ? res : -res
  })
})

// Data Export Handlers
function handleExportCSV() {
  const exportPayload = sortedList.value.map(idx => ({
    Ticker: idx.symbol,
    Name: idx.name,
    Country: idx.country,
    Region: idx.region,
    Currency: idx.currency,
    CurrentLevel: idx.currentLevel,
    DailyChangePercent: idx.changePercent,
    Return1Y: idx.performance['1Y'],
    TrailingPE: idx.valuations.peRatio,
    PriceToBook: idx.valuations.pbRatio,
    DividendYield: idx.valuations.dividendYield,
    ValuationState: idx.valuations.historicalPE.status,
    WeightingStyle: idx.weightingType,
    MarketCapUSD: idx.marketCapUSD
  }))

  exportToCSV(exportPayload, 'global_indices_screener_results')
}

function handleExportJSON() {
  const exportPayload = sortedList.value.map(idx => ({
    id: idx.id,
    symbol: idx.symbol,
    name: idx.name,
    country: idx.country,
    region: idx.region,
    currency: idx.currency,
    currentLevel: idx.currentLevel,
    changePercent: idx.changePercent,
    performance1Y: idx.performance['1Y'],
    valuations: {
      pe: idx.valuations.peRatio,
      pb: idx.valuations.pbRatio,
      dividendYield: idx.valuations.dividendYield,
      status: idx.valuations.historicalPE.status
    },
    weighting: idx.weightingType,
    marketCapUSD: idx.marketCapUSD
  }))

  exportToJSON(exportPayload, 'global_indices_screener_results')
}

useHead({
  title: 'Global Stock Indices Screener — INDEX // STUDY',
  meta: [
    { name: 'description', content: 'Screen 18 global stock market indices by P/E ratio, dividend yield, 1Y momentum, and valuation status with instant CSV/JSON data export.' }
  ]
})
</script>

<style scoped>
.screener-page {
  padding-top: var(--oi-s5);
  padding-bottom: var(--oi-s7);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s5);
}

.screen-header {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.filter-panel {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--oi-s4);
}

@media (max-width: 900px) {
  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-label {
  color: var(--oi-ink-3);
}

.filter-val {
  color: var(--oi-ink);
  font-weight: 500;
}

.filter-select {
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  color: var(--oi-ink);
  padding: 8px 12px;
  border-radius: var(--oi-r-s);
  outline: none;
}

.filter-select:focus {
  border-color: var(--oi-ink-2);
}

.filter-range {
  accent-color: var(--oi-ink);
  cursor: pointer;
}

.filter-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--oi-hairline);
  padding-top: var(--oi-s3);
  color: var(--oi-ink-3);
}

.reset-btn {
  background: none;
  border: none;
  color: var(--oi-ink);
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}

.reset-btn:hover {
  text-decoration: underline;
}

.results-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.results-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--oi-s3) var(--oi-s4);
  border-bottom: 1px solid var(--oi-hairline);
  flex-wrap: wrap;
  gap: var(--oi-s2);
}

.export-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.screener-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.screener-table th,
.screener-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--oi-hairline);
}

.screener-table th {
  color: var(--oi-ink-3);
  font-weight: 500;
}

.is-sortable {
  cursor: pointer;
  user-select: none;
}

.is-sortable:hover {
  color: var(--oi-ink);
}

.screen-row:hover td {
  background-color: var(--oi-card-hover);
}

.td-pin {
  width: 36px;
  text-align: center;
}

.pin-btn {
  background: none;
  border: none;
  color: var(--oi-ink-3);
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s, color var(--oi-dur) var(--oi-ease);
}

.pin-btn:hover {
  color: #ffb020;
  transform: scale(1.2);
}

.pin-btn.is-pinned {
  color: #ffb020;
}

.td-index {
  display: flex;
  align-items: center;
  gap: 10px;
}

.flag-icon {
  font-size: 1.25rem;
}

.name-meta {
  display: flex;
  flex-direction: column;
}

.short-name {
  font-weight: 500;
  color: var(--oi-ink);
}

.symbol-sub {
  color: var(--oi-ink-3);
}

.status-chip {
  padding: 3px 8px;
  border-radius: var(--oi-r-s);
  border: 1px solid var(--oi-hairline);
  font-size: 11px;
}

.status-chip.undervalued {
  background-color: rgba(0, 226, 0, 0.15);
  color: var(--oi-green);
  border-color: rgba(0, 226, 0, 0.3);
}

.status-chip.fair-value {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--oi-ink-2);
}

.status-chip.overvalued {
  background-color: rgba(255, 95, 83, 0.15);
  color: var(--oi-loss);
  border-color: rgba(255, 95, 83, 0.3);
}

.empty-results {
  text-align: center;
  padding: 48px !important;
}

.is-pos {
  color: var(--oi-green);
}

.is-neg {
  color: var(--oi-loss);
}
</style>
