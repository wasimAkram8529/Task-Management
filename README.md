## Real-Time Task Management System

A full stack project management application featuring authentication, role based access, real time collaboration and notifications, a clean dashboard experience, task tracking, and workspace management.
Built using MERN stack + TypeScript, with Socket.io for real time updates and React Query for state management.

## Features

### Authentication & Authorization

- User registration and login
- Password hashing using bcrypt
- JWT based authentication (stored in HttpOnly cookies)
- Protected routes on frontend
- Profile update support

### Task Management (Full CRUD)

- Create, read, update, and delete tasks
- Task attributes:
  - title (max 100 chars)
  - description (multi line)
  - dueDate
  - priority (Low, Medium, High, Urgent)
  - status (To Do, In Progress, Review, Completed)
  - creatorId
  - assignedToId
- Role based delete (only creator can delete)

### Real Time Collaboration (Socket.io)

- Live updates when task status / priority / assignee changes
- Instant assignment notifications
- Dashboard auto-updates without refresh

### Dashboard (Personal Views)

- Tasks assigned to the current user
- Tasks created by the current user
- Overdue tasks (based on due date)
- Clean separation between Dashboard (read only)
- Task List (full CRUD)

### UI & Engineering Quality

- Responsive UI using Tailwind CSS
- React Query for caching, refetching, and updates
- Clean folder structure and service based backend architecture

## Tech Stack

### Frontend

- React + TypeScript
- Vite
- Tailwind CSS
- React Query
- React Hook Form
- Socket.io Client

### Backend

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Socket.io
- JWT (HttpOnly cookies)
- Zod (DTO validation)

### DevOps

- Docker & Docker Compose (optional setup)

## Project Structure

- Frontend/

  - config/
    - db.ts
    - env.ts
  - controllers/
    - auth.controller.ts
    - notification.controller.ts
    - task.controller.ts
    - task.query.controller.ts
    - user.controller.ts
  - dtos/
    - auth.dto.ts
    - task.dto.ts
    - user.dto.ts
  - middleware/
    - auth.middleware.ts
    - error.middleware.ts
  - models/
    - notification.model.ts
    - task.model.ts
    - taskLog.model.ts
    - user.model.ts
  - routes/
    - auth.routes.ts
    - notification.routes.ts
    - task.routes.ts
    - user.routes.ts
  - services/
    - auth.service.ts
    - task.query.service.ts
    - task.service.ts
  - sockets/
    - socket.ts
  - tests/
    - authentication.test.ts
    - task.create.ts
    - task.update.test.ts
    - websocket.test.ts
  - types/
    - express.d.ts
  - utils/
    - appError.ts
    - asyncHandler.ts
    - jwt.ts
    - password.ts
    - sendEmail.ts
  - .dockerignore
  - .env
  - .gitignore
  - app.ts
  - jest.config.ts
  - package-lock.json
  - package.json
  - server.ts
  - tsconfig.json

- Backend
  - public/
  - src/
    - api/
      - axios.ts
      - auth.api.ts
      - notification.api.ts
      - task.api.ts
      - user.api.ts
    - component/
      - common/
        - AppLayout.tsx
        - NotificationBell.tsx
        - Spinner.tsx
      - dashboard/
        - TaskSection.tsx
      - tasks/
        - TaskCard.tsx
        - TaskHistory.tsx
        - TaskModal.tsx
    - context/
      - AuthContext.tsx
    - hooks/
      - useAuth.ts
      - useDashboard.ts
      - useSocket.ts
      - useTasks.ts
    - pages/
      - Dashboard.tsx
      - ForgotPassword.tsx
      - Login.tsx
      - Profile.tsx
      - Register.tsx
      - ResetPassword.tsx
      - TaskList.tsx
    - routes/
      - ProtectedRoutes.tsx
    - schemas/
      - auth.schema.ts
      - task.schema.ts
    - types/
      - task.ts
    - App.css
    - App.tsx
    - index.css
    - main.tsx
    - .dockerignore
    - .env
    - .gitignore
    - Dockerfile
    - index.html
    - nginx.conf
    - package.json
    - postcss.config.js
    - tailwind.config.js
    - tsconfig.json
    - vercel.json

