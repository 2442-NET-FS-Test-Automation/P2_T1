using System.ComponentModel.DataAnnotations;

namespace GYM.Controller.Api.DTOs;
public class UserCreateAdminDTO
    {

        public string Name { get; set; } = string.Empty;

        public string Surname { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = "Trainer"; // "Admin" o "Trainer"
    }