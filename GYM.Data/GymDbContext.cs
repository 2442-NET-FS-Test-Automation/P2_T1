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
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Statistic> Statistics => Set<Statistic>();
    public DbSet<Training> Trainings => Set<Training>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserDetail> UserDetails => Set<UserDetail>();

    //Deeper configuration. Fluent API
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //Falta constraints
        modelBuilder.Entity<Room>(e =>
        {
            //id : unico, obligatorio, autoincremental
            //name : max 100 length, obligatorio
            //maxCapacity : 0 < capacidad < 35
            //isAvailable default = true
        });

        modelBuilder.Entity<Training>(e =>
        {
            //id unico, antoincremental, obligatorio
            //instructorid, es obligatorio - relación de 1 instructor por training
            //Descripcion maxLength 250 caracteres
            //ClassStart < Classend
            //RoomID FK, relación de n training a 1 room
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