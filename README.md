# YouRI Server

YouRI is a comprehensive backend server that provides APIs for managing organizations, teams, employees, projects, tasks, sessions, and more.

## API Routes

Below is a detailed list of all available API endpoints organized by modules:

### User Module
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user by ID
- `PATCH /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Admin Module
- `POST /api/admins` - Create a new admin
- `GET /api/admins` - Get all admins
- `GET /api/admins/:id` - Get a specific admin
- `PATCH /api/admins/:id` - Update an admin
- `DELETE /api/admins/:id` - Delete an admin

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh authentication token
- `POST /api/auth/change-password` - Change user password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Organization Module
- `POST /api/organizations` - Create a new organization
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/:id` - Get a specific organization
- `PATCH /api/organizations/:id` - Update an organization
- `DELETE /api/organizations/:id` - Delete an organization

### Project Module
- `POST /api/projects` - Create a new project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project
- `PATCH /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `GET /api/projects/organization/:id` - Get projects by organization ID
- `GET /api/projects/team/:id` - Get projects by team ID

### Team Module
- `POST /api/teams` - Create a new team
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get a specific team
- `PATCH /api/teams/:id` - Update a team
- `DELETE /api/teams/:id` - Delete a team
- `GET /api/teams/organization/:id` - Get teams by organization ID

### Task Module
- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/project/:id` - Get tasks by project ID
- `GET /api/tasks/assignee/:id` - Get tasks by assignee ID

### Employee Module
- `POST /api/employees` - Create a new employee
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get a specific employee
- `PATCH /api/employees/:id` - Update an employee
- `DELETE /api/employees/:id` - Delete an employee
- `GET /api/employees/organization/:id` - Get employees by organization ID

### Session Module
- `POST /api/sessions` - Create a new session
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get a specific session
- `PATCH /api/sessions/:id` - Update a session
- `DELETE /api/sessions/:id` - Delete a session
- `GET /api/sessions/employee/:id` - Get sessions by employee ID
- `GET /api/sessions/project/:id` - Get sessions by project ID
- `GET /api/sessions/task/:id` - Get sessions by task ID

### Stats Module
- `GET /api/stats/organization/:id` - Get statistics for an organization
- `GET /api/stats/project/:id` - Get statistics for a project
- `GET /api/stats/employee/:id` - Get statistics for an employee
- `GET /api/stats/team/:id` - Get statistics for a team

## Data Models

The API uses the following main data models:

- **User**: Base user account with authentication details
- **Admin**: Administrative user accounts
- **Organization**: Company or entity information
- **Project**: Work projects with tasks
- **Team**: Groups within an organization
- **Task**: Individual work items within projects
- **Employee**: User with employee role and details
- **Session**: Time tracking and activity monitoring
- **Stats**: Statistical data and analytics

## Authentication

Most API endpoints require authentication using JWT (JSON Web Tokens). Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start the server: `npm start`

## Development

- Development server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm run test`
