using System.Net.Http.Json;
using TaskManager.Blazor.Models;

namespace TaskManager.Blazor.Services;

public class ProjectApiService
{
    private readonly HttpClient _http;
    private readonly List<Project> _fallbackProjects = [];
    private int _nextId = 1;

    public ProjectApiService(HttpClient http)
    {
        _http = http;
    }

    public async Task<List<Project>> GetProjectsAsync()
    {
        try
        {
            var result = await _http.GetFromJsonAsync<List<Project>>("api/projects");
            return result ?? [];
        }
        catch
        {
            return _fallbackProjects;
        }
    }

    public async Task<Project?> GetProjectAsync(int id)
    {
        try
        {
            return await _http.GetFromJsonAsync<Project>($"api/projects/{id}");
        }
        catch
        {
            return _fallbackProjects.FirstOrDefault(p => p.Id == id);
        }
    }

    public async Task<Project?> CreateProjectAsync(string name, string? description = null, string? color = null)
    {
        try
        {
            var response = await _http.PostAsJsonAsync("api/projects", new CreateProjectRequest(name, description, color));
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<Project>();
        }
        catch
        {
            var project = new Project { Id = _nextId++, Name = name, Description = description, Color = color ?? "#2563eb", CreatedAt = DateTime.UtcNow, TaskCount = 0 };
            _fallbackProjects.Add(project);
            return project;
        }
    }

    public async Task<Project?> UpdateProjectAsync(int id, string? name = null, string? description = null, string? color = null)
    {
        var response = await _http.PutAsJsonAsync($"api/projects/{id}", new UpdateProjectRequest(name, description, color));
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Project>();
    }

    public async Task DeleteProjectAsync(int id)
    {
        var response = await _http.DeleteAsync($"api/projects/{id}");
        response.EnsureSuccessStatusCode();
    }
}

public record CreateProjectRequest(string Name, string? Description, string? Color);
public record UpdateProjectRequest(string? Name, string? Description, string? Color);
