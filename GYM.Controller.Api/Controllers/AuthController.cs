
using GYM.Controller.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;

[ApiController]
[Route("authentication")]

public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;

    public AuthController(IUserService userService, ITokenService tokenService)
    {
        _userService = userService;
        _tokenService = tokenService;
    }

    //RegisterUser
    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterUserDTOs registerDto) 
    //Falta checar que el json si contenga email, contraseña y telefono
    {
        var result = await _userService.RegisterUserAsync(registerDto);

        if(result is not null)
            return Conflict(new {result}); //409 conflict
        
        return CreatedAtAction(nameof(Me),  result); //201 
    }

    //[Authorize(Roles = "Admin")] Desbloquear cuando tengamos cuentas de admin
    [HttpPost("register-trainer")]
    public async Task<ActionResult> RegisterTrainer(RegisterUserDTOs registerDto) 
    //Falta checar que el json si contenga email, contraseña y telefono
    {
        var result = await _userService.RegisterTrainerAsync(registerDto);

        if(result is not null)
            return Conflict(new {result}); //409 conflict
        
        return CreatedAtAction(nameof(Me),  result); //201 
    }

    //[Authorize(Roles = "Admin")] Desbloquear cuando tengamos cuentas de admin
    [HttpPost("register-admin")]
    public async Task<ActionResult> RegisterAdmin(RegisterUserDTOs registerDto) 
    //Falta checar que el json si contenga email, contraseña y telefono
    {
        var result = await _userService.RegisterAdminAsync(registerDto);

        if(result is not null)
            return Conflict(new {result}); //409 conflict
        
        return CreatedAtAction(nameof(Me),  result); //201 
    }

    [HttpGet("me")]
    public ActionResult Me()
    {
        return Ok( new
        {
            id = User.FindFirstValue(ClaimTypes.NameIdentifier),
            name = User.Identity?.Name,
            role = User.FindFirstValue(ClaimTypes.Role)
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult> LogIn(LogInDTO LogInDto)
    {
        var user = await _userService.ValidateAsync(LogInDto);

        if(user is null)
            return Unauthorized(new {error = "Bad credentials"});
        
        return Ok(new {token = _tokenService.Issue(user.Id, user.Email, user.Role)});
    }

    [HttpPost("token")]
    
    public ActionResult IssueToken(int id, string userEmail, Role role)
    {
        var userToken = _tokenService.Issue(id, userEmail, role);

        return Ok(userToken);
    }

}