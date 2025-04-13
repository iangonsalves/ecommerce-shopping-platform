<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Smartphone X',
                'description' => 'Latest smartphone with advanced features and high-performance camera.',
                'price' => 999.99,
                'stock' => 50,
                'image' => 'https://picsum.photos/400/300?random=1',
            ],
            [
                'name' => 'Laptop Pro',
                'description' => 'Powerful laptop for professionals with long battery life.',
                'price' => 1499.99,
                'stock' => 30,
                'image' => 'https://picsum.photos/400/300?random=2',
            ],
            [
                'name' => 'Wireless Headphones',
                'description' => 'Premium noise-cancelling wireless headphones with superior sound quality.',
                'price' => 299.99,
                'stock' => 100,
                'image' => 'https://picsum.photos/400/300?random=3',
            ],
            [
                'name' => 'Smart Watch',
                'description' => 'Feature-rich smartwatch with health monitoring and notifications.',
                'price' => 199.99,
                'stock' => 75,
                'image' => 'https://picsum.photos/400/300?random=4',
            ],
            [
                'name' => 'Tablet Ultra',
                'description' => 'Versatile tablet perfect for work and entertainment.',
                'price' => 599.99,
                'stock' => 40,
                'image' => 'https://picsum.photos/400/300?random=5',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
