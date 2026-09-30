<template>
  <div class="band-chart-card oi-card-box">
    <div class="band-header">
      <div class="title-block">
        <h3 class="oi-h3">10-Year Valuation Band Trajectory</h3>
        <span class="meta-tag font-mono oi-xs">HISTORICAL P/E MULTIPLE REGIMES</span>
      </div>

      <div class="band-badges">
        <span class="mean-tag font-mono oi-xs">Mean: {{ mean.toFixed(1) }}x</span>
        <span
          class="status-pill font-mono oi-xs"
          :class="statusClass"
        >
          {{ status }}
        </span>
      </div>
    </div>

    <!-- Apache ECharts Valuation Band Trajectory Canvas -->
    <div class="band-chart-viewport">
      <div ref="chartRef" class="band-echarts-dom"></div>
    </div>

    <!-- Footer Tooltip Readout & Legend -->
    <div class="band-footer">
      <div v-if="hoverData" class="readout-box font-mono oi-xs">
        <span class="readout-yr font-mono">{{ hoverData.year }}:</span>
        <span class="readout-pe font-mono num-tabular">{{ hoverData.pe.toFixed(1) }}x P/E</span>
        <span class="readout-div font-mono oi-muted num-tabular">(Div Yield: {{ hoverData.divYield.toFixed(2) }}%)</span>
        <span
          class="readout-pill font-mono oi-xs"
          :class="hoverData.regimeClass"
        >
          {{ hoverData.regimeText }}
        </span>
      </div>
      <div v-else class="readout-box font-mono oi-xs oi-muted">
        <span>Hover over curve points to inspect historical valuation multiples ({{ years[0] }} - {{ years[years.length - 1] }})</span>
      </div>

      <div class="band-legend font-mono oi-xs oi-muted">
        <span class="leg-item"><span class="dot-gold"></span> &gt; +1σ Rich</span>
        <span class="leg-item"><span class="dot-gray"></span> ±1σ Fair</span>
        <span class="leg-item"><span class="dot-green"></span> &lt; -1σ Cheap</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useECharts } from '~/composables/useECharts'

const props = defineProps<{
  mean: number
  sd: number
  status: string
  series?: {
    years: number[]
    peRatio: number[]
    dividendYield: number[]
  }
}>()

const chartRef = ref<HTMLElement | null>(null)
const { setOption, chartInstance } = useECharts(chartRef)

const hoverData = ref<{
  year: number
  pe: number
  divYield: number
  regimeText: string
  regimeClass: string
} | null>(null)

const statusClass = computed(() => {
  return props.status.toLowerCase().replace(/\s+/g, '-')
})

// Fallbacks
const years = computed(() => props.series?.years || [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026])
const peValues = computed(() => props.series?.peRatio || [18, 16, 19, 24, 22, 17, 19, 21, 23, 24])
const divValues = computed(() => props.series?.dividendYield || [2.1, 2.3, 2.0, 1.6, 1.8, 2.4, 2.1, 1.9, 1.8, 1.7])

