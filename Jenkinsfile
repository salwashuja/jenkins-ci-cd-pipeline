pipeline {
    agent any

    tools {
        nodejs 'NODEJS-20'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Validate') {
            steps {
                echo 'Validating application syntax and exports...'
                sh 'node --check app.js'
                sh "node -e \"const app=require('./app'); if (typeof app.add !== 'function') { throw new Error('add() function is missing'); } console.log('Validation passed');\""
            }
        }

        stage('Test') {
            steps {
                echo 'Running unit tests...'
                sh 'npm test'
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            echo 'Build, validation, and tests passed successfully.'
        }
        failure {
            echo 'Build, validation, or tests failed.'
        }
    }
}