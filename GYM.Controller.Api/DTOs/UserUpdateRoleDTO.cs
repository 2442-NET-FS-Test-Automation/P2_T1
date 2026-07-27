namespace GYM.Controller.Api.DTOs;

public class UserUpdateRoleDTO
{
    public string NewRole { get; set; } = string.Empty; // "User", "Trainer", "Admin"
}