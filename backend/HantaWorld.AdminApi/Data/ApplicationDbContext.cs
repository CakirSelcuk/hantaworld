using HantaWorld.AdminApi.Domain;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Country> Countries => Set<Country>();
    public DbSet<Source> Sources => Set<Source>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<Outbreak> Outbreaks => Set<Outbreak>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<OutbreakSource> OutbreakSources => Set<OutbreakSource>();
    public DbSet<ArticleSource> ArticleSources => Set<ArticleSource>();
    public DbSet<ArticleTag> ArticleTags => Set<ArticleTag>();
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
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            entity.Property(x => x.CreatedBy).HasColumnName("created_by");
            entity.Property(x => x.UpdatedBy).HasColumnName("updated_by");

            entity.HasOne(x => x.Country)
                .WithMany(x => x.Outbreaks)
                .HasForeignKey(x => x.CountryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Article>(entity =>
        {
            entity.ToTable("articles");
            entity.Property(x => x.Id).HasColumnName("id");
            entity.Property(x => x.PublicId).HasColumnName("public_id");
            entity.Property(x => x.Slug).HasColumnName("slug");
            entity.Property(x => x.OutbreakId).HasColumnName("outbreak_id");
            entity.Property(x => x.CountryId).HasColumnName("country_id");
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
