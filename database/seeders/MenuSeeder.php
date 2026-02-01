<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Menu;
use Spatie\Permission\Models\Role;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get roles
        $superAdmin = Role::findByName('super-admin');
        $admin = Role::findByName('admin');
        $manager = Role::findByName('manager');
        $user = Role::findByName('user');

        // Dashboard - accessible by all
        $dashboard = Menu::create([
            'title' => 'Dashboard',
            'icon' => 'bx-home-smile',
            'to' => '/dashboard',
            'order' => 1,
        ]);

        // Access Management Section
        $accessSection = Menu::create([
            'title' => 'Access Management',
            'is_section_title' => true,
            'order' => 2,
        ]);
        $accessSection->roles()->sync([$superAdmin->id, $admin->id]);

        // Access Management Group
        $accessManagement = Menu::create([
            'title' => 'Access Management',
            'icon' => 'bx-shield-quarter',
            'order' => 3,
        ]);
        $accessManagement->roles()->sync([$superAdmin->id, $admin->id]);

        // Users
        Menu::create([
            'title' => 'Users',
            'to' => '/users',
            'parent_id' => $accessManagement->id,
            'permission' => 'user.view',
            'order' => 1,
        ]);

        // Roles
        Menu::create([
            'title' => 'Roles',
            'to' => '/roles',
            'parent_id' => $accessManagement->id,
            'permission' => 'role.view',
            'order' => 2,
        ]);

        // Permissions
        Menu::create([
            'title' => 'Permissions',
            'to' => '/permissions',
            'parent_id' => $accessManagement->id,
            'permission' => 'permission.view',
            'order' => 3,
        ]);

        // Menus
        Menu::create([
            'title' => 'Menus',
            'to' => '/menus',
            'parent_id' => $accessManagement->id,
            'permission' => 'menu.view',
            'order' => 4,
        ]);

        // Settings Section
        $settingsSection = Menu::create([
            'title' => 'Settings',
            'is_section_title' => true,
            'order' => 4,
        ]);

        // Account Settings - accessible by all authenticated users
        Menu::create([
            'title' => 'Account Settings',
            'icon' => 'bx-cog',
            'to' => '/account-settings',
            'order' => 5,
        ]);

        // UI Section
        $uiSection = Menu::create([
            'title' => 'User Interface',
            'is_section_title' => true,
            'order' => 6,
        ]);

        // Typography
        Menu::create([
            'title' => 'Typography',
            'icon' => 'bx-text',
            'to' => '/typography',
            'order' => 7,
        ]);

        // Icons
        Menu::create([
            'title' => 'Icons',
            'icon' => 'bx-package',
            'to' => '/icons',
            'order' => 8,
        ]);

        // Cards
        Menu::create([
            'title' => 'Cards',
            'icon' => 'bx-credit-card',
            'to' => '/cards',
            'order' => 9,
        ]);

        // Forms & Tables Section
        $formsSection = Menu::create([
            'title' => 'Forms & Tables',
            'is_section_title' => true,
            'order' => 10,
        ]);

        // Form Layouts
        Menu::create([
            'title' => 'Form Layouts',
            'icon' => 'bx-layout',
            'to' => '/form-layouts',
            'order' => 11,
        ]);

        // Tables
        Menu::create([
            'title' => 'Tables',
            'icon' => 'bx-table',
            'to' => '/tables',
            'order' => 12,
        ]);

        // Others Section
        $othersSection = Menu::create([
            'title' => 'Others',
            'is_section_title' => true,
            'order' => 13,
        ]);

        // Documentation
        Menu::create([
            'title' => 'Documentation',
            'icon' => 'bx-file',
            'href' => 'https://demos.themeselection.com/sneat-vuetify-vuejs-admin-template/documentation/',
            'target' => '_blank',
            'order' => 14,
        ]);
    }
}
