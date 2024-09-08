pipeline {
    agent any

    environment {
        CODEDEPLOY_APP_NAME = 'webtier_app'
        CODEDEPLOY_DEPLOY_GROUP = 'Oriserve_deployment_group'
    }

    stages {
        stage('Clean Up') {
            steps {
                script {
                    dir('oriserve_web_cicd') {
                        sh 'npm cache clean --force'
                        sh 'rm -rf node_modules'
                        sh 'rm -f package-lock.json'
                        sh 'rm -rf build'  // Remove existing build directory
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
                    dir('oriserve_web_cicd') {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    dir('oriserve_web_cicd') {
                        sh '''
                        export NODE_OPTIONS=--openssl-legacy-provider
                        npm run build
                    '''
                    }
                }
            }
        }

        stage('Package') {
            steps {
                script {
                    dir('oriserve_web_cicd') {
                        sh 'zip -r build.zip build appspec.yml scripts/'
                    }
                }
            }
        }

        stage('Create CodeDeploy Deployment') {
            steps {
                script {
                    withAWS(credentials: 'jenkins_ec2_ssh', region: 'ap-south-1') {
                        sh '''
                        aws deploy create-deployment \
                            --application-name ${CODEDEPLOY_APP_NAME} \
                            --deployment-group-name ${CODEDEPLOY_DEPLOY_GROUP} \
                            --deployment-config-name CodeDeployDefault.AllAtOnce \
                            --description "Deploying React App" \
                            --file-exists-behavior OVERWRITE \
                            --revision revisionType=Local,location=$(pwd)/build.zip
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
