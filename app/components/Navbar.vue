<template>
  <header class="navbar-wrapper">
    <div class="oi-container navbar-inner">
      <!-- Brand Logo -->
      <NuxtLink to="/" class="brand-logo" @click="mobileMenuOpen = false">
        <span class="logo-mark">⌘</span>
        <span class="logo-text">INDEX <span class="oi-serif">study</span></span>
      </NuxtLink>

      <!-- Active Market Status Pill (Desktop) -->
      <div class="active-status-pill">
        <span class="oi-dot pulse"></span>
        <span class="status-text num-tabular">{{ openMarketsCount }} Markets Active</span>
      </div>

      <!-- Desktop Navigation Links (>= 1080px) -->
      <nav class="nav-links desktop-only">
        <NuxtLink to="/" class="nav-link" active-class="is-active">
          Overview
        </NuxtLink>
        <NuxtLink to="/compare" class="nav-link" active-class="is-active">
          Compare
        </NuxtLink>
        <NuxtLink to="/valuations" class="nav-link" active-class="is-active">
          Valuations
        </NuxtLink>
        <NuxtLink to="/correlation" class="nav-link" active-class="is-active">
          Correlation
        </NuxtLink>
        <NuxtLink to="/crisis" class="nav-link" active-class="is-active">
          Crisis Lab
        </NuxtLink>
        <NuxtLink to="/macro" class="nav-link" active-class="is-active">
          Macro & FX
        </NuxtLink>
        <NuxtLink to="/screen" class="nav-link" active-class="is-active">
          Screener
        </NuxtLink>
        <NuxtLink to="/learn" class="nav-link" active-class="is-active">
          Study Guide
        </NuxtLink>
      </nav>

      <!-- Right Controls: Currency + Theme + Mobile Toggle -->
      <div class="nav-controls">
        <!-- Currency Selector (Desktop) -->
        <div class="currency-pills desktop-currency">
          <button
            v-for="curr in availableCurrencies"
            :key="curr"
            class="oi-pill"
            :class="{ 'is-active': selectedCurrency === curr }"
            @click="setCurrency(curr)"
          >
            {{ curr }}
          </button>
        </div>

        <!-- Theme Toggle -->
        <button
          class="oi-btn is-icon"
          title="Toggle Color Theme"
          aria-label="Toggle theme"
          @click="toggleTheme"
        >
          <span v-if="isDark" class="theme-icon">☼</span>
          <span v-else class="theme-icon">☽</span>
        </button>

        <!-- Mobile Menu Toggle Button (Mobile & Tablet <= 1080px) -->
        <button
          class="oi-btn is-icon mobile-toggle-btn"
          :title="mobileMenuOpen ? 'Close Menu' : 'Open Menu'"
          :aria-expanded="mobileMenuOpen"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="menu-icon">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile & Tablet Slide-Down Drawer -->
    <transition name="drawer">
      <div v-if="mobileMenuOpen" class="mobile-drawer">
        <div class="oi-container mobile-drawer-inner">
          <!-- Active Market Status in Mobile Drawer -->
          <div class="mobile-status-bar">
            <span class="oi-dot pulse"></span>
            <span class="status-text font-mono oi-xs">{{ openMarketsCount }} Global Markets Currently Active</span>
          </div>

          <!-- Mobile Nav Links Grid -->
          <nav class="mobile-nav-grid">
            <NuxtLink to="/" class="mobile-nav-link" active-class="is-active" @click="mobileMenuOpen = false">
              <span class="nav-num font-mono oi-xs oi-muted">01.</span>
              <span class="nav-label">Overview & Watchlist</span>
            </NuxtLink>
            <NuxtLink to="/compare" class="mobile-nav-link" active-class="is-active" @click="mobileMenuOpen = false">
              <span class="nav-num font-mono oi-xs oi-muted">02.</span>
              <span class="nav-label">Comparative Studio</span>
            </NuxtLink>
            <NuxtLink to="/valuations" class="mobile-nav-link" active-class="is-active" @click="mobileMenuOpen = false">
              <span class="nav-num font-mono oi-xs oi-muted">03.</span>
              <span class="nav-label">Valuation Multiples</span>
            </NuxtLink>
            <NuxtLink to="/correlation" class="mobile-nav-link" active-class="is-active" @click="mobileMenuOpen = false">
              <span class="nav-num font-mono oi-xs oi-muted">04.</span>
              <span class="nav-label">Correlation Heatmap</span>
            </NuxtLink>
            <NuxtLink to="/crisis" class="mobile-nav-link" active-class="is-active" @click="mobileMenuOpen = false">
              <span class="nav-num font-mono oi-xs oi-muted">05.</span>
              <span class="nav-label">Crisis Stress Lab</span>
            </NuxtLink>
            <NuxtLink to="/macro" class="mobile-nav-link" active-class="is-active" @click="mobileMenuOpen = false">
              <span class="nav-num font-mono oi-xs oi-muted">06.</span>
              <span class="nav-label">Macro & FX Engine</span>
            </NuxtLink>
            <NuxtLink to="/screen" class="mobile-nav-link" active-class="is-active" @click="mobileMenuOpen = false">
              <span class="nav-num font-mono oi-xs oi-muted">07.</span>
              <span class="nav-label">Multi-Factor Screener</span>
            </NuxtLink>
            <NuxtLink to="/learn" class="mobile-nav-link" active-class="is-active" @click="mobileMenuOpen = false">
              <span class="nav-num font-mono oi-xs oi-muted">08.</span>
              <span class="nav-label">Study Guide & Simulator</span>
            </NuxtLink>
          </nav>

          <!-- Mobile Currency Switcher -->
          <div class="mobile-currency-row">
            <span class="font-mono oi-xs oi-muted">DISPLAY CURRENCY:</span>
            <div class="currency-pills mobile-currencies">
              <button
                v-for="curr in availableCurrencies"
                :key="curr"
                class="oi-pill"
                :class="{ 'is-active': selectedCurrency === curr }"
                @click="setCurrency(curr)"
              >
                {{ curr }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="oi-divider"></div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { globalIndices } from '~/data/indices'
import { useMarketStatus } from '~/composables/useMarketStatus'
import { useCurrencyConverter } from '~/composables/useCurrencyConverter'

const { getStatusForIndex } = useMarketStatus()
const { selectedCurrency, setCurrency, availableCurrencies } = useCurrencyConverter()

const isDark = ref(true)
const mobileMenuOpen = ref(false)

const openMarketsCount = computed(() => {
  return globalIndices.filter(idx => getStatusForIndex(idx).isOpen).length
})

function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

onMounted(() => {
  // Default to dark mode matching khasiyev.com
  document.documentElement.removeAttribute('data-theme')
})
</script>

<style scoped>
.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: color-mix(in srgb, var(--oi-canvas) 92%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.navbar-inner {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--oi-s3);
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-heading);
  font-weight: 600;
  letter-spacing: -0.025em;
  font-size: 1.15rem;
  color: var(--oi-ink);
  transition: opacity var(--oi-dur) var(--oi-ease);
  flex-shrink: 0;
}

