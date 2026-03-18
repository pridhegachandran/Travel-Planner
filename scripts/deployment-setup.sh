#!/bin/bash

# Travel Planner Deployment Setup Script
# This script sets up the entire CI/CD pipeline infrastructure

set -e

echo "🚀 Setting up Travel Planner CI/CD Pipeline..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check kubectl (for Kubernetes deployment)
    if command -v kubectl &> /dev/null; then
        print_status "kubectl found - Kubernetes deployment available"
    else
        print_warning "kubectl not found - Kubernetes deployment not available"
    fi
    
    print_status "Prerequisites check completed ✓"
}

# Setup directories
setup_directories() {
    print_status "Setting up directories..."
    
    mkdir -p scripts
    mkdir -p monitoring/prometheus
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/datasources
    mkdir -p ssl
    mkdir -p backup
    mkdir -p logs
    
    print_status "Directories created ✓"
}

# Create monitoring configurations
setup_monitoring() {
    print_status "Setting up monitoring..."
    
    # Prometheus configuration
    cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'travel-planner-backend'
    static_configs:
      - targets: ['backend:5000']
    metrics_path: '/metrics'
    
  - job_name: 'travel-planner-frontend'
    static_configs:
      - targets: ['frontend:80']
    metrics_path: '/metrics'
    
  - job_name: 'mongodb'
    static_configs:
      - targets: ['mongodb:27017']
      
  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
EOF

    # Grafana datasource configuration
    cat > monitoring/grafana/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
EOF

    print_status "Monitoring setup completed ✓"
}

# Create SSL certificates (self-signed for development)
setup_ssl() {
    print_status "Setting up SSL certificates..."
    
    if [ ! -f ssl/nginx.crt ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/nginx.key \
            -out ssl/nginx.crt \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        
        print_status "SSL certificates created ✓"
    else
        print_status "SSL certificates already exist ✓"
    fi
}

# Create MongoDB initialization script
setup_mongodb() {
    print_status "Setting up MongoDB initialization..."
    
    cat > scripts/mongo-init.js << EOF
// MongoDB initialization script
db = db.getSiblingDB('travel_planner');

// Create collections
db.createCollection('users');
db.createCollection('destinations');
db.createCollection('itineraries');
db.createCollection('memories');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.itineraries.createIndex({ "user_id": 1 });
db.memories.createIndex({ "user_id": 1 });
db.destinations.createIndex({ "location": 1 });
db.destinations.createIndex({ "category": 1 });

// Create admin user (for production)
db.createUser({
  user: "admin",
  pwd: "admin_password",
  roles: [
    { role: "readWrite", db: "travel_planner" }
  ]
});

print("MongoDB initialized successfully");
EOF

    print_status "MongoDB setup completed ✓"
}

# Create environment file template
create_env_template() {
    print_status "Creating environment template..."
    
    cat > .env.template << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/travel_planner
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_mongo_password

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key_here

# Redis Configuration
REDIS_PASSWORD=your_redis_password

# Grafana Configuration
GRAFANA_PASSWORD=your_grafana_password

# Docker Registry
DOCKER_REGISTRY=your-docker-registry.com

# Application Configuration
NODE_ENV=production
FLASK_ENV=production

# SSL Configuration
SSL_CERT_PATH=./ssl/nginx.crt
SSL_KEY_PATH=./ssl/nginx.key

# Backup Configuration
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30

# Monitoring Configuration
PROMETHEUS_RETENTION=200h
GRAFANA_ADMIN_PASSWORD=admin
EOF

    print_warning "Please copy .env.template to .env and update the values"
    print_status "Environment template created ✓"
}

# Create backup script
create_backup_script() {
    print_status "Creating backup script..."
    
    cat > scripts/backup.sh << 'EOF'
#!/bin/bash

# Backup script for Travel Planner
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="travel_planner_backup_${DATE}.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup MongoDB
docker exec travel-planner-mongodb-prod mongodump --out /backup/mongodb_$DATE

# Backup application data
tar -czf $BACKUP_DIR/$BACKUP_FILE \
    /backup/mongodb_$DATE \
    /var/lib/grafana \
    /prometheus

# Remove old backups (keep last 30 days)
find $BACKUP_DIR -name "travel_planner_backup_*.tar.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
EOF

    chmod +x scripts/backup.sh
    
    print_status "Backup script created ✓"
}

# Create Kubernetes manifests (optional)
create_k8s_manifests() {
    if command -v kubectl &> /dev/null; then
        print_status "Creating Kubernetes manifests..."
        
        mkdir -p k8s/namespace k8s/configmaps k8s/secrets k8s/deployments k8s/services k8s/ingress
        
        # Namespace
        cat > k8s/namespace/travel-planner.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: travel-planner
EOF

        # Backend Deployment
        cat > k8s/deployments/backend.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: travel-planner
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-docker-registry.com/travel-planner-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: travel-planner-secrets
              key: mongodb-uri
        - name: JWT_SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: travel-planner-secrets
              key: jwt-secret
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
EOF

        print_status "Kubernetes manifests created ✓"
    fi
}

# Main execution
main() {
    print_status "Starting Travel Planner CI/CD setup..."
    
    check_prerequisites
    setup_directories
    setup_monitoring
    setup_ssl
    setup_mongodb
    create_env_template
    create_backup_script
    create_k8s_manifests
    
    print_status "🎉 CI/CD setup completed successfully!"
    print_warning "Next steps:"
    print_warning "1. Copy .env.template to .env and update the values"
    print_warning "2. Configure Jenkins with the provided Jenkinsfile"
    print_warning "3. Set up Docker registry credentials"
    print_warning "4. Configure monitoring dashboards in Grafana"
    print_warning "5. Set up backup cron job: 0 2 * * * /path/to/scripts/backup.sh"
}

# Run main function
main "$@"
