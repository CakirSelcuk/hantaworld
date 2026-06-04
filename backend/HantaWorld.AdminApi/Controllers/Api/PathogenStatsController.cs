using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Controllers.Api;

[ApiController]
[Route("api/pathogen-stats")]
public class PathogenStatsController(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet("trend")]
    public async Task<ActionResult<IEnumerable<PathogenStatTrendApiDto>>> GetTrend()
    {
        var rows = await dbContext.PathogenStatHistory
            .AsNoTracking()
            .Include(x => x.Pathogen)
            .Where(x => x.Pathogen != null && x.Pathogen.IsActive)
            .OrderBy(x => x.Pathogen!.SortOrder)
            .ThenBy(x => x.SnapshotDate)
            .Select(x => new PathogenStatTrendApiDto
            {
                Date = x.SnapshotDate,
                PathogenSlug = x.Pathogen!.Slug,
                PathogenDisplayName = x.Pathogen.DisplayName,
                PathogenColor = x.Pathogen.Color,
                ReportedCases = x.ReportedCases,
                TotalDeaths = x.TotalDeaths,
                AffectedCountries = x.AffectedCountries,
                ActiveOutbreaks = x.ActiveOutbreaks
            })
            .ToListAsync();

        return Ok(rows);
    }
}
