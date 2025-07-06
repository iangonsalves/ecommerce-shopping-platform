<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// League and Club routes (replacing general category routes)
Route::get('/leagues', [CategoryController::class, 'index']); // Lists all leagues
Route::get('/leagues/{league}', [CategoryController::class, 'show']); // Show league details
Route::get('/leagues/{league}/clubs', [CategoryController::class, 'getClubsByLeague']); // Get clubs in a league
Route::get('/clubs/{club}', [CategoryController::class, 'show']); // Show club details

// // Keep the old category routes for backward compatibility
// Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
// Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);

    
    // Cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::put('/cart/items/{cartItem}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{cartItem}', [CartController::class, 'removeItem']);
    
    // Order routes
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    
    // Checkout and payment routes
    Route::post('/checkout', [CheckoutController::class, 'placeOrder']);
    Route::post('/create-payment-intent', [PaymentController::class, 'createPaymentIntent']);
    
     // Review routes
     Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);
     Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);
     Route::put('/products/{product}/reviews/{review}', [ReviewController::class, 'update']);
     Route::delete('/products/{product}/reviews/{review}', [ReviewController::class, 'destroy']);
});

// Admin Routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [DashboardController::class, 'stats']);
    
    // Products Management
    Route::get('/product-management', [AdminProductController::class, 'index']);
    Route::post('/product-management', [AdminProductController::class, 'store']);
    Route::put('/product-management/{product}', [AdminProductController::class, 'update']);
    Route::delete('/product-management/{product}', [AdminProductController::class, 'destroy']);
    
    // Categories Management
    Route::get('/category-management', [AdminCategoryController::class, 'index']);
    Route::post('/category-management', [AdminCategoryController::class, 'store']);
    Route::put('/category-management/{category}', [AdminCategoryController::class, 'update']);
    Route::delete('/category-management/{category}', [AdminCategoryController::class, 'destroy']);
    
    // Orders Management
    Route::get('/order-management', [AdminOrderController::class, 'index']);
    Route::get('/order-management/{order}', [AdminOrderController::class, 'show']);
    Route::put('/order-management/{order}/status', [AdminOrderController::class, 'updateStatus']);
    
    // Users Management
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::put('/users/{user}', [AdminUserController::class, 'update']);
    Route::put('/users/{user}/status', [AdminUserController::class, 'updateStatus']);

    // Reviews Management
    Route::get('/review-management', [AdminReviewController::class, 'index']);
    Route::get('/review-management/{review}', [AdminReviewController::class, 'show']);
    Route::delete('/review-management/{review}', [AdminReviewController::class, 'destroy']);
});

// Health check endpoint for Render
Route::get('/healthz', function () {
    return response()->json(['status' => 'ok'], 200);
});