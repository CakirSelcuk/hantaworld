using HantaWorld.AdminApi.Domain;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Country> Countries => Set<Country>();
    public DbSet<Source> Sources => Set<Source>();
    public DbSet<Pathogen> Pathogens => Set<Pathogen>();
    public DbSet<PathogenStats> PathogenStats => Set<PathogenStats>();
    public DbSet<PathogenStatHistory> PathogenStatHistory => Set<PathogenStatHistory>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<Outbreak> Outbreaks => Set<Outbreak>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<OutbreakSource> OutbreakSources => Set<OutbreakSource>();
    public DbSet<ArticleSource> ArticleSources => Set<ArticleSource>();
    public DbSet<ArticleTag> ArticleTags => Set<ArticleTag>();
    public DbSet<DataSourceNumeric> DataSourceNumerics => Set<DataSourceNumeric>();
    public DbSet<DataSourceNumericHistory> DataSourceNumericHistory => Set<DataSourceNumericHistory>();
    public DbSet<InstagramPost> InstagramPosts => Set<InstagramPost>();
    public DbSet<MobileDevice> MobileDevices => Set<MobileDevice>();
    public DbSet<MobileNotification> MobileNotifications => Set<MobileNotification>();
    public DbSet<MobileNotificationDelivery> MobileNotificationDeliveries => Set<MobileNotificationDelivery>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Country>(entity =>
        {
            entity.ToTable("countries");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Slug).HasColumnName("slug");
            entity.Property(x => x.IsoCode).HasColumnName("iso_code");
            entity.Property(x => x.Name).HasColumnName("name");
            entity.Property(x => x.Continent).HasColumnName("continent");
            entity.Property(x => x.FlagEmoji).HasColumnName("flag_emoji");
            entity.Property(x => x.Population).HasColumnName("population");
            entity.Property(x => x.Latitude).HasColumnName("latitude").HasColumnType("decimal(9,6)");
            entity.Property(x => x.Longitude).HasColumnName("longitude").HasColumnType("decimal(9,6)");
            entity.Property(x => x.HealthAuthorityUrl).HasColumnName("health_authority_url");
            entity.Property(x => x.IsActive).HasColumnName("is_active");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");
            entity.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        });

        modelBuilder.Entity<Source>(entity =>
        {
            entity.ToTable("sources");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Slug).HasColumnName("slug");
            entity.Property(x => x.Name).HasColumnName("name");
            entity.Property(x => x.Organization).HasColumnName("organization");
            entity.Property(x => x.SourceType).HasColumnName("source_type");
            entity.Property(x => x.Url).HasColumnName("url");
            entity.Property(x => x.ReliabilityScore).HasColumnName("reliability_score");
            entity.Property(x => x.IsOfficial).HasColumnName("is_official");
            entity.Property(x => x.Notes).HasColumnName("notes");
            entity.Property(x => x.IsActive).HasColumnName("is_active");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");
            entity.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        });

        modelBuilder.Entity<Pathogen>(entity =>
        {
            entity.ToTable("pathogens");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Slug).HasColumnName("slug");
            entity.Property(x => x.Name).HasColumnName("name");
            entity.Property(x => x.DisplayName).HasColumnName("display_name");
            entity.Property(x => x.ShortDescription).HasColumnName("short_description");
            entity.Property(x => x.Color).HasColumnName("color");
            entity.Property(x => x.SortOrder).HasColumnName("sort_order");
            entity.Property(x => x.IsActive).HasColumnName("is_active");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");
            entity.Property(x => x.UpdatedBy).HasColumnName("updated_by");

            entity.HasIndex(x => x.Slug).IsUnique();
        });

        modelBuilder.Entity<AdminUser>(entity =>
        {
            entity.ToTable("admin_users");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Email).HasColumnName("email");
            entity.Property(x => x.FullName).HasColumnName("full_name");
            entity.Property(x => x.PasswordHash).HasColumnName("password_hash");
            entity.Property(x => x.PasswordAlgorithm).HasColumnName("password_algorithm");
            entity.Property(x => x.RoleName).HasColumnName("role_name");
            entity.Property(x => x.IsActive).HasColumnName("is_active");
            entity.Property(x => x.LastLoginAt).HasColumnName("last_login_at");
            entity.Property(x => x.FailedLoginCount).HasColumnName("failed_login_count");
            entity.Property(x => x.LockoutUntil).HasColumnName("lockout_until");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");
            entity.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        });

        modelBuilder.Entity<Outbreak>(entity =>
        {
            entity.ToTable("outbreaks");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.PublicId).HasColumnName("public_id");
            entity.Property(x => x.Slug).HasColumnName("slug");
            entity.Property(x => x.CountryId).HasColumnName("country_id");
            entity.Property(x => x.PathogenId).HasColumnName("pathogen_id");
            entity.Property(x => x.Title).HasColumnName("title");
            entity.Property(x => x.Summary).HasColumnName("summary");
            entity.Property(x => x.Description).HasColumnName("description");
            entity.Property(x => x.Status).HasColumnName("status");
            entity.Property(x => x.SeverityLevel).HasColumnName("severity_level");
            entity.Property(x => x.VerificationStatus).HasColumnName("verification_status");
            entity.Property(x => x.PublicationStatus).HasColumnName("publication_status");
            entity.Property(x => x.ConfirmedCases).HasColumnName("confirmed_cases");
            entity.Property(x => x.SuspectedCases).HasColumnName("suspected_cases");
            entity.Property(x => x.Deaths).HasColumnName("deaths");
            entity.Property(x => x.Recovered).HasColumnName("recovered");
            entity.Property(x => x.GrowthRate).HasColumnName("growth_rate").HasColumnType("decimal(6,2)");
            entity.Property(x => x.ConfidenceScore).HasColumnName("confidence_score");
            entity.Property(x => x.VerificationNotes).HasColumnName("verification_notes");
            entity.Property(x => x.PrimarySourceUrl).HasColumnName("primary_source_url");
            entity.Property(x => x.PublicationDate).HasColumnName("publication_date");
            entity.Property(x => x.LastVerifiedDate).HasColumnName("last_verified_date");
            entity.Property(x => x.StartedAt).HasColumnName("started_at");
            entity.Property(x => x.ResolvedAt).HasColumnName("resolved_at");
            entity.Property(x => x.Latitude).HasColumnName("latitude").HasColumnType("decimal(9,6)");
            entity.Property(x => x.Longitude).HasColumnName("longitude").HasColumnType("decimal(9,6)");
            entity.Property(x => x.RadiusKm).HasColumnName("radius_km").HasColumnType("decimal(9,2)");
            entity.Property(x => x.PublishedAt).HasColumnName("published_at");
            entity.Property(x => x.ShowOnWebsite).HasColumnName("show_on_website");
            entity.Property(x => x.ShowOnMobile).HasColumnName("show_on_mobile");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");
            entity.Property(x => x.UpdatedBy).HasColumnName("updated_by");

            entity.HasOne(x => x.Country)
                .WithMany(x => x.Outbreaks)
                .HasForeignKey(x => x.CountryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Pathogen)
                .WithMany(x => x.Outbreaks)
                .HasForeignKey(x => x.PathogenId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Article>(entity =>
        {
            entity.ToTable("articles");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.PublicId).HasColumnName("public_id");
            entity.Property(x => x.Slug).HasColumnName("slug");
            entity.Property(x => x.OutbreakId).HasColumnName("outbreak_id");
            entity.Property(x => x.CountryId).HasColumnName("country_id");
            entity.Property(x => x.PathogenId).HasColumnName("pathogen_id");
            entity.Property(x => x.Title).HasColumnName("title");
            entity.Property(x => x.Excerpt).HasColumnName("excerpt");
            entity.Property(x => x.Content).HasColumnName("content");
            entity.Property(x => x.Category).HasColumnName("category");
            entity.Property(x => x.VerificationStatus).HasColumnName("verification_status");
            entity.Property(x => x.PublicationStatus).HasColumnName("publication_status");
            entity.Property(x => x.ReadingTimeMin).HasColumnName("reading_time_min");
            entity.Property(x => x.ConfidenceScore).HasColumnName("confidence_score");
            entity.Property(x => x.VerificationNotes).HasColumnName("verification_notes");
            entity.Property(x => x.PrimarySourceUrl).HasColumnName("primary_source_url");
            entity.Property(x => x.PublicationDate).HasColumnName("publication_date");
            entity.Property(x => x.LastVerifiedDate).HasColumnName("last_verified_date");
            entity.Property(x => x.PublishedAt).HasColumnName("published_at");
            entity.Property(x => x.CoverImageUrl).HasColumnName("cover_image_url");
            entity.Property(x => x.SendPushOnPublish).HasColumnName("send_push_on_publish");
            entity.Property(x => x.NotificationSentAt).HasColumnName("notification_sent_at");
            entity.Property(x => x.NotificationSentBy).HasColumnName("notification_sent_by");
            entity.Property(x => x.NotificationSendCount).HasColumnName("notification_send_count");
            entity.Property(x => x.LastNotificationSentAt).HasColumnName("last_notification_sent_at");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");
            entity.Property(x => x.UpdatedBy).HasColumnName("updated_by");

            entity.HasOne(x => x.Outbreak)
                .WithMany(x => x.Articles)
                .HasForeignKey(x => x.OutbreakId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Country)
                .WithMany(x => x.Articles)
                .HasForeignKey(x => x.CountryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Pathogen)
                .WithMany(x => x.Articles)
                .HasForeignKey(x => x.PathogenId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<OutbreakSource>(entity =>
        {
            entity.ToTable("outbreak_sources");
            entity.HasKey(x => new { x.OutbreakId, x.SourceId });
            entity.Property(x => x.OutbreakId).HasColumnName("outbreak_id");
            entity.Property(x => x.SourceId).HasColumnName("source_id");
            entity.Property(x => x.IsPrimary).HasColumnName("is_primary");
            entity.Property(x => x.CitationTitle).HasColumnName("citation_title");
            entity.Property(x => x.CitationUrl).HasColumnName("citation_url");
            entity.Property(x => x.PublicationDate).HasColumnName("publication_date");
            entity.Property(x => x.LastVerifiedDate).HasColumnName("last_verified_date");
            entity.Property(x => x.Notes).HasColumnName("notes");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");

            entity.HasOne(x => x.Outbreak)
                .WithMany(x => x.OutbreakSources)
                .HasForeignKey(x => x.OutbreakId);

            entity.HasOne(x => x.Source)
                .WithMany(x => x.OutbreakSources)
                .HasForeignKey(x => x.SourceId);
        });

        modelBuilder.Entity<ArticleSource>(entity =>
        {
            entity.ToTable("article_sources");
            entity.HasKey(x => new { x.ArticleId, x.SourceId });
            entity.Property(x => x.ArticleId).HasColumnName("article_id");
            entity.Property(x => x.SourceId).HasColumnName("source_id");
            entity.Property(x => x.IsPrimary).HasColumnName("is_primary");
            entity.Property(x => x.CitationTitle).HasColumnName("citation_title");
            entity.Property(x => x.CitationUrl).HasColumnName("citation_url");
            entity.Property(x => x.PublicationDate).HasColumnName("publication_date");
            entity.Property(x => x.LastVerifiedDate).HasColumnName("last_verified_date");
            entity.Property(x => x.Notes).HasColumnName("notes");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");

            entity.HasOne(x => x.Article)
                .WithMany(x => x.ArticleSources)
                .HasForeignKey(x => x.ArticleId);

            entity.HasOne(x => x.Source)
                .WithMany(x => x.ArticleSources)
                .HasForeignKey(x => x.SourceId);
        });

        modelBuilder.Entity<ArticleTag>(entity =>
        {
            entity.ToTable("article_tags");
            entity.HasKey(x => new { x.ArticleId, x.Tag });
            entity.Property(x => x.ArticleId).HasColumnName("article_id");
            entity.Property(x => x.Tag).HasColumnName("tag");
            entity.HasOne(x => x.Article)
                .WithMany(x => x.Tags)
                .HasForeignKey(x => x.ArticleId);
        });

        modelBuilder.Entity<DataSourceNumeric>(entity =>
        {
            entity.ToTable("data_source_numeric");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.CardKey).HasColumnName("card_key");
            entity.Property(x => x.Label).HasColumnName("label");
            entity.Property(x => x.NumericValue).HasColumnName("numeric_value");
            entity.Property(x => x.DisplayOrder).HasColumnName("display_order");
            entity.Property(x => x.IsActive).HasColumnName("is_active");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");
            entity.Property(x => x.UpdatedBy).HasColumnName("updated_by");

            entity.HasIndex(x => x.CardKey).IsUnique();
        });

        modelBuilder.Entity<DataSourceNumericHistory>(entity =>
        {
            entity.ToTable("data_source_numeric_history");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.SnapshotDate).HasColumnName("snapshot_date");
            entity.Property(x => x.ReportedCases).HasColumnName("reported_cases");
            entity.Property(x => x.TotalDeaths).HasColumnName("total_deaths");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");
            entity.Property(x => x.UpdatedBy).HasColumnName("updated_by");

            entity.HasIndex(x => x.SnapshotDate).IsUnique();
        });

        modelBuilder.Entity<PathogenStats>(entity =>
        {
            entity.ToTable("pathogen_stats");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.PathogenId).HasColumnName("pathogen_id");
            entity.Property(x => x.ReportedCases).HasColumnName("reported_cases");
            entity.Property(x => x.TotalDeaths).HasColumnName("total_deaths");
            entity.Property(x => x.AffectedCountries).HasColumnName("affected_countries");
            entity.Property(x => x.ActiveOutbreaks).HasColumnName("active_outbreaks");
            entity.Property(x => x.SourceInstitution).HasColumnName("source_institution");
            entity.Property(x => x.SourceUrl).HasColumnName("source_url");
            entity.Property(x => x.OfficialPublishedAt).HasColumnName("official_published_at");
            entity.Property(x => x.LastVerifiedAt).HasColumnName("last_verified_at");
            entity.Property(x => x.Notes).HasColumnName("notes");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");
            entity.Property(x => x.UpdatedBy).HasColumnName("updated_by");

            entity.HasIndex(x => x.PathogenId).IsUnique();
            entity.HasOne(x => x.Pathogen)
                .WithOne(x => x.Stats)
                .HasForeignKey<PathogenStats>(x => x.PathogenId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PathogenStatHistory>(entity =>
        {
            entity.ToTable("pathogen_stat_history");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.PathogenId).HasColumnName("pathogen_id");
            entity.Property(x => x.SnapshotDate).HasColumnName("snapshot_date");
            entity.Property(x => x.ReportedCases).HasColumnName("reported_cases");
            entity.Property(x => x.TotalDeaths).HasColumnName("total_deaths");
            entity.Property(x => x.AffectedCountries).HasColumnName("affected_countries");
            entity.Property(x => x.ActiveOutbreaks).HasColumnName("active_outbreaks");
            entity.Property(x => x.SourceInstitution).HasColumnName("source_institution");
            entity.Property(x => x.SourceUrl).HasColumnName("source_url");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");
            entity.Property(x => x.UpdatedBy).HasColumnName("updated_by");

            entity.HasIndex(x => new { x.PathogenId, x.SnapshotDate }).IsUnique();
            entity.HasOne(x => x.Pathogen)
                .WithMany(x => x.StatHistory)
                .HasForeignKey(x => x.PathogenId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<InstagramPost>(entity =>
        {
            entity.ToTable("instagram_posts");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.Title).HasColumnName("title");
            entity.Property(x => x.PostUrl).HasColumnName("post_url");
            entity.Property(x => x.ThumbnailImageUrl).HasColumnName("thumbnail_image_url");
            entity.Property(x => x.Description).HasColumnName("description");
            entity.Property(x => x.SortOrder).HasColumnName("sort_order");
            entity.Property(x => x.IsFeatured).HasColumnName("is_featured");
            entity.Property(x => x.IsPublished).HasColumnName("is_published");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");
            entity.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        });

        modelBuilder.Entity<MobileDevice>(entity =>
        {
            entity.ToTable("mobile_devices");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.ExpoPushToken).HasColumnName("expo_push_token");
            entity.Property(x => x.Platform).HasColumnName("platform");
            entity.Property(x => x.DeviceId).HasColumnName("device_id");
            entity.Property(x => x.AppVersion).HasColumnName("app_version");
            entity.Property(x => x.Locale).HasColumnName("locale");
            entity.Property(x => x.IsActive).HasColumnName("is_active");
            entity.Property(x => x.LastSeenAt).HasColumnName("last_seen_at");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");
            entity.Property(x => x.UpdatedBy).HasColumnName("updated_by");

            entity.HasIndex(x => x.ExpoPushToken).IsUnique();
        });

        modelBuilder.Entity<MobileNotification>(entity =>
        {
            entity.ToTable("mobile_notifications");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.NewsId).HasColumnName("news_id");
            entity.Property(x => x.Title).HasColumnName("title");
            entity.Property(x => x.Body).HasColumnName("body");
            entity.Property(x => x.DataJson).HasColumnName("data_json");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.SentAt).HasColumnName("sent_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");

            entity.HasOne(x => x.News)
                .WithMany(x => x.MobileNotifications)
                .HasForeignKey(x => x.NewsId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(x => x.CreatedByUser)
                .WithMany()
                .HasForeignKey(x => x.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<MobileNotificationDelivery>(entity =>
        {
            entity.ToTable("mobile_notification_deliveries");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.NotificationId).HasColumnName("notification_id");
            entity.Property(x => x.MobileDeviceId).HasColumnName("mobile_device_id");
            entity.Property(x => x.ExpoPushToken).HasColumnName("expo_push_token");
            entity.Property(x => x.Status).HasColumnName("status");
            entity.Property(x => x.ErrorMessage).HasColumnName("error_message");
            entity.Property(x => x.SentAt).HasColumnName("sent_at");
            entity.Property(x => x.ReadAt).HasColumnName("read_at");

            entity.HasOne(x => x.Notification)
                .WithMany(x => x.Deliveries)
                .HasForeignKey(x => x.NotificationId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.MobileDevice)
                .WithMany(x => x.Deliveries)
                .HasForeignKey(x => x.MobileDeviceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("audit_logs");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.ActorUserId).HasColumnName("actor_user_id");
            entity.Property(x => x.ActionType).HasColumnName("action_type");
            entity.Property(x => x.EntityName).HasColumnName("entity_name");
            entity.Property(x => x.EntityId).HasColumnName("entity_id");
            entity.Property(x => x.EntityPublicId).HasColumnName("entity_public_id");
            entity.Property(x => x.RequestPath).HasColumnName("request_path");
            entity.Property(x => x.HttpMethod).HasColumnName("http_method");
            entity.Property(x => x.IpAddress).HasColumnName("ip_address");
            entity.Property(x => x.UserAgent).HasColumnName("user_agent");
            entity.Property(x => x.OldValues).HasColumnName("old_values");
            entity.Property(x => x.NewValues).HasColumnName("new_values");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
        });
    }
}
