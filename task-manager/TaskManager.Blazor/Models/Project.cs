namespace TaskManager.Blazor.Models;

public class Project
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TaskCount { get; set; }
}
