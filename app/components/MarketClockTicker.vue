<template>
  <div class="ticker-wrapper">
    <div class="oi-container ticker-container">
      <div class="ticker-label">
        <span class="ticker-title">GLOBAL EXCHANGES</span>
        <span class="ticker-utc font-mono">UTC {{ currentUtcTime }}</span>
      </div>

      <div class="ticker-scroll">
        <div
          v-for="hub in keyHubs"
          :key="hub.city"
          class="hub-item"
        >
          <div class="hub-header">
            <span
              class="oi-dot"
              :class="{
                'closed': !hub.status.isOpen,
                'pulse': hub.status.isOpen
              }"
            ></span>
            <span class="hub-city">{{ hub.city }}</span>
            <span class="hub-badge oi-xs font-mono">{{ hub.status.statusLabel }}</span>
          </div>

          <div class="hub-details">
            <span class="hub-time num-tabular font-mono">{{ hub.status.localTimeFormatted }}</span>
            <span class="hub-countdown oi-xs oi-faint font-mono">{{ hub.status.countdownFormatted }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="oi-divider"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { globalIndices } from '~/data/indices'
import { useMarketStatus } from '~/composables/useMarketStatus'

const { currentTime, getStatusForIndex } = useMarketStatus()

const currentUtcTime = computed(() => {
  return currentTime.value.toISOString().substring(11, 19)
})

// Representative indices for key global financial hubs
const hubIndexMap = [
  { city: 'New York', id: 'sp500' },
  { city: 'London', id: 'ftse100' },
  { city: 'Frankfurt', id: 'dax40' },
  { city: 'Mumbai', id: 'nifty50' },
  { city: 'Tokyo', id: 'nikkei225' },
  { city: 'Hong Kong', id: 'hangseng' },
  { city: 'Sydney', id: 'asx200' },
  { city: 'Riyadh', id: 'tasi' }
]

const keyHubs = computed(() => {
  return hubIndexMap.map(hub => {
    const idx = globalIndices.find(i => i.id === hub.id) || globalIndices[0]
    const status = getStatusForIndex(idx)
    return {
      city: hub.city,
      status
    }
  })
})
</script>

<style scoped>
.ticker-wrapper {
  background-color: var(--oi-card);
  overflow: hidden;
}

.ticker-container {
  display: flex;
  align-items: center;
  gap: var(--oi-s4);
  padding-top: 10px;
  padding-bottom: 10px;
}

.ticker-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
  border-right: 1px solid var(--oi-hairline);
  padding-right: var(--oi-s3);
}

.ticker-title {
  font-family: var(--font-heading);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--oi-ink-3);
  text-transform: uppercase;
}

.ticker-utc {
  font-size: 11px;
  color: var(--oi-ink-2);
}

.ticker-scroll {
  display: flex;
  align-items: center;
  gap: var(--oi-s5);
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 2px 0;
}

.ticker-scroll::-webkit-scrollbar {
  display: none;
}

.hub-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-shrink: 0;
}

.hub-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hub-city {
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 500;
  color: var(--oi-ink);
}

.hub-badge {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 2px;
  background-color: var(--oi-hairline);
  color: var(--oi-ink-2);
}

.hub-details {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hub-time {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--oi-ink-2);
}

.hub-countdown {
  font-size: 11px;
}

@media (max-width: 768px) {
  .ticker-container {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--oi-s2);
  }
  .ticker-label {
    border-right: none;
    border-bottom: 1px solid var(--oi-hairline);
    padding-right: 0;
    padding-bottom: 6px;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
