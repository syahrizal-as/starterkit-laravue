<script lang="ts">
import { useDisplay } from 'vuetify'
import VerticalNav from '@layouts/components/VerticalNav.vue'
import { useThemeConfigStore } from '@/stores/themeConfig'

export default defineComponent({
  setup(props, { slots }) {
    const isOverlayNavActive = ref(false)
    const isLayoutOverlayVisible = ref(false)
    const toggleIsOverlayNavActive = useToggle(isOverlayNavActive)
    const themeConfigStore = useThemeConfigStore()

    const route = useRoute()
    const { mdAndDown } = useDisplay()

    // ℹ️ This is alternative to below two commented watcher
    // We want to show overlay if overlay nav is visible and want to hide overlay if overlay is hidden and vice versa.
    syncRef(isOverlayNavActive, isLayoutOverlayVisible)

    return () => {
      // 👉 Vertical nav
      const verticalNav = h(
        VerticalNav,
        { 
          isOverlayNavActive: isOverlayNavActive.value, 
          toggleIsOverlayNavActive,
          // Collapse support
          class: [
            themeConfigStore.layout === 'collapsed' && 'collapsed',
            themeConfigStore.isSemiDark && 'semi-dark'
          ]
        },
        {
          'nav-header': () => slots['vertical-nav-header']?.({ toggleIsOverlayNavActive }),
          'before-nav-items': () => slots['before-vertical-nav-items']?.(),
          'default': () => slots['vertical-nav-content']?.(),
          'after-nav-items': () => slots['after-vertical-nav-items']?.(),
        },
      )

      // 👉 Navbar
      const navbar = h(
        'header',
        { 
          class: [
            'layout-navbar', 
            themeConfigStore.isNavbarBlurEnabled && 'navbar-blur'
          ] 
        },
        [
          h(
            'div',
            { class: 'navbar-content-container' },
            slots.navbar?.({
              toggleVerticalOverlayNavActive: toggleIsOverlayNavActive,
            }),
          ),
        ],
      )

      const main = h(
        'main',
        { class: 'layout-page-content' },
        h('div', { class: 'page-content-container' }, slots.default?.()),
      )

      // 👉 Footer
      const footer = h(
        'footer',
        { class: 'layout-footer' },
        [
          h(
            'div',
            { class: 'footer-content-container' },
            slots.footer?.(),
          ),
        ],
      )

      // 👉 Overlay
      const layoutOverlay = h(
        'div',
        {
          class: ['layout-overlay', { visible: isLayoutOverlayVisible.value }],
          onClick: () => { isLayoutOverlayVisible.value = !isLayoutOverlayVisible.value },
        },
      )

      return h(
        'div',
        {
          class: [
            'layout-wrapper',
            `layout-nav-type-${themeConfigStore.layout === 'collapsed' ? 'vertical' : themeConfigStore.layout}`,
            themeConfigStore.layout === 'collapsed' && 'layout-vertical-nav-collapsed',
            `layout-navbar-${themeConfigStore.navbarType}`,
            `layout-footer-${themeConfigStore.footerType}`,
            `layout-content-width-${themeConfigStore.contentWidth}`,
            themeConfigStore.skin === 'bordered' && 'skin--bordered',
            mdAndDown.value && 'layout-overlay-nav',
            route.meta.layoutWrapperClasses,
          ],
        },
        [
          verticalNav,
          h(
            'div',
            { class: 'layout-content-wrapper' },
            [
              navbar,
              main,
              footer,
            ],
          ),
          layoutOverlay,
        ],
      )
    }
  },
})
</script>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/placeholders";
@use "@layouts/styles/mixins";

.layout-wrapper.layout-nav-type-vertical {
  // TODO(v2): Check why we need height in vertical nav & min-height in horizontal nav
  block-size: 100%;

  .layout-content-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-block-size: 100dvh;
    transition: padding-inline-start 0.2s ease-in-out;
    will-change: padding-inline-start;

    @media screen and (min-width: 1280px) {
      padding-inline-start: variables.$layout-vertical-nav-width;
    }
  }

  .layout-navbar {
    z-index: variables.$layout-vertical-nav-layout-navbar-z-index;

    .navbar-content-container {
      block-size: variables.$layout-vertical-nav-navbar-height;
    }

    @at-root {
      .layout-wrapper.layout-nav-type-vertical {
        .layout-navbar {
          @if variables.$layout-vertical-nav-navbar-is-contained {
            @include mixins.boxed-content;
          }

          // else
          @else {
            .navbar-content-container {
              @include mixins.boxed-content;
            }
          }
        }
      }
    }
  }

  &.layout-navbar-sticky .layout-navbar {
    @extend %layout-navbar-sticky;
  }

  &.layout-navbar-hidden .layout-navbar {
    @extend %layout-navbar-hidden;
  }

  // 👉 Footer
  .layout-footer {
    @include mixins.boxed-content;
  }

  // 👉 Layout overlay
  .layout-overlay {
    position: fixed;
    z-index: variables.$layout-overlay-z-index;
    background-color: rgb(0 0 0 / 60%);
    cursor: pointer;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease-in-out;
    will-change: opacity;

    &.visible {
      opacity: 1;
      pointer-events: auto;
    }
  }

  // Adjust right column pl when vertical nav is collapsed
  &.layout-vertical-nav-collapsed .layout-content-wrapper {
    @media screen and (min-width: 1280px) {
      padding-inline-start: variables.$layout-vertical-nav-collapsed-width;
    }
  }

  // 👉 Content height fixed
  &.layout-content-height-fixed {
    .layout-content-wrapper {
      max-block-size: 100dvh;
    }

    .layout-page-content {
      display: flex;
      overflow: hidden;

      .page-content-container {
        inline-size: 100%;

        > :first-child {
          max-block-size: 100%;
          overflow-y: auto;
        }
      }
    }
  }
}

// 👉 Skin: Bordered
.layout-wrapper.skin--bordered {
  .layout-navbar,
  .layout-vertical-nav,
  .layout-footer {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    box-shadow: none !important;
  }

  .layout-navbar {
    border-block-start: none;
    border-inline: none;
  }

  .layout-vertical-nav {
    border-block: none;
    border-inline-start: none;

    &.scrolled {
      .vertical-nav-items-shadow {
        display: none !important;
      }
    }
  }

  .layout-footer {
    border-block-end: none;
    border-inline: none;
  }
}
</style>
