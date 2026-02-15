// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  modules: ['@nuxtjs/tailwindcss'],
  nitro: {
    preset: 'cloudflare-module',
    storage: {
      r2: {
        driver: 'cloudflare-r2-binding',
        binding: 'R2'
      }
    }
  },
  app: {
    head: {
      title: 'heycurcus — CV gratuit pour étudiants',
      meta: [
        { name: 'description', content: 'Créez un CV professionnel optimisé ATS en quelques minutes. 100% gratuit pour les étudiants et jeunes diplômés.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:title', content: 'heycurcus — CV gratuit pour étudiants' },
        { property: 'og:description', content: 'Créez un CV professionnel optimisé ATS en quelques minutes. 100% gratuit.' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  }
})
