<template>
  <div class="sector-donut-card oi-card-box">
    <div class="card-header">
      <div class="title-block">
        <h3 class="oi-h3">Sector Allocation & Donut</h3>
        <span class="meta-tag font-mono oi-xs">EQUITY COMPOSITION</span>
      </div>
      <span class="count-pill oi-pill oi-xs font-mono">{{ sectors.length }} SECTORS</span>
    </div>

    <div class="donut-content">
      <!-- Apache ECharts Donut Viewport -->
      <div class="donut-viewport">
        <div ref="donutRef" class="echarts-donut-dom"></div>
      </div>

      <!-- Sector Legend & Bars -->
      <div class="legend-list">
        <div
          v-for="(sec, i) in sectors"
          :key="sec.name"
          class="legend-row"
          :class="{ 'is-active': hoveredIndex === i }"
          @mouseenter="highlightSector(i)"
          @mouseleave="downplaySector(i)"
        >
          <div class="legend-left">
            <span class="color-badge" :style="{ backgroundColor: sec.color }"></span>
            <span class="sec-title oi-sm">{{ sec.name }}</span>
          </div>

          <div class="legend-right">
            <div class="bar-bg">
              <div class="bar-fill" :style="{ width: `${sec.percentage * 2}%`, backgroundColor: sec.color }"></div>
            </div>
            <span class="sec-pct num-tabular font-mono oi-sm">{{ sec.percentage.toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useECharts } from '~/composables/useECharts'
import type { SectorWeight } from '~/data/indices'

const props = defineProps<{
  sectors: SectorWeight[]
}>()

const hoveredIndex = ref<number | null>(null)
const donutRef = ref<HTMLElement | null>(null)
const { setOption, chartInstance } = useECharts(donutRef)

function updateDonut() {
  if (!props.sectors || !props.sectors.length) return

  const data = props.sectors.map(s => ({
    name: s.name,
    value: s.percentage,
    itemStyle: {
      color: s.color,
      borderColor: '#0b0806',
      borderWidth: 2
    }
  }))

  const option: any = {
    animationDuration: 550,
    animationEasing: 'cubicOut',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(11, 8, 6, 0.94)',
      borderColor: '#2f2a24',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: '#ffffff',
        fontFamily: 'General Sans, sans-serif',
        fontSize: 12
      },
      formatter: (params: any) => {
        return `
          <div style="font-family: 'General Sans', sans-serif;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 2px; background: ${params.color};"></span>
              <span style="font-weight: 600; color: #ffffff;">${params.name}</span>
            </div>
            <div style="font-family: 'Fragment Mono', monospace; font-size: 13px; color: #00e200; font-weight: 600;">
              ${params.value.toFixed(1)}% <span style="font-size: 10px; color: #87817a;">WEIGHT</span>
            </div>
          </div>
        `
      }
    },
    series: [
      {
        name: 'Sector Allocation',
        type: 'pie',
        radius: ['56%', '82%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 3
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          scale: true,
          scaleSize: 6,
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            fontSize: 13,
            fontWeight: 600,
            color: '#ffffff',
            fontFamily: 'Fragment Mono, monospace'
          }
        },
        labelLine: {
          show: false
        },
        data
      }
    ]
  }

  setOption(option, true)
}

function highlightSector(index: number) {
  hoveredIndex.value = index
  if (chartInstance.value && props.sectors[index]) {
    chartInstance.value.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: index
    })
    chartInstance.value.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: index
    })
  }
}

function downplaySector(index: number) {
  hoveredIndex.value = null
  if (chartInstance.value) {
    chartInstance.value.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: index
    })
    chartInstance.value.dispatchAction({
      type: 'hideTip'
    })
  }
}

watch(() => props.sectors, () => {
  nextTick(updateDonut)
}, { deep: true })

onMounted(() => {
  nextTick(updateDonut)
})
</script>

<style scoped>
.sector-donut-card {
  padding: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.count-pill {
  color: var(--oi-ink-2);
}

.donut-content {
  display: grid;
  grid-template-columns: 240px 1fr;
  align-items: center;
  gap: var(--oi-s4);
}

@media (max-width: 720px) {
  .donut-content {
    grid-template-columns: 1fr;
    justify-items: center;
  }
}

.donut-viewport {
  width: 240px;
  height: 240px;
  position: relative;
}

.echarts-donut-dom {
  width: 100%;
  height: 100%;
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.legend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  border-radius: var(--oi-r-s);
  transition: background-color var(--oi-dur) var(--oi-ease);
  cursor: pointer;
}

.legend-row:hover,
.legend-row.is-active {
  background-color: var(--oi-hairline);
}

.legend-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-badge {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

.sec-title {
  color: var(--oi-ink);
}

.legend-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-bg {
  width: 60px;
  height: 4px;
  background-color: var(--oi-hairline);
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 2px;
}

.sec-pct {
  color: var(--oi-ink-2);
  width: 44px;
  text-align: right;
}
</style>
