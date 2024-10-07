# Use the official Node.js image for Nuxt.js
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb files to the container
COPY package.json bun.lockb ./

# Install bun package manager and project dependencies
RUN npm install -g bun && bun install

# Copy the rest of the frontend files
COPY . .

# Copy environment variables file to the container
COPY .env .env

# Install dotenv CLI to load .env file in runtime
RUN npm install -g dotenv-cli

# Build the frontend application
RUN dotenv -e .env bun run build

# Expose the port for the frontend application
EXPOSE 3000

# Start the frontend application with environment variables
CMD ["dotenv", "-e", ".env", "bun", "run", "dev"]
