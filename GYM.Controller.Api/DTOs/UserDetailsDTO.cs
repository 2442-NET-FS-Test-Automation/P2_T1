using GYM.Data.Entities;

namespace GYM.Controller.Api.DTOs;
public class UserDetailsDTO
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public Gender Gender { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Surname { get; set; } = string.Empty;
    public DateTime JoinAt { get; set; } = DateTime.UtcNow;

    public int Age { get; set; }
}