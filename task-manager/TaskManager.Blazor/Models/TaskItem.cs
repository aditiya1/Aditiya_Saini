using System.Text.Json;

namespace TaskManager.Blazor.Models;

public class TaskItem
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public TaskStatus Status { get; set; } = TaskStatus.ToDo;
    public DateTime CreatedAt { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? Assignee { get; set; }
    public string? SubtasksJson { get; set; }
    public string? RemarksJson { get; set; }

    public List<SubtaskItem> GetSubtasks() =>
        string.IsNullOrEmpty(SubtasksJson) ? [] : JsonSerializer.Deserialize<List<SubtaskItem>>(SubtasksJson) ?? [];

    public List<RemarkItem> GetRemarks() =>
        string.IsNullOrEmpty(RemarksJson) ? [] : JsonSerializer.Deserialize<List<RemarkItem>>(RemarksJson) ?? [];
}

public class SubtaskItem
{
    public string Title { get; set; } = "";
    public bool Completed { get; set; }
}

public class RemarkItem
{
    public string Text { get; set; } = "";
    public string Date { get; set; } = "";
}

public enum TaskPriority
{
    Low = 0,
    Medium = 1,
    High = 2,
    Urgent = 3
}

public enum TaskStatus
{
    ToDo = 0,
    InProgress = 1,
    Done = 2,
    Cancelled = 3
}
