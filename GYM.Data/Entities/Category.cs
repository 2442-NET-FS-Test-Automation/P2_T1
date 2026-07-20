using System.ComponentModel.DataAnnotations;

namespace GYM.Data.Entities;

public class Category
{
    [Key]
    public int Id{get;set;}
    [Required]
    public string Name{get;set;} = "";
    public string Description {get;set;} = "";
    public List<Training> Trainings  { get; set; } = new();
}