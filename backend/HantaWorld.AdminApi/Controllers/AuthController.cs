using HantaWorld.AdminApi.Models;
using HantaWorld.AdminApi.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HantaWorld.AdminApi.Controllers;

[AllowAnonymous]
public class AuthController(AdminAuthService adminAuthService, AuditLogService auditLogService) : Controller
{
    [HttpGet("/admin/login")]
    public IActionResult Login(string? returnUrl = null)
    {
        ViewData["ReturnUrl"] = returnUrl;
        return View(new LoginViewModel());
    }

    [HttpPost("/admin/login")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl = null)
    {
        ViewData["ReturnUrl"] = returnUrl;

        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var principal = await adminAuthService.AuthenticateAsync(model.Email, model.Password);
        if (principal is null)
        {
            ModelState.AddModelError(string.Empty, "Giriş bilgileri geçersiz.");
            return View(model);
        }

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
        await auditLogService.LogAsync(HttpContext, "login", "admin_user", adminAuthService.GetCurrentUserId(principal), model.Email, null, new { model.Email });

        if (!string.IsNullOrWhiteSpace(returnUrl) && Url.IsLocalUrl(returnUrl))
        {
            return Redirect(returnUrl);
        }

        return RedirectToAction("Index", "AdminDashboard");
    }

    [Authorize]
    [HttpPost("/admin/logout")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await auditLogService.LogAsync(HttpContext, "logout", "admin_user", adminAuthService.GetCurrentUserId(User), User.Identity?.Name, null, null);
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction(nameof(Login));
    }
}
