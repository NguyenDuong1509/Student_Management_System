using Microsoft.EntityFrameworkCore;
using StudentService.Data;

var builder = WebApplication.CreateBuilder(args);

// Connection String PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("PostgresConnection")
    ?? "Host=localhost;Database=student_db;Username=postgres;Password=postgres";

builder.Services.AddDbContext<StudentDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto migration / database creation with retry logic
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<StudentDbContext>();
    for (int i = 0; i < 10; i++)
    {
        try
        {
            db.Database.EnsureCreated();
            Console.WriteLine("[StudentService] PostgreSQL Database created & seeded successfully.");
            break;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[StudentService] Waiting for PostgreSQL (Attempt {i + 1}/10): {ex.Message}");
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
