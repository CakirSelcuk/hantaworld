using System.Text.Json.Serialization;

namespace HantaWorld.AdminApi.Models;

public class CountryApiDto
{
    public string Slug { get; set; } = string.Empty;
    public string IsoCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Continent { get; set; } = string.Empty;
    public string? FlagEmoji { get; set; }
    public long? Population { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? HealthAuthorityUrl { get; set; }
}

public class SourceApiDto
{
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Organization { get; set; } = string.Empty;
    public string SourceType { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public int ReliabilityScore { get; set; }
    public bool IsOfficial { get; set; }
}

public class SourceLinkApiDto
{
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Organization { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
    public string? CitationTitle { get; set; }
    public string? CitationUrl { get; set; }
    public DateOnly? PublicationDate { get; set; }
    public DateOnly? LastVerifiedDate { get; set; }
}

public class PathogenSummaryApiDto
{
    public string Slug { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}

public class PathogenStatsApiDto
{
    public int? ReportedCases { get; set; }
    public int? TotalDeaths { get; set; }
    public int? AffectedCountries { get; set; }
    public int? ActiveOutbreaks { get; set; }
    public string? SourceInstitution { get; set; }
    public string? SourceUrl { get; set; }
    public DateOnly? OfficialPublishedAt { get; set; }
    public DateOnly? LastVerifiedAt { get; set; }
    public string? Notes { get; set; }
}

public class PathogenApiDto
{
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public string Color { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public PathogenStatsApiDto? Stats { get; set; }
}

public class PathogenStatTrendApiDto
{
    public DateOnly Date { get; set; }
    public string PathogenSlug { get; set; } = string.Empty;
    public string PathogenDisplayName { get; set; } = string.Empty;
    public string PathogenColor { get; set; } = string.Empty;
    public int? ReportedCases { get; set; }
    public int? TotalDeaths { get; set; }
    public int? AffectedCountries { get; set; }
    public int? ActiveOutbreaks { get; set; }
}

public class OutbreakApiDto
{
    public string Id { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string SeverityLevel { get; set; } = string.Empty;
    public string VerificationStatus { get; set; } = string.Empty;
    public int ConfirmedCases { get; set; }
    public int SuspectedCases { get; set; }
    public int Deaths { get; set; }
    public int Recovered { get; set; }
    public decimal GrowthRate { get; set; }
    public int ConfidenceScore { get; set; }
    public string? VerificationNotes { get; set; }
    public string? SourceUrl { get; set; }
    public DateOnly? PublicationDate { get; set; }
    public DateOnly? LastVerifiedDate { get; set; }
    public DateOnly StartedAt { get; set; }
    public DateOnly? ResolvedAt { get; set; }
    public bool ShowOnWebsite { get; set; }
    public bool ShowOnMobile { get; set; }
    public object Coordinates { get; set; } = new();
    public CountryApiDto Country { get; set; } = new();
    public PathogenSummaryApiDto? Pathogen { get; set; }
    public List<SourceLinkApiDto> Sources { get; set; } = new();
}

public class ArticleApiDto
{
    public string Id { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string Category { get; set; } = string.Empty;
    public string VerificationStatus { get; set; } = string.Empty;
    public int ReadingTimeMin { get; set; }
    public int ConfidenceScore { get; set; }
    public string? VerificationNotes { get; set; }
    public string? SourceUrl { get; set; }
    public DateOnly? PublicationDate { get; set; }
    public DateOnly? LastVerifiedDate { get; set; }
    public DateTime? PublishedAt { get; set; }
    public CountryApiDto? Country { get; set; }
    public PathogenSummaryApiDto? Pathogen { get; set; }
    public List<string> Tags { get; set; } = new();
    public List<SourceLinkApiDto> Sources { get; set; } = new();
}

public class GlobalStatsTrendApiDto
{
    public DateOnly Date { get; set; }
    public int ReportedCases { get; set; }
    public int TotalDeaths { get; set; }
}

public class InstagramPostApiDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string PostUrl { get; set; } = string.Empty;
    public string? ThumbnailImageUrl { get; set; }
    public string? Description { get; set; }
    public int SortOrder { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class MobileDeviceRegistrationRequest
{
    [JsonPropertyName("expoPushToken")]
    public string ExpoPushToken { get; set; } = string.Empty;

    [JsonPropertyName("platform")]
    public string Platform { get; set; } = "android";

    [JsonPropertyName("deviceId")]
    public string? DeviceId { get; set; }

    [JsonPropertyName("appVersion")]
    public string? AppVersion { get; set; }

    [JsonPropertyName("locale")]
    public string? Locale { get; set; }
}

public class MobileDeviceRegistrationResponse
{
    public Guid Id { get; set; }
    public bool IsActive { get; set; }
    public DateTime LastSeenAt { get; set; }
}

public class MobileNotificationApiDto
{
    public Guid Id { get; set; }
    public Guid? NewsId { get; set; }
    public string? NewsSlug { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string? DataJson { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? SentAt { get; set; }
    public DateTime? ReadAt { get; set; }
}

public class MobileNotificationReadRequest
{
    [JsonPropertyName("expoPushToken")]
    public string ExpoPushToken { get; set; } = string.Empty;
}
