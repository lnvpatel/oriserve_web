pipeline {
    agent any
    tools {
        nodejs 'NodeJs'
    }

    environment {
        CODEDEPLOY_APP_NAME = 'webtier_aap'
        CODEDEPLOY_DEPLOY_GROUP = 'Oriserve_deployment_group'
        AWS_CREDENTIALS = 'AWS_JENKINS' // Jenkins AWS credentials ID
        AWS_REGION = 'ap-south-1'
    }

    stages {
        stage('Clean Up') {
            steps {
                script {
                    dir('your_project_directory') {
                        sh 'npm cache clean --force'
                        sh 'rm -rf node_modules'
                        sh 'rm -f package-lock.json'
                        sh 'rm -rf build'
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    dir('your_project_directory') {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    dir('your_project_directory') {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Package') {
            steps {
                script {
                    dir('your_project_directory') {
                        sh 'cd .. && zip -r build.zip build'
                    }
                }
            }
        }

        stage('Deploy to CodeDeploy') {
            steps {
                script {
                    withAWS(credentials: "${AWS_CREDENTIALS}", region: "${AWS_REGION}") {
                        sh '''
                            aws deploy create-deployment \
                                --application-name ${CODEDEPLOY_APP_NAME} \
                                --deployment-group-name ${CODEDEPLOY_DEPLOY_GROUP} \
                                --deployment-config-name CodeDeployDefault.AllAtOnce \
                                --description "Deploying React App without S3" \
                                --file-exists-behavior OVERWRITE \
                                --revision revisionType=Local,location=build.zip
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment was successful!'
        }
        failure {
            echo 'Deployment failed. Check logs for details.'
        }
    }
}
