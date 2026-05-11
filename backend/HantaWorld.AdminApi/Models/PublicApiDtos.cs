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
    public object Coordinates { get; set; } = new();
    public CountryApiDto Country { get; set; } = new();
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
    public List<string> Tags { get; set; } = new();
    public List<SourceLinkApiDto> Sources { get; set; } = new();
}
