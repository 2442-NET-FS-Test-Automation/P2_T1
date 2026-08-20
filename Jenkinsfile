pipeline {
    agent {
        label 'windows'
    }

    environment {
        API_DIR = '.'
        ConnectionStrings__DefaultConnection = credentials('test-conn')
        Jwt__key = credentials('jwt-key')

        REGISTRY = 'gymcr.azurecr.io'
        IMAGE = "${REGISTRY}/gym-api"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout([$class: 'GitSCM', 
                    branches: [[name: '*/main']], 
                    extensions: [[$class: 'CloneOption', depth: 1, noTags: true, shallow: true, timeout: 20]], 
                    userRemoteConfigs: [[url: 'https://github.com']]
                ])
            }
        }

        stage('Test'){
            steps {
                dir(env.API_DIR){
                    powershell 'Remove-Item -Recurse -Force */TestResults -ErrorAction SilentlyContinue'
                    bat 'dotnet test GYM.slnx -c Release --no-build --logger "junit;LogFilePath=TestResults/{assembly}.junit.xml" --logger trx'
                }
            }
        }

        stage('Build image'){
            steps{
                bat 'docker build -t %IMAGE%:%BUILD_NUMBER% -t %IMAGE%:latest -f "%API_DIR%/Dockerfile" .'
            }
        }

        stage('Push to ACR'){
            steps{
                withCredentials([usernamePassword(credentialsId: 'acr-admin', usernameVariable: 'ACR_USER', passwordVariable: 'ACR_PASS')]) {
                    bat 'echo %ACR_PASS%| docker login %REGISTRY% -u %ACR_USER% --password-stdin'
                    bat 'docker push %IMAGE%:%BUILD_NUMBER%'
                    bat 'docker push %IMAGE%:latest'
                    bat 'docker logout %REGISTRY%'
                }
            }
        }
        post {
            always {
                dir(env.API_DIR){
                    junit allowEmptyResults: true, testResults: '**/TestResults/*.junit.xml'
                    archiveArtifacts allowEmptyArchive: true, artifacts: '**/TestResults/*.trx'
                }
            }
        }
    }

}