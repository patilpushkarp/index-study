<template>
  <div class="currency-impact-wrapper oi-card-box">
    <!-- Header -->
    <div class="table-header">
      <div class="header-titles">
        <span class="meta-tag font-mono oi-xs">// FOREIGN EXCHANGE TRANSMISSION ENGINE</span>
        <h3 class="oi-h3">Currency Drag & FX Impact Engine</h3>
        <p class="oi-sm oi-muted">
          Evaluating the gap between nominal domestic index returns and realized returns for international investors after currency fluctuations.
        </p>
      </div>

      <!-- Base Investor Currency Switcher -->
      <div class="base-currency-controls">
        <span class="control-label font-mono oi-xs">INVESTOR BASE CURRENCY:</span>
        <div class="pill-group">
          <button
            v-for="curr in baseCurrencies"
            :key="curr"
            class="oi-pill"
            :class="{ 'is-active': selectedBaseCurrency === curr }"
            @click="selectedBaseCurrency = curr"
          >
            {{ curr }}
          </button>
        </div>
      </div>
    </div>

    <!-- Intuition Ribbon -->
    <div class="impact-ribbon oi-card-box">
      <div class="ribbon-col">
        <span class="ribbon-title font-mono oi-xs is-pos">FX TAILWIND (BOOST)</span>
        <p class="oi-xs oi-muted">
          When a foreign currency appreciates against your home currency, your converted equity returns exceed local market performance (e.g. UK Pound strengthening vs USD).
        </p>
      </div>
      <div class="ribbon-col">
        <span class="ribbon-title font-mono oi-xs is-neg">FX HEADWIND (DRAG)</span>
        <p class="oi-xs oi-muted">
          When a foreign currency depreciates, overseas investors suffer a performance haircut despite robust domestic rallies (e.g. Japanese Yen or Brazilian Real weakness).
        </p>
      </div>
    </div>

    <!-- Table Container -->
    <div class="table-responsive">
      <table class="fx-table">
        <thead>
          <tr class="font-mono oi-xs">
            <th>BENCHMARK</th>
            <th>LOCAL CURRENCY</th>
            <th>LOCAL 1Y RETURN</th>
            <th>FX MOVEMENT (1Y)</th>
            <th>CONVERTED ({{ selectedBaseCurrency }}) RETURN</th>
            <th>NET FX IMPACT</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in tableRows"
            :key="item.indexId"
            class="fx-row"
          >
            <td class="name-cell">
              <span class="row-flag">{{ item.flag }}</span>
              <NuxtLink :to="`/indices/${item.indexId}`" class="row-name">
                {{ item.indexName }}
              </NuxtLink>
            </td>

            <td class="font-mono oi-xs oi-muted">
              {{ item.currency }}
            </td>

            <td class="num-tabular font-mono" :class="item.localReturn >= 0 ? 'is-pos' : 'is-neg'">
              {{ item.localReturn >= 0 ? '+' : '' }}{{ item.localReturn.toFixed(1) }}%
            </td>

            <td class="num-tabular font-mono" :class="item.fxDelta >= 0 ? 'is-pos' : 'is-neg'">
              {{ item.fxDelta >= 0 ? '+' : '' }}{{ item.fxDelta.toFixed(1) }}%
            </td>

            <td class="num-tabular font-mono" :class="item.adjustedReturn >= 0 ? 'is-pos' : 'is-neg'" style="font-weight: 600;">
              {{ item.adjustedReturn >= 0 ? '+' : '' }}{{ item.adjustedReturn.toFixed(1) }}%
            </td>

            <td>
              <span
                class="impact-pill font-mono oi-xs"
                :class="item.impactDelta > 0.1 ? 'is-boost' : item.impactDelta < -0.1 ? 'is-drag' : 'is-neutral'"
              >
                {{ item.impactDelta > 0 ? '+' : '' }}{{ item.impactDelta.toFixed(1) }}% {{ item.impactDelta > 0.1 ? 'Boost' : item.impactDelta < -0.1 ? 'Drag' : 'Neutral' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { indexMacroProfiles } from '~/data/macro'
import macroLive from '~/data/generated/macro_live.json'

const baseCurrencies = ['USD', 'EUR', 'GBP', 'INR']
const selectedBaseCurrency = ref<string>('USD')

const liveFXDeltas = (macroLive && (macroLive as any).fxDeltas1Y) || {}

// Dynamic cross-currency 1Y change relative to selected base currency
function getFXDeltaVsBase(currency: string, baseCurrency: string): number {
  if (currency === baseCurrency) return 0.0

  const deltaCurrUSD = (liveFXDeltas[currency] ?? 0.0) / 100
  const deltaBaseUSD = (liveFXDeltas[baseCurrency] ?? 0.0) / 100

  // (1 + R_curr/base) = (1 + R_curr/usd) / (1 + R_base/usd)
  const crossR = ((1 + deltaCurrUSD) / (1 + deltaBaseUSD) - 1) * 100
  return Number(crossR.toFixed(1))
}

const tableRows = computed(() => {
  const base = selectedBaseCurrency.value

  return indexMacroProfiles.map(item => {
    const fxDelta = getFXDeltaVsBase(item.currency, base)
    // Adjusted return = (1 + r_local) * (1 + fx_delta) - 1
    const localR = item.localReturn1Y / 100
    const fxR = fxDelta / 100
    const adjustedR = ((1 + localR) * (1 + fxR) - 1) * 100
    const impactDelta = adjustedR - item.localReturn1Y

    return {
      indexId: item.indexId,
      indexName: item.indexName,
      flag: item.flag,
      currency: item.currency,
      localReturn: item.localReturn1Y,
      fxDelta,
      adjustedReturn: adjustedR,
      impactDelta
    }
  }).sort((a, b) => b.adjustedReturn - a.adjustedReturn)
})
</script>

<style scoped>
.currency-impact-wrapper {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.table-header {
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

.base-currency-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-label {
  color: var(--oi-ink-3);
}

.pill-group {
  display: flex;
  gap: 4px;
}

.impact-ribbon {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--oi-s3);
  padding: var(--oi-s3);
  background-color: var(--oi-canvas);
}

@media (max-width: 768px) {
  .impact-ribbon {
    grid-template-columns: 1fr;
  }
}

.ribbon-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.fx-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.fx-table th,
.fx-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--oi-hairline);
}

.fx-table th {
  color: var(--oi-ink-2);
  font-weight: 500;
}

.fx-row:hover td {
  background-color: var(--oi-card-hover);
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-flag {
  font-size: 1.15rem;
}

.row-name {
  font-weight: 500;
  color: var(--oi-ink);
  text-decoration: none;
}

.row-name:hover {
  text-decoration: underline;
}

.impact-pill {
  padding: 3px 8px;
  border-radius: var(--oi-r-s);
  display: inline-block;
}

.impact-pill.is-boost {
  background-color: rgba(0, 226, 0, 0.15);
  color: var(--oi-green);
  border: 1px solid var(--oi-green);
}

.impact-pill.is-drag {
  background-color: rgba(255, 95, 83, 0.15);
  color: var(--oi-loss);
  border: 1px solid var(--oi-loss);
}

.impact-pill.is-neutral {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--oi-ink-3);
  border: 1px solid var(--oi-hairline);
}

.is-pos {
  color: var(--oi-green);
}

.is-neg {
  color: var(--oi-loss);
}
</style>
