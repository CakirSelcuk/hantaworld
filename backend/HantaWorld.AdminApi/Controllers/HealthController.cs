using Microsoft.AspNetCore.Mvc;

namespace HantaWorld.AdminApi.Controllers;

[ApiController]
public class HealthController : ControllerBase
{
    [HttpGet("/health")]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "ok",
            runtime = ".NET 8",
            app = "HantaWorld API"
        });
    }
}
