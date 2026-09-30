<template>
  <div class="valuations-page">
    <div class="oi-container">
      <!-- Header -->
      <section class="val-header-sec">
        <span class="meta-tag font-mono oi-xs">// 05. GLOBAL VALUATION MATRIX & SCATTER MAP</span>
        <h1 class="oi-display">
          Global Valuations, <span class="oi-serif">multiples & yield spreads.</span>
        </h1>
        <p class="oi-body">
          Cross-sectional macro valuation intelligence. Plotting {{ globalIndices.length }} global stock market indices on price-to-earnings and dividend yield dimensions against historical standard deviation bands.
        </p>
      </section>

      <!-- 2D Valuation Scatter Plot -->
      <section class="scatter-card oi-card-box">
        <div class="scatter-header">
          <div class="title-meta">
            <h3 class="oi-h3">Global Valuation Map: P/E vs. Dividend Yield</h3>
            <span class="meta-tag font-mono oi-xs">2-DIMENSIONAL RELATIVE ATTRACTIVENESS</span>
          </div>

          <div v-if="hoveredIndex" class="active-bubble-readout font-mono oi-xs">
            <span>{{ hoveredIndex.flag }} {{ hoveredIndex.shortName }}:</span>
            <span class="num-tabular font-mono">{{ hoveredIndex.valuations.peRatio }}x P/E</span>
            <span class="num-tabular font-mono">{{ hoveredIndex.valuations.dividendYield }}% Div Yield</span>
          </div>
        </div>

        <!-- Apache ECharts 2D Scatter Canvas -->
        <div class="echarts-scatter-viewport">
          <div ref="scatterChartRef" class="echarts-scatter-dom"></div>
        </div>
      </section>

      <!-- Global Valuation Spread Ranking Matrix -->
      <section class="val-table-card oi-card-box">
        <div class="val-table-header">
          <h3 class="oi-h3">Global Valuation & Historical Spread Matrix</h3>
          <span class="meta-tag font-mono oi-xs">ALL {{ globalIndices.length }} BENCHMARKS RANKED</span>
        </div>

        <div class="table-responsive">
          <table class="val-matrix-table">
            <thead>
              <tr class="font-mono oi-xs">
                <th>INDEX</th>
                <th>REGION</th>
                <th>P/E (TTM)</th>
                <th>FORWARD P/E</th>
                <th>P/B</th>
                <th>DIV YIELD</th>
                <th>10Y MEAN P/E</th>
                <th>VALUATION SPREAD</th>
                <th>STATE</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in sortedValuations"
                :key="item.id"
                class="val-matrix-row"
              >
                <td class="td-name-cell">
                  <NuxtLink :to="`/indices/${item.id}`" class="name-link">
                    <span>{{ item.flag }}</span>
                    <span class="name-bold">{{ item.shortName }}</span>
                  </NuxtLink>
                </td>
                <td class="oi-sm oi-muted">{{ item.country }}</td>
                <td class="num-tabular font-mono oi-sm">{{ item.valuations.peRatio }}x</td>
                <td class="num-tabular font-mono oi-sm">{{ item.valuations.forwardPE }}x</td>
                <td class="num-tabular font-mono oi-sm">{{ item.valuations.pbRatio }}x</td>
                <td class="num-tabular font-mono oi-sm">{{ item.valuations.dividendYield.toFixed(2) }}%</td>
                <td class="num-tabular font-mono oi-sm oi-muted">{{ item.valuations.historicalPE.mean10Y }}x</td>
                <td class="num-tabular font-mono oi-sm" :class="item.spread >= 0 ? 'is-rich' : 'is-cheap'">
                  {{ item.spread >= 0 ? '+' : '' }}{{ item.spread.toFixed(1) }}x vs 10Y
                </td>
                <td>
                  <span
                    class="status-pill font-mono oi-xs"
                    :class="item.valuations.historicalPE.status.toLowerCase().replace(' ', '-')"
                  >
                    {{ item.valuations.historicalPE.status }}
                  </span>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { globalIndices, type IndexData } from '~/data/indices'
import { useECharts } from '~/composables/useECharts'

const hoveredIndex = ref<IndexData | null>(null)
const scatterChartRef = ref<HTMLElement | null>(null)
const { setOption: setScatterOption } = useECharts(scatterChartRef)

