using Microsoft.EntityFrameworkCore;

namespace GYM.Data.Entities;

public class Training
{
    public int Id {get; set;} //PK
    public int InstructorId {get;set;} //FK - who is giving the training
    public int RoomId {get; set;} //FK
    public Category Category {get; set; } = default!; //Category/what kind of class
    public string Description {get; set; } = ""; //Description of the training
    public DateTime ClassStart {get; set; } //When it starts
    public DateTime ClassEnd {get; set;} //WHen it ends
    public int TotalAttendees {get; set;} //How many are going

}