# Gunakan image Node.js sebagai dasar
FROM node:16-slim

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json /app/

# Install dependencies
RUN npm install

# Copy seluruh kode aplikasi ke dalam kontainer
COPY . /app/

# Expose port untuk API 
EXPOSE 4100

# Jalankan Express
CMD ["npm", "start"]
