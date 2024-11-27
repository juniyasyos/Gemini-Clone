# Step 1: Use the latest Node.js image for building the React app
FROM node:latest AS build

# Set the working directory in the container
WORKDIR /app

# Install only production dependencies when possible for optimization
COPY app/package.json app/package-lock.json ./

# Validate the Node.js version (Optional but good practice)
RUN node -v && npm -v

# Install dependencies
RUN npm ci --production=false

# Copy all project files to the container
COPY . .

# Build the React app in production mode
RUN npm run build

# Step 2: Use the latest NGINX image to serve the built application
FROM nginx:latest

# Set up NGINX configuration (Optional: customize it if needed)
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Copy React build files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Ensure minimal logging for optimized container size
RUN rm -rf /var/cache/apk/*

# Expose the default HTTP port
EXPOSE 80

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
