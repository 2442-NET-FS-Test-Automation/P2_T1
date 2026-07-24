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
[ApiController]
[Route("api/[Controller]")]

public class UserController : ControllerBase
{
    private readonly IMemoryCache _cache;
    private readonly IUserService _service;

    public UserController(IMemoryCache cache, IUserService service)
    {
        _cache = cache;
        _service = service;
    }

    //User details

    //Get user details
    [HttpGet("users-details")]
    public async Task<ActionResult<UserDetailsDTO>> GetUserDetails()
    {
        string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(userIdString is null)
            return Unauthorized();
        int userId = int.Parse(userIdString);

        UserDetailsDTO? userDetailsDTO = await _cache.GetOrCreateAsync($"Users-Details:{userId}", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
            UserDetailsDTO? details = await _service.GetUserDetails(userId);
            return details;
        });

        return userDetailsDTO is null ?  NotFound() : Ok(userDetailsDTO);

    }

    //Add new user details
    [HttpPost("users-details")]
    public async Task<ActionResult<UserDetailsDTO>> PostUserDetails(UserDetailsDTO userDetailsDTO)
    {
        string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userIdString is null)
            return Unauthorized();

        if(userDetailsDTO is null)
            return BadRequest();
        int userId = int.Parse(userIdString);
        
        userDetailsDTO.UserId = userId;
        
        if(userDetailsDTO.JoinAt is null)
            userDetailsDTO.JoinAt = DateTime.UtcNow;

        UserDetailsDTO? result = await _service.AddUserDetails(userDetailsDTO);

        if(result is null)
            return BadRequest();
        
        return Ok(result);
    }

    //Update user details
    [HttpPut("users-details")]
    public async Task<ActionResult<UserDetailsDTO>> UpdateUserDetails(UserDetailsDTO userDetailsDTO)
    {
        string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userIdString is null)
            return Unauthorized();
        
        if(userDetailsDTO is null)
            return BadRequest();
        
        int userId = int.Parse(userIdString);
        userDetailsDTO.UserId = userId;

        UserDetailsDTO? result = await _service.UpdateUserDetails(userDetailsDTO);
        if(result is null)
            return BadRequest();
        
        _cache.Remove($"Users-Details:{userId}");
        return Ok(result);
    }
}

