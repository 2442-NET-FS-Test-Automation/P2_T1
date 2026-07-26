using System.Runtime.CompilerServices;
using GYM.Controller.Api.DTOs;
using GYM.Controller.Api.Services;
using GYM.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;


[ApiController] //ASP.NET knows to map this controller during app.MapControllers()
[Route("api/[Controller]")] //route base
public class StatsController : ControllerBase
{
    private readonly IStatsService _service;
    private readonly IMemoryCache _cache;
    public StatsController(IStatsService service, IMemoryCache cache)
    {
        _service = service;
        _cache = cache;
    }


    [HttpGet] // URL: GET api/stats
    public async Task<ActionResult<IEnumerable<StatsDTO>>> GetAllStats()
    {
        var dtos = await _cache.GetOrCreateAsync("Stats:all", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1);
            return await _service.GetAllStats();
        });

        // Cleaned up ternary return layout
        return dtos is null ? NotFound() : Ok(dtos);
    }

    [HttpGet("{id:int}")] // URL: GET api/stats/5
    public async Task<ActionResult<StatsDTO>> GetStatsById(int id)
    {
        var dto = await _service.GetStatsById(id);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpGet("user/{userId:int}")] // URL: GET api/stats/user/5
    public async Task<ActionResult<IEnumerable<StatsDTO>>> GetStatsByUserId(int userId)
    {
        var dtos = await _service.GetStatsByUserId(userId);

        // Safe evaluation handling for empty returned collections
        return dtos is null || !dtos.Any()
            ? NotFound("No stats found for this user.")
            : Ok(dtos);
    }

    [HttpPost] // URL: POST api/stats
    public async Task<ActionResult<StatsDTO>> AddStats([FromBody] StatsDTO newStats)
    {
        StatsDTO createdStatsDto = await _service.AddStatsAsync(newStats);

        // Cache eviction
        _cache.Remove("Stats:all");

        // Uses createdStatsDto.Id instead of the incoming newStats.Id parameter input
        return CreatedAtAction(
            nameof(GetStatsById),
            new { id = createdStatsDto.Id },
            createdStatsDto);
    }

    [HttpPut] // URL: PUT api/stats
    public async Task<IActionResult> UpdateStats([FromBody] StatsDTO statsDto)
    {
        if (statsDto is null)
            return BadRequest("Payload cannot be null.");

        StatsDTO? updatedStats = await _service.UpdateStats(statsDto);

        if (updatedStats is null)
            return NotFound("The requested stat entry could not be found to update.");

        _cache.Remove("Stats:all");
        return Ok(updatedStats);
    }

    [HttpDelete("{id:int}")] // URL: DELETE api/stats/5
    public async Task<ActionResult> DeleteStatsById(int id)
    {
        bool isDeleted = await _service.DeleteStatsByIdAsync(id);

        if (!isDeleted)
            return NotFound();

        _cache.Remove("Stats:all");
        return NoContent();
    }
}



