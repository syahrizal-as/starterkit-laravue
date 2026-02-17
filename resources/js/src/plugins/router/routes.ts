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
        meta: { title: 'Dashboard' },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/pages/users/index.vue'),
        meta: { permission: 'user.view', title: 'User Management' },
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/pages/roles/index.vue'),
        meta: { permission: 'role.view', title: 'Role Management' },
      },
      {
        path: 'permissions',
        name: 'permissions',
        component: () => import('@/pages/permissions/index.vue'),
        meta: { permission: 'permission.view', title: 'Permissions' },
      },
      {
        path: 'menus',
        name: 'menus',
        component: () => import('@/pages/menus/index.vue'),
        meta: { permission: 'menu.view', title: 'Menu Management' },
      },
      {
        path: 'account-settings',
        name: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
        meta: { title: 'Account Settings' },
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
        meta: { title: 'Typography' },
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
        meta: { title: 'Icons' },
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
        meta: { title: 'Cards' },
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
        meta: { title: 'Tables' },
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
        meta: { title: 'Form Layouts' },
      },
      {
        path: 'kanban',
        name: 'kanban',
        component: () => import('@/pages/kanban.vue'),
        meta: { title: 'Kanban' },
      },
      {
        path: 'fleet',
        name: 'fleet',
        component: () => import('@/pages/fleet.vue'),
        meta: { title: 'Fleet' },
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
        meta: { guest: true, title: 'Login' },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/register.vue'),
        meta: { guest: true, title: 'Register' },
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
        meta: { title: 'Error' },
      },
    ],
  },
]
