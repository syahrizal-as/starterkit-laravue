import { defineStore } from 'pinia'
import { useTheme } from 'vuetify'

export const useThemeConfigStore = defineStore('themeConfig', () => {
  const theme = useTheme()
  
  const isCustomizerOpen = ref(false)
  const isAppRtl = ref(false)
  const appRouteTransition = ref('fade')
  
  // Layout
  const layout = ref('vertical') // vertical, horizontal
  const contentWidth = ref('fluid') // fluid, boxed
  const isVerticalNavCollapsed = ref(false)
  const isNavbarBlurEnabled = ref(true)
  const isSemiDark = ref(false)
  
  // Theme
  const themeMode = ref('light') // light, dark, system
  const primaryColor = ref('#696CFF')
  const navbarType = ref('sticky') // sticky, static, hidden
  const footerType = ref('static') // sticky, static, hidden
  const skin = ref('default') // default, bordered

  // Watch for theme mode changes
  const applyThemeMode = (val: string) => {
    if (val === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.global.name.value = isDark ? 'dark' : 'light'
    } else {
      theme.global.name.value = val
    }
  }

  watch(themeMode, val => {
    applyThemeMode(val)
    localStorage.setItem('theme-mode', val)
  })

  // Initial theme apply
  onMounted(() => {
    const savedMode = localStorage.getItem('theme-mode')
    if (savedMode) themeMode.value = savedMode
    applyThemeMode(themeMode.value)

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (themeMode.value === 'system') applyThemeMode('system')
    })
  })

  // Watch for primary color changes
  watch(primaryColor, val => {
    theme.themes.value.light.colors.primary = val
    theme.themes.value.dark.colors.primary = val
    localStorage.setItem('primary-color', val)
  })

  onMounted(() => {
    const savedColor = localStorage.getItem('primary-color')
    if (savedColor) primaryColor.value = savedColor
  })

  return {
    isCustomizerOpen,
    isAppRtl,
    appRouteTransition,
    layout,
    contentWidth,
    isVerticalNavCollapsed,
    isNavbarBlurEnabled,
    isSemiDark,
    themeMode,
    primaryColor,
    navbarType,
    footerType,
    skin,
  }
})
