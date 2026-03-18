pipeline {
    agent any

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
                    bat 'set CI=false && npm run build'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'pip install -r requirements.txt'
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