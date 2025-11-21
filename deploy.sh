#!/bin/bash

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running or not installed."
  echo "Please install Docker Desktop and start it before running this script."
  exit 1
fi

# Ask for Docker Hub username
echo "🐳 Docker Hub Deployment Helper"
echo "--------------------------------"
read -p "Enter your Docker Hub username: " USERNAME

if [ -z "$USERNAME" ]; then
  echo "Error: Username cannot be empty."
  exit 1
fi

APP_NAME="antigravity-tetris"
FULL_IMAGE_NAME="$USERNAME/$APP_NAME"

echo ""
echo "🚀 Step 1: Building the image..."
docker build -t $APP_NAME .

echo ""
echo "🏷️  Step 2: Tagging image as $FULL_IMAGE_NAME:latest..."
docker tag $APP_NAME $FULL_IMAGE_NAME:latest

echo ""
echo "🔑 Step 3: Logging in to Docker Hub..."
docker login

echo ""
echo "⬆️  Step 4: Pushing image to Docker Hub..."
docker push $FULL_IMAGE_NAME:latest

echo ""
echo "✅ Success! Your game is live at:"
echo "   https://hub.docker.com/r/$USERNAME/$APP_NAME"
