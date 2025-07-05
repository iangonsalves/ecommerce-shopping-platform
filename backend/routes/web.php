<?php

use Illuminate\Support\Facades\Route;

// Remove welcome page and replace with API status endpoint
Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Alex Jersey Hub API is running',
        'version' => '1.0.0'
    ]);
});
