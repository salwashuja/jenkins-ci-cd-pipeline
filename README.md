# Node.js Application with Jenkins CI/CD

A simple Node.js application used to implement and understand a basic **CI/CD pipeline with Jenkins**. The project demonstrates how source code is managed in GitHub and automatically processed through Jenkins using a **Declarative Pipeline**.

This project was implemented as part of my **DevOps Internship at Davine Technologies**.

---

## 1. Application Overview

The application is a lightweight **Node.js application** designed primarily for practicing the CI/CD workflow.

The application contains the Node.js source code and a `package.json` file that defines its dependencies and available npm scripts.

The application itself is intentionally simple because the primary focus of the project is the **automation and delivery pipeline** around the application.

### Application Flow

```text
User / Developer
       |
       v
   GitHub Repository
       |
       v
      Jenkins
       |
       +----------------+
       |                |
       v                v
    Build             Test
       |                |
       +-------+--------+
               |
               v
        Pipeline Result
```

The important concept is that Jenkins does not replace the application. Instead, Jenkins provides an automated process for obtaining the application source code, preparing it, and validating it.

---

# 2. Application Structure

```text
simple-nodejs-app/
│
├── app.js
├── package.json
├── package-lock.json
├── Jenkinsfile
└── README.md
```

### `app.js`

Contains the main Node.js application logic.

### `package.json`

Defines:

* Application metadata
* Node.js dependencies
* npm scripts
* Commands used during the build/test process

### `package-lock.json`

Locks the dependency versions so that Jenkins and other environments can install a consistent dependency tree.

### `Jenkinsfile`

Contains the Jenkins pipeline definition as **Pipeline as Code**.

Instead of manually configuring every pipeline stage through the Jenkins UI, the pipeline logic is stored alongside the application source code.

---

# 3. Jenkins Architecture for This Project

The project uses Jenkins as the automation server.

```text
                 GitHub
                   |
                   | Source Code
                   v
              +---------+
              | Jenkins |
              +---------+
                   |
             Jenkinsfile
                   |
        +----------+----------+
        |          |          |
        v          v          v
    Checkout     Build       Test
        |          |          |
        +----------+----------+
                   |
                   v
             Build Result
```

### How the workflow works

1. The Node.js source code is maintained in GitHub.
2. Jenkins connects to the repository using configured credentials.
3. Jenkins reads the `Jenkinsfile`.
4. The pipeline starts executing the defined stages.
5. Jenkins checks out the source code.
6. Dependencies are installed during the build process.
7. The application's configured tests are executed.
8. Jenkins reports the pipeline result through the build/console output.

---

# 4. Jenkinsfile

The pipeline is written using **Declarative Pipeline syntax**.

Example:

```groovy
pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git 'YOUR_GITHUB_REPOSITORY_URL'
            }
        }

        stage('Build') {
            steps {
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
    }
}
```

> If the Jenkins agent is running in a Linux environment, `sh` can be used instead of `bat`.

---

# 5. Understanding the Jenkinsfile

## `pipeline`

```groovy
pipeline {
}
```

Defines the complete Declarative Pipeline.

Everything inside this block describes how Jenkins should execute the application's CI process.

---

## `agent any`

```groovy
agent any
```

Tells Jenkins that the pipeline can run on any available Jenkins agent that is capable of executing the required steps.

For a small learning project, this allows Jenkins to use the available execution environment without defining a dedicated agent.

---

## `stages`

```groovy
stages {
}
```

Contains the major phases of the pipeline.

Each stage represents a logical part of the CI workflow.

---

## Checkout Stage

```groovy
stage('Checkout') {
    steps {
        git 'YOUR_GITHUB_REPOSITORY_URL'
    }
}
```

The Checkout stage retrieves the application's source code from GitHub.

### Why is this required?

Jenkins needs the latest version of the application source code before it can build or test it.

Conceptually:

```text
GitHub
   |
   | git checkout
   v
Jenkins Workspace
```

The **Jenkins workspace** is the directory where Jenkins stores and operates on the checked-out project files during the build.

---

## Build Stage

```groovy
stage('Build') {
    steps {
        bat 'npm install'
    }
}
```

For this Node.js project, the build stage prepares the application environment by installing the dependencies defined in `package.json`.

`npm install`:

