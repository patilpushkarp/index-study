<template>
  <div class="crisis-lab-wrapper">
    <!-- Crisis Selector Tabs -->
    <div class="crisis-tabs-bar oi-card-box">
      <div class="tabs-header">
        <span class="meta-tag font-mono oi-xs">// SELECT HISTORICAL STRESS PERIOD</span>
        <span class="oi-xs oi-muted">Analyze peak-to-trough drawdowns & recovery timelines</span>
      </div>

      <div class="crisis-pills">
        <button
          v-for="c in historicalCrises"
          :key="c.id"
          class="oi-pill crisis-pill"
          :class="{ 'is-active': selectedCrisisId === c.id }"
          @click="selectedCrisisId = c.id"
        >
          <span class="pill-title">{{ c.shortLabel }}</span>
          <span class="pill-dates font-mono oi-xs">({{ c.period }})</span>
        </button>
      </div>
    </div>

    <!-- Active Crisis Narrative Card -->
    <div v-if="activeCrisis" class="crisis-overview-card oi-card-box">
      <div class="overview-header">
        <div class="overview-title-group">
          <span class="meta-tag font-mono oi-xs">// EPISODE DOSSIER</span>
          <h2 class="oi-h2">{{ activeCrisis.name }}</h2>
          <span class="overview-period font-mono oi-xs">
            PEAK: {{ activeCrisis.peakDate }} ⟶ TROUGH: {{ activeCrisis.troughDate }}
          </span>
        </div>

        <div class="global-drawdown-stat">
          <span class="stat-label font-mono oi-xs">GLOBAL AVG DRAWDOWN</span>
          <span class="stat-number num-tabular font-mono is-neg">
            {{ activeCrisis.globalAverageDrawdown }}%
          </span>
        </div>
      </div>

      <!-- Narrative Grid -->
      <div class="narrative-grid">
        <div class="narrative-col">
          <span class="col-title font-mono oi-xs">MACROECONOMIC CATALYST</span>
          <p class="oi-sm">{{ activeCrisis.catalyst }}</p>
        </div>
        <div class="narrative-col">
          <span class="col-title font-mono oi-xs">TRANSMISSION MECHANISM</span>
          <p class="oi-sm">{{ activeCrisis.transmissionMechanism }}</p>
        </div>
        <div class="narrative-col">
          <span class="col-title font-mono oi-xs">CENTRAL BANK POLICY RESPONSE</span>
          <p class="oi-sm">{{ activeCrisis.centralBankResponse }}</p>
        </div>
        <div class="narrative-col">
          <span class="col-title font-mono oi-xs">INSTITUTIONAL LESSON</span>
          <p class="oi-sm oi-muted">{{ activeCrisis.keyTakeaway }}</p>
        </div>
      </div>

      <!-- Leader & Laggard Banner -->
      <div class="leader-laggard-row font-mono oi-xs">
        <div class="leader-chip">
          <span class="chip-badge is-lead">TOP RESILIENCE</span>
          <span class="chip-name">{{ activeCrisis.benchmarkLeader.name }}</span>
          <span class="num-tabular is-neg">{{ activeCrisis.benchmarkLeader.drawdown }}%</span>
          <span class="chip-desc oi-muted">— {{ activeCrisis.benchmarkLeader.reason }}</span>
        </div>
        <div class="laggard-chip">
          <span class="chip-badge is-lag">MAX DRAWDOWN</span>
          <span class="chip-name">{{ activeCrisis.benchmarkLaggard.name }}</span>
          <span class="num-tabular is-neg">{{ activeCrisis.benchmarkLaggard.drawdown }}%</span>
          <span class="chip-desc oi-muted">— {{ activeCrisis.benchmarkLaggard.reason }}</span>
        </div>
      </div>
    </div>

    <!-- Comparative Drawdown Bars & Rankings -->
    <div class="drawdown-comparison-section oi-card-box">
      <div class="section-header">
        <div class="title-group">
          <span class="meta-tag font-mono oi-xs">// CROSS-MARKET STRESS RESILIENCE RANKING</span>
          <h3 class="oi-h3">Drawdown Depth & Recovery Trajectory</h3>
        </div>

        <div class="sort-controls">
          <span class="control-label font-mono oi-xs">SORT BY:</span>
          <div class="pill-group">
            <button
              class="oi-pill"
              :class="{ 'is-active': sortMode === 'drawdown' }"
              @click="sortMode = 'drawdown'"
            >
              Drawdown (Least to Most)
            </button>
            <button
              class="oi-pill"
              :class="{ 'is-active': sortMode === 'speed' }"
              @click="sortMode = 'speed'"
            >
              Days to Trough
            </button>
            <button
              class="oi-pill"
              :class="{ 'is-active': sortMode === 'recovery' }"
              @click="sortMode = 'recovery'"
            >
              Recovery Months
            </button>
          </div>
        </div>
      </div>

      <!-- Visual Drawdown Depth Bars -->
      <div class="bars-container">
        <div
          v-for="item in sortedIndexCrisisList"
          :key="item.index.id"
          class="drawdown-row"
        >
          <!-- Left: Flag & Symbol -->
          <div class="row-meta">
            <span class="row-flag">{{ item.index.flag }}</span>
            <NuxtLink :to="`/indices/${item.index.id}`" class="row-name">
              {{ item.index.shortName }}
            </NuxtLink>
            <span class="row-region font-mono oi-xs oi-muted">{{ item.index.region }}</span>
          </div>

          <!-- Middle: Graphical Bar -->
          <div class="row-bar-track">
            <div
              class="row-bar-fill"
              :style="{ width: `${Math.min(100, Math.abs(item.metric.drawdownPercent) * 1.15)}%` }"
              :class="getBarSeverityClass(item.metric.drawdownPercent)"
            >
              <span class="bar-value num-tabular font-mono">
                {{ item.metric.drawdownPercent }}%
              </span>
            </div>
          </div>

          <!-- Right: Key Timing Metrics -->
          <div class="row-stats font-mono oi-xs">
            <div class="timing-badge" title="Days from peak to bottom trough">
              <span class="badge-label oi-muted">Trough:</span>
              <span class="num-tabular">{{ item.metric.daysToTrough }}d</span>
            </div>

            <div class="timing-badge" title="Time taken to recover back to previous all-time high">
              <span class="badge-label oi-muted">Recovery:</span>
              <span v-if="typeof item.metric.recoveredInMonths === 'number'" class="num-tabular is-pos">
                {{ item.metric.recoveredInMonths }}m
              </span>
              <span v-else class="num-tabular oi-muted">
                {{ item.metric.daysToRecovery }}
              </span>
            </div>

            <div class="grade-badge" :class="`grade-${item.metric.resilienceRating}`">
              {{ item.metric.resilienceRating }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Stress Test Simulator -->
    <div class="stress-simulator-section oi-card-box">
      <div class="sim-header">
        <div class="title-group">
          <span class="meta-tag font-mono oi-xs">// MACRO SHOCK SIMULATION LAB</span>
          <h3 class="oi-h3">Hypothetical Scenario Stress Tester</h3>
          <p class="oi-sm oi-muted">
            Simulate forward-looking macroeconomic shocks and gauge asymmetric impact on global equity benchmarks.
          </p>
        </div>

        <div class="sim-scenarios-pills">
          <button
            v-for="s in stressScenarios"
            :key="s.id"
            class="oi-pill"
            :class="{ 'is-active': selectedScenarioId === s.id }"
            @click="selectedScenarioId = s.id"
          >
            {{ s.name }}
          </button>
        </div>
      </div>

      <div v-if="activeScenario" class="scenario-details-grid">
        <div class="scenario-meta-card">
          <span class="card-title font-mono oi-xs">SCENARIO SUMMARY</span>
          <p class="oi-sm">{{ activeScenario.description }}</p>

          <span class="card-title font-mono oi-xs" style="margin-top: 12px;">MACRO TRIGGERS</span>
          <ul class="triggers-list font-mono oi-xs">
            <li v-for="t in activeScenario.macroTriggers" :key="t">
              ▸ {{ t }}
            </li>
          </ul>

          <div class="sim-global-impact">
            <span class="font-mono oi-xs oi-muted">EST. GLOBAL IMPACT:</span>
            <span class="num-tabular font-mono is-neg" style="font-size: 1.1rem; font-weight: 600;">
              {{ activeScenario.expectedGlobalImpact }}%
            </span>
          </div>
        </div>

        <div class="scenario-impacts-list">
          <span class="card-title font-mono oi-xs">PROJECTED BENCHMARK SENSITIVITY</span>
          <div class="impacts-table">
            <div
              v-for="(impact, idxId) in activeScenario.indexImpacts"
              :key="idxId"
              class="impact-row"
            >
              <div class="impact-index-name font-mono oi-sm">
                {{ getIndexName(idxId) }}
              </div>
              <div class="impact-delta num-tabular font-mono" :class="impact.expectedChange >= 0 ? 'is-pos' : 'is-neg'">
                {{ impact.expectedChange >= 0 ? '+' : '' }}{{ impact.expectedChange }}%
              </div>
              <div class="impact-rationale oi-xs oi-muted">
                {{ impact.rationale }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { globalIndices } from '~/data/indices'
import {
  historicalCrises,
  indexCrisisData,
  stressScenarios,
  type CrisisEpisode,
  type IndexCrisisMetric
} from '~/data/crisisDrawdowns'

const selectedCrisisId = ref<string>('gfc-2008')
const sortMode = ref<'drawdown' | 'speed' | 'recovery'>('drawdown')
const selectedScenarioId = ref<string>('tech-shock')

const activeCrisis = computed<CrisisEpisode | undefined>(() => {
  return historicalCrises.find(c => c.id === selectedCrisisId.value)
})

const activeScenario = computed(() => {
  return stressScenarios.find(s => s.id === selectedScenarioId.value)
})

interface IndexCrisisRow {
  index: typeof globalIndices[number]
  metric: IndexCrisisMetric
}

const sortedIndexCrisisList = computed<IndexCrisisRow[]>(() => {
  const crisisId = selectedCrisisId.value

  const list: IndexCrisisRow[] = globalIndices
    .map(idx => {
      const metric = indexCrisisData[idx.id]?.[crisisId] || {
        crisisId,
        indexId: idx.id,
        drawdownPercent: -45.0,
        daysToTrough: 450,
        daysToRecovery: 1200,
        recoveredInMonths: 40,
        resilienceRating: 'C',
        observation: 'Historical proxy metrics.'
      }
      return { index: idx, metric }
    })

  return list.sort((a, b) => {
    if (sortMode.value === 'drawdown') {
      // Least negative (best) to most negative (worst)
      return b.metric.drawdownPercent - a.metric.drawdownPercent
    }
    if (sortMode.value === 'speed') {
      return a.metric.daysToTrough - b.metric.daysToTrough
    }
    if (sortMode.value === 'recovery') {
      const recA = typeof a.metric.recoveredInMonths === 'number' ? a.metric.recoveredInMonths : 999
      const recB = typeof b.metric.recoveredInMonths === 'number' ? b.metric.recoveredInMonths : 999
      return recA - recB
    }
    return 0
  })
})

function getBarSeverityClass(drawdown: number): string {
  if (drawdown <= -60) return 'is-severe'
  if (drawdown <= -40) return 'is-deep'
  if (drawdown <= -25) return 'is-moderate'
  return 'is-mild'
}

function getIndexName(id: string): string {
  const found = globalIndices.find(idx => idx.id === id)
  return found ? `${found.flag} ${found.shortName}` : id
}
</script>

<style scoped>
.crisis-lab-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s5);
}

