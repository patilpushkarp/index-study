<template>
  <div class="constituents-wrapper oi-card-box">
    <div class="table-header">
      <div class="header-left">
        <h3 class="oi-h3">Top Holdings</h3>
        <span class="meta-tag font-mono oi-xs">WEIGHT CONCENTRATION</span>
      </div>
      <div class="top-weight-sum font-mono oi-xs oi-muted">
        Top {{ constituents.length }} Weight: {{ totalWeight.toFixed(1) }}%
      </div>
    </div>

    <div class="table-responsive">
      <table class="constituents-table">
        <thead>
          <tr class="table-head-row font-mono oi-xs">
            <th class="th-ticker">TICKER</th>
            <th class="th-name">COMPANY</th>
            <th class="th-sector">SECTOR</th>
            <th class="th-weight">WEIGHT</th>
            <th class="th-price">PRICE</th>
            <th class="th-change">24H</th>
            <th class="th-contrib">CONTRIB. PTS</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="holding in constituents"
            :key="holding.ticker"
            class="table-data-row"
          >
            <td class="td-ticker font-mono oi-sm">{{ holding.ticker }}</td>
            <td class="td-name oi-sm">{{ holding.name }}</td>
            <td class="td-sector oi-xs oi-muted">{{ holding.sector }}</td>
            <td class="td-weight num-tabular font-mono oi-sm">
              <div class="weight-cell">
                <div class="weight-track">
                  <div class="weight-fill" :style="{ width: `${Math.min(holding.weight * 7, 100)}%` }"></div>
                </div>
                <span>{{ holding.weight.toFixed(1) }}%</span>
              </div>
            </td>
            <td class="td-price num-tabular font-mono oi-sm">{{ currencySymbol }}{{ holding.price.toFixed(2) }}</td>
            <td
              class="td-change num-tabular font-mono oi-sm"
              :class="holding.changePercent >= 0 ? 'is-pos' : 'is-neg'"
            >
              {{ holding.changePercent >= 0 ? '+' : '' }}{{ holding.changePercent.toFixed(2) }}%
            </td>
            <td
              class="td-contrib num-tabular font-mono oi-sm"
              :class="(holding.contributionPoints || 0) >= 0 ? 'is-pos' : 'is-neg'"
            >
              {{ (holding.contributionPoints || 0) >= 0 ? '+' : '' }}{{ (holding.contributionPoints || 0).toFixed(2) }} pts
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IndexHolding } from '~/data/indices'

const props = defineProps<{
  constituents: IndexHolding[]
  currencySymbol: string
}>()

const totalWeight = computed(() => {
  return props.constituents.reduce((sum, item) => sum + item.weight, 0)
})
</script>

<style scoped>
.constituents-wrapper {
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meta-tag {
  color: var(--oi-ink-3);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.constituents-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.table-head-row {
  color: var(--oi-ink-3);
  border-bottom: 1px solid var(--oi-hairline);
}

.table-head-row th {
  padding: 8px 10px;
  font-weight: 500;
}

.table-data-row {
  border-bottom: 1px solid var(--oi-hairline);
  transition: background-color var(--oi-dur) var(--oi-ease);
}

.table-data-row:last-child {
  border-bottom: none;
}

.table-data-row:hover {
  background-color: var(--oi-hairline);
}

.table-data-row td {
  padding: 10px;
}

.td-ticker {
  font-weight: 600;
  color: var(--oi-ink);
}

.td-name {
  color: var(--oi-ink);
}

.weight-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weight-track {
  width: 50px;
  height: 4px;
  background-color: var(--oi-hairline);
  border-radius: 2px;
  overflow: hidden;
}

.weight-fill {
  height: 100%;
  background-color: var(--oi-ink-2);
}

.td-change.is-pos {
  color: var(--oi-green);
}

.td-change.is-neg {
  color: var(--oi-loss);
}

@media (max-width: 640px) {
  .th-sector, .td-sector {
    display: none;
  }
}
</style>
