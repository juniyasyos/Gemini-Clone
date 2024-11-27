# Gunakan image Node.js terbaru
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy file dependency
COPY package*.json /app/

# Install dependencies
RUN npm install

# Salin semua file proyek
COPY . /app/

# Expose port untuk API
EXPOSE 4100

# Jalankan aplikasi
CMD ["node", "app/app.js"]
