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
public class AdminArticlesController(
    ApplicationDbContext dbContext,
    AuditLogService auditLogService,
    AdminAuthService adminAuthService) : Controller
{
    [HttpGet("/admin/articles")]
    public async Task<IActionResult> Index()
    {
        var items = await dbContext.Articles
            .Include(x => x.Country)
            .Include(x => x.Outbreak)
            .OrderByDescending(x => x.UpdatedAt)
            .ToListAsync();
        return View(items);
    }

    [HttpGet("/admin/articles/create")]
    public async Task<IActionResult> Create()
    {
        var model = new ArticleFormViewModel();
        await PopulateSelections(model);
        return View(model);
    }

    [HttpPost("/admin/articles/create")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(ArticleFormViewModel model)
    {
        if (await dbContext.Articles.AnyAsync(x => x.PublicId == model.PublicId || x.Slug == model.Slug))
        {
            ModelState.AddModelError(nameof(model.PublicId), "Public ID veya slug zaten kullanılıyor.");
        }

        if (!ModelState.IsValid)
        {
            await PopulateSelections(model);
            return View(model);
        }

        var actorId = adminAuthService.GetCurrentUserId(User);
        var entity = new Article
        {
            Id = Guid.NewGuid(),
            PublicId = model.PublicId.Trim(),
            Slug = model.Slug.Trim(),
            OutbreakId = model.OutbreakId,
            CountryId = model.CountryId,
            Title = model.Title.Trim(),
            Excerpt = model.Excerpt.Trim(),
            Content = model.Content.Trim(),
            Category = model.Category,
            VerificationStatus = model.VerificationStatus,
            PublicationStatus = model.PublicationStatus,
            ReadingTimeMin = model.ReadingTimeMin,
            ConfidenceScore = model.ConfidenceScore,
            VerificationNotes = model.VerificationNotes?.Trim(),
            PrimarySourceUrl = model.PrimarySourceUrl?.Trim(),
            PublicationDate = model.PublicationDate,
            LastVerifiedDate = model.LastVerifiedDate,
            CoverImageUrl = model.CoverImageUrl?.Trim(),
            PublishedAt = model.PublicationStatus == "published" ? DateTime.UtcNow : null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            CreatedBy = actorId,
            UpdatedBy = actorId
        };

        dbContext.Articles.Add(entity);
        await ApplyArticleSourcesAsync(entity, model.SelectedSourceIds);
        ApplyTags(entity, model.TagsCsv);
        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "create", "article", entity.Id, entity.PublicId, null, entity);

        return RedirectToAction(nameof(Index));
    }

    [HttpGet("/admin/articles/{id:guid}/edit")]
    public async Task<IActionResult> Edit(Guid id)
    {
        var entity = await dbContext.Articles
            .Include(x => x.ArticleSources)
            .Include(x => x.Tags)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        var model = new ArticleFormViewModel
        {
            Id = entity.Id,
            PublicId = entity.PublicId,
            Slug = entity.Slug,
            OutbreakId = entity.OutbreakId,
            CountryId = entity.CountryId,
            Title = entity.Title,
            Excerpt = entity.Excerpt,
            Content = entity.Content,
            Category = entity.Category,
            VerificationStatus = entity.VerificationStatus,
            PublicationStatus = entity.PublicationStatus,
            ReadingTimeMin = entity.ReadingTimeMin,
            ConfidenceScore = entity.ConfidenceScore,
            VerificationNotes = entity.VerificationNotes,
            PrimarySourceUrl = entity.PrimarySourceUrl,
            PublicationDate = entity.PublicationDate,
            LastVerifiedDate = entity.LastVerifiedDate,
            CoverImageUrl = entity.CoverImageUrl,
            TagsCsv = string.Join(", ", entity.Tags.Select(x => x.Tag)),
            SelectedSourceIds = entity.ArticleSources.Select(x => x.SourceId).ToList()
        };

        await PopulateSelections(model);
        return View(model);
    }

    [HttpPost("/admin/articles/{id:guid}/edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(Guid id, ArticleFormViewModel model)
    {
        var entity = await dbContext.Articles
            .Include(x => x.ArticleSources)
            .Include(x => x.Tags)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        if (await dbContext.Articles.AnyAsync(x => x.Id != id && (x.PublicId == model.PublicId || x.Slug == model.Slug)))
        {
            ModelState.AddModelError(nameof(model.PublicId), "Public ID veya slug zaten kullanılıyor.");
        }

        if (!ModelState.IsValid)
        {
            await PopulateSelections(model);
            return View(model);
        }

        var oldValues = new { entity.PublicId, entity.Slug, entity.Title, entity.VerificationStatus, entity.PublicationStatus };

        entity.PublicId = model.PublicId.Trim();
        entity.Slug = model.Slug.Trim();
        entity.OutbreakId = model.OutbreakId;
        entity.CountryId = model.CountryId;
        entity.Title = model.Title.Trim();
        entity.Excerpt = model.Excerpt.Trim();
        entity.Content = model.Content.Trim();
        entity.Category = model.Category;
        entity.VerificationStatus = model.VerificationStatus;
        entity.PublicationStatus = model.PublicationStatus;
        entity.ReadingTimeMin = model.ReadingTimeMin;
        entity.ConfidenceScore = model.ConfidenceScore;
        entity.VerificationNotes = model.VerificationNotes?.Trim();
        entity.PrimarySourceUrl = model.PrimarySourceUrl?.Trim();
        entity.PublicationDate = model.PublicationDate;
        entity.LastVerifiedDate = model.LastVerifiedDate;
        entity.CoverImageUrl = model.CoverImageUrl?.Trim();
        entity.PublishedAt = model.PublicationStatus == "published" ? entity.PublishedAt ?? DateTime.UtcNow : null;
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = adminAuthService.GetCurrentUserId(User);

        entity.ArticleSources.Clear();
        entity.Tags.Clear();
        await ApplyArticleSourcesAsync(entity, model.SelectedSourceIds);
        ApplyTags(entity, model.TagsCsv);
        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "update", "article", entity.Id, entity.PublicId, oldValues, entity);

        return RedirectToAction(nameof(Index));
    }

    [Authorize(Policy = "RequireAdmin")]
    [HttpPost("/admin/articles/{id:guid}/delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(Guid id)
    {
        var entity = await dbContext.Articles.FindAsync(id);
        if (entity is null) return RedirectToAction(nameof(Index));

        dbContext.Articles.Remove(entity);
        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "delete", "article", entity.Id, entity.PublicId, entity, null);

        return RedirectToAction(nameof(Index));
    }

    private async Task PopulateSelections(ArticleFormViewModel model)
    {
        model.AvailableOutbreaks = await dbContext.Outbreaks
            .OrderBy(x => x.Title)
            .Select(x => new SelectListItem($"{x.PublicId} - {x.Title}", x.Id.ToString()))
            .ToListAsync();

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

    private async Task ApplyArticleSourcesAsync(Article article, IEnumerable<Guid> selectedSourceIds)
    {
        var selectedIds = selectedSourceIds.Distinct().ToList();
        var sourceIds = await dbContext.Sources.Where(x => selectedIds.Contains(x.Id)).Select(x => x.Id).ToListAsync();

        article.ArticleSources = sourceIds.Select((id, index) => new ArticleSource
        {
            ArticleId = article.Id,
            SourceId = id,
            IsPrimary = index == 0,
            CreatedAt = DateTime.UtcNow
        }).ToList();
    }

    private static void ApplyTags(Article article, string tagsCsv)
    {
        var tags = tagsCsv.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
            .Distinct(StringComparer.OrdinalIgnoreCase);

        article.Tags = tags.Select(tag => new ArticleTag
        {
            ArticleId = article.Id,
            Tag = tag
        }).ToList();
    }
}
