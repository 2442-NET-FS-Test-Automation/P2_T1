using System.ComponentModel.DataAnnotations;

namespace GYM.Data.Entities;

public class Category
{
    [Key]
    public int Id{get;set;}
    [Required]
    [MaxLength(30)]
    public string Name{get;set;} = "";
    [MaxLength(255)]
    public string Description {get;set;} = "";
    public List<Training> Trainings  { get; set; } = new();
}