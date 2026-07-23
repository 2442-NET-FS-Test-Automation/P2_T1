using GYM.Data;
using Serilog;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyModel;
using Microsoft.AspNetCore.Identity;
using GYM.Data.Entities; 
using GYM.Data.Repositories;
using GYM.Controller.Api.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


//Here we get our connection "String" from our Json "appsettings.json"
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

//Connection with SQL server
builder.Services.AddDbContextFactory<GymDbContext>(options => //Se cambio a Factory
    options.UseSqlServer(connectionString));

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console() // Write to console, and write to a file - starting a new file each day.
    .WriteTo.File("logs/fulfillment-log-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog(); // Tell the builder to use Serilog for logging

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Caching
builder.Services.AddMemoryCache(); // adding cache-ing to our server
builder.Services.AddResponseCaching(); // adding response cache-ing - asking the front end to save request results 

//Password Hashing
builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();
//Services
builder.Services.AddScoped<ITrainingRepository, TrainingRepository>(); //Service
builder.Services.AddScoped<ITrainingService, TrainingService>(); //Repository

builder.Services.AddScoped<IUserService, UserService>(); //Service User for auth
builder.Services.AddScoped<IUserRepository, UserRepository>(); //Repository User for auth

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

app.UseResponseCaching(); //Response caching middleware
//app.UseSerilogRequestLogging(); No se cuando hay que descomentar

//Must be in this order for Authn/Authz
app.UseAuthentication(); // read and validate the tokens -> set User
app.UseAuthorization(); // enforces the [Authorize] / RequireAuthorization() decorators on endpoints 

app.UseHttpsRedirection();

app.MapControllers();

app.Run();

Log.CloseAndFlush(); // Close and flush the logs (serilog)