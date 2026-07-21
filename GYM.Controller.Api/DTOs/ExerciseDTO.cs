
using Microsoft.Identity.Client;

namespace GYM.Controller.Api.DTOs;

public class ExerciseDTO
{
    public int? Id {get;set;}
    public string Name {get;set;} = "";
    public string Description {get;set;} = "";
    public string VisualReferenceUrl {get;set;} = "";
    public int Sets{get;set;}
    public int Reps{get;set;}

}