## Setup Instructions

### Prerequisites

- Node.js (v20 or higher)
- Docker & Docker Compose
- MongoDB atlas setup

```bash
git clone https://github.com/wasimAkram8529/Task-Management.git
```

### Backend Setup

```bash
cd Backend
npm install
```

- Create a .env file

```env
PORT=5000
MONGO_URI=<MongoDB URI from mongodb atlas>
JWT_SECRET=<JWT Secret>
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EMAIL_USER=<Sender Email>
EMAIL_PASS=<Google app password>
```

- Run backend

  ```bash
  npm run dev
  ```

- Run Backend on:
  ```bash
  http://localhost:5000
  ```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- Create a .env file

```env
VITE_BACKEND_URL=http://localhost:5000
```

- Run Frontend

  ```bash
  npm run dev
  ```

- Run frontend on:
  ```bash
  http://localhost:5173
  ```

## API Contract (v1)

### Authentication

```table
Method,   Endpoint,                          Description
GET,      /api/v1/auth/                      Get all users
GET,      /api/v1/auth/me                    Get current user info
POST,     /api/v1/auth/register,             Create a new account
POST,     /api/v1/auth/login,                Authenticate and receive JWT
POST,     /api/v1/auth/logout,               Clear session/cookies
POST,     /api/v1/auth/forgot-password,      Get forgot password token
POST,     /api/v1/auth/reset-password:token, Create new password using token
POST,     /api/v1/auth/logout,               Clear session/cookies
```

### Task

```table
Method,    Endpoint,                   Description
GET,       /api/v1/tasks,              Get all tasks for current user
GET,       /api/v1/tasks/dashboard,    Get all dashboard info
GET,       /api/v1/tasks/:taskId/logs, Get logs related to a task
POST,      /api/v1/tasks/create-task,  Create a new task
PATCH,     /api/v1/tasks/:id,          Update task status or details
DELETE,    /api/v1/tasks/:id,          Remove a task
```

### Notification

```table
Method,     Endpoint,                   Description
GET,        /api/v1/notifications,      Get latest 20 notifications
PATCH,      /api/v1/notifications/read, Mark all unread as read
```

### User

```table
Method,     Endpoint,                   Description
GET,        /api/v1/user/,              Get user info
PATCH,      /api/v1/user/me,            Update user info
```

## Architecture and Design Decisions

### Why MongoDB?

- Flexible schema for task data
- Easy relationship handling via ObjectIds
- Fast iteration during development

### JWT via HttpOnly Cookies

- Prevents XSS attacks
- No token handling on frontend
- Stateless authentication

### Service Layer Pattern

- Controllers handle HTTP concerns
- Services contain business logic
- Easier testing & maintenance

### React Query

- Server state management
- Automatic caching and refetching
- Used for optimistic UI updates

## Real Time with Socket.io

### How it works:

- Upon login the frontend establishes a connection.
- Client joins room using user ID
- When a task is assigned or updated backend emits:
  - task:updated
  - notification:new
- Frontend listens and re fetches queries
- Task List updates instantly
- Dashboard reflects changes without refresh
- Assignment notifications are delivered in real time

## Docker Support (Optional)

- Run entire stack:

```bash
docker-compose up -d --build
```

- Services:
  - Frontend
  - Backend
  - MongoDB

### Trade-offs & Assumptions

- Minimal UI animations to focus on functionality
- Notifications are in app only (no email push)
- We assume a single workspace environment per user. Multi workspace logic was omitted to reduce complexity for the current version.
- We prioritized React Query for server state over Global State (Redux/Context) because maximum application state is a mirror of the database.

## Author

Md Wasim Akram
Full Stack Developer and Devops enthusiasm
