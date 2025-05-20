<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a user if not exists
        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        // Create a few sample orders
        for ($i = 0; $i < 3; $i++) {
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'completed',
                'total' => 0, // Will be updated after adding items
                'shipping_first_name' => 'John',
                'shipping_last_name' => 'Doe',
                'shipping_address1' => '123 Main St',
                'shipping_city' => 'Anytown',
                'shipping_state' => 'CA',
                'shipping_zip' => '12345',
                'shipping_country' => 'USA',
                'shipping_phone' => '123-456-7890',
            ]);

            // Add a few products to the order
            $products = Product::inRandomOrder()->take(2)->get();
            $totalAmount = 0;

            foreach ($products as $product) {
                $quantity = rand(1, 3);
                $totalAmount += $product->price * $quantity;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                    'product_name' => $product->name,
                ]);
            }

            // Update the total amount of the order
            $order->update(['total' => $totalAmount]);
        }
    }
}
