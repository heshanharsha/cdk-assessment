FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the application code
COPY TestApp .

# Install the required packages
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose the port that the application runs on
EXPOSE 8000

WORKDIR /app/testapp

RUN chmod +x start.sh

# Start the application
CMD ["./start.sh"]
