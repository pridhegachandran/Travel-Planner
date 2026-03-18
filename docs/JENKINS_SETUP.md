# Jenkins CI/CD Pipeline Setup Guide

This guide provides step-by-step instructions to set up a complete CI/CD pipeline for the Travel Planner application using Jenkins.

## 📋 Prerequisites

### Required Software
- **Jenkins** (v2.400+)
- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Git**
- **Node.js** (v18+)
- **Python** (v3.9+)

### Required Accounts/Services
- **GitHub** account with repository access
- **Docker Registry** (Docker Hub, AWS ECR, or private registry)
- **MongoDB** (local or cloud instance)
- **Slack** (for notifications, optional)

## 🚀 Setup Instructions

### 1. Jenkins Installation

#### Option A: Docker Installation (Recommended)
```bash
docker run \
  -d \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  --name jenkins \
  jenkins/jenkins:lts
```

#### Option B: Native Installation
```bash
# Ubuntu/Debian
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
echo deb https://pkg.jenkins.io/debian binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list
sudo apt-get update
sudo apt-get install jenkins

# CentOS/RHEL
sudo yum install jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### 2. Jenkins Plugin Installation

Access Jenkins at `http://localhost:8080` and install these plugins:

#### Required Plugins:
- **Pipeline** (for Jenkinsfile support)
- **Git** (for Git integration)
- **Docker Pipeline** (for Docker operations)
- **Docker** (for Docker management)
- **Blue Ocean** (for better pipeline visualization)
- **Slack Notification** (for notifications)
- **Publish HTML Report** (for test reports)
- **Credentials Binding** (for secure credential management)

#### Installation via UI:
1. Go to `Manage Jenkins` → `Plugins` → `Available plugins`
2. Search and install the plugins listed above
3. Restart Jenkins after installation

### 3. Credentials Configuration

#### 3.1 GitHub Credentials
1. Go to `Manage Jenkins` → `Manage Credentials`
2. Click `Store scoped to Jenkins` → `Global credentials (unrestricted)`
3. Add `Username with password` credential:
   - **ID**: `github-credentials`
   - **Username**: Your GitHub username
   - **Password**: GitHub personal access token

#### 3.2 Docker Registry Credentials
1. Add `Username with password` credential:
   - **ID**: `docker-registry-credentials`
   - **Username**: Docker registry username
   - **Password**: Docker registry password/token

#### 3.3 Application Secrets
1. Add `Secret text` credentials:
   - **ID**: `mongodb-uri`
   - **Secret**: Your MongoDB connection string
   - **ID**: `jwt-secret`
   - **Secret**: Your JWT secret key

### 4. Pipeline Job Creation

#### 4.1 Create New Pipeline Job
1. Click `New Item` on Jenkins dashboard
2. Enter job name: `travel-planner-ci-cd`
3. Select `Pipeline` and click `OK`
4. In the pipeline configuration:
   - **Definition**: `Pipeline script from SCM`
   - **SCM**: `Git`
   - **Repository URL**: `https://github.com/pridhegachandran/Travel-Planner.git`
   - **Credentials**: Select `github-credentials`
   - **Branch Specifier**: `*/main`
   - **Script Path**: `Jenkinsfile`

#### 4.2 Configure Build Triggers
1. Go to job configuration → `Build Triggers`
2. Enable `GitHub hook trigger for GITScm polling`
3. Optionally enable `Poll SCM` with schedule `H/5 * * * *`

### 5. Environment Setup

#### 5.1 Run Deployment Setup Script
```bash
cd /path/to/travel-planner
chmod +x scripts/deployment-setup.sh
./scripts/deployment-setup.sh
```

#### 5.2 Configure Environment Variables
```bash
# Copy and update environment template
cp .env.template .env
# Edit .env with your actual values
```

#### 5.3 Setup Docker Registry
```bash
# Login to Docker registry
docker login your-docker-registry.com
```

### 6. Webhook Configuration (GitHub)

#### 6.1 Create GitHub Personal Access Token
1. Go to GitHub → `Settings` → `Developer settings` → `Personal access tokens`
2. Generate new token with `repo` scope
3. Copy the token

#### 6.2 Configure Jenkins Webhook
1. Go to GitHub repository → `Settings` → `Webhooks`
2. Add webhook:
   - **Payload URL**: `http://your-jenkins-server:8080/github-webhook/`
   - **Content type**: `application/json`
   - **Secret**: (optional, for security)
   - Events: `Pushes`, `Pull requests`

### 7. Slack Integration (Optional)

#### 7.1 Create Slack App
1. Go to Slack API → `Create New App`
2. Configure incoming webhooks
3. Get webhook URL

