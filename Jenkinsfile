pipeline {
    agent any

    environment {
        CODEDEPLOY_APP_NAME = 'webtier_aap'
        CODEDEPLOY_DEPLOY_GROUP = 'Oriserve_deployment_group'
        EC2_INSTANCE_IP = '3.108.62.73'
    }

    stages {
        stage('Clean Up') {
            steps {
                script {
                    dir('frontend') {
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
                    dir('frontend') {
                        sh 'sudo npm install'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    dir('frontend') {
                        sh 'sudo npm run build'
                    }
                }
            }
        }

        stage('Package') {
            steps {
                script {
                    dir('frontend') {
                        sh 'sudo zip -r build.zip build'
                    }
                }
            }
        }

        stage('Push to EC2') {
            steps {
                script {
                    sh 'scp -o StrictHostKeyChecking=no build.zip ec2-user@${EC2_INSTANCE_IP}:/home/ec2-user/build.zip'
                    
                    sh '''
                        ssh -o StrictHostKeyChecking=no ec2-user@${EC2_INSTANCE_IP} <<EOF
                        if [ -f /home/ec2-user/build.zip ]; then
                            echo "Unzipping build.zip..."
                            unzip -o /home/ec2-user/build.zip -d /home/ec2-user/
                        else
                            echo "build.zip not found!"
                            exit 1
                        fi
                        EOF
                    '''
                }
            }
        }

        stage('Create CodeDeploy Deployment') {
            steps {
                script {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ec2-user@${EC2_INSTANCE_IP} <<EOF
                        if [ -f /home/ec2-user/appspec.yml ]; then
                            echo "Creating CodeDeploy deployment..."
                            aws deploy create-deployment \
                                --application-name ${CODEDEPLOY_APP_NAME} \
                                --deployment-group-name ${CODEDEPLOY_DEPLOY_GROUP} \
                                --deployment-config-name CodeDeployDefault.AllAtOnce \
                                --description "Deploying React App" \
                                --file-exists-behavior OVERWRITE \
                                --revision revisionType=Local,location=/home/ec2-user/build.zip
                        else
                            echo "appspec.yml not found!"
                            exit 1
                        fi
                        EOF
                    '''
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
