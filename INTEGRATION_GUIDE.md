# Panduan Integrasi Sneat Vuetify ke Laravel 12

Dokumentasi ini menjelaskan langkah-langkah untuk melakukan integrasi **Sneat Vuetify Vue.js Admin Template** ke dalam proyek **Laravel 12**.

## 🚀 Persiapan Awal

Pastikan Anda memiliki:
- Proyek Laravel 12 yang sudah terinstall.
- Source code Sneat Vuetify (Vue.js version).
- Node.js (v18+) dan Composer.

---

## 🛠️ Langkah 1: Instalasi Dependencies

Jalankan perintah berikut di root project Laravel Anda untuk menginstall library yang dibutuhkan:

```bash
# Install Vue dan plugin Vite
npm install vue @vitejs/plugin-vue @vitejs/plugin-vue-jsx vite-plugin-vuetify

# Install Vuetify dan library pendukung
npm install vuetify@3.x.x unplugin-vue-components unplugin-auto-import vite-svg-loader

# Install library tambahan yang digunakan Sneat
npm install pinia vue-router axios @vueuse/core
```

---

## 📁 Langkah 2: Migrasi Aset Front-end

Pindahkan folder-folder berikut dari source template Sneat ke dalam `resources/js/src/`:

1. **@core**: Library inti dari template Sneat.
2. **@layouts**: Sistem layouting template.
3. **assets**: Berisi scss, images, dan fonts.
4. **components**: Komponen global Vue.
5. **pages**: View/Halaman aplikasi.
6. **plugins**: Konfigurasi plugin (vuetify, router, pinia).

Struktur folder hasil migrasi akan terlihat seperti ini:
```text
resources/js/
└── src/
    ├── @core/
    ├── @layouts/
    ├── assets/
    ├── plugins/
    ├── pages/
    └── main.ts
```

---

## ⚙️ Langkah 3: Konfigurasi Vite (`vite.config.ts`)

Buka file `vite.config.ts` dan sesuaikan agar mendukung Vue, Vuetify, dan Alias path.

```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/src/main.ts'],
      refresh: true,
    }),
    vue(),
    vuetify({
      styles: { configFile: 'resources/js/src/assets/styles/variables/_vuetify.scss' }
    }),
    Components({
      dirs: ['resources/js/src/@core/components', 'resources/js/src/components'],
      dts: true,
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./resources/js/src', import.meta.url)),
      '@core': fileURLToPath(new URL('./resources/js/src/@core', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./resources/js/src/@layouts', import.meta.url)),
      '@images': fileURLToPath(new URL('./resources/js/src/assets/images/', import.meta.url)),
      '@styles': fileURLToPath(new URL('./resources/js/src/assets/styles/', import.meta.url)),
    },
  },
})
```

---

## 📄 Langkah 4: Setup Blade & Dashboard Route

