pipeline {
    agent any

    tools {
        nodejs 'NODEJS-20'
    }
    environment {
        registry = "docker.io"
        imageName = "wajhip/jenkins-nodejs-app"
        registryCredential = "dockerhub-credentials"
        imageTag = "${env.BUILD_NUMBER}"
        imageWithTag = "${imageName}:${imageTag}"
        fullImageName = "${registry}/${imageWithTag}"

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
        stage('Package') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${fullImageName} ."
            }
        }

        stage('Push Docker Image') {
            steps {
                echo 'Pushing Docker image to registry...'
                withCredentials([usernamePassword(credentialsId: "${registryCredential}", passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin ${registry}"
                    sh "docker push ${fullImageName}"
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