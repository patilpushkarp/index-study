<template>
  <div class="legal-page">
    <div class="oi-container">
      <!-- Breadcrumb & Tag -->
      <div class="legal-meta">
        <NuxtLink to="/" class="back-link font-mono oi-xs">← Back to Overview</NuxtLink>
        <span class="meta-tag font-mono oi-xs">// DATA PRIVACY & CONFIDENTIALITY</span>
      </div>

      <!-- Hero Header -->
      <section class="legal-header">
        <h1 class="oi-display">
          Privacy Policy, <span class="oi-serif">zero-telemetry commitment.</span>
        </h1>
        <p class="oi-body">
          INDEX // STUDY is engineered as a static, client-side web application. We believe your financial research habits, watchlists, and analytical queries are strictly your own business.
        </p>
      </section>

      <!-- Privacy Pillar Highlight Cards -->
      <div class="privacy-pillars">
        <div class="pillar-card oi-card-box">
          <span class="pillar-icon font-mono">01</span>
          <span class="pillar-title font-mono oi-xs">ZERO PERSONAL DATA</span>
          <p class="oi-xs oi-muted">No accounts, no user logins, no email collection, and no profile databases.</p>
        </div>
        <div class="pillar-card oi-card-box">
          <span class="pillar-icon font-mono">02</span>
          <span class="pillar-title font-mono oi-xs">NO TRACKING COOKIES</span>
          <p class="oi-xs oi-muted">Zero advertising networks, zero third-party behavioral pixels, zero analytics beacons.</p>
        </div>
        <div class="pillar-card oi-card-box">
          <span class="pillar-icon font-mono">03</span>
          <span class="pillar-title font-mono oi-xs">100% LOCAL STORAGE</span>
          <p class="oi-xs oi-muted">Watchlists and display preferences stay exclusively on your local device.</p>
        </div>
      </div>

      <!-- Legal Content Sections -->
      <div class="legal-grid">
        <div class="legal-content">
          <!-- Section 01 -->
          <article class="legal-section oi-card-box">
            <div class="section-badge font-mono oi-xs">SECTION 01</div>
            <h2 class="oi-h2">Privacy by Design Principle</h2>
            <p class="oi-body">
              This Privacy Policy describes how Pushkar Patil and INDEX // STUDY ("we", "us", or "the Platform") treat data when you interact with this website. Unlike traditional commercial financial portals that track your portfolios, monitor your search terms, and sell behavioral profiles to advertising networks, INDEX // STUDY is architected with a strict <strong>Privacy by Design</strong> philosophy.
            </p>
            <p class="oi-body">
              We do not run backend user databases. We do not track who you are, what indices you inspect, or what risk models you run.
            </p>
          </article>

          <!-- Section 02 -->
          <article class="legal-section oi-card-box">
            <div class="section-badge font-mono oi-xs">SECTION 02</div>
            <h2 class="oi-h2">No Personal Data Collection</h2>
            <p class="oi-body">
              We do not collect, process, solicit, or store any Personally Identifiable Information (PII), such as:
            </p>
            <ul class="legal-list oi-body">
              <li>Names, physical addresses, telephone numbers, or email addresses;</li>
              <li>Bank accounts, brokerage credentials, credit cards, or financial account identifiers;</li>
              <li>Government identification numbers, tax IDs, or social security numbers;</li>
              <li>Biometric data, device location telemetry, or behavioral profiling data.</li>
            </ul>
          </article>

          <!-- Section 03 -->
          <article class="legal-section oi-card-box">
            <div class="section-badge font-mono oi-xs">SECTION 03</div>
            <h2 class="oi-h2">Browser Local Storage & Client-Side State</h2>
            <p class="oi-body">
              To provide a fast, seamless user experience without requiring an account, the Platform utilizes your browser's native client-side storage (<code class="code-tag">window.localStorage</code>). This data resides exclusively on your local machine:
            </p>
            <div class="storage-table-wrapper">
              <table class="trademark-table font-mono oi-xs">
                <thead>
                  <tr>
                    <th>Storage Key</th>
                    <th>Purpose</th>
                    <th>Destination</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>watchlist_indices</code></td>
                    <td>Saves your pinned favorite indices for quick dashboard access</td>
                    <td>Local Browser Only (Never Transmitted)</td>
                  </tr>
                  <tr>
                    <td><code>selected_currency</code></td>
                    <td>Remembers your active currency filter (USD, EUR, GBP, INR, Local)</td>
                    <td>Local Browser Only (Never Transmitted)</td>
                  </tr>
                  <tr>
                    <td><code>color_theme</code></td>
                    <td>Stores dark/light visual display preference</td>
                    <td>Local Browser Only (Never Transmitted)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="oi-body">
              You maintain 100% unilateral control over this data. You may erase it at any moment by clearing your browser cache and site data or using your browser's developer console.
            </p>
          </article>

          <!-- Section 04 -->
          <article class="legal-section oi-card-box">
            <div class="section-badge font-mono oi-xs">SECTION 04</div>
            <h2 class="oi-h2">Cookies & Third-Party Trackers</h2>
            <p class="oi-body">
              INDEX // STUDY uses <strong>zero advertising cookies</strong>, zero marketing pixels (such as Google Tag Manager, Meta Pixel, or LinkedIn Insights), and zero cross-site session trackers.
            </p>
            <p class="oi-body">
              Because no non-essential cookies or tracking scripts are deployed, you will not encounter cookie consent popups or tracking permission modals on this website.
            </p>
          </article>

          <!-- Section 05 -->
          <article class="legal-section oi-card-box">
            <div class="section-badge font-mono oi-xs">SECTION 05</div>
            <h2 class="oi-h2">Third-Party APIs & Hosting Infrastructure</h2>
            <p class="oi-body">
              This site is statically hosted via GitHub Pages (GitHub, Inc. / Microsoft Corp.). When you visit the site, standard HTTP/HTTPS request headers (such as IP address and browser user-agent) are processed by GitHub's content delivery servers to transmit the static HTML, JavaScript, and CSS files to your device, as outlined in GitHub's Global Privacy Statement.
            </p>
            <p class="oi-body">
              Client-side market updates (such as real-time European Central Bank foreign exchange rates queried from the public Frankfurter API) communicate directly with those public endpoints without transmitting any personal identifiers.
            </p>
          </article>

          <!-- Section 06 -->
          <article class="legal-section oi-card-box">
            <div class="section-badge font-mono oi-xs">SECTION 06</div>
            <h2 class="oi-h2">Global Regulatory Alignment (GDPR, CCPA, CPRA)</h2>
            <p class="oi-body">
              Because INDEX // STUDY does not harvest, store, process, monetize, or sell personal data:
            </p>
            <ul class="legal-list oi-body">
              <li><strong>GDPR (European Union):</strong> No personal data processing occurs that requires Data Protection Officer (DPO) registration or cross-border data transfer mechanisms.</li>
              <li><strong>CCPA / CPRA (California):</strong> We do not sell or share personal information as defined by California consumer privacy statutes.</li>
              <li><strong>Right to Deletion:</strong> Because all preferences reside solely in your local browser, you can exercise complete deletion at any time by clearing your browser data.</li>
            </ul>
          </article>
        </div>

        <!-- Quick Summary Sticky Sidebar -->
        <aside class="legal-sidebar">
          <div class="sidebar-card oi-card-box">
            <span class="font-mono oi-xs oi-muted">// PRIVACY SNAPSHOT</span>
            <ul class="summary-list font-mono oi-xs">
              <li><span class="dot-bullet">•</span> Zero personal data collected</li>
              <li><span class="dot-bullet">•</span> Zero advertising tracking cookies</li>
              <li><span class="dot-bullet">•</span> No user accounts or passwords</li>
              <li><span class="dot-bullet">•</span> LocalStorage stays on device</li>
              <li><span class="dot-bullet">•</span> No data selling or monetization</li>
              <li><span class="dot-bullet">•</span> GDPR & CCPA compliant by design</li>
            </ul>
            <div class="sidebar-divider"></div>
            <div class="sidebar-links">
              <NuxtLink to="/disclaimer" class="sidebar-link oi-xs">Financial Disclaimer →</NuxtLink>
              <NuxtLink to="/terms" class="sidebar-link oi-xs">Terms of Use →</NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Privacy Policy — INDEX // STUDY',
  meta: [
    { name: 'description', content: 'Zero telemetry privacy policy for INDEX // STUDY. No tracking cookies, no accounts, 100% local storage.' }
  ]
})
</script>

