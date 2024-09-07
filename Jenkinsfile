pipeline {
    agent any

    environment {
        // Replace with your deployment variables
        CODEDEPLOY_APP_NAME = 'webtier_aap'
        CODEDEPLOY_DEPLOY_GROUP = 'Oriserve_deployment_group'
        EC2_INSTANCE_IP = '65.0.101.92'  // You still need an instance to push the build artifacts
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the frontend code from the repository
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Navigate to the frontend directory
                    dir('frontend') {
                        // Install npm dependencies
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // Build the React application
                    dir('frontend') {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Package') {
            steps {
                script {
                    // Package the build artifacts
                    dir('frontend') {
                        sh 'zip -r build.zip build'
                    }
                }
            }
        }

        stage('Push to EC2') {
            steps {
                script {
                    // Push the build files to the EC2 instance directly
                    sh 'scp -o StrictHostKeyChecking=no build.zip ec2-user@${EC2_INSTANCE_IP}:/home/ec2-user/build.zip'
                    
                    // SSH into EC2 and unzip the build files
                    sh '''
                        ssh -o StrictHostKeyChecking=no ec2-user@${EC2_INSTANCE_IP} <<EOF
                        unzip -o /home/ec2-user/build.zip -d /home/ec2-user/
                        EOF
                    '''
                }
            }
        }

        stage('Create CodeDeploy Deployment') {
            steps {
                script {
                    // Trigger CodeDeploy to deploy to all EC2 instances in the Auto Scaling group
                    sh '''
                    aws deploy create-deployment \
                        --application-name ${CODEDEPLOY_APP_NAME} \
                        --deployment-group-name ${CODEDEPLOY_DEPLOY_GROUP} \
                        --deployment-config-name CodeDeployDefault.AllAtOnce \
                        --description "Deploying React App" \
                        --file-exists-behavior OVERWRITE \
                        --revision revisionType=Local,location=/home/ec2-user/appspec.yml
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
