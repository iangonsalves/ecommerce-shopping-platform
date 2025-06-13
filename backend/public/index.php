<?php

echo "TEST MESSAGE"; // TEMPORARY DEBUG

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

try {
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

    $response = $app->handleRequest(Request::capture());

    $response->send();

    $app->terminate();
} catch (Throwable $e) {
    error_log("Caught Fatal Exception in index.php: " . $e->getMessage() . "\n" . $e->getTraceAsString(), 3, "/dev/stderr");
    http_response_code(500);
    die("500 Server Error: Unhandled Exception. Details in logs (hopefully): " . $e->getMessage() . "\n" . $e->getTraceAsString());
}
