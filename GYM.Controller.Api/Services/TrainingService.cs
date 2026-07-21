using GYM.DTOs;
using GYM.Data.Entities;
using GYM.Data.Repositories;

namespace GYM.Services;

public class TrainingService : ITrainingService
{
    private readonly ITrainingRepository _repo;


    public TrainingService(ITrainingRepository repo)
    {
        _repo = repo;
    }

   public async Task<IEnumerable<TrainingDto>> GetAllTrainingsAsync()
    {
        var dbEntities = await _repo.GetAllAsync();
        
        var output = dbEntities.Select(m => new TrainingDto(
              m.TrainingID, 
              m.Name,
              m.GenericName,
              m.BrandName,
              m.DosageForm,
              m.Strength,
              m.UnitPrice,
              m.Inventory != null ? m.Inventory.StockQuantity : 0,
              m.Inventory != null ? m.Inventory.ExpiryDate : null
          ));

        return output;
    }

     public async Task<TrainingDto?> GetTrainingByIdAsync(int id)
    {
        var m = await _repo.GetByIdAsync(id);
        if (m == null) return null;

        return new TrainingDto(
            m.TrainingID,
            m.Name,
            m.GenericName,
            m.BrandName,
            m.DosageForm,
            m.Strength,
            m.UnitPrice,
            m.Inventory != null ? m.Inventory.StockQuantity : 0,
            m.Inventory != null ? m.Inventory.ExpiryDate : null
        );
    }


   public async Task<Training> CreateTrainingAsync(CreateTrainingDto dto)
    {
        var newTraining = new Training
        {
            Name = dto.Name,
            GenericName = dto.GenericName,
            BrandName = dto.BrandName,
            DosageForm = dto.DosageForm,
            Strength = dto.Strength,
            UnitPrice = dto.UnitPrice
        };

        await _repo.AddAsync(newTraining);
        
        await _repo.SaveChangesAsync();

        return newTraining;
    }
}