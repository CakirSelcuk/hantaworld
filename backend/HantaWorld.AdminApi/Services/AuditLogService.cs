using System.Text.Json;
using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Domain;

namespace HantaWorld.AdminApi.Services;

public class AuditLogService(ApplicationDbContext dbContext, AdminAuthService adminAuthService)
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        WriteIndented = false
    };

    public async Task LogAsync(
        HttpContext httpContext,
        string actionType,
        string entityName,
        Guid? entityId,
        string? entityPublicId,
        object? oldValues,
        object? newValues)
    {
        var log = new AuditLog
        {
            ActorUserId = adminAuthService.GetCurrentUserId(httpContext.User),
            ActionType = actionType,
            EntityName = entityName,
            EntityId = entityId,
            EntityPublicId = entityPublicId,
            RequestPath = httpContext.Request.Path,
            HttpMethod = httpContext.Request.Method,
            IpAddress = httpContext.Connection.RemoteIpAddress?.ToString(),
            UserAgent = httpContext.Request.Headers.UserAgent.ToString(),
            OldValues = oldValues is null ? null : JsonSerializer.Serialize(oldValues, JsonOptions),
            NewValues = newValues is null ? null : JsonSerializer.Serialize(newValues, JsonOptions),
            CreatedAt = DateTime.UtcNow
        };

        dbContext.AuditLogs.Add(log);
        await dbContext.SaveChangesAsync();
    }
}
