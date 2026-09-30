<template>
  <div class="central-bank-board-wrapper oi-card-box">
    <!-- Header -->
    <div class="board-header">
      <div class="header-titles">
        <span class="meta-tag font-mono oi-xs">// MONETARY POLICY & SOVEREIGN YIELD ENGINE</span>
        <h3 class="oi-h3">Global Central Bank Policy Board</h3>
        <p class="oi-sm oi-muted">
          Benchmark policy interest rates, real yields, inflation differentials, and central bank stances across the world.
        </p>
      </div>

      <!-- Filter Pills -->
      <div class="stance-filters">
        <button
          v-for="filter in stanceFilters"
          :key="filter.id"
          class="oi-pill"
          :class="{ 'is-active': selectedStanceFilter === filter.id }"
          @click="selectedStanceFilter = filter.id"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Central Bank Cards Grid -->
    <div class="banks-grid">
      <div
        v-for="bank in filteredBanks"
        :key="bank.id"
        class="bank-card oi-card-box"
        :class="{ 'is-active-card': selectedBankId === bank.id }"
        @click="selectedBankId = bank.id"
      >
        <div class="bank-top">
          <div class="bank-id-group">
            <span class="bank-flag">{{ bank.flag }}</span>
            <div class="bank-titles">
              <span class="bank-country font-mono oi-xs oi-muted">{{ bank.country }}</span>
              <h4 class="bank-name font-mono oi-sm">{{ bank.name }}</h4>
            </div>
          </div>

          <span class="stance-badge font-mono oi-xs" :class="getStanceBadgeClass(bank.monetaryStance)">
            {{ bank.monetaryStance }}
          </span>
        </div>

        <!-- Primary Rates Display -->
        <div class="rate-numbers-row">
          <div class="rate-stat">
            <span class="stat-label font-mono oi-xs">POLICY RATE</span>
            <span class="stat-val num-tabular font-mono">{{ bank.policyRate.toFixed(2) }}%</span>
            <span class="stat-sub font-mono oi-xs oi-muted">{{ bank.lastChange }}</span>
          </div>

          <div class="rate-stat">
            <span class="stat-label font-mono oi-xs">10Y SOVEREIGN</span>
            <span class="stat-val num-tabular font-mono">{{ bank.tenYearYield.toFixed(2) }}%</span>
            <span class="stat-sub font-mono oi-xs oi-muted">Benchmark Gov</span>
          </div>

          <div class="rate-stat">
            <span class="stat-label font-mono oi-xs">REAL 10Y YIELD</span>
            <span
              class="stat-val num-tabular font-mono"
              :class="bank.realYield >= 0 ? 'is-pos' : 'is-neg'"
            >
              {{ bank.realYield >= 0 ? '+' : '' }}{{ bank.realYield.toFixed(2) }}%
            </span>
            <span class="stat-sub font-mono oi-xs oi-muted">CPI: {{ bank.currentInflation }}%</span>
          </div>
        </div>

        <p class="bank-desc oi-xs oi-muted">
          {{ bank.description }}
        </p>

        <!-- Footer Meeting Timing -->
        <div class="bank-footer font-mono oi-xs">
          <span class="oi-muted">Next Meeting:</span>
          <span class="next-date">{{ bank.nextMeetingDate }}</span>
          <span class="oi-muted" style="margin-left: auto;">Target: {{ bank.inflationTarget }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { centralBanks, type CentralBankInfo } from '~/data/macro'

const selectedStanceFilter = ref<string>('all')
const selectedBankId = ref<string>('fed')

const stanceFilters = [
  { id: 'all', label: 'All Central Banks' },
  { id: 'easing', label: 'Easing Cycles' },
  { id: 'hold', label: 'Restrictive Hold' },
  { id: 'tightening', label: 'Hawkish / Tightening' }
]

const filteredBanks = computed(() => {
  if (selectedStanceFilter.value === 'easing') {
    return centralBanks.filter(b => b.monetaryStance.includes('Easing'))
  }
  if (selectedStanceFilter.value === 'hold') {
    return centralBanks.filter(b => b.monetaryStance === 'Restrictive Hold')
  }
  if (selectedStanceFilter.value === 'tightening') {
    return centralBanks.filter(b => b.monetaryStance.includes('Hawkish') || b.monetaryStance.includes('Tightening'))
  }
  return centralBanks
})

function getStanceBadgeClass(stance: CentralBankInfo['monetaryStance']) {
  if (stance.includes('Aggressive Easing')) return 'badge-dovish-jumbo'
  if (stance.includes('Gradual Easing')) return 'badge-dovish'
  if (stance === 'Restrictive Hold') return 'badge-neutral'
  return 'badge-hawkish'
}
</script>

<style scoped>
.central-bank-board-wrapper {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.board-header {
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

.stance-filters {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.banks-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--oi-s3);
}

@media (max-width: 1100px) {
  .banks-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 650px) {
  .banks-grid {
    grid-template-columns: 1fr;
  }
}

.bank-card {
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: var(--oi-canvas);
  cursor: pointer;
  transition: transform 0.15s ease, border-color var(--oi-dur) var(--oi-ease), background-color var(--oi-dur) var(--oi-ease);
}

.bank-card:hover {
  background-color: var(--oi-card-hover);
  border-color: var(--oi-ink-3);
}

.bank-card.is-active-card {
  border-color: var(--oi-ink-2);
}

.bank-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.bank-id-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bank-flag {
  font-size: 1.4rem;
}

.bank-titles {
  display: flex;
  flex-direction: column;
}

.bank-name {
  color: var(--oi-ink);
  font-weight: 500;
}

.stance-badge {
  padding: 3px 8px;
  border-radius: var(--oi-r-s);
  font-size: 10.5px;
  white-space: nowrap;
}

.badge-dovish-jumbo {
  background-color: rgba(0, 226, 0, 0.2);
  color: var(--oi-green);
  border: 1px solid var(--oi-green);
}

.badge-dovish {
  background-color: rgba(0, 226, 0, 0.12);
  color: #86efac;
  border: 1px solid rgba(0, 226, 0, 0.4);
}

.badge-neutral {
  background-color: rgba(255, 176, 32, 0.15);
  color: #fde047;
  border: 1px solid rgba(255, 176, 32, 0.4);
}

.badge-hawkish {
  background-color: rgba(255, 95, 83, 0.15);
  color: var(--oi-loss);
  border: 1px solid var(--oi-loss);
}

.rate-numbers-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 10px;
  background-color: var(--oi-card);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
}

.rate-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  color: var(--oi-ink-3);
  font-size: 9.5px;
}

.stat-val {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--oi-ink);
}

.stat-sub {
  font-size: 10px;
}

.bank-desc {
  line-height: 1.45;
  min-height: 40px;
}

.bank-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  border-top: 1px dashed var(--oi-hairline);
  padding-top: 8px;
}

.next-date {
  color: var(--oi-ink);
}

.is-pos {
  color: var(--oi-green);
}

.is-neg {
  color: var(--oi-loss);
}
</style>
