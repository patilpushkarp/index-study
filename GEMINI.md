# Global Index Study — Project Architecture & Developer Guide

## 1. Project Overview & Mission
**Global Index Study** (`index-study`) is an institutional-grade, static web application built with **Nuxt 4** that tracks, visualizes, and analyzes 18 major worldwide equity indices across the Americas, Europe, Asia-Pacific, and Emerging Markets.

The application is engineered for zero-dependency static deployment on **GitHub Pages** via automated GitHub Actions (`.github/workflows/deploy.yml`).

---

## 2. Design System & Aesthetic Constraints (Khasiyev System)
The UI strictly adheres to the visual design language of **[khasiyev.com](https://khasiyev.com/)**—an editorial design-engineering aesthetic featuring warm dark obsidian surfaces, disciplined hairline dividers, and high-fashion serif accents.

### Core Color Palette Tokens
| CSS Token | Hex / Value | Purpose |
|---|---|---|
| `--oi-canvas` | `#181411` | Warm espresso obsidian canvas background |
| `--oi-card` | `#0b0806` | Deep obsidian card surface |
| `--oi-card-hover` | `#14100c` | Elevated card hover state |
| `--oi-hairline` | `#2f2a24` | Warm hairline borders (0.5px / 1px) |
| `--oi-btn` | `#241f1a` | Button surface background |
| `--oi-btn-hover` | `#3b352e` | Button hover background |
| `--oi-ink` | `#ffffff` | High-contrast pure white primary text |
| `--oi-ink-2` | `#8c8177` | Warm sand secondary text |
| `--oi-ink-3` | `#87817a` | Muted tertiary text and metadata tags |
| `--oi-invert-bg` | `#ffffff` | Active pill & white button background |
| `--oi-invert-ink` | `#000000` | Inverted text color on white pills/buttons |
| `--oi-green` | `#00e200` | Signature vibrant green pulsing status beacon |
| `--oi-loss` | `#ff5f53` | Soft crimson for negative price deltas |
| `--oi-warning` | `#ffb020` | Amber gold for watchlists and warnings |

### Typography Hierarchy
1. **Primary Headings & Body (`--font-heading`, `--font-body`)**: **General Sans** (Variable sans-serif by Fontshare).
   - All financial figures, prices, and tables must use `.num-tabular` (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter.
2. **Editorial Serif Accent (`--font-accent`)**: **Instrument Serif / PP Editorial New Italic** (`.oi-serif`).
   - Used for editorial styling and emphasis words in headlines (e.g. `World Markets in Real-Time`).
3. **Telemetry & Code (`--font-mono`)**: **Fragment Mono** (`.font-mono`).
   - Tabular, minimal, disciplined technical monospace.
4. **CRITICAL RULE**: **Strictly ZERO JetBrains Mono** anywhere in CSS, HTML, components, or dependencies.

### Screen Utilization & Geometry
- **Screen Utilization**: The application utilizes **100% of the screen width** (`--container-max: 100%`) with fluid responsive lateral gutters (`clamp(14px, 2.5vw, 36px)`), allowing dashboards, multi-line charts, and matrices to scale across ultrawide, desktop, tablet, and mobile viewports.
- **Pills (`.oi-pill`)**: Height `26px`, border-radius `3.2px`, padding `0 10px`, font size `12.5px`.
- **Buttons (`.oi-btn`)**: Border-radius `4.8px`, padding `8px 14px`, subtle press animation.
- **Beacon (`.oi-dot`)**: 6px pulsing dot with green radar glow.

---

## 3. Architecture & Application Routes

### Core Pages (`app/pages/`)
| Route | Page File | Purpose |
|---|---|---|
| `/` | `app/pages/index.vue` | Real-time global dashboard, pulse summary cards, search bar, regional filter tabs, and Pinned Watchlist view. |
| `/compare` | `app/pages/compare.vue` | Comparative analytics studio: overlays up to 5 indices on an Apache ECharts Base-100 normalized chart with synchronized crosshairs, timeline scrub slider, and risk metrics (Sharpe, Volatility, Beta). |
| `/valuations` | `app/pages/valuations.vue` | Global Valuations Matrix & interactive Apache ECharts 2D scatter plot mapping Trailing P/E vs Dividend Yield across all 18 benchmarks. |
| `/correlation` | `app/pages/correlation.vue` | Pairwise Pearson NxN Correlation Heatmap across 3M, 1Y, 3Y, and 5Y windows with deep-dive pair inspection drawer. |
| `/crisis` | `app/pages/crisis.vue` | Historical Crisis Drawdowns & Stress Lab (2000 Dot-com, 2008 Lehman GFC, 2020 COVID, 2022 Inflation) and Macro Shock Simulator. |
| `/macro` | `app/pages/macro.vue` | Central Banks Policy Board, 10Y Sovereign Yields, Equity Risk Premium (ERP) Analyzer, and Currency Drag & FX Impact Engine. |
| `/screen` | `app/pages/screen.vue` | Multi-Factor Index Screener with P/E, Div Yield, and 1Y return sliders, multi-column sorting, and client-side CSV/JSON export. |
| `/learn` | `app/pages/learn.vue` | Educational Knowledge Base & Interactive Weighting Methodology Simulator (Free-Float vs Price-Weighted vs Equal-Weighted). |
| `/indices/:id` | `app/pages/indices/[id].vue` | Comprehensive single-index deep dive (18 global benchmarks) with 10Y P/E valuation bands, SVG sector donut, HHI concentration card, constituent points, peer correlations, and crisis track record. |
| `/404` | `app/pages/404.vue` | Static fallback page compatible with GitHub Pages client-side routing. |

---

## 4. Key Composables & Data Layer
- **`app/data/indices.ts`**: Master registry of 18 global indices with quotes, historical series (1D, 1W, 1M, 6M, 1Y, 5Y, ALL), valuations, sectors, and constituents.
- **`app/data/correlations.ts`**: Symmetrical NxN correlation matrices, time horizon modifiers (3M–5Y), and diversification benefit classifiers.
- **`app/data/crisisDrawdowns.ts`**: Historical peak-to-trough drawdowns, days to trough, recovery periods, and hypothetical macro shock scenarios.
- **`app/data/macro.ts`**: 11 central banks, 10Y sovereign yields, Equity Risk Premium calculations, currency cross-multipliers, and governance review calendars.
- **`app/composables/useMarketStatus.ts`**: Live UTC and local exchange clocks calculating active trading state (`OPEN`, `CLOSED`, `PRE-MARKET`, `WEEKEND`) with countdown timers.
- **`app/composables/useCurrencyConverter.ts`**: Real-time currency conversions between Local Currency, USD ($), EUR (€), INR (₹), and GBP (£).
- **`app/composables/useWatchlist.ts`**: Personal watchlist management persisted in browser `localStorage`.
- **`app/utils/exportData.ts`**: Client-side CSV and JSON export generator.

---

## 5. Development & Build Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server (with HMR)
npm run dev

# 3. Static Generation for GitHub Pages
npm run generate

# 4. Preview pre-rendered static build
npm run preview
# or
npx serve .output/public
```

---

## 6. Static GitHub Pages Deployment Pipeline
- Static generation is enabled via `ssr: false` in `nuxt.config.ts`.
- Subpath routing is automatically handled via `app.baseURL: process.env.NUXT_APP_BASE_URL || '/'`.
- All 30 routes are explicitly pre-rendered into `.output/public` in ~0.5 seconds.
- GitHub Actions workflow located in `.github/workflows/deploy.yml` builds and deploys to GitHub Pages upon push to `main`.
- **User Guideline**: Do not commit or deploy to git without explicit user confirmation.

---

## 7. Zero-API-Key Market Data Ingestion Pipeline
- **Script**: `scripts/sync_market_data.py` (runnable via `uv run --python 3.13 --with yfinance --with requests scripts/sync_market_data.py`).
- **Free Keyless Sources**:
  - Global Index Quotes & 1Y History: Yahoo Finance Public Chart API (`yfinance`).
  - Foreign Exchange Rates: European Central Bank via Frankfurter API (`api.frankfurter.dev`).
  - 10Y Sovereign Yields: Yahoo Finance Treasury Ticker (`^TNX`).
  - ETF Valuations & Proxy Tracking: SPY, QQQ, DIA, IWM, ASHR, KSA, INDA, etc.
- **Scheduled Synchronization**: `.github/workflows/sync_market_data.yml` runs Monday–Friday at 21:00 UTC (after US/European close) using GitHub Actions free minutes, requiring **zero repository secrets**.
- **Generated Outputs**:
  - `app/data/generated/indices_live.json`: Live quotes, 52W ranges, sparklines, and 1Y series.
  - `app/data/generated/macro_live.json`: Live ECB FX rates and US 10Y Treasury yield.
  - `app/data/generated/sync_metadata.json`: Run status, timestamps, and benchmark count.

---

## 8. Charting Architecture (Apache ECharts & Khasiyev Visual Engine)
- **Engine**: **Apache ECharts** (`echarts`) with tree-shaken core modules via `app/composables/useECharts.ts`.
- **Khasiyev Obsidian Theme**:
  - Registered globally as theme `'khasiyev'`.
  - Palette: `#00e200` (emerald), `#38bdf8` (sapphire), `#fbbf24` (amber), `#c084fc` (lilac), `#f43f5e` (coral).
  - Background: transparent over obsidian card `#0b0806`.
  - Tooltips: blurred obsidian glass (`rgba(11, 8, 6, 0.94)`), hairline border (`#2f2a24`), tabular typography.
- **Components Powered by ECharts**:
  1. `InteractiveChart.vue` (`/indices/:id`): Dynamic spline area & technical line modes, timeline scrub slider (`dataZoom`), magnetic crosshairs, benchmark high/low callouts.
  2. `compare.vue` (`/compare`): Multi-series Base-100 normalized overlay with synchronized crosshair tooltips, timeline range scrub, and interactive legend toggle.
  3. `valuations.vue` (`/valuations`): Interactive 2D scatter matrix (P/E vs Dividend Yield) with regional bubble clustering, institutional quadrant watermarks, and zoom/pan.
  4. `SectorDonut.vue` (`/indices/:id`): Donut pie chart with hover slice expansion, center readout, and bi-directional legend interaction.
