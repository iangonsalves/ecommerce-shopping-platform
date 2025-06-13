<?php

// TEMPORARY DEBUG: Check if APP_KEY is set very early
if (!isset($_ENV['APP_KEY']) || empty($_ENV['APP_KEY'])) {
    echo "<h1>Error: APP_KEY is not set or is empty!</h1>";
    echo "<p>Please ensure APP_KEY is configured as an environment variable in your Render dashboard.</p>";
    exit;
}

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());

$app->terminate();
