# Tasky - Task Management API

Tasky is a powerful **task management API** built with Node.js, Express, Sequelize (MySQL), and JWT authentication. It allows users to **create, update, and delete tasks**, upload task images, and manage their profiles securely.

## Features

- **User Authentication** (JWT-based login/signup)
- **Task CRUD Operations** (Create, Read, Update, Delete)
- **Image Uploads** (Using Multer)
- **Secure Database Storage** (MySQL via Sequelize)
- **Postman Collection** for API Testing (`Tasky.postman_collection.json`)

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/your-repo/tasky.git
cd tasky
```
### Install Dependencies
```bash
npm i
```

### Set Up Environment Variables
Create a .env file based on .env.sample, and configure:
```bash
    DB_USER=root
    DB_PASSWORD=toor
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_NAME=tasky_v100_beta
    APP_PORT=3000
    IMAGE_UPLOAD_DIR=uploads
    IMAGE_BASE_URL=http://localhost:3000/uploads
    JWT_SECRET=123456
    JWT_EXPIRES=15m
    JWT_REFRESH_SECRET=654321
    JWT_REFRESH_EXPIRES=7d
```
### Start the Server
```bash 
npm run dev
```
### API Endpoints
#### Authentication
```bash 
| Method | Endpoint | Description | 
| POST | /api/auth/signup | Register a new user | 
| POST | /api/auth/login | Login and get tokens | 
| POST | /api/auth/refresh | Refresh JWT token |
```


#### Task Management
```bash 
| Method | Endpoint | Description | 
| POST | /api/tasks | Create a new task | 
| GET | /api/tasks | Get all tasks | 
| GET | /api/tasks/:id | Get task by ID | 
| PUT | /api/tasks/:id | Update task | 
| DELETE | /api/tasks/:id | Delete task |
```


#### User Management
```bash 
| Method | Endpoint | Description | 
| GET | /api/users/:id | Get user details | 
| PUT | /api/users/:id | Update user | 
| DELETE | /api/users/:id | Delete user |
```

### Postman API Testing
- Import Tasky.postman_collection.json into Postman.
- Set up Authorization headers for protected routes.
Built With



