using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.Models;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly TaskDbContext _context;

    public ProjectsController(TaskDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
    {
        var projects = await _context.Projects
            .OrderBy(p => p.Name)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Description,
                p.Color,
                p.CreatedAt,
                TaskCount = _context.Tasks.Count(t => t.ProjectId == p.Id)
            })
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Project>> GetProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
            return NotFound();

        return Ok(project);
    }

    [HttpPost]
    public async Task<ActionResult<Project>> CreateProject([FromBody] CreateProjectRequest request)
    {
        var project = new Project
        {
            Name = request.Name,
            Description = request.Description,
            Color = request.Color
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Project>> UpdateProject(int id, [FromBody] UpdateProjectRequest request)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
            return NotFound();

        project.Name = request.Name ?? project.Name;
        project.Description = request.Description ?? project.Description;
        project.Color = request.Color ?? project.Color;

        await _context.SaveChangesAsync();
        return Ok(project);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
            return NotFound();

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateProjectRequest(string Name, string? Description = null, string? Color = null);
public record UpdateProjectRequest(string? Name = null, string? Description = null, string? Color = null);
