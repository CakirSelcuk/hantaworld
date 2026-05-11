using HantaWorld.AdminApi.Models;
using HantaWorld.AdminApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace HantaWorld.AdminApi.Controllers;

[ApiController]
public class SetupController(
    IConfiguration configuration,
    SchemaInitializer schemaInitializer,
    FirstAdminBootstrapService firstAdminBootstrapService) : ControllerBase
{
    [HttpGet("/setup/run-schema")]
    public async Task<IActionResult> RunSchema([FromQuery] string? key)
    {
        var enabled = configuration.GetValue<bool>("Setup:EnableSchemaRunner");
        if (!enabled)
        {
            return NotFound(new
            {
                success = false,
                error = "setup_endpoint_disabled"
            });
        }

        var configuredKey = configuration["Setup:SchemaRunnerKey"];
        if (string.IsNullOrWhiteSpace(configuredKey) || configuredKey == "__SET_TEMP_SETUP_KEY__")
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new
            {
                success = false,
                error = "setup_key_not_configured"
            });
        }

        if (string.IsNullOrWhiteSpace(key) || !string.Equals(key, configuredKey, StringComparison.Ordinal))
        {
            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                success = false,
                error = "invalid_setup_key"
            });
        }

        try
        {
            var batchCount = await schemaInitializer.ExecuteSchemaScriptAsync();

            return Ok(new
            {
                success = true,
                message = "Schema script basariyla calistirildi.",
                batchesExecuted = batchCount
            });
        }
        catch (Exception exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                error = "schema_execution_failed",
                detail = exception.Message
            });
        }
    }

    [HttpGet("/setup/seed-first-admin")]
    public async Task<IActionResult> SeedFirstAdmin([FromQuery] string? key)
    {
        var enabled = configuration.GetValue<bool>("Setup:EnableFirstAdminSeedRunner");
        if (!enabled)
        {
            return NotFound(new
            {
                success = false,
                error = "first_admin_seed_runner_disabled"
            });
        }

        var configuredKey = configuration["Setup:FirstAdminSeedRunnerKey"];
        if (string.IsNullOrWhiteSpace(configuredKey) || configuredKey == "__SET_FIRST_ADMIN_SEED_KEY__")
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new
            {
                success = false,
                error = "first_admin_seed_runner_key_not_configured"
            });
        }

        if (string.IsNullOrWhiteSpace(key) || !string.Equals(key, configuredKey, StringComparison.Ordinal))
        {
            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                success = false,
                error = "invalid_first_admin_seed_runner_key"
            });
        }

        try
        {
            var batchCount = await schemaInitializer.ExecuteScriptFileAsync("02_seed_first_admin.sql");

            return Ok(new
            {
                success = true,
                message = "Ilk admin seed scripti basariyla calistirildi.",
                batchesExecuted = batchCount
            });
        }
        catch (Exception exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                error = "first_admin_seed_execution_failed",
                detail = exception.Message
            });
        }
    }

    [HttpPost("/setup/bootstrap-first-admin")]
    public async Task<IActionResult> BootstrapFirstAdmin([FromQuery] string? key, [FromBody] FirstAdminBootstrapRequest request)
    {
        var enabled = configuration.GetValue<bool>("Setup:EnableFirstAdminBootstrap");
        if (!enabled)
        {
            return NotFound(new
            {
                success = false,
                error = "first_admin_bootstrap_disabled"
            });
        }

        var configuredKey = configuration["Setup:FirstAdminBootstrapKey"];
        if (string.IsNullOrWhiteSpace(configuredKey) || configuredKey == "__SET_FIRST_ADMIN_BOOTSTRAP_KEY__")
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new
            {
                success = false,
                error = "first_admin_bootstrap_key_not_configured"
            });
        }

        if (string.IsNullOrWhiteSpace(key) || !string.Equals(key, configuredKey, StringComparison.Ordinal))
        {
            return StatusCode(StatusCodes.Status403Forbidden, new
            {
                success = false,
                error = "invalid_first_admin_bootstrap_key"
            });
        }

        if (!ModelState.IsValid)
        {
            var errors = ModelState
                .Where(entry => entry.Value?.Errors.Count > 0)
                .ToDictionary(
                    entry => entry.Key,
                    entry => entry.Value!.Errors.Select(error => error.ErrorMessage).ToArray());

            return ValidationProblem(new ValidationProblemDetails(errors)
            {
                Title = "Ilk admin olusturma istegi gecersiz.",
                Status = StatusCodes.Status400BadRequest
            });
        }

        var result = await firstAdminBootstrapService.CreateAsync(request);
        if (!result.Success)
        {
            return StatusCode(StatusCodes.Status409Conflict, new
            {
                success = false,
                error = result.ErrorCode
            });
        }

        return Ok(new
        {
            success = true,
            message = "Ilk superadmin kullanicisi olusturuldu.",
            user = new
            {
                email = result.User!.Email,
                fullName = result.User.FullName,
                roleName = result.User.RoleName
            }
        });
    }
}
