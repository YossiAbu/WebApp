# Use an official Python runtime as a parent image
FROM python:3.7.9

# Set the working directory in the container to /app
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt ./requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 8080

# Copy the current directory contents into the container at /app
COPY . /app

# Run your application
CMD ["python", "app.py"]
