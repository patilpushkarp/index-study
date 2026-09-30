<template>
  <div class="compare-page">
    <div class="oi-container">
      <!-- Header -->
      <section class="compare-header">
        <span class="meta-tag font-mono oi-xs">// 02. COMPARATIVE ANALYTICS STUDIO</span>
        <h1 class="oi-display">
          Compare Global Indices, <span class="oi-serif">normalized to base 100.</span>
        </h1>
        <p class="oi-body">
          Cross-market performance evaluation. Compare up to 5 major benchmarks side-by-side to assess relative strength, risk-adjusted returns, valuation spreads, and risk profiles.
        </p>

        <!-- Suite Sub-Navigation Bar -->
        <div class="suite-tabs-nav">
          <NuxtLink to="/compare" class="oi-pill is-active">
            Normalized Performance (Base 100)
          </NuxtLink>
          <NuxtLink to="/correlation" class="oi-pill">
            Correlation Matrix (NxN) ↗
          </NuxtLink>
          <NuxtLink to="/crisis" class="oi-pill">
            Crisis Stress Lab ↗
          </NuxtLink>
        </div>
      </section>

      <!-- Preset Quick Baskets -->
      <section class="preset-baskets-bar oi-card-box">
        <span class="preset-label font-mono oi-xs">PRESET COMPARISON BASKETS:</span>
        <div class="preset-pills">
          <button
            v-for="b in presetBaskets"
            :key="b.label"
            class="oi-pill"
            @click="applyPreset(b.ids)"
          >
            {{ b.label }}
          </button>
        </div>
      </section>

      <!-- Index Selection Bar -->
      <section class="selector-section oi-card-box">
        <div class="selector-header">
          <span class="selector-label font-mono oi-xs">SELECT UP TO 5 BENCHMARKS ({{ selectedIds.length }}/5 SELECTED):</span>
          <button class="oi-pill oi-xs" @click="resetSelection">
            Reset Default
          </button>
        </div>
        <div class="selector-pills">
          <button
            v-for="idx in globalIndices"
            :key="idx.id"
            class="oi-pill"
            :class="{ 'is-active': selectedIds.includes(idx.id) }"
            @click="toggleSelection(idx.id)"
          >
            <span>{{ idx.flag }}</span>
            <span>{{ idx.shortName }}</span>
          </button>
        </div>
      </section>

      <!-- Normalized Performance Chart -->
      <section class="chart-box oi-card-box">
        <div class="chart-header">
          <div class="chart-title-group">
            <h3 class="oi-h3">Normalized Relative Performance (Base 100)</h3>
            <div class="timeframe-pills">
              <button
                v-for="tf in availableTimeframes"
                :key="tf"
                class="oi-pill"
                :class="{ 'is-active': selectedTimeframe === tf }"
                @click="selectedTimeframe = tf"
              >
                {{ tf }}
              </button>
            </div>
          </div>

          <!-- Legend -->
          <div class="chart-legend">
            <div
              v-for="(item, i) in selectedIndexObjects"
              :key="item.id"
              class="legend-item"
            >
              <span class="legend-color-line" :style="{ backgroundColor: palette[i % palette.length] }"></span>
              <span class="legend-name oi-sm font-mono">
                {{ item.flag }} {{ item.shortName }} ({{ getPeriodReturn(item) >= 0 ? '+' : '' }}{{ getPeriodReturn(item) }}%)
              </span>
            </div>
          </div>
        </div>

        <!-- Apache ECharts Multi-Line Normalized Studio -->
        <div class="echarts-compare-viewport">
          <div ref="compareChartRef" class="echarts-compare-dom"></div>
        </div>
      </section>

      <!-- Side-by-Side Metric Comparison Table -->
      <section class="comparison-table-section oi-card-box">
        <div class="table-title-row">
          <div class="title-group">
            <h3 class="oi-h3">Metric & Risk Comparison Matrix</h3>
            <span class="meta-tag font-mono oi-xs">VALUATION, VOLATILITY, SHARPE & RISK RATIOS</span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="matrix-table">
            <thead>
              <tr class="font-mono oi-xs">
                <th>METRIC / ATTRIBUTE</th>
                <th v-for="(item, i) in selectedIndexObjects" :key="item.id">
                  <span class="table-th-pill" :style="{ borderLeftColor: palette[i % palette.length] }">
                    {{ item.flag }} {{ item.shortName }}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Quotes -->
              <tr>
                <td class="metric-key font-mono oi-xs">CURRENT LEVEL</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="num-tabular font-mono">
                  {{ item.currency }} {{ item.currentLevel.toLocaleString() }}
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">24H CHANGE</td>
                <td
                  v-for="item in selectedIndexObjects"
                  :key="item.id"
                  class="num-tabular font-mono"
                  :class="item.change >= 0 ? 'is-pos' : 'is-neg'"
                >
                  {{ item.changePercent >= 0 ? '+' : '' }}{{ item.changePercent.toFixed(2) }}%
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">1-YEAR RETURN</td>
                <td
                  v-for="item in selectedIndexObjects"
                  :key="item.id"
                  class="num-tabular font-mono"
                  :class="item.performance['1Y'] >= 0 ? 'is-pos' : 'is-neg'"
                >
                  {{ item.performance['1Y'] >= 0 ? '+' : '' }}{{ item.performance['1Y'] }}%
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">3-YEAR RETURN</td>
                <td
                  v-for="item in selectedIndexObjects"
                  :key="item.id"
                  class="num-tabular font-mono"
                  :class="item.performance['3Y'] >= 0 ? 'is-pos' : 'is-neg'"
                >
                  {{ item.performance['3Y'] >= 0 ? '+' : '' }}{{ item.performance['3Y'] }}%
                </td>
              </tr>

              <!-- Phase 3 Advanced Risk Metrics -->
              <tr class="row-section-divider">
                <td colspan="6" class="font-mono oi-xs oi-muted">// RISK & VOLATILITY ANALYTICS</td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">ANNUALIZED VOLATILITY (σ)</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="num-tabular font-mono">
                  {{ getVolatility(item) }}%
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">SHARPE RATIO (Rf = {{ riskFreeRate.toFixed(2) }}%)</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="num-tabular font-mono">
                  {{ getSharpeRatio(item) }}
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">BETA (VS S&P 500)</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="num-tabular font-mono">
                  {{ getBeta(item.id) }}
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">CORRELATION WITH S&P 500</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="num-tabular font-mono">
                  {{ getCorrelationWithSP500(item.id) }}
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">DRAWDOWN FROM ATH</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="num-tabular font-mono is-neg">
                  {{ item.drawdownFromATH }}%
                </td>
              </tr>

              <!-- Valuations -->
              <tr class="row-section-divider">
                <td colspan="6" class="font-mono oi-xs oi-muted">// VALUATION MULTIPLES</td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">TRAILING P/E</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="num-tabular font-mono">
                  {{ item.valuations.peRatio }}x
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">FORWARD P/E</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="num-tabular font-mono">
                  {{ item.valuations.forwardPE }}x
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">DIVIDEND YIELD</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="num-tabular font-mono">
                  {{ item.valuations.dividendYield }}%
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">PRICE TO BOOK</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="num-tabular font-mono">
                  {{ item.valuations.pbRatio }}x
                </td>
              </tr>

              <!-- Profile & Macro -->
              <tr class="row-section-divider">
                <td colspan="6" class="font-mono oi-xs oi-muted">// CHARACTERISTICS & MACRO</td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">CONSTITUENTS COUNT</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="num-tabular font-mono">
                  {{ item.constituentsCount }}
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">EST. MARKET CAP (USD)</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="font-mono">
                  {{ item.marketCapUSD }}
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">WEIGHTING METHOD</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="oi-xs">
                  {{ item.weightingType }}
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">CENTRAL BANK POLICY RATE</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="num-tabular font-mono">
                  {{ item.macro.policyRate }}%
                </td>
              </tr>
              <tr>
                <td class="metric-key font-mono oi-xs">10Y SOVEREIGN BOND YIELD</td>
                <td v-for="item in selectedIndexObjects" :key="item.id" class="num-tabular font-mono">
                  {{ item.macro.sovereignYield10Y }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { globalIndices, type IndexData } from '~/data/indices'
import { getCorrelation } from '~/data/correlations'

// Selected up to 5 major global benchmarks
const selectedIds = ref<string[]>(['sp500', 'nasdaq100', 'nifty50', 'nikkei225', 'dax40'])

const availableTimeframes = ['1M', '6M', '1Y', '5Y', 'ALL']
const selectedTimeframe = ref<string>('1Y')

const palette = [
  '#00e200', // Khasiyev emerald
  '#2D68FF', // cobalt blue
  '#FFB020', // gold amber
  '#A855F7', // violet
  '#EC4899'  // rose
]

const presetBaskets = [
  { label: 'Global Megacaps', ids: ['sp500', 'nasdaq100', 'nifty50', 'nikkei225', 'dax40'] },
  { label: 'Indo-Pacific Engines', ids: ['nifty50', 'sensex', 'nikkei225', 'hangseng', 'asx200'] },
  { label: 'Transatlantic Core', ids: ['sp500', 'djia', 'ftse100', 'dax40', 'cac40'] },
  { label: 'Emerging Frontiers', ids: ['bovespa', 'tasi', 'jse40', 'csi300', 'nifty50'] }
]

function applyPreset(ids: string[]) {
  selectedIds.value = [...ids]
}

function resetSelection() {
  selectedIds.value = ['sp500', 'nasdaq100', 'nifty50', 'nikkei225', 'dax40']
}

const selectedIndexObjects = computed(() => {
  return selectedIds.value
    .map(id => globalIndices.find(idx => idx.id === id))
    .filter((idx): idx is IndexData => !!idx)
})

function toggleSelection(id: string) {
  if (selectedIds.value.includes(id)) {
    if (selectedIds.value.length > 1) {
      selectedIds.value = selectedIds.value.filter(i => i !== id)
    }
  } else {
    if (selectedIds.value.length < 5) {
      selectedIds.value.push(id)
    } else {
      // Replace last item
      selectedIds.value = [...selectedIds.value.slice(1), id]
    }
  }
}

function getPeriodReturn(item: IndexData): number {
  if (selectedTimeframe.value === '1M') return item.performance['1M']
  if (selectedTimeframe.value === '6M') return item.performance['6M']
  if (selectedTimeframe.value === '1Y') return item.performance['1Y']
  if (selectedTimeframe.value === '5Y') return item.performance['5Y']
  return item.performance['10Y'] || item.performance['5Y']
}

// ==========================================
// Apache ECharts Base-100 Comparison Studio
// ==========================================
import { useECharts } from '~/composables/useECharts'
import { watch, onMounted, nextTick } from 'vue'

const compareChartRef = ref<HTMLElement | null>(null)
const { setOption: setCompareOption } = useECharts(compareChartRef)

function updateCompareChart() {
  const tf = selectedTimeframe.value as keyof IndexData['timeSeries']
  const indices = selectedIndexObjects.value
  if (!indices.length) return

  let masterDates: string[] = []
  indices.forEach(idx => {
    const raw = idx.timeSeries[tf] || idx.timeSeries['1Y'] || []
    if (raw.length > masterDates.length) {
      masterDates = raw.map(p => p.date)
    }
  })

  const series = indices.map((idx, i) => {
    const raw = idx.timeSeries[tf] || idx.timeSeries['1Y'] || []
    const baseVal = raw[0]?.value || 1
    const data = raw.map(p => {
      const norm = (p.value / baseVal) * 100
      return Number(norm.toFixed(2))
    })

    return {
      name: `${idx.flag} ${idx.shortName}`,
      type: 'line',
      smooth: 0.18,
      symbol: 'none',
      data,
      lineStyle: {
        width: 2.2,
        color: palette[i % palette.length]
      },
      itemStyle: {
        color: palette[i % palette.length]
      }
    }
  })

  const option: any = {
    animationDuration: 550,
    animationEasing: 'cubicOut',
    grid: {
      top: 32,
      left: 12,
      right: 24,
      bottom: 58,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#241f1a',
          fontFamily: 'Fragment Mono, monospace',
          color: '#ffffff',
          fontSize: 11
        },
        lineStyle: {
          color: '#87817a',
          type: 'dashed'
        }
      },
      formatter: (params: any[]) => {
        if (!params || !params.length) return ''
        const dateStr = params[0].axisValue
        const sorted = [...params]
          .filter(p => p.seriesName !== 'Base 100')
          .sort((a, b) => (b.value || 0) - (a.value || 0))

        let html = `
          <div style="font-family: 'General Sans', sans-serif; min-width: 220px;">
            <div style="font-family: 'Fragment Mono', monospace; font-size: 11px; color: #8c8177; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #2f2a24;">
              ${dateStr} · BASE 100 NORMALIZED
            </div>
        `
        sorted.forEach(p => {
          const val = p.value || 100
          const delta = val - 100
          const deltaColor = delta >= 0 ? '#00e200' : '#ff5f53'
          html += `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 4px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 2px; background: ${p.color};"></span>
                <span style="font-size: 12px; color: #ffffff; font-weight: 500;">${p.seriesName}</span>
              </div>
              <div style="font-family: 'Fragment Mono', monospace; font-size: 12px; font-variant-numeric: tabular-nums;">
                <span style="color: #ffffff;">${val.toFixed(1)}</span>
                <span style="color: ${deltaColor}; font-weight: 600; margin-left: 4px;">(${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%)</span>
              </div>
            </div>
          `
        })
        html += `</div>`
        return html
      }
    },
    xAxis: {
      type: 'category',
      data: masterDates,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#2f2a24' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#87817a',
        fontFamily: 'Fragment Mono, monospace',
        fontSize: 10.5,
        formatter: (val: string) => {
          const parts = val.split('-')
          if (parts.length === 3) {
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
            return `${parts[2]} ${months[parseInt(parts[1], 10) - 1]}`
          }
          return val
        }
      }
    },
    yAxis: {
      type: 'value',
      scale: true,
      position: 'right',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(47, 42, 36, 0.45)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#87817a',
        fontFamily: 'Fragment Mono, monospace',
        fontSize: 10.5,
        formatter: (v: number) => `${v.toFixed(0)}`
      }
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        realtime: true,
        start: 0,
        end: 100,
        height: 20,
        bottom: 8,
        borderColor: '#2f2a24',
        backgroundColor: '#0b0806',
        fillerColor: 'rgba(255, 255, 255, 0.08)',
        handleStyle: {
          color: '#ffffff',
          borderColor: '#2f2a24'
        },
        textStyle: {
          color: '#87817a',
          fontFamily: 'Fragment Mono, monospace',
          fontSize: 9.5
        }
      },
      {
        type: 'inside',
        zoomOnMouseWheel: true
      }
    ],
    series: [
      ...series,
      {
        name: 'Base 100',
        type: 'line',
        data: [],
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: 'rgba(140, 129, 119, 0.5)',
            type: 'dashed',
            width: 1
          },
          data: [
            {
              yAxis: 100,
              label: {
                show: true,
                position: 'insideStartTop',
                formatter: 'BASE 100',
                fontFamily: 'Fragment Mono, monospace',
                fontSize: 9.5,
                color: '#87817a'
              }
            }
          ]
        }
      }
    ]
  }

  setCompareOption(option, true)
}

