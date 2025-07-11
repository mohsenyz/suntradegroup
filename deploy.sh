#!/bin/bash

# Load environment variables
source .env.local

echo "Starting deployment process..."

# Build the Next.js application
echo "Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed. Deployment aborted."
    exit 1
fi

echo "Build completed successfully."

echo "Uploading files to FTP server..."

# Use lftp for reliable FTP upload
lftp -c "
set ftp:ssl-allow no
open -u $FTP_USERNAME,$FTP_PASSWORD $FTP_HOST
cd $FTP_REMOTE_DIR
mirror -R --delete --verbose out/ ./
quit
"

if [ $? -eq 0 ]; then
    echo "Files uploaded successfully to $FTP_HOST/$FTP_REMOTE_DIR"
else
    echo "FTP upload failed"
    exit 1
fi

echo "Deployment completed successfully!"