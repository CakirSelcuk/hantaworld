using System.Text;
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
public class AdminPathogenResearchController(
    ApplicationDbContext dbContext,
    AuditLogService auditLogService,
    AdminAuthService adminAuthService) : Controller
{
    [HttpGet("/admin/pathogen-research")]
    public async Task<IActionResult> Index()
    {
        return View(new PathogenResearchViewModel
        {
            AvailablePathogens = await GetPathogenSelectListAsync(null)
        });
    }

    [HttpPost("/admin/pathogen-research")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Index(PathogenResearchViewModel model)
    {
        var pathogen = await ResolvePathogenAsync(model.SelectedPathogenSlug);
        await HydrateResearchModelAsync(model, pathogen);
        return View(model);
    }

    [HttpPost("/admin/pathogen-research/create-draft")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateDraft(PathogenResearchViewModel model)
    {
        var pathogen = await ResolvePathogenAsync(model.SelectedPathogenSlug);
        await HydrateResearchModelAsync(model, pathogen);

        if (!ModelState.IsValid || pathogen is null || model.Output is null)
        {
            return View(nameof(Index), model);
        }

        var duplicate = await FindSimilarArticleAsync(pathogen.Id, model.Output);
        if (duplicate is not null)
        {
            model.SimilarArticleEditUrl = $"/admin/articles/{duplicate.Id}/edit";
            TempData["ErrorMessage"] = "Benzer bir taslak rapor zaten var. Yeni kayıt oluşturulmadı.";
            return View(nameof(Index), model);
        }

        var now = DateTime.UtcNow;
        var actorId = adminAuthService.GetCurrentUserId(User);
        var article = new Article
        {
            Id = Guid.NewGuid(),
            PublicId = await GeneratePublicIdAsync(now),
            Slug = await GenerateSlugAsync(pathogen.Slug, model.Output.ReportTitle, now),
            PathogenId = pathogen.Id,
            Title = model.Output.ReportTitle.Trim(),
            Excerpt = model.Output.ReportSummary.Trim(),
            Content = BuildArticleContent(model.Output),
            Category = model.Output.ReportType,
            VerificationStatus = "pending",
            PublicationStatus = "draft",
            ReadingTimeMin = EstimateReadingTime(model.Output.ReportContent),
            ConfidenceScore = 0,
            VerificationNotes = model.Output.VerificationNote.Trim(),
            PrimarySourceUrl = string.IsNullOrWhiteSpace(model.Output.SourceUrl) ? null : model.Output.SourceUrl.Trim(),
            PublicationDate = model.Output.PublicationDate,
            LastVerifiedDate = model.Output.PublicationDate,
            SendPushOnPublish = false,
            CreatedAt = now,
            UpdatedAt = now,
            CreatedBy = actorId,
            UpdatedBy = actorId
        };

        article.Tags = new List<ArticleTag>
        {
            new() { ArticleId = article.Id, Tag = pathogen.Slug },
            new() { ArticleId = article.Id, Tag = "source-review" }
        };

        dbContext.Articles.Add(article);
        await dbContext.SaveChangesAsync();
        await auditLogService.LogAsync(HttpContext, "create_draft_from_research", "article", article.Id, article.PublicId, null, new
        {
            article.PublicId,
            article.Title,
            Pathogen = pathogen.Slug,
            article.PublicationStatus,
            article.VerificationStatus
        });

        model.CreatedArticleEditUrl = $"/admin/articles/{article.Id}/edit";
        TempData["StatusMessage"] = "Rapor taslak olarak oluşturuldu. Düzenlemek için aç.";
        return View(nameof(Index), model);
    }

    private async Task<Pathogen?> ResolvePathogenAsync(string? slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            ModelState.AddModelError(nameof(PathogenResearchViewModel.SelectedPathogenSlug), "Virüs / kategori seç.");
            return null;
        }

        var pathogen = await dbContext.Pathogens
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.IsActive && x.Slug == slug);

        if (pathogen is null)
        {
            ModelState.AddModelError(nameof(PathogenResearchViewModel.SelectedPathogenSlug), "Seçilen virüs/kategori bulunamadı.");
        }

        return pathogen;
    }

    private async Task HydrateResearchModelAsync(PathogenResearchViewModel model, Pathogen? pathogen)
    {
        model.AvailablePathogens = await GetPathogenSelectListAsync(pathogen?.Slug ?? model.SelectedPathogenSlug);

        if (!ModelState.IsValid || pathogen is null)
        {
            return;
        }

        model.SelectedPathogenSlug = pathogen.Slug;
        model.SelectedPathogenDisplayName = pathogen.DisplayName;
        model.Output = await PathogenResearchService.BuildOutputAsync(pathogen, model);

        var duplicate = await FindSimilarArticleAsync(pathogen.Id, model.Output);
        if (duplicate is not null)
        {
            model.SimilarArticleEditUrl = $"/admin/articles/{duplicate.Id}/edit";
        }
    }

    private async Task<List<SelectListItem>> GetPathogenSelectListAsync(string? selectedSlug)
    {
        var items = await dbContext.Pathogens
            .AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.DisplayName)
            .Select(x => new SelectListItem(x.DisplayName, x.Slug, x.Slug == selectedSlug))
            .ToListAsync();

        items.Insert(0, new SelectListItem("Virüs / kategori seç", string.Empty, string.IsNullOrWhiteSpace(selectedSlug)));
        return items;
    }

    private async Task<Article?> FindSimilarArticleAsync(Guid pathogenId, PathogenResearchOutputViewModel output)
    {
        return await dbContext.Articles
            .AsNoTracking()
            .Where(x => x.PathogenId == pathogenId &&
                        x.Title == output.ReportTitle &&
                        x.PrimarySourceUrl == output.SourceUrl)
            .OrderByDescending(x => x.UpdatedAt)
            .FirstOrDefaultAsync();
    }

    private async Task<string> GeneratePublicIdAsync(DateTime now)
    {
        var baseId = $"NEWS-{now:yyyyMMddHHmmss}";
        var candidate = baseId;
        var suffix = 1;

        while (await dbContext.Articles.AnyAsync(x => x.PublicId == candidate))
        {
            candidate = $"{baseId}-{suffix}";
            suffix++;
        }

        return candidate;
    }

    private async Task<string> GenerateSlugAsync(string pathogenSlug, string title, DateTime now)
    {
        var baseSlug = $"{pathogenSlug}-{Slugify(title)}-{now:yyyyMMddHHmmss}";
        var candidate = baseSlug.Length > 180 ? baseSlug[..180].TrimEnd('-') : baseSlug;
        var suffix = 1;

        while (await dbContext.Articles.AnyAsync(x => x.Slug == candidate))
        {
            var suffixText = $"-{suffix}";
            var maxBaseLength = 180 - suffixText.Length;
            candidate = $"{baseSlug[..Math.Min(baseSlug.Length, maxBaseLength)].TrimEnd('-')}{suffixText}";
            suffix++;
        }

        return candidate;
    }

    private static string Slugify(string value)
    {
        var builder = new StringBuilder();
        foreach (var ch in value.Trim().ToLowerInvariant())
        {
            var normalized = ch switch
            {
                'ç' => 'c',
                'ğ' => 'g',
                'ı' => 'i',
                'ö' => 'o',
                'ş' => 's',
                'ü' => 'u',
                _ => ch
            };

            if (char.IsLetterOrDigit(normalized))
            {
                builder.Append(normalized);
            }
            else if (builder.Length > 0 && builder[^1] != '-')
            {
                builder.Append('-');
            }
        }

        return builder.ToString().Trim('-');
    }

    private static int EstimateReadingTime(string content)
    {
        var wordCount = content.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).Length;
        return Math.Clamp((int)Math.Ceiling(wordCount / 200m), 1, 120);
    }

    private static string BuildArticleContent(PathogenResearchOutputViewModel output)
    {
        var sections = new List<string>
        {
            output.ReportContent.Trim(),
            $"Kaynak Kurum: {output.SourceInstitution}".Trim(),
            string.IsNullOrWhiteSpace(output.SourceUrl) ? "Kaynak Linki: Kaynaklardan kontrol et." : $"Kaynak Linki: {output.SourceUrl.Trim()}",
            $"Doğrulama Notu: {output.VerificationNote.Trim()}",
            $"Admin Kontrol Notu: {output.AdminNote.Trim()}"
        };

        return string.Join(Environment.NewLine + Environment.NewLine, sections.Where(x => !string.IsNullOrWhiteSpace(x)));
    }
}
