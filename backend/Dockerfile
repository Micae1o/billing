# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb files to the container
COPY package.json bun.lockb ./

# Install bun package manager and project dependencies
RUN npm install -g bun && bun install

# Copy the rest of the application files
COPY . .

# Copy environment variables file to the container
COPY .env .env

# Install dotenv CLI to load .env file in runtime
RUN npm install -g dotenv-cli

# Expose the application's port
EXPOSE 4000

# Start the application with dotenv to use environment variables
CMD ["dotenv", "-e", ".env", "bun", "run", "start"]
