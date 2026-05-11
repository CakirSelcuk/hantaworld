using HantaWorld.AdminApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Controllers;

[Authorize]
public class AdminDashboardController(ApplicationDbContext dbContext) : Controller
{
    [HttpGet("/admin")]
    public async Task<IActionResult> Index()
    {
        ViewData["OutbreakCount"] = await dbContext.Outbreaks.CountAsync();
        ViewData["ArticleCount"] = await dbContext.Articles.CountAsync();
        ViewData["PendingVerificationCount"] = await dbContext.Outbreaks.CountAsync(x => x.VerificationStatus == "pending")
            + await dbContext.Articles.CountAsync(x => x.VerificationStatus == "pending");
        ViewData["AuditLogs"] = await dbContext.AuditLogs
            .OrderByDescending(x => x.CreatedAt)
            .Take(20)
            .ToListAsync();

        return View();
    }
}
