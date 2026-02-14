<script lang="ts">
import { useDisplay } from 'vuetify'
import { useThemeConfigStore } from '@/stores/themeConfig'

export default defineComponent({
  setup(props, { slots }) {
    const themeConfigStore = useThemeConfigStore()
    const { mdAndDown } = useDisplay()

    return () => {
      // 👉 Navbar
      const navbar = h(
        'header',
        { 
          class: [
            'layout-navbar navbar-horizontal', 
            themeConfigStore.isNavbarBlurEnabled && 'navbar-blur'
          ] 
        },
        [
          h(
            'div',
            { class: 'navbar-content-container' },
            slots.navbar?.(),
          ),
        ],
      )

      // 👉 Horizontal Nav
      const horizontalNav = h(
        'div',
        { class: 'layout-horizontal-nav' },
        [
            h(
                'div',
                { class: 'horizontal-nav-content-container' },
                slots['horizontal-nav-content']?.(),
            )
        ]
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

      return h(
        'div',
        {
          class: [
            'layout-wrapper',
            'layout-nav-type-horizontal',
            `layout-navbar-${themeConfigStore.navbarType}`,
            `layout-footer-${themeConfigStore.footerType}`,
            `layout-content-width-${themeConfigStore.contentWidth}`,
            themeConfigStore.skin === 'bordered' && 'skin--bordered',
            mdAndDown.value && 'layout-overlay-nav',
          ],
        },
        [
          navbar,
          horizontalNav,
          h(
            'div',
            { class: 'layout-content-wrapper' },
            [
              main,
              footer,
            ],
          ),
        ],
      )
    }
  },
})
</script>

<style lang="scss">
@use "@configured-variables" as variables;
@use "@layouts/styles/mixins";

.layout-wrapper.layout-nav-type-horizontal {
  display: flex;
  flex-direction: column;
  min-block-size: 100dvh;

  .layout-navbar {
    z-index: variables.$layout-horizontal-nav-layout-navbar-z-index;
    
    .navbar-content-container {
      @include mixins.boxed-content;
      block-size: variables.$layout-vertical-nav-navbar-height;
      display: flex;
      align-items: center;
    }
  }

  // 👉 Tabs
  .layout-horizontal-nav {
    z-index: variables.$layout-horizontal-nav-z-index;
    background-color: rgb(var(--v-theme-surface));
    box-shadow: 0 4px 8px -4px rgba(0,0,0,0.1);

    .horizontal-nav-content-container {
        @include mixins.boxed-content;
        block-size: 54px;
        display: flex;
        align-items: center;
    }
  }

  &.layout-navbar-sticky .layout-navbar {
    @include mixins.boxed-content(true);
    position: sticky;
    top: 0;
    z-index: variables.$layout-horizontal-nav-layout-navbar-z-index;
  }

  &.layout-navbar-hidden .layout-navbar {
    display: none;
  }

  // 👉 Footer
  .layout-footer {
    @include mixins.boxed-content;
  }

  &.layout-footer-sticky .layout-footer {
    position: sticky;
    bottom: 0;
  }

  &.layout-footer-hidden .layout-footer {
    display: none;
  }
}
</style>