* Reads `package.json`
* Resolves required packages
* Installs dependencies
* Creates/updates the `node_modules` directory
* Uses `package-lock.json` to help maintain dependency consistency

The important interview concept is:

> **The Build stage prepares the application so that it can be executed or tested.**

---

## Test Stage

```groovy
stage('Test') {
    steps {
        bat 'npm test'
    }
}
```

The Test stage executes the test command configured in the Node.js project's `package.json`.

This allows Jenkins to automatically validate the application after the dependencies have been installed.

Conceptually:

```text
Source Code
     ↓
Install Dependencies
     ↓
Run Tests
     ↓
Pass / Fail
```

If the test command returns a failure status, Jenkins marks the relevant stage/pipeline as failed.

---

# 6. Why Use a Jenkinsfile?

The Jenkinsfile follows the concept of **Pipeline as Code**.

Instead of keeping the pipeline configuration only inside Jenkins, the pipeline definition is stored in the same Git repository as the application.

This provides several benefits:

* Pipeline configuration can be version controlled.
* Changes to the pipeline can be tracked.
* The pipeline can be reviewed along with application changes.
* The CI process can be recreated more easily.
* Developers can understand how their application is being built and tested.

### Interview explanation

If asked **"What is a Jenkinsfile?"**, a simple answer is:

> A Jenkinsfile is a text file stored in the source repository that defines the Jenkins pipeline as code. It describes stages, steps, agents, and other pipeline behavior that Jenkins should execute.

---

# 7. Freestyle Job vs Pipeline

During the assignment, both Jenkins Freestyle Jobs and Pipelines were explored.

### Freestyle Job

Configuration is primarily performed through the Jenkins UI.

```text
Jenkins UI
    ↓
Job Configuration
    ↓
Build Steps
    ↓
Execution
```

### Pipeline

The workflow is defined as code, normally through a Jenkinsfile.

```text
GitHub
   ↓
Jenkinsfile
   ↓
Pipeline
   ↓
Stages
   ↓
Execution
```

The main difference is that a Pipeline allows the CI/CD workflow itself to be **version controlled as code**.

---

# 8. GitHub Webhook Concept

A GitHub webhook can be used to notify Jenkins when a repository event occurs, such as a push.

The intended workflow is:

```text
Developer
    |
    | git push
    v
 GitHub
    |
    | Webhook notification
    v
 Jenkins
    |
    v
Start Pipeline
```

For this internship project, Jenkins was running locally in Docker. A locally running Jenkins instance is not normally reachable directly from GitHub over the public internet, so a standard GitHub webhook cannot simply connect to a private `localhost` address.

This helped demonstrate an important real-world concept:

> **The webhook sender must be able to reach the webhook endpoint of the Jenkins server.**

---

# 9. Credentials

Jenkins credentials are used to securely authenticate with external systems such as GitHub.

Instead of putting usernames, passwords, or tokens directly inside the Jenkinsfile, credentials can be stored and managed through Jenkins.

Conceptually:

```text
Jenkinsfile
     |
     | Credential reference
     v
Jenkins Credentials Store
     |
     v
Authentication
     |
     v
GitHub
```

This keeps sensitive authentication information separate from application source code.

---

# 10. Key Interview Concepts

### What happens when a Jenkins pipeline runs?

```text
Pipeline Starts
      ↓
Checkout Source Code
      ↓
Install Dependencies
      ↓
Run Tests
      ↓
Jenkins Reports Result
```

### What is CI?

**Continuous Integration** is the practice of frequently integrating code changes into a shared repository and automatically building and testing those changes.

### What is Pipeline as Code?

Defining the CI/CD workflow in a version-controlled file such as a `Jenkinsfile` instead of relying entirely on manually configured Jenkins UI settings.

### Why use stages?

Stages divide the pipeline into logical sections such as:

**Checkout → Build → Test → Deploy**

This makes the pipeline easier to understand, monitor, and troubleshoot.

---

## 11. Project Learning Summary

This project helped me understand the complete basic CI workflow around a Node.js application:

```text
Node.js Application
        ↓
     GitHub
        ↓
     Jenkins
        ↓
    Checkout
        ↓
      Build
        ↓
       Test
        ↓
 Pipeline Result
```

The project provided practical experience with **Jenkins Pipeline, Jenkinsfile, GitHub integration, credentials, build automation, testing, console logs, and webhook-based triggering concepts**.