### 1. Buat View Utama
Buat file `resources/views/application.blade.php`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sneat - Laravel Admin Template</title>
    @vite(['resources/js/src/main.ts'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

### 2. Konfigurasi Route Laravel
Buka `routes/web.php` dan arahkan semua path frontend ke view tersebut agar Vue Router bisa menghandle routing:

```php
Route::get('/{any?}', function () {
    return view('application');
})->where('any', '.*');
```

---

## 🚀 Langkah 5: Inisialisasi Vue App (`main.ts`)

Buat file `resources/js/src/main.ts` sebagai entry point:

```typescript
import { createApp } from 'vue'
import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'

const app = createApp(App)
registerPlugins(app)
app.mount('#app')
```

---

---

## 🔑 Langkah 6: Backend Integration (API)

Sneat Laravel menggunakan **Laravel Sanctum** untuk autentikasi dan **Spatie Laravel Permission** untuk otorisasi.

1. **AuthController**: Buat controller untuk handling Login, Register, dan Logout via API.
2. **API Routes**: Daftarkan endpoint di `routes/api.php`.
3. **Axios Config**: Sesuaikan `baseUrl` pada `resources/js/src/plugins/axios.ts` agar mengarah ke `/api`.

### Integrasi Menu Dinamis
Sistem ini mendukung menu yang berubah berdasarkan permission user:
- **Menu Model**: Menyimpan data title, icon, path (to), dan permission string.
- **MenuController@userMenus**: Mengambil daftar menu yang hanya boleh dilihat oleh user tersebut.
- **Frontend**: Vue component sidebar akan me-request `/api/menus/user-menus` saat inisialisasi aplikasi.

---

## ➕ Menambahkan Fitur Baru (Contoh: Kanban Board)

Jika ingin menambahkan fitur tambahan yang tidak ada di versi dasar, ikuti workflow berikut:

### 1. Install Library Tambahan
Sebagai contoh, untuk fitur Kanban, kita butuh library drag-and-drop seperti `vuedraggable`:

```bash
npm install vuedraggable@next
```

### 2. Buat Halaman Baru
Buat file di `resources/js/src/pages/kanban.vue`:

```vue
<script setup>
import draggable from 'vuedraggable'
const columns = ref([
  { id: 1, title: 'In Progress', tasks: [{ id: 101, title: 'Code Review' }] },
  { id: 2, title: 'Done', tasks: [{ id: 102, title: 'Task Finish' }] }
])
</script>

<template>
  <div class="kanban-wrapper">
    <VRow>
      <VCol v-for="col in columns" :key="col.id" cols="12" md="4">
        <VCard :title="col.title">
          <draggable v-model="col.tasks" item-key="id">
            <template #item="{ element }">
              <VCardItem class="mb-2 border">{{ element.title }}</VCardItem>
            </template>
          </draggable>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
```

### 3. Daftarkan di Route Vue
Buka `resources/js/src/plugins/router/routes.ts` (atau file router Anda) dan tambahkan route baru:

```typescript
{
  path: '/kanban',
  component: () => import('@/pages/kanban.vue'),
  meta: { action: 'read', subject: 'kanban' }
}
```

### 4. Tambahkan ke Menu Dashboard
Ada dua cara:
- **Hardcoded**: Tambahkan langsung di file `navigation` di folder `@layouts`.
- **Database (Recommended)**: Tambahkan record baru di table `menus` melalui database atau seeder:

```php
// MenuSeeder.php
Menu::create([
    'title' => 'Kanban',
    'icon' => 'bx-grid-alt',
    'to' => '/kanban',
    'permission' => 'kanban.view'
]);
```

---

## �️ Integrasi Maps (Contoh: Leaflet Maps)

Untuk membuat tampilan Maps seperti pada fitur **Logistics Fleet**, kita bisa menggunakan **Leaflet**.

### 1. Install Library Leaflet
Jalankan perintah berikut:

```bash
npm install leaflet @vue-leaflet/vue-leaflet
```

### 2. Impor CSS Leaflet
Sangat penting untuk mengimpor CSS Leaflet agar peta muncul dengan benar. Tambahkan di `resources/js/src/main.ts`:

```typescript
// main.ts
import 'leaflet/dist/leaflet.css';
```

### 3. Buat Halaman Fleet Maps
Buat file di `resources/js/src/pages/fleet.vue`:

```vue
<script setup>
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

const zoom = ref(13);
const center = ref([-6.2088, 106.8456]); // Koordinat Jakarta
const markers = ref([
  { id: 1, latlng: [-6.2088, 106.8456], title: 'Fleet 01' },
  { id: 2, latlng: [-6.2150, 106.8500], title: 'Fleet 02' }
]);
</script>

<template>
  <VCard title="Fleet Tracking">
    <div style="height: 500px; width: 100%">
      <l-map ref="map" v-model:zoom="zoom" :center="center">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>

        <l-marker v-for="m in markers" :key="m.id" :lat-lng="m.latlng">
           <VTooltip activator="parent">{{ m.title }}</VTooltip>
        </l-marker>
      </l-map>
    </div>
  </VCard>
</template>
```

### 4. Tambahkan Menu & Route
Sama seperti langkah Kanban, daftarkan path `/fleet` di router Vue dan tambahkan entry menu `Fleet` di database agar muncul di bawah kategori **Logistics**.

---

## �💡 Tips Tambahan

- **Environment Variables**: Jika menggunakan API yang berbeda domain, sesuaikan `VITE_API_BASE_URL` di file `.env`.
- **Permission Management**: Gunakan package **Spatie Laravel Permission** di sisi backend untuk integrasi role & permission yang mudah.
- **Production Build**: Gunakan `npm run build` sebelum mendeploy ke server.

---

*Dokumentasi ini dibuat untuk membantu proses pengembangan starter kit Sneat-Laravue.*
