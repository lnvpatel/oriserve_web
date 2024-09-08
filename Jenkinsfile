pipeline {
    agent any
    tools {
        nodejs 'NodeJs'
    }

    environment {
        CODEDEPLOY_APP_NAME = 'your_codedeploy_app_name'
        CODEDEPLOY_DEPLOY_GROUP = 'your_codedeploy_deployment_group'
        AWS_CREDENTIALS = 'jenkins_ec2_ssh' // Jenkins AWS credentials ID
        your_region = 'ap-south-1'
        your_project_directory = 'oriserve_web_dir'
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
                        sh 'zip -r build.zip build'
                    }
                }
            }
        }

        stage('Deploy to CodeDeploy') {
            steps {
                script {
                    withAWS(credentials: "${AWS_CREDENTIALS}", region: 'your_region') {
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
