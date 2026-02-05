using System.Net.Http.Json;
using TaskManager.Blazor.Models;

namespace TaskManager.Blazor.Services;

public class TaskApiService
{
    private readonly HttpClient _http;

    public TaskApiService(HttpClient http)
    {
        _http = http;
    }

    public async Task<List<TaskItem>> GetTasksAsync(TaskStatus? status = null, TaskPriority? priority = null, string? search = null)
    {
        var query = new List<string>();
        if (status.HasValue) query.Add($"status={(int)status.Value}");
        if (priority.HasValue) query.Add($"priority={(int)priority.Value}");
        if (!string.IsNullOrWhiteSpace(search)) query.Add($"search={Uri.EscapeDataString(search)}");

        var url = "api/tasks" + (query.Count > 0 ? "?" + string.Join("&", query) : "");
        var result = await _http.GetFromJsonAsync<List<TaskItem>>(url);
        return result ?? [];
    }

    public async Task<TaskItem?> GetTaskAsync(int id)
    {
        return await _http.GetFromJsonAsync<TaskItem>($"api/tasks/{id}");
    }

    public async Task<TaskItem?> CreateTaskAsync(CreateTaskRequest request)
    {
        var response = await _http.PostAsJsonAsync("api/tasks", request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<TaskItem>();
    }

    public async Task<TaskItem?> UpdateTaskAsync(int id, UpdateTaskRequest request)
    {
        var response = await _http.PutAsJsonAsync($"api/tasks/{id}", request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<TaskItem>();
    }

    public async Task<TaskItem?> UpdateStatusAsync(int id, TaskStatus status)
    {
        var response = await _http.PatchAsJsonAsync($"api/tasks/{id}/status", new { status });
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<TaskItem>();
    }

    public async Task DeleteTaskAsync(int id)
    {
        var response = await _http.DeleteAsync($"api/tasks/{id}");
        response.EnsureSuccessStatusCode();
    }
}

public record CreateTaskRequest(string Title, string? Description, TaskPriority? Priority, TaskStatus? Status, DateTime? DueDate);

public record UpdateTaskRequest(string? Title, string? Description, TaskPriority? Priority, TaskStatus? Status, DateTime? DueDate);
