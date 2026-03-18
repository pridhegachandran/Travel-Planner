pipeline {
    agent any
    
    environment {
        // Environment variables
        MONGODB_URI = credentials('mongodb-uri')
        JWT_SECRET_KEY = credentials('jwt-secret')
        NODE_ENV = 'production'
        DOCKER_REGISTRY = 'your-docker-registry.com'
        DOCKER_IMAGE = '${DOCKER_REGISTRY}/travel-planner'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Pull the latest code from GitHub
                git branch: 'main', 
                    url: 'https://github.com/pridhegachandran/Travel-Planner.git',
                    credentialsId: 'github-credentials'
            }
        }
        
        stage('Lint and Code Quality') {
            parallel {
                stage('Backend Lint') {
                    steps {
                        dir('backend') {
                            sh '''
                                python -m venv venv
                                . venv/bin/activate
                                pip install flake8 black isort
                                flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
                                black --check .
                                isort --check-only .
                            '''
                        }
                    }
                }
                
                stage('Frontend Lint') {
                    steps {
                        dir('frontend') {
                            sh '''
                                npm install
                                npm run lint --if-present
                                npm run test --if-present -- --coverage --watchAll=false
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                parallel {
                    stage('Backend Security') {
                        steps {
                            dir('backend') {
                                sh '''
                                    pip install safety bandit
                                    safety check -r requirements.txt
                                    bandit -r . -f json -o bandit-report.json || true
                                '''
                            }
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'backend',
                                reportFiles: 'bandit-report.json',
                                reportName: 'Backend Security Scan'
                            ])
                        }
                    }
                    
                    stage('Frontend Security') {
                        steps {
                            dir('frontend') {
                                sh '''
                                    npm audit --audit-level high
                                    npm install -g npm-audit-resolve
                                    npm-audit-resolve
                                '''
                            }
                        }
                    }
                }
            }
        }
        
        stage('Build Applications') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh '''
                                python -m venv venv
                                . venv/bin/activate
                                pip install -r requirements.txt
                                python -m pytest tests/ -v --junitxml=backend-test-results.xml || true
                            '''
                        }
                        publishTestResults testResultsPattern: 'backend/backend-test-results.xml'
                    }
                }
                
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh '''
                                npm install
                                npm run build
                            '''
                        }
                        archiveArtifacts artifacts: 'frontend/build/**/*', fingerprint: true
                    }
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    // Build backend Docker image
                    dir('backend') {
                        sh '''
                            docker build -t ${DOCKER_IMAGE}-backend:${BUILD_NUMBER} .
                            docker tag ${DOCKER_IMAGE}-backend:${BUILD_NUMBER} ${DOCKER_IMAGE}-backend:latest
                        '''
                    }
                    
                    // Build frontend Docker image
                    dir('frontend') {
                        sh '''
                            docker build -t ${DOCKER_IMAGE}-frontend:${BUILD_NUMBER} .
                            docker tag ${DOCKER_IMAGE}-frontend:${BUILD_NUMBER} ${DOCKER_IMAGE}-frontend:latest
                        '''
                    }
                }
            }
        }
        
        stage('Docker Push') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Login to Docker registry
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        // Push backend image
                        sh '''
                            docker push ${DOCKER_IMAGE}-backend:${BUILD_NUMBER}
                            docker push ${DOCKER_IMAGE}-backend:latest
                        '''
                        
                        // Push frontend image
                        sh '''
                            docker push ${DOCKER_IMAGE}-frontend:${BUILD_NUMBER}
                            docker push ${DOCKER_IMAGE}-frontend:latest
                        '''
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Deploy to staging environment
                    sh '''
                        # Update staging environment
                        docker-compose -f docker-compose.staging.yml down
                        docker-compose -f docker-compose.staging.yml pull
                        docker-compose -f docker-compose.staging.yml up -d
                        
                        # Wait for services to be ready
                        sleep 30
                        
                        # Health checks
                        curl -f http://staging.your-domain.com/api/health || exit 1
                        curl -f http://staging.your-domain.com || exit 1
                    '''
                }
            }
        }
        
        stage('Integration Tests') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    # Run integration tests against staging
                    cd tests/integration
                    npm install
                    npm run test:staging
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
                expression {
                    // Only deploy to production if all tests pass
                    currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }
            input {
                message "Deploy to Production?"
                ok "Deploy"
                submitter "prod-deployers"
            }
            steps {
                script {
                    // Deploy to production environment
                    sh '''
                        # Backup current production
                        docker-compose -f docker-compose.prod.yml down
                        
                        # Deploy new version
                        docker-compose -f docker-compose.prod.yml pull
                        docker-compose -f docker-compose.prod.yml up -d
                        
                        # Wait for services to be ready
                        sleep 60
                        
                        # Health checks
                        curl -f http://your-domain.com/api/health || exit 1
                        curl -f http://your-domain.com || exit 1
                        
                        # Cleanup old images
                        docker image prune -f
                    '''
                }
            }
        }
        
        stage('Post-Deployment Tests') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    # Run smoke tests against production
                    cd tests/smoke
                    npm install
                    npm run test:production
                '''
            }
        }
    }
    
    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        
        success {
            // Notify on success
            slackSend(
                channel: '#deployments',
                color: 'good',
                message: "✅ Travel Planner deployed successfully! Build: ${BUILD_NUMBER}"
            )
            
            // Update deployment status
            script {
                currentBuild.description = "✅ Deployed to production"
            }
        }
        
        failure {
            // Notify on failure
            slackSend(
                channel: '#deployments',
                color: 'danger',
                message: "❌ Travel Planner deployment failed! Build: ${BUILD_NUMBER}"
            )
            
            // Rollback on failure
            script {
                sh '''
                    # Rollback to previous version
                    docker-compose -f docker-compose.prod.yml down
                    docker-compose -f docker-compose.prod.yml up -d
                '''
            }
            
            currentBuild.description = "❌ Deployment failed"
        }
        
        unstable {
            slackSend(
                channel: '#deployments',
                color: 'warning',
                message: "⚠️ Travel Planner deployment unstable! Build: ${BUILD_NUMBER}"
            )
        }
    }
}
