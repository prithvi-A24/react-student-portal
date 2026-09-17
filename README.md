# A FullStack Student Portal 
## Developed using React.js and Firebase
> ### Contains three modules
- Student
- Teacher
- Admin

---

> ### To Get Started you need to setup your own Firebase Project and copy configuration details form there and Update `firebaseConfig.js` accordingly.
> 
```js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_DOMAIN_NAME',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: '_YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSENGER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
```

> Steps to get started:
- Go to register admin Page(route = '/register')
- Register as admin
- Once registered, login as admin
- From admin dashboard, you can add dummy data via UI buttons added against each side link.
- This will create your database and seed it with dummy data, then you can login as student or teacher, by checking login from code or firebase.
- Then you are good to go.

---


> ## Pre-requisistes
- Nodejs
- npm or yarn
- react
- firebase project


> ## To Get Started 
- clone the repo `git clone https://github.com/awais-124/react-student-portal.git`
- run `npm install`
- run `npm start` to start development server. Headover to `localhost:3000` to see it live.
- run `npm run build` to create build directory.
- You are good to go.


Student Portal

A full-stack student portal application with a React frontend and a Node.js/Express backend deployed on Google Cloud.

The project demonstrates containerization with Docker, image management using Google Artifact Registry, and backend deployment using Google Cloud Run.

Architecture

                         Internet
                            |
                            v
                  +-------------------+
                  |   Firebase        |
                  |     Hosting       |
                  |                   |
                  |   React Frontend  |
                  +---------+---------+
                            |
                            | HTTPS API
                            v
                  +-------------------+
                  |    Google Cloud   |
                  |       Run         |
                  |                   |
                  |  Node.js/Express  |
                  |     Backend       |
                  +---------+---------+
                            |
                            v
                  +-------------------+
                  | Firebase Services |
                  |                   |
                  | Authentication    |
                  | Firestore         |
                  +-------------------+

Docker Workflow
---------------

Node.js Backend
      |
      v
   Dockerfile
      |
      v
 Docker Image
      |
      v
Artifact Registry
      |
      v
 Cloud Run

Project Overview

The Student Portal is a web application designed around different user roles such as:

Students

Teachers

Administrators

The original application is built using React and Firebase services.

For this deployment setup, the backend has been separated into a Node.js/Express service and containerized using Docker.

The backend Docker image is stored in Google Artifact Registry and deployed to Google Cloud Run.

Technologies Used

Frontend

React

Firebase Hosting

Firebase Authentication

Firestore

Backend

Node.js

Express.js

Containerization

Docker

Docker Desktop

Google Cloud

Google Cloud Run

Google Artifact Registry

Firebase

Firestore

Development Environment

WSL2

Ubuntu

VS Code

Git

GitHub

Repository Structure

react-student-portal/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── .dockerignore
│
├── modules/
├── task1/
├── task2/
├── src/
├── README.md
└── ...

Backend

The backend is implemented using Node.js and Express.

The application listens on the port provided by the PORT environment variable.

const PORT = process.env.PORT || 8080;

This allows the same application to run both locally and on Cloud Run.

Backend API

Health Check

GET /health

Example response:

{
  "status": "healthy",
  "service": "student-portal-backend"
}

Hello Endpoint

GET /api/v1/hello

Example response:

{
  "message": "Hello from Student Portal Backend!",
  "service": "Cloud Run"
}

These endpoints are currently used to verify that the backend is running correctly.

Running the Backend Locally

Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Start the application:

npm start

The application listens on port 8080 by default.

For local testing, another port can be supplied:

PORT=8082 npm start

Test the health endpoint:

curl http://localhost:8082/health

Test the API:

curl http://localhost:8082/api/v1/hello

Docker

The backend is containerized using Docker.

Dockerfile

FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]

Build the Image

From the backend directory:

docker build -t student-portal-backend:v1 .

Verify the image:

docker images

Run the Container Locally

docker run -d \
  --name student-portal-backend \
  -p 8082:8080 \
  student-portal-backend:v1

The port mapping is:

Host       Container
8082   ->  8080

Test the container:

curl http://localhost:8082/health

Check running containers:

docker ps

Stop the container:

