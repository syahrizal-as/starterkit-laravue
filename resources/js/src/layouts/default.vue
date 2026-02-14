<script lang="ts" setup>
import { useThemeConfigStore } from '@/stores/themeConfig'
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue'
import DefaultLayoutWithHorizontalNav from './components/DefaultLayoutWithHorizontalNav.vue'

const themeConfigStore = useThemeConfigStore()
</script>

<template>
  <template v-if="themeConfigStore.layout === 'horizontal'">
    <DefaultLayoutWithHorizontalNav>
      <RouterView />
    </DefaultLayoutWithHorizontalNav>
  </template>
  <template v-else>
    <DefaultLayoutWithVerticalNav>
      <RouterView />
    </DefaultLayoutWithVerticalNav>
  </template>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
