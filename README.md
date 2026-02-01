# Sneat Laravel Vue - Admin Dashboard

Admin dashboard modern menggunakan Laravel 12 + Vue.js 3 + Vuetify 3 dengan sistem Role & Permission Management.

![Laravel](https://img.shields.io/badge/Laravel-12-red?style=flat-square&logo=laravel)
![Vue.js](https://img.shields.io/badge/Vue.js-3-green?style=flat-square&logo=vue.js)
![Vuetify](https://img.shields.io/badge/Vuetify-3-blue?style=flat-square&logo=vuetify)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)

## ✨ Features

- 🔐 **Authentication** - Login, Register, Logout dengan Laravel Sanctum
- 👥 **User Management** - CRUD Users dengan role assignment
- 🛡️ **Role Management** - CRUD Roles dengan permission assignment
- 🔑 **Permission Management** - CRUD Permissions
- 📋 **Dynamic Menu** - Menu management dengan permission-based visibility
- 🌙 **Dark/Light Mode** - Theme switcher
- 📱 **Responsive** - Mobile-friendly design
- 🎨 **Modern UI** - Vuetify 3 + Boxicons

## 📋 Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL / PostgreSQL / SQLite

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/username/sneat-laravel.git
cd sneat-laravel
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Database

Edit file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_vue
DB_USERNAME=root
DB_PASSWORD=
```

### 5. Run Migrations & Seeders

```bash
# Run migrations
php artisan migrate

# Seed database dengan data default (roles, permissions, users, menus)
php artisan db:seed
```

**Atau jalankan seeder terpisah:**

```bash
php artisan db:seed --class=RolePermissionSeeder
php artisan db:seed --class=MenuSeeder
```

### 6. Run Application

```bash
# Terminal 1 - Run Laravel server
php artisan serve

# Terminal 2 - Run Vite dev server
npm run dev
```

Buka browser dan akses: `http://localhost:8000`

## 👤 Default Users

| Email | Password | Role |
|-------|----------|------|
| superadmin@example.com | password | Super Admin |
| admin@example.com | password | Admin |
| manager@example.com | password | Manager |
| user@example.com | password | User |

## 🔑 Default Permissions

### User Management
- `user.view` - View users
- `user.create` - Create users
- `user.edit` - Edit users
- `user.delete` - Delete users

### Role Management
- `role.view` - View roles
- `role.create` - Create roles
- `role.edit` - Edit roles
- `role.delete` - Delete roles

### Permission Management
- `permission.view` - View permissions
- `permission.create` - Create permissions
- `permission.edit` - Edit permissions
- `permission.delete` - Delete permissions

### Menu Management
- `menu.view` - View menus
- `menu.create` - Create menus
- `menu.edit` - Edit menus
- `menu.delete` - Delete menus

## 📁 Project Structure

```
sneat-laravel/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── AuthController.php
│   │           ├── UserController.php
│   │           ├── RoleController.php
│   │           ├── PermissionController.php
│   │           └── MenuController.php
│   └── Models/
│       ├── User.php
│       └── Menu.php
├── database/
│   ├── migrations/
│   └── seeders/
│       ├── RolePermissionSeeder.php
│       └── MenuSeeder.php
├── resources/
│   └── js/
│       └── src/
│           ├── components/
│           ├── layouts/
│           ├── pages/
│           │   ├── users/
│           │   ├── roles/
│           │   ├── permissions/
│           │   └── menus/
│           ├── services/
│           ├── stores/
│           └── plugins/
│               └── router/
└── routes/
    └── api.php
```

## 🛠️ API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login |
| POST | `/api/logout` | Logout |
| GET | `/api/me` | Get current user |
| POST | `/api/refresh` | Refresh token |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (paginated) |
| POST | `/api/users` | Create user |
| GET | `/api/users/{id}` | Get user by ID |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Delete user |

### Roles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/roles` | Get all roles (paginated) |
| GET | `/api/roles/list` | Get all roles (dropdown) |
| POST | `/api/roles` | Create role |
| GET | `/api/roles/{id}` | Get role by ID |
| PUT | `/api/roles/{id}` | Update role |
| DELETE | `/api/roles/{id}` | Delete role |

### Permissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/permissions` | Get all permissions (paginated) |
| GET | `/api/permissions/list` | Get all permissions (dropdown) |
| POST | `/api/permissions` | Create permission |
| GET | `/api/permissions/{id}` | Get permission by ID |
| PUT | `/api/permissions/{id}` | Update permission |
| DELETE | `/api/permissions/{id}` | Delete permission |

### Menus
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menus` | Get all menus (paginated) |
| GET | `/api/menus/tree` | Get menus as tree |
| GET | `/api/menus/user-menus` | Get menus for current user |
| GET | `/api/menus/list` | Get menus for dropdown |
| POST | `/api/menus` | Create menu |
| GET | `/api/menus/{id}` | Get menu by ID |
| PUT | `/api/menus/{id}` | Update menu |
| DELETE | `/api/menus/{id}` | Delete menu |
| POST | `/api/menus/reorder` | Reorder menus |

## 🔧 Development Commands

```bash
# Run Laravel dev server
php artisan serve

# Run Vite dev server
npm run dev

# Build for production
npm run build

# Clear all cache
php artisan optimize:clear

# Fresh migration with seeding
php artisan migrate:fresh --seed
```

## 📝 How Menu Permission Works

1. **Tanpa Permission** - Menu terlihat oleh semua user yang login
2. **Dengan Permission** - Hanya user dengan permission tersebut yang bisa melihat menu
3. **Super Admin** - Selalu bisa melihat semua menu

Contoh:
- Menu "Users" dengan permission `user.view` → hanya user dengan `user.view` yang bisa lihat
- Menu "Dashboard" tanpa permission → semua user bisa lihat

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🙏 Credits

- [Sneat Vuetify Vue.js Admin Template](https://themeselection.com/item/sneat-vuetify-vuejs-admin-template/)
- [Laravel](https://laravel.com)
- [Vue.js](https://vuejs.org)
- [Vuetify](https://vuetifyjs.com)
- [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission)
