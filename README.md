<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
</p>

<h1 align="center">🏕️ Project Camp</h1>
<p align="center"><strong>A Collaborative Project Management System with Role-Based Access Control</strong></p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#testing">Testing</a>
</p>

---

## 📚 Academic Submission

| Field            | Details                                        |
| ---------------- | ---------------------------------------------- |
| **Course**       | TEST AUTOMATION (UCS662)                       |
| **Session**      | 2025-2026 Even Semester (6th Semester)         |
| **Institution**  | Thapar Institute of Engineering and Technology, Patiala |
| **Instructor**   | Dr. Javed Imran                                |
| **Submitted By** | Anoop Singh Sachdev              |

---

## 📖 Project Overview

**Project Camp** is a full-stack collaborative project management application inspired by industry-standard tools like Trello and Jira. It enables teams to organize work through Kanban-style task boards, manage project documentation, and collaborate effectively with role-based access control.

The system implements a three-tier permission model (Admin, Project Admin, Member) ensuring secure and structured access to project resources. Built with modern web technologies, it features real-time state management, secure JWT authentication, and cloud-based file storage.

### Key Highlights

- **Kanban Task Management**: Drag-and-drop task boards with Todo, In Progress, and Done columns
- **Role-Based Access Control**: Granular permissions for Admins, Project Admins, and Members
- **Team Collaboration**: Invite team members via email, assign tasks, and track progress
- **Secure Authentication**: JWT-based auth with email verification and password reset
- **File Attachments**: Cloud-based file storage using Cloudinary
- **Responsive Design**: Modern, mobile-friendly UI with professional aesthetics

---

## ✨ Features

### 👤 User Management

- User registration with email verification
- Secure login with JWT access/refresh tokens
- Password change and forgot/reset functionality
- Profile management with avatar support

### 📁 Project Boards

- Create and manage multiple projects
- Invite team members via email
- Role-based member management
- Project-level settings and configuration

### 📋 Tasks & Subtasks

- Kanban-style task organization (Todo → In Progress → Done)
- Task assignment to team members
- Subtask creation and completion tracking
- File attachments with cloud storage
- Rich task descriptions

### 📝 Project Notes

- Shared documentation within projects
- Admin-controlled note management
- Collaborative knowledge base

### 🔐 Permission Matrix

| Feature                    | Admin | Project Admin | Member |
| -------------------------- | :---: | :-----------: | :----: |
| Create Project             |  ✅   |      ❌       |   ❌   |
| Update/Delete Project      |  ✅   |      ❌       |   ❌   |
| Manage Project Members     |  ✅   |      ❌       |   ❌   |
| Create/Update/Delete Tasks |  ✅   |      ✅       |   ❌   |
| View Tasks                 |  ✅   |      ✅       |   ✅   |
| Update Subtask Status      |  ✅   |      ✅       |   ✅   |
| Create/Delete Subtasks     |  ✅   |      ✅       |   ❌   |
| Create/Update/Delete Notes |  ✅   |      ❌       |   ❌   |
| View Notes                 |  ✅   |      ✅       |   ✅   |

---

## 🛠️ Tech Stack

### Backend

| Technology            | Purpose                   |
| --------------------- | ------------------------- |
| **Node.js**           | Runtime environment       |
| **Express.js**        | Web application framework |
| **MongoDB**           | NoSQL database            |
| **Mongoose**          | MongoDB ODM               |
| **JWT**               | Authentication tokens     |
| **Nodemailer**        | Email services            |
| **Cloudinary**        | Cloud file storage        |
| **Multer**            | File upload handling      |
| **Express Validator** | Input validation          |

### Frontend

| Technology       | Purpose                   |
| ---------------- | ------------------------- |
| **React 18**     | UI library                |
| **Vite**         | Build tool and dev server |
| **Tailwind CSS** | Utility-first styling     |
| **React Query**  | Server state management   |
| **React Router** | Client-side routing       |
| **Axios**        | HTTP client               |
| **Lucide React** | Icon library              |
| **Sonner**       | Toast notifications       |

---

## 🧪 Testing Architecture

This project is designed with **test automation** in mind, featuring comprehensive testing support for frontend components.

### Frontend Automation Support

All interactive UI components are tagged with `data-testid` attributes to facilitate automated testing with frameworks like **Selenium**.

**Example Test IDs:**

```html
<button data-testid="login-button">Login</button>
<input data-testid="email-input" />
<div data-testid="task-card">...</div>
```

This enables reliable element selection in E2E test scripts:

```javascript
// Cypress example
cy.get('[data-testid="login-button"]').click();

// Selenium example
driver.findElement(By.cssSelector('[data-testid="email-input"]'));
```

---

## 📦 Installation

### Prerequisites

- **Node.js** v16 or higher
- **MongoDB** (Local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### 1. Clone the Repository

```bash
git clone https://github.com/anoopsachdev/Project-Camp.git
cd Project-Camp
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=8000
CORS_ORIGIN=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/projectcamp

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Email Configuration (SMTP)
NODEMAILER_SMTP_HOST=smtp.gmail.com
NODEMAILER_SMTP_PORT=587
NODEMAILER_SMTP_USER=your_email@gmail.com
NODEMAILER_SMTP_PASS=your_app_password

# Password Reset
FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password

# Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:

```bash
npm run dev
```

The API will be available at `http://localhost:8000/api/v1`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.development` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_BACKEND_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🚀 Deployment

The application is deployed using:

| Component | Platform      | URL                                                                      |
| --------- | ------------- | ------------------------------------------------------------------------ |
| Frontend  | Vercel        | [project-camp-kanban.vercel.app](https://project-camp-kanban.vercel.app) |
| Backend   | Render        | Cloud-hosted API                                                         |
| Database  | MongoDB Atlas | Cloud database                                                           |
| Files     | Cloudinary    | Cloud storage                                                            |

---

## 📁 Project Structure

```
Project-Camp/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth, upload, validation
│   │   ├── utils/           # Helper functions
│   │   ├── validators/      # Input validation
│   │   └── config/          # Configuration files
│   ├── scripts/
│   │   └── verify_backend.js  # E2E API tests
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── api/             # API client
│   │   └── hooks/           # Custom React hooks
│   └── package.json
│
└── README.md
```

---

## 🔗 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint                 | Description            |
| ------ | ------------------------ | ---------------------- |
| POST   | `/register`              | User registration      |
| POST   | `/login`                 | User login             |
| POST   | `/logout`                | User logout            |
| GET    | `/current-user`          | Get current user       |
| POST   | `/change-password`       | Change password        |
| POST   | `/forgot-password`       | Request password reset |
| POST   | `/reset-password/:token` | Reset password         |
| GET    | `/verify-email/:token`   | Verify email           |

### Projects (`/api/v1/projects`)

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/`                   | List all projects   |
| POST   | `/`                   | Create project      |
| GET    | `/:projectId`         | Get project details |
| PUT    | `/:projectId`         | Update project      |
| DELETE | `/:projectId`         | Delete project      |
| GET    | `/:projectId/members` | List members        |
| POST   | `/:projectId/members` | Add member          |

### Tasks (`/api/v1/tasks`)

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/:projectId`           | List project tasks |
| POST   | `/:projectId`           | Create task        |
| GET    | `/:projectId/t/:taskId` | Get task details   |
| PUT    | `/:projectId/t/:taskId` | Update task        |
| DELETE | `/:projectId/t/:taskId` | Delete task        |

---

## 📄 License

This project is developed as part of academic coursework at Thapar Institute of Engineering and Technology.

---

<p align="center">
  <strong>Developed with ❤️ by Anoop Singh Sachdev</strong>
</p>
