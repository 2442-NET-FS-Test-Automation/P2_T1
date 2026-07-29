using GYM.Data.Entities;

namespace GYM.Controller.Api.DTOs;


public class BookingDTO
{
    public int Id { get; set; }
    public int TrainingId { get; set; }
    public int UserId { get; set; }
    public BookingStatus Status { get; set; }
    public DateTime? ExerciseTime { get; set; } 
    public DateTime? DoneAt { get; set; } 

    public List<TrainingDTO> Trainings { get; set; } = new List<TrainingDTO>();
    
    // FIX: Change this from UserDetailsDTO to UserAdminDTO to match your service layer projection map
    public List<UserAdminDTO> Users { get; set; } = new List<UserAdminDTO>();
}