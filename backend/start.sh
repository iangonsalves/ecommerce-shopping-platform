#!/bin/bash

# Echo a message to indicate the script started
echo "Startup script started."

# Start Supervisor with the specified configuration
exec /usr/sbin/supervisord -c /etc/supervisor/conf.d/supervisord.conf 