#!/bin/bash

SERVER_IP="192.168.1.111"

echo "🚀 Remote Deployment Helper"
echo "--------------------------"
echo "Target Server: $SERVER_IP"

# Get details
read -p "Enter Remote Username (e.g., root, ubuntu): " REMOTE_USER
read -p "Enter your Docker Hub Image Name (e.g., username/antigravity-tetris): " IMAGE_NAME

if [ -z "$REMOTE_USER" ] || [ -z "$IMAGE_NAME" ]; then
  echo "Error: Missing required fields."
  exit 1
fi

echo ""
echo "🔌 Connecting to $SERVER_IP..."

# SSH Command to:
# 1. Pull the latest image
# 2. Stop any existing container
# 3. Remove the old container
# 4. Start the new container on port 80 (accessible via http://192.168.1.111)

ssh "$REMOTE_USER@$SERVER_IP" << EOF
  echo "⬇️  Pulling latest image..."
  docker pull $IMAGE_NAME:latest

  echo "🛑 Stopping old game instance..."
  docker stop antigravity-game || true
  docker rm antigravity-game || true

  echo "▶️  Starting new game instance..."
  # Mapping port 80 on server to 3000 in container
  docker run -d \
    --name antigravity-game \
    --restart unless-stopped \
    -p 80:3000 \
    $IMAGE_NAME:latest

  echo "✅ Deployment Complete!"
EOF

echo ""
echo "🎉 Game is live at: http://$SERVER_IP"
