<template>
  <div class="macro-page">
    <div class="oi-container">
      <!-- Page Header -->
      <section class="macro-header">
        <span class="meta-tag font-mono oi-xs">// 05. MACROECONOMIC DRIVERS & SOVEREIGN YIELDS</span>
        <h1 class="oi-display">
          Central Bank Rates, <span class="oi-serif">yields & currency impact.</span>
        </h1>
        <p class="oi-body">
          Macroeconomic foundations driving global equity valuations: central bank policy cycles, real 10-year sovereign yields, Equity Risk Premium (ERP), and foreign exchange return drag.
        </p>

        <!-- Sub-Navigation View Switcher -->
        <div class="macro-tabs-bar">
          <button
            v-for="tab in macroTabs"
            :key="tab.id"
            class="oi-pill"
            :class="{ 'is-active': activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </section>

      <!-- View 1: Central Bank Board -->
      <section v-show="activeTab === 'rates'" class="tab-pane">
        <CentralBankBoard />
      </section>

      <!-- View 2: Equity Risk Premium -->
      <section v-show="activeTab === 'erp'" class="tab-pane">
        <EquityRiskPremiumChart />
      </section>

      <!-- View 3: Currency Drag & FX Impact -->
      <section v-show="activeTab === 'fx'" class="tab-pane">
        <CurrencyImpactTable />
      </section>

      <!-- View 4: Governance Calendar -->
      <section v-show="activeTab === 'governance'" class="tab-pane">
        <GovernanceCalendar />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CentralBankBoard from '~/components/CentralBankBoard.vue'
import EquityRiskPremiumChart from '~/components/EquityRiskPremiumChart.vue'
import CurrencyImpactTable from '~/components/CurrencyImpactTable.vue'
import GovernanceCalendar from '~/components/GovernanceCalendar.vue'

const macroTabs = [
  { id: 'rates', label: 'Central Banks & Rates' },
  { id: 'erp', label: 'Equity Risk Premium (ERP)' },
  { id: 'fx', label: 'Currency Impact Engine' },
  { id: 'governance', label: 'Rebalancing Calendar' }
]

const activeTab = ref<string>('rates')

useHead({
  title: 'Macro Board, Central Bank Rates & Currency Impact — INDEX // STUDY',
  meta: [
    { name: 'description', content: 'Global central bank interest rates, 10Y sovereign yields, Equity Risk Premium (ERP), and currency impact analysis across 18 major world markets.' }
  ]
})
</script>

<style scoped>
.macro-page {
  padding-top: var(--oi-s5);
  padding-bottom: var(--oi-s7);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s5);
}

.macro-header {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.macro-tabs-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
