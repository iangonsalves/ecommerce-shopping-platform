<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        return response()->json(
            Review::with(['user:id,name,email', 'product:id,name'])
                ->latest()
                ->get()
        );
    }

    public function show(Review $review)
    {
        return response()->json(
            $review->load(['user:id,name,email', 'product:id,name'])
        );
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return response()->json(null, 204);
    }
} 