using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GYM.Data.Entities;

namespace GYM.Data.Entities;

[Table("Bookings")]
public class Booking
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int TrainingId { get; set; }

    [ForeignKey(nameof(TrainingId))]
    public Training Training { get; set; } = null!;

    [Required]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    [Required]
    public BookingStatus Status { get; set; } = BookingStatus.Book;

    public DateTime ExerciseTime { get; set; }

    public DateTime? DoneAt { get; set; }
}