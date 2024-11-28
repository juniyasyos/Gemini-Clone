# Step 1: Use the latest Node.js image for building the React app
FROM node:latest AS build

# Set the working directory in the container
WORKDIR /app

# Install dependencies (package.json dan yarn.lock)
COPY app/package.json app/yarn.lock ./

# Validate the Node.js version (Optional but good practice)
RUN node -v && yarn -v

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the entire frontend app ke dalam container
COPY app /app

# Build the React app in production mode
RUN yarn build

# Step 2: Use the latest NGINX image to serve the built application
FROM nginx:latest

# Set up NGINX configuration (Optional: customize it if needed)
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Copy React build files dari tahap build sebelumnya
COPY --from=build /app/dict /usr/share/nginx/html

# Expose the default HTTP port
EXPOSE 80

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
