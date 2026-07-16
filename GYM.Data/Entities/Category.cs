namespace GYM.Data.Entities;

public class Category
{
    public int Id{get;set;}
    public string Name{get;set;} = "";
    public string Description {get;set;} = "";
    public List<Training> Trainings  { get; set; } = new();
}