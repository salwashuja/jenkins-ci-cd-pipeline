pipeline {
    agent any

    tools {
        nodejs 'NODEJS-20'
    }

    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE = 'wajhip/jenkins-nodejs-app'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
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
                sh 'npm ci'
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
        stage('Package') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t "$DOCKER_REGISTRY/$DOCKER_IMAGE:$BUILD_NUMBER" .'
            }
        }

        stage('Push Docker Image') {
            steps {
                echo 'Pushing Docker image to registry...'
                withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login "$DOCKER_REGISTRY" --username "$DOCKER_USERNAME" --password-stdin
                        docker push "$DOCKER_REGISTRY/$DOCKER_IMAGE:$BUILD_NUMBER"
                        docker logout "$DOCKER_REGISTRY"
                    '''
                }
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