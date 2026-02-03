---
description: Frontend Implementation Plan for Project Camp
---

# Frontend Implementation Plan

## Phase 1: Auth Pages

- [ ] Create ForgotPassword page
- [ ] Create ResetPassword page (with token handling)
- [ ] Create EmailVerification page
- [ ] Create UserSettings page with ChangePassword form
- [ ] Update routes in App.jsx

## Phase 2: Project Actions

- [ ] Add EditProjectModal component
- [ ] Add Delete Project button with confirmation
- [ ] Add Change Role functionality in Team tab
- [ ] Add Remove Member functionality in Team tab
- [ ] Update ProjectView.jsx

## Phase 3: Task Management - Basic

- [ ] Create TaskDetailsModal component
- [ ] Make task cards clickable
- [ ] Implement Edit Task functionality
- [ ] Implement Delete Task functionality
- [ ] Add file input for attachments

## Phase 4: Task Management - Subtasks

- [ ] Add Subtasks section in TaskDetailsModal
- [ ] Implement Create Subtask
- [ ] Implement Edit Subtask (toggle completion)
- [ ] Implement Delete Subtask

## Phase 5: Task Management - Status Changes

- [ ] Add status dropdown in TaskDetailsModal
- [ ] Implement drag-and-drop for task cards (optional enhancement)

## Phase 6: Notes Actions

- [ ] Create EditNoteModal component
- [ ] Wire up Edit icon to open modal
- [ ] Wire up Delete icon with confirmation
- [ ] Update NotesList.jsx

## Backend Endpoints Reference

### Auth

- POST /auth/forgot-password
- POST /auth/reset-password/:resetToken
- GET /auth/verify-email/:verificationToken
- POST /auth/change-password

### Projects

- PUT /projects/:projectId
- DELETE /projects/:projectId
- PUT /projects/:projectId/members/:userId (change role)
- DELETE /projects/:projectId/members/:userId

### Tasks

- GET /tasks/:projectId
- POST /tasks/:projectId
- GET /tasks/:projectId/:taskId
- PUT /tasks/:projectId/:taskId
- DELETE /tasks/:projectId/:taskId
- POST /tasks/:projectId/:taskId/subtasks
- PUT /tasks/:projectId/:taskId/subtasks/:subtaskId
- DELETE /tasks/:projectId/:taskId/subtasks/:subtaskId

### Notes

- PUT /notes/:projectId/:noteId
- DELETE /notes/:projectId/:noteId
