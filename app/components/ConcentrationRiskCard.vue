<template>
  <div class="conc-card oi-card-box">
    <div class="conc-header">
      <div class="title-block">
        <h3 class="oi-h3">Portfolio Concentration Risk</h3>
        <span class="meta-tag font-mono oi-xs">HERFINDAHL-HIRSCHMAN (HHI) ANALYSIS</span>
      </div>

      <span
        class="rating-badge font-mono oi-xs"
        :class="badgeClass"
      >
        {{ concentration.rating }}
      </span>
    </div>

    <!-- Concentration Metrics Grid -->
    <div class="metrics-row">
      <div class="metric-cell">
        <span class="m-k font-mono oi-xs">TOP 5 WEIGHT</span>
        <div class="m-bar-wrap">
          <div class="m-bar-fill" :style="{ width: `${concentration.top5Weight}%` }"></div>
        </div>
        <span class="m-v num-tabular font-mono oi-h3">{{ concentration.top5Weight.toFixed(1) }}%</span>
      </div>

      <div class="metric-cell">
        <span class="m-k font-mono oi-xs">TOP 10 WEIGHT</span>
        <div class="m-bar-wrap">
          <div class="m-bar-fill" :style="{ width: `${concentration.top10Weight}%` }"></div>
        </div>
        <span class="m-v num-tabular font-mono oi-h3">{{ concentration.top10Weight.toFixed(1) }}%</span>
      </div>

      <div class="metric-cell">
        <span class="m-k font-mono oi-xs">HHI CONCENTRATION SCORE</span>
        <div class="m-bar-wrap">
          <div class="m-bar-fill" :style="{ width: `${Math.min(concentration.hhiScore / 15, 100)}%` }"></div>
        </div>
        <span class="m-v num-tabular font-mono oi-h3">{{ concentration.hhiScore }} pts</span>
      </div>
    </div>

    <!-- Narrative Explanation -->
    <div class="narrative-box oi-sm oi-muted">
      <span v-if="concentration.hhiScore > 1000">
        ⚠️ <strong>Elevated Concentration:</strong> The top holdings represent an outsized share of total index capitalization. Single-stock movements in mega-caps disproportionately dictate index volatility.
      </span>
      <span v-else-if="concentration.hhiScore > 600">
        ⚖️ <strong>Moderate Concentration:</strong> Balanced distribution with moderate leadership by top sector constituents.
      </span>
      <span v-else>
        🛡️ <strong>Broadly Diversified:</strong> Capitalization is widely distributed across hundreds of constituents, reducing idiosyncratic single-stock vulnerability.
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  concentration: {
    top5Weight: number
    top10Weight: number
    hhiScore: number
    rating: 'Diversified' | 'Moderate Concentration' | 'High Concentration'
  }
}>()

const badgeClass = computed(() => {
  if (props.concentration.rating === 'High Concentration') return 'is-high'
  if (props.concentration.rating === 'Moderate Concentration') return 'is-mod'
  return 'is-low'
})
</script>

<style scoped>
.conc-card {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.conc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rating-badge {
  padding: 3px 8px;
  border-radius: var(--oi-r-s);
  font-weight: 600;
  text-transform: uppercase;
}

.rating-badge.is-high {
  background-color: rgba(255, 95, 83, 0.15);
  color: var(--oi-loss);
}

.rating-badge.is-mod {
  background-color: rgba(255, 176, 32, 0.15);
  color: var(--oi-warning);
}

.rating-badge.is-low {
  background-color: rgba(0, 226, 0, 0.12);
  color: var(--oi-green);
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--oi-s3);
}

@media (max-width: 680px) {
  .metrics-row {
    grid-template-columns: 1fr;
  }
}

.metric-cell {
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  padding: var(--oi-s3);
  border-radius: var(--oi-r-s);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.m-k {
  color: var(--oi-ink-3);
}

.m-bar-wrap {
  width: 100%;
  height: 4px;
  background-color: var(--oi-hairline);
  border-radius: 2px;
  overflow: hidden;
}

.m-bar-fill {
  height: 100%;
  background-color: var(--oi-ink-2);
  border-radius: 2px;
}

.m-v {
  color: var(--oi-ink);
  margin-top: 2px;
}

.narrative-box {
  background-color: var(--oi-hairline-light);
  border: 1px solid var(--oi-hairline);
  padding: 10px 14px;
  border-radius: var(--oi-r-s);
  line-height: 1.5;
}
</style>
