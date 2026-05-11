using System.Security.Claims;
using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Domain;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Services;

public class AdminAuthService(
    ApplicationDbContext dbContext,
    IPasswordHasher<AdminUser> passwordHasher)
{
    public async Task<ClaimsPrincipal?> AuthenticateAsync(string email, string password)
    {
        var user = await dbContext.AdminUsers.SingleOrDefaultAsync(x => x.Email == email);
        if (user is null || !user.IsActive)
        {
            return null;
        }

        if (user.LockoutUntil.HasValue && user.LockoutUntil.Value > DateTime.UtcNow)
        {
            return null;
        }

        var verification = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
        if (verification == PasswordVerificationResult.Failed)
        {
            user.FailedLoginCount += 1;
            if (user.FailedLoginCount >= 5)
            {
                user.LockoutUntil = DateTime.UtcNow.AddMinutes(15);
            }

            user.UpdatedAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();
            return null;
        }

        if (verification == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = passwordHasher.HashPassword(user, password);
        }

        user.FailedLoginCount = 0;
        user.LockoutUntil = null;
        user.LastLoginAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Email),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.RoleName),
            new("full_name", user.FullName)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        return new ClaimsPrincipal(identity);
    }

    public Guid? GetCurrentUserId(ClaimsPrincipal principal)
    {
        var raw = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(raw, out var id) ? id : null;
    }
}
