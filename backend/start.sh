#!/bin/bash

# Echo a message to indicate the script started
echo "Startup script started."

# Run Laravel optimization, migrations, and seeding at runtime
echo "Running Laravel optimize:clear..."
php artisan optimize:clear

echo "Running Laravel migrations..."
php artisan migrate --force

echo "Running Laravel database seeders... (REMOVE AFTER INITIAL SEEDING)"
php artisan db:seed

# Start Supervisor with the specified configuration (using the correct path found during build)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf 