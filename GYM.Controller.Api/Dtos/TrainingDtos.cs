namespace GYM.DTOs;

public record TrainingDto(
    int TrainingID,
    string Name,
    string GenericName,
    string BrandName,
    string DosageForm,
    string Strength,
    decimal UnitPrice,
    int? AvailableStock,
    DateTime? NextExpirationDate
);

public record CreateTrainingDto(
    string Name,
    string GenericName,
    string BrandName,
    string DosageForm,
    string Strength,
    decimal UnitPrice
);
