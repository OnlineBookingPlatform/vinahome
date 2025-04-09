// plugins/zindex.ts
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.provide(ZINDEX_INJECTION_KEY, { current: 2000 })
    nuxtApp.vueApp.provide(ID_INJECTION_KEY, {
      prefix: Math.floor(Math.random() * 10000),
      current: 0,
    })
  })
