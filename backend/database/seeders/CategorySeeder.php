<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Electronic devices and accessories',
            ],
            [
                'name' => 'Computers',
                'description' => 'Laptops, desktops, and computer accessories',
            ],
            [
                'name' => 'Mobile Phones',
                'description' => 'Smartphones and mobile accessories',
            ],
            [
                'name' => 'Audio',
                'description' => 'Headphones, speakers, and audio equipment',
            ],
            [
                'name' => 'Wearables',
                'description' => 'Smartwatches, fitness trackers, and other wearable devices',
            ],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => Str::slug($category['name'])],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                ]
            );
        }
    }
}
