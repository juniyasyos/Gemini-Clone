# Gunakan image dasar Python
FROM python:3.9-slim

# Set working directory di dalam kontainer
WORKDIR /app

# Copy file requirements.txt ke dalam kontainer
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy seluruh kode aplikasi ke dalam kontainer
COPY . /app/

# Expose port untuk API
EXPOSE 8000

# Menjalankan aplikasi FastAPI dengan Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
