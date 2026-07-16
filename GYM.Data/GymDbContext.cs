using Microsoft.EntityFrameworkCore;
using GYM.Data.Entities;

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
    }




}