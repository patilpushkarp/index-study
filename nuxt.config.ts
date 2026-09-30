// https://nuxt.com/docs/api/configuration/nuxt-config
const indexRoutes = [
  'sp500',
  'nasdaq100',
  'djia',
  'russell2000',
  'tsx',
  'bovespa',
  'ftse100',
  'dax40',
  'cac40',
  'eurostoxx50',
  'nifty50',
  'sensex',
  'nikkei225',
  'hangseng',
  'csi300',
  'asx200',
  'tasi',
  'jse40'
].map(id => `/indices/${id}`)

const rawBase = process.env.NUXT_APP_BASE_URL || '/'
const appBaseURL = rawBase.endsWith('/') ? rawBase : `${rawBase}/`

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false, // SPA / Static generation for seamless GitHub Pages deployment

  app: {
    baseURL: appBaseURL,
    head: {
      title: 'Global Index Study — World Stock Market Indices',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Tracking, valuations, constituents, and comparative analytics for major global stock market indices.' },
        { name: 'theme-color', content: '#181411' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${appBaseURL}favicon.svg` },
        { rel: 'preconnect', href: 'https://api.fontshare.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Fragment+Mono:ital@0;1&display=swap' }
      ]
    }
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/compare',
        '/valuations',
        '/correlation',
        '/crisis',
        '/macro',
        '/screen',
        '/learn',
        '/disclaimer',
        '/terms',
        '/privacy',
        '/404',
        ...indexRoutes
      ]
    }
  },

  css: ['~/assets/css/main.css']
})
