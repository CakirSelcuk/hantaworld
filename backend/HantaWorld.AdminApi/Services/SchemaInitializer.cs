using System.Text.RegularExpressions;
using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace HantaWorld.AdminApi.Services;

public class SchemaInitializer(IConfiguration configuration, ApplicationDbContext dbContext)
{
    public async Task InitializeAsync()
    {
        var runSchema = configuration.GetValue<bool>("DatabaseSettings:RunSchemaOnStartup");
        if (!runSchema)
        {
            return;
        }

        await ExecuteSchemaScriptAsync();
    }

    public async Task<int> ExecuteSchemaScriptAsync()
    {
        return await ExecuteScriptFileAsync("01_mssql_schema.sql");
    }

    public async Task<int> ExecuteScriptFileAsync(string fileName)
    {
        var scriptPath = Path.Combine(AppContext.BaseDirectory, "DatabaseScripts", fileName);
        if (!File.Exists(scriptPath))
        {
            throw new FileNotFoundException("Schema script dosyasi bulunamadi.", scriptPath);
        }

        var script = await File.ReadAllTextAsync(scriptPath);
        var batches = Regex.Split(script, @"^\s*GO\s*($|\-\-.*$)", RegexOptions.Multiline | RegexOptions.IgnoreCase)
            .Where(batch => !string.IsNullOrWhiteSpace(batch))
            .ToList();

        foreach (var batch in batches)
        {
            await dbContext.Database.ExecuteSqlRawAsync(batch);
        }

        return batches.Count;
    }
}

public class BootstrapAdminService(
    IConfiguration configuration,
    ApplicationDbContext dbContext,
    IPasswordHasher<AdminUser> passwordHasher)
{
    public async Task TryCreateInitialAdminAsync()
    {
        var enabled = configuration.GetValue<bool>("BootstrapAdmin:Enabled");
        if (!enabled)
        {
            return;
        }

        if (await dbContext.AdminUsers.AnyAsync())
        {
            return;
        }

        var email = configuration["BootstrapAdmin:Email"];
        var fullName = configuration["BootstrapAdmin:FullName"] ?? "Platform Admin";
        var password = configuration["BootstrapAdmin:Password"];
        var role = configuration["BootstrapAdmin:Role"] ?? "superadmin";

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password) || password.Length < 12)
        {
            return;
        }

        var admin = new AdminUser
        {
            Id = Guid.NewGuid(),
            Email = email.Trim(),
            FullName = fullName.Trim(),
            RoleName = role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        admin.PasswordHash = passwordHasher.HashPassword(admin, password);
        dbContext.AdminUsers.Add(admin);
        await dbContext.SaveChangesAsync();
    }
}