.crisis-tabs-bar {
  padding: var(--oi-s3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s3);
}

.tabs-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.crisis-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.crisis-pill {
  height: 28px;
  gap: 6px;
}

.pill-dates {
  color: var(--oi-ink-3);
}

/* Overview Card */
.crisis-overview-card {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.overview-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s3);
  border-bottom: 1px solid var(--oi-hairline);
  padding-bottom: var(--oi-s3);
}

.overview-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.overview-period {
  color: var(--oi-ink-2);
}

.global-drawdown-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.stat-label {
  color: var(--oi-ink-3);
}

.stat-number {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1;
}

.narrative-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--oi-s3);
}

@media (max-width: 900px) {
  .narrative-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 580px) {
  .narrative-grid {
    grid-template-columns: 1fr;
  }
}

.narrative-col {
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.col-title {
  color: var(--oi-ink-3);
}

.leader-laggard-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--oi-s3);
  flex-wrap: wrap;
  border-top: 1px solid var(--oi-hairline);
  padding-top: var(--oi-s3);
}

.leader-chip,
.laggard-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.chip-badge {
  padding: 2px 6px;
  border-radius: var(--oi-r-s);
  font-weight: 600;
  font-size: 10px;
}

.chip-badge.is-lead {
  background-color: rgba(0, 226, 0, 0.15);
  color: var(--oi-green);
  border: 1px solid var(--oi-green);
}

