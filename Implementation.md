# Complete CI/CD Project Setup Guide
## Node.js App Deployment to AWS EC2 using GitHub Actions & Docker

---

## Phase 1: Local Setup

### Step 1: Install Node.js on Ubuntu
```bash
# Update system
sudo apt update

# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Verify installation
node --version
npm --version
```

### Step 2: Create a Simple Node.js Application
```bash
# Create project directory
mkdir my-node-app
cd my-node-app

# Initialize Node.js project
npm init -y

# Install Express
npm install express
```

### Step 3: Create Application Files

**Create `index.js`:**
```javascript
const express = require("express");
const path = require("path");

const app = express();

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
```

**Create `index.html`:**
```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background-color: black;
        color: white;
        font-family: monospace;
        font-size: 32px;
      }
    </style>
  </head>
  <body>
        Hi Juhi Sinha, how are you?
  </body>
</html>
```

**Update `package.json` scripts section:**
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js"
  }
}
```

### Step 4: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 5: Create .gitignore
```
node_modules/
.env
*.pem
.DS_Store
```

### Step 6: Test Locally
```bash
# Install dependencies
npm install

# Run the app
npm start

# In another terminal, test it
curl http://localhost:3000
```

---

## Phase 2: GitHub Setup

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it: `my-node-app`
4. Make it public or private
5. Don't initialize with README (we'll push existing code)

### Step 2: Push Code to GitHub
```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Node.js app with Docker"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/my-node-app.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## Phase 3: Docker Hub Setup

