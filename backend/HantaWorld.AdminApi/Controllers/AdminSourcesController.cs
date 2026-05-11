using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Domain;
using HantaWorld.AdminApi.Models;
using HantaWorld.AdminApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Controllers;

[Authorize(Policy = "RequireEditor")]
public class AdminSourcesController(
    ApplicationDbContext dbContext,
    AuditLogService auditLogService,
    AdminAuthService adminAuthService) : Controller
{
    [HttpGet("/admin/sources")]
    public async Task<IActionResult> Index()
    {
        return View(await dbContext.Sources.OrderBy(x => x.Organization).ThenBy(x => x.Name).ToListAsync());
    }

    [HttpGet("/admin/sources/create")]
    public IActionResult Create() => View(new SourceFormViewModel());

    [HttpPost("/admin/sources/create")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(SourceFormViewModel model)
    {
        if (await dbContext.Sources.AnyAsync(x => x.Slug == model.Slug))
        {
            ModelState.AddModelError(nameof(model.Slug), "Bu slug zaten kullanılıyor.");
        }

        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var actorId = adminAuthService.GetCurrentUserId(User);
        var entity = new Source
        {
            Id = Guid.NewGuid(),
            Slug = model.Slug.Trim(),
            Name = model.Name.Trim(),
            Organization = model.Organization.Trim(),
            SourceType = model.SourceType.Trim(),
            Url = model.Url.Trim(),
            ReliabilityScore = model.ReliabilityScore,
            IsOfficial = model.IsOfficial,
            Notes = model.Notes?.Trim(),
            IsActive = model.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            CreatedBy = actorId,
            UpdatedBy = actorId
        };

        dbContext.Sources.Add(entity);
        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "create", "source", entity.Id, entity.Slug, null, entity);

        return RedirectToAction(nameof(Index));
    }

    [HttpGet("/admin/sources/{id:guid}/edit")]
    public async Task<IActionResult> Edit(Guid id)
    {
        var entity = await dbContext.Sources.FindAsync(id);
        if (entity is null) return NotFound();

        return View(new SourceFormViewModel
        {
            Id = entity.Id,
            Slug = entity.Slug,
            Name = entity.Name,
            Organization = entity.Organization,
            SourceType = entity.SourceType,
            Url = entity.Url,
            ReliabilityScore = entity.ReliabilityScore,
            IsOfficial = entity.IsOfficial,
            Notes = entity.Notes,
            IsActive = entity.IsActive
        });
    }

    [HttpPost("/admin/sources/{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(Guid id, SourceFormViewModel model)
    {
        var entity = await dbContext.Sources.FindAsync(id);
        if (entity is null) return NotFound();

        if (await dbContext.Sources.AnyAsync(x => x.Id != id && x.Slug == model.Slug))
        {
            ModelState.AddModelError(nameof(model.Slug), "Bu slug zaten kullanılıyor.");
        }

        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var oldValues = new { entity.Slug, entity.Name, entity.Organization, entity.SourceType, entity.Url, entity.IsActive };

        entity.Slug = model.Slug.Trim();
        entity.Name = model.Name.Trim();
        entity.Organization = model.Organization.Trim();
        entity.SourceType = model.SourceType.Trim();
        entity.Url = model.Url.Trim();
        entity.ReliabilityScore = model.ReliabilityScore;
        entity.IsOfficial = model.IsOfficial;
        entity.Notes = model.Notes?.Trim();
        entity.IsActive = model.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = adminAuthService.GetCurrentUserId(User);

        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "update", "source", entity.Id, entity.Slug, oldValues, entity);

        return RedirectToAction(nameof(Index));
    }

    [Authorize(Policy = "RequireAdmin")]
    [HttpPost("/admin/sources/{id:guid}/delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(Guid id)
    {
        var entity = await dbContext.Sources.FindAsync(id);
        if (entity is null) return RedirectToAction(nameof(Index));

        dbContext.Sources.Remove(entity);
        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "delete", "source", entity.Id, entity.Slug, entity, null);

        return RedirectToAction(nameof(Index));
    }
}
