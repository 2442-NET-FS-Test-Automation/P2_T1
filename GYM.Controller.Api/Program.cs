using Microsoft.EntityFrameworkCore;
using GYM.Data.Entities;
using GYM.Data;
using GYM.Data.Repositories;
using Serilog;
//using Microsoft.Extensions.DependencyModel;
using Microsoft.AspNetCore.Identity;
using GYM.Controller.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


//Here we get our connection "String" from our Json "appsettings.json"
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

//Connection with SQL server
builder.Services.AddDbContextFactory<GymDbContext>(options =>
    options.UseSqlServer(connectionString));

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console() // Write to console, and write to a file - starting a new file each day.
    .WriteTo.File("logs/fulfillment-log-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog(); // Tell the builder to use Serilog for logging

//Authentication and Authorization -------------------------------------------------------------------------------
var jwtKey = builder.Configuration["Jwt:Key"]; //AppSettings.Development.json


//Issuer and audiende hardcoded
const string jwtIssuer = "GYM-fulfillment";
const string jwtAudience = "GYM-fulfillment-users";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o=>o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, ValidIssuer = jwtIssuer,
        ValidateAudience = true, ValidAudience = jwtAudience,
        ValidateIssuerSigningKey = true, IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateLifetime = true
    });

builder.Services.AddAuthorization(); //After authentication

//Stateless, we can use Singleton
builder.Services.AddSingleton<ITokenService, TokenService>(); //Services for log in

// Adding CORS 
const string SpaCorsPolicy = "spa"; // string name for our policy

// Configuring our CORS policy
builder.Services.AddCors(o => o.AddPolicy(SpaCorsPolicy, p => p
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod()    
));

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

builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();

var app = builder.Build();

//============================
//  Middleware
app.UseRouting();
app.UseCors(SpaCorsPolicy);

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