function updateScatterChart() {
  const regions = ['Americas', 'Europe', 'Asia-Pacific', 'Emerging'] as const
  const regionColors: Record<string, string> = {
    Americas: '#38bdf8',
    Europe: '#00e200',
    'Asia-Pacific': '#fbbf24',
    Emerging: '#c084fc'
  }

  const series = regions.map(reg => {
    const list = globalIndices.filter(i => i.region === reg)
    const data = list.map(idx => {
      return {
        name: idx.shortName,
        value: [idx.valuations.peRatio, idx.valuations.dividendYield],
        raw: idx
      }
    })

    return {
      name: reg,
      type: 'scatter',
      data,
      symbolSize: 14,
      itemStyle: {
        color: regionColors[reg],
        borderColor: '#0b0806',
        borderWidth: 2,
        shadowBlur: 10,
        shadowColor: regionColors[reg] + '40'
      },
      emphasis: {
        scale: 1.4,
        itemStyle: {
          borderColor: '#ffffff',
          borderWidth: 2.5
        }
      },
      label: {
        show: true,
        formatter: (params: any) => params.data.raw.shortName,
        position: 'right',
        distance: 8,
        color: '#ffffff',
        fontFamily: 'Fragment Mono, monospace',
        fontSize: 10.5
      }
    }
  })

  const option: any = {
    animationDuration: 600,
    animationEasing: 'cubicOut',
    grid: {
      top: 50,
      left: 20,
      right: 50,
      bottom: 44,
      containLabel: true
    },
    legend: {
      top: 14,
      right: 20,
      textStyle: {
        color: '#87817a',
        fontFamily: 'General Sans, sans-serif',
        fontSize: 12
      },
      icon: 'circle'
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(11, 8, 6, 0.94)',
      borderColor: '#2f2a24',
      borderWidth: 1,
      padding: [10, 14],
      extraCssText: 'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6); backdrop-filter: blur(10px); border-radius: 6px;',
      formatter: (params: any) => {
        const item: IndexData = params.data.raw
        const pe = item.valuations.peRatio
        const div = item.valuations.dividendYield
        const fwd = item.valuations.forwardPE
        const pb = item.valuations.pbRatio
        const status = item.valuations.historicalPE.status
        const statusColor = status === 'Undervalued' ? '#00e200' : (status === 'Overvalued' ? '#ff5f53' : '#fbbf24')

        return `
          <div style="font-family: 'General Sans', sans-serif; min-width: 220px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #2f2a24;">
              <span style="font-size: 13px; font-weight: 600; color: #ffffff;">${item.flag} ${item.name}</span>
              <span style="font-family: 'Fragment Mono', monospace; font-size: 10.5px; color: ${statusColor}; font-weight: 600;">
                ${status}
              </span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-family: 'Fragment Mono', monospace; font-size: 11px;">
              <div>
                <span style="color: #8c8177;">P/E (TTM):</span>
                <span style="color: #ffffff; font-weight: 600; margin-left: 4px;">${pe}x</span>
              </div>
              <div>
                <span style="color: #8c8177;">FWD P/E:</span>
                <span style="color: #ffffff; font-weight: 600; margin-left: 4px;">${fwd}x</span>
              </div>
              <div>
                <span style="color: #8c8177;">DIV YIELD:</span>
                <span style="color: #ffffff; font-weight: 600; margin-left: 4px;">${div.toFixed(2)}%</span>
              </div>
              <div>
                <span style="color: #8c8177;">P/B RATIO:</span>
                <span style="color: #ffffff; font-weight: 600; margin-left: 4px;">${pb}x</span>
              </div>
            </div>
            <div style="margin-top: 6px; font-family: 'Fragment Mono', monospace; font-size: 10px; color: #87817a; border-top: 1px solid #2f2a24; padding-top: 4px;">
              10Y MEAN: ${item.valuations.historicalPE.mean10Y}x (SPREAD: ${(pe - item.valuations.historicalPE.mean10Y).toFixed(1)}x)
            </div>
          </div>
        `
      }
    },
    xAxis: {
      type: 'value',
      name: 'P/E RATIO (TTM)',
      nameLocation: 'middle',
      nameGap: 28,
      nameTextStyle: {
        color: '#87817a',
        fontFamily: 'Fragment Mono, monospace',
        fontSize: 10.5
      },
      min: 6,
      max: 36,
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(47, 42, 36, 0.45)',
          type: 'dashed'
        }
      },
      axisLine: { lineStyle: { color: '#2f2a24' } },
      axisLabel: {
        color: '#87817a',
        fontFamily: 'Fragment Mono, monospace',
        fontSize: 10.5,
        formatter: '{value}x'
      }
    },
    yAxis: {
      type: 'value',
      name: 'DIVIDEND YIELD (%)',
      nameLocation: 'middle',
      nameGap: 34,
      nameTextStyle: {
        color: '#87817a',
        fontFamily: 'Fragment Mono, monospace',
        fontSize: 10.5
      },
      min: 0,
      max: 7.5,
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(47, 42, 36, 0.45)',
          type: 'dashed'
        }
      },
      axisLine: { lineStyle: { color: '#2f2a24' } },
      axisLabel: {
        color: '#87817a',
        fontFamily: 'Fragment Mono, monospace',
        fontSize: 10.5,
        formatter: '{value}%'
      }
    },
    dataZoom: [
      {
        type: 'inside',
        zoomOnMouseWheel: true,
        moveOnMouseMove: true
      }
    ],
    series: [
      ...series,
      {
        type: 'line',
        data: [],
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: 'rgba(140, 129, 119, 0.4)',
            type: 'dashed',
            width: 1.2
          },
          data: [
            {
              xAxis: 18.0,
              label: {
                show: true,
                position: 'insideStartTop',
                formatter: 'FAIR VALUE P/E (18x)',
                color: '#87817a',
                fontFamily: 'Fragment Mono, monospace',
                fontSize: 9.5
              }
            },
            {
              yAxis: 2.8,
              label: {
                show: true,
                position: 'insideEndTop',
                formatter: 'GLOBAL MEDIAN YIELD (2.8%)',
                color: '#87817a',
                fontFamily: 'Fragment Mono, monospace',
                fontSize: 9.5
              }
            }
          ]
        }
      }
    ]
  }

  setScatterOption(option, true)
}