<style scoped>
.legal-page {
  padding-top: var(--oi-s6);
  padding-bottom: var(--oi-s8);
}

.legal-meta {
  display: flex;
  align-items: center;
  gap: var(--oi-s3);
  margin-bottom: var(--oi-s3);
  flex-wrap: wrap;
}

.back-link {
  color: var(--oi-ink-2);
  transition: color var(--oi-dur) var(--oi-ease);
}

.back-link:hover {
  color: var(--oi-ink);
}

.legal-header {
  margin-bottom: var(--oi-s5);
  max-width: 900px;
}

.legal-header .oi-display {
  margin-bottom: var(--oi-s2);
}

.privacy-pillars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--oi-s4);
  margin-bottom: var(--oi-s6);
}

@media (max-width: 768px) {
  .privacy-pillars {
    grid-template-columns: 1fr;
  }
}

.pillar-card {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s2);
}

.pillar-icon {
  font-size: 1.2rem;
  color: var(--oi-green);
}

.pillar-title {
  color: var(--oi-ink);
  letter-spacing: 0.08em;
}

.legal-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--oi-s6);
  align-items: start;
}

@media (max-width: 980px) {
  .legal-grid {
    grid-template-columns: 1fr;
  }
}

.legal-content {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s5);
}

.legal-section {
  padding: var(--oi-s5);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.section-badge {
  color: var(--oi-ink-3);
  letter-spacing: 0.12em;
}

.code-tag {
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.85em;
  color: var(--oi-ink);
}

.storage-table-wrapper {
  overflow-x: auto;
  margin: var(--oi-s2) 0;
  border: 1px solid var(--oi-hairline);
  border-radius: 4px;
}

.trademark-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.trademark-table th {
  background-color: var(--oi-canvas);
  color: var(--oi-ink-2);
  padding: 10px 14px;
  border-bottom: 1px solid var(--oi-hairline);
  font-weight: 500;
}

.trademark-table td {
  padding: 8px 14px;
  border-bottom: 1px solid var(--oi-hairline);
  color: var(--oi-ink);
}

.trademark-table tr:last-child td {
  border-bottom: none;
}

.legal-list {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: var(--oi-s2);
  color: var(--oi-ink-2);
}

.legal-sidebar {
  position: sticky;
  top: 90px;
}

.sidebar-card {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.summary-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--oi-ink-2);
}

.dot-bullet {
  color: var(--oi-green);
  margin-right: 6px;
}

.sidebar-divider {
  height: 1px;
  background-color: var(--oi-hairline);
  margin: var(--oi-s1) 0;
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s2);
}

.sidebar-link {
  color: var(--oi-ink-2);
  transition: color var(--oi-dur) var(--oi-ease);
}

.sidebar-link:hover {
  color: var(--oi-ink);
}
</style>
