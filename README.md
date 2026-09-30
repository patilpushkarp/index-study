# Global Index Study — Institutional Stock Market Analytics

> An institutional-grade, static web application tracking, visualizing, and analyzing 18 major worldwide equity indices across the Americas, Europe, Asia-Pacific, and Emerging Markets.

[![Deploy to GitHub Pages](https://github.com/patilpushkarp/index-study/actions/workflows/deploy.yml/badge.svg)](https://github.com/patilpushkarp/index-study/actions/workflows/deploy.yml)
[![Market Data Synchronization](https://github.com/patilpushkarp/index-study/actions/workflows/sync_market_data.yml/badge.svg)](https://github.com/patilpushkarp/index-study/actions/workflows/sync_market_data.yml)

---

## 🏛️ Live Demonstration
Experience the platform live on GitHub Pages:
**[https://patilpushkarp.github.io/index-study/](https://patilpushkarp.github.io/index-study/)**

---

## ✦ Key Capabilities

- **Real-Time Global Dashboard**: Comprehensive multi-region pulse (Americas, Europe, Asia-Pacific, Emerging Markets) with live market clocks (UTC, EST, GMT, IST, JST) and trading state detection.
- **Advanced Interactive Charting (Apache ECharts)**: Area spline & line views, timeline scrubbing (`dataZoom`), synchronized crosshairs, and benchmark high/low callouts.
- **Comparative Studio (`/compare`)**: Base-100 normalized multi-series overlay across up to 5 indices with risk metrics (Sharpe ratio linked to live US 10Y Treasury yield, Beta vs S&P 500, annualized volatility).
- **Valuation Matrix & 2D Scatter (`/valuations`)**: Interactive Trailing P/E vs. Dividend Yield scatter plot with regional bubble clustering, quadrant watermarks, and zoom/pan.
- **NxN Pearson Correlation Heatmap (`/correlation`)**: Symmetrical correlation matrix across 3M, 1Y, 3Y, and 5Y horizons with deep-dive pair inspection.
- **Historical Crisis Lab (`/crisis`)**: Stress-testing across Dot-com (2000), Lehman GFC (2008), COVID crash (2020), and 2022 Inflation shocks, plus a real-time Macro Shock Simulator.
- **Central Banks & Macro Policy (`/macro`)**: Policy rate board (Fed, ECB, BOJ, RBI, PBOC, BOE), 10Y sovereign yield curves, Equity Risk Premium (ERP) modeling, and FX currency drag engine.
- **Multi-Factor Screener (`/screen`)**: Filter by valuation, dividend yield, and multi-horizon returns with instant CSV/JSON client-side export.
- **Constituent & Sector Breakdown (`/indices/:id`)**: Single-index deep dives featuring 10-year P/E valuation bands, SVG/ECharts sector donut, and constituent holdings.

---

## 🎨 Design Engineering (Khasiyev System)
- **Palette**: Warm espresso obsidian (`#181411` canvas, `#0b0806` cards, `#2f2a24` hairlines, `#00e200` emerald beacon).
- **Typography**:
  - Headings & Body: **General Sans** (with tabular numerals `font-variant-numeric: tabular-nums`).
  - Editorial Accents: **Instrument Serif / PP Editorial New Italic**.
  - Telemetry: **Fragment Mono**.
  - *Strictly ZERO JetBrains Mono*.
- **Screen Geometry**: 100% viewport width utilization with fluid lateral clamp gutters (`clamp(14px, 2.5vw, 36px)`).

---

## ⚡ Zero-API-Key Market Ingestion Pipeline
Market data updates automatically without requiring paid API keys or repository secrets:
- **Index Quotes & 5Y History**: Yahoo Finance public market chart API via `yfinance`.
- **Foreign Exchange Rates**: European Central Bank reference rates via Frankfurter API.
- **10Y Sovereign Yields**: Free US Treasury ticker (`^TNX`).
- **Scheduled Sync**: `.github/workflows/sync_market_data.yml` runs Monday–Friday at 21:00 UTC using GitHub Actions free minutes, committing fresh JSON to `app/data/generated/` and automatically triggering a site redeployment.

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20
- Python >= 3.12 (for market data synchronization)
- `uv` (recommended fast Python package runner)

### Installation & Local Run
```bash
# 1. Clone repository
git clone https://github.com/patilpushkarp/index-study.git
cd index-study

# 2. Install dependencies
npm install

# 3. Start local development server with HMR
npm run dev

# 4. (Optional) Run market data ingestion locally
uv run --python 3.13 --with yfinance --with requests --with pandas --with numpy scripts/sync_market_data.py
```

### Static Build & Preview
```bash
# Static pre-rendering (all 33 routes)
npm run generate

# Preview generated static build
npx serve .output/public
```

---

## 📄 License & Disclaimer
This project is open-source under the MIT License. Market data and analytics are provided for informational and educational purposes only and do not constitute financial or investment advice.
