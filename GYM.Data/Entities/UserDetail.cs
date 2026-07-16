using System.ComponentModel.DataAnnotations;

namespace GYM.Data.Entities;

public class UserDetail
{
    [Key]
    public int Id {get; set;}
    [Required]
    public int UserId{get; set;} //FK
    [Required]
    [MaxLength(50)]
    public string Name{get;set;} = "";
    [Required]
    [MaxLength(50)]
    public string Surname {get;set;} = "";
    [Required]
    public DateTime JoinAt{get;set;}
    public User User{get;set;} = default!;
}