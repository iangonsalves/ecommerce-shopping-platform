<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use App\Models\Category;
use App\Models\Review;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function stats()
    {
        Log::info('Fetching admin dashboard stats');
        
        $productsCount = Product::count();
        $usersCount = User::where('role', '!=', 'admin')->count();
        $ordersCount = Order::count();
        $categoriesCount = Category::count();
        $reviewsCount = Review::count();
        
        Log::info('Stats counts:', [
            'products' => $productsCount,
            'users' => $usersCount,
            'orders' => $ordersCount,
            'categories' => $categoriesCount,
            'reviews' => $reviewsCount
        ]);

        $stats = [
            'products' => $productsCount,
            'users' => $usersCount,
            'orders' => $ordersCount,
            'categories' => $categoriesCount,
            'reviews' => $reviewsCount,
        ];

        return response()->json($stats);
    }
} 