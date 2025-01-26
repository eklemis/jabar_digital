# Use official Python image as a base
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose FastAPI default port
EXPOSE 8000

# Run the FastAPI application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
