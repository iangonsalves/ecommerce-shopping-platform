<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));
dd('After LARAVEL_START'); // TEMPORARY DEBUG

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}
dd('After Maintenance Check'); // TEMPORARY DEBUG

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';
dd('After Autoload'); // TEMPORARY DEBUG

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';
dd('After Bootstrap'); // TEMPORARY DEBUG

$response = $app->handleRequest(Request::capture());
dd('After Handle Request'); // TEMPORARY DEBUG

$response->send();

$app->terminate();
