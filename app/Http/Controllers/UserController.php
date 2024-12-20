<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getUsers(Request $request)
    {
        try {
            // Start with base query
            $query = User::query();

            // search
            if ($request->has('username')) {
                $query->where('username', 'like', '%' . $request->input('username') . '%');
            }

            // Sorting
            $sortBy = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            
            // Validate sort column to prevent potential SQL injection
            $allowedSortColumns = ['id', 'username', 'created_at', 'updated_at'];
            $sortBy = in_array($sortBy, $allowedSortColumns) ? $sortBy : 'created_at';
            $sortDirection = in_array(strtolower($sortDirection), ['asc', 'desc']) ? $sortDirection : 'desc';

            $query->orderBy($sortBy, $sortDirection);

            // Pagination
            $perPage = $request->input('per_page', 10);
            $perPage = max(1, min($perPage, 100)); // Ensure between 1 and 100

            $users = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'data' => $users->items(),
                'meta' => [
                    'current_page' => $users->currentPage(),
                    'total_pages' => $users->lastPage(),
                    'total_items' => $users->total(),
                    'per_page' => $users->perPage()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while retrieving categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
