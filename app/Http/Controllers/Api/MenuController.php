<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;

class MenuController extends Controller
{
    /**
     * Get all menus (paginated for admin)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Menu::with(['parent', 'roles', 'children']);

        // Search
        if ($request->has('search') && $request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Filter by parent
        if ($request->has('parent_id')) {
            if ($request->parent_id === 'root') {
                $query->whereNull('parent_id');
            } else {
                $query->where('parent_id', $request->parent_id);
            }
        }

        // Sorting
        $sortBy = $request->get('sortBy', 'order');
        $sortOrder = $request->get('sortOrder', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('perPage', 10);
        $menus = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $menus
        ]);
    }

    /**
     * Get menu tree structure
     */
    public function tree(): JsonResponse
    {
        $menus = Menu::with(['children' => function ($query) {
            $query->orderBy('order');
        }, 'roles'])
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $menus
        ]);
    }

    /**
     * Get menus for current user (based on permissions)
     */
    public function userMenus(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Get all user permissions (including from roles)
        $permissionNames = $user->getAllPermissions()->pluck('name')->toArray();
        
        // Check if user is super-admin
        $isSuperAdmin = $user->hasRole('super-admin');

        $menus = Menu::getMenusForPermissions($permissionNames, $isSuperAdmin);

        return response()->json([
            'success' => true,
            'data' => $menus
        ]);
    }

    /**
     * Get list of menus for dropdown (parent selection)
     */
    public function list(): JsonResponse
    {
        $menus = Menu::select('id', 'title', 'parent_id')
            ->where('is_section_title', false)
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $menus
        ]);
    }

    /**
     * Store a new menu
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'nullable|string|max:100',
            'to' => 'nullable|string|max:255',
            'href' => 'nullable|string|max:255',
            'target' => 'nullable|in:_self,_blank',
            'parent_id' => 'nullable|exists:menus,id',
            'order' => 'nullable|integer',
            'is_section_title' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'permission' => 'nullable|string|max:255',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $menu = Menu::create($request->only([
            'title', 'icon', 'to', 'href', 'target', 
            'parent_id', 'order', 'is_section_title', 
            'is_active', 'permission'
        ]));

        // Sync roles
        if ($request->has('roles')) {
            $menu->roles()->sync($request->roles);
        }

        return response()->json([
            'success' => true,
            'message' => 'Menu created successfully',
            'data' => $menu->load(['roles', 'parent'])
        ], 201);
    }

    /**
     * Get a single menu
     */
    public function show(Menu $menu): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $menu->load(['roles', 'parent', 'children'])
        ]);
    }

    /**
     * Update a menu
     */
    public function update(Request $request, Menu $menu): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'nullable|string|max:100',
            'to' => 'nullable|string|max:255',
            'href' => 'nullable|string|max:255',
            'target' => 'nullable|in:_self,_blank',
            'parent_id' => 'nullable|exists:menus,id',
            'order' => 'nullable|integer',
            'is_section_title' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'permission' => 'nullable|string|max:255',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        // Prevent setting self as parent
        if ($request->parent_id == $menu->id) {
            return response()->json([
                'success' => false,
                'message' => 'Menu cannot be its own parent'
            ], 422);
        }
        

        $menu->update($request->only([
            'title', 'icon', 'to', 'href', 'target', 
            'parent_id', 'order', 'is_section_title', 
            'is_active', 'permission'
        ]));

        // Sync roles
        if ($request->has('roles')) {
            $menu->roles()->sync($request->roles);
        }

        return response()->json([
            'success' => true,
            'message' => 'Menu updated successfully',
            'data' => $menu->load(['roles', 'parent'])
        ]);
    }

    /**
     * Delete a menu
     */
    public function destroy(Menu $menu): JsonResponse
    {
        // Children will be deleted via cascade
        $menu->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu deleted successfully'
        ]);
    }

    /**
     * Reorder menus
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'menus' => 'required|array',
            'menus.*.id' => 'required|exists:menus,id',
            'menus.*.order' => 'required|integer',
        ]);

        foreach ($request->menus as $menuData) {
            Menu::where('id', $menuData['id'])->update(['order' => $menuData['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Menus reordered successfully'
        ]);
    }
}