.brand-logo:hover {
  opacity: 0.85;
}

.logo-mark {
  font-size: 1.1rem;
  color: var(--oi-ink-2);
}

.active-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background-color: var(--oi-card);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
  padding: 4px 10px;
  font-size: 12px;
  color: var(--oi-ink-2);
  font-family: var(--font-heading);
  flex-shrink: 0;
}

@media (max-width: 1200px) {
  .active-status-pill {
    display: none;
  }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: clamp(12px, 1.4vw, 24px);
}

@media (max-width: 1080px) {
  .desktop-only {
    display: none;
  }
}

.nav-link {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--oi-ink-2);
  transition: color var(--oi-dur) var(--oi-ease);
  white-space: nowrap;
}

.nav-link:hover,
.nav-link.is-active {
  color: var(--oi-ink);
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: var(--oi-s2);
}

.currency-pills {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: var(--oi-card);
  padding: 3px;
  border-radius: var(--oi-r);
  border: 1px solid var(--oi-hairline);
}

@media (max-width: 600px) {
  .desktop-currency {
    display: none;
  }
}

.theme-icon {
  font-size: 15px;
  line-height: 1;
}

.is-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.mobile-toggle-btn {
  display: none;
}

@media (max-width: 1080px) {
  .mobile-toggle-btn {
    display: inline-flex;
  }
}

.menu-icon {
  font-size: 14px;
  line-height: 1;
}

/* Mobile Slide-Down Drawer */
.mobile-drawer {
  background-color: var(--oi-card);
  border-bottom: 1px solid var(--oi-hairline);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
}

.mobile-drawer-inner {
  padding-top: var(--oi-s4);
  padding-bottom: var(--oi-s4);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s4);
}

.mobile-status-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: var(--oi-s2);
  border-bottom: 1px dashed var(--oi-hairline);
}

.mobile-nav-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

@media (max-width: 600px) {
  .mobile-nav-grid {
    grid-template-columns: 1fr;
  }
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background-color: var(--oi-canvas);
  border: 1px solid var(--oi-hairline);
  border-radius: var(--oi-r-s);
  font-size: 14px;
  color: var(--oi-ink-2);
  transition: color var(--oi-dur) var(--oi-ease), background-color var(--oi-dur) var(--oi-ease);
}

.mobile-nav-link:hover,
.mobile-nav-link.is-active {
  color: var(--oi-ink);
  background-color: var(--oi-card-hover);
  border-color: var(--oi-ink-3);
}

.mobile-currency-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--oi-s2);
  border-top: 1px dashed var(--oi-hairline);
  padding-top: var(--oi-s3);
}

.mobile-currencies {
  display: flex;
}

/* Drawer Transition */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
