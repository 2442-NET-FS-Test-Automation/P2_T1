
using GYM.Controller.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[ApiController]
[Route("auth")]

public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    //RegisterUser
    [HttpPost("Register")]
    public async Task<ActionResult> Register(RegisterUserDTOs registerDto) 
    //Falta checar que el json si contenga email, contraseña y telefono
    {
        var result = await _userService.RegisterUserAsync(registerDto);

        if(result is not null)
            return Conflict(new {result}); //409 conflict
        
        return CreatedAtAction(nameof(Me),  result); //201 
    }

     [HttpGet("me")]
    public ActionResult Me()
    {
        return Ok( new
        {
            name = User.Identity?.Name,
            role = User.FindFirstValue(ClaimTypes.Role)
        });
    }

}