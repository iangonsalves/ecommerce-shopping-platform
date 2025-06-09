#!/bin/bash

# Echo a message to indicate the script started
echo "Startup script started."

# Run Laravel migrations and optimization at runtime
echo "Running Laravel migrations..."
php artisan migrate --force

echo "Running Laravel optimize:clear..."
php artisan optimize:clear

# Start Supervisor with the specified configuration (using the correct path found during build)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf 