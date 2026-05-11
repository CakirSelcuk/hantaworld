using System.ComponentModel.DataAnnotations;

namespace HantaWorld.AdminApi.Models;

public class FirstAdminBootstrapRequest
{
    [Required, EmailAddress, MaxLength(320)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(200), MinLength(3)]
    public string FullName { get; set; } = string.Empty;

    [Required, MinLength(12), MaxLength(200)]
    public string Password { get; set; } = string.Empty;
}
