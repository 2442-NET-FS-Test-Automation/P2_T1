using System.Reflection.Metadata.Ecma335;
using System.Runtime.CompilerServices;
using  GYM.Controller.Api.DTOs;
using GYM.Controller.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;


[ApiController] //ASP.NET knows to map this controller during app.MapControllers()
[Route("api/[Controller]")] //route base
public class TrainingController : ControllerBase
{
    private readonly IExerciseService _service;
    private readonly IMemoryCache _cache;
    public TrainingController(IExerciseService service, IMemoryCache cache)
    {
        _service = service;
        _cache = cache;
    }

    [HttpGet("allExercises")] //get all the exercises from the db
    public async Task<ActionResult<IEnumerable<ExerciseDTO>>> GetAllExercises()
    {
        var dtos = await _cache.GetOrCreateAsync("Exercises:all", async entry => //Check cache, if not there search the db via Service Layer
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1); //Will last 1 day

            var items = await _service.GetAllExercises();

            return items; //Falta Mapper, ahorita lo checo
        });

        return dtos is null ? NotFound() : Ok(dtos); // 404 not found : 200 (list)

    }

    [HttpGet("{name}")]
    public async Task<ActionResult<ExerciseDTO>> GetExerciseByName(string name)
    {
        
        if(string.IsNullOrWhiteSpace(name)) //Si name es vacio return null
            return NotFound();

        string nombre = name.Trim();
        var dto = await _service.GetExerciseByName(nombre);

        return dto is null ? NotFound() : Ok(dto);
    }
    
    [HttpPost("AddExercise")]//Add 1 exercise
    //Falta poner quien puede acceder a este endpoint !!!!!!!!!!!!!!!!!
    public async Task<ActionResult<ExerciseDTO>> AddExercise(ExerciseDTO newExercise)
    {
        ExerciseDTO newExerciseDto = await _service.AddExerciseAsync(newExercise);
        //_cache.Remove("Exercises:all"); //Se borra el cache

        return CreatedAtAction(
            nameof(GetExerciseByName),
            new {name = newExercise.Name},
            newExerciseDto);

    }

}