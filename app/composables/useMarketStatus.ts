import { ref, onMounted, onUnmounted } from 'vue'
import type { IndexData } from '~/data/indices'

export interface MarketStatusResult {
  isOpen: boolean
  isWeekend: boolean
  isPreMarket: boolean
  statusLabel: 'OPEN' | 'CLOSED' | 'PRE-MARKET' | 'WEEKEND'
  localTimeFormatted: string
  countdownFormatted: string
}

export function useMarketStatus() {
  const currentTime = ref(new Date())
  let timer: any = null

  onMounted(() => {
    timer = setInterval(() => {
      currentTime.value = new Date()
    }, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  function getStatusForIndex(index: IndexData): MarketStatusResult {
    const tz = index.tradingHours.timezone
    const now = currentTime.value

    // Format local time in exchange's timezone
    let localTimeStr = ''
    let dayOfWeek = 0
    let hours = 0
    let minutes = 0
    let seconds = 0

    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        weekday: 'short'
      })
      const parts = formatter.formatToParts(now)
      const partMap: Record<string, string> = {}
      parts.forEach(p => { partMap[p.type] = p.value })

      hours = parseInt(partMap.hour || '0', 10)
      minutes = parseInt(partMap.minute || '0', 10)
      seconds = parseInt(partMap.second || '0', 10)

      const weekdayStr = partMap.weekday || ''
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      dayOfWeek = days.indexOf(weekdayStr)

      localTimeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    } catch {
      // Fallback using UTC offset
      const utc = now.getTime() + now.getTimezoneOffset() * 60000
      const localDate = new Date(utc + 3600000 * index.tradingHours.utcOffset)
      hours = localDate.getHours()
      minutes = localDate.getMinutes()
      seconds = localDate.getSeconds()
      dayOfWeek = localDate.getDay()
      localTimeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    const currentMinuteOfDay = hours * 60 + minutes

    // Parse open & close local times
    const [openH, openM] = index.tradingHours.openLocal.split(':').map(Number)
    const [closeH, closeM] = index.tradingHours.closeLocal.split(':').map(Number)
    const openMinuteOfDay = openH * 60 + openM
    const closeMinuteOfDay = closeH * 60 + closeM

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 // Saturday (6) or Sunday (0)

    if (isWeekend) {
      return {
        isOpen: false,
        isWeekend: true,
        isPreMarket: false,
        statusLabel: 'WEEKEND',
        localTimeFormatted: localTimeStr,
        countdownFormatted: 'Opens Mon'
      }
    }

    // Check for lunch break if any (e.g. Tokyo, HK)
    let inLunch = false
    if (index.tradingHours.lunchBreak) {
      const [lStartH, lStartM] = index.tradingHours.lunchBreak.start.split(':').map(Number)
      const [lEndH, lEndM] = index.tradingHours.lunchBreak.end.split(':').map(Number)
      const lStartMinute = lStartH * 60 + lStartM
      const lEndMinute = lEndH * 60 + lEndM
      if (currentMinuteOfDay >= lStartMinute && currentMinuteOfDay < lEndMinute) {
        inLunch = true
      }
    }

    // Pre-market: 1 hour before open
    const preMarketStart = openMinuteOfDay - 60
    const isPreMarket = currentMinuteOfDay >= preMarketStart && currentMinuteOfDay < openMinuteOfDay

    if (isPreMarket) {
      const diffMins = openMinuteOfDay - currentMinuteOfDay
      return {
        isOpen: false,
        isWeekend: false,
        isPreMarket: true,
        statusLabel: 'PRE-MARKET',
        localTimeFormatted: localTimeStr,
        countdownFormatted: `Opens in ${diffMins}m`
      }
    }

    if (currentMinuteOfDay >= openMinuteOfDay && currentMinuteOfDay < closeMinuteOfDay && !inLunch) {
      const diffMins = closeMinuteOfDay - currentMinuteOfDay
      const remH = Math.floor(diffMins / 60)
      const remM = diffMins % 60
      const countdown = remH > 0 ? `Closes in ${remH}h ${remM}m` : `Closes in ${remM}m`

      return {
        isOpen: true,
        isWeekend: false,
        isPreMarket: false,
        statusLabel: 'OPEN',
        localTimeFormatted: localTimeStr,
        countdownFormatted: countdown
      }
    }

    // Closed
    let countdown = 'Market Closed'
    if (currentMinuteOfDay < openMinuteOfDay) {
      const diffMins = openMinuteOfDay - currentMinuteOfDay
      const remH = Math.floor(diffMins / 60)
      const remM = diffMins % 60
      countdown = `Opens in ${remH}h ${remM}m`
    } else {
      countdown = 'Opens Tomorrow'
    }

    return {
      isOpen: false,
      isWeekend: false,
      isPreMarket: false,
      statusLabel: 'CLOSED',
      localTimeFormatted: localTimeStr,
      countdownFormatted: countdown
    }
  }

  return {
    currentTime,
    getStatusForIndex
  }
}