docker stop student-portal-backend

Remove the container:

docker rm student-portal-backend

Google Artifact Registry

Artifact Registry is used to store the Docker image before deploying it to Cloud Run.

The image follows this structure:

REGION-docker.pkg.dev/
PROJECT_ID/
REPOSITORY/
IMAGE:TAG

Example:

asia-south1-docker.pkg.dev/
firebase-testing-508806/
student-portal/
backend:v1

Configure Docker Authentication

gcloud auth configure-docker asia-south1-docker.pkg.dev

Tag the Docker Image

docker tag student-portal-backend:v1 \
  asia-south1-docker.pkg.dev/firebase-testing-508806/student-portal/backend:v1

Verify:

docker images

Push the Image

docker push \
  asia-south1-docker.pkg.dev/firebase-testing-508806/student-portal/backend:v1

The image is now stored in Artifact Registry.

Google Cloud Run

Cloud Run is used to run the backend container without managing servers or virtual machines.

The deployment flow is:

Docker Image
     |
     v
Artifact Registry
     |
     v
Cloud Run
     |
     v
Running Container

Deploy the Backend

gcloud run deploy student-portal-backend \
  --image asia-south1-docker.pkg.dev/firebase-testing-508806/student-portal/backend:v1 \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated

After deployment, Cloud Run provides a service URL.

Example:

https://student-portal-backend-xxxxx.asia-south1.run.app

Test the Cloud Run Service

Health check:

curl https://YOUR-CLOUD-RUN-URL/health

API endpoint:

curl https://YOUR-CLOUD-RUN-URL/api/v1/hello

A successful response confirms that the following path is working:

Internet
   |
   v
Cloud Run
   |
   v
Docker Container
   |
   v
Node.js
   |
   v
Express API

Firebase

Firebase is used for application-level services.

Current services include:

Firebase Hosting

Firebase Authentication

Firestore

Firebase project:

firebase-testing-508806

The React application can be deployed to Firebase Hosting while the backend runs independently on Cloud Run.

Current Deployment Architecture

                     USERS
                       |
                       v
              +----------------+
              | Firebase       |
              | Hosting        |
              |                |
              | React Frontend |
              +-------+--------+
                      |
                      | HTTPS
                      v
              +----------------+
              | Cloud Run      |
              |                |
              | Express API    |
              +-------+--------+
                      |
                      v
              +----------------+
              | Firebase       |
              |                |
              | Auth           |
              | Firestore      |
              +----------------+

Docker Image:

Student Portal Backend
        |
        v
      Docker
        |
        v
Artifact Registry
        |
        v
    Cloud Run

Development Workflow

The current deployment workflow is:

1. Develop the backend
        |
        v
2. Build Docker image
        |
        v
3. Test Docker container locally
        |
        v
4. Tag Docker image
        |
        v
5. Push image to Artifact Registry
        |
        v
6. Deploy image to Cloud Run
        |
        v
7. Test Cloud Run endpoints
        |
        v
8. Connect React frontend to Cloud Run API
        |
        v
9. Deploy frontend to Firebase Hosting

Current Status

The following components have been successfully tested:

React application runs locally

Firebase project configured

Firebase Authentication configured

Firestore configured

Node.js/Express backend created

Backend health endpoint tested

Docker image built successfully

Docker container tested locally

Docker image pushed to Google Artifact Registry

Backend deployed to Google Cloud Run

Cloud Run backend endpoints tested successfully

Future Improvements

The next stages of the project can include:

Connect React frontend to Cloud Run API

Configure CORS

Implement Firebase Authentication in the backend

Verify Firebase ID tokens in Cloud Run

Implement role-based authorization

Improve Firestore security rules

Move secrets to Secret Manager

Add structured logging

Add Cloud Monitoring and alerting

Add CI/CD using GitHub Actions

Add Docker image vulnerability scanning

Use versioned Docker image tags

Implement least-privilege IAM

Improve container security

Add production-grade health checks

Configure custom domain and HTTPS

Add environment-specific deployments

Disclaimer

This project is currently a learning and deployment practice project. Some authentication, authorization, Firestore rules, and infrastructure configurations are intended for development/testing and should be hardened before production use.

