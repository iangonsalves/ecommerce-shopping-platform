<?php

namespace App\Http\Controllers;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::with('items.product')
            ->where('user_id', Auth::id())
            ->first();

        if (!$cart) {
            $cart = Cart::create([
                'user_id' => Auth::id(),
                'total' => 0
            ]);
        }

        return response()->json($cart);
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'options' => 'nullable|array',
            ]);

        $cart = Cart::firstOrCreate(
            ['user_id' => Auth::id()],
            ['total' => 0]
        );

        $product = Product::findOrFail($request->product_id);
        
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->whereRaw('options::jsonb = ?::jsonb', [
                json_encode($request->input('options')) ?? '{}'
            ])
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'price' => $product->price,
                'options' => $request->input('options'),
            ]);
        }

        $this->updateCartTotal($cart);

        return response()->json([
            'message' => 'Item added to cart',
            'cart' => $cart->load('items.product')
        ]);
    }

    public function updateItem(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem->update([
            'quantity' => $request->quantity
        ]);

        $this->updateCartTotal($cartItem->cart);

        return response()->json([
            'message' => 'Cart updated',
            'cart' => $cartItem->cart->load('items.product')
        ]);
    }

    public function removeItem(CartItem $cartItem)
    {
        $cart = $cartItem->cart;
        $cartItem->delete();
        
        $this->updateCartTotal($cart);

        return response()->json([
            'message' => 'Item removed from cart',
            'cart' => $cart->load('items.product')
        ]);
    }

    private function updateCartTotal(Cart $cart)
    {
        $total = $cart->items->sum(function ($item) {
            return $item->quantity * $item->price;
        });

        $cart->update(['total' => $total]);
    }
} 