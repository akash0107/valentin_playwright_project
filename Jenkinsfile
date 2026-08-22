pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.62.0-noble'
            args '-u root'
        }
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results/results.xml'
            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                alwaysLinkToLastBuild: true
            ])
        }
        failure {
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
    }
}