const sortedValuations = computed(() => {
  return [...globalIndices].map(idx => {
    const spread = idx.valuations.peRatio - idx.valuations.historicalPE.mean10Y
    return {
      ...idx,
      spread
    }
  }).sort((a, b) => a.valuations.peRatio - b.valuations.peRatio)
})

onMounted(() => {
  nextTick(updateScatterChart)
})

useHead({
  title: 'Global Stock Indices Valuation Matrix — INDEX // STUDY',
  meta: [
    { name: 'description', content: 'Explore 2-dimensional valuation scatter maps and historical multiple spreads across global market benchmarks.' }
  ]
})
</script>

<style scoped>
.valuations-page {
  padding-top: var(--oi-s5);
  padding-bottom: var(--oi-s7);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s5);
}

.val-header-sec {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.scatter-card {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.scatter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s2);
}

.active-bubble-readout {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--oi-hairline);
  padding: 4px 10px;
  border-radius: var(--oi-r-s);
}

.echarts-scatter-viewport {
  width: 100%;
  height: 480px;
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r);
  overflow: hidden;
  position: relative;
}

.echarts-scatter-dom {
  width: 100%;
  height: 100%;
}

.val-table-card {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.val-table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.val-matrix-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.val-matrix-table th,
.val-matrix-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--oi-hairline);
}

.val-matrix-table th {
  color: var(--oi-ink-3);
  font-weight: 500;
}

.val-matrix-row:hover td {
  background-color: var(--oi-hairline-light);
}

.td-name-cell {
  white-space: nowrap;
}

.name-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--oi-ink);
}

.name-bold {
  font-weight: 600;
}

.is-rich {
  color: var(--oi-warning);
}

.is-cheap {
  color: var(--oi-green);
}

.status-pill {
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 11px;
}

.status-pill.undervalued {
  background-color: rgba(0, 226, 0, 0.12);
  color: var(--oi-green);
}

.status-pill.fair-value {
  background-color: var(--oi-hairline);
  color: var(--oi-ink-2);
}

.status-pill.overvalued {
  background-color: rgba(255, 176, 32, 0.15);
  color: var(--oi-warning);
}
</style>
