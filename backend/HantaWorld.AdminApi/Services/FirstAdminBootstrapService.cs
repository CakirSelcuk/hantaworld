using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Domain;
using HantaWorld.AdminApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Services;

public class FirstAdminBootstrapService(
    ApplicationDbContext dbContext,
    IPasswordHasher<AdminUser> passwordHasher)
{
    public async Task<(bool Success, string ErrorCode, AdminUser? User)> CreateAsync(FirstAdminBootstrapRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var fullName = request.FullName.Trim();

        if (await dbContext.AdminUsers.AnyAsync())
        {
            return (false, "admin_already_exists", null);
        }

        var user = new AdminUser
        {
            Id = Guid.NewGuid(),
            Email = normalizedEmail,
            FullName = fullName,
            RoleName = "superadmin",
            PasswordAlgorithm = "ASP.NET Identity PBKDF2",
            IsActive = true,
            FailedLoginCount = 0,
            LockoutUntil = null,
            LastLoginAt = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);

        dbContext.AdminUsers.Add(user);
        await dbContext.SaveChangesAsync();

        return (true, string.Empty, user);
    }
}
