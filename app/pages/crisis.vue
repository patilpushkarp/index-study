<template>
  <div class="crisis-page">
    <div class="oi-container">
      <!-- Header -->
      <section class="page-header">
        <span class="meta-tag font-mono oi-xs">// 04. HISTORICAL STRESS TESTING & RISK METRICS</span>
        <h1 class="oi-display">
          Crisis Drawdown & Stress Lab, <span class="oi-serif">peak-to-trough resilience.</span>
        </h1>
        <p class="oi-body">
          Macro historical crash analytics across 4 generational market stress events: 2000 Dot-Com, 2008 Lehman GFC, 2020 COVID Flash Crash, and the 2022 Global Inflation shock.
        </p>

        <!-- Crisis Quick Facts Ribbon -->
        <div class="facts-ribbon">
          <div class="fact-card oi-card-box">
            <span class="fact-label font-mono oi-xs">SHARPEST VELOCITY CRASH</span>
            <div class="fact-val font-mono">
              <span>2020 COVID-19</span>
              <span class="num-tabular is-neg">-34.8% avg</span>
            </div>
            <span class="fact-desc oi-xs oi-muted">Global indices lost 30%+ in just 22 trading days</span>
          </div>

          <div class="fact-card oi-card-box">
            <span class="fact-label font-mono oi-xs">LONGEST RECOVERY PERIOD</span>
            <div class="fact-val font-mono">
              <span>2000 Dot-Com</span>
              <span class="num-tabular">182 months</span>
            </div>
            <span class="fact-desc oi-xs oi-muted">Nasdaq 100 took 15.2 years to surpass its March 2000 peak</span>
          </div>

          <div class="fact-card oi-card-box">
            <span class="fact-label font-mono oi-xs">GREATEST DISPERSION</span>
            <div class="fact-val font-mono">
              <span>2022 Inflation & Rates</span>
              <span class="num-tabular is-pos">FTSE -6.8% vs HSI -36.5%</span>
            </div>
            <span class="fact-desc oi-xs oi-muted">Value & energy benchmarks insulated against tech de-rating</span>
          </div>
        </div>
      </section>

      <!-- Main Interactive Crisis Lab Component -->
      <section class="lab-section">
        <CrisisStressLab />
      </section>

      <!-- Educational Breakdown -->
      <section class="mechanics-section oi-card-box">
        <div class="mechanics-header">
          <span class="meta-tag font-mono oi-xs">// RISK MANAGEMENT LESSONS</span>
          <h3 class="oi-h3">Anatomy of Equity Drawdowns & Recovery Playbooks</h3>
        </div>

        <div class="mechanics-grid">
          <div class="mechanics-col">
            <span class="col-heading font-mono oi-xs">1. DURATION RISK & PE MULTIPLES</span>
            <p class="oi-sm">
              In crises driven by valuation de-rating or interest rate spikes (2000 Dot-Com, 2022 Inflation), high-multiple growth equities suffer disproportionate multiple compression. Meanwhile, dividend-paying value benchmarks with tangible cash flows (FTSE 100, TSX, Dow) exhibit superior downside buffers.
            </p>
          </div>

          <div class="mechanics-col">
            <span class="col-heading font-mono oi-xs">2. CREDIT CONTAGION VS DEMAND SHOCKS</span>
            <p class="oi-sm">
              The 2008 Lehman collapse caused a banking balance sheet freeze that required 4+ years of systemic recapitalization before equities recovered. In contrast, the 2020 COVID shock was an external demand shutdown paired with immediate, massive central bank backstops, enabling a V-shaped recovery in under 6 months.
            </p>
          </div>

          <div class="mechanics-col">
            <span class="col-heading font-mono oi-xs">3. DOMESTIC DEMOGRAPHIC HEDGES</span>
            <p class="oi-sm">
              Emerging markets with rising domestic retail participation (e.g. India's Nifty 50 with steady monthly SIP mutual fund inflows) have shown escalating structural resilience, absorbing foreign institutional selloffs and reclaiming all-time highs faster than mature markets.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Crisis Drawdown & Historical Stress Lab — INDEX // STUDY',
  meta: [
    { name: 'description', content: 'Historical stress testing, peak-to-trough drawdowns, and recovery timelines across major market crashes: 2000 Dot-com, 2008 GFC, 2020 COVID, and 2022 Inflation cycle.' }
  ]
})
</script>

<style scoped>
.crisis-page {
  padding-top: var(--oi-s5);
  padding-bottom: var(--oi-s7);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s5);
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.facts-ribbon {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--oi-s3);
  margin-top: var(--oi-s3);
}

@media (max-width: 900px) {
  .facts-ribbon {
    grid-template-columns: 1fr;
  }
}

.fact-card {
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fact-label {
  color: var(--oi-ink-3);
}

.fact-val {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--oi-ink);
}

.fact-desc {
  line-height: 1.4;
}

.lab-section {
  display: flex;
  flex-direction: column;
}

.mechanics-section {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
  margin-top: var(--oi-s4);
}

.mechanics-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mechanics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--oi-s4);
}

@media (max-width: 900px) {
  .mechanics-grid {
    grid-template-columns: 1fr;
  }
}

.mechanics-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.col-heading {
  color: var(--oi-ink-2);
}
</style>