function updateChart() {
  if (!chartRef.value || peValues.value.length === 0) return

  const vals = peValues.value
  const yrs = years.value
  const divs = divValues.value

  const upperBand = Number((props.mean + props.sd).toFixed(1))
  const lowerBand = Number((props.mean - props.sd).toFixed(1))
  const meanVal = Number(props.mean.toFixed(1))

  const allVals = [...vals, upperBand, lowerBand]
  const rawMin = Math.min(...allVals)
  const rawMax = Math.max(...allVals)
  const pad = Math.max(1.8, (rawMax - rawMin) * 0.16)
  const yMin = Math.max(0, Math.floor(rawMin - pad))
  const yMax = Math.ceil(rawMax + pad)

  const option: any = {
    animationDuration: 600,
    animationEasing: 'cubicOut',
    grid: {
      top: 32,
      left: 12,
      right: 18,
      bottom: 24,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(11, 8, 6, 0.94)',
      borderColor: '#2f2a24',
      borderWidth: 1,
      padding: [10, 14],
      textStyle: {
        color: '#ffffff',
        fontFamily: 'General Sans, -apple-system, sans-serif',
        fontSize: 12
      },
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: '#87817a',
          type: 'dashed',
          width: 1
        },
        label: {
          backgroundColor: '#241f1a',
          fontFamily: 'Fragment Mono, monospace',
          color: '#ffffff',
          fontSize: 11
        }
      },
      formatter: (params: any) => {
        if (!params || !params[0]) return ''
        const p = params[0]
        const yr = Number(p.name)
        const pe = Number(p.value)
        const idx = yrs.indexOf(yr)
        const div = idx >= 0 && divs[idx] !== undefined ? divs[idx] : null
        const spread = pe - props.mean
        const zScore = props.sd ? (spread / props.sd).toFixed(2) : '0.00'

        let regimeBadge = ''
        let regimeText = '±1σ Fair'
        let regimeClass = 'fair-value'

        if (pe > upperBand) {
          regimeBadge = '<span style="color:#fbbf24;font-weight:600;font-size:10.5px;">+1σ OVERVALUED</span>'
          regimeText = '> +1σ Rich'
          regimeClass = 'overvalued'
        } else if (pe < lowerBand) {
          regimeBadge = '<span style="color:#00e200;font-weight:600;font-size:10.5px;">-1σ UNDERVALUED</span>'
          regimeText = '< -1σ Cheap'
          regimeClass = 'undervalued'
        } else {
          regimeBadge = '<span style="color:#8c8177;font-weight:600;font-size:10.5px;">±1σ FAIR VALUE</span>'
        }

        // Update footer readout synchronously
        hoverData.value = {
          year: yr,
          pe,
          divYield: div ?? 0,
          regimeText,
          regimeClass
        }

        return `
          <div style="font-family:'General Sans',sans-serif;min-width:190px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;border-bottom:1px solid #2f2a24;padding-bottom:5px;">
              <span style="font-family:'Fragment Mono',monospace;font-size:11px;color:#87817a;">${yr} MULTIPLE</span>
              ${regimeBadge}
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:3px;font-family:'Fragment Mono',monospace;font-size:12px;">
              <span style="color:#8c8177;">P/E Multiple:</span>
              <span style="font-weight:600;color:#ffffff;">${pe.toFixed(1)}x</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:3px;font-family:'Fragment Mono',monospace;font-size:11px;">
              <span style="color:#8c8177;">10Y Mean:</span>
              <span style="color:#87817a;">${props.mean.toFixed(1)}x</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:3px;font-family:'Fragment Mono',monospace;font-size:11px;">
              <span style="color:#8c8177;">Multiple Spread:</span>
              <span style="color:${spread >= 0 ? '#fbbf24' : '#00e200'};">${spread >= 0 ? '+' : ''}${spread.toFixed(1)}x (${zScore}σ)</span>
            </div>
            ${div !== null ? `
            <div style="display:flex;justify-content:space-between;border-top:1px solid #2f2a24;margin-top:5px;padding-top:4px;font-family:'Fragment Mono',monospace;font-size:11px;">
              <span style="color:#8c8177;">Implied Div Yield:</span>
              <span style="color:#ffffff;">${div.toFixed(2)}%</span>
            </div>` : ''}
          </div>
        `
      }
    },
    xAxis: {
      type: 'category',
      data: yrs.map(String),
      boundaryGap: true,
      axisLine: {
        lineStyle: { color: '#2f2a24', width: 1 }
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#87817a',
        fontFamily: 'Fragment Mono, monospace',
        fontSize: 11,
        margin: 10
      },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      min: yMin,
      max: yMax,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        formatter: '{value}x',
        color: '#87817a',
        fontFamily: 'Fragment Mono, monospace',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(47, 42, 36, 0.45)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: 'P/E Multiple',
        type: 'line',
        data: vals,
        smooth: false,
        symbol: 'circle',
        symbolSize: 6.5,
        showSymbol: true,
        z: 3,
        lineStyle: {
          color: '#ffffff',
          width: 2.2,
          shadowColor: 'rgba(255, 255, 255, 0.12)',
          shadowBlur: 5
        },
        itemStyle: {
          color: '#0b0806',
          borderColor: '#ffffff',
          borderWidth: 2
        },
        emphasis: {
          scale: 1.5,
          itemStyle: {
            color: '#00e200',
            borderColor: '#ffffff',
            borderWidth: 2.2
          }
        },
        markArea: {
          silent: true,
          data: [
            // Overvalued Zone (+1SD to Top)
            [
              {
                yAxis: upperBand,
                itemStyle: {
                  color: 'rgba(255, 176, 32, 0.06)'
                }
              },
              {
                yAxis: yMax
              }
            ],
            // Undervalued Zone (Bottom to -1SD)
            [
              {
                yAxis: yMin,
                itemStyle: {
                  color: 'rgba(0, 226, 0, 0.06)'
                }
              },
              {
                yAxis: lowerBand
              }
            ]
          ]
        },
        markLine: {
          silent: true,
          symbol: ['none', 'none'],
          data: [
            // +1 Standard Deviation
            {
              yAxis: upperBand,
              lineStyle: {
                color: '#fbbf24',
                type: 'dashed',
                width: 1.2,
                opacity: 0.75
              },
              label: {
                show: true,
                position: 'insideEndTop',
                distance: [0, 4],
                formatter: `+1σ Overvalued (${upperBand.toFixed(1)}x)`,
                color: '#fbbf24',
                fontFamily: 'Fragment Mono, monospace',
                fontSize: 10.5,
                backgroundColor: 'rgba(24, 20, 17, 0.92)',
                padding: [2, 6],
                borderRadius: 3.2,
                borderColor: 'rgba(251, 191, 36, 0.35)',
                borderWidth: 1
              }
            },
            // 10Y Mean
            {
              yAxis: meanVal,
              lineStyle: {
                color: '#8c8177',
                type: 'dashed',
                width: 1.2,
                opacity: 0.75
              },
              label: {
                show: true,
                position: 'insideEndTop',
                distance: [0, 4],
                formatter: `10Y Mean (${meanVal.toFixed(1)}x)`,
                color: '#8c8177',
                fontFamily: 'Fragment Mono, monospace',
                fontSize: 10.5,
                backgroundColor: 'rgba(24, 20, 17, 0.92)',
                padding: [2, 6],
                borderRadius: 3.2,
                borderColor: '#2f2a24',
                borderWidth: 1
              }
            },
            // -1 Standard Deviation
            {
              yAxis: lowerBand,
              lineStyle: {
                color: '#00e200',
                type: 'dashed',
                width: 1.2,
                opacity: 0.75
              },
              label: {
                show: true,
                position: 'insideEndTop',
                distance: [0, 4],
                formatter: `-1σ Undervalued (${lowerBand.toFixed(1)}x)`,
                color: '#00e200',
                fontFamily: 'Fragment Mono, monospace',
                fontSize: 10.5,
                backgroundColor: 'rgba(24, 20, 17, 0.92)',
                padding: [2, 6],
                borderRadius: 3.2,
                borderColor: 'rgba(0, 226, 0, 0.35)',
                borderWidth: 1
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
  () => [props.mean, props.sd, props.status, props.series],
  () => {
    nextTick(updateChart)
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    updateChart()
    if (chartInstance.value) {
      chartInstance.value.on('globalout', () => {
        hoverData.value = null
      })
    }
  })
})
</script>

<style scoped>
.band-chart-card {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
}

.band-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s2);
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.band-badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mean-tag {
  color: var(--oi-ink-2);
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  padding: 3px 8px;
  border-radius: var(--oi-r-s);
}

.status-pill {
  padding: 3px 8px;
  border-radius: var(--oi-r-s);
  text-transform: uppercase;
  font-weight: 600;
}

.status-pill.undervalued {
  background-color: rgba(0, 226, 0, 0.12);
  color: var(--oi-green);
}

.status-pill.fair-value {
  background-color: var(--oi-hairline);
  color: var(--oi-ink);
}

.status-pill.overvalued {
  background-color: rgba(255, 176, 32, 0.15);
  color: var(--oi-warning);
}

.band-chart-viewport {
  width: 100%;
  height: 250px;
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r);
  overflow: hidden;
  position: relative;
}

.band-echarts-dom {
  width: 100%;
  height: 100%;
}

.band-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s2);
  border-top: 1px solid var(--oi-hairline);
  padding-top: var(--oi-s2);
}

.readout-box {
  display: flex;
  align-items: center;
  gap: 6px;
}

.readout-yr {
  color: var(--oi-ink-3);
}

.readout-pe {
  font-weight: 600;
  color: var(--oi-ink);
}

.readout-div {
  color: var(--oi-ink-2);
}

.readout-pill {
  padding: 1px 6px;
  border-radius: var(--oi-r-s);
  font-size: 10.5px;
  margin-left: 4px;
}

.readout-pill.undervalued {
  background-color: rgba(0, 226, 0, 0.12);
  color: var(--oi-green);
}

.readout-pill.fair-value {
  background-color: var(--oi-hairline);
  color: var(--oi-ink);
}

.readout-pill.overvalued {
  background-color: rgba(255, 176, 32, 0.15);
  color: var(--oi-warning);
}

.band-legend {
  display: flex;
  align-items: center;
  gap: 12px;
}

.leg-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot-gold {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--oi-warning);
}

.dot-gray {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--oi-ink-2);
}

.dot-green {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--oi-green);
}
</style>
