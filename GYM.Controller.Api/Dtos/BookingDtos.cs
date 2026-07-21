namespace GYM.DTOs;

public record BookingDto(
    int Id,
    int TrainingId,
    int UserId,
    string Status,
    DateTime? ExerciseTime,
    DateTime? DoneAt
);

public record CreateBookingDto(
    string Name,
    string GenericName,
    string BrandName,
    string DosageForm,
    string Strength,
    decimal UnitPrice
);
