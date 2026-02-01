<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of permissions
     */
    public function index(Request $request)
    {
        $query = Permission::query();

        // Search
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by group (based on permission name prefix)
        if ($request->has('group') && $request->group) {
            $query->where('name', 'like', $request->group . '%');
        }

        // Sorting
        $sortBy = $request->get('sortBy', 'name');
        $sortOrder = $request->get('sortOrder', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('perPage', 10);
        $permissions = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $permissions
        ]);
    }

    /**
     * Store a newly created permission
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
        ]);

        $permission = Permission::create([
            'name' => $request->name,
            'guard_name' => 'web',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Permission created successfully',
            'data' => $permission
        ], 201);
    }

    /**
     * Display the specified permission
     */
    public function show(Permission $permission)
    {
        return response()->json([
            'success' => true,
            'data' => $permission->load('roles')
        ]);
    }

    /**
     * Update the specified permission
     */
    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
        ]);

        $permission->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Permission updated successfully',
            'data' => $permission
        ]);
    }

    /**
     * Remove the specified permission
     */
    public function destroy(Permission $permission)
    {
        $permission->delete();

        return response()->json([
            'success' => true,
            'message' => 'Permission deleted successfully'
        ]);
    }

    /**
     * Get all permissions for dropdown/select
     */
    public function list()
    {
        $permissions = Permission::select('id', 'name')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $permissions
        ]);
    }

    /**
     * Get permissions grouped by module/prefix
     */
    public function grouped()
    {
        $permissions = Permission::orderBy('name')->get();
        
        $grouped = $permissions->groupBy(function ($permission) {
            $parts = explode('.', $permission->name);
            return $parts[0] ?? 'general';
        });

        return response()->json([
            'success' => true,
            'data' => $grouped
        ]);
    }

    /**
     * Bulk create permissions
     */
    public function bulkStore(Request $request)
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'required|string|max:255',
        ]);

        $created = [];
        $skipped = [];

        foreach ($request->permissions as $permissionName) {
            $exists = Permission::where('name', $permissionName)->exists();
            
            if (!$exists) {
                $permission = Permission::create([
                    'name' => $permissionName,
                    'guard_name' => 'web',
                ]);
                $created[] = $permission;
            } else {
                $skipped[] = $permissionName;
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Bulk permission creation completed',
            'data' => [
                'created' => $created,
                'skipped' => $skipped,
            ]
        ], 201);
    }
}
