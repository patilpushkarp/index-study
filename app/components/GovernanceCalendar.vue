<template>
  <div class="governance-calendar-wrapper oi-card-box">
    <!-- Header -->
    <div class="calendar-header">
      <div class="header-titles">
        <span class="meta-tag font-mono oi-xs">// INDEX METHODOLOGY & RECONSTITUTION SCHEDULE</span>
        <h3 class="oi-h3">Global Index Governance & Rebalancing Calendar</h3>
        <p class="oi-sm oi-muted">
          Review frequency, buffer thresholds, constituent capping rules, and upcoming reconstitution schedules for the major benchmark providers.
        </p>
      </div>

      <!-- Frequency Filter -->
      <div class="freq-controls">
        <button
          v-for="f in freqFilters"
          :key="f.id"
          class="oi-pill"
          :class="{ 'is-active': selectedFreq === f.id }"
          @click="selectedFreq = f.id"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Governance Grid -->
    <div class="governance-grid">
      <div
        v-for="item in filteredList"
        :key="item.indexId"
        class="gov-card oi-card-box"
      >
        <div class="gov-top">
          <div class="gov-title-group">
            <span class="gov-flag">{{ item.flag }}</span>
            <NuxtLink :to="`/indices/${item.indexId}`" class="gov-name font-mono oi-sm">
              {{ item.indexName }}
            </NuxtLink>
          </div>
          <span class="freq-badge font-mono oi-xs">
            {{ item.rebalanceSchedule.frequency }}
          </span>
        </div>

        <div class="gov-dates-row font-mono oi-xs">
          <div class="date-item">
            <span class="oi-muted">REVIEW MONTHS:</span>
            <span class="date-val">{{ item.rebalanceSchedule.reviewMonths.join(', ') }}</span>
          </div>
          <div class="date-item">
            <span class="oi-muted">NEXT RECONSTITUTION:</span>
            <span class="date-val next-active">{{ item.rebalanceSchedule.nextReconstitution }}</span>
          </div>
        </div>

        <div class="gov-rules font-mono oi-xs">
          <div class="rule-box">
            <span class="rule-label oi-muted">CAPPING RULE:</span>
            <span class="rule-text">{{ item.rebalanceSchedule.cappingRule }}</span>
          </div>
          <div class="rule-box">
            <span class="rule-label oi-muted">TURNOVER BUFFER:</span>
            <span class="rule-text">{{ item.rebalanceSchedule.bufferRule }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { indexMacroProfiles } from '~/data/macro'

const selectedFreq = ref<string>('all')

const freqFilters = [
  { id: 'all', label: 'All Schedules' },
  { id: 'quarterly', label: 'Quarterly Reviews' },
  { id: 'semi', label: 'Semi-Annual Reviews' },
  { id: 'annual', label: 'Annual Reviews' }
]

const filteredList = computed(() => {
  if (selectedFreq.value === 'quarterly') {
    return indexMacroProfiles.filter(p => p.rebalanceSchedule.frequency.includes('Quarterly'))
  }
  if (selectedFreq.value === 'semi') {
    return indexMacroProfiles.filter(p => p.rebalanceSchedule.frequency.includes('Semi'))
  }
  if (selectedFreq.value === 'annual') {
    return indexMacroProfiles.filter(p => p.rebalanceSchedule.frequency.includes('Annual'))
  }
  return indexMacroProfiles
})
</script>

<style scoped>
.governance-calendar-wrapper {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.calendar-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s3);
  border-bottom: 1px solid var(--oi-hairline);
  padding-bottom: var(--oi-s3);
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 600px;
}

.freq-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.governance-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--oi-s3);
}

@media (max-width: 1100px) {
  .governance-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 650px) {
  .governance-grid {
    grid-template-columns: 1fr;
  }
}

.gov-card {
  padding: var(--oi-s3);
  background-color: var(--oi-canvas);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gov-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gov-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gov-flag {
  font-size: 1.25rem;
}

.gov-name {
  font-weight: 500;
  color: var(--oi-ink);
  text-decoration: none;
}

.gov-name:hover {
  text-decoration: underline;
}

.freq-badge {
  background-color: var(--oi-card);
  border: 1px solid var(--oi-hairline);
  padding: 2px 8px;
  border-radius: var(--oi-r-s);
  color: var(--oi-ink-2);
}

.gov-dates-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 10px;
  background-color: var(--oi-card);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
}

.date-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.next-active {
  color: var(--oi-green);
  font-weight: 500;
}

.gov-rules {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rule-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rule-label {
  font-size: 10px;
}

.rule-text {
  color: var(--oi-ink-2);
  line-height: 1.35;
}
</style>
