    #!/bin/sh

    # Exit immediately if a command exits with a non-zero status.
    set -e

    echo "Executing entrypoint.sh"

    # Run Laravel migrations if the APP_ENV is production (optional, can also run manually)
    # if [ "$APP_ENV" = "production" ]; then
    #     echo "Running migrations..."
    #     php artisan migrate --force
    # fi

    # Execute the main command (Supervisord)
    echo "Starting supervisord..."
    exec /usr/bin/supervisord -c /etc/supervisord/supervisord.conf