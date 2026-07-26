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


        // Seeded DATA

        //==========================================
        // Exercise Seed Data
        //==========================================
        modelBuilder.Entity<Exercise>().HasData(
            new Exercise
            {
                Id = 1,
                Name = "Push-Ups",
                Description = "Perform a standard push-up while keeping your back straight and lowering your chest toward the floor.",
                VisualReferenceUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmhqd250ZHlqNjM1eThyZzJnbXFva3czc21hZmptOTZteTN0ZjA2eSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3pY8FQP9uMtDKXkYqX/giphy.gif",
                Sets = 4,
                Reps = 15
            },
            new Exercise
            {
                Id = 2,
                Name = "Bodyweight Squats",
                Description = "Perform a squat by lowering your hips toward the floor while keeping your chest up and your back straight.",
                VisualReferenceUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmx4cmJxOGZwMHUwaXBrbmJqaW9sa3ZlYmU3eGNsYXZpbTR6c2ppcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fnmk65werlZFy81pGw/giphy.gif",
                Sets = 4,
                Reps = 20
            },
            new Exercise
            {
                Id = 3,
                Name = "Dumbbell Bicep Curls",
                Description = "Curl dumbbells upward toward your shoulders while keeping your elbows close to your body and controlling the movement.",
                VisualReferenceUrl = "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YTQydzBwZnZxZXlweGt2NmxrbXFydGQ1MjFmdXYwZjZza3YwNnB2diZlcD12MV9naWZzX3NlYXJjaCZjdD1n/kFnaSyOxFVVKFVOi9O/giphy.gif",
                Sets = 3,
                Reps = 12
            },
            new Exercise
            {
                Id = 4,
                Name = "Plank",
                Description = "Hold a straight-body position supported by your forearms and toes while keeping your core tight.",
                VisualReferenceUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm44bmI1eGs1d2RnbmNxb2I5ajJtMXF4NGd4MmNnc3NpMWJvOXQwdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/KbOsMppYjfO5a/giphy.gif",
                Sets = 3,
                Reps = 1 // Represents 1 minute per set
            },
            new Exercise
            {
                Id = 5,
                Name = "Alternating Lunges",
                Description = "Step forward with one leg and lower your hips until both knees are bent, then return to the starting position and alternate legs.",
                VisualReferenceUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzdmMTg5d2tyaHY3eW92MHhja2ZhdzczN3Zra21lMmk1bWNyNTc5MSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l3q2Q3sUEkEyDvfPO/giphy.gif",
                Sets = 3,
                Reps = 12
            },
            new Exercise
            {
                Id = 6,
                Name = "Dumbbell Shoulder Press",
                Description = "Press dumbbells upward from shoulder level until your arms are extended, then lower them under control.",
                VisualReferenceUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmJ5ZmdrdmJmNzZtZDMxeHo3cTlrcW1zMXZtbWhpeHJud2V3NDUwNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/s1zHoMpAKEPnKoqW8k/giphy.gif",
                Sets = 3,
                Reps = 10
            },
            new Exercise
            {
                Id = 7,
                Name = "Glute Bridges",
                Description = "Lie on your back with your knees bent and lift your hips upward while squeezing your glutes.",
                VisualReferenceUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmVwM3JhdWlma2gyZTNtY2czNzFsZG50ODhyYnExdHc2cGVnNWV0aiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/oOGc4pXsX22XjE2eTA/giphy.gif",
                Sets = 4,
                Reps = 15
            },
            new Exercise
            {
                Id = 8,
                Name = "Mountain Climbers",
                Description = "Start in a plank position and alternate driving your knees toward your chest while keeping your core engaged.",
                VisualReferenceUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTVhbWxjdTloN3c0cWw1YWFwOW9jczV5cXlmZDFlN2xiOWdnZ2U0MCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VzlPEkuoqlgjehxvxk/giphy.gif",
                Sets = 3,
                Reps = 20
            },
            new Exercise
            {
                Id = 9,
                Name = "Dumbbell Rows",
                Description = "Pull a dumbbell toward your torso while keeping your back straight and your elbow close to your body.",
                VisualReferenceUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExem52cXIxMDJ6bzdmNTk2d3o3YXZrNjY3MGozZW8zM2F5N3E2NW1pdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oEjHM9hzerMdVjYWI/giphy.gif",
                Sets = 3,
                Reps = 12
            },
            new Exercise
            {
                Id = 10,
                Name = "Standing Calf Raises",
                Description = "Raise your heels off the ground while balancing on the balls of your feet, then slowly lower your heels.",
                VisualReferenceUrl = "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3eHdqY2l2aDhiOTBuZjh5OHc1YTV5dzdhb29yd2hhaDJodnRhdnpzcyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4VYaL0JOguZrBgjQOt/giphy.gif",
                Sets = 4,
                Reps = 20
            },

            new Exercise
            {
                Id = 11,
                Name = "Run",
                Description = "Normal run",
                VisualReferenceUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3p1YnNkeHBkczN3b2c3emkxcTQ2cTFlY3NlazdhdGdrNTY5c2E4byZlcD12MV9naWZzX3NlYXJjaCZjdD1n/CUbiYQbsKSGAM/giphy.gif",
                Sets = 1,
                Reps = 45 //min
            },

            new Exercise
            {
                Id = 12,
                Name = "Sprint",
                Description = "Several sprints and rest in between.",
                VisualReferenceUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWY4c2V4YWw5MDYzNTM3YW12dWJ0NjlxbGt4ZndpZ201eWJoamNhdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VFwqlu33Ob5ELrRXiw/giphy.gif",
                Sets = 3,
                Reps = 10 //min
            }
        );

        //==========================================
        // Training (Rutinas) Seed Data
        //==========================================
        modelBuilder.Entity<Training>().HasData(
            new Training
            {
                Id = 1,
                TrainingName = "Beginner Full Body Workout",
                Difficulty = "Easy",
                Calories = 250,
                Place = Place.Home,
                Description = "A beginner-friendly full-body workout that can be performed at home with little to no equipment.",
                EstimatedTime = new TimeOnly(0, 30, 0), // 30 minutes
                CreatedAt = new DateTime(2026, 7, 25)
            },
            new Training
            {
                Id = 2,
                TrainingName = "Upper Body Strength Workout",
                Difficulty = "Intermediate",
                Calories = 400,
                Place = Place.GYM,
                Description = "A strength-focused workout targeting the chest, shoulders, back, and arms using dumbbells and bodyweight exercises.",
                EstimatedTime = new TimeOnly(0, 45, 0), // 45 minutes
                CreatedAt = new DateTime(2026, 7, 25)
            },
            new Training
            {
                Id = 3,
                TrainingName = "High Intensity Cardio & Core",
                Difficulty = "Advanced",
                Calories = 600,
                Place = Place.Outdoors,
                Description = "A high-intensity workout combining cardio and core exercises to improve endurance and burn calories.",
                EstimatedTime = new TimeOnly(1, 0, 0), // 1 hour
                CreatedAt = new DateTime(2026, 7, 25)
            },
            new Training
            {
                Id = 4,
                TrainingName = "Lower Body Strength & Glutes",
                Difficulty = "Intermediate",
                Calories = 450,
                Place = Place.GYM,
                Description = "A lower-body focused workout designed to strengthen the legs and glutes using a combination of bodyweight and weighted exercises.",
                EstimatedTime = new TimeOnly(0, 50, 0), // 50 minutes
                CreatedAt = new DateTime(2026, 7, 25)
            },
            new Training
            {
                Id = 5,
                TrainingName = "Full Cardio",
                Difficulty = "Intermediate",
                Calories = 300,
                Place = Place.Outdoors,
                Description = "Cardio full of runs and sprints to archive a better physical condition.",
                EstimatedTime = new TimeOnly(1, 15, 0), // 25 minutes
                CreatedAt = new DateTime(2026, 7, 25)
            }
        );

        //==========================================
        // TrainingExercises (Pivote M:N) Seed Data
        //==========================================
        modelBuilder.Entity<TrainingExercises>().HasData(
            // Rutina 1 "Beginner Full Body Workout" - Easy
            new TrainingExercises { Id = 1, TrainingId = 1, ExerciseId = 1 },
            new TrainingExercises { Id = 2, TrainingId = 1, ExerciseId = 2 },
            new TrainingExercises { Id = 3, TrainingId = 1, ExerciseId = 4 },
            new TrainingExercises { Id = 4, TrainingId = 1, ExerciseId = 8 },
            new TrainingExercises { Id = 5, TrainingId = 1, ExerciseId = 11 },

            // Rutina  (Brazos) -> Contiene Flexiones (1) y Curl de Biceps (3)
            new TrainingExercises { Id = 6, TrainingId = 2, ExerciseId = 1 },
            new TrainingExercises { Id = 7, TrainingId = 2, ExerciseId = 3 },
            new TrainingExercises { Id = 8, TrainingId = 2, ExerciseId = 6 },

            // Rutina 3 High Intensity Cardio & Core
            new TrainingExercises { Id = 10, TrainingId = 3, ExerciseId = 4 },
            new TrainingExercises { Id = 11, TrainingId = 3, ExerciseId = 7 },
            new TrainingExercises { Id = 12, TrainingId = 3, ExerciseId = 8 },
            new TrainingExercises { Id = 13, TrainingId = 3, ExerciseId = 11 },
            new TrainingExercises { Id = 14, TrainingId = 3, ExerciseId = 12 },

            // Rutina 4 Lower Body Strength & Glutes
            new TrainingExercises { Id = 15, TrainingId = 4, ExerciseId = 2 },
            new TrainingExercises { Id = 16, TrainingId = 4, ExerciseId = 5 },
            new TrainingExercises { Id = 17, TrainingId = 4, ExerciseId = 7 },
            new TrainingExercises { Id = 18, TrainingId = 4, ExerciseId = 10 },
            new TrainingExercises { Id = 19, TrainingId = 4, ExerciseId = 5 },

            //Rutina 5 Full cardio
            new TrainingExercises { Id = 20, TrainingId = 5, ExerciseId = 11 },
            new TrainingExercises { Id = 21, TrainingId = 5, ExerciseId = 12 }
        );

        //==========================================
        // Achivements Seed Data
        //==========================================
        modelBuilder.Entity<Achievement>().HasData(
            new Achievement {Id = 1, Name = "Newbie", Description="Complete your first workout", Points=5, Condition_type="workouts_completed", Icon="fa-trophy"},
            new Achievement {Id = 2, Name = "Rocky Balboa", Description="Run 5 miles", Points=10, Condition_type="miles_runned", Icon="fa-star"},
            new Achievement {Id = 3, Name = "First Stats", Description="Your first measures", Points=30, Condition_type="stats_completed_1", Icon="fa-Medal"}
        );                
    }
}