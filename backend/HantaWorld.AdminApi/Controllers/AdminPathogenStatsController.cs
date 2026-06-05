using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Domain;
using HantaWorld.AdminApi.Models;
using HantaWorld.AdminApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Controllers;

[Authorize(Policy = "RequireEditor")]
public class AdminPathogenStatsController(
    ApplicationDbContext dbContext,
    AuditLogService auditLogService,
    AdminAuthService adminAuthService) : Controller
{
    [HttpGet("/admin/pathogen-stats")]
    public async Task<IActionResult> Index([FromQuery] string? pathogenSlug = null)
    {
        var pathogen = await ResolveSelectedPathogenAsync(pathogenSlug);
        if (pathogen is null)
        {
            return View(new PathogenStatsFormViewModel
            {
                AvailablePathogens = await GetPathogenSelectListAsync(null)
            });
        }

        var stats = await dbContext.PathogenStats
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.PathogenId == pathogen.Id);

        var model = new PathogenStatsFormViewModel
        {
            PathogenId = pathogen.Id,
            PathogenSlug = pathogen.Slug,
            PathogenDisplayName = pathogen.DisplayName,
            PathogenColor = pathogen.Color,
            ReportedCases = stats?.ReportedCases,
            TotalDeaths = stats?.TotalDeaths,
            AffectedCountries = stats?.AffectedCountries,
            ActiveOutbreaks = stats?.ActiveOutbreaks,
            SourceInstitution = stats?.SourceInstitution,
            SourceUrl = stats?.SourceUrl,
            OfficialPublishedAt = stats?.OfficialPublishedAt,
            LastVerifiedAt = stats?.LastVerifiedAt,
            Notes = stats?.Notes,
            PublicPageUrl = $"/pathogens/{pathogen.Slug}",
            AvailablePathogens = await GetPathogenSelectListAsync(pathogen.Id),
            LatestHistory = await GetHistoryRowsAsync(pathogen.Id)
        };
        ApplyCurrentStats(model, stats);

        return View(model);
    }

    [HttpPost("/admin/pathogen-stats")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Index(PathogenStatsFormViewModel model)
    {
        var pathogen = await dbContext.Pathogens
            .FirstOrDefaultAsync(x => x.Id == model.PathogenId && x.IsActive);

        if (pathogen is null)
        {
            ModelState.AddModelError(nameof(model.PathogenId), "Seçilen virüs/kategori bulunamadı.");
        }

        if (!ModelState.IsValid || pathogen is null)
        {
            await HydrateModelAsync(model, pathogen);
            return View(model);
        }

        var actorId = adminAuthService.GetCurrentUserId(User);
        var now = DateTime.UtcNow;
        var stats = await dbContext.PathogenStats.FirstOrDefaultAsync(x => x.PathogenId == pathogen.Id);
        object? oldValues = stats is null ? null : new
        {
            stats.ReportedCases,
            stats.TotalDeaths,
            stats.AffectedCountries,
            stats.ActiveOutbreaks,
            stats.LastVerifiedAt
        };

        if (stats is null)
        {
            stats = new PathogenStats
            {
                Id = Guid.NewGuid(),
                PathogenId = pathogen.Id,
                CreatedAt = now,
                CreatedBy = actorId
            };
            dbContext.PathogenStats.Add(stats);
        }

        ApplyStatsFields(stats, model, now, actorId);

        var snapshotDate = model.LastVerifiedAt ?? DateOnly.FromDateTime(now);
        var history = await dbContext.PathogenStatHistory
            .FirstOrDefaultAsync(x => x.PathogenId == pathogen.Id && x.SnapshotDate == snapshotDate);

        if (history is null)
        {
            history = new PathogenStatHistory
            {
                Id = Guid.NewGuid(),
                PathogenId = pathogen.Id,
                SnapshotDate = snapshotDate,
                CreatedAt = now,
                CreatedBy = actorId
            };
            dbContext.PathogenStatHistory.Add(history);
        }

        ApplyHistoryFields(history, model, now, actorId);

        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "upsert", "pathogen_stats", stats.Id, pathogen.Slug, oldValues, stats);

        TempData["StatusMessage"] = "Salgın istatistikleri kaydedildi.";
        return RedirectToAction(nameof(Index), new { pathogenSlug = pathogen.Slug });
    }

    private async Task HydrateModelAsync(PathogenStatsFormViewModel model, Pathogen? pathogen)
    {
        if (pathogen is not null)
        {
            var stats = await dbContext.PathogenStats
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.PathogenId == pathogen.Id);

            model.PathogenId = pathogen.Id;
            model.PathogenSlug = pathogen.Slug;
            model.PathogenDisplayName = pathogen.DisplayName;
            model.PathogenColor = pathogen.Color;
            ApplyCurrentStats(model, stats);
            model.PublicPageUrl = $"/pathogens/{pathogen.Slug}";
            model.LatestHistory = await GetHistoryRowsAsync(pathogen.Id);
        }

        model.AvailablePathogens = await GetPathogenSelectListAsync(pathogen?.Id ?? model.PathogenId);
    }

    private async Task<Pathogen?> ResolveSelectedPathogenAsync(string? pathogenSlug)
    {
        var normalizedSlug = string.IsNullOrWhiteSpace(pathogenSlug)
            ? "hantavirus"
            : pathogenSlug.Trim().ToLowerInvariant();

        var pathogen = await dbContext.Pathogens
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.IsActive && x.Slug == normalizedSlug);

        return pathogen ?? await dbContext.Pathogens
            .AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.DisplayName)
            .FirstOrDefaultAsync();
    }

    private async Task<List<SelectListItem>> GetPathogenSelectListAsync(Guid? selectedPathogenId)
    {
        return await dbContext.Pathogens
            .AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.DisplayName)
            .Select(x => new SelectListItem(x.DisplayName, x.Slug, x.Id == selectedPathogenId))
            .ToListAsync();
    }

    private async Task<List<PathogenStatHistoryRowViewModel>> GetHistoryRowsAsync(Guid pathogenId)
    {
        return await dbContext.PathogenStatHistory
            .AsNoTracking()
            .Where(x => x.PathogenId == pathogenId)
            .OrderByDescending(x => x.SnapshotDate)
            .ThenByDescending(x => x.UpdatedAt)
            .Take(20)
            .Select(x => new PathogenStatHistoryRowViewModel
            {
                SnapshotDate = x.SnapshotDate,
                ReportedCases = x.ReportedCases,
                TotalDeaths = x.TotalDeaths,
                AffectedCountries = x.AffectedCountries,
                ActiveOutbreaks = x.ActiveOutbreaks,
                SourceInstitution = x.SourceInstitution,
                SourceUrl = x.SourceUrl,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync();
    }

    private static void ApplyCurrentStats(PathogenStatsFormViewModel model, PathogenStats? stats)
    {
        model.CurrentReportedCases = stats?.ReportedCases;
        model.CurrentTotalDeaths = stats?.TotalDeaths;
        model.CurrentAffectedCountries = stats?.AffectedCountries;
        model.CurrentActiveOutbreaks = stats?.ActiveOutbreaks;
        model.CurrentSourceInstitution = stats?.SourceInstitution;
        model.CurrentSourceUrl = stats?.SourceUrl;
        model.CurrentOfficialPublishedAt = stats?.OfficialPublishedAt;
        model.CurrentLastVerifiedAt = stats?.LastVerifiedAt;
        model.CurrentNotes = stats?.Notes;
        model.CurrentCreatedAt = stats?.CreatedAt;
        model.CurrentUpdatedAt = stats?.UpdatedAt;
    }

    private static void ApplyStatsFields(PathogenStats stats, PathogenStatsFormViewModel model, DateTime now, Guid? actorId)
    {
        stats.ReportedCases = model.ReportedCases;
        stats.TotalDeaths = model.TotalDeaths;
        stats.AffectedCountries = model.AffectedCountries;
        stats.ActiveOutbreaks = model.ActiveOutbreaks;
        stats.SourceInstitution = model.SourceInstitution?.Trim();
        stats.SourceUrl = model.SourceUrl?.Trim();
        stats.OfficialPublishedAt = model.OfficialPublishedAt;
        stats.LastVerifiedAt = model.LastVerifiedAt;
        stats.Notes = model.Notes?.Trim();
        stats.UpdatedAt = now;
        stats.UpdatedBy = actorId;
    }

    private static void ApplyHistoryFields(PathogenStatHistory history, PathogenStatsFormViewModel model, DateTime now, Guid? actorId)
    {
        history.ReportedCases = model.ReportedCases;
        history.TotalDeaths = model.TotalDeaths;
        history.AffectedCountries = model.AffectedCountries;
        history.ActiveOutbreaks = model.ActiveOutbreaks;
        history.SourceInstitution = model.SourceInstitution?.Trim();
        history.SourceUrl = model.SourceUrl?.Trim();
        history.UpdatedAt = now;
        history.UpdatedBy = actorId;
    }
}
