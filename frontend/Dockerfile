# Step 1: Gunakan image Node.js terbaru untuk membangun aplikasi React
FROM node:latest AS build

# Set working directory di dalam container
WORKDIR /app

# Salin file dependensi (package.json dan yarn.lock)
COPY app/package.json app/yarn.lock /app/

# Validasi versi Node.js dan Yarn (opsional tapi baik untuk praktik terbaik)
RUN node -v && yarn -v

# Install dependensi menggunakan yarn
RUN yarn install --frozen-lockfile

# Salin seluruh aplikasi React ke dalam container
COPY app /app

# Bangun aplikasi React dalam mode produksi
RUN yarn build

# Step 2: Gunakan image NGINX untuk menyajikan aplikasi yang sudah dibangun
FROM nginx:latest

# Salin konfigurasi NGINX yang telah disiapkan
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Salin build React dari tahap build sebelumnya ke direktori NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Expose port HTTP default (80)
EXPOSE 80

# Jalankan NGINX di foreground
CMD ["nginx", "-g", "daemon off;"]
