using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.Models;
using TaskStatus = TaskManager.API.Models.TaskStatus;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly TaskDbContext _context;

    public TasksController(TaskDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks(
        [FromQuery] TaskStatus? status = null,
        [FromQuery] TaskPriority? priority = null,
        [FromQuery] string? search = null)
    {
        var query = _context.Tasks.AsQueryable();

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        if (priority.HasValue)
            query = query.Where(t => t.Priority == priority.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(t =>
                t.Title.ToLower().Contains(term) ||
                (t.Description != null && t.Description.ToLower().Contains(term)));
        }

        var tasks = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
        return Ok(tasks);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskItem>> GetTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();

        return Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>> CreateTask([FromBody] CreateTaskRequest request)
    {
        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority ?? TaskPriority.Medium,
            Status = request.Status ?? TaskStatus.ToDo,
            DueDate = request.DueDate,
            Assignee = request.Assignee,
            SubtasksJson = request.Subtasks != null ? System.Text.Json.JsonSerializer.Serialize(request.Subtasks) : null,
            RemarksJson = request.Remarks != null ? System.Text.Json.JsonSerializer.Serialize(request.Remarks) : null
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TaskItem>> UpdateTask(int id, [FromBody] UpdateTaskRequest request)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();

        task.Title = request.Title ?? task.Title;
        task.Description = request.Description ?? task.Description;
        task.Priority = request.Priority ?? task.Priority;
        task.Status = request.Status ?? task.Status;
        task.DueDate = request.DueDate ?? task.DueDate;
        if (request.Assignee != null) task.Assignee = string.IsNullOrWhiteSpace(request.Assignee) ? null : request.Assignee;
        if (request.Subtasks != null) task.SubtasksJson = System.Text.Json.JsonSerializer.Serialize(request.Subtasks);
        if (request.Remarks != null) task.RemarksJson = System.Text.Json.JsonSerializer.Serialize(request.Remarks);

        if (request.Status == TaskStatus.Done && task.CompletedAt == null)
            task.CompletedAt = DateTime.UtcNow;
        else if (request.Status != TaskStatus.Done)
            task.CompletedAt = null;

        await _context.SaveChangesAsync();
        return Ok(task);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<TaskItem>> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();

        task.Status = request.Status;
        if (request.Status == TaskStatus.Done)
            task.CompletedAt = DateTime.UtcNow;
        else
            task.CompletedAt = null;

        await _context.SaveChangesAsync();
        return Ok(task);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public record SubtaskDto(string Title, bool Completed);
public record RemarkDto(string Text, string Date);

public record CreateTaskRequest(
    string Title,
    string? Description = null,
    TaskPriority? Priority = null,
    TaskStatus? Status = null,
    DateTime? DueDate = null,
    string? Assignee = null,
    List<SubtaskDto>? Subtasks = null,
    List<RemarkDto>? Remarks = null);

public record UpdateTaskRequest(
    string? Title = null,
    string? Description = null,
    TaskPriority? Priority = null,
    TaskStatus? Status = null,
    DateTime? DueDate = null,
    string? Assignee = null,
    List<SubtaskDto>? Subtasks = null,
    List<RemarkDto>? Remarks = null);

public record UpdateStatusRequest(TaskStatus Status);
