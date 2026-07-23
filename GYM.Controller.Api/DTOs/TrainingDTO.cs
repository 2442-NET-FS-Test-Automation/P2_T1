using GYM.Data.Entities;
namespace GYM.Controller.Api.DTOs;

public class TrainingDTO
{
    public int? Id {get;set;}
    public string TrainingName {get;set;} = default!;
    public string Difficulty{get;set;} = default!;
    public Place Place {get;set;}
    public int Calories {get;set;}
    public string Description {get;set;} = default!;
    public TimeOnly EstimatedTime{get;set;}
    public DateTime? CreatedAt{get;set;}
    public List<ExerciseDTO> Exercises {get;init;} = default!;

}

