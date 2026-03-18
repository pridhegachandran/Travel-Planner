pipeline {
    agent any

    environment {
        // Get Python executable path dynamically
        PYTHON_EXE = bat 'py -0p --version 2>nul || echo python'
        
        MONGODB_URI = credentials('mongodb-uri')
        JWT_SECRET_KEY = credentials('jwt-secret')
        NODE_ENV = 'production'
        DOCKER_REGISTRY = 'your-docker-registry.com'
        DOCKER_IMAGE = '${DOCKER_REGISTRY}/travel-planner'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/pridhegachandran/Travel-Planner.git'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'set "CI=false" && npm run build'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat '"%PYTHON_EXE%" -m pip install -r requirements.txt'
                }
            }
        }

        stage('Backend Check') {
            steps {
                dir('backend') {
                    bat 'python --version'
                }
            }
        }

        stage('Deploy') {
            steps {
                bat 'if not exist C:\\deploy\\travelplanner-frontend mkdir C:\\deploy\\travelplanner-frontend'
                bat 'if not exist C:\\deploy\\travelplanner-backend mkdir C:\\deploy\\travelplanner-backend'
                bat 'xcopy /E /I /Y frontend\\* C:\\deploy\\travelplanner-frontend'
                bat 'xcopy /E /I /Y backend\\* C:\\deploy\\travelplanner-backend'
            }
        }
    }

    post {
        success {
            echo 'Travel Planner pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check console output.'
        }
    }
}