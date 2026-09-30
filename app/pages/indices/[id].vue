<template>
  <div v-if="index" class="detail-page">
    <div class="oi-container">
      <!-- Breadcrumb / Back Link -->
      <div class="breadcrumb-row">
        <NuxtLink to="/" class="back-link font-mono oi-xs">
          ← BACK TO ALL INDICES
        </NuxtLink>
        <span class="region-badge font-mono oi-xs">{{ index.region }}</span>
      </div>

      <!-- Main Header Section -->
      <section class="detail-header">
        <div class="header-top">
          <div class="title-cluster">
            <span class="flag-large">{{ index.flag }}</span>
            <div class="names-block">
              <span class="meta-tag font-mono oi-xs">{{ index.provider }} • {{ index.exchange }}</span>
              <h1 class="oi-h1 index-full-name">{{ index.name }}</h1>
              <span class="ticker-sub font-mono">{{ index.symbol }}</span>
            </div>
          </div>

          <!-- Market Status Badge -->
          <div class="market-status-box oi-card-box">
            <div class="status-top">
              <span
                class="oi-dot"
                :class="{
                  'closed': !marketStatus.isOpen,
                  'pulse': marketStatus.isOpen
                }"
              ></span>
              <span class="status-state font-mono oi-xs">{{ marketStatus.statusLabel }}</span>
            </div>
            <div class="status-local-time num-tabular font-mono">{{ marketStatus.localTimeFormatted }}</div>
            <div class="status-countdown oi-xs oi-faint font-mono">{{ marketStatus.countdownFormatted }}</div>
            <div class="status-tz oi-xs oi-muted font-mono">{{ index.tradingHours.timezoneLabel }}</div>
          </div>
        </div>

        <!-- Live Quote Row -->
        <div class="quote-row">
          <div class="primary-quote">
            <span class="currency-code oi-h3 oi-muted">{{ convertedLevel.symbol }}</span>
            <span class="level-value oi-display num-tabular">{{ convertedLevel.formatted }}</span>
          </div>

          <div class="quote-deltas">
            <span
              class="delta-badge num-tabular oi-h3"
              :class="index.change >= 0 ? 'is-pos' : 'is-neg'"
            >
              {{ index.change >= 0 ? '+' : '' }}{{ index.change.toFixed(2) }}
              ({{ index.changePercent >= 0 ? '+' : '' }}{{ index.changePercent.toFixed(2) }}%)
            </span>
            <span class="prev-close font-mono oi-xs oi-muted">
              Prev Close: {{ convertedLevel.symbol }}{{ formatNumber(index.previousClose) }}
            </span>
          </div>
        </div>

        <!-- Stats Ribbon -->
        <div class="stats-ribbon">
          <div class="stat-pill">
            <span class="stat-k font-mono oi-xs">DAY RANGE</span>
            <span class="stat-v num-tabular oi-sm">{{ formatNumber(index.dayLow) }} - {{ formatNumber(index.dayHigh) }}</span>
          </div>
          <div class="stat-pill">
            <span class="stat-k font-mono oi-xs">52-WEEK RANGE</span>
            <span class="stat-v num-tabular oi-sm">{{ formatNumber(index.fiftyTwoWeekLow) }} - {{ formatNumber(index.fiftyTwoWeekHigh) }}</span>
          </div>
          <div class="stat-pill">
            <span class="stat-k font-mono oi-xs">ALL-TIME HIGH</span>
            <span class="stat-v num-tabular oi-sm">{{ formatNumber(index.allTimeHigh) }} ({{ index.athDate }})</span>
          </div>
          <div class="stat-pill">
            <span class="stat-k font-mono oi-xs">ATH DRAWDOWN</span>
            <span class="stat-v num-tabular oi-sm is-neg">{{ index.drawdownFromATH }}%</span>
          </div>
          <div class="stat-pill">
            <span class="stat-k font-mono oi-xs">EST. MARKET CAP</span>
            <span class="stat-v num-tabular oi-sm">{{ index.marketCapUSD }}</span>
          </div>
        </div>
      </section>

      <!-- Interactive Chart Section -->
      <section class="chart-section">
        <InteractiveChart
          :index-id="index.id"
          :currency-symbol="convertedLevel.symbol"
          :time-series-data="index.timeSeries"
        />
      </section>

      <!-- Multi-Timeframe Performance Table -->
      <section class="performance-strip oi-card-box">
        <span class="strip-label font-mono oi-xs">RETURNS</span>
        <div class="strip-items">
          <div
            v-for="(val, tf) in index.performance"
            :key="tf"
            class="perf-item"
          >
            <span class="perf-tf font-mono oi-xs">{{ tf }}</span>
            <span
              class="perf-val num-tabular oi-sm font-mono"
              :class="val >= 0 ? 'is-pos' : 'is-neg'"
            >
              {{ val >= 0 ? '+' : '' }}{{ val.toFixed(1) }}%
            </span>
          </div>
        </div>
      </section>

      <!-- Fundamentals & Valuation Section -->
      <section class="fundamentals-section">
        <ValuationGauge
          :pe="index.valuations.peRatio"
          :forward-pe="index.valuations.forwardPE"
          :pb="index.valuations.pbRatio"
          :dividend-yield="index.valuations.dividendYield"
          :historical="index.valuations.historicalPE"
        />

        <!-- 10-Year Valuation Band Trajectory -->
        <ValuationBandChart
          :mean="index.valuations.historicalPE.mean10Y"
          :sd="index.valuations.historicalPE.sd10Y"
          :status="index.valuations.historicalPE.status"
          :series="index.historicalValuationSeries"
        />
      </section>

      <!-- Concentration Risk Analysis -->
      <section v-if="index.concentration" class="concentration-section">
        <ConcentrationRiskCard :concentration="index.concentration" />
      </section>

      <!-- Two-Column Anatomy: Donut / Sectors & Methodology -->
      <section class="two-col-grid">
        <!-- Interactive Sector Donut -->
        <SectorDonut :sectors="index.sectors" />

        <!-- Profile & Methodology -->
        <div class="profile-card oi-card-box">
          <div class="profile-header">
            <h3 class="oi-h3">Index Methodology & Profile</h3>
            <span class="meta-tag font-mono oi-xs">GOVERNANCE</span>
          </div>

          <p class="oi-body profile-desc">{{ index.description }}</p>

          <div class="spec-grid font-mono oi-xs">
            <div class="spec-row">
              <span class="spec-k">WEIGHTING METHODOLOGY</span>
              <span class="spec-v">{{ index.weightingType }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">CONSTITUENTS COUNT</span>
              <span class="spec-v">{{ index.constituentsCount }} Companies</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">REBALANCING CYCLE</span>
              <span class="spec-v">{{ index.rebalanceSchedule }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">INCEPTION YEAR</span>
              <span class="spec-v">{{ index.inceptionYear }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">BASE DATE & VALUE</span>
              <span class="spec-v">{{ index.baseDate }} (Base: {{ index.baseValue }})</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">CENTRAL BANK POLICY RATE</span>
              <span class="spec-v">{{ index.macro.centralBank }} ({{ index.macro.policyRate }}%)</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">10Y SOVEREIGN BOND YIELD</span>
              <span class="spec-v">{{ index.macro.sovereignYield10Y }}%</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">INFLATION RATE (CPI YOY)</span>
              <span class="spec-v">{{ index.macro.inflationYoY }}%</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Top Holdings Table -->
      <section class="holdings-section">
        <ConstituentsTable
          :constituents="index.constituents"
          :currency-symbol="convertedLevel.symbol"
        />
      </section>

      <!-- Phase 3: Peer Correlation & Diversification -->
      <section class="correlation-section">
        <PeerCorrelationCard :index-id="index.id" />
      </section>

      <!-- Phase 3: Crisis Resilience & Historical Drawdowns -->
      <section class="crisis-section">
        <IndexCrisisResilienceCard :index-id="index.id" />
      </section>
    </div>
  </div>

  <!-- Fallback if index not found -->
  <div v-else class="not-found-page oi-container">
    <div class="oi-card-box empty-box">
      <h2 class="oi-h2">Index Not Found</h2>
      <p class="oi-body">The requested index identifier could not be located in the registry.</p>
      <NuxtLink to="/" class="oi-btn is-white">Return to Overview</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getIndexById } from '~/data/indices'
import { useMarketStatus } from '~/composables/useMarketStatus'
import { useCurrencyConverter } from '~/composables/useCurrencyConverter'
import InteractiveChart from '~/components/InteractiveChart.vue'
import ValuationGauge from '~/components/ValuationGauge.vue'
import ValuationBandChart from '~/components/ValuationBandChart.vue'
import SectorDonut from '~/components/SectorDonut.vue'
import ConcentrationRiskCard from '~/components/ConcentrationRiskCard.vue'
import ConstituentsTable from '~/components/ConstituentsTable.vue'
import PeerCorrelationCard from '~/components/PeerCorrelationCard.vue'
import IndexCrisisResilienceCard from '~/components/IndexCrisisResilienceCard.vue'

const route = useRoute()
const indexId = computed(() => String(route.params.id || ''))

const index = computed(() => getIndexById(indexId.value))

const { getStatusForIndex } = useMarketStatus()
const { convertValue, formatNumber } = useCurrencyConverter()

const marketStatus = computed(() => {
  if (!index.value) return { isOpen: false, isWeekend: false, isPreMarket: false, statusLabel: 'CLOSED' as const, localTimeFormatted: '', countdownFormatted: '' }
  return getStatusForIndex(index.value)
})

const convertedLevel = computed(() => {
  if (!index.value) return { value: 0, formatted: '0', symbol: '', code: '' }
  return convertValue(index.value.currentLevel, index.value.currency)
})

// Set dynamic meta title
if (index.value) {
  useHead({
    title: `${index.value.name} (${index.value.symbol}) — Global Index Study`,
    meta: [
      { name: 'description', content: `Real-time analytics, valuation multiples, sector distribution, and constituent weights for ${index.value.name}.` }
    ]
  })
}
</script>

<style scoped>
.detail-page {
  padding-top: var(--oi-s4);
  padding-bottom: var(--oi-s7);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s5);
}

.breadcrumb-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--oi-s3);
}

