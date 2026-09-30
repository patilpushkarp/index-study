<template>
  <div class="learn-page">
    <div class="oi-container">
      <!-- Header -->
      <section class="learn-header">
        <span class="meta-tag font-mono oi-xs">// 07. METHODOLOGY & CONSTRUCTION GUIDE</span>
        <h1 class="oi-display">
          Understanding Indices, <span class="oi-serif">the architecture of benchmarks.</span>
        </h1>
        <p class="oi-body">
          A rigorous guide to how modern stock market indices are designed, calculated, rebalanced, and utilized as structural foundations for global asset allocation.
        </p>
      </section>

      <!-- Interactive Weighting Methodology Simulator -->
      <section class="sim-section oi-card-box">
        <div class="sim-header">
          <div class="sim-titles">
            <span class="meta-tag font-mono oi-xs">// INTERACTIVE BENCHMARK LAB</span>
            <h3 class="oi-h3">Weighting Methodology Comparison Simulator</h3>
            <p class="oi-sm oi-muted">
              See how the same 3 companies result in radically different portfolio allocations under Free-Float, Price-Weighted, and Equal-Weighted designs.
            </p>
          </div>

          <div class="sim-pills">
            <button
              class="oi-pill"
              :class="{ 'is-active': activeWeightMethod === 'float' }"
              @click="activeWeightMethod = 'float'"
            >
              Free-Float Market Cap (S&P/Nifty)
            </button>
            <button
              class="oi-pill"
              :class="{ 'is-active': activeWeightMethod === 'price' }"
              @click="activeWeightMethod = 'price'"
            >
              Price-Weighted (Dow/Nikkei)
            </button>
            <button
              class="oi-pill"
              :class="{ 'is-active': activeWeightMethod === 'equal' }"
              @click="activeWeightMethod = 'equal'"
            >
              Equal Weighted
            </button>
          </div>
        </div>

        <div class="sim-grid">
          <div
            v-for="co in simulatedWeights"
            :key="co.name"
            class="sim-company-card oi-card-box"
          >
            <div class="co-top">
              <span class="co-name font-mono oi-sm">{{ co.name }}</span>
              <span class="co-tag font-mono oi-xs oi-muted">{{ co.sector }}</span>
            </div>

            <div class="co-stats font-mono oi-xs">
              <div class="co-stat-line">
                <span class="oi-muted">Share Price:</span>
                <span class="num-tabular">${{ co.price }}</span>
              </div>
              <div class="co-stat-line">
                <span class="oi-muted">Total Market Cap:</span>
                <span class="num-tabular">${{ co.mcap }}B</span>
              </div>
              <div class="co-stat-line">
                <span class="oi-muted">Free-Float Factor:</span>
                <span class="num-tabular">{{ co.floatPct }}%</span>
              </div>
            </div>

            <!-- Resulting Weight Bar -->
            <div class="weight-result-box">
              <div class="result-label-row font-mono oi-xs">
                <span class="oi-muted">INDEX ALLOCATION:</span>
                <span class="num-tabular is-pos" style="font-size: 1.15rem; font-weight: 600;">
                  {{ co.weight.toFixed(1) }}%
                </span>
              </div>
              <div class="alloc-track">
                <div class="alloc-fill" :style="{ width: `${co.weight}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="sim-takeaway font-mono oi-xs">
          <span class="oi-muted">KEY INSIGHT:</span>
          <span v-if="activeWeightMethod === 'float'">
            Under Free-Float, Company Beta ($40B float) naturally commands 66.7% of the index despite having the lowest share price ($50).
          </span>
          <span v-else-if="activeWeightMethod === 'price'">
            Under Price-Weighting, Company Alpha commands a massive 76.9% of the index simply because its nominal share price is $500, even though its enterprise is the smallest!
          </span>
          <span v-else>
            Under Equal-Weighting, each company receives an exact 33.3% allocation, requiring active quarterly rebalancing to re-align drifts.
          </span>
        </div>
      </section>

      <!-- Grid of Concept Chapters -->
      <section class="chapters-grid">
        <!-- Chapter 1 -->
        <article class="chapter-card oi-card-box">
          <div class="chapter-badge font-mono oi-xs">CHAPTER 01</div>
          <h2 class="oi-h2">Weighting Methodologies</h2>
          <p class="oi-body">
            The mathematical formula determining how individual company share prices influence the headline index level is the single most important design attribute.
          </p>
          <div class="chapter-subsections">
            <div class="sub-item">
              <h4 class="sub-title oi-h3">Free-Float Market Capitalization</h4>
              <p class="oi-sm oi-muted">
                Used by S&P 500, Nifty 50, and DAX 40. Shares held by promoters, governments, and locked strategic owners are stripped out. Companies impact the index in direct proportion to freely tradable public equity. Self-rebalancing as prices fluctuate.
              </p>
            </div>
            <div class="sub-item">
              <h4 class="sub-title oi-h3">Price-Weighted Indexation</h4>
              <p class="oi-sm oi-muted">
                Used by the Dow Jones Industrial Average and Nikkei 225. A stock’s weight is determined solely by its nominal share price, not company size. A $500 stock has 5x the weight of a $100 stock regardless of total market cap. Divisors adjust for stock splits.
              </p>
            </div>
          </div>
        </article>

        <!-- Chapter 2 -->
        <article class="chapter-card oi-card-box">
          <div class="chapter-badge font-mono oi-xs">CHAPTER 02</div>
          <h2 class="oi-h2">Price Return vs Total Return</h2>
          <p class="oi-body">
            Headline stock indices quoted on news channels (e.g. "S&P up 0.4%") are virtually always <strong>Price Return (PR)</strong> indices, excluding dividend cash flows.
          </p>
          <div class="chapter-subsections">
            <div class="sub-item">
              <h4 class="sub-title oi-h3">Dividend Drag & Compounding Gap</h4>
              <p class="oi-sm oi-muted">
                Over a 20-year horizon, reinvested dividends in a <strong>Total Return (TR)</strong> index can account for more than 45% of cumulative investor wealth generation. Indices with high dividend yields (e.g. FTSE 100 or Ibovespa) appear artificially muted when viewed solely on price return charts.
              </p>
            </div>
          </div>
        </article>

        <!-- Chapter 3 -->
        <article class="chapter-card oi-card-box">
          <div class="chapter-badge font-mono oi-xs">CHAPTER 03</div>
          <h2 class="oi-h2">Reconstitution & Rebalancing</h2>
          <p class="oi-body">
            Index committees follow strict schedules (quarterly or semi-annually) to add rising companies and prune declining entities.
          </p>
          <div class="chapter-subsections">
            <div class="sub-item">
              <h4 class="sub-title oi-h3">Index Inclusion Effect</h4>
              <p class="oi-sm oi-muted">
                Passive tracker funds (ETFs and index mutual funds managing over $15 Trillion globally) must mechanically purchase newly added constituents on the rebalancing effective date, creating predictable institutional liquidity flows.
              </p>
            </div>
            <div class="sub-item">
              <h4 class="sub-title oi-h3">Survivorship Bias</h4>
              <p class="oi-sm oi-muted">
                Indices inherently reflect the performance of survivors. Failing businesses decline in weight and are eventually removed, while growing companies compound upward, imparting an intrinsic upward drift.
              </p>
            </div>
          </div>
        </article>

        <!-- Chapter 4 -->
        <article class="chapter-card oi-card-box">
          <div class="chapter-badge font-mono oi-xs">CHAPTER 04</div>
          <h2 class="oi-h2">Concentration Risk (HHI Index)</h2>
          <p class="oi-body">
            Cap-weighted indices can become dominated by mega-cap technology leaders.
          </p>
          <div class="chapter-subsections">
            <div class="sub-item">
              <h4 class="sub-title oi-h3">Evaluating Single-Stock Dependency</h4>
              <p class="oi-sm oi-muted">
                When the top 5 constituents exceed 30% of an index's total weighting (such as the "Magnificent 7" in the Nasdaq 100 or HDFC/Reliance in Nifty 50), the index behaves more like a focused portfolio than a diversified economy-wide basket.
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeWeightMethod = ref<'float' | 'price' | 'equal'>('float')