### Step 1: Create Docker Hub Account
1. Go to [hub.docker.com](https://hub.docker.com)
2. Sign up for free account
3. Verify your email

### Step 2: Create Repository
1. Click "Create Repository"
2. Name: `my-node-app`
3. Set visibility: Public
4. Click "Create"

### Step 3: Create Access Token
1. Click your profile → Account Settings
2. Security → New Access Token
3. Description: "GitHub Actions"
4. Access permissions: Read, Write, Delete
5. Generate and **COPY THE TOKEN** (you won't see it again!)

---

## Phase 4: AWS EC2 Setup (DETAILED)

### Step 1: Sign in to AWS Console
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Sign In to the Console"
3. Enter your credentials

### Step 2: Navigate to EC2
1. In the search bar at top, type "EC2"
2. Click on "EC2" (Virtual Servers in the Cloud)
3. Make sure you're in the correct region (top-right corner)
   - Choose a region close to you (e.g., US East, Mumbai, etc.)

### Step 3: Launch EC2 Instance
1. Click the orange **"Launch Instance"** button

#### 3.1 Name and Tags
- **Name**: `my-node-app-server` (or any name you prefer)

#### 3.2 Application and OS Images (AMI)
- Click **"Ubuntu"**
- Select: **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type**
- Architecture: **64-bit (x86)**
- Make sure it says **"Free tier eligible"**

#### 3.3 Instance Type
- Select: **t2.micro** (Free tier eligible)
- 1 vCPU, 1 GB Memory
- Leave this selected

#### 3.4 Key Pair (Login) - IMPORTANT!
- Click **"Create new key pair"**
  - Key pair name: `my-node-app-key` (or your preferred name)
  - Key pair type: **RSA**
  - Private key file format: **.pem** (for Mac/Linux) or **.ppk** (for Windows with PuTTY)
  - Click **"Create key pair"**
  - **IMPORTANT**: The .pem file will download automatically
  - **Save it in a safe location** (you'll need it to connect)
  - You can only download this ONCE!

- If you already have a key pair, select it from dropdown

#### 3.5 Network Settings
Click **"Edit"** button and configure:

**Firewall (Security Groups)**:
- Select: **"Create security group"**
- Security group name: `my-node-app-sg`
- Description: `Security group for Node.js app`

**Inbound Security Group Rules** - Add these:

1. **SSH Rule** (already there by default)
   - Type: SSH
   - Protocol: TCP
   - Port: 22
   - Source type: **My IP** (recommended) or Anywhere (0.0.0.0/0)
   - Description: SSH access

2. Click **"Add security group rule"**
   - Type: Custom TCP
   - Protocol: TCP
   - Port range: **3000**
   - Source type: **Anywhere** (0.0.0.0/0)
   - Description: Node.js app port

3. Click **"Add security group rule"** again (optional for HTTP)
   - Type: HTTP
   - Protocol: TCP
   - Port: 80
   - Source type: **Anywhere** (0.0.0.0/0)
   - Description: HTTP access

#### 3.6 Configure Storage
- Default **8 GB gp3** is fine
- Free tier eligible: Up to 30 GB
- Leave as is or increase if needed

#### 3.7 Advanced Details (Optional)
- Can skip this for now

### Step 4: Launch the Instance
1. Review your settings on the right side summary
2. Click **"Launch Instance"** (orange button at bottom)
3. You'll see a success message
4. Click **"View all instances"**

### Step 5: Wait for Instance to Start
- Status should change from "Pending" to "Running" (takes 1-2 minutes)
- Instance state: **Running** ✅
- Status checks: **2/2 checks passed** ✅

### Step 6: Get Instance Details
1. Click on your instance (checkbox)
2. Note down these details from below:
   - **Public IPv4 address** (e.g., 3.110.123.456)
   - **Public IPv4 DNS** (optional)
   - **Instance ID**

### Step 7: Connect to Your EC2 Instance

#### For Mac/Linux Users:

```bash
# Navigate to where you saved your .pem file
cd ~/Downloads

# Change key file permissions (REQUIRED)
chmod 400 my-node-app-key.pem

# Connect via SSH (replace with YOUR public IP)
ssh -i my-node-app-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Example:
# ssh -i my-node-app-key.pem ubuntu@3.110.123.456
```

#### For Windows Users:

**Option A: Using PowerShell/Command Prompt**
```bash
# Open PowerShell as Administrator
# Navigate to your .pem file location
cd C:\Users\YourName\Downloads

# Connect
ssh -i my-node-app-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**Option B: Using PuTTY**
1. Download PuTTY and PuTTYgen
2. Convert .pem to .ppk using PuTTYgen
3. Use PuTTY to connect with .ppk file

#### First Connection:
- You'll see: "Are you sure you want to continue connecting?"
- Type **"yes"** and press Enter
- You should now see Ubuntu terminal! 🎉

```
Welcome to Ubuntu 22.04.3 LTS
ubuntu@ip-xxx-xx-xx-xx:~$
```

### Step 8: Update System
```bash
# Update package list
sudo apt update

# Upgrade installed packages (optional but recommended)
sudo apt upgrade -y
```

### Step 9: Install Docker on EC2

```bash
# Install Docker
sudo apt install -y docker.io

# Start Docker service
sudo systemctl start docker

# Enable Docker to start on boot
sudo systemctl enable docker

# Check Docker status
sudo systemctl status docker
# Press 'q' to exit

# Add ubuntu user to docker group (so you don't need sudo)
sudo usermod -aG docker ubuntu

# Verify Docker installation
docker --version
```

### Step 10: Apply Docker Group Changes

**IMPORTANT**: You need to log out and back in for group changes to take effect

```bash
# Log out
exit

# Log back in (from your local machine)
ssh -i my-node-app-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Test Docker without sudo
docker ps

# Should work without permission errors!
```

### Step 11: Verify Everything Works

```bash
# Check Docker version
docker --version

# Check running containers (should be empty for now)
docker ps

# Test Docker with hello-world
docker run hello-world

# If you see "Hello from Docker!" message, you're all set! ✅
```

---

## EC2 Setup Complete! ✅

Your EC2 instance is now ready with:
- ✅ Ubuntu 22.04 running
- ✅ Security groups configured (ports 22, 3000, 80)
- ✅ Docker installed and running
- ✅ SSH access working

---

## Common EC2 Issues & Solutions

### Issue 1: "Connection timed out" when SSH
**Solution**:
- Check security group allows SSH (port 22) from your IP
- Verify you're using correct public IP
- Check if instance is running

### Issue 2: "Permission denied (publickey)"
**Solution**:
```bash
# Make sure key has correct permissions
chmod 400 my-node-app-key.pem

# Use correct username (ubuntu for Ubuntu, ec2-user for Amazon Linux)
ssh -i my-node-app-key.pem ubuntu@YOUR_IP
```

### Issue 3: "Permission denied" when running Docker
**Solution**:
```bash
# Add user to docker group
sudo usermod -aG docker ubuntu

# Log out and back in
exit
# Then SSH back in
```

### Issue 4: Can't access app on port 3000
**Solution**:
- Check security group has inbound rule for port 3000
- Verify container is running: `docker ps`
- Check container logs: `docker logs myapp`

### Issue 5: Instance stopped or terminated
**Solution**:
- Stopped: Select instance → Instance State → Start
- Terminated: Cannot recover, need to create new instance

---

## Useful EC2 Commands

```bash
# Check system info
uname -a
lsb_release -a

# Check disk space
df -h

# Check memory
free -h

# Check running processes
top
# Press 'q' to exit

# View system logs
journalctl -xe

# Reboot instance (if needed)
sudo reboot
```

---

## Next Steps

Now that EC2 is set up, you need to:
1. Keep your **Public IP** handy (for GitHub Secrets)
2. Keep your **.pem file** safe (for GitHub Secrets)
3. Leave your EC2 instance **running**
4. Move to Phase 5: Configure GitHub Secrets

---

## Phase 5: Deployment Options (Choose One)

You have **3 options** to deploy without adding EC2 details to GitHub:

---

## **OPTION 1: Self-Hosted GitHub Runner (RECOMMENDED)**

This runs GitHub Actions directly on your EC2 instance - no SSH needed!

### Benefits:
- ✅ No need to store SSH keys in GitHub
- ✅ No need to expose EC2 IP
- ✅ Faster deployments (no network transfer)
- ✅ More secure

### Setup Steps:

#### Step 1: On GitHub
1. Go to your repository
2. Settings → Actions → Runners
3. Click **"New self-hosted runner"**
4. Choose **Linux** and **x64**
5. You'll see commands - keep this page open

#### Step 2: On Your EC2 Instance
```bash
# SSH into your EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Create a folder for the runner
mkdir actions-runner && cd actions-runner

# Download the runner (copy commands from GitHub page)
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure the runner (copy the config command from GitHub)
./config.sh --url https://github.com/YOUR_USERNAME/YOUR_REPO --token YOUR_TOKEN

# When prompted:
# Runner name: my-ec2-runner (or press Enter)
# Runner group: press Enter (default)
# Labels: press Enter (default)
# Work folder: press Enter (default)

# Install as a service (so it runs automatically)
sudo ./svc.sh install
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

#### Step 3: Update GitHub Workflow

**Modified `.github/workflows/cicd.yml`:**
```yaml
name: CI/CD Pipeline for Node.js App

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: self-hosted  # ← Changed from ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v3

    - name: Set Up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18

    - name: Install dependencies
      run: npm install

    - name: Build Docker image
      run: docker build -t ${{ secrets.DOCKER_USERNAME }}/my-node-app:latest .

    - name: Login to Docker Hub
      run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

    - name: Push Docker image to Docker Hub
      run: docker push ${{ secrets.DOCKER_USERNAME }}/my-node-app:latest

    - name: Deploy Application
      run: |
        docker pull ${{ secrets.DOCKER_USERNAME }}/my-node-app:latest
        docker stop myapp || true
        docker rm myapp || true
        docker run -d --name myapp -p 3000:3000 ${{ secrets.DOCKER_USERNAME }}/my-node-app:latest

    - name: Deployment Complete
      run: echo "✅ Application deployed successfully!"
```

#### GitHub Secrets Needed (Only 2!):
| Secret Name | Value |
|-------------|-------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token |

---

## **OPTION 2: AWS CodeDeploy**

Use AWS's native deployment service.

### Benefits:
- ✅ No SSH keys in GitHub
- ✅ AWS-native solution
- ✅ Better integration with AWS services

### Setup Steps:

#### Step 1: Install CodeDeploy Agent on EC2
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Install CodeDeploy agent
sudo apt update
sudo apt install -y ruby wget

cd /home/ubuntu
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto

# Start the agent
sudo service codedeploy-agent start

# Check status
sudo service codedeploy-agent status
```

#### Step 2: Create IAM Roles
1. **EC2 Role**: Allows EC2 to pull from CodeDeploy
   - Service: EC2
   - Policy: AmazonEC2RoleforAWSCodeDeploy

2. **CodeDeploy Role**: Allows CodeDeploy to manage deployment
   - Service: CodeDeploy
   - Policy: AWSCodeDeployRole

3. Attach EC2 role to your instance:
   - EC2 Console → Select instance → Actions → Security → Modify IAM role

#### Step 3: Create appspec.yml
```yaml
version: 0.0
os: linux
files:
  - source: /
    destination: /home/ubuntu/app
hooks:
  AfterInstall:
    - location: scripts/install_dependencies.sh
      timeout: 300
  ApplicationStart:
    - location: scripts/start_application.sh
      timeout: 300
```

#### Step 4: Create Deployment Scripts

**`scripts/install_dependencies.sh`:**
```bash
#!/bin/bash
cd /home/ubuntu/app
docker build -t my-node-app:latest .
```

**`scripts/start_application.sh`:**
```bash
#!/bin/bash
docker stop myapp || true
docker rm myapp || true
docker run -d --name myapp -p 3000:3000 my-node-app:latest
```

#### Step 5: Update GitHub Workflow
```yaml
name: Deploy with CodeDeploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Deploy to CodeDeploy
      run: |
        aws deploy create-deployment \
          --application-name MyNodeApp \
          --deployment-group-name production \
          --github-location repository=${{ github.repository }},commitId=${{ github.sha }}
```

---

## **OPTION 3: Docker Context (Direct Docker Deploy)**

Deploy directly using Docker contexts without SSH.

### Benefits:
- ✅ No SSH keys
- ✅ Simple setup
- ✅ Uses Docker's native remote deployment

### Setup Steps:

#### Step 1: Setup Docker Context on EC2
```bash
# On EC2, enable Docker remote API
sudo systemctl edit docker.service

# Add these lines:
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2375

# Restart Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

⚠️ **Security Warning**: This exposes Docker API. Better to use Option 1.

---

## **OPTION 4: GitHub Secrets (Original Method)**

If you still want to use SSH but keep it secure:

### Step 1: Get Your EC2 Private Key Content
```bash
# On your local machine, display the key
cat your-key.pem
```
Copy the **entire content** including:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

### Step 2: Add Secrets to GitHub
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token (from Phase 3) |
| `EC2_HOST` | EC2 public IP address |
| `EC2_USER` | `ubuntu` (or `ec2-user` for Amazon Linux) |
| `EC2_SSH_KEY` | Full content of your .pem file |

**Note**: GitHub Secrets are encrypted and secure. This is actually a safe method.

---

## 🎯 **RECOMMENDED**: Use Option 1 (Self-Hosted Runner)

It's the:
- ✅ Most secure
- ✅ Easiest to maintain
- ✅ Fastest for deployment
- ✅ No credential management needed

---

## Phase 6: GitHub Actions Workflow

### Create Workflow File
```bash
# In your project directory
mkdir -p .github/workflows
```

**Create `.github/workflows/cicd.yml`:**
```yaml
name: CI/CD Pipeline for Node.js App

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v3

    - name: Set Up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18

    - name: Install dependencies
      run: npm install

    - name: Build Docker image
      run: docker build -t ${{ secrets.DOCKER_USERNAME }}/my-node-app:latest .

    - name: Login to Docker Hub
      run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

    - name: Push Docker image to Docker Hub
      run: docker push ${{ secrets.DOCKER_USERNAME }}/my-node-app:latest

    - name: Done
      run: echo "Docker Image pushed to Docker Hub!"

    - name: Deploy to EC2 via SSH
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ${{ secrets.EC2_USER }}
        key: ${{ secrets.EC2_SSH_KEY }}
        script: |
          docker pull ${{ secrets.DOCKER_USERNAME }}/my-node-app:latest
          docker stop myapp || true
          docker rm myapp || true
          docker run -d --name myapp -p 3000:3000 ${{ secrets.DOCKER_USERNAME }}/my-node-app:latest
```

### Push the Workflow
```bash
git add .github/workflows/cicd.yml
git commit -m "Add CI/CD pipeline"
git push origin main
```

---

## Phase 7: Testing & Verification

### Step 1: Monitor GitHub Actions
1. Go to your GitHub repository
2. Click "Actions" tab
3. Watch your workflow run
4. Check each step for success ✅

### Step 2: Verify Deployment
```bash
# Test from your local machine
curl http://YOUR_EC2_PUBLIC_IP:3000

# Or open in browser
http://YOUR_EC2_PUBLIC_IP:3000
```

### Step 3: Check Docker on EC2
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# List running containers
docker ps

# Check logs
docker logs myapp

# View recent logs
docker logs -f myapp
```

---

## Phase 8: Making Changes & Redeployment

### Test the Pipeline
```bash
# Edit index.js - change version
# Change line: version: '1.0.0' to version: '2.0.0'

# Commit and push
git add .
git commit -m "Update version to 2.0.0"
git push origin main

# Watch GitHub Actions automatically:
# 1. Build new Docker image
# 2. Push to Docker Hub
# 3. Deploy to EC2
# 4. Restart container
```

---

## Troubleshooting

### Common Issues

**1. SSH Connection Failed**
```bash
# Check security group allows your IP on port 22
# Verify key permissions
chmod 400 your-key.pem
```

**2. Docker Permission Denied on EC2**
```bash
# Add user to docker group
sudo usermod -aG docker ubuntu
# Log out and back in
```

**3. Port Already in Use**
```bash
# Stop and remove old container
docker stop myapp
docker rm myapp
```

**4. GitHub Actions Fails**
- Check all secrets are correctly set
- Verify EC2 security groups
- Check Docker Hub credentials

**5. Can't Access App**
```bash
# Check container is running
docker ps

# Check container logs
docker logs myapp

# Verify EC2 security group allows port 3000
```

### Useful Commands

```bash
# View all containers
docker ps -a

# Remove all stopped containers
docker container prune

# View Docker images
docker images

# Remove unused images
docker image prune -a

# Check EC2 system logs
journalctl -u docker.service
```

---

## Success Checklist

- [ ] Node.js app running locally
- [ ] Code pushed to GitHub
- [ ] Docker Hub repository created
- [ ] EC2 instance launched and accessible
- [ ] Docker installed on EC2
- [ ] All GitHub secrets configured
- [ ] GitHub Actions workflow created
- [ ] First deployment successful
- [ ] App accessible at EC2 IP:3000
- [ ] Updates trigger automatic deployment

---

## Next Steps & Enhancements

1. **Add Custom Domain**
   - Use Route 53 for DNS
   - Point domain to EC2 IP

2. **Add HTTPS**
   - Install Nginx as reverse proxy
   - Use Let's Encrypt for SSL

3. **Add Environment Variables**
   - Store in GitHub Secrets
   - Pass to Docker container

4. **Add Testing**
   - Add test scripts in package.json
   - Run tests before deployment

5. **Add Notifications**
   - Slack/Discord notifications on deploy
   - Email on failure

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Express.js Documentation](https://expressjs.com/)

---

**Your CI/CD pipeline is now complete! Every push to main will automatically deploy to your EC2 instance. 🚀**
