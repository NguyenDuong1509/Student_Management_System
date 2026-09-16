using Microsoft.EntityFrameworkCore;
using AuthService.Data;
using AuthService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=localhost;Port=5432;Database=auth_db;Username=postgres;Password=postgres";

builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IJwtService, JwtService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Ensure Database & Tables created with Retry Loop
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var retryCount = 0;
    while (retryCount < 10)
    {
        try
        {
            var db = services.GetRequiredService<AuthDbContext>();
            db.Database.EnsureCreated();
            logger.LogInformation("AuthDbContext PostgreSQL Database Ensured Successfully.");
            break;
        }
        catch (Exception ex)
        {
            retryCount++;
            logger.LogWarning($"PostgreSQL connection retry {retryCount}/10 failed: {ex.Message}");
            Thread.Sleep(2000);
        }
    }
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
