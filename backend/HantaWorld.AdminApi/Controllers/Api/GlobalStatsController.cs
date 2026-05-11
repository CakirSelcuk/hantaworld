using HantaWorld.AdminApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Controllers.Api;

[ApiController]
[Route("api/global-stats")]
public class GlobalStatsController(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var query = dbContext.Outbreaks
            .AsNoTracking()
            .Where(x => x.PublicationStatus == "published" && x.VerificationStatus == "verified");

        var outbreaks = await query.ToListAsync();

        var payload = new
        {
            totalConfirmedCases = outbreaks.Sum(x => x.ConfirmedCases),
            totalSuspectedCases = outbreaks.Sum(x => x.SuspectedCases),
            totalDeaths = outbreaks.Sum(x => x.Deaths),
            totalRecovered = outbreaks.Sum(x => x.Recovered),
            affectedCountries = outbreaks.Select(x => x.CountryId).Distinct().Count(),
            activeOutbreaks = outbreaks.Count(x => x.Status != "resolved"),
            growthRate7d = outbreaks.Count == 0 ? 0 : Math.Round(outbreaks.Average(x => x.GrowthRate), 2),
            lastUpdated = outbreaks.Count == 0
                ? (DateTime?)null
                : outbreaks
                    .Select(x => x.LastVerifiedDate?.ToDateTime(TimeOnly.MinValue)
                        ?? x.PublicationDate?.ToDateTime(TimeOnly.MinValue)
                        ?? x.UpdatedAt)
                    .Max()
        };

        return Ok(payload);
    }
}
