namespace GYM.Controller.Api.DTOs;

public class UserAdminDTO
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // "User", "Trainer", "Admin"
    
    // De UserDetails
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public DateTime? JoinAt { get; set; }
}