using Microsoft.EntityFrameworkCore;
using TaskManager.API.Models;

namespace TaskManager.API.Data;

public class TaskDbContext : DbContext
{
    public TaskDbContext(DbContextOptions<TaskDbContext> options)
        : base(options)
    {
    }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Assignee).HasMaxLength(100);
            entity.Property(e => e.SubtasksJson).HasMaxLength(4000);
            entity.Property(e => e.RemarksJson).HasMaxLength(4000);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Priority);
        });
    }
}
