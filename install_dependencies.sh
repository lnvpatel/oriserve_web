#!/bin/bash

# Define the directory where you expect to deploy the application
DEPLOY_DIR="/var/www/html"

# Check if the directory exists
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "Directory $DEPLOY_DIR does not exist. Creating it..."
    mkdir -p "$DEPLOY_DIR"
fi

# Navigate to the deployment directory
cd "$DEPLOY_DIR"

# Install production dependencies
sudo npm install --production
