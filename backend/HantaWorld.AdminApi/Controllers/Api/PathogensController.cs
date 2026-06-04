using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Domain;
using HantaWorld.AdminApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Controllers.Api;

[ApiController]
[Route("api/pathogens")]
public class PathogensController(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PathogenApiDto>>> Get()
    {
        var items = await dbContext.Pathogens
            .AsNoTracking()
            .Include(x => x.Stats)
            .Where(x => x.IsActive)
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.DisplayName)
            .ToListAsync();

        return Ok(items.Select(MapPathogen));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<PathogenApiDto>> GetBySlug(string slug)
    {
        var normalizedSlug = slug.Trim().ToLowerInvariant();
        var item = await dbContext.Pathogens
            .AsNoTracking()
            .Include(x => x.Stats)
            .FirstOrDefaultAsync(x => x.IsActive && x.Slug == normalizedSlug);

        return item is null ? NotFound() : Ok(MapPathogen(item));
    }

    [HttpGet("{slug}/stats/trend")]
    public async Task<ActionResult<IEnumerable<PathogenStatTrendApiDto>>> GetTrendBySlug(string slug)
    {
        var normalizedSlug = slug.Trim().ToLowerInvariant();
        var pathogen = await dbContext.Pathogens
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.IsActive && x.Slug == normalizedSlug);

        if (pathogen is null)
        {
            return NotFound();
        }

        var rows = await dbContext.PathogenStatHistory
            .AsNoTracking()
            .Where(x => x.PathogenId == pathogen.Id)
            .OrderBy(x => x.SnapshotDate)
            .Select(x => new PathogenStatTrendApiDto
            {
                Date = x.SnapshotDate,
                PathogenSlug = pathogen.Slug,
                PathogenDisplayName = pathogen.DisplayName,
                PathogenColor = pathogen.Color,
                ReportedCases = x.ReportedCases,
                TotalDeaths = x.TotalDeaths,
                AffectedCountries = x.AffectedCountries,
                ActiveOutbreaks = x.ActiveOutbreaks
            })
            .ToListAsync();

        return Ok(rows);
    }

    private static PathogenApiDto MapPathogen(Pathogen item)
    {
        return new PathogenApiDto
        {
            Slug = item.Slug,
            Name = item.Name,
            DisplayName = item.DisplayName,
            ShortDescription = item.ShortDescription,
            Color = item.Color,
            SortOrder = item.SortOrder,
            IsActive = item.IsActive,
            Stats = item.Stats is null ? null : new PathogenStatsApiDto
            {
                ReportedCases = item.Stats.ReportedCases,
                TotalDeaths = item.Stats.TotalDeaths,
                AffectedCountries = item.Stats.AffectedCountries,
                ActiveOutbreaks = item.Stats.ActiveOutbreaks,
                SourceInstitution = item.Stats.SourceInstitution,
                SourceUrl = item.Stats.SourceUrl,
                OfficialPublishedAt = item.Stats.OfficialPublishedAt,
                LastVerifiedAt = item.Stats.LastVerifiedAt,
                Notes = item.Stats.Notes
            }
        };
    }
}
