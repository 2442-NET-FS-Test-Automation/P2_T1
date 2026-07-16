using Microsoft.EntityFrameworkCore;

namespace GYM.Data.Entities;

public class Room
{
    public int Id {get; set; }
    public string Name {get; set;} = ""; //Official name of the room
    public int MaxCapacity {get; set; } //Maximmum capacity for the room
    public bool IsAvailable {get; set;} //IS the room available ? yes : no
}