using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Controllers.Api;

[ApiController]
[Route("api/news")]
public class NewsController(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ArticleApiDto>>> Get([FromQuery] bool includeContent = false)
    {
        var items = await dbContext.Articles
            .AsNoTracking()
            .Include(x => x.Country)
            .Include(x => x.Tags)
            .Include(x => x.ArticleSources)
                .ThenInclude(x => x.Source)
            .Where(x => x.PublicationStatus == "published" && x.VerificationStatus == "verified")
            .OrderByDescending(x => x.PublishedAt)
            .ToListAsync();

        return Ok(items.Select(x => new ArticleApiDto
        {
            Id = x.PublicId,
            Slug = x.Slug,
            Title = x.Title,
            Excerpt = x.Excerpt,
            Content = includeContent ? x.Content : null,
            Category = x.Category,
            VerificationStatus = x.VerificationStatus,
            ReadingTimeMin = x.ReadingTimeMin,
            ConfidenceScore = x.ConfidenceScore,
            VerificationNotes = x.VerificationNotes,
            SourceUrl = x.PrimarySourceUrl,
            PublicationDate = x.PublicationDate,
            LastVerifiedDate = x.LastVerifiedDate,
            PublishedAt = x.PublishedAt,
            Country = x.Country is null ? null : new CountryApiDto
            {
                Slug = x.Country.Slug,
                IsoCode = x.Country.IsoCode,
                Name = x.Country.Name,
                Continent = x.Country.Continent,
                FlagEmoji = x.Country.FlagEmoji,
                Population = x.Country.Population,
                Latitude = x.Country.Latitude,
                Longitude = x.Country.Longitude,
                HealthAuthorityUrl = x.Country.HealthAuthorityUrl
            },
            Tags = x.Tags.Select(t => t.Tag).ToList(),
            Sources = x.ArticleSources
                .OrderByDescending(s => s.IsPrimary)
                .Select(s => new SourceLinkApiDto
                {
                    Slug = s.Source!.Slug,
                    Name = s.Source.Name,
                    Organization = s.Source.Organization,
                    Url = s.Source.Url,
                    IsPrimary = s.IsPrimary,
                    CitationTitle = s.CitationTitle,
                    CitationUrl = s.CitationUrl,
                    PublicationDate = s.PublicationDate,
                    LastVerifiedDate = s.LastVerifiedDate
                }).ToList()
        }));
    }
}
