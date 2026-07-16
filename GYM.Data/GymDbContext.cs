using Microsoft.EntityFrameworkCore;
using GYM.Data.Entities;
using Microsoft.EntityFrameworkCore.Internal;

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

        modelBuilder.Entity<Category>(e =>
        {
            //id unico, antoincremental, obligatorio
            //Name must be unique, max length 30
            //Description max length 255
        });

        modelBuilder.Entity<Booking>(e =>
        {
            //id unico, antoincremental, obligatorio
            //0<=totalAmount < 35/maxCapacitydDeROom
            //PaymentID FK- relacion. 1 booking a 1 payment
            //BookAt - hora actual
        });

        modelBuilder.Entity<Payment>(e =>
        {
            //id unico, antoincremental, obligatorio
            //0 < totalAmount < MaxDecimal, precision ? decimales 2
            //PAymentType ? 
            //Status enum
            //PaymentDate - hora actual
        });

        modelBuilder.Entity<User>(e =>
        {
            //id unico, antoincremental, obligatorio
            //email, type email, obligatorio, unico
            //phone, unico, obligatorio, maxLength 15
            //password -> Hashed, MaxLength ???
            //Role obligatorio
        });

        modelBuilder.Entity<UserDetail>(e =>
        {
            //id unico, antoincremental, obligatorio
            //userId FK - 1 a 1
            //name maxLenth 50, obligatorio
            //surname maxLength 50
            //join at - hora de creación
        });

        modelBuilder.Entity<Statistic>(e =>
        {
            //id unico, antoincremental, obligatorio
            //UserId - 1 userId a n statistic
            // 0 < Weight  < MaxDecimal, precision ? decimales 2. obligatorio
            // 0 < maxHeight  < MaxDecimal, precision ? decimales 2. obligatorio
            // 0 < strength  < MaxDecimal, precision ? decimales 2. obligatorio
            //0'0'' < milerun < max ?. obligatorio
            //Measureat - al crear, obligatorio

        });

    }




}