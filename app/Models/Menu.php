<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Models\Role;

class Menu extends Model
{
    protected $fillable = [
        'title',
        'icon',
        'to',
        'href',
        'target',
        'parent_id',
        'order',
        'is_section_title',
        'is_active',
        'permission',
    ];

    protected $casts = [
        'is_section_title' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get the parent menu
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    /**
     * Get child menus
     */
    public function children(): HasMany
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('order');
    }

    /**
     * Get roles that have access to this menu
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'menu_role');
    }

    /**
     * Scope to get only active menus
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only root menus (no parent)
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Get menus accessible by user permissions
     */
    public static function getMenusForPermissions(array $permissionNames, bool $isSuperAdmin = false): array
    {
        $menus = self::with(['children' => function ($query) {
            $query->active()->orderBy('order');
        }])
            ->active()
            ->root()
            ->orderBy('order')
            ->get();

        return self::filterMenusByPermissions($menus, $permissionNames, $isSuperAdmin);
    }

    /**
     * Filter menus by permissions
     */
    private static function filterMenusByPermissions($menus, array $permissionNames, bool $isSuperAdmin): array
    {
        $result = [];

        foreach ($menus as $menu) {
            // Check if user has access to this menu
            $requiredPermission = $menu->permission;
            
            // Super-admin has access to everything
            // If no permission required, menu is public
            // If permission required, check if user has it
            $hasAccess = $isSuperAdmin || 
                         empty($requiredPermission) || 
                         in_array($requiredPermission, $permissionNames);
            
            if ($hasAccess) {
                $menuData = [
                    'id' => $menu->id,
                    'title' => $menu->title,
                    'icon' => $menu->icon,
                    'to' => $menu->to,
                    'href' => $menu->href,
                    'target' => $menu->target,
                    'is_section_title' => $menu->is_section_title,
                    'permission' => $menu->permission,
                    'children' => [],
                ];

                // Process children
                if ($menu->children->isNotEmpty()) {
                    $menuData['children'] = self::filterMenusByPermissions($menu->children, $permissionNames, $isSuperAdmin);
                }

                // Only add menu if it has children or is a valid menu item
                if (!empty($menuData['children']) || $menu->to || $menu->href || $menu->is_section_title) {
                    $result[] = $menuData;
                }
            }
        }

        return $result;
    }
}
