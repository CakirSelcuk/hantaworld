using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Controllers.Api;

[ApiController]
[Route("api/outbreaks")]
public class OutbreaksController(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OutbreakApiDto>>> Get()
    {
        var items = await dbContext.Outbreaks
            .AsNoTracking()
            .Include(x => x.Country)
            .Include(x => x.OutbreakSources)
                .ThenInclude(x => x.Source)
            .Where(x => x.PublicationStatus == "published" && x.VerificationStatus == "verified")
            .OrderByDescending(x => x.LastVerifiedDate)
            .ToListAsync();

        return Ok(items.Select(x => new OutbreakApiDto
        {
            Id = x.PublicId,
            Slug = x.Slug,
            Title = x.Title,
            Summary = x.Summary,
            Description = x.Description,
            Status = x.Status,
            SeverityLevel = x.SeverityLevel,
            VerificationStatus = x.VerificationStatus,
            ConfirmedCases = x.ConfirmedCases,
            SuspectedCases = x.SuspectedCases,
            Deaths = x.Deaths,
            Recovered = x.Recovered,
            GrowthRate = x.GrowthRate,
            ConfidenceScore = x.ConfidenceScore,
            VerificationNotes = x.VerificationNotes,
            SourceUrl = x.PrimarySourceUrl,
            PublicationDate = x.PublicationDate,
            LastVerifiedDate = x.LastVerifiedDate,
            StartedAt = x.StartedAt,
            ResolvedAt = x.ResolvedAt,
            Coordinates = new { lat = x.Latitude, lng = x.Longitude, radiusKm = x.RadiusKm },
            Country = new CountryApiDto
            {
                Slug = x.Country!.Slug,
                IsoCode = x.Country.IsoCode,
                Name = x.Country.Name,
                Continent = x.Country.Continent,
                FlagEmoji = x.Country.FlagEmoji,
                Population = x.Country.Population,
                Latitude = x.Country.Latitude,
                Longitude = x.Country.Longitude,
                HealthAuthorityUrl = x.Country.HealthAuthorityUrl
            },
            Sources = x.OutbreakSources
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
