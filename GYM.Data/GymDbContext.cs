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
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Statistic> Statistics => Set<Statistic>();
    public DbSet<Training> Trainings => Set<Training>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserDetail> UserDetails => Set<UserDetail>();
    public DbSet<Achievement> Achievement => Set<Achievement>();
    public DbSet<User_Achievement> UserAchivement => Set<User_Achievement>();

    //Deeper configuration. Fluent API
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<Room>(e =>
        {
            e.HasKey(r => r.Id); //Marks as Primary Key
            e.Property(r => r.Id).ValueGeneratedOnAdd(); //NO need to use a PK when creating new Room, automatic, autoincremental

            e.Property(r => r.Name).IsRequired().HasMaxLength(100); //Required, MaxLength = 100

            e.Property(r => r.MaxCapacity).IsRequired(); // Is requiered
            e.ToTable(t => t.HasCheckConstraint(
                "CK_Room_MaxCapacity",
                "0 < MaxCapacity AND MaxCapacity <= 35"
            )); //0 < MaxCapacity <= 35

            e.Property(e => e.IsAvailable).HasDefaultValue(true);
        });

        modelBuilder.Entity<Training>(e =>
        {
            e.HasKey(r => r.Id);
            e.Property(r => r.Id).ValueGeneratedOnAdd();
            //instructorid, es obligatorio - relación de 1 instructor por training
            
            //trainer 
            e.HasOne(u => u.Trainer).WithMany(c => c.Trainigs).HasForeignKey(o => o.TrainerId);

            //Category relationship. 
            e.HasOne(u => u.Category).WithMany(c => c.Trainings).HasForeignKey(o => o.CategoryID);

            //Room relationship
            e.HasOne(u => u.Room).WithMany(c => c.Trainings).HasForeignKey(o => o.RoomId);

            //Descripcion maxLength 250 caracteres
            e.Property(r => r.Description).HasMaxLength(250);

            //ClassStart < Classend
            e.ToTable(t => t.HasCheckConstraint("CK_Trainig_StartBeforeEnd", "ClassStart < ClassEnd"));

            e.Property(r => r.ClassStart).IsRequired();
            e.Property(r => r.ClassEnd).IsRequired();

        });

        //======= CATEGORY ======================================
        modelBuilder.Entity<Category>(e =>
        {
            //id unico, antoincremental, obligatorio
            //Los constaints de arriba estan en Entities/Category.cs como Data Annotations
            e.Property(n => n.Name).HasColumnType("varchar(30)");
            e.Property(d => d.Description).HasColumnType("varchar(255)");
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            //id unico, antoincremental, obligatorio
            //0<=totalAmount < 35/maxCapacitydDeROom
            //PaymentID FK- relacion. 1 booking a 1 payment
            //BookAt - hora actual

            entity.Property(e => e.BookAt).HasColumnType("datetime");

            // Relación con Training
            entity.HasOne(b => b.Training)
                  .WithMany(t => t.Bookings)
                  .HasForeignKey(b => b.TrainingId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Relación con User
            entity.HasOne(b => b.User)
                  .WithMany(u => u.Bookings)
                  .HasForeignKey(b => b.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Relación 1:1 con Payment
            entity.HasOne(b => b.Payment)
                  .WithOne(p => p.Booking)
                  .HasForeignKey<Booking>(b => b.PaymentId)
                  .OnDelete(DeleteBehavior.Cascade);

        });

        modelBuilder.Entity<Payment>(entity =>
        {
            //id unico, antoincremental, obligatorio
            //0 < totalAmount < MaxDecimal, precision ? decimales 2
            //PAymentType ? 
            //Status enum
            //PaymentDate - hora actual

            // Especificar precisión para dinero (decimal(18,2))
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.PaymentDate).HasColumnType("datetime");

            // Enum como String
            entity.Property(e => e.StatusPayment)
                  .HasConversion<string>()
                  .HasColumnType("varchar(20)");
        });

        modelBuilder.Entity<User>(entity =>
        {
            //id unico, antoincremental, obligatorio
            //email, type email, obligatorio, unico
            //phone, unico, obligatorio, maxLength 15
            //password -> Hashed, MaxLength ???
            //Role obligatorio

            // Index unico
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Phone).IsUnique();

            entity.Property(e => e.Email).HasColumnType("nvarchar(150)");
            entity.Property(e => e.Phone).HasColumnType("varchar(20)");
            entity.Property(e => e.Password).HasColumnType("nvarchar(255)");

            // Guardar Enum como String en lugar de Integer
            entity.Property(e => e.Role)
                  .HasConversion<string>()
                  .HasColumnType("varchar(20)");
        });

        modelBuilder.Entity<UserDetail>(entity =>
        {
            //id unico, antoincremental, obligatorio
            //userId FK - 1 a 1
            //name maxLenth 50, obligatorio
            //surname maxLength 50
            //join at - hora de creación

            entity.Property(e => e.Name).HasColumnType("nvarchar(50)");
            entity.Property(e => e.Surname).HasColumnType("nvarchar(50)");
            entity.Property(e => e.JoinAt).HasColumnType("datetime2");

            // Configuración Relación 1:1 con User
            entity.HasOne(ud => ud.User)
                  .WithOne(u => u.UserDetails)
                  .HasForeignKey<UserDetail>(ud => ud.UserId)
                  .OnDelete(DeleteBehavior.Cascade); // Si se borra el User, se borra su detalle
        });

        modelBuilder.Entity<Statistic>(entity =>
        {
            //id unico, antoincremental, obligatorio
            //UserId - 1 userId a n statistic
            // 0 < Weight  < MaxDecimal, precision ? decimales 2. obligatorio
            // 0 < maxHeight  < MaxDecimal, precision ? decimales 2. obligatorio
            // 0 < strength  < MaxDecimal, precision ? decimales 2. obligatorio
            //0'0'' < milerun < max ?. obligatorio
            //Measureat - al crear, obligatorio


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