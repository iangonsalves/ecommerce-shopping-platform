<?php

namespace Database\Seeders;

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
            // Premier League
            [
                'name' => 'Premier League',
                'description' => 'English Premier League Teams',
                'clubs' => [
                    'Manchester United',
                    // Add other Premier League clubs here ONLY if you have seeded products for them in ProductSeeder
                ]
            ],
            // La Liga
            [
                'name' => 'La Liga',
                'description' => 'Spanish La Liga Teams',
                'clubs' => [
                    'Barcelona',
                    'Real Madrid',
                    // Add other La Liga clubs here ONLY if you have seeded products for them in ProductSeeder
                ]
            ],
            // Bundesliga
            [
                'name' => 'Bundesliga',
                'description' => 'German Bundesliga Teams',
                'clubs' => [
                     // Add Bundesliga clubs here ONLY if you have seeded products for them in ProductSeeder
                ]
            ]
            // Add more leagues and clubs here ONLY if you have seeded products for the clubs you include
        ];

        foreach ($categories as $category) {
            $leagueCategory = Category::firstOrCreate(
                ['slug' => Str::slug($category['name'])],
                [
                    'name' => $category['name'],
                    'description' => $category['description']
                ]
            );

            // Create club categories as children of the league
            foreach ($category['clubs'] as $clubName) {
                Category::firstOrCreate(
                    ['slug' => Str::slug($clubName)],
                    [
                        'name' => $clubName,
                        'description' => "$clubName Official Football Jerseys",
                        'parent_id' => $leagueCategory->id
                    ]
                );
            }
        }
    }
}
