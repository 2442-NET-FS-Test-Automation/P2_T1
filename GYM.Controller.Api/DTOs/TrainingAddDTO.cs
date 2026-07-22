using GYM.Data.Entities;
namespace GYM.Controller.Api.DTOs;

public class TrainingAddDTO
{
    public string TrainingName {get;set;} = default!;
    public string Difficulty{get;set;} = default!;
    public Place Place {get;set;}
    public int Calories {get;set;}
    public string Description {get;set;} = default!;
    public TimeOnly EstimatedTime{get;set;}
    public List<int> ExercisesIDs {get;init;} = default!;

}
