# Task Manager

A robust task manager built with **ASP.NET Core Web API** and **Blazor** (Server).

## Architecture

- **TaskManager.API** – REST API backend with Entity Framework Core (SQLite)
- **TaskManager.Blazor** – Blazor Server frontend consuming the API

## Features

- Create, read, update, delete tasks
- Task status: To Do, In Progress, Done, Cancelled
- Task priority: Low, Medium, High, Urgent
- Search and filter by status/priority
- Due dates and completion tracking

## Running the Application

1. **Restore packages** (if not already done):
   ```bash
   dotnet restore
   ```

2. **Start the API** (Terminal 1):
   ```bash
   cd TaskManager.API
   dotnet run
   ```
   API runs at http://localhost:5000

3. **Start the Blazor app** (Terminal 2):
   ```bash
   cd TaskManager.Blazor
   dotnet run
   ```
   Blazor runs at http://localhost:5002

4. Open http://localhost:5002 in your browser and go to **Tasks**.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | List tasks (optional: status, priority, search) |
| GET | /api/tasks/{id} | Get task by ID |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/{id} | Update task |
| PATCH | /api/tasks/{id}/status | Update status only |
| DELETE | /api/tasks/{id} | Delete task |

## Tech Stack

- .NET 10
- ASP.NET Core Web API
- Blazor Server
- Entity Framework Core + SQLite
