using System.Reflection.Metadata.Ecma335;
using System.Runtime.CompilerServices;
using System.Security.Claims;
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
    private readonly IAchievementService _achivementService;
    private const string AllBookingsCacheKey = "Bookings:all";
    public BookingController(IBookingService service, IMemoryCache cache, IAchievementService achivementService)
    {
        _service = service;
        _cache = cache;
        _achivementService = achivementService;
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

    [HttpGet("BookingByUserId")]
    public async Task<ActionResult<IEnumerable<BookingDTO>>> GetBookingsByUserId()
    {
        string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(userIdString is null)
            return Unauthorized();
        int userId = int.Parse(userIdString);

        var dtos = await _service.GetBookingsByUserId(userId);

        return !dtos.Any() ? NotFound("No bookings found for this user.") : Ok(dtos);
    }
    
    //Add a new exercise
    [HttpPost("bookings")]
    public async Task<ActionResult<BookingDTO>> AddBooking(BookingDTO newBooking)
    {
        string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(userIdString is null)
            return Unauthorized();
        int userId = int.Parse(userIdString);
        newBooking.UserId = userId;

        BookingDTO newBookingDto = await _service.AddBookingAsync(newBooking);
        _cache.Remove(AllBookingsCacheKey);

        return CreatedAtAction(
            nameof(GetBookingById),
            new { id = newBookingDto.Id },
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

    [HttpPatch("bookings-status/{id}/{newStatus}")]
    public async Task<ActionResult<BookingDTO>> UpdateBookingStatus(int id, int newStatus)
    {
        //Checar que exista el booking, enviarlo a ser modificado (modificarlo, guardarlo en db)
        //regresar el dto

        //Desbloquear logro de primerWorkout
        string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(userIdString is null)
            return Unauthorized();
        int userId = int.Parse(userIdString);
        var logro = await _service.GetBookingsByUserId(userId);
        bool bandera = true;
        foreach(BookingDTO dto in logro)
        {
            if(dto.Status == BookingStatus.Completed)
                bandera = false;
        }

        if(bandera)
            await _achivementService.AddUserAchivement(1,userId);
            
        //Si no, mandar desbloquear el logro

        
        BookingDTO? updatedDTO = await _service.UpdateStatus(id, newStatus);

        
        if(updatedDTO is null)
            return BadRequest();

        _cache.Remove("Bookings:all");
        _cache.Remove($"Bookids:{id}");

        return Ok(updatedDTO);
    }

}
