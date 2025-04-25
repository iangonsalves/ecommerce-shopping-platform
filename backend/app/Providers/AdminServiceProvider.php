<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\UserController;

class AdminServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind('App\Http\Controllers\Admin\DashboardController', DashboardController::class);
        $this->app->bind('App\Http\Controllers\Admin\ProductController', ProductController::class);
        $this->app->bind('App\Http\Controllers\Admin\CategoryController', CategoryController::class);
        $this->app->bind('App\Http\Controllers\Admin\OrderController', OrderController::class);
        $this->app->bind('App\Http\Controllers\Admin\UserController', UserController::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
} 