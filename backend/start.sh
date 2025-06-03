#!/bin/bash

# Echo a message to indicate the script started
echo "Startup script started."

# Check if supervisord exists and show its details
ls -l /usr/sbin/supervisord

# Start Supervisor with the specified configuration (using the correct path found during build)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf 