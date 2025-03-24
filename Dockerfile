# Use an official Node.js image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci --force

# Install the latest npm globally (if needed)
RUN npm install -g npm@latest

# Install serve globally
RUN npm install -g serve

# Copy the rest of the application files
COPY . .

# Build the project
RUN npm run build

# Expose frontend and backend ports
EXPOSE 3001

# Serve the frontend
CMD ["serve", "-s", "dist", "-l", "3001"]
