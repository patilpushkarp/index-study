<template>
  <div class="sector-container oi-card-box">
    <div class="sector-header">
      <h3 class="oi-h3">Sector Allocation</h3>
      <span class="meta-tag font-mono oi-xs">{{ sectors.length }} SECTORS</span>
    </div>

    <!-- Multi-segment Horizontal Progress Bar -->
    <div class="stacked-bar">
      <div
        v-for="sec in sectors"
        :key="sec.name"
        class="stacked-segment"
        :style="{
          width: `${sec.percentage}%`,
          backgroundColor: sec.color
        }"
        :title="`${sec.name}: ${sec.percentage}%`"
      ></div>
    </div>

    <!-- Sector List Table -->
    <div class="sector-list">
      <div
        v-for="sec in sectors"
        :key="sec.name"
        class="sector-row"
      >
        <div class="sector-info">
          <span
            class="sector-color-dot"
            :style="{ backgroundColor: sec.color }"
          ></span>
          <span class="sector-name oi-sm">{{ sec.name }}</span>
        </div>

        <div class="sector-weight num-tabular font-mono oi-sm">
          <span>{{ sec.percentage.toFixed(1) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SectorWeight } from '~/data/indices'

defineProps<{
  sectors: SectorWeight[]
}>()
</script>

<style scoped>
.sector-container {
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.sector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stacked-bar {
  width: 100%;
  height: 8px;
  background-color: var(--oi-hairline);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
}

.stacked-segment {
  height: 100%;
  transition: opacity var(--oi-dur) var(--oi-ease);
}

.stacked-segment:hover {
  opacity: 0.8;
}

.sector-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sector-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid var(--oi-hairline);
}

.sector-row:last-child {
  border-bottom: none;
}

.sector-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sector-color-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

.sector-name {
  color: var(--oi-ink);
}

.sector-weight {
  color: var(--oi-ink-2);
}
</style>
