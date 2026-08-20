using Microsoft.EntityFrameworkCore;
using StockFlowBackend.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar CORS (Permite peticiones desde React / Vite)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Configurar MySQL con Entity Framework Core
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 2. Activar la política CORS
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.MapControllers();

app.Run();