using Microsoft.EntityFrameworkCore;
using CourseService.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("PostgresConnection")
    ?? "Host=localhost;Database=course_db;Username=postgres;Password=postgres";

builder.Services.AddDbContext<CourseDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CourseDbContext>();
    for (int i = 0; i < 10; i++)
    {
        try
        {
            db.Database.EnsureCreated();
            Console.WriteLine("[CourseService] PostgreSQL Database created & seeded successfully.");
            break;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[CourseService] Waiting for PostgreSQL (Attempt {i + 1}/10): {ex.Message}");
            Thread.Sleep(2000);
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseAuthorization();
app.MapControllers();

app.Run();
