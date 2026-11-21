import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import type { Theme } from 'vitepress'
import ParticleCanvas from './ParticleCanvas.vue'
import HomeHeroImage from './HomeHeroImage.vue'
import { data as noteSidebar } from './sidebar.data.mts'
import './custom.css'

export default {
  extends: DefaultTheme,

  enhanceApp({ siteData }) {
    const site = siteData.value
    siteData.value = { ...site, themeConfig: { ...site.themeConfig, sidebar: noteSidebar } }
  },

  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 粒子画布注入到 layout 最底层（全局显示）
      'layout-top': () => h(ParticleCanvas),

      // 首页 hero image 插槽，替换为自定义圆形浮动头像
      'home-hero-image': () => h(HomeHeroImage),
    })
  },
} satisfies Theme
