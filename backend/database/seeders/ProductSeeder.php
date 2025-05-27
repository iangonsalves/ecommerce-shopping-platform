<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure categories (including clubs) are seeded first
        $this->call(CategorySeeder::class);

        // Get all categories, including the ones created by CategorySeeder
        $categories = Category::all();

        $products = [
            [
                'club' => 'Manchester United',
                'jerseys' => [
                    [
                        'name' => 'Manchester United 2023/2024 Home Jersey',
                        'description' => 'Official Manchester United home jersey for the 2023/2024 season.',
                        'price' => 90.00,
                        'stock' => 50,
                        'image' => 'images/products/manchester_united_home_23:24.jpg',
                        'size_variations' => json_encode(['S', 'M', 'L', 'XL', 'XXL']),
                    ],
                    [
                        'name' => 'Manchester United 2023/2024 Away Jersey',
                        'description' => 'Official Manchester United away jersey for the 2023/2024 season.',
                        'price' => 85.00,
                        'stock' => 40,
                        'image' => 'images/products/manchester_united_away_23:24.jpg',
                        'size_variations' => json_encode(['S', 'M', 'L', 'XL']),
                    ],
                ]
            ],
            [
                'club' => 'Real Madrid',
                'jerseys' => [
                    [
                        'name' => 'Real Madrid 2023/2024 Home Jersey',
                        'description' => 'Official Real Madrid home jersey for the 2023/2024 season.',
                        'price' => 90.00,
                        'stock' => 50,
                        'image' => 'https://placehold.co/400x300?text=RM+Home',
                        'size_variations' => json_encode(['S', 'M', 'L', 'XL', 'XXL']),
                    ],
                    [
                        'name' => 'Real Madrid 2023/2024 Away Jersey',
                        'description' => 'Official Real Madrid away jersey for the 2023/2024 season.',
                        'price' => 85.00,
                        'stock' => 40,
                        'image' => 'https://placehold.co/400x300?text=RM+Away',
                        'size_variations' => json_encode(['S', 'M', 'L', 'XL']),
                    ],
                ]
            ],
            [
                'club' => 'Barcelona',
                'jerseys' => [
                    [
                        'name' => 'Barcelona 2023/2024 Home Jersey',
                        'description' => 'Official Barcelona home jersey for the 2023/2024 season.',
                        'price' => 95.00,
                        'stock' => 30,
                        'image' => 'https://placehold.co/400x300?text=Barca+Home',
                        'size_variations' => json_encode(['S', 'M', 'L']),
                    ],
                    [
                        'name' => 'Barcelona 2023/2024 Away Jersey',
                        'description' => 'Official Barcelona away jersey for the 2023/2024 season.',
                        'price' => 95.00,
                        'stock' => 30,
                        'image' => 'https://placehold.co/400x300?text=Barca+Away',
                        'size_variations' => json_encode(['S', 'M', 'L']),
                    ],
                ]
            ],
            // Add more clubs and their jerseys here
        ];

        foreach ($products as $clubData) {
            $clubName = $clubData['club'];
            $clubCategory = $categories->firstWhere('name', $clubName);

            if ($clubCategory) {
                foreach ($clubData['jerseys'] as $jerseyData) {
                    Product::firstOrCreate(
                        ['name' => $jerseyData['name']],
                        array_merge($jerseyData, ['category_id' => $clubCategory->id])
                    );
                }
            } else {
                $this->command->info("Club category '{$clubName}' not found. Skipping product seeding for this club.");
            }
        }
    }
}
