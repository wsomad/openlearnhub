# Use Node.js as base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the app for production
RUN npm run build

# Expose application port (if needed)
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
