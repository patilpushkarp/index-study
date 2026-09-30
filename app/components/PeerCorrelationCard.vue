<template>
  <div class="peer-correlation-card oi-card-box">
    <div class="card-header">
      <div class="title-group">
        <span class="meta-tag font-mono oi-xs">// STATISTICAL CO-MOVEMENT & DIVERSIFICATION</span>
        <h3 class="oi-h3">Peer Correlation & Decorrelation Profile</h3>
      </div>
      <NuxtLink to="/correlation" class="oi-btn oi-xs">
        Full Matrix ↗
      </NuxtLink>
    </div>

    <div class="peers-grid">
      <!-- Most Correlated Peers -->
      <div class="peers-column">
        <div class="col-head">
          <span class="col-indicator is-high"></span>
          <span class="col-title font-mono oi-xs">HIGHEST CO-MOVEMENT (1Y)</span>
        </div>
        <p class="col-subtext oi-xs oi-muted">
          Benchmarks that track closest during global liquidity swings and sentiment shifts.
        </p>

        <div class="peers-list">
          <NuxtLink
            v-for="peer in topCorrelated"
            :key="peer.id"
            :to="`/indices/${peer.id}`"
            class="peer-item"
          >
            <div class="peer-meta">
              <span class="peer-flag">{{ getIndexFlag(peer.id) }}</span>
              <span class="peer-name font-mono oi-sm">{{ getIndexName(peer.id) }}</span>
            </div>
            <div class="peer-stats">
              <span class="peer-r num-tabular font-mono is-pos">+{{ peer.correlation.toFixed(2) }}</span>
              <span class="peer-r2 font-mono oi-xs oi-muted">R² {{ (peer.rSquared * 100).toFixed(0) }}%</span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Best Diversifiers -->
      <div class="peers-column">
        <div class="col-head">
          <span class="col-indicator is-div"></span>
          <span class="col-title font-mono oi-xs">OPTIMAL PORTFOLIO DIVERSIFIERS</span>
        </div>
        <p class="col-subtext oi-xs oi-muted">
          Lowest historical correlation. Holding these reduces portfolio volatility through economic decoupling.
        </p>

        <div class="peers-list">
          <NuxtLink
            v-for="peer in bestDiversifiers"
            :key="peer.id"
            :to="`/indices/${peer.id}`"
            class="peer-item"
          >
            <div class="peer-meta">
              <span class="peer-flag">{{ getIndexFlag(peer.id) }}</span>
              <span class="peer-name font-mono oi-sm">{{ getIndexName(peer.id) }}</span>
            </div>
            <div class="peer-stats">
              <span class="peer-r num-tabular font-mono" :class="peer.correlation <= 0.3 ? 'is-uncorr' : ''">
                +{{ peer.correlation.toFixed(2) }}
              </span>
              <span class="peer-badge font-mono oi-xs">High Hedge</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { globalIndices } from '~/data/indices'
import { getTopCorrelatedPeers, getBestDiversifiers } from '~/data/correlations'

const props = defineProps<{
  indexId: string
}>()

const topCorrelated = computed(() => {
  return getTopCorrelatedPeers(props.indexId, 3, '1Y')
})

const bestDiversifiers = computed(() => {
  return getBestDiversifiers(props.indexId, 3, '1Y')
})

function getIndexName(id: string): string {
  const found = globalIndices.find(idx => idx.id === id)
  return found?.shortName || id
}

function getIndexFlag(id: string): string {
  const found = globalIndices.find(idx => idx.id === id)
  return found?.flag || '🌐'
}
</script>

<style scoped>
.peer-correlation-card {
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

.peers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--oi-s4);
}

@media (max-width: 768px) {
  .peers-grid {
    grid-template-columns: 1fr;
  }
}

.peers-column {
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s2);
}

.col-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.col-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.col-indicator.is-high {
  background-color: var(--oi-green);
  box-shadow: 0 0 6px rgba(0, 226, 0, 0.4);
}

.col-indicator.is-div {
  background-color: #2D68FF;
  box-shadow: 0 0 6px rgba(45, 104, 255, 0.4);
}

.col-title {
  color: var(--oi-ink);
  font-weight: 500;
}

.peers-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.peer-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background-color: var(--oi-card);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
  text-decoration: none;
  transition: background-color var(--oi-dur) var(--oi-ease), border-color var(--oi-dur) var(--oi-ease);
}

.peer-item:hover {
  background-color: var(--oi-card-hover);
  border-color: var(--oi-ink-3);
}

.peer-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.peer-name {
  color: var(--oi-ink);
}

.peer-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.peer-r {
  font-size: 13px;
  font-weight: 600;
}

.peer-r.is-pos {
  color: var(--oi-green);
}

.peer-r.is-uncorr {
  color: #60a5fa;
}

.peer-badge {
  background-color: rgba(45, 104, 255, 0.15);
  color: #93c5fd;
  border: 1px solid rgba(45, 104, 255, 0.3);
  padding: 2px 6px;
  border-radius: 3px;
}
</style>
