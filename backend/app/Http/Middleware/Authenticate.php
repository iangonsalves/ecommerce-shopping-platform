<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if ($request->expectsJson()) {
            return null; // This will result in a 401 response for API requests
        }
        
        // Since we're using a SPA, we'll return null to send a 401 response
        // instead of redirecting to a login route
        return null;
    }
} 