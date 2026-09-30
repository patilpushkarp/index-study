<template>
  <div class="chart-container">
    <!-- Chart Header & Controls -->
    <div class="chart-controls">
      <!-- Timeframe Buttons -->
      <div class="timeframe-group">
        <button
          v-for="tf in timeframes"
          :key="tf"
          class="oi-pill"
          :class="{ 'is-active': activeTimeframe === tf }"
          @click="activeTimeframe = tf"
        >
          {{ tf }}
        </button>
      </div>

      <!-- Chart Type & Meta -->
      <div class="meta-controls">
        <div class="style-toggle">
          <button
            class="oi-pill is-icon"
            :class="{ 'is-active': chartStyle === 'area' }"
            title="Area Spline Chart"
            @click="chartStyle = 'area'"
          >
            ◩ Area
          </button>
          <button
            class="oi-pill is-icon"
            :class="{ 'is-active': chartStyle === 'line' }"
            title="Technical Line Chart"
            @click="chartStyle = 'line'"
          >
            ╱ Line
          </button>
          <button
            class="oi-pill is-icon"
            :class="{ 'is-active': showDataZoom }"
            title="Toggle Timeline Scrub Slider"
            @click="showDataZoom = !showDataZoom"
          >
            ↔ Range Scrub
          </button>
        </div>

        <div v-if="periodSummary" class="period-readout">
          <span class="period-label font-mono oi-xs">RETURN:</span>
          <span
            class="period-delta num-tabular font-mono oi-sm"
            :class="periodSummary.deltaPct >= 0 ? 'is-pos' : 'is-neg'"
          >
            {{ periodSummary.deltaPct >= 0 ? '+' : '' }}{{ periodSummary.deltaPct.toFixed(2) }}%
          </span>
          <span class="period-range font-mono oi-xs oi-muted">
            HIGH: {{ currencySymbol }}{{ formatNumber(periodSummary.high) }} · LOW: {{ currencySymbol }}{{ formatNumber(periodSummary.low) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Apache ECharts Canvas Viewport -->
    <div class="echarts-viewport-wrapper">
      <div ref="chartRef" class="echarts-dom"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useECharts } from '~/composables/useECharts'
import type { TimeSeriesPoint } from '~/data/indices'
import * as echarts from 'echarts/core'

const props = defineProps<{
  indexId: string
  currencySymbol: string
  timeSeriesData: {
    '1D': TimeSeriesPoint[]
    '1W': TimeSeriesPoint[]
    '1M': TimeSeriesPoint[]
    '6M': TimeSeriesPoint[]
    '1Y': TimeSeriesPoint[]
    '5Y': TimeSeriesPoint[]
    'ALL': TimeSeriesPoint[]
  }
}>()

const timeframes = ['1D', '1W', '1M', '6M', '1Y', '5Y', 'ALL'] as const
type Timeframe = typeof timeframes[number]

const activeTimeframe = ref<Timeframe>('1Y')
const chartStyle = ref<'area' | 'line'>('area')
const showDataZoom = ref(true)
const chartRef = ref<HTMLElement | null>(null)

const { setOption, chartInstance } = useECharts(chartRef)

const activePoints = computed(() => {
  return props.timeSeriesData[activeTimeframe.value] || []
})

const periodSummary = computed(() => {
  const pts = activePoints.value
  if (!pts || pts.length === 0) return null
  const values = pts.map(p => p.value)
  const first = pts[0].value
  const last = pts[pts.length - 1].value
  const deltaPct = first ? ((last - first) / first) * 100 : 0
  const high = Math.max(...values)
  const low = Math.min(...values)
  return { first, last, deltaPct, high, low }
})

const isPositiveOverall = computed(() => {
  if (!periodSummary.value) return true
  return periodSummary.value.deltaPct >= 0
})

function formatNumber(num: number): string {
  if (num >= 10000) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function updateChart() {
  const pts = activePoints.value
  if (!pts || !pts.length) return

  const dates = pts.map(p => p.date)
  const values = pts.map(p => p.value)
  const baseValue = pts[0].value
  const isPos = isPositiveOverall.value
  const primaryColor = isPos ? '#00e200' : '#ff5f53'

  const areaGradient = chartStyle.value === 'area' ? {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: isPos ? 'rgba(0, 226, 0, 0.28)' : 'rgba(255, 95, 83, 0.28)' },
      { offset: 0.65, color: isPos ? 'rgba(0, 226, 0, 0.05)' : 'rgba(255, 95, 83, 0.05)' },
      { offset: 1, color: isPos ? 'rgba(0, 226, 0, 0)' : 'rgba(255, 95, 83, 0)' }
    ]
  } : undefined

  const option: any = {
    animationDuration: 550,
    animationEasing: 'cubicOut',
    grid: {
      top: 32,
      left: 12,
      right: 24,
      bottom: showDataZoom.value ? 58 : 24,
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
          type: 'dashed',
          width: 1
        }
      },
      formatter: (params: any) => {
        if (!params || !params[0]) return ''
        const p = params[0]
        const val = p.value
        const delta = baseValue ? ((val - baseValue) / baseValue) * 100 : 0
        const deltaSign = delta >= 0 ? '+' : ''
        const deltaClass = delta >= 0 ? '#00e200' : '#ff5f53'

        return `
          <div style="font-family: 'General Sans', sans-serif; min-width: 180px;">
            <div style="font-family: 'Fragment Mono', monospace; font-size: 11px; color: #8c8177; margin-bottom: 4px;">
              ${p.axisValue}
            </div>
            <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 2px;">
              <span style="font-size: 15px; font-weight: 600; color: #ffffff; font-variant-numeric: tabular-nums;">
                ${props.currencySymbol}${formatNumber(val)}
              </span>
              <span style="font-family: 'Fragment Mono', monospace; font-size: 12px; font-weight: 600; color: ${deltaClass}; font-variant-numeric: tabular-nums;">
                ${deltaSign}${delta.toFixed(2)}%
              </span>
            </div>
            <div style="font-family: 'Fragment Mono', monospace; font-size: 10px; color: #87817a; margin-top: 4px; border-top: 1px solid #2f2a24; padding-top: 4px;">
              BENCHMARK BASE: ${props.currencySymbol}${formatNumber(baseValue)}
            </div>
          </div>
        `
      }
    },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLine: {
        lineStyle: { color: '#2f2a24' }
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#87817a',
        fontFamily: 'Fragment Mono, monospace',
        fontSize: 10.5,
        formatter: (val: string) => {
          if (val.length === 5) return val // Intraday time HH:MM
          // Format YYYY-MM-DD to DD MMM
          const parts = val.split('-')
          if (parts.length === 3) {
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
            return `${parts[2]} ${months[parseInt(parts[1], 10) - 1]}`
          }
          return val
        }
      },
      splitLine: { show: false }
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
        formatter: (v: number) => {
          if (v >= 1000) return `${(v / 1000).toFixed(1)}k`
          return v.toFixed(0)
        }
      }
    },
    dataZoom: showDataZoom.value ? [
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
        fillerColor: 'rgba(0, 226, 0, 0.12)',
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
        zoomOnMouseWheel: true,
        moveOnMouseMove: true
      }
    ] : [
      {
        type: 'inside',
        zoomOnMouseWheel: true
      }
    ],
    series: [
      {
        name: props.indexId,
        type: 'line',
        smooth: 0.18,
        symbol: 'none',
        sampling: 'lttb',
        data: values,
        lineStyle: {
          width: 2.4,
          color: primaryColor
        },
        areaStyle: areaGradient ? { color: areaGradient } : undefined,
        markPoint: {
          symbol: 'circle',
          symbolSize: 6,
          label: {
            show: true,
            position: 'top',
            color: '#ffffff',
            fontFamily: 'Fragment Mono, monospace',
            fontSize: 10,
            formatter: (p: any) => formatNumber(p.value)
          },
          data: [
            { type: 'max', name: 'Period High' },
            { type: 'min', name: 'Period Low', label: { position: 'bottom' } }
          ],
          itemStyle: {
            color: primaryColor,
            borderColor: '#0b0806',
            borderWidth: 2
          }
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: 'rgba(140, 129, 119, 0.35)',
            type: 'dashed',
            width: 1
          },
          data: [
            {
              yAxis: baseValue,
              label: {
                show: true,
                position: 'insideStartTop',
                formatter: `BASE ${formatNumber(baseValue)}`,
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

  setOption(option, true)
}

watch(
  [() => props.timeSeriesData, activeTimeframe, chartStyle, showDataZoom],
  () => {
    nextTick(updateChart)
  },
  { deep: true }
)

onMounted(() => {
  nextTick(updateChart)
})
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
  width: 100%;
}

.chart-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s3);
}

.timeframe-group {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: var(--oi-card);
  padding: 3px;
  border-radius: var(--oi-r-m);
  border: 1px solid var(--oi-hairline);
}

.timeframe-group .oi-pill {
  border: none;
  background: transparent;
  color: var(--oi-ink-2);
}

.timeframe-group .oi-pill.is-active {
  background-color: var(--oi-invert-bg);
  color: var(--oi-invert-ink);
  font-weight: 600;
}

.meta-controls {
  display: flex;
  align-items: center;
  gap: var(--oi-s3);
  flex-wrap: wrap;
}

.style-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
}

.style-toggle .oi-pill {
  background-color: var(--oi-card);
  border: 1px solid var(--oi-hairline);
  color: var(--oi-ink-2);
}

.style-toggle .oi-pill.is-active {
  background-color: var(--oi-btn-hover);
  color: var(--oi-ink);
  border-color: var(--oi-ink-2);
}

.period-readout {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 4px 10px;
  background-color: var(--oi-card);
  border-radius: var(--oi-r-s);
  border: 1px solid var(--oi-hairline);
}

.period-label {
  color: var(--oi-ink-3);
}

.period-delta {
  font-weight: 600;
}

.period-delta.is-pos {
  color: var(--oi-green);
}

.period-delta.is-neg {
  color: var(--oi-loss);
}

.period-range {
  font-size: 11px;
}

.echarts-viewport-wrapper {
  width: 100%;
  height: 380px;
  background-color: var(--oi-card);
  border-radius: var(--oi-r-m);
  border: 1px solid var(--oi-hairline);
  position: relative;
  overflow: hidden;
}

.echarts-dom {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .echarts-viewport-wrapper {
    height: 320px;
  }

  .chart-controls {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
