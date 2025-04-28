<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index(Product $product)
    {
        return response()->json(
            $product->reviews()
                ->with('user:id,name')
                ->latest()
                ->get()
        );
    }

    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        // Check if user has already reviewed this product
        $existingReview = $product->reviews()
            ->where('user_id', Auth::id())
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this product'
            ], 422);
        }

        // Check if user has purchased the product
        $hasPurchased = Order::where('user_id', Auth::id())
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })
            ->where('status', 'completed')
            ->exists();

        $review = $product->reviews()->create([
            'user_id' => Auth::id(),
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'verified_purchase' => $hasPurchased
        ]);

        return response()->json($review->load('user:id,name'), 201);
    }

    public function update(Request $request, Product $product, Review $review)
    {
        // Check if the review belongs to the authenticated user
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        $review->update($validated);

        return response()->json($review->load('user:id,name'));
    }

    public function destroy(Product $product, Review $review)
    {
        // Check if the review belongs to the authenticated user
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete();

        return response()->json(null, 204);
    }
} 