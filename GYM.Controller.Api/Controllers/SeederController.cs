
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
    [HttpPost]
    public async Task<bool> CreateData(List<RegisterUserDTOs> RegisterUserDTOs)
    {
     
        bool result = await _seeder.SeedInfo(RegisterUserDTOs);
        return result;
    }


}