interface SimCompany {
  name: string
  sector: string
  price: number
  mcap: number
  floatPct: number
}

const companies: SimCompany[] = [
  { name: 'Company Alpha', sector: 'Semiconductors', price: 500, mcap: 10, floatPct: 50 },
  { name: 'Company Beta', sector: 'Consumer Internet', price: 50, mcap: 50, floatPct: 80 },
  { name: 'Company Gamma', sector: 'Banking & Finance', price: 100, mcap: 20, floatPct: 75 }
]

const simulatedWeights = computed(() => {
  if (activeWeightMethod.value === 'equal') {
    return companies.map(c => ({ ...c, weight: 33.33 }))
  }

  if (activeWeightMethod.value === 'price') {
    const sumPrice = companies.reduce((acc, c) => acc + c.price, 0)
    return companies.map(c => ({
      ...c,
      weight: (c.price / sumPrice) * 100
    }))
  }

  // Free float market cap: (mcap * floatPct / 100)
  const floatMcaps = companies.map(c => (c.mcap * c.floatPct) / 100)
  const sumFloat = floatMcaps.reduce((acc, v) => acc + v, 0)

  return companies.map((c, i) => ({
    ...c,
    weight: (floatMcaps[i] / sumFloat) * 100
  }))
})

useHead({
  title: 'Index Construction & Methodology Guide — INDEX // STUDY',
  meta: [
    { name: 'description', content: 'Comprehensive institutional guide on stock index design: Free-Float vs Price-Weighting, Total Return vs Price Return, and survivorship bias.' }
  ]
})
</script>

<style scoped>
.learn-page {
  padding-top: var(--oi-s5);
  padding-bottom: var(--oi-s7);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s5);
}

.learn-header {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.sim-section {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.sim-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s3);
  border-bottom: 1px solid var(--oi-hairline);
  padding-bottom: var(--oi-s3);
}

.sim-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 600px;
}

.sim-pills {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.sim-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--oi-s3);
}

@media (max-width: 800px) {
  .sim-grid {
    grid-template-columns: 1fr;
  }
}

.sim-company-card {
  padding: var(--oi-s3);
  background-color: var(--oi-canvas);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.co-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.co-name {
  font-weight: 500;
  color: var(--oi-ink);
}

.co-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
  border-top: 1px dashed var(--oi-hairline);
  border-bottom: 1px dashed var(--oi-hairline);
}

.co-stat-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.weight-result-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.result-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alloc-track {
  height: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
}

.alloc-fill {
  height: 100%;
  background-color: var(--oi-green);
  border-radius: 4px;
  transition: width 0.3s ease-out;
}

.sim-takeaway {
  padding: 10px 12px;
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--oi-ink);
}

.chapters-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--oi-s4);
}

@media (max-width: 768px) {
  .chapters-grid {
    grid-template-columns: 1fr;
  }
}

.chapter-card {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.chapter-badge {
  color: var(--oi-ink-3);
  letter-spacing: 0.05em;
}

.chapter-subsections {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
  margin-top: var(--oi-s2);
  border-top: 1px solid var(--oi-hairline);
  padding-top: var(--oi-s3);
}

.sub-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sub-title {
  color: var(--oi-ink);
  font-weight: 500;
  font-size: 1.05rem;
}

.is-pos {
  color: var(--oi-green);
}
</style>
