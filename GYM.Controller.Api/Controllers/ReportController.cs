using System.Text;
using GYM.Controller.Api.DTOs;
using GYM.Controller.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace GYM.Controller.Api.Controllers;

// [Authorize]
[ApiController]
[Route("api/[controller]")] // Fixed casing token structure
public class ReportController : ControllerBase
{
    private readonly IReportService _service;
    private readonly IMemoryCache _cache;

    public ReportController(IReportService service, IMemoryCache cache)
    {
        _service = service;
        _cache = cache;
    }

    // URL: GET api/report/user/5/json
    [HttpGet("user/{userId:int}/json")]
    public async Task<ActionResult<UserReportDTO>> GetJsonReport(int userId)
    {
        var report = await _service.GenerateUserReportAsync(userId);
        
        if (report is null)
            return NotFound($"No fitness metrics logs found to generate a report for User ID {userId}.");

        return Ok(report);
    }
}
