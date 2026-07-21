using GYM.Data;
using GYM.DTOs;
using GYM.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace GYM.Controllers;

[ApiController]
[Route("api/pharmacy/[controller]")] 
[Produces("application/json")]
public class BookingController : ControllerBase
{
    //private readonly ISeederService _seederService;
    private readonly IBookingService _service;

    public BookingController(IBookingService service/*, ISeederService seederService*/)
    {
        _service = service;
        //_seederService = seederService;
    }

    [HttpGet]
    public async Task<IActionResult> GetBookings()
    {
        var Bookings = await _service.GetAllBookingsAsync();
        return Ok(Bookings);
    }

    // [HttpPost("reset")]
    // public async Task<IActionResult> ResetPharmacyDomain()
    // {
    //     await _seederService.ResetDatabaseAsync();
    //     return Ok(new { message = "Catalog data reset." });
    // }

    [HttpPost("add")]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto payload)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var createdEntity = await _service.CreateBookingAsync(payload);

        var responseDto = new BookingDto(
            createdEntity.BookingID,
            createdEntity.Name,
            createdEntity.GenericName,
            createdEntity.BrandName,
            createdEntity.DosageForm,
            createdEntity.Strength,
            createdEntity.UnitPrice,
            0,
            null
        );

        return CreatedAtAction(
            nameof(GetBookingById),
            new { id = responseDto.BookingID }, 
            responseDto
        );
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetBookingById(int id)
    {
        var Booking = await _service.GetBookingByIdAsync(id);

        if (Booking == null) return NotFound($"Booking with ID {id} was not found.");
        return Ok(Booking);
    }

}
