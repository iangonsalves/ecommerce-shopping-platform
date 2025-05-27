<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;

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
                'role' => 'customer', // Ensure the user has a customer role
            ]
        );

        // Get all available products
        $availableProducts = Product::all();

        // Ensure there are products to create orders with
        if ($availableProducts->isEmpty()) {
            $this->command->info('No products found to create orders. Please run ProductSeeder.');
            return; // Exit if no products are available
        }

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

            // Add a few random products to the order
            // Pick 1 to 3 random products from available products
            $productsForOrder = $availableProducts->random(rand(1, min(3, $availableProducts->count())));
            $totalAmount = 0;

            // Ensure $productsForOrder is a collection even if only one item is picked
            if (!$productsForOrder instanceof \Illuminate\Support\Collection) {
                $productsForOrder = collect([$productsForOrder]);
            }

            foreach ($productsForOrder as $product) {
                $quantity = rand(1, 2);
                $selectedSize = null;
                // Select a random size if variations exist and are not empty
                if ($product->size_variations) {
                    $sizes = json_decode($product->size_variations, true);
                    if (!empty($sizes) && is_array($sizes)) {
                         // Handle both object (assoc array) and indexed array sizes
                         if (array_is_list($sizes)) { // Check if it's an indexed array
                            $selectedSize = $sizes[array_rand($sizes)];
                         } else { // Assume it's an associative array (like from json_encode(['S' => true]))
                            $selectedSize = array_rand($sizes);
                         }
                    }
                }

                $itemPrice = $product->price;
                $totalAmount += $itemPrice * $quantity;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $itemPrice,
                    'product_name' => $product->name,
                    'options' => $selectedSize ? json_encode(['size' => $selectedSize]) : null, // Store selected size in options
                ]);
            }

            // Update the total amount of the order
            $order->update(['total' => $totalAmount]);
        }
    }
}
