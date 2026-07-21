using GYM.Data;
using GYM.DTOs;
using GYM.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GYM.Controllers;

[ApiController]
[Route("api/pharmacy/[controller]")] 
[Produces("application/json")]
public class TrainingController : ControllerBase
{
    //private readonly ISeederService _seederService;
    private readonly ITrainingService _service;

    public TrainingController(ITrainingService service/*, ISeederService seederService*/)
    {
        _service = service;
        //_seederService = seederService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTrainings()
    {
        var Trainings = await _service.GetAllTrainingsAsync();
        return Ok(Trainings);
    }

    // [HttpPost("reset")]
    // public async Task<IActionResult> ResetPharmacyDomain()
    // {
    //     await _seederService.ResetDatabaseAsync();
    //     return Ok(new { message = "Catalog data reset." });
    // }

    [HttpPost("add")]
    public async Task<IActionResult> CreateTraining([FromBody] CreateTrainingDto payload)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var createdEntity = await _service.CreateTrainingAsync(payload);

        var responseDto = new TrainingDto(
            createdEntity.TrainingID,
            createdEntity.Name,
            createdEntity.GenericName,
            createdEntity.BrandName,
            createdEntity.DosageForm,
            createdEntity.Strength,
            createdEntity.UnitPrice,
            0,
            null
        );

        return CreatedAtAction(
            nameof(GetTrainingById),
            new { id = responseDto.TrainingID }, 
            responseDto
        );
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetTrainingById(int id)
    {
        var Training = await _service.GetTrainingByIdAsync(id);

        if (Training == null) return NotFound($"Training with ID {id} was not found.");
        return Ok(Training);
    }

}
