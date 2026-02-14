<script setup lang="ts">
import { useThemeConfigStore } from '@/stores/themeConfig'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const themeConfigStore = useThemeConfigStore()

const colors = [
  { color: '#696CFF', name: 'Primary' },
  { color: '#03C3EC', name: 'Info' },
  { color: '#71DD37', name: 'Success' },
  { color: '#FFAB00', name: 'Warning' },
  { color: '#FF3E1D', name: 'Error' },
  { color: '#8592A3', name: 'Secondary' },
]

const themeModes = [
  { name: 'light', icon: 'bx-sun', label: 'Light' },
  { name: 'dark', icon: 'bx-moon', label: 'Dark' },
  { name: 'system', icon: 'bx-desktop', label: 'System' },
]

const skins = [
  { name: 'default', label: 'Default' },
  { name: 'bordered', label: 'Bordered' },
]

const layouts = [
  { name: 'vertical', label: 'Vertical', icon: 'bx-side-bar' },
  { name: 'collapsed', label: 'Collapsed', icon: 'bx-list-minus' },
  { name: 'horizontal', label: 'Horizontal', icon: 'bx-fullscreen' },
]

const contentWidths = [
  { name: 'compact', label: 'Compact' },
  { name: 'fluid', label: 'Wide' },
]

const resetCustomizer = () => {
  themeConfigStore.themeMode = 'light'
  themeConfigStore.primaryColor = '#696CFF'
  themeConfigStore.skin = 'default'
  themeConfigStore.layout = 'vertical'
  themeConfigStore.contentWidth = 'fluid'
  themeConfigStore.isSemiDark = false
  themeConfigStore.navbarType = 'sticky'
  themeConfigStore.footerType = 'static'
}
</script>

