# Use Node 20 as base
FROM node:20-alpine

# Set working directory
WORKDIR /var/www/html/frontend

# Copy package.json and package-lock.json
COPY ../package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY ../ ./

# Expose Vite default port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]