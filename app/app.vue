<template>
  <div class="app-layout">
    <Navbar />
    <MarketClockTicker />

    <main class="page-viewport">
      <NuxtPage />
    </main>

    <!-- Khasiyev-style Editorial Footer -->
    <footer class="app-footer">
      <div class="oi-divider"></div>
      <div class="oi-container footer-content">
        <!-- Top CTA Banner -->
        <div class="footer-hero">
          <p class="oi-display footer-title">
            Global market intelligence, <span class="oi-serif">engineered for precision.</span>
          </p>
          <div class="footer-actions">
            <NuxtLink to="/compare" class="oi-btn is-white">
              <span class="oi-dot"></span>
              Compare Indices
            </NuxtLink>
            <NuxtLink to="/screen" class="oi-btn">
              Explore Screener
            </NuxtLink>
          </div>
        </div>

        <!-- Columns Grid -->
        <div class="footer-grid">
          <div class="footer-col">
            <span class="footer-col-title font-mono oi-xs">REGIONAL BENCHMARKS</span>
            <div class="footer-links">
              <NuxtLink to="/?region=Americas" class="footer-link">Americas (S&P 500, Nasdaq, TSX)</NuxtLink>
              <NuxtLink to="/?region=Europe" class="footer-link">Europe (FTSE, DAX, CAC, Stoxx)</NuxtLink>
              <NuxtLink to="/?region=Asia-Pacific" class="footer-link">Asia-Pacific (Nifty, Nikkei, Hang Seng)</NuxtLink>
              <NuxtLink to="/?region=Emerging" class="footer-link">Emerging Markets (TASI, JSE, Bovespa)</NuxtLink>
            </div>
          </div>

          <div class="footer-col">
            <span class="footer-col-title font-mono oi-xs">STUDY MODULES</span>
            <div class="footer-links">
              <NuxtLink to="/" class="footer-link">Global Overview & Watchlist</NuxtLink>
              <NuxtLink to="/compare" class="footer-link">Multi-Index Comparison</NuxtLink>
              <NuxtLink to="/valuations" class="footer-link">Global Valuations Matrix</NuxtLink>
              <NuxtLink to="/screen" class="footer-link">Multi-Factor Screener</NuxtLink>
            </div>
          </div>

          <div class="footer-col">
            <span class="footer-col-title font-mono oi-xs">MACRO & LABS</span>
            <div class="footer-links">
              <NuxtLink to="/correlation" class="footer-link">Pairwise Correlation Heatmap</NuxtLink>
              <NuxtLink to="/crisis" class="footer-link">Crisis Stress Lab</NuxtLink>
              <NuxtLink to="/macro" class="footer-link">Macro Board & FX Engine</NuxtLink>
              <NuxtLink to="/learn" class="footer-link">Benchmark Study Guide</NuxtLink>
            </div>
          </div>

          <div class="footer-col">
            <span class="footer-col-title font-mono oi-xs">LEGAL & COMPLIANCE</span>
            <div class="footer-links">
              <NuxtLink to="/disclaimer" class="footer-link">Financial Disclaimer</NuxtLink>
              <NuxtLink to="/terms" class="footer-link">Terms of Use</NuxtLink>
              <NuxtLink to="/privacy" class="footer-link">Privacy Policy</NuxtLink>
              <NuxtLink to="/terms#trademarks" class="footer-link">Benchmark Trademarks</NuxtLink>
            </div>
          </div>
        </div>

        <!-- Bottom Copyright & Purpose -->
        <div class="footer-bottom font-mono oi-xs oi-faint">
          <span>INDEX // STUDY © 2026. Made by Pushkar Patil.</span>
          <span>For educational and financial research purposes only. Not investment advice.</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-viewport {
  flex: 1;
}

.app-footer {
  margin-top: var(--oi-s7);
  background-color: var(--oi-card);
}

.footer-content {
  padding-top: var(--oi-s6);
  padding-bottom: var(--oi-s5);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s6);
}

.footer-hero {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.footer-title {
  max-width: 22ch;
  color: var(--oi-ink);
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: var(--oi-s2);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--oi-s5);
  border-top: 1px solid var(--oi-hairline);
  padding-top: var(--oi-s5);
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--oi-s4);
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--oi-s4);
  }
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.footer-col-title {
  color: var(--oi-ink-3);
  letter-spacing: 0.1em;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-link {
  font-size: 13.5px;
  color: var(--oi-ink-2);
  transition: color var(--oi-dur) var(--oi-ease);
}

.footer-link:hover {
  color: var(--oi-ink);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--oi-hairline);
  padding-top: var(--oi-s4);
  flex-wrap: wrap;
  gap: var(--oi-s2);
}
</style>
