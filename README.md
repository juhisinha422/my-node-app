# 🚀 End-to-End CI/CD Pipeline with GitHub Actions, Docker & AWS EC2

This repository demonstrates a **fully automated, production-ready CI/CD pipeline** that deploys a Node.js application from **GitHub to AWS EC2** using **GitHub Actions**, **Docker**, and **Docker Hub**.

Every code change pushed to the `main` branch is automatically built, containerized, published, and deployed—without any manual intervention.

---

## 📌 Project Overview

The CI/CD pipeline automates the complete deployment workflow:

1. Code is pushed to the `main` branch
2. GitHub Actions triggers the CI/CD pipeline
3. Docker image is built for the Node.js application
4. Image is pushed to Docker Hub
5. AWS EC2 pulls the latest Docker image via SSH
6. Old container is stopped and removed
7. New container is started with the updated application

✅ Result: **Seamless, consistent, and zero-downtime deployments**

---

## 🛠️ Tech Stack

- Node.js  
- GitHub Actions  
- Docker  
- Docker Hub  
- AWS EC2  
- SSH  

---

## 📂 Project Structure

my-node-app/

├── .github/workflows/

│ └── ci-cd.yml

├── Dockerfile

├── index.js

├── index.html

├── package.json

├── package-lock.json

└── README.md


---

## ⚙️ CI/CD Workflow

### Continuous Integration (CI)
- Triggered on every push to the `main` branch
- Builds Docker image for the application
- Tags the image as `latest`

### Continuous Deployment (CD)
- Pushes Docker image to Docker Hub
- Connects to AWS EC2 using SSH
- Pulls the latest image
- Stops and removes the existing container
- Runs the updated container automatically

---

## 🐳 Docker

The application is containerized using Docker to ensure:
- Consistent environments
- Easy scalability
- Reliable deployments

---

## ☁️ AWS EC2 Deployment

- EC2 instance runs Docker
- GitHub Actions deploys via SSH
- Application runs on **port 3000**

## Access the application:
```bash
http://<EC2_PUBLIC_IP>:3000
```


