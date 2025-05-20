<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_add_product()
    {
        // Assuming you have a way to authenticate as an admin
        $this->actingAs($this->createAdminUser());

        $response = $this->post('/api/products', [
            'name' => 'Test Product',
            'description' => 'This is a test product.',
            'price' => 99.99,
            'category_id' => 1,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('products', [
            'name' => 'Test Product',
        ]);
    }

    public function test_admin_can_update_product()
    {
        $this->actingAs($this->createAdminUser());

        $product = $this->createProduct();

        $response = $this->put("/api/products/{$product->id}", [
            'name' => 'Updated Product',
            'description' => 'This is an updated product.',
            'price' => 149.99,
            'category_id' => 1,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('products', [
            'name' => 'Updated Product',
        ]);
    }

    public function test_admin_can_delete_product()
    {
        $this->actingAs($this->createAdminUser());

        $product = $this->createProduct();

        $response = $this->delete("/api/products/{$product->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }

    private function createAdminUser()
    {
        // Create and return an admin user
        return \App\Models\User::factory()->create(['role' => 'admin']);
    }

    private function createProduct()
    {
        // Create and return a product
        return \App\Models\Product::factory()->create();
    }
} 