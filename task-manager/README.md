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

## API Unavailable – Diagnostic Steps

If the Blazor app shows "API unavailable" or "Demo mode", follow these steps to diagnose:

### 1. Verify the API service exists and is running

1. Go to [Render Dashboard](https://dashboard.render.com) → **task-manager-api**
2. Check **Status**: should be "Live" (green). If "Suspended" or "Failed", the service is down.
3. Note the **URL** shown (e.g. `https://task-manager-api-xxxx.onrender.com`) – Render may add a suffix; this is your actual API URL.

### 2. Test the API URL directly

In a browser or terminal, try:

```bash
# Health check (should return 200 OK)
curl -i https://YOUR-API-URL/health

# List tasks (should return JSON array)
curl https://YOUR-API-URL/api/tasks
```

Replace `YOUR-API-URL` with the actual URL from Render (e.g. `https://task-manager-api-xxxx.onrender.com`).

- **404 "Not Found"**: Usually means the **API service doesn't exist** at that URL. In Render Dashboard, check:
  - Do you see **task-manager-api** in your services list?
  - If not: deploy it via **Blueprint** (New → Blueprint → select repo) or create it manually.
  - If yes: click it and copy the **exact URL** from the service overview (Render may use a different URL than `task-manager-api.onrender.com`).
- **502 / 503**: Service is starting (cold start). Wait 30–60 seconds and retry.
- **Connection refused / timeout**: Service may be down or sleeping. Go to Render → API service → **Manual Deploy** to wake it.

### 3. Point the Blazor app to the correct API URL

1. In Render → **task-manager-blazor** → **Environment**
2. Set `ApiBaseUrl` to the **exact** API URL from step 1 (no trailing slash)
3. Click **Save** → **Manual Deploy** → **Deploy latest commit**

### 4. Check Render logs

1. Render → **task-manager-api** → **Logs**
2. Look for:
   - **Build errors**: Fix in code and redeploy.
   - **Runtime errors**: Startup crash, DB issues, etc.
   - **"Listening on"**: App started successfully.

### 5. Check config and environment

- Ensure `render.yaml` (or your repo root) has `rootDir: task-manager/TaskManager.API` for the API.
- Confirm the API Dockerfile is in `task-manager/TaskManager.API/` and builds correctly.

### 6. Test locally

1. Run the API locally: `cd task-manager/TaskManager.API && dotnet run`
2. Open `http://localhost:5000/health` and `http://localhost:5000/api/tasks`
3. If they work locally, the API code is fine; the issue is likely deployment or URL config on Render.

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
