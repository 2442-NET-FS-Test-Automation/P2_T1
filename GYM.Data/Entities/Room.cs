using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace GYM.Data.Entities;

public class Room
{
    public int Id {get; set; }
    public string Name {get; set;} = ""; //Official name of the room

    public int MaxCapacity {get; set; } //Maximmum capacity for the room
    public bool IsAvailable {get; set;} //IS the room available. Not based on other classes but on external circumstances

    public List<Training> Trainings {get;set;} = new(); //Navigation property, 1 room has many trainings
}