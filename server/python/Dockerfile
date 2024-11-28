# Gunakan image Python terbaru
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy file dependency
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy semua file proyek
COPY . /app/

# Expose port untuk FastAPI
EXPOSE 8000

# Jalankan aplikasi menggunakan Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "172.1.0.0", "--port", "8000"]
