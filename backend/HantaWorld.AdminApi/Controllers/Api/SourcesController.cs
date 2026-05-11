using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Controllers.Api;

[ApiController]
[Route("api/sources")]
public class SourcesController(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SourceApiDto>>> Get()
    {
        var items = await dbContext.Sources
            .Where(x => x.IsActive)
            .OrderBy(x => x.Organization)
            .ThenBy(x => x.Name)
            .Select(x => new SourceApiDto
            {
                Slug = x.Slug,
                Name = x.Name,
                Organization = x.Organization,
                SourceType = x.SourceType,
                Url = x.Url,
                ReliabilityScore = x.ReliabilityScore,
                IsOfficial = x.IsOfficial
            })
            .ToListAsync();

        return Ok(items);
    }
}
