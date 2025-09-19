# Use Node.js 22.12.0 as the base image
FROM node:22.12.0

# Set app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# Expose backend port (if needed)
EXPOSE 3001

# Default command (will be overridden by docker-compose)
CMD ["npm", "start"]
