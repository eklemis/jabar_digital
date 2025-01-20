# Use official Node.js image as base
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies first before copying the rest
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose application port
EXPOSE ${PORT}

# Command to run database migrations before starting the application
CMD ["sh", "-c", "npm run migrate:up && npm start"]
