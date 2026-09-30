import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'index_study_watchlist'

const watchlist = ref<string[]>([])

export function useWatchlist() {
  function loadWatchlist() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          watchlist.value = JSON.parse(stored)
        } else {
          // Default initial watchlist: S&P 500, Nifty 50, Nikkei 225
          watchlist.value = ['sp500', 'nifty50', 'nikkei225']
          saveWatchlist()
        }
      } catch (e) {
        watchlist.value = ['sp500', 'nifty50', 'nikkei225']
      }
    }
  }

  function saveWatchlist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist.value))
      } catch (e) {
        // localStorage full or unavailable
      }
    }
  }

  function isPinned(id: string): boolean {
    return watchlist.value.includes(id)
  }

  function togglePin(id: string) {
    if (isPinned(id)) {
      watchlist.value = watchlist.value.filter(item => item !== id)
    } else {
      watchlist.value = [...watchlist.value, id]
    }
    saveWatchlist()
  }

  onMounted(() => {
    loadWatchlist()
  })

  return {
    watchlist,
    isPinned,
    togglePin
  }
}
