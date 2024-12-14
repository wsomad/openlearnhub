# Use Node.js as base image
FROM node:16-alpine

# Define build arguments
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_STORAGE_BUCKET

# Create a .env file with the environment variables
RUN echo "VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY" > .env && \
    echo "VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN" >> .env && \
    echo "VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID" >> .env && \
    echo "VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID" >> .env && \
    echo "VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID" >> .env && \
    echo "VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET" >> .env

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Copy environment file
COPY .env 

# Build the app for production
RUN npm run build

# Expose application port (if needed)
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
