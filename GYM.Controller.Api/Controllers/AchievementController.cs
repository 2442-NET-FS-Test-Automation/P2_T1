using System.Reflection.Metadata.Ecma335;
using System.Runtime.CompilerServices;
using GYM.Controller.Api.DTOs;
using GYM.Controller.Api.Services;
using GYM.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;


[ApiController] //ASP.NET knows to map this controller during app.MapControllers()
[Route("api/[Controller]")] //route base
public class AchievementController : ControllerBase
{
    private readonly IAchievementService _service;
    private readonly IMemoryCache _cache;
    public AchievementController(IAchievementService service, IMemoryCache cache)
    {
        _service = service;
        _cache = cache;
    }

    [HttpGet("allAchievements")] //get all the exercises from the db
    public async Task<ActionResult<IEnumerable<AchievementDTO>>> GetAllAchievements()
    {
        var dtos = await _cache.GetOrCreateAsync("Achievements:all", async entry => //Check cache, if not there search the db via Service Layer
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1); //Will last 1 day

            var items = await _service.GetAllAchievements();

            return items; //Falta Mapper, ahorita lo checo
        });

        return dtos is null ? NotFound() : Ok(dtos); // 404 not found : 200 (list)

    }

    [HttpGet("AchievementById/{id}")]
    public async Task<ActionResult<AchievementDTO>> GetAchievementById(int id)
    {
        var dto = await _service.GetAchievementById(id);

        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpGet("AchievementByUserId/{id}")]
    public async Task<ActionResult<IEnumerable<AchievementDTO>>> GetAchievementsByUserId(int id)
    {
        var dtos = await _service.GetAchievementsByUserId(id);

        return !dtos.Any() ? NotFound("No achievements found for this user.") : Ok(dtos);
    }

    [HttpPost("AddAchievement")]//Add 1 exercise
    //Falta poner quien puede acceder a este endpoint !!!!!!!!!!!!!!!!!
    public async Task<ActionResult<AchievementDTO>> AddAchievement(AchievementDTO newAchievement)
    {
        AchievementDTO newAchievementDto = await _service.AddAchievementAsync(newAchievement);
        _cache.Remove("Achievements:all"); //Se borra el cache

        return CreatedAtAction(
            nameof(GetAchievementById),
            new { Id = newAchievement.Id },
            newAchievementDto);

    }

    [HttpPut("updateAchievement")]
    public async Task<IActionResult> UpdateAchievement(AchievementDTO bookingDTO)
    {
        if (bookingDTO is null)
            return BadRequest();

        AchievementDTO? updatedAchievement = await _service.UpdateAchievement(bookingDTO);
        _cache.Remove("Achievements:all");
        return Ok(updatedAchievement);
    }

    //To delete by exercise by their id
    [HttpDelete("Achievement")]
    public async Task<ActionResult> DeleteAchievementById(int id)
    {
        bool isDeleted = await _service.DeleteAchievementByIdAsync(id);

        if (isDeleted)
        {
            _cache.Remove("Achievements:all");
            return NoContent();
        }
        else
        {
            return NotFound();
        }
    }


}
