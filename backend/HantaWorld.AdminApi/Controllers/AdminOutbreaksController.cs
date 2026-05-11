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
public class AdminOutbreaksController(
    ApplicationDbContext dbContext,
    AuditLogService auditLogService,
    AdminAuthService adminAuthService) : Controller
{
    [HttpGet("/admin/outbreaks")]
    public async Task<IActionResult> Index()
    {
        var items = await dbContext.Outbreaks.Include(x => x.Country).OrderByDescending(x => x.UpdatedAt).ToListAsync();
        return View(items);
    }

    [HttpGet("/admin/outbreaks/create")]
    public async Task<IActionResult> Create()
    {
        var model = new OutbreakFormViewModel();
        await PopulateSelections(model);
        return View(model);
    }

    [HttpPost("/admin/outbreaks/create")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(OutbreakFormViewModel model)
    {
        if (await dbContext.Outbreaks.AnyAsync(x => x.PublicId == model.PublicId || x.Slug == model.Slug))
        {
            ModelState.AddModelError(nameof(model.PublicId), "Public ID veya slug zaten kullanılıyor.");
        }

        if (!ModelState.IsValid)
        {
            await PopulateSelections(model);
            return View(model);
        }

        var actorId = adminAuthService.GetCurrentUserId(User);
        var entity = new Outbreak
        {
            Id = Guid.NewGuid(),
            PublicId = model.PublicId.Trim(),
            Slug = model.Slug.Trim(),
            CountryId = model.CountryId,
            Title = model.Title.Trim(),
            Summary = model.Summary?.Trim(),
            Description = model.Description.Trim(),
            Status = model.Status,
            SeverityLevel = model.SeverityLevel,
            VerificationStatus = model.VerificationStatus,
            PublicationStatus = model.PublicationStatus,
            ConfirmedCases = model.ConfirmedCases,
            SuspectedCases = model.SuspectedCases,
            Deaths = model.Deaths,
            Recovered = model.Recovered,
            GrowthRate = model.GrowthRate,
            ConfidenceScore = model.ConfidenceScore,
            VerificationNotes = model.VerificationNotes?.Trim(),
            PrimarySourceUrl = model.PrimarySourceUrl?.Trim(),
            PublicationDate = model.PublicationDate,
            LastVerifiedDate = model.LastVerifiedDate,
            StartedAt = model.StartedAt,
            ResolvedAt = model.ResolvedAt,
            Latitude = model.Latitude,
            Longitude = model.Longitude,
            RadiusKm = model.RadiusKm,
            PublishedAt = model.PublicationStatus == "published" ? DateTime.UtcNow : null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            CreatedBy = actorId,
            UpdatedBy = actorId
        };

        dbContext.Outbreaks.Add(entity);
        await ApplyOutbreakSourcesAsync(entity, model.SelectedSourceIds);
        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "create", "outbreak", entity.Id, entity.PublicId, null, entity);

        return RedirectToAction(nameof(Index));
    }

    [HttpGet("/admin/outbreaks/{id:guid}/edit")]
    public async Task<IActionResult> Edit(Guid id)
    {
        var entity = await dbContext.Outbreaks.Include(x => x.OutbreakSources).FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        var model = new OutbreakFormViewModel
        {
            Id = entity.Id,
            PublicId = entity.PublicId,
            Slug = entity.Slug,
            CountryId = entity.CountryId,
            Title = entity.Title,
            Summary = entity.Summary,
            Description = entity.Description,
            Status = entity.Status,
            SeverityLevel = entity.SeverityLevel,
            VerificationStatus = entity.VerificationStatus,
            PublicationStatus = entity.PublicationStatus,
            ConfirmedCases = entity.ConfirmedCases,
            SuspectedCases = entity.SuspectedCases,
            Deaths = entity.Deaths,
            Recovered = entity.Recovered,
            GrowthRate = entity.GrowthRate,
            ConfidenceScore = entity.ConfidenceScore,
            VerificationNotes = entity.VerificationNotes,
            PrimarySourceUrl = entity.PrimarySourceUrl,
            PublicationDate = entity.PublicationDate,
            LastVerifiedDate = entity.LastVerifiedDate,
            StartedAt = entity.StartedAt,
            ResolvedAt = entity.ResolvedAt,
            Latitude = entity.Latitude,
            Longitude = entity.Longitude,
            RadiusKm = entity.RadiusKm,
            SelectedSourceIds = entity.OutbreakSources.Select(x => x.SourceId).ToList()
        };

        await PopulateSelections(model);
        return View(model);
    }

    [HttpPost("/admin/outbreaks/{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(Guid id, OutbreakFormViewModel model)
    {
        var entity = await dbContext.Outbreaks.Include(x => x.OutbreakSources).FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        if (await dbContext.Outbreaks.AnyAsync(x => x.Id != id && (x.PublicId == model.PublicId || x.Slug == model.Slug)))
        {
            ModelState.AddModelError(nameof(model.PublicId), "Public ID veya slug zaten kullanılıyor.");
        }

        if (!ModelState.IsValid)
        {
            await PopulateSelections(model);
            return View(model);
        }

        var oldValues = new { entity.PublicId, entity.Slug, entity.Status, entity.VerificationStatus, entity.PublicationStatus };

        entity.PublicId = model.PublicId.Trim();
        entity.Slug = model.Slug.Trim();
        entity.CountryId = model.CountryId;
        entity.Title = model.Title.Trim();
        entity.Summary = model.Summary?.Trim();
        entity.Description = model.Description.Trim();
        entity.Status = model.Status;
        entity.SeverityLevel = model.SeverityLevel;
        entity.VerificationStatus = model.VerificationStatus;
        entity.PublicationStatus = model.PublicationStatus;
        entity.ConfirmedCases = model.ConfirmedCases;
        entity.SuspectedCases = model.SuspectedCases;
        entity.Deaths = model.Deaths;
        entity.Recovered = model.Recovered;
        entity.GrowthRate = model.GrowthRate;
        entity.ConfidenceScore = model.ConfidenceScore;
        entity.VerificationNotes = model.VerificationNotes?.Trim();
        entity.PrimarySourceUrl = model.PrimarySourceUrl?.Trim();
        entity.PublicationDate = model.PublicationDate;
        entity.LastVerifiedDate = model.LastVerifiedDate;
        entity.StartedAt = model.StartedAt;
        entity.ResolvedAt = model.ResolvedAt;
        entity.Latitude = model.Latitude;
        entity.Longitude = model.Longitude;
        entity.RadiusKm = model.RadiusKm;
        entity.PublishedAt = model.PublicationStatus == "published" ? entity.PublishedAt ?? DateTime.UtcNow : null;
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = adminAuthService.GetCurrentUserId(User);

        entity.OutbreakSources.Clear();
        await ApplyOutbreakSourcesAsync(entity, model.SelectedSourceIds);
        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "update", "outbreak", entity.Id, entity.PublicId, oldValues, entity);

        return RedirectToAction(nameof(Index));
    }

    [Authorize(Policy = "RequireAdmin")]
    [HttpPost("/admin/outbreaks/{id:guid}/delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(Guid id)
    {
        var entity = await dbContext.Outbreaks.FindAsync(id);
        if (entity is null) return RedirectToAction(nameof(Index));

        dbContext.Outbreaks.Remove(entity);
        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "delete", "outbreak", entity.Id, entity.PublicId, entity, null);
        return RedirectToAction(nameof(Index));
    }

    private async Task PopulateSelections(OutbreakFormViewModel model)
    {
        model.AvailableCountries = await dbContext.Countries
            .Where(x => x.IsActive)
            .OrderBy(x => x.Name)
            .Select(x => new SelectListItem(x.Name, x.Id.ToString()))
            .ToListAsync();

        model.AvailableSources = await dbContext.Sources
            .Where(x => x.IsActive)
            .OrderBy(x => x.Organization)
            .ThenBy(x => x.Name)
            .Select(x => new SelectListItem($"{x.Organization} - {x.Name}", x.Id.ToString()))
            .ToListAsync();
    }

    private async Task ApplyOutbreakSourcesAsync(Outbreak outbreak, IEnumerable<Guid> selectedSourceIds)
    {
        var selectedIds = selectedSourceIds.Distinct().ToList();
        var sourceIds = await dbContext.Sources.Where(x => selectedIds.Contains(x.Id)).Select(x => x.Id).ToListAsync();

        outbreak.OutbreakSources = sourceIds.Select((id, index) => new OutbreakSource
        {
            OutbreakId = outbreak.Id,
            SourceId = id,
            IsPrimary = index == 0,
            CreatedAt = DateTime.UtcNow
        }).ToList();
    }
}
