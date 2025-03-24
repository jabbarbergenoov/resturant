#Use the Node.js base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm cache clean --force && npm install --force

RUN npm install -g npm@latest

RUN npm install --force

# Install serve globally
RUN npm i -g serve

# Copy the rest of the files
COPY . .

# Build the project
RUN npm run build

# Expose the correct port
EXPOSE 3001
EXPOSE 8000

# Run the app using 'serve' and explicitly set the port
CMD [ "serve", "-s", "dist", "-l", "3001" ]