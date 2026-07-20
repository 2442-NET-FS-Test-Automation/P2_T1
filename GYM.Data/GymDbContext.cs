using Microsoft.EntityFrameworkCore;
using GYM.Data.Entities;
using Microsoft.EntityFrameworkCore.Internal;
using System.Dynamic;
using System.Reflection.Metadata;

namespace GYM.Data;

//SQL generation, connection to db, CRUD, updating db based on changes to models
public class GymDbContext : DbContext
{
    //Constructor, ASP.NET takes care of it
    public GymDbContext(DbContextOptions<GymDbContext> options): base(options) { }

    //Classes singular, dbset plural
    //Classes -> Tables
public DbSet<User> Users => Set<User>();
    public DbSet<UserDetail> UserDetails => Set<UserDetail>();
    public DbSet<Training> Trainings => Set<Training>();
    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<TrainingExercises> TrainingExercises => Set<TrainingExercises>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Achievement> Achievements => Set<Achievement>();
    public DbSet<User_Achievement> UserAchievements => Set<User_Achievement>();
    public DbSet<Statistic> Statistics => Set<Statistic>();

    //Deeper configuration. Fluent API
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        // ==========================================
        // 1. RELACIÓN 1:1 (User <-> UserDetails)
        // ==========================================
        modelBuilder.Entity<User>()
            .HasOne(u => u.UserDetail)
            .WithOne(ud => ud.User)
            .HasForeignKey<UserDetail>(ud => ud.UserId)
            .OnDelete(DeleteBehavior.Cascade); // Si se elimina el User, se eliminan sus detalles
        
        // ==========================================
        // 2. RELACIONES 1:N (User & Training <-> Bookings)
        // ==========================================
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.User)
            .WithMany(u => u.Bookings)
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Training)
            .WithMany(t => t.Bookings)
            .HasForeignKey(b => b.TrainingId)
            .OnDelete(DeleteBehavior.Restrict); // Evita borrado en cascada para mantener el historial intacto        

        // ==========================================
        // 3. RELACIÓN M:N (Training <-> Exercise) mediante TrainingExercises
        // ==========================================
        modelBuilder.Entity<TrainingExercises>()
            .HasOne(te => te.Training)
            .WithMany(t => t.TrainingExercises)
            .HasForeignKey(te => te.TrainingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TrainingExercises>()
            .HasOne(te => te.Exercise)
            .WithMany(e => e.TrainingExercises)
            .HasForeignKey(te => te.ExerciseId)
            .OnDelete(DeleteBehavior.Cascade);

        // ==========================================
        // 4. RELACIÓN M:N (User <-> Achievements) mediante UserAchievements
        // ==========================================
        modelBuilder.Entity<User_Achievement>()
            .HasOne(ua => ua.User)
            .WithMany(u => u.UserAchievements)
            .HasForeignKey(ua => ua.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User_Achievement>()
            .HasOne(ua => ua.Achievement)
            .WithMany(a => a.UserAchievements)
            .HasForeignKey(ua => ua.AchievementId)
            .OnDelete(DeleteBehavior.Cascade);

        // ==========================================
        // 5. RELACIÓN 1:N (User <-> Statistics)
        // ==========================================
        modelBuilder.Entity<Statistic>()
            .HasOne(s => s.User)
            .WithMany(u => u.Statistics)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ==========================================
        // 6. MAPEO DE ENUMS A STRINGS
        // ==========================================
        // Guardar Enums como Texto en SQL Server facilita la lectura al inspeccionar la BD
        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<string>();

        modelBuilder.Entity<UserDetail>()
            .Property(ud => ud.Gender)
            .HasConversion<string>();

        modelBuilder.Entity<Training>()
            .Property(t => t.Place)
            .HasConversion<string>();

        modelBuilder.Entity<Booking>()
            .Property(b => b.Status)
            .HasConversion<string>();

        // ==========================================
        // 7. ÍNDICES 
        // ==========================================
        // Indice de Unicidad para Emails (Evita registros duplicados a nivel BD)
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Índice no clave para optimizar búsquedas frecuentes por ubicación de rutinas
        modelBuilder.Entity<Training>()
            .HasIndex(t => t.Place)
            .HasDatabaseName("IX_Trainings_Place");


        modelBuilder.Entity<User>(entity =>
        {
            // Index unico
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Phone).IsUnique();

            entity.Property(e => e.Email).HasColumnType("nvarchar(150)");
            entity.Property(e => e.Phone).HasColumnType("varchar(20)");
            entity.Property(e => e.Password).HasColumnType("nvarchar(255)");
        });

        modelBuilder.Entity<UserDetail>(entity =>
        {
            entity.Property(e => e.Name).HasColumnType("nvarchar(50)");
            entity.Property(e => e.Surname).HasColumnType("nvarchar(50)");
            entity.Property(e => e.JoinAt).HasColumnType("datetime2");
        });

        modelBuilder.Entity<Statistic>(entity =>
        {
            // Configurar precisión de decimales para métricas corporales
            entity.Property(e => e.Weight).HasColumnType("decimal(5,2)");   // Ej: 120.50 kg
            entity.Property(e => e.Height).HasColumnType("decimal(3,2)");   // Ej: 1.85 m
            entity.Property(e => e.Strength).HasColumnType("decimal(5,2)");

            // Mapeos nativos para fecha y hora simplificadas
            entity.Property(e => e.MileRun).HasColumnType("time");
            entity.Property(e => e.MeasureAt).HasColumnType("date");

            // Relación con User
            entity.HasOne(s => s.User)
                  .WithMany(u => u.Statistics)
                  .HasForeignKey(s => s.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Achievement>(entity =>
        {
            // relation with userAchievements -> many users can have many and different achievements
            entity.HasMany(e => e.UserAchievements)
                    .WithOne(ua => ua.Achievement)
                    .HasForeignKey(ua => ua.AchievementId)
                    .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<User_Achievement>(entity =>
        {
            entity.HasOne(ua => ua.User)
                .WithMany(u => u.UserAchievements)
                .HasForeignKey(ua => ua.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ua => ua.Achievement)
                .WithMany(a => a.UserAchievements)
                .HasForeignKey(ua => ua.AchievementId)
                .OnDelete(DeleteBehavior.Cascade);
        });


        // now it's time to add default data

        modelBuilder.Entity<User>().HasData(
            new User {Id = 1, Email="aranda.castillo.miguel@gmail.com", Phone="6645709069", Password="hola123", Role=Role.User},
            new User {Id = 2, Email="juanjimenez@example.com", Phone="8885748622", Password="juan123", Role=Role.Trainer}
        );

        modelBuilder.Entity<UserDetail>().HasData(
            new UserDetail {Id = 1, UserId=1, Name="Miguel Angel", Surname="Aranda Castillo", JoinAt=new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc)},
            new UserDetail {Id = 2, UserId=2, Name="Juan", Surname="Jimenez Ortega", JoinAt=new DateTime(2024, 1, 15, 0, 0, 0, DateTimeKind.Utc)}

        );

        modelBuilder.Entity<Achievement>().HasData(
            new Achievement {Id = 1, Name = "Newbie", Description="Complete your first workout", Points=5, Condition_type="workouts_completed"},
            new Achievement {Id = 2, Name = "Rocky Balboa", Description="Run 5 miles", Points=10, Condition_type="miles_runned"},
            new Achievement {Id = 3, Name = "Killer machine!", Description="Complete 5 workouts", Points=30, Condition_type="workouts_completed"}
        );


    }
}