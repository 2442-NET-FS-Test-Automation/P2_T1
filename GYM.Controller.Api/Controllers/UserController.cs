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

    // Obtener todos los usuarios (Admin y Trainer)
    [HttpGet("all-users")]
    [Authorize(Roles = "Admin,Trainer")]
    public async Task<ActionResult<List<UserAdminDTO>>> GetAllUsers()
    {
        List<UserAdminDTO> users = await _service.GetAllUsersForAdmin();
        return Ok(users);
    }

    // Crear usuario Staff (Trainer o Admin) - Solo Admin
    [HttpPost("create-staff")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> CreateStaffUser([FromBody] UserCreateAdminDTO dto)
    {
        if (dto is null)
            return BadRequest("Datos inválidos.");

        string? errorMessage = await _service.CreateStaffUserService(dto);
        if (errorMessage is not null)
            return BadRequest(new { message = errorMessage });

        return Ok(new { message = "Usuario de personal creado exitosamente." });
    }

    // Cambiar Rol de un Usuario - Solo Admin
    [HttpPatch("{id:int}/role")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> UpdateUserRole(int id, [FromBody] UserUpdateRoleDTO dto)
    {
        if (dto is null || string.IsNullOrWhiteSpace(dto.NewRole))
            return BadRequest("Rol inválido.");

        bool success = await _service.UpdateUserRole(id, dto.NewRole);
        if (!success)
            return NotFound(new { message = "Usuario no encontrado o no se pudo actualizar el rol." });

        // Limpiamos caché del usuario si existe
        _cache.Remove($"Users-Details:{id}");

        return Ok(new { message = $"Rol actualizado a '{dto.NewRole}' correctamente." });
    }
}

