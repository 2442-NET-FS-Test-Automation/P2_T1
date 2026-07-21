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
    private readonly ITrainingService _service;
    private readonly IMemoryCache _cache;
    public TrainingController(ITrainingService service, IMemoryCache cache)
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

    [HttpGet("ExerciseByName/{id}")]
    public async Task<ActionResult<ExerciseDTO>> GetExerciseByName(int id)
    {
        var dto = await _service.GetExerciseById(id);

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

    //To delete by exercise by their id
    [HttpDelete("Exercise")]
    public async Task<ActionResult> DeleteExerciseById(int id)
    {
        bool isDeleted = await _service.DeleteExerciseByIdAsync(id);

        if(isDeleted)
        {
            _cache.Remove("Exercises:all");
            return NoContent();
        }
        else
        {
            return NotFound();
        }
    }
    
    [HttpGet("TrainingById/{id}")]
    public async Task<ActionResult<TrainingDTO>> GetTrainingById(int id)
    {
        var dto = await _service.GetTrainingDTOAsync(id);

        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpPost("AddTrainingInfo")]
    public async Task<ActionResult<TrainingDTO>> AddTraining(TrainingDTO training)
    {
        TrainingDTO trainingDTO = await _service.AddTrainingAsync(training);
        return Ok(trainingDTO);

    }

}