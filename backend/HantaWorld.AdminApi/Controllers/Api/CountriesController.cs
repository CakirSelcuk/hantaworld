using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Controllers.Api;

[ApiController]
[Route("api/countries")]
public class CountriesController(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CountryApiDto>>> Get()
    {
        var items = await dbContext.Countries
            .Where(x => x.IsActive)
            .OrderBy(x => x.Name)
            .Select(x => new CountryApiDto
            {
                Slug = x.Slug,
                IsoCode = x.IsoCode,
                Name = x.Name,
                Continent = x.Continent,
                FlagEmoji = x.FlagEmoji,
                Population = x.Population,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                HealthAuthorityUrl = x.HealthAuthorityUrl
            })
            .ToListAsync();

        return Ok(items);
    }
}
