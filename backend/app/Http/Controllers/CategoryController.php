<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'data' => Category::with(['products', 'children'])->leagues()->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id'
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category = Category::create($validated);
        return response()->json(['data' => $category], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Category $category = null)
    {
        // Attempt to get the ID from route parameters, checking both 'league' and 'club'
        $categoryId = $request->route('league') ?? $request->route('club');
        Log::info('ID from route parameter (league or club):', ['id' => $categoryId]);

        // If route model binding failed, try to find the category manually using the obtained ID
        if (!$category && $categoryId) {
             $category = Category::find($categoryId);
             Log::info('Category found manually:', ['category' => $category ? $category->toArray() : null]);
        }

        // If category is still null, log and return error
        if (!$category) {
             Log::warning('Category not found for ID:', ['id' => $categoryId]);
             return response()->json(['message' => 'Category not found'], 404);
        }

        // Now load relationships 
        $category->load(['products', 'children', 'parent']);
        
        // Log the category object with loaded relationships again
        Log::info('Category object after load:', ['category' => $category->toArray()]);
        
        return response()->json([
            'data' => $category
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'string',
            'price' => 'numeric|min:0',
            'stock' => 'integer|min:0',
            'image' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);
        return response()->json(['data' => $category]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(null, 204);
    }

    /**
     * Get clubs by league.
     */
    public function getClubsByLeague(Category $league)
    {
        return response()->json([
            'data' => $league->children()->with('products')->get()
        ]);
    }
}
