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

## Running Locally

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

## Deploying for Live Demo (Render.com)

To make the Task Manager available as a live demo for portfolio visitors:

1. **Push your code** to GitHub (if not already).

2. **Deploy to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **New** → **Blueprint**
   - Connect your GitHub repo and select the one containing this project
   - Render will detect the `render.yaml` in the repo root and create both services
   - Click **Apply**

3. **Configure environment variables** (after first deploy):
   - Wait for **task-manager-api** to deploy and note its URL (e.g. `https://task-manager-api-xxxx.onrender.com`)
   - Go to **task-manager-blazor** → **Environment** → Add variable:
     - `ApiBaseUrl` = your API URL (e.g. `https://task-manager-api-xxxx.onrender.com`)
   - Click **Save** and **Manual Deploy** → **Deploy latest commit**

4. **Update your portfolio**:
   - Note the Blazor app URL (e.g. `https://task-manager-blazor-xxxx.onrender.com`)
   - In `src/data/projects.js`, set `liveUrl` for the task-manager project to this URL
   - Run `npm run deploy` to update your portfolio site

**Note:** Render's free tier may spin down services after inactivity. The first request after idle can take 30–60 seconds to wake up.

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

- .NET 8
- ASP.NET Core Web API
- Blazor Server
- Entity Framework Core + SQLite