.back-link {
  color: var(--oi-ink-2);
  transition: color var(--oi-dur) var(--oi-ease);
}

.back-link:hover {
  color: var(--oi-ink);
}

.region-badge {
  background-color: var(--oi-card);
  border: 1px solid var(--oi-hairline);
  padding: 3px 8px;
  border-radius: var(--oi-r-s);
  color: var(--oi-ink-2);
}

.detail-header {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--oi-s4);
}

.title-cluster {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.flag-large {
  font-size: 2.8rem;
  line-height: 1;
}

.names-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.index-full-name {
  color: var(--oi-ink);
}

.ticker-sub {
  color: var(--oi-ink-3);
  font-size: 13px;
}

.market-status-box {
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 170px;
}

.status-top {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-state {
  color: var(--oi-ink-2);
  font-weight: 500;
}

.status-local-time {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--oi-ink);
}

.quote-row {
  display: flex;
  align-items: baseline;
  gap: var(--oi-s4);
  flex-wrap: wrap;
}

.primary-quote {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.level-value {
  color: var(--oi-ink);
}

.quote-deltas {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.delta-badge {
  font-weight: 500;
}

.delta-badge.is-pos {
  color: var(--oi-green);
}

.delta-badge.is-neg {
  color: var(--oi-loss);
}

.stats-ribbon {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--oi-s2);
}

@media (max-width: 900px) {
  .stats-ribbon {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 580px) {
  .header-top {
    flex-direction: column;
  }
  .stats-ribbon {
    grid-template-columns: 1fr;
  }
}

.stat-pill {
  background-color: var(--oi-card);
  border: 1px solid var(--oi-hairline);
  padding: 8px 12px;
  border-radius: var(--oi-r-s);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-k {
  color: var(--oi-ink-3);
}

.stat-v {
  color: var(--oi-ink);
  font-weight: 500;
}

.stat-v.is-neg {
  color: var(--oi-loss);
}

.performance-strip {
  padding: var(--oi-s3);
  display: flex;
  align-items: center;
  gap: var(--oi-s4);
  overflow-x: auto;
}

.strip-label {
  color: var(--oi-ink-3);
  border-right: 1px solid var(--oi-hairline);
  padding-right: var(--oi-s3);
}

.strip-items {
  display: flex;
  align-items: center;
  gap: var(--oi-s5);
}

.perf-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.perf-tf {
  color: var(--oi-ink-3);
}

.perf-val.is-pos {
  color: var(--oi-green);
}

.perf-val.is-neg {
  color: var(--oi-loss);
}

.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--oi-s4);
}

@media (max-width: 860px) {
  .two-col-grid {
    grid-template-columns: 1fr;
  }
}

.profile-card {
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-desc {
  margin: 0;
  color: var(--oi-ink-2);
}

.spec-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid var(--oi-hairline);
  padding-top: var(--oi-s3);
}

.spec-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid var(--oi-hairline);
}

.spec-row:last-child {
  border-bottom: none;
}

.spec-k {
  color: var(--oi-ink-3);
}

.spec-v {
  color: var(--oi-ink);
  font-weight: 500;
}

.empty-box {
  padding: var(--oi-s6);
  text-align: center;
  margin-top: var(--oi-s6);
}
</style>