watch([selectedIndexObjects, selectedTimeframe], () => {
  nextTick(updateCompareChart)
}, { deep: true })

onMounted(() => {
  nextTick(updateCompareChart)
})

// Risk Metrics & Real Statistical Computations
import macroLive from '~/data/generated/macro_live.json'

const riskFreeRate = computed(() => {
  if (macroLive && typeof (macroLive as any).us10YYield === 'number') {
    return (macroLive as any).us10YYield
  }
  return 4.35
})

function getVolatility(item: IndexData): string {
  if (typeof item.volatility === 'number') {
    return item.volatility.toFixed(1)
  }
  const pts = item.timeSeries['1Y'] || []
  if (pts.length >= 20) {
    const rets = []
    for (let i = 1; i < pts.length; i++) {
      rets.push((pts[i].value - pts[i - 1].value) / pts[i - 1].value)
    }
    const mean = rets.reduce((a, b) => a + b, 0) / rets.length
    const variance = rets.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (rets.length - 1)
    const annVol = Math.sqrt(variance) * Math.sqrt(252) * 100
    return annVol.toFixed(1)
  }
  return '15.0'
}

function getSharpeRatio(item: IndexData): string {
  const vol = parseFloat(getVolatility(item))
  const ret = item.performance['1Y']
  const rf = riskFreeRate.value
  if (vol > 0) {
    const sharpe = (ret - rf) / vol
    return sharpe.toFixed(2)
  }
  return '0.00'
}

