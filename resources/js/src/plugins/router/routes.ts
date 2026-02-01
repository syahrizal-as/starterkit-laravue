export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/pages/users/index.vue'),
        meta: { permission: 'user.view' },
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/pages/roles/index.vue'),
        meta: { permission: 'role.view' },
      },
      {
        path: 'permissions',
        name: 'permissions',
        component: () => import('@/pages/permissions/index.vue'),
        meta: { permission: 'permission.view' },
      },
      {
        path: 'menus',
        name: 'menus',
        component: () => import('@/pages/menus/index.vue'),
        meta: { permission: 'menu.view' },
      },
      {
        path: 'account-settings',
        name: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/login.vue'),
        meta: { guest: true },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/register.vue'),
        meta: { guest: true },
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
