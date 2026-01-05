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