<template>
  <template v-if="!themeConfigStore.isCustomizerOpen">
    <VBtn
      icon
      color="primary"
      class="customizer-trigger"
      @click="themeConfigStore.isCustomizerOpen = true"
    >
      <VIcon icon="bx-cog" />
    </VBtn>
  </template>

  <VNavigationDrawer
    v-model="themeConfigStore.isCustomizerOpen"
    location="right"
    temporary
    width="400"
    class="theme-customizer"
    touchless
  >
    <!-- 👉 Header -->
    <div class="customizer-header d-flex align-center justify-space-between px-6 py-4">
      <div>
        <h4 class="text-h6 font-weight-bold">Theme Customizer</h4>
        <p class="text-body-2 mb-0">Customize & Preview in Real Time</p>
      </div>
      <div class="d-flex align-center gap-2">
        <IconBtn
            color="secondary"
            variant="text"
            @click="resetCustomizer"
        >
            <VIcon icon="bx-refresh" />
        </IconBtn>
        <IconBtn
            color="secondary"
            variant="text"
            @click="themeConfigStore.isCustomizerOpen = false"
        >
            <VIcon icon="bx-x" />
        </IconBtn>
      </div>
    </div>

    <VDivider />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <div class="customizer-body px-6 py-6">
        <!-- 👉 Theming -->
        <div class="mb-8">
          <p class="text-overline mb-4 text-primary">Theming</p>
          
          <!-- Primary Color -->
          <div class="mb-6">
            <p class="text-body-1 mb-3">Primary Color</p>
            <div class="d-flex flex-wrap gap-3">
              <div
                v-for="color in colors"
                :key="color.color"
                class="color-box cursor-pointer d-flex align-center justify-center"
                :class="{ active: themeConfigStore.primaryColor === color.color }"
                :style="{ backgroundColor: color.color }"
                @click="themeConfigStore.primaryColor = color.color"
              >
                <VIcon
                  v-if="themeConfigStore.primaryColor === color.color"
                  icon="bx-check"
                  color="white"
                  size="20"
                />
              </div>
              <div class="color-box cursor-pointer d-flex align-center justify-center border-dashed">
                <VIcon icon="bx-paint" size="20" color="secondary" />
              </div>
            </div>
          </div>

          <!-- Mode -->
          <div class="mb-6">
            <p class="text-body-1 mb-3">Mode</p>
            <div class="d-flex gap-4">
                <div 
                    v-for="mode in themeModes" 
                    :key="mode.name"
                    class="custom-option-item cursor-pointer flex-grow-1 text-center py-4 px-2"
                    :class="{ active: themeConfigStore.themeMode === mode.name }"
                    @click="themeConfigStore.themeMode = mode.name"
                >
                    <VIcon :icon="mode.icon" size="28" class="mb-1" :color="themeConfigStore.themeMode === mode.name ? 'primary' : 'secondary'" />
                    <p class="text-caption mb-0 text-capitalize">{{ mode.label }}</p>
                </div>
            </div>
          </div>

          <!-- Skins -->
          <div class="mb-6">
            <p class="text-body-1 mb-3">Skins</p>
            <div class="d-flex gap-4">
                <div 
                    v-for="skin in skins" 
                    :key="skin.name"
                    class="custom-option-item cursor-pointer flex-grow-1 py-3 px-3"
                    :class="{ active: themeConfigStore.skin === skin.name }"
                    @click="themeConfigStore.skin = skin.name"
                >
                    <!-- Skin SVG representation -->
                    <div class="skin-svg-wrapper mb-2 rounded border transition-all" :class="themeConfigStore.skin === skin.name ? 'border-primary' : 'border-light'">
                        <svg width="100%" height="60" viewBox="0 0 150 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="150" height="60" rx="4" fill="currentColor" opacity="0.1" />
                            <rect x="8" y="8" width="24" height="44" rx="2" fill="currentColor" opacity="0.2" />
                            <rect x="40" y="8" width="102" height="10" rx="2" fill="currentColor" opacity="0.2" />
                            <rect x="40" y="24" width="46" height="28" rx="2" fill="currentColor" opacity="0.15" />
                            <rect x="96" y="24" width="46" height="28" rx="2" fill="currentColor" opacity="0.15" />
                            <rect v-if="skin.name === 'bordered'" x="0.5" y="0.5" width="149" height="59" rx="3.5" stroke="currentColor" />
                        </svg>
                    </div>
                    <p class="text-caption mb-0 text-center">{{ skin.label }}</p>
                </div>
            </div>
          </div>

          <!-- Semi Dark Menu -->
          <div class="d-flex align-center justify-space-between mt-6">
            <p class="text-body-1 mb-0">Semi Dark Menu</p>
            <VSwitch
              v-model="themeConfigStore.isSemiDark"
              color="primary"
              hide-details
            />
          </div>
        </div>

        <VDivider class="mb-8" />

        <!-- 👉 Layout -->
        <div>
          <p class="text-overline mb-4 text-primary">Layout</p>

          <!-- Layout options -->
          <div class="mb-6">
            <p class="text-body-1 mb-3">Layout</p>
            <div class="d-flex gap-3">
                <div 
                    v-for="layout in layouts" 
                    :key="layout.name"
                    class="custom-option-item cursor-pointer flex-grow-1 py-3 px-2"
                    :class="{ active: themeConfigStore.layout === layout.name }"
                    @click="themeConfigStore.layout = layout.name"
                >
                    <div class="layout-svg-wrapper mb-2 rounded border transition-all d-flex align-center justify-center p-1" :class="themeConfigStore.layout === layout.name ? 'border-primary' : 'border-light'" style="height: 60px">
                        <!-- Vertical Layout SVG -->
                        <svg v-if="layout.name === 'vertical'" width="100%" height="100%" viewBox="0 0 140 60" fill="none">
                            <rect width="140" height="60" rx="4" fill="currentColor" opacity="0.05" />
                            <rect x="6" y="6" width="24" height="48" rx="2" fill="currentColor" opacity="0.2" />
                            <rect x="36" y="6" width="98" height="8" rx="2" fill="currentColor" opacity="0.2" />
                            <rect x="36" y="20" width="46" height="34" rx="2" fill="currentColor" opacity="0.1" />
                            <rect x="88" y="20" width="46" height="34" rx="2" fill="currentColor" opacity="0.1" />
                        </svg>
                        <!-- Collapsed Layout SVG -->
                        <svg v-else-if="layout.name === 'collapsed'" width="100%" height="100%" viewBox="0 0 140 60" fill="none">
                            <rect width="140" height="60" rx="4" fill="currentColor" opacity="0.05" />
                            <rect x="6" y="6" width="12" height="48" rx="2" fill="currentColor" opacity="0.2" />
                            <rect x="24" y="6" width="110" height="8" rx="2" fill="currentColor" opacity="0.2" />
                            <rect x="24" y="20" width="52" height="34" rx="2" fill="currentColor" opacity="0.1" />
                            <rect x="82" y="20" width="52" height="34" rx="2" fill="currentColor" opacity="0.1" />
                        </svg>
                        <!-- Horizontal Layout SVG -->
                        <svg v-else width="100%" height="100%" viewBox="0 0 140 60" fill="none">
                            <rect width="140" height="60" rx="4" fill="currentColor" opacity="0.05" />
                            <rect x="6" y="6" width="128" height="8" rx="2" fill="currentColor" opacity="0.2" />
                            <rect x="6" y="18" width="128" height="6" rx="2" fill="currentColor" opacity="0.15" />
                            <rect x="6" y="30" width="60" height="24" rx="2" fill="currentColor" opacity="0.1" />
                            <rect x="74" y="30" width="60" height="24" rx="2" fill="currentColor" opacity="0.1" />
                        </svg>
                    </div>
                    <p class="text-caption mb-0 text-center">{{ layout.label }}</p>
                </div>
            </div>
          </div>

          <!-- Content -->
          <div class="mb-6">
            <p class="text-body-1 mb-3">Content</p>
             <div class="d-flex gap-4">
                <div 
                    v-for="width in contentWidths" 
                    :key="width.name"
                    class="custom-option-item cursor-pointer flex-grow-1 py-3 px-3"
                    :class="{ active: themeConfigStore.contentWidth === width.name }"
                    @click="themeConfigStore.contentWidth = width.name"
                >
                    <div class="width-svg-wrapper mb-2 rounded border transition-all d-flex align-center justify-center" :class="themeConfigStore.contentWidth === width.name ? 'border-primary' : 'border-light'" style="height: 60px">
                        <!-- Compact SVG -->
                        <svg v-if="width.name === 'compact'" width="100%" height="100%" viewBox="0 0 140 60" fill="none">
                            <rect width="140" height="60" rx="4" fill="currentColor" opacity="0.05" />
                            <rect x="25" y="6" width="90" height="48" rx="2" fill="currentColor" opacity="0.15" />
                            <rect x="32" y="12" width="76" height="6" rx="1" fill="currentColor" opacity="0.2" />
                        </svg>
                        <!-- Wide SVG -->
                        <svg v-else width="100%" height="100%" viewBox="0 0 140 60" fill="none">
                            <rect width="140" height="60" rx="4" fill="currentColor" opacity="0.05" />
                            <rect x="8" y="6" width="124" height="48" rx="2" fill="currentColor" opacity="0.15" />
                            <rect x="15" y="12" width="110" height="6" rx="1" fill="currentColor" opacity="0.2" />
                        </svg>
                    </div>
                    <p class="text-caption mb-0 text-center">{{ width.label }}</p>
                </div>
            </div>
          </div>
        </div>

        <VDivider class="mb-8" />
        
        <!-- 👉 AppBar & Footer Type -->
         <div class="mb-6">
            <p class="text-body-1 mb-2">Navbar Type</p>
            <VRadioGroup v-model="themeConfigStore.navbarType" inline hide-details color="primary">
                <VRadio label="Sticky" value="sticky" />
                <VRadio label="Static" value="static" />
                <VRadio label="Hidden" value="hidden" />
            </VRadioGroup>
         </div>

         <div class="mb-6">
            <p class="text-body-1 mb-2">Footer Type</p>
            <VRadioGroup v-model="themeConfigStore.footerType" inline hide-details color="primary">
                <VRadio label="Sticky" value="sticky" />
                <VRadio label="Static" value="static" />
                <VRadio label="Hidden" value="hidden" />
            </VRadioGroup>
         </div>
      </div>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>

