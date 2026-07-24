using System.Reflection.Metadata.Ecma335;
using System.Runtime.CompilerServices;
using  GYM.Controller.Api.DTOs;
using GYM.Controller.Api.Services;
using GYM.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

//Controller for exercises and training, add, update, delete, get

[Authorize]
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

    [HttpGet("exercises")] //get all the exercises from the db
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

    [HttpGet("exercises/{id}")]
    public async Task<ActionResult<ExerciseDTO>> GetExerciseById(int id)
    {
        var dto = await _service.GetExerciseById(id);

        return dto is null ? NotFound() : Ok(dto);
    }
    
    [Authorize(Roles = "Trainer,Admin")]
    [HttpPost("exercises")]//Add 1 exercise
    //Falta poner quien puede acceder a este endpoint !!!!!!!!!!!!!!!!!
    public async Task<ActionResult<ExerciseDTO>> AddExercise(ExerciseDTO newExercise)
    {
        ExerciseDTO newExerciseDto = await _service.AddExerciseAsync(newExercise);  
        _cache.Remove("Exercises:all"); //Se borra el cache

        return CreatedAtAction(
            nameof(GetExerciseById),
            new {Id = newExercise.Id},
            newExerciseDto);

    }

    //To delete by exercise by their id
    [Authorize(Roles = "Trainer,Admin")]
    [HttpDelete("exercises/{id}")]
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
    
    [HttpGet("trainings/{id}")]
    public async Task<ActionResult<TrainingDTO>> GetTrainingById(int id)
    {
        var dto = await _service.GetTrainingDTOAsync(id);

        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpGet("trainings")]
    public async Task<ActionResult<List<TrainingDTO>>> GetAllTrainings()
    {
        var listTrainingDTOs = await _cache.GetOrCreateAsync("Trainings:all", async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1);
            var items = await _service.GetAllTrainings();
            return items;
        });

        return listTrainingDTOs is null ? NotFound() : Ok(listTrainingDTOs); // 404 not found : 200 (list)
    }

    [Authorize(Roles = "Trainer,Admin")]
    [HttpPost("trainings")]
    public async Task<ActionResult<TrainingDTO>> AddTraining(TrainingAddDTO trainingAddDTO)
    {
        TrainingDTO newTrainingDTO = await _service.AddTrainingAsync(trainingAddDTO);
        _cache.Remove("Trainings:all"); //Se borra el cache

        return CreatedAtAction(
            nameof(GetTrainingById),
            new {Id = newTrainingDTO.Id},
            newTrainingDTO);
    }

    [Authorize(Roles = "Trainer,Admin")]
    [HttpPut("trainings-info")]
    public async Task<IActionResult> UpdateTrainingInfo(TrainingDTO trainingDTO)
    {
        if(trainingDTO is null)
            return BadRequest();

        TrainingDTO? updatedTrainig =await _service.UpdateTrainingInfo(trainingDTO);
        _cache.Remove("Trainings:all");
        return Ok(updatedTrainig);
    }

    [Authorize(Roles = "Trainer,Admin")]
    [HttpPost("exercises-to-trainings")]
    public async Task<ActionResult<TrainingDTO>> AddExercisesTraining(int TrainingId, List<int> ExercisesId)
    {
        if (ExercisesId is null || ExercisesId.Count == 0)
            return BadRequest("At least one exercise is required.");
    
        TrainingDTO? tr = await _service.AddExercisesToTraining(TrainingId, ExercisesId);
        _cache.Remove("Trainings:all"); //Se borra el cache

        if(tr is null)//Si los id no son validos o trainingId no es valido
            return NotFound();

        return Ok(tr);
    }

    [Authorize(Roles = "Trainer,Admin")]
    [HttpDelete("exercises-from-trainings")]
    public async Task<IActionResult> DeleteExerciseFromTraining(int TrainingId,  List<int> ExercisesId)
    {
        bool result = await _service.DeleteExercisesFromTraining(TrainingId, ExercisesId);
        if(!result)
            return NotFound();
        _cache.Remove("Trainings:all"); //Se borra el cache
        return NoContent();
    }

    [Authorize(Roles = "Trainer,Admin")]
    [HttpPut("exercises")]
    public async Task<IActionResult> UpdateExercise(ExerciseDTO exerciseDTO)
    {
        if(exerciseDTO is null)
            return BadRequest();

        ExerciseDTO? updatedExercise =await _service.UpdateExercise(exerciseDTO);
        _cache.Remove("Exercises:all");
        return Ok(updatedExercise);
    }

    [Authorize(Roles = "Trainer,Admin")]
    [HttpDelete("training/{trainingID}")]
    public async Task<IActionResult> DeleteTraining(int trainingID)
    {
        
        bool result = await _service.DeleteTraining(trainingID);
        if(!result)
            return BadRequest();
        _cache.Remove("Trainings:all");
        return NoContent();
    }
}