function getBeta(id: string): string {
  if (id === 'sp500') return '1.00'
  const item = globalIndices.find(i => i.id === id)
  if (item && typeof item.beta === 'number') {
    return item.beta.toFixed(2)
  }

  // Dynamic covariance / variance calculation vs S&P 500
  const sp500 = globalIndices.find(i => i.id === 'sp500')
  if (item && sp500) {
    const ptsI = item.timeSeries['1Y'] || []
    const ptsS = sp500.timeSeries['1Y'] || []
    if (ptsI.length >= 20 && ptsS.length >= 20) {
      const dateMapS = new Map(ptsS.map(p => [p.date, p.value]))
      const pairs: [number, number][] = []
      for (let i = 1; i < ptsI.length; i++) {
        const p0 = dateMapS.get(ptsI[i - 1].date)
        const p1 = dateMapS.get(ptsI[i].date)
        if (p0 && p1 && p0 > 0) {
          const rI = (ptsI[i].value - ptsI[i - 1].value) / ptsI[i - 1].value
          const rS = (p1 - p0) / p0
          pairs.push([rI, rS])
        }
      }
      if (pairs.length >= 10) {
        const meanI = pairs.reduce((sum, p) => sum + p[0], 0) / pairs.length
        const meanS = pairs.reduce((sum, p) => sum + p[1], 0) / pairs.length
        let cov = 0
        let varS = 0
        pairs.forEach(p => {
          cov += (p[0] - meanI) * (p[1] - meanS)
          varS += Math.pow(p[1] - meanS, 2)
        })
        if (varS > 0) return (cov / varS).toFixed(2)
      }
    }
  }
  return '0.85'
}