.chip-badge.is-lag {
  background-color: rgba(255, 95, 83, 0.15);
  color: var(--oi-loss);
  border: 1px solid var(--oi-loss);
}

.chip-name {
  color: var(--oi-ink);
  font-weight: 500;
}

/* Comparison Section */
.drawdown-comparison-section {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s3);
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bars-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.drawdown-row {
  display: flex;
  align-items: center;
  gap: var(--oi-s3);
  padding: 8px 12px;
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
  transition: background-color var(--oi-dur) var(--oi-ease), border-color var(--oi-dur) var(--oi-ease);
}

.drawdown-row:hover {
  background-color: var(--oi-card-hover);
  border-color: var(--oi-ink-3);
}

.row-meta {
  width: 170px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-name {
  font-weight: 500;
  color: var(--oi-ink);
  text-decoration: none;
  font-size: 13.5px;
}

.row-name:hover {
  text-decoration: underline;
}

.row-bar-track {
  flex: 1;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.row-bar-fill {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  border-radius: 3px;
  transition: width 0.3s ease-out;
}

.row-bar-fill.is-severe {
  background-color: rgba(255, 95, 83, 0.85);
  box-shadow: 0 0 10px rgba(255, 95, 83, 0.4);
}

.row-bar-fill.is-deep {
  background-color: rgba(255, 95, 83, 0.6);
}

.row-bar-fill.is-moderate {
  background-color: rgba(255, 176, 32, 0.6);
}

.row-bar-fill.is-mild {
  background-color: rgba(0, 226, 0, 0.6);
}

.bar-value {
  color: #ffffff;
  font-size: 11.5px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.row-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  width: 220px;
  justify-content: flex-end;
}

.timing-badge {
  display: flex;
  align-items: center;
  gap: 4px;
}

.grade-badge {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--oi-r-s);
  font-weight: 600;
  font-size: 11px;
}

.grade-A {
  background-color: rgba(0, 226, 0, 0.2);
  color: var(--oi-green);
  border: 1px solid var(--oi-green);
}

.grade-B {
  background-color: rgba(45, 104, 255, 0.2);
  color: #60a5fa;
  border: 1px solid #60a5fa;
}

.grade-C {
  background-color: rgba(255, 176, 32, 0.2);
  color: #fbbf24;
  border: 1px solid #fbbf24;
}

.grade-D {
  background-color: rgba(255, 95, 83, 0.2);
  color: var(--oi-loss);
  border: 1px solid var(--oi-loss);
}

/* Simulator Section */
.stress-simulator-section {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.sim-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s3);
}

.sim-scenarios-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.scenario-details-grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: var(--oi-s4);
}

@media (max-width: 900px) {
  .scenario-details-grid {
    grid-template-columns: 1fr;
  }
}

.scenario-meta-card {
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.triggers-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--oi-ink-2);
}

.sim-global-impact {
  margin-top: auto;
  padding-top: var(--oi-s3);
  border-top: 1px solid var(--oi-hairline);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.scenario-impacts-list {
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.impacts-table {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.impact-row {
  display: grid;
  grid-template-columns: 160px 80px 1fr;
  align-items: center;
  gap: var(--oi-s3);
  padding: 8px 10px;
  background-color: var(--oi-card);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
}

@media (max-width: 600px) {
  .impact-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}

.impact-index-name {
  font-weight: 500;
  color: var(--oi-ink);
}

.impact-delta {
  font-weight: 600;
  font-size: 13px;
}
</style>
