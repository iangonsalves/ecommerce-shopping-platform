<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        $teamTypes = ['home', 'away', 'third'];
        
        return [
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'stock' => $this->faker->numberBetween(0, 100),
            'image' => $this->faker->imageUrl(400, 300),
            'category_id' => Category::factory(),
            'size_variations' => json_encode(array_combine($sizes, array_fill(0, count($sizes), true))),
            'season' => '2023/24',
            'team_type' => $this->faker->randomElement($teamTypes),
        ];
    }
}
