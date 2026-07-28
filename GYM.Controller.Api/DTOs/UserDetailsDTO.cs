using GYM.Data.Entities;

namespace GYM.Controller.Api.DTOs;

public record UserDetailsDTO
{
    public int? Id{get;set;}
    public int? UserId{get;set;}
    public Gender Gender{get;set;}
    public string Name{get;set;} = default!;
    public string Surname{get;set;} = default!;
    public DateTime? JoinAt { get; set; } = DateTime.UtcNow;
    
}