using GYM.DTOs;
using GYM.Data.Entities;
using GYM.Data.Repositories;

namespace GYM.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _repo;


    public BookingService(IBookingRepository repo)
    {
        _repo = repo;
    }
   public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
    {
        var dbEntities = await _repo.GetAllAsync();
        
        var output = dbEntities.Select(m => new BookingDto(
              m.BookingID, 
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

     public async Task<BookingDto?> GetBookingByIdAsync(int id)
    {
        var m = await _repo.GetByIdAsync(id);
        if (m == null) return null;

        return new BookingDto(
            m.BookingID,
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


   public async Task<Booking> CreateBookingAsync(CreateBookingDto dto)
    {
        var newBooking = new Booking
        {
            Name = dto.Name,
            GenericName = dto.GenericName,
            BrandName = dto.BrandName,
            DosageForm = dto.DosageForm,
            Strength = dto.Strength,
            UnitPrice = dto.UnitPrice
        };

        await _repo.AddAsync(newBooking);
        
        await _repo.SaveChangesAsync();

        return newBooking;
    }
}