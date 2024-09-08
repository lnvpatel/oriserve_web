pipeline {
    agent any
    tools {
        nodejs 'NodeJs'
    }

    environment {
        CODEDEPLOY_APP_NAME = 'Oriserve_web'
        CODEDEPLOY_DEPLOY_GROUP = 'oriserve_deployment_group'
        AWS_CREDENTIALS = 'AWS_JENKINS' // Jenkins AWS credentials ID
        AWS_REGION = 'ap-south-1'
        S3_BUCKET_NAME = 'oriservereact'
        LOCAL_FILE_PATH = '/var/lib/jenkins/workspace/oriserve_web_pipeline/build.zip' // Path to the local build artifact
        S3_FILE_PATH = 'builds/build.zip' // Path in S3 bucket
    }

    stages {
        stage('Clean Up') {
            steps {
                script {
                    sh 'npm cache clean --force'
                    sh 'rm -rf node_modules'
                    sh 'rm -f package-lock.json'
                    sh 'rm -rf build'
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
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'npm run build'
                }
            }
        }

        stage('Package') {
            steps {
                script {
                    // Copy appspec.yml to the build directory
                    sh 'cp appspec.yml build/'
                    sh 'cp install_dependencies.sh build/'
                    sh 'cp install_node.sh build/'
                    sh 'cp start_application.sh build/
                    
                    // Create the zip file of the build directory
                    sh 'zip -r build.zip build'
                }
            }
        }

        stage('Upload to S3') {
            steps {
                script {
                    withAWS(credentials: "${AWS_CREDENTIALS}", region: "${AWS_REGION}") {
                        sh '''
                            aws s3 cp ${LOCAL_FILE_PATH} s3://${S3_BUCKET_NAME}/${S3_FILE_PATH} --region ${AWS_REGION}
                        '''
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
                                --description "Deploying React App from S3" \
                                --file-exists-behavior OVERWRITE \
                                --revision revisionType=S3,s3Location={bucket=${S3_BUCKET_NAME},key=${S3_FILE_PATH},bundleType=zip}
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
