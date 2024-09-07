#!/bin/bash

# Update packages
sudo apt update

# Install Node.js and npm
sudo apt install -y nodejs npm

# Verify installation
node -v
npm -v
