
using GYM.Controller.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using GYM.Controller.Api.DTOs;
using GYM.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using GYM.Data;

[ApiController]
[Route("seeder")]

public class SeederController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ISeederService _seeder;

    public SeederController(IUserService userService, ISeederService seeder)
    {
        _userService = userService;
        _seeder = seeder;
    }

    //Seed users (user, trainer, admin)
    [HttpPost("seed")]
    public async Task<bool> CreateData()
    {
        List<RegisterUserDTOs> lista = new()
        {
            new RegisterUserDTOs{Email = "user@test.com", Password="1234", Phone="1212121212"},
            new RegisterUserDTOs{Email = "trainer@test.com", Password="1234", Phone="1313131313"},
            new RegisterUserDTOs{Email = "admin@test.com", Password="1234", Phone="1414141414"},

        };
     
        bool result = await _seeder.SeedInfo(lista);
        return result;
    }


}