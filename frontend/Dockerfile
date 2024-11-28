# Step 1: Use the latest Node.js image for building the React app
FROM node:latest AS build

# Set the working directory in the container
WORKDIR /app

# Copy only the package.json and yarn.lock to install dependencies
COPY frontend/app/package.json frontend/app/yarn.lock ./

# Validate the Node.js version (Optional but good practice)
RUN node -v && yarn -v

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy all project files to the container
COPY frontend/app /app

# Build the React app in production mode
RUN yarn build

# Step 2: Use the latest NGINX image to serve the built application
FROM nginx:latest

# Set up NGINX configuration (Optional: customize it if needed)
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Copy React build files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default HTTP port
EXPOSE 80

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
