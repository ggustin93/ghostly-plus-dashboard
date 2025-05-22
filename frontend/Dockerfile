# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code into the container
# For development, the volume mount will override this, but it's good for production builds
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Default command to run the app in development mode
CMD ["npm", "run", "dev"] 