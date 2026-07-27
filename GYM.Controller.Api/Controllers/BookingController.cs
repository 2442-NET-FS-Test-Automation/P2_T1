using System.Reflection.Metadata.Ecma335;
using System.Runtime.CompilerServices;
using GYM.Controller.Api.DTOs;
using GYM.Controller.Api.Services;
using GYM.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

//[Authorize]
[ApiController] //ASP.NET knows to map this controller during app.MapControllers()
[Route("api/[Controller]")] //route base

public class BookingController : ControllerBase
{
    private readonly IBookingService _service;
    private readonly IMemoryCache _cache;
    private const string AllBookingsCacheKey = "Bookings:all";
    public BookingController(IBookingService service, IMemoryCache cache)
    {
        _service = service;
        _cache = cache;
    }

    //Get all the bookings from the db
    [HttpGet("bookings")]
    public async Task<ActionResult<IEnumerable<BookingDTO>>> GetAllBookings()
    {
        var dtos = await _cache.GetOrCreateAsync(AllBookingsCacheKey, async entry => //Check cache, if not there search the db via Service Layer
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1); //Will last 1 day

            var items = await _service.GetAllBookings();

            return items;
        });

        return dtos is null ? NotFound() : Ok(dtos); // 404 not found : 200 (list)

    }

    //Get booking by their id
    [HttpGet("bookings/{id:int}")]
    public async Task<ActionResult<BookingDTO>> GetBookingById(int id)
    {
        var dto = await _cache.GetOrCreateAsync(
            $"Bookings:{id}", 
            async entry => 
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1);
                return await _service.GetBookingById(id);
            });

        return dto is null ? NotFound() : Ok(dto);
    }

    //Add a new exercise
    [HttpPost("bookings")]
    public async Task<ActionResult<BookingDTO>> AddBooking(BookingDTO newBooking)
    {
        BookingDTO newBookingDto = await _service.AddBookingAsync(newBooking);
        _cache.Remove(AllBookingsCacheKey);

        return CreatedAtAction(
            nameof(GetBookingById),
            new { id = newBooking.Id },
            newBookingDto);

    }


    [HttpPut("bookings")]
    public async Task<IActionResult> UpdateBooking(BookingDTO bookingDTO)
    {
        if (bookingDTO is null)
            return BadRequest();

        BookingDTO? updatedBooking = await _service.UpdateBooking(bookingDTO);
        _cache.Remove(AllBookingsCacheKey);
        return Ok(updatedBooking);
    }

    //To delete by exercise by their id
    [Authorize(Roles = "Trainer,Admin")]
    [HttpDelete("bookings/{id:int}")]
    public async Task<ActionResult> DeleteBookingById(int id)
    {
        bool isDeleted = await _service.DeleteBookingByIdAsync(id);

        if (!isDeleted)
            return NotFound();

        _cache.Remove(AllBookingsCacheKey);

        _cache.Remove($"Bookings:{id}");

        return NoContent();
    }

}
