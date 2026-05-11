var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () =>
{
    return Results.Json(new
    {
        app = "HantaWorld API",
        status = "ok",
        runtime = ".NET 8",
        endpoint = "/health"
    });
});

app.MapGet("/health", () =>
{
    return Results.Json(new
    {
        status = "ok",
        runtime = ".NET 8",
        app = "HantaWorld API"
    });
});

app.Run();
