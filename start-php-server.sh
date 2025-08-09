#!/bin/bash

echo "Starting PHP development server on port 8080..."
cd api
php -S localhost:8080 &
echo "PHP server started with PID: $!"
echo "Server running at: http://localhost:8080"

# Store PID for cleanup
echo $! > php-server.pid