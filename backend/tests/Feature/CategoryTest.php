<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class CategoryTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create([
            'role' => 'admin'
        ]);
    }

    /** @test */
    public function test_admin_can_create_category()
    {
        $this->actingAs($this->admin);

        $categoryData = [
            'name' => 'New Category',
            'description' => 'Category Description'
        ];

        $response = $this->postJson('/api/admin/category-management', $categoryData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'name',
                'description',
                'created_at',
                'updated_at'
            ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'New Category'
        ]);
    }

    /** @test */
    public function test_admin_can_update_category()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();

        $updateData = [
            'name' => 'Updated Category',
            'description' => 'Updated Description'
        ];

        $response = $this->putJson("/api/admin/category-management/{$category->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'name',
                'description',
                'created_at',
                'updated_at'
            ]);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Category'
        ]);
    }

    /** @test */
    public function test_admin_can_delete_category()
    {
        $this->actingAs($this->admin);

        $category = Category::factory()->create();

        $response = $this->deleteJson("/api/admin/category-management/{$category->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id
        ]);
    }

    public function test_can_list_categories()
    {
        $response = $this->get('/api/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name'
                    ]
                ]
            ]);
    }

    public function test_can_get_category_with_products()
    {
        $category = \App\Models\Category::factory()->create();
        $product = \App\Models\Product::factory()->create(['category_id' => $category->id]);

        $response = $this->get("/api/categories/{$category->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'products' => [
                        '*' => [
                            'id',
                            'name',
                            'price'
                        ]
                    ]
                ]
            ]);
    }
}