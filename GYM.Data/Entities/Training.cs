using Microsoft.EntityFrameworkCore;

namespace GYM.Data.Entities;

public class Training
{
    public int Id {get; set;} //PK
     public int TrainerId {get;set;} //FK - who is giving the training
    public User Trainer {get;set;} = default!; //Navigation property
    public int CategoryID {get; set; }  //Category FK
    public Category Category {get; set;} = default!; //Navigation property
    public int RoomId {get; set;} //FK
    public Room Room {get;set;} = default!; //Reference navigation
    public string Description {get; set; } = ""; //Description of the training
    public DateTime ClassStart {get; set; } //When it starts
    public DateTime ClassEnd {get; set;} //WHen it ends
    public int TotalAttendees {get; set;} //How many are going
    public List<Booking> Bookings{get;set;} = new(); //navigation property for all the bookings for the trainings

}