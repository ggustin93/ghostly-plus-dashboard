#!/bin/bash

# Script to install the Supabase JS client in the project
# This is needed to run the create_storage_buckets.js script

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is required but not installed. Please install Node.js and npm."
    exit 1
fi

# Move to the project root directory
cd "$(dirname "$0")/../.." || exit 1

# Install @supabase/supabase-js as a dev dependency
echo "Installing @supabase/supabase-js..."
npm install --save-dev @supabase/supabase-js

echo "Installation complete."
echo "You can now run the create_storage_buckets.js script with:"
echo "node docs/environments/create_storage_buckets.js" 