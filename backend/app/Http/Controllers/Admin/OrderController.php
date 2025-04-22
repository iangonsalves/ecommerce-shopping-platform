<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(
            Order::with(['user', 'items.product'])
                ->latest()
                ->get()
        );
    }

    public function show(Order $order)
    {
        return response()->json(
            $order->load(['user', 'items.product'])
        );
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,completed,cancelled'
        ]);

        $order->update($validated);

        return response()->json($order->load(['user', 'items.product']));
    }
} 