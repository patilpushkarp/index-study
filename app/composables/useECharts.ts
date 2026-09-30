import { onMounted, onBeforeUnmount, ref, shallowRef, type Ref } from 'vue'
import * as echarts from 'echarts/core'
import {
  LineChart,
  ScatterChart,
  PieChart,
  BarChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent,
  GraphicComponent,
  MarkAreaComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// Register only needed components for optimized tree-shaking
echarts.use([
  LineChart,
  ScatterChart,
  PieChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent,
  GraphicComponent,
  MarkAreaComponent,
  CanvasRenderer
])

// Register Khasiyev Obsidian Institutional Theme
export const KHASIYEV_CHART_THEME = {
  color: [
    '#00e200', // Signature pulsing green
    '#38bdf8', // Sky sapphire
    '#fbbf24', // Amber gold
    '#c084fc', // Lilac purple
    '#f43f5e', // Coral red
    '#2dd4bf', // Mint teal
    '#fb923c'  // Tangerine
  ],
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: 'General Sans, -apple-system, sans-serif',
    color: '#87817a'
  },
  title: {
    textStyle: {
      color: '#ffffff',
      fontFamily: 'General Sans, -apple-system, sans-serif',
      fontWeight: 500
    },
    subtextStyle: {
      color: '#87817a',
      fontFamily: 'Fragment Mono, monospace'
    }
  },
  grid: {
    top: 24,
    right: 16,
    bottom: 24,
    left: 16,
    containLabel: true,
    borderColor: '#2f2a24',
    borderWidth: 0.5
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: { color: '#2f2a24', width: 1 }
    },
    axisTick: { show: false },
    axisLabel: {
      color: '#87817a',
      fontFamily: 'Fragment Mono, monospace',
      fontSize: 11
    },
    splitLine: { show: false }
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#87817a',
      fontFamily: 'Fragment Mono, monospace',
      fontSize: 11
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(47, 42, 36, 0.65)',
        type: 'dashed'
      }
    }
  },
  tooltip: {
    backgroundColor: 'rgba(11, 8, 6, 0.94)',
    borderColor: '#2f2a24',
    borderWidth: 1,
    padding: [10, 14],
    textStyle: {
      color: '#ffffff',
      fontFamily: 'General Sans, -apple-system, sans-serif',
      fontSize: 12.5
    },
    extraCssText: 'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6); backdrop-filter: blur(10px); border-radius: 6px;'
  }
}

// Register the theme globally with ECharts
echarts.registerTheme('khasiyev', KHASIYEV_CHART_THEME)

export function useECharts(containerRef: Ref<HTMLElement | null>) {
  const chartInstance = shallowRef<echarts.ECharts | null>(null)
  let resizeObserver: ResizeObserver | null = null
  let pendingOption: echarts.EChartsCoreOption | null = null

  function initChart() {
    if (!containerRef.value) return
    const el = containerRef.value
    if (el.clientWidth === 0 || el.clientHeight === 0) {
      // Container not laid out yet; wait for ResizeObserver
      return
    }

    if (chartInstance.value) {
      chartInstance.value.dispose()
    }

    const instance = echarts.init(el, 'khasiyev', {
      renderer: 'canvas'
    })
    chartInstance.value = instance

    if (pendingOption) {
      instance.setOption(pendingOption, true)
      pendingOption = null
    }
  }

  function handleWindowResize() {
    chartInstance.value?.resize()
  }

  function setOption(option: echarts.EChartsCoreOption, notMerge = false) {
    pendingOption = option
    if (!chartInstance.value) {
      initChart()
    }
    if (chartInstance.value) {
      chartInstance.value.setOption(option, notMerge)
      pendingOption = null
    }
  }

  onMounted(() => {
    if (containerRef.value) {
      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
              if (!chartInstance.value) {
                initChart()
              } else {
                chartInstance.value.resize()
              }
            }
          }
        })
        resizeObserver.observe(containerRef.value)
      } else {
        window.addEventListener('resize', handleWindowResize)
      }
      initChart()
    }
  })

  onBeforeUnmount(() => {
    if (resizeObserver && containerRef.value) {
      resizeObserver.unobserve(containerRef.value)
      resizeObserver.disconnect()
    }
    window.removeEventListener('resize', handleWindowResize)
    if (chartInstance.value) {
      chartInstance.value.dispose()
      chartInstance.value = null
    }
  })

  return {
    chartInstance,
    setOption,
    initChart,
    echarts
  }
}
