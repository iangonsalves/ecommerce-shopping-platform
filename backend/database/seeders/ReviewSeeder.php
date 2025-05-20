<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Product;
use App\Models\User;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $users = User::all();

        foreach ($products as $product) {
            // Create a few reviews for each product
            for ($i = 0; $i < 3; $i++) {
                $user = $users->random();
                Review::firstOrCreate(
                    ['user_id' => $user->id, 'product_id' => $product->id],
                    [
                        'rating' => rand(1, 5),
                        'comment' => 'This is a sample review for ' . $product->name . '.',
                    ]
                );
            }
        }
    }
}
