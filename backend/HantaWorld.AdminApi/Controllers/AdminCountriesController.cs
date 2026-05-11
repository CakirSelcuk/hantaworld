using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Domain;
using HantaWorld.AdminApi.Models;
using HantaWorld.AdminApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Controllers;

[Authorize(Policy = "RequireEditor")]
public class AdminCountriesController(
    ApplicationDbContext dbContext,
    AuditLogService auditLogService,
    AdminAuthService adminAuthService) : Controller
{
    [HttpGet("/admin/countries")]
    public async Task<IActionResult> Index()
    {
        return View(await dbContext.Countries.OrderBy(x => x.Name).ToListAsync());
    }

    [HttpGet("/admin/countries/create")]
    public IActionResult Create() => View(new CountryFormViewModel());

    [HttpPost("/admin/countries/create")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CountryFormViewModel model)
    {
        if (await dbContext.Countries.AnyAsync(x => x.Slug == model.Slug))
        {
            ModelState.AddModelError(nameof(model.Slug), "Bu slug zaten kullanılıyor.");
        }

        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var actorId = adminAuthService.GetCurrentUserId(User);
        var entity = new Country
        {
            Id = Guid.NewGuid(),
            Slug = model.Slug.Trim(),
            IsoCode = model.IsoCode.Trim().ToUpperInvariant(),
            Name = model.Name.Trim(),
            Continent = model.Continent.Trim(),
            FlagEmoji = model.FlagEmoji?.Trim(),
            Population = model.Population,
            Latitude = model.Latitude,
            Longitude = model.Longitude,
            HealthAuthorityUrl = model.HealthAuthorityUrl?.Trim(),
            IsActive = model.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            CreatedBy = actorId,
            UpdatedBy = actorId
        };

        dbContext.Countries.Add(entity);
        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "create", "country", entity.Id, entity.Slug, null, entity);

        return RedirectToAction(nameof(Index));
    }

    [HttpGet("/admin/countries/{id:guid}/edit")]
    public async Task<IActionResult> Edit(Guid id)
    {
        var entity = await dbContext.Countries.FindAsync(id);
        if (entity is null) return NotFound();

        return View(new CountryFormViewModel
        {
            Id = entity.Id,
            Slug = entity.Slug,
            IsoCode = entity.IsoCode,
            Name = entity.Name,
            Continent = entity.Continent,
            FlagEmoji = entity.FlagEmoji,
            Population = entity.Population,
            Latitude = entity.Latitude,
            Longitude = entity.Longitude,
            HealthAuthorityUrl = entity.HealthAuthorityUrl,
            IsActive = entity.IsActive
        });
    }

    [HttpPost("/admin/countries/{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(Guid id, CountryFormViewModel model)
    {
        var entity = await dbContext.Countries.FindAsync(id);
        if (entity is null) return NotFound();

        if (await dbContext.Countries.AnyAsync(x => x.Id != id && x.Slug == model.Slug))
        {
            ModelState.AddModelError(nameof(model.Slug), "Bu slug zaten kullanılıyor.");
        }

        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var oldValues = new { entity.Slug, entity.IsoCode, entity.Name, entity.Continent, entity.IsActive };

        entity.Slug = model.Slug.Trim();
        entity.IsoCode = model.IsoCode.Trim().ToUpperInvariant();
        entity.Name = model.Name.Trim();
        entity.Continent = model.Continent.Trim();
        entity.FlagEmoji = model.FlagEmoji?.Trim();
        entity.Population = model.Population;
        entity.Latitude = model.Latitude;
        entity.Longitude = model.Longitude;
        entity.HealthAuthorityUrl = model.HealthAuthorityUrl?.Trim();
        entity.IsActive = model.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = adminAuthService.GetCurrentUserId(User);

        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "update", "country", entity.Id, entity.Slug, oldValues, entity);

        return RedirectToAction(nameof(Index));
    }

    [Authorize(Policy = "RequireAdmin")]
    [HttpPost("/admin/countries/{id:guid}/delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(Guid id)
    {
        var entity = await dbContext.Countries.FindAsync(id);
        if (entity is null) return RedirectToAction(nameof(Index));

        dbContext.Countries.Remove(entity);
        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "delete", "country", entity.Id, entity.Slug, entity, null);

        return RedirectToAction(nameof(Index));
    }
}
