 ### End-to-end CI/CD Pipeline Setup with GitHub Actions – Fully Automated & Production Ready!

I recently worked on a CI/CD pipeline setup that demonstrates how to automate the complete deployment workflow, from code commit to live application delivery, using GitHub Actions, Docker, and AWS EC2.

The pipeline is designed to trigger on every push to the main branch, build the Node.js application into a Docker image, publish it to Docker Hub, and automatically deploy it to an AWS EC2 instance via SSH. The EC2 server pulls the latest image, replaces the old container, and runs the updated application, ensuring seamless, consistent, and zero-downtime deployments.

This setup shows how code changes can move from source control to a running application without manual intervention, making the environment fast, reliable, and production-ready.

💡 Key Components Used:
 GitHub Actions - Docker - Docker Hub - AWS EC2 - SSH Deployment - Node.js
