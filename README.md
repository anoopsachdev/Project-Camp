# Project Camp - Project Management System

A full-stack project management application with a Node.js/Express backend and a React/Vite frontend.

## Features

- **User Authentication**: Register, Login, Email Verification.
- **Projects**: Create and manage projects.
- **Tasks**: Kanban-style task board (Todo, In Progress, Done).
- **Notes**: Shared notes within projects.
- **Team**: View team members and roles.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT.
- **Frontend**: React, Vite, Tailwind CSS, React Query, Axios.

## Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)

## Setup & Running

### 1. Backend

The backend runs on port `8000`.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Ensure you have a `.env` file in `backend/` (Refer to `.env.sample` if available, or use the existing one).
   - Required variables: `PORT`, `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `CORS_ORIGIN`, `SERVER_URL`.
4. Run the server:
   ```bash
   npm run dev
   ```

### 2. Frontend

The frontend runs on port `5173` (by default).

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Testing

- **Backend Verification**: Run `node scripts/verify_backend.js` in the `backend` folder to run an end-to-end API test sequence.
- **Frontend Testing**: Interactive elements have `data-testid` attributes ready for Selenium/E2E automation.
