<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductPriceTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = \App\Models\User::factory()->create([
            'role' => 'admin'
        ]);
    }

    public function test_can_create_product_with_valid_price()
    {
        $product = Product::factory()->create([
            'price' => 99.99
        ]);

        $this->assertEquals(99.99, $product->price);
    }

    public function test_cannot_create_product_with_negative_price()
    {
        $this->actingAs($this->admin);

        $response = $this->postJson('/api/admin/product-management', [
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => -10.00,
            'stock' => 10,
            'category_id' => \App\Models\Category::factory()->create()->id
        ]);

        $response->assertStatus(422);
    }

    public function test_can_update_product_price()
    {
        $this->actingAs($this->admin);
        
        $product = Product::factory()->create([
            'price' => 100.00
        ]);

        $response = $this->putJson("/api/admin/product-management/{$product->id}", [
            'name' => $product->name,
            'description' => $product->description,
            'price' => 150.00,
            'stock' => $product->stock,
            'category_id' => $product->category_id
        ]);

        $response->assertStatus(200);
        $this->assertEquals(150.00, $product->fresh()->price);
    }

    public function test_price_is_stored_with_correct_precision()
    {
        $product = Product::factory()->create([
            'price' => 99.99
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'price' => 99.99
        ]);
    }
}