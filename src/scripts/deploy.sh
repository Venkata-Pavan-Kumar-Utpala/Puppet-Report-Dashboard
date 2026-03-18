#!/bin/bash
# deploy.sh - Quick deployment utility
# CSE3253 DevOps | Venkata Pavan Kumar Utpala | 23FE10CSE00388

set -e
ENV=${1:-docker}
echo "================================================"
echo " Puppet Report Dashboard - Deploy Script"
echo " Target: $ENV"
echo "================================================"

if [ "$ENV" == "docker" ]; then
    echo "[1/3] Building Docker image..."
    docker build -f infrastructure/docker/Dockerfile -t devops-project-puppet-report-dashboard:latest .
    echo "[2/3] Stopping existing containers..."
    docker-compose -f infrastructure/docker/docker-compose.yml down || true
    echo "[3/3] Starting containers..."
    docker-compose -f infrastructure/docker/docker-compose.yml up -d
    echo "Done! Dashboard: http://localhost:8080"
    echo "      Report URL for puppet.conf: http://$(hostname -I | awk '{print $1}'):8080/api/reports"

elif [ "$ENV" == "k8s" ]; then
    echo "[1/2] Applying Kubernetes manifests..."
    kubectl create namespace devops --dry-run=client -o yaml | kubectl apply -f -
    kubectl apply -f infrastructure/kubernetes/
    echo "[2/2] Waiting for rollout..."
    kubectl rollout status deployment/puppet-report-dashboard -n devops
    echo "Done! Check: kubectl get pods,svc -n devops"

else
    echo "[1/2] Installing dependencies..."
    cd src/main && npm ci --only=production
    echo "[2/2] Starting server..."
    NODE_ENV=development node server.js &
    echo "Done! Dashboard: http://localhost:8080"
fi
