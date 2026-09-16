var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.UseRouting();
app.UseCors("AllowReactApp");

app.MapReverseProxy();

app.MapGet("/", () => Results.Json(new
{
    service = "API Gateway - Student Management System Microservices",
    status = "Online",
    version = "1.0.0"
}));

app.Run();
