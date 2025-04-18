<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Display a listing of the authenticated user's orders.
     */
    public function index()
    {
        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)
                       ->with('items.product') // Eager load items and their products
                       ->latest() // Order by creation date, newest first
                       ->paginate(15); // Paginate results

        return response()->json($orders);
    }

    /**
     * Display the specified order, ensuring the user owns it.
     */
    public function show(Order $order) // Route model binding
    {
        // Check if the authenticated user owns the order
        if (Auth::id() !== $order->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Eager load items and their products for the specific order
        $order->load('items.product');

        return response()->json($order);
    }
}
