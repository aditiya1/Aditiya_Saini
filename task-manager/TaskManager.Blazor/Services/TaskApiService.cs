using System.Net.Http.Json;
using System.Text.Json;
using TaskManager.Blazor.Models;
using TaskStatus = TaskManager.Blazor.Models.TaskStatus;

namespace TaskManager.Blazor.Services;

public class TaskApiService
{
    private readonly HttpClient _http;
    private bool _useFallback;
    private readonly List<TaskItem> _fallbackTasks = [];
    private int _nextId = 1;
    private readonly object _lock = new();

    public bool IsUsingFallback => _useFallback;

    public TaskApiService(HttpClient http)
    {
        _http = http;
    }

    public async Task<List<TaskItem>> GetTasksAsync(int? projectId = null, TaskStatus? status = null, TaskPriority? priority = null, string? search = null)
    {
        if (!_useFallback)
        {
            try
            {
                var query = new List<string>();
                if (projectId.HasValue) query.Add($"projectId={projectId.Value}");
                if (status.HasValue) query.Add($"status={(int)status.Value}");
                if (priority.HasValue) query.Add($"priority={(int)priority.Value}");
                if (!string.IsNullOrWhiteSpace(search)) query.Add($"search={Uri.EscapeDataString(search!)}");

                var url = "api/tasks" + (query.Count > 0 ? "?" + string.Join("&", query) : "");
                var result = await _http.GetFromJsonAsync<List<TaskItem>>(url);
                return result ?? [];
            }
            catch
            {
                _useFallback = true;
            }
        }

        return GetFallbackTasks(projectId, status, priority, search);
    }

    public async Task<TaskItem?> GetTaskAsync(int id)
    {
        if (!_useFallback)
        {
            try
            {
                return await _http.GetFromJsonAsync<TaskItem>($"api/tasks/{id}");
            }
            catch
            {
                _useFallback = true;
            }
        }

        return _fallbackTasks.FirstOrDefault(t => t.Id == id);
    }

    public async Task<TaskItem?> CreateTaskAsync(CreateTaskRequest request)
    {
        if (!_useFallback)
        {
            try
            {
                var response = await _http.PostAsJsonAsync("api/tasks", request);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<TaskItem>();
            }
            catch
            {
                _useFallback = true;
            }
        }

        lock (_lock)
        {
            var task = new TaskItem
            {
                Id = _nextId++,
                ProjectId = request.ProjectId,
                Title = request.Title,
                Description = request.Description,
                Priority = request.Priority ?? TaskPriority.Medium,
                Status = request.Status ?? TaskStatus.ToDo,
                CreatedAt = DateTime.UtcNow,
                DueDate = request.DueDate,
                Assignee = request.Assignee,
                SubtasksJson = request.Subtasks != null ? JsonSerializer.Serialize(request.Subtasks) : null,
                RemarksJson = request.Remarks != null ? JsonSerializer.Serialize(request.Remarks) : null
            };
            _fallbackTasks.Add(task);
            return task;
        }
    }

    public async Task<TaskItem?> UpdateTaskAsync(int id, UpdateTaskRequest request)
    {
        if (!_useFallback)
        {
            try
            {
                var response = await _http.PutAsJsonAsync($"api/tasks/{id}", request);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<TaskItem>();
            }
            catch
            {
                _useFallback = true;
            }
        }

        lock (_lock)
        {
            var task = _fallbackTasks.FirstOrDefault(t => t.Id == id);
            if (task == null) return null;

            if (request.Title != null) task.Title = request.Title;
            if (request.Description != null) task.Description = request.Description;
            if (request.Priority != null) task.Priority = request.Priority.Value;
            if (request.Status != null) task.Status = request.Status.Value;
            task.DueDate = request.DueDate;
            if (request.Assignee != null) task.Assignee = request.Assignee;
            if (request.Subtasks != null) task.SubtasksJson = JsonSerializer.Serialize(request.Subtasks);
            if (request.Remarks != null) task.RemarksJson = JsonSerializer.Serialize(request.Remarks);
            if (request.Status == TaskStatus.Done) task.CompletedAt = DateTime.UtcNow;
            else if (request.Status != null) task.CompletedAt = null;
            return task;
        }
    }

    public async Task UpdateStatusAsync(int id, TaskStatus status)
    {
        if (!_useFallback)
        {
            try
            {
                var response = await _http.PatchAsJsonAsync($"api/tasks/{id}/status", new { status });
                response.EnsureSuccessStatusCode();
                return;
            }
            catch
            {
                _useFallback = true;
            }
        }

        lock (_lock)
        {
            var task = _fallbackTasks.FirstOrDefault(t => t.Id == id);
            if (task != null)
            {
                task.Status = status;
                task.CompletedAt = status == TaskStatus.Done ? DateTime.UtcNow : null;
            }
        }
    }

    public async Task DeleteTaskAsync(int id)
    {
        if (!_useFallback)
        {
            try
            {
                var response = await _http.DeleteAsync($"api/tasks/{id}");
                response.EnsureSuccessStatusCode();
                return;
            }
            catch
            {
                _useFallback = true;
            }
        }

        lock (_lock)
        {
            _fallbackTasks.RemoveAll(t => t.Id == id);
        }
    }

    private List<TaskItem> GetFallbackTasks(int? projectId, TaskStatus? status, TaskPriority? priority, string? search)
    {
        var list = _fallbackTasks.AsEnumerable();
        if (projectId.HasValue) list = list.Where(t => t.ProjectId == projectId.Value);
        if (status.HasValue) list = list.Where(t => t.Status == status.Value);
        if (priority.HasValue) list = list.Where(t => t.Priority == priority.Value);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            list = list.Where(t =>
                t.Title.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                (t.Description != null && t.Description.Contains(term, StringComparison.OrdinalIgnoreCase)));
        }
        return list.OrderByDescending(t => t.CreatedAt).ToList();
    }
}

public record CreateTaskRequest(int ProjectId, string Title, string? Description, TaskPriority? Priority, TaskStatus? Status, DateTime? DueDate, string? Assignee = null, List<SubtaskItem>? Subtasks = null, List<RemarkItem>? Remarks = null);

public record UpdateTaskRequest(string? Title, string? Description, TaskPriority? Priority, TaskStatus? Status, DateTime? DueDate, string? Assignee = null, List<SubtaskItem>? Subtasks = null, List<RemarkItem>? Remarks = null);
