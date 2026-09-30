<template>
  <div class="crisis-resilience-card oi-card-box">
    <div class="card-header">
      <div class="title-group">
        <span class="meta-tag font-mono oi-xs">// HISTORICAL CRISIS STRESS RECORD</span>
        <h3 class="oi-h3">Crisis Drawdowns & Resilience History</h3>
      </div>
      <NuxtLink to="/crisis" class="oi-btn oi-xs">
        Stress Lab ↗
      </NuxtLink>
    </div>

    <!-- 4 Crisis Cards Grid -->
    <div class="crisis-grid">
      <div
        v-for="crisis in crisisEpisodes"
        :key="crisis.id"
        class="crisis-subcard"
      >
        <div class="subcard-top">
          <div class="subcard-title-group">
            <span class="subcard-name font-mono oi-sm">{{ crisis.shortLabel }}</span>
            <span class="subcard-period font-mono oi-xs oi-muted">{{ crisis.period }}</span>
          </div>
          <div class="subcard-grade" :class="`grade-${getCrisisMetric(crisis.id).resilienceRating}`">
            {{ getCrisisMetric(crisis.id).resilienceRating }}
          </div>
        </div>

        <!-- Drawdown Metric Display -->
        <div class="drawdown-display">
          <span class="drawdown-value num-tabular font-mono is-neg">
            {{ getCrisisMetric(crisis.id).drawdownPercent }}%
          </span>
          <span class="drawdown-label font-mono oi-xs oi-muted">PEAK-TO-TROUGH</span>
        </div>

        <!-- Recovery Stats -->
        <div class="subcard-stats font-mono oi-xs">
          <div class="stat-line">
            <span class="oi-muted">Days to Trough:</span>
            <span class="num-tabular">{{ getCrisisMetric(crisis.id).daysToTrough }}d</span>
          </div>
          <div class="stat-line">
            <span class="oi-muted">Recovery Time:</span>
            <span v-if="typeof getCrisisMetric(crisis.id).recoveredInMonths === 'number'" class="num-tabular is-pos">
              {{ getCrisisMetric(crisis.id).recoveredInMonths }} months
            </span>
            <span v-else class="num-tabular oi-muted">
              {{ getCrisisMetric(crisis.id).daysToRecovery }}
            </span>
          </div>
        </div>

        <!-- Specific Observation Note -->
        <p class="subcard-observation oi-xs oi-muted">
          {{ getCrisisMetric(crisis.id).observation }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  historicalCrises,
  indexCrisisData,
  type IndexCrisisMetric
} from '~/data/crisisDrawdowns'

const props = defineProps<{
  indexId: string
}>()

const crisisEpisodes = computed(() => historicalCrises)

function getCrisisMetric(crisisId: string): IndexCrisisMetric {
  const data = indexCrisisData[props.indexId]?.[crisisId]
  if (data) return data

  return {
    crisisId,
    indexId: props.indexId,
    drawdownPercent: -42.0,
    daysToTrough: 400,
    daysToRecovery: 1100,
    recoveredInMonths: 36,
    resilienceRating: 'C',
    observation: 'Estimated proxy metrics based on regional correlation.'
  }
}
</script>

<style scoped>
.crisis-resilience-card {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s3);
  border-bottom: 1px solid var(--oi-hairline);
  padding-bottom: var(--oi-s3);
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.crisis-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--oi-s3);
}

@media (max-width: 1024px) {
  .crisis-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .crisis-grid {
    grid-template-columns: 1fr;
  }
}

.crisis-subcard {
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.subcard-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.subcard-title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.subcard-name {
  font-weight: 500;
  color: var(--oi-ink);
}

.subcard-grade {
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

.drawdown-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.drawdown-value {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1;
}

.subcard-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 0;
  border-top: 1px dashed var(--oi-hairline);
  border-bottom: 1px dashed var(--oi-hairline);
}

.stat-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.subcard-observation {
  line-height: 1.45;
}
</style>
