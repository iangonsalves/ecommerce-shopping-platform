<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'parent_id'
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Helper method to get all leagues (top-level categories)
    public function scopeLeagues($query)
    {
        return $query->whereNull('parent_id');
    }

    // Helper method to get all clubs (child categories)
    public function scopeClubs($query)
    {
        return $query->whereNotNull('parent_id');
    }
}
