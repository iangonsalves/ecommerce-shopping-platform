<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class OrderTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $admin;
    protected $user;
    protected $category;
    protected $product;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create([
            'role' => 'admin'
        ]);

        $this->user = User::factory()->create([
            'role' => 'customer'
        ]);

        $this->category = Category::factory()->create();
        $this->product = Product::factory()->create([
            'category_id' => $this->category->id
        ]);
    }

    /** @test */
    public function test_admin_can_view_orders()
    {
        $this->actingAs($this->admin);

        $response = $this->getJson('/api/admin/order-management');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'user_id',
                    'status',
                    'total',
                    'created_at',
                    'updated_at'
                ]
            ]);
    }

    /** @test */
    public function test_admin_can_update_order_status()
    {
        $this->actingAs($this->admin);

        $order = Order::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending'
        ]);

        $updateData = [
            'status' => 'processing'
        ];

        $response = $this->putJson("/api/admin/order-management/{$order->id}/status", $updateData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'status',
                'updated_at'
            ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'processing'
        ]);
    }

    /** @test */
    public function test_user_can_view_own_orders()
    {
        $this->actingAs($this->user);

        // Create an order for the user
        $order = Order::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'pending'
        ]);

        $response = $this->getJson('/api/orders');

        $response->assertStatus(200);
        
        // Get the response data and check the order
        $responseData = $response->json('data');
        $this->assertCount(1, $responseData);
        $this->assertEquals($order->id, $responseData[0]['id']);
        $this->assertEquals($this->user->id, $responseData[0]['user_id']);
        $this->assertEquals('pending', $responseData[0]['status']);
    }
}