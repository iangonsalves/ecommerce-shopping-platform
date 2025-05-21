<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class ProductManagementTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $category;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create([
            'role' => 'admin'
        ]);

        $this->category = Category::factory()->create();
    }

    /** @test */
    public function test_admin_can_add_product()
    {
        $this->actingAs($this->admin);

        $productData = [
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 99.99,
            'stock' => 100,
            'category_id' => $this->category->id
        ];

        $response = $this->postJson('/api/admin/product-management', $productData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'description',
                    'price',
                    'stock',
                    'category_id',
                    'created_at',
                    'updated_at'
                ]
            ]);

        $this->assertDatabaseHas('products', [
            'name' => 'Test Product',
            'price' => 99.99
        ]);
    }

    /** @test */
    public function test_admin_can_update_product()
    {
        $this->actingAs($this->admin);

        $product = Product::factory()->create([
            'category_id' => $this->category->id
        ]);

        $updateData = [
            'name' => 'Updated Product',
            'description' => 'Updated Description',
            'price' => 149.99,
            'stock' => 50,
            'category_id' => $this->category->id
        ];

        $response = $this->putJson("/api/admin/product-management/{$product->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'description',
                    'price',
                    'stock',
                    'category_id',
                    'created_at',
                    'updated_at'
                ]
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Product',
            'price' => 149.99
        ]);
    }

    /** @test */
    public function test_admin_can_delete_product()
    {
        $this->actingAs($this->admin);

        $product = Product::factory()->create([
            'category_id' => $this->category->id
        ]);

        $response = $this->deleteJson("/api/admin/product-management/{$product->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('products', [
            'id' => $product->id
        ]);
    }

    /** @test */
    public function test_cannot_create_product_with_negative_price()
    {
        $this->actingAs($this->admin);

        $productData = [
            'name' => 'Invalid Product',
            'description' => 'Test Description',
            'price' => -99.99,
            'stock' => 100,
            'category_id' => $this->category->id
        ];

        $response = $this->postJson('/api/admin/product-management', $productData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['price']);
    }
} 