function getCorrelationWithSP500(id: string): string {
  if (id === 'sp500') return '1.00 (Self)'
  const r = getCorrelation(id, 'sp500', '1Y')
  return `r = ${r.toFixed(2)}`
}

useHead({
  title: 'Compare Global Stock Market Indices — INDEX // STUDY',
  meta: [
    { name: 'description', content: 'Compare global equity indices normalized to base 100: S&P 500, Nifty 50, Nikkei 225, DAX 40 and more.' }
  ]
})
</script>

<style scoped>
.compare-page {
  padding-top: var(--oi-s5);
  padding-bottom: var(--oi-s7);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s5);
}

.compare-header {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.suite-tabs-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.preset-baskets-bar {
  padding: var(--oi-s3);
  display: flex;
  align-items: center;
  gap: var(--oi-s3);
  flex-wrap: wrap;
}

.preset-label {
  color: var(--oi-ink-3);
}

.preset-pills {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.selector-section {
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s2);
}

.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.selector-label {
  color: var(--oi-ink-3);
}

.selector-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chart-box {
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s3);
}

.chart-title-group {
  display: flex;
  align-items: center;
  gap: var(--oi-s3);
  flex-wrap: wrap;
}

.timeframe-pills {
  display: flex;
  gap: 4px;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: var(--oi-s3);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color-line {
  width: 14px;
  height: 3px;
  border-radius: 2px;
}

.echarts-compare-viewport {
  width: 100%;
  height: 420px;
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r);
  overflow: hidden;
  position: relative;
}

.echarts-compare-dom {
  width: 100%;
  height: 100%;
}

.comparison-table-section {
  padding: var(--oi-s3);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.table-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.matrix-table th,
.matrix-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--oi-hairline);
}

.matrix-table th {
  color: var(--oi-ink-2);
  font-weight: 500;
}

.table-th-pill {
  border-left: 3px solid transparent;
  padding-left: 6px;
  display: inline-block;
}

.metric-key {
  color: var(--oi-ink-3);
  width: 260px;
}

.matrix-table tr:hover td {
  background-color: var(--oi-card-hover);
}

.row-section-divider td {
  background-color: rgba(255, 255, 255, 0.02);
  padding: 6px 14px;
  border-top: 1px solid var(--oi-hairline);
}

.is-pos {
  color: var(--oi-green);
}

.is-neg {
  color: var(--oi-loss);
}
</style>
