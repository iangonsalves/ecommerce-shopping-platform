<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;

class CartTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_add_item_to_cart()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        
        $this->actingAs($user);
        
        $response = $this->post('/api/cart/items', [
            'product_id' => $product->id,
            'quantity' => 2
        ]);

        $response->assertStatus(200);
        
        $cart = Cart::where('user_id', $user->id)->first();
        $this->assertDatabaseHas('cart_items', [
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2
        ]);
    }

    public function test_user_can_update_cart_quantity()
    {
        $user = User::factory()->create();
        $cart = Cart::factory()->create(['user_id' => $user->id]);
        $cartItem = CartItem::factory()->create(['cart_id' => $cart->id]);
        
        $this->actingAs($user);
        
        $response = $this->put("/api/cart/items/{$cartItem->id}", [
            'quantity' => 3
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 3
        ]);
    }

    public function test_user_can_remove_cart_item()
    {
        $user = User::factory()->create();
        $cart = Cart::factory()->create(['user_id' => $user->id]);
        $cartItem = CartItem::factory()->create(['cart_id' => $cart->id]);
        
        $this->actingAs($user);
        
        $response = $this->delete("/api/cart/items/{$cartItem->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('cart_items', [
            'id' => $cartItem->id
        ]);
    }
}