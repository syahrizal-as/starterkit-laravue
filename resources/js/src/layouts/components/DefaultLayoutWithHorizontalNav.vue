<script lang="ts" setup>
import NavItems from '@/layouts/components/NavItems.vue'
import logo from '@images/logo.svg?raw'
import HorizontalNavLayout from '@layouts/components/HorizontalNavLayout.vue'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import NavBarNotification from '@/layouts/components/NavBarNotification.vue'
</script>

<template>
  <HorizontalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar>
      <div class="d-flex h-100 align-center w-100">
        <RouterLink
          to="/"
          class="app-logo app-title-wrapper me-6"
        >
          <div
            class="d-flex"
            v-html="logo"
          />
          <h1 class="app-logo-title">
            sneat
          </h1>
        </RouterLink>

        <!-- 👉 Search -->
        <div
          class="d-flex align-center cursor-pointer ms-lg-n3"
          style="user-select: none;"
        >
          <IconBtn>
            <VIcon icon="bx-search" />
          </IconBtn>

          <span class="d-none d-md-flex align-center text-disabled ms-2">
            <span class="me-2">Search</span>
            <span class="meta-key">&#8984;K</span>
          </span>
        </div>

        <VSpacer />

        <IconBtn
          href="https://github.com/themeselection/sneat-vuetify-vuejs-admin-template-free"
          target="_blank"
          rel="noopener noreferrer"
        >
          <VIcon icon="bxl-github" />
        </IconBtn>

        <NavBarNotification />

        <NavbarThemeSwitcher class="me-1" />

        <UserProfile />
      </div>
    </template>

    <template #horizontal-nav-content>
      <div class="d-flex align-center w-100">
        <NavItems horizontal />
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <ThemeCustomizer />
  </HorizontalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;

  .app-logo-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
    text-transform: uppercase;
  }
}
</style>
