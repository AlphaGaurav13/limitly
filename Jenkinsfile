pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                dir('Backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('Backend') {
                    bat 'npm test'
                }
            }
        }

    }
}