#### 7.2 Configure Slack in Jenkins
1. Go to `Manage Jenkins` → `Configure System`
2. Find `Slack` section
3. Add workspace and credential details

## 🔧 Pipeline Stages Explanation

### Stage 1: Checkout
- Pulls latest code from GitHub
- Uses configured credentials for authentication

### Stage 2: Lint and Code Quality
- **Backend**: Python linting with `flake8`, formatting with `black`, import sorting with `isort`
- **Frontend**: ESLint, Prettier checks, unit tests with Jest

### Stage 3: Security Scan
- **Backend**: `safety` for dependency vulnerabilities, `bandit` for code security
- **Frontend**: `npm audit` for package vulnerabilities

### Stage 4: Build Applications
- **Backend**: Install Python dependencies, run tests
- **Frontend**: Install Node dependencies, create production build

### Stage 5: Docker Build
- Creates Docker images for both backend and frontend
- Tags images with build number and `latest`

### Stage 6: Docker Push
- Pushes images to configured Docker registry
- Only runs on main branch

### Stage 7: Deploy to Staging
- Deploys application to staging environment
- Runs health checks
- Only runs on main branch

### Stage 8: Integration Tests
- Runs end-to-end tests against staging
- Uses Playwright/Cucumber for testing

### Stage 9: Deploy to Production
- Requires manual approval
- Deploys to production environment
- Includes rollback capability

### Stage 10: Post-Deployment Tests
- Runs smoke tests against production
- Validates deployment success

## 📊 Monitoring and Logging

### Jenkins Blue Ocean
- Install Blue Ocean plugin for better visualization
- Access at `http://localhost:8080/blue`

### Build Artifacts
- Docker images are tagged and pushed to registry
- Frontend build artifacts are archived
- Test reports are published

### Notifications
- Slack notifications for build success/failure
- Email notifications (if configured)

## 🔒 Security Considerations

### Credential Management
- Use Jenkins credentials store for all secrets
- Never hardcode sensitive data in Jenkinsfile
- Rotate credentials regularly

### Docker Security
- Use non-root users in containers
- Scan images for vulnerabilities
- Use private Docker registry

### Network Security
- Use HTTPS for all communications
- Configure firewall rules appropriately
- Use VPN for remote access

## 🚨 Troubleshooting

### Common Issues

#### 1. Docker Permission Errors
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

#### 2. Git Authentication Issues
- Verify GitHub credentials in Jenkins
- Check personal access token permissions
- Ensure webhook URL is accessible

#### 3. Docker Registry Push Failures
- Verify registry credentials
- Check registry availability
- Ensure proper image naming

#### 4. Build Failures
- Check build logs in Jenkins
- Verify environment variables
- Check resource availability

### Debug Mode
Add this to Jenkinsfile for debugging:
```groovy
options {
    timeout(time: 2, unit: 'HOURS')
    buildDiscarder(logRotator(numToKeepStr: '10'))
    ansiColor('xterm')
    timestamps()
}
```

## 📈 Performance Optimization

### Parallel Execution
- Linting runs in parallel for backend/frontend
- Security scans run concurrently
- Build stages optimized for speed

### Resource Management
- Limit Docker resource usage
- Clean up workspace after builds
- Use Docker layer caching

### Caching Strategies
- Cache Docker layers
- Cache npm packages
- Cache Python dependencies

## 🔄 Maintenance

### Regular Tasks
- Update Jenkins plugins monthly
- Rotate credentials quarterly
- Clean up old build artifacts
- Monitor disk space usage

### Backup Strategy
- Backup Jenkins configuration:
```bash
docker exec jenkins tar -czf /backup/jenkins-$(date +%Y%m%d).tar.gz /var/jenkins_home
```

### Updates
- Update Jenkins regularly
- Update pipeline dependencies
- Review and optimize pipeline performance

## 🎯 Best Practices

1. **Use Pipeline as Code**: Keep Jenkinsfile in repository
2. **Immutable Infrastructure**: Use Docker containers
3. **Automated Testing**: Comprehensive test coverage
4. **Security First**: Regular security scans
5. **Monitoring**: Comprehensive logging and monitoring
6. **Documentation**: Keep documentation updated
7. **Backup**: Regular backup strategy
8. **Review**: Regular pipeline reviews and optimizations

## 📞 Support

For issues:
1. Check Jenkins logs: `docker logs jenkins`
2. Review build logs in Jenkins UI
3. Verify configurations
4. Check resource availability
5. Consult Jenkins documentation

## 🚀 Next Steps

After initial setup:
1. Configure monitoring dashboards
2. Set up alerting rules
3. Implement canary deployments
4. Add performance testing
5. Configure automated rollback
6. Set up disaster recovery

This setup provides a robust, scalable CI/CD pipeline for the Travel Planner application with modern DevOps practices.
