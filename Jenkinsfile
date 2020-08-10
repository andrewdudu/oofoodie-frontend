pipeline {
    agent {
        label "master"
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Build image') {
            steps {
                sh 'docker build -t oofoodie-fe .'
            }
        }
        stage('Run app') {
            steps {
                sh 'docker run -p 3030:3000 oofoodie-fe'
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}