<style lang="scss" scoped>
.customizer-trigger {
  position: fixed;
  inset-block-start: 50%;
  inset-inline-end: 0;
  transform: translateY(-50%);
  border-radius: 8px 0 0 8px;
  z-index: 1000;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  animation: pulse 2s infinite;

  &:hover {
    animation: none;
  }
}

@keyframes pulse {
  0% {
    box-shadow: -2px 0 0 0 rgba(var(--v-theme-primary), 0.4);
  }
  70% {
    box-shadow: -2px 0 0 10px rgba(var(--v-theme-primary), 0);
  }
  100% {
    box-shadow: -2px 0 0 0 rgba(var(--v-theme-primary), 0);
  }
}

.color-box {
  block-size: 34px;
  inline-size: 34px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  &.active {
    box-shadow: 0 0 0 2px white, 0 0 0 4px var(--v-theme-primary);
    transform: scale(1.05);
  }

  &.border-dashed {
    border: 1px dashed rgba(var(--v-border-color), var(--v-border-opacity));
  }
}

.custom-option-item {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 8px;
    transition: all 0.2s;
    background-color: var(--v-theme-surface);

    &:hover {
        border-color: rgba(var(--v-theme-primary), 0.5);
    }

    &.active {
        border-color: rgb(var(--v-theme-primary));
        box-shadow: 0 2px 6px rgba(var(--v-theme-primary), 0.1);
    }

    .text-caption {
        font-weight: 500;
        color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    }

    &.active .text-caption {
        color: rgb(var(--v-theme-primary));
    }
}

.border-light {
    border-color: rgba(var(--v-border-color), 0.08) !important;
}

.border-primary {
    border-color: rgb(var(--v-theme-primary)) !important;
}

.theme-customizer {
    :deep(.v-navigation-drawer__content) {
        display: flex;
        flex-direction: column;
    }
}
</style>
