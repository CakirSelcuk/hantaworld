using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace HantaWorld.AdminApi.Models;

public class LoginViewModel
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;
}

public class CountryFormViewModel
{
    public Guid? Id { get; set; }

    [Required, MaxLength(160)] public string Slug { get; set; } = string.Empty;
    [Required, MaxLength(12)] public string IsoCode { get; set; } = string.Empty;
    [Required, MaxLength(200)] public string Name { get; set; } = string.Empty;
    [Required, MaxLength(100)] public string Continent { get; set; } = string.Empty;
    [MaxLength(16)] public string? FlagEmoji { get; set; }
    public long? Population { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    [Url, MaxLength(2048)] public string? HealthAuthorityUrl { get; set; }
    public bool IsActive { get; set; } = true;
}

public class SourceFormViewModel
{
    public Guid? Id { get; set; }

    [Required, MaxLength(160)] public string Slug { get; set; } = string.Empty;
    [Required, MaxLength(200)] public string Name { get; set; } = string.Empty;
    [Required, MaxLength(200)] public string Organization { get; set; } = string.Empty;
    [Required, MaxLength(50)] public string SourceType { get; set; } = "official";
    [Required, Url, MaxLength(2048)] public string Url { get; set; } = string.Empty;
    [Range(0, 100)] public byte ReliabilityScore { get; set; } = 100;
    public bool IsOfficial { get; set; } = true;
    [MaxLength(2000)] public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;
}

public class OutbreakFormViewModel
{
    public Guid? Id { get; set; }

    [Required, MaxLength(80)] public string PublicId { get; set; } = string.Empty;
    [Required, MaxLength(160)] public string Slug { get; set; } = string.Empty;
    [Required] public Guid CountryId { get; set; }
    [Required, MaxLength(250)] public string Title { get; set; } = string.Empty;
    [MaxLength(1000)] public string? Summary { get; set; }
    [Required] public string Description { get; set; } = string.Empty;
    [Required, MaxLength(30)] public string Status { get; set; } = "confirmed";
    [Required, MaxLength(30)] public string SeverityLevel { get; set; } = "medium";
    [Required, MaxLength(30)] public string VerificationStatus { get; set; } = "verified";
    [Required, MaxLength(30)] public string PublicationStatus { get; set; } = "draft";
    [Range(0, int.MaxValue)] public int ConfirmedCases { get; set; }
    [Range(0, int.MaxValue)] public int SuspectedCases { get; set; }
    [Range(0, int.MaxValue)] public int Deaths { get; set; }
    [Range(0, int.MaxValue)] public int Recovered { get; set; }
    public decimal GrowthRate { get; set; }
    [Range(0, 100)] public byte ConfidenceScore { get; set; }
    public string? VerificationNotes { get; set; }
    [Url, MaxLength(2048)] public string? PrimarySourceUrl { get; set; }
    [DataType(DataType.Date)] public DateOnly? PublicationDate { get; set; }
    [DataType(DataType.Date)] public DateOnly? LastVerifiedDate { get; set; }
    [Required, DataType(DataType.Date)] public DateOnly StartedAt { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
    [DataType(DataType.Date)] public DateOnly? ResolvedAt { get; set; }
    [Range(-90, 90)] public decimal Latitude { get; set; }
    [Range(-180, 180)] public decimal Longitude { get; set; }
    [Range(0, 100000)] public decimal? RadiusKm { get; set; }
    public bool ShowOnWebsite { get; set; } = true;
    public bool ShowOnMobile { get; set; } = true;
    public List<Guid> SelectedSourceIds { get; set; } = new();
    public List<SelectListItem> AvailableCountries { get; set; } = new();
    public List<SelectListItem> AvailableSources { get; set; } = new();
}

public class ArticleFormViewModel
{
    public Guid? Id { get; set; }

    [Required, MaxLength(80)] public string PublicId { get; set; } = string.Empty;
    [Required, MaxLength(180)] public string Slug { get; set; } = string.Empty;
    public Guid? OutbreakId { get; set; }
    public Guid? CountryId { get; set; }
    public Guid? PathogenId { get; set; }
    [Required, MaxLength(300)] public string Title { get; set; } = string.Empty;
    [Required, MaxLength(1200)] public string Excerpt { get; set; } = string.Empty;
    [Required] public string Content { get; set; } = string.Empty;
    [Required, MaxLength(50)] public string Category { get; set; } = "outbreak-report";
    [Required, MaxLength(30)] public string VerificationStatus { get; set; } = "verified";
    [Required, MaxLength(30)] public string PublicationStatus { get; set; } = "draft";
    [Range(1, 120)] public int ReadingTimeMin { get; set; } = 3;
    [Range(0, 100)] public byte ConfidenceScore { get; set; }
    public string? VerificationNotes { get; set; }
    [Url, MaxLength(2048)] public string? PrimarySourceUrl { get; set; }
    [DataType(DataType.Date)] public DateOnly? PublicationDate { get; set; }
    [DataType(DataType.Date)] public DateOnly? LastVerifiedDate { get; set; }
    [Url, MaxLength(2048)] public string? CoverImageUrl { get; set; }
    public bool SendPushOnPublish { get; set; }
    public DateTime? NotificationSentAt { get; set; }
    public Guid? NotificationSentBy { get; set; }
    public int NotificationSendCount { get; set; }
    public DateTime? LastNotificationSentAt { get; set; }
    public string TagsCsv { get; set; } = string.Empty;
    public List<Guid> SelectedSourceIds { get; set; } = new();
    public List<SelectListItem> AvailableOutbreaks { get; set; } = new();
    public List<SelectListItem> AvailableCountries { get; set; } = new();
    public List<SelectListItem> AvailableSources { get; set; } = new();
    public List<SelectListItem> AvailablePathogens { get; set; } = new();
}

public class DataSourceNumericItemViewModel
{
    public Guid? Id { get; set; }

    [Required, MaxLength(80)]
    public string CardKey { get; set; } = string.Empty;

    [Required, MaxLength(120)]
    public string Label { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int NumericValue { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;
}

public class DataSourceNumericIndexViewModel
{
    public List<DataSourceNumericItemViewModel> Items { get; set; } = new();
}

public class InstagramPostFormViewModel
{
    public Guid? Id { get; set; }

    [Required, MaxLength(180)]
    public string Title { get; set; } = string.Empty;

    [Required, Url, MaxLength(2048)]
    public string PostUrl { get; set; } = string.Empty;

    [Url, MaxLength(2048)]
    public string? ThumbnailImageUrl { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public int SortOrder { get; set; } = 10;

    public bool IsFeatured { get; set; }

    public bool IsPublished { get; set; } = true;
}

public class PathogenStatsFormViewModel
{
    [Required]
    public Guid PathogenId { get; set; }

    public string? PathogenSlug { get; set; }
    public string? PathogenDisplayName { get; set; }

    [Range(0, int.MaxValue)]
    public int? ReportedCases { get; set; }

    [Range(0, int.MaxValue)]
    public int? TotalDeaths { get; set; }

    [Range(0, int.MaxValue)]
    public int? AffectedCountries { get; set; }

    [Range(0, int.MaxValue)]
    public int? ActiveOutbreaks { get; set; }

    [MaxLength(200)]
    public string? SourceInstitution { get; set; }

    [Url, MaxLength(2048)]
    public string? SourceUrl { get; set; }

    [DataType(DataType.Date)]
    public DateOnly? OfficialPublishedAt { get; set; }

    [DataType(DataType.Date)]
    public DateOnly? LastVerifiedAt { get; set; }

    [MaxLength(4000)]
    public string? Notes { get; set; }

    public List<SelectListItem> AvailablePathogens { get; set; } = new();
}

public class MobilePushDebugViewModel
{
    public List<MobileDeviceDebugRow> Devices { get; set; } = new();
    public List<MobileNotificationDebugRow> Notifications { get; set; } = new();
    public List<MobileNotificationDeliveryDebugRow> Deliveries { get; set; } = new();
}

public class MobileDeviceDebugRow
{
    public Guid Id { get; set; }
    public string ExpoPushTokenPreview { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty;
    public string? DeviceId { get; set; }
    public string? AppVersion { get; set; }
    public string? Locale { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? LastSeenAt { get; set; }
}

public class MobileNotificationDebugRow
{
    public Guid Id { get; set; }
    public Guid? NewsId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? SentAt { get; set; }
    public Guid? CreatedBy { get; set; }
}

public class MobileNotificationDeliveryDebugRow
{
    public Guid Id { get; set; }
    public Guid NotificationId { get; set; }
    public Guid MobileDeviceId { get; set; }
    public string ExpoPushTokenPreview { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
    public DateTime? SentAt { get; set; }
    public DateTime? ReadAt { get; set; }
}
