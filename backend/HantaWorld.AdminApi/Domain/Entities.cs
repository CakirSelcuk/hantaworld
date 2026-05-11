using System.ComponentModel.DataAnnotations;

namespace HantaWorld.AdminApi.Domain;

public abstract class AuditableEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
}

public class Country : AuditableEntity
{
    [MaxLength(160)] public string Slug { get; set; } = string.Empty;
    [MaxLength(12)] public string IsoCode { get; set; } = string.Empty;
    [MaxLength(200)] public string Name { get; set; } = string.Empty;
    [MaxLength(100)] public string Continent { get; set; } = string.Empty;
    [MaxLength(16)] public string? FlagEmoji { get; set; }
    public long? Population { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    [MaxLength(2048)] public string? HealthAuthorityUrl { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Outbreak> Outbreaks { get; set; } = new List<Outbreak>();
    public ICollection<Article> Articles { get; set; } = new List<Article>();
}

public class Source : AuditableEntity
{
    [MaxLength(160)] public string Slug { get; set; } = string.Empty;
    [MaxLength(200)] public string Name { get; set; } = string.Empty;
    [MaxLength(200)] public string Organization { get; set; } = string.Empty;
    [MaxLength(50)] public string SourceType { get; set; } = "official";
    [MaxLength(2048)] public string Url { get; set; } = string.Empty;
    public byte ReliabilityScore { get; set; } = 10;
    public bool IsOfficial { get; set; } = true;
    [MaxLength(2000)] public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<OutbreakSource> OutbreakSources { get; set; } = new List<OutbreakSource>();
    public ICollection<ArticleSource> ArticleSources { get; set; } = new List<ArticleSource>();
}

public class AdminUser : AuditableEntity
{
    [MaxLength(320)] public string Email { get; set; } = string.Empty;
    [MaxLength(200)] public string FullName { get; set; } = string.Empty;
    [MaxLength(512)] public string PasswordHash { get; set; } = string.Empty;
    [MaxLength(50)] public string PasswordAlgorithm { get; set; } = "ASP.NET Identity PBKDF2";
    [MaxLength(50)] public string RoleName { get; set; } = "editor";
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }
    public int FailedLoginCount { get; set; }
    public DateTime? LockoutUntil { get; set; }
}

public class Outbreak : AuditableEntity
{
    [MaxLength(80)] public string PublicId { get; set; } = string.Empty;
    [MaxLength(160)] public string Slug { get; set; } = string.Empty;
    public Guid CountryId { get; set; }
    [MaxLength(250)] public string Title { get; set; } = string.Empty;
    [MaxLength(1000)] public string? Summary { get; set; }
    public string Description { get; set; } = string.Empty;
    [MaxLength(30)] public string Status { get; set; } = "confirmed";
    [MaxLength(30)] public string SeverityLevel { get; set; } = "medium";
    [MaxLength(30)] public string VerificationStatus { get; set; } = "verified";
    [MaxLength(30)] public string PublicationStatus { get; set; } = "draft";
    public int ConfirmedCases { get; set; }
    public int SuspectedCases { get; set; }
    public int Deaths { get; set; }
    public int Recovered { get; set; }
    public decimal GrowthRate { get; set; }
    public byte ConfidenceScore { get; set; }
    public string? VerificationNotes { get; set; }
    [MaxLength(2048)] public string? PrimarySourceUrl { get; set; }
    public DateOnly? PublicationDate { get; set; }
    public DateOnly? LastVerifiedDate { get; set; }
    public DateOnly StartedAt { get; set; }
    public DateOnly? ResolvedAt { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public decimal? RadiusKm { get; set; }
    public DateTime? PublishedAt { get; set; }

    public Country? Country { get; set; }
    public ICollection<OutbreakSource> OutbreakSources { get; set; } = new List<OutbreakSource>();
    public ICollection<Article> Articles { get; set; } = new List<Article>();
}

public class Article : AuditableEntity
{
    [MaxLength(80)] public string PublicId { get; set; } = string.Empty;
    [MaxLength(180)] public string Slug { get; set; } = string.Empty;
    public Guid? OutbreakId { get; set; }
    public Guid? CountryId { get; set; }
    [MaxLength(300)] public string Title { get; set; } = string.Empty;
    [MaxLength(1200)] public string Excerpt { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    [MaxLength(50)] public string Category { get; set; } = "outbreak-report";
    [MaxLength(30)] public string VerificationStatus { get; set; } = "verified";
    [MaxLength(30)] public string PublicationStatus { get; set; } = "draft";
    public int ReadingTimeMin { get; set; } = 3;
    public byte ConfidenceScore { get; set; }
    public string? VerificationNotes { get; set; }
    [MaxLength(2048)] public string? PrimarySourceUrl { get; set; }
    public DateOnly? PublicationDate { get; set; }
    public DateOnly? LastVerifiedDate { get; set; }
    public DateTime? PublishedAt { get; set; }
    [MaxLength(2048)] public string? CoverImageUrl { get; set; }

    public Outbreak? Outbreak { get; set; }
    public Country? Country { get; set; }
    public ICollection<ArticleSource> ArticleSources { get; set; } = new List<ArticleSource>();
    public ICollection<ArticleTag> Tags { get; set; } = new List<ArticleTag>();
}

public class OutbreakSource
{
    public Guid OutbreakId { get; set; }
    public Guid SourceId { get; set; }
    public bool IsPrimary { get; set; }
    [MaxLength(300)] public string? CitationTitle { get; set; }
    [MaxLength(2048)] public string? CitationUrl { get; set; }
    public DateOnly? PublicationDate { get; set; }
    public DateOnly? LastVerifiedDate { get; set; }
    [MaxLength(2000)] public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }

    public Outbreak? Outbreak { get; set; }
    public Source? Source { get; set; }
}

public class ArticleSource
{
    public Guid ArticleId { get; set; }
    public Guid SourceId { get; set; }
    public bool IsPrimary { get; set; }
    [MaxLength(300)] public string? CitationTitle { get; set; }
    [MaxLength(2048)] public string? CitationUrl { get; set; }
    public DateOnly? PublicationDate { get; set; }
    public DateOnly? LastVerifiedDate { get; set; }
    [MaxLength(2000)] public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }

    public Article? Article { get; set; }
    public Source? Source { get; set; }
}

public class ArticleTag
{
    public Guid ArticleId { get; set; }
    [MaxLength(80)] public string Tag { get; set; } = string.Empty;

    public Article? Article { get; set; }
}

public class AuditLog
{
    public long Id { get; set; }
    public Guid? ActorUserId { get; set; }
    [MaxLength(100)] public string ActionType { get; set; } = string.Empty;
    [MaxLength(100)] public string EntityName { get; set; } = string.Empty;
    public Guid? EntityId { get; set; }
    [MaxLength(80)] public string? EntityPublicId { get; set; }
    [MaxLength(400)] public string? RequestPath { get; set; }
    [MaxLength(16)] public string? HttpMethod { get; set; }
    [MaxLength(64)] public string? IpAddress { get; set; }
    [MaxLength(512)] public string? UserAgent { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public DateTime CreatedAt { get; set; }

    public AdminUser? ActorUser { get; set; }
}
