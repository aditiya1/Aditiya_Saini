using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<TaskDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=taskmanager.db"));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("https://localhost:5002", "https://localhost:5003", "http://localhost:5002")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TaskDbContext>();
    db.Database.EnsureCreated();
    if (!db.Tasks.Any())
    {
        db.Tasks.AddRange(
            new TaskManager.API.Models.TaskItem
            {
                Title = "Welcome task",
                Description = "Complete the task manager setup",
                Priority = TaskManager.API.Models.TaskPriority.High,
                Status = TaskManager.API.Models.TaskStatus.ToDo
            },
            new TaskManager.API.Models.TaskItem
            {
                Title = "Review documentation",
                Description = "Read through the API documentation",
                Priority = TaskManager.API.Models.TaskPriority.Medium,
                Status = TaskManager.API.Models.TaskStatus.InProgress
            });
        db.SaveChanges();
    }
}

app.Run();
