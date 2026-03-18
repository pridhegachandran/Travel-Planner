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
                    bat 'py --version'
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

        stage('Test Application') {
            steps {
                bat 'cd C:\\deploy\\travelplanner-backend && py -m pytest tests/ -v'
                bat 'cd C:\\deploy\\travelplanner-frontend && npm test --if-present'
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