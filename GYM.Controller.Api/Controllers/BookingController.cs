using System.Reflection.Metadata.Ecma335;
using System.Runtime.CompilerServices;
using  GYM.Controller.Api.DTOs;
using GYM.Controller.Api.Services;
using GYM.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

[Authorize]
[ApiController] //ASP.NET knows to map this controller during app.MapControllers()
[Route("api/[Controller]")] //route base

public class BookingController : ControllerBase
{
    private readonly IBookingService _service;
    private readonly IMemoryCache _cache;
    public BookingController(IBookingService service, IMemoryCache cache)
    {
        _service = service;
        _cache = cache;
    }

    [HttpGet("bookings")] //get all the exercises from the db
    public async Task<ActionResult<IEnumerable<BookingDTO>>> GetAllBookings()
    {
        var dtos = await _cache.GetOrCreateAsync("Bookings:all", async entry => //Check cache, if not there search the db via Service Layer
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1); //Will last 1 day

            var items = await _service.GetAllBookings();

            return items; //Falta Mapper, ahorita lo checo
        });

        return dtos is null ? NotFound() : Ok(dtos); // 404 not found : 200 (list)

    }

    [HttpGet("bookings/{id}")]
    public async Task<ActionResult<BookingDTO>> GetBookingById(int id)
    {
        var dto = await _service.GetBookingById(id);

        return dto is null ? NotFound() : Ok(dto);
    }
    
    [HttpPost("bookings")]//Add 1 exercise
    //Falta poner quien puede acceder a este endpoint !!!!!!!!!!!!!!!!!
    public async Task<ActionResult<BookingDTO>> AddBooking(BookingDTO newBooking)
    {
        BookingDTO newBookingDto = await _service.AddBookingAsync(newBooking);  
        _cache.Remove("Bookings:all"); //Se borra el cache

        return CreatedAtAction(
            nameof(GetBookingById),
            new {Id = newBooking.Id},
            newBookingDto);

    }

    //To delete by exercise by their id
    [Authorize(Roles = "Trainer,Admin")]
    [HttpDelete("bookings/{id}")]
    public async Task<ActionResult> DeleteBookingById(int id)
    {
        bool isDeleted = await _service.DeleteBookingByIdAsync(id);

        if(isDeleted)
        {
            _cache.Remove("Bookings:all");
            return NoContent();
        }
        else
        {
            return NotFound();
        }
    }

}
