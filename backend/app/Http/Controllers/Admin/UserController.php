<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(
            User::where('id', '!=', auth()->id())
                ->latest()
                ->get()
        );
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|in:admin,customer,manager',
            'status' => 'required|string|in:active,blocked'
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    public function updateStatus(Request $request, User $user)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:active,blocked'
        ]);

        $user->update($validated);

        return response()->json($user);
    }
} 