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
    AdminAuthService adminAuthService,
    MobileNotificationService mobileNotificationService) : Controller
{
    [HttpGet("/admin/articles")]
    public async Task<IActionResult> Index()
    {
        var items = await dbContext.Articles
            .Include(x => x.Country)
            .Include(x => x.Outbreak)
            .Include(x => x.Pathogen)
            .OrderByDescending(x => x.UpdatedAt)
            .ToListAsync();
        return View(items);
    }

    [HttpGet("/admin/articles/create")]
    public async Task<IActionResult> Create()
    {
        var stamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var model = new ArticleFormViewModel
        {
            PublicId = $"NEWS-{stamp}",
            Slug = $"intelligence-report-{stamp}",
            Category = "outbreak-report",
            VerificationStatus = "verified",
            PublicationStatus = "draft",
            ReadingTimeMin = 3,
            ConfidenceScore = 100,
            PublicationDate = DateOnly.FromDateTime(DateTime.UtcNow),
            LastVerifiedDate = DateOnly.FromDateTime(DateTime.UtcNow)
        };
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

        if (model.PathogenId.HasValue && !await dbContext.Pathogens.AnyAsync(x => x.Id == model.PathogenId.Value && x.IsActive))
        {
            ModelState.AddModelError(nameof(model.PathogenId), "Seçilen virüs/kategori aktif değil.");
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
            PathogenId = model.PathogenId,
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
            SendPushOnPublish = model.SendPushOnPublish,
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
        await TrySendAutomaticPushAsync(entity, actorId);

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
            PathogenId = entity.PathogenId,
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
            SendPushOnPublish = entity.SendPushOnPublish,
            NotificationSentAt = entity.NotificationSentAt,
            NotificationSentBy = entity.NotificationSentBy,
            NotificationSendCount = entity.NotificationSendCount,
            LastNotificationSentAt = entity.LastNotificationSentAt,
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

        if (model.PathogenId.HasValue && !await dbContext.Pathogens.AnyAsync(x => x.Id == model.PathogenId.Value && x.IsActive))
        {
            ModelState.AddModelError(nameof(model.PathogenId), "Seçilen virüs/kategori aktif değil.");
        }

        if (!ModelState.IsValid)
        {
            await PopulateSelections(model);
            return View(model);
        }

        var oldValues = new { entity.PublicId, entity.Slug, entity.Title, entity.VerificationStatus, entity.PublicationStatus, entity.SendPushOnPublish, entity.NotificationSentAt };
        var actorId = adminAuthService.GetCurrentUserId(User);

        entity.PublicId = model.PublicId.Trim();
        entity.Slug = model.Slug.Trim();
        entity.OutbreakId = model.OutbreakId;
        entity.CountryId = model.CountryId;
        entity.PathogenId = model.PathogenId;
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
        entity.SendPushOnPublish = model.SendPushOnPublish;
        entity.PublishedAt = model.PublicationStatus == "published" ? entity.PublishedAt ?? DateTime.UtcNow : null;
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = actorId;

        entity.ArticleSources.Clear();
        entity.Tags.Clear();
        await ApplyArticleSourcesAsync(entity, model.SelectedSourceIds);
        ApplyTags(entity, model.TagsCsv);
        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "update", "article", entity.Id, entity.PublicId, oldValues, entity);
        await TrySendAutomaticPushAsync(entity, actorId);

        return RedirectToAction(nameof(Index));
    }

    [HttpPost("/admin/articles/{id:guid}/send-push")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SendPush(Guid id, [FromForm] bool confirmResend = false)
    {
        var entity = await dbContext.Articles.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        if (entity.PublicationStatus != "published" || entity.VerificationStatus != "verified")
        {
            TempData["ErrorMessage"] = "Push bildirimi sadece verified + published raporlar için gönderilebilir.";
            return RedirectToAction(nameof(Index));
        }

        if (entity.NotificationSendCount > 0 && !confirmResend)
        {
            TempData["ErrorMessage"] = "Bu rapor için daha önce bildirim gönderildi. Tekrar göndermek için onay ver.";
            return RedirectToAction(nameof(Index));
        }

        var actorId = adminAuthService.GetCurrentUserId(User);
        await mobileNotificationService.SendArticleNotificationAsync(entity, actorId);
        await auditLogService.LogAsync(HttpContext, "send_push", "article", entity.Id, entity.PublicId, null, new
        {
            entity.PublicId,
            entity.Title,
            entity.NotificationSendCount,
            entity.LastNotificationSentAt
        });

        TempData["StatusMessage"] = "Push bildirimi gönderildi.";
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

        model.AvailablePathogens = await dbContext.Pathogens
            .Where(x => x.IsActive)
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.DisplayName)
            .Select(x => new SelectListItem(x.DisplayName, x.Id.ToString()))
            .ToListAsync();

        if (model.PathogenId is null)
        {
            model.PathogenId = await dbContext.Pathogens
                .Where(x => x.IsActive && x.Slug == "hantavirus")
                .Select(x => (Guid?)x.Id)
                .FirstOrDefaultAsync();
        }
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

    private static void ApplyTags(Article article, string? tagsCsv)
    {
        var tags = (tagsCsv ?? string.Empty).Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
            .Distinct(StringComparer.OrdinalIgnoreCase);

        article.Tags = tags.Select(tag => new ArticleTag
        {
            ArticleId = article.Id,
            Tag = tag
        }).ToList();
    }

    private async Task TrySendAutomaticPushAsync(Article article, Guid? actorId)
    {
        if (!article.SendPushOnPublish ||
            article.NotificationSentAt.HasValue ||
            article.PublicationStatus != "published" ||
            article.VerificationStatus != "verified")
        {
            return;
        }

        await mobileNotificationService.SendArticleNotificationAsync(article, actorId);
        TempData["StatusMessage"] = "Rapor kaydedildi ve push bildirimi gönderildi.";
    }
}
