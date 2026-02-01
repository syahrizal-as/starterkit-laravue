<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User management
            'user.view',
            'user.create',
            'user.edit',
            'user.delete',
            
            // Role management
            'role.view',
            'role.create',
            'role.edit',
            'role.delete',
            
            // Permission management
            'permission.view',
            'permission.create',
            'permission.edit',
            'permission.delete',

            // Menu management
            'menu.view',
            'menu.create',
            'menu.edit',
            'menu.delete',
            
            // Dashboard
            'dashboard.view',
            'dashboard.statistics',
            
            // Settings
            'settings.view',
            'settings.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles and assign permissions
        
        // Super Admin - has all permissions
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => 'web']);
        $superAdminRole->givePermissionTo(Permission::all());

        // Admin - has most permissions except permission management
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->givePermissionTo([
            'user.view',
            'user.create',
            'user.edit',
            'user.delete',
            'role.view',
            'role.create',
            'role.edit',
            'role.delete',
            'dashboard.view',
            'dashboard.statistics',
            'settings.view',
            'settings.edit',
        ]);

        // Manager - limited permissions
        $managerRole = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $managerRole->givePermissionTo([
            'user.view',
            'dashboard.view',
            'dashboard.statistics',
            'settings.view',
        ]);

        // User - basic permissions
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);
        $userRole->givePermissionTo([
            'dashboard.view',
        ]);

        // Create default users
        
        // Super Admin User
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
            ]
        );
        $superAdmin->assignRole('super-admin');

        // Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
            ]
        );
        $admin->assignRole('admin');

        // Manager User
        $manager = User::firstOrCreate(
            ['email' => 'manager@example.com'],
            [
                'name' => 'Manager User',
                'password' => Hash::make('password'),
            ]
        );
        $manager->assignRole('manager');

        // Regular User
        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('password'),
            ]
        );
        $user->assignRole('user');

        $this->command->info('Roles and permissions seeded successfully!');
        $this->command->info('');
        $this->command->info('Default users created:');
        $this->command->info('- superadmin@example.com (password: password) - Role: super-admin');
        $this->command->info('- admin@example.com (password: password) - Role: admin');
        $this->command->info('- manager@example.com (password: password) - Role: manager');
        $this->command->info('- user@example.com (password: password) - Role: user');
    }
}
