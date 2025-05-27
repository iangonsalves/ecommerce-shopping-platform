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
                        'rating' => rand(4, 5), // Generally positive reviews for seeded data
                        'comment' => $this->generateJerseyReviewComment($product->name),
                    ]
                );
            }
        }
    }

    /**
     * Generate a sample review comment for a jersey.
     */
    protected function generateJerseyReviewComment(string $productName): string
    {
        $comments = [
            "Absolutely love the {$productName}! Great fit and quality material.",
            "Fantastic jersey, feels very authentic. The design is superb.",
            "Got this {$productName} as a gift and it's perfect. Comfortable to wear.",
            "High quality jersey, worth the price. The colors are vibrant.",
            "Really happy with my purchase of the {$productName}. Fits true to size.",
            "Excellent detail on this {$productName}. A must-have for fans.",
        ];

        return $comments[array_rand($comments)];
    }
}
