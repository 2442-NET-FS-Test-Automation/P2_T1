using Microsoft.EntityFrameworkCore;
using GYM.Data.Entities;
using Serilog;
using GYM.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// remember to change the connection string depending on your configuration
// miguel pass: libraryPass1!
var conn_string = "Server=localhost,1433;Database=LibraryMinimalDb;User Id=sa;Password=libraryPass1!;TrustServerCertificate=true";

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console() // Write to console, and write to a file - starting a new file each day.
    .WriteTo.File("logs/fulfillment-log-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog(); // Tell the builder to use Serilog for logging

// Adding CORS 
const string SpaCorsPolicy = "spa"; // string name for our policy

// Configuring our CORS policy
builder.Services.AddCors(o => o.AddPolicy(SpaCorsPolicy, p => p
    .WithOrigins("http://127.0.0.1:5137","http://127.0.0.1:5500")
    .AllowAnyHeader()
    .AllowAnyMethod()    
));

builder.Services.AddDbContextFactory<GymDbContext>(o => o.UseSqlServer(conn_string));

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseSerilogRequestLogging(); No se cuando hay que descomentar

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

Log.CloseAndFlush(); // Close and flush the logs (serilog)