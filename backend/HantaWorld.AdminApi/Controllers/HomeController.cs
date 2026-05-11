using Microsoft.AspNetCore.Mvc;

namespace HantaWorld.AdminApi.Controllers;

public class HomeController : Controller
{
    [HttpGet("/")]
    public IActionResult Index()
    {
        return View();
    }
}
