SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

/*
  HantaWorld MSSQL schema
  Target architecture:
  Vercel frontend -> ASP.NET API/Admin -> MSSQL
*/

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'dbo')
BEGIN
  EXEC('CREATE SCHEMA dbo');
END
GO

CREATE TABLE dbo.countries (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_countries PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  slug NVARCHAR(160) NOT NULL,
  iso_code NVARCHAR(12) NOT NULL,
  name NVARCHAR(200) NOT NULL,
  continent NVARCHAR(100) NOT NULL,
  flag_emoji NVARCHAR(16) NULL,
  population BIGINT NULL,
  latitude DECIMAL(9, 6) NULL,
  longitude DECIMAL(9, 6) NULL,
  health_authority_url NVARCHAR(2048) NULL,
  is_active BIT NOT NULL CONSTRAINT DF_countries_is_active DEFAULT 1,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_countries_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_countries_updated_at DEFAULT SYSUTCDATETIME(),
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL
);
GO

CREATE UNIQUE INDEX UX_countries_slug ON dbo.countries(slug);
CREATE UNIQUE INDEX UX_countries_iso_code ON dbo.countries(iso_code);
GO

CREATE TABLE dbo.sources (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_sources PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  slug NVARCHAR(160) NOT NULL,
  name NVARCHAR(200) NOT NULL,
  organization NVARCHAR(200) NOT NULL,
  source_type NVARCHAR(50) NOT NULL,
  url NVARCHAR(2048) NOT NULL,
  reliability_score TINYINT NOT NULL CONSTRAINT DF_sources_reliability_score DEFAULT 10,
  is_official BIT NOT NULL CONSTRAINT DF_sources_is_official DEFAULT 1,
  notes NVARCHAR(2000) NULL,
  is_active BIT NOT NULL CONSTRAINT DF_sources_is_active DEFAULT 1,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_sources_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_sources_updated_at DEFAULT SYSUTCDATETIME(),
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL,
  CONSTRAINT CK_sources_reliability_score CHECK (reliability_score BETWEEN 0 AND 100),
  CONSTRAINT CK_sources_type CHECK (source_type IN ('who', 'cdc', 'ecdc', 'official', 'academic', 'manual', 'other'))
);
GO

CREATE UNIQUE INDEX UX_sources_slug ON dbo.sources(slug);
GO

CREATE TABLE dbo.admin_users (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_admin_users PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  email NVARCHAR(320) NOT NULL,
  full_name NVARCHAR(200) NOT NULL,
  password_hash NVARCHAR(512) NOT NULL,
  password_algorithm NVARCHAR(50) NOT NULL CONSTRAINT DF_admin_users_password_algorithm DEFAULT 'ASP.NET Identity PBKDF2',
  role_name NVARCHAR(50) NOT NULL CONSTRAINT DF_admin_users_role_name DEFAULT 'editor',
  is_active BIT NOT NULL CONSTRAINT DF_admin_users_is_active DEFAULT 1,
  last_login_at DATETIME2(0) NULL,
  failed_login_count INT NOT NULL CONSTRAINT DF_admin_users_failed_login_count DEFAULT 0,
  lockout_until DATETIME2(0) NULL,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_admin_users_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_admin_users_updated_at DEFAULT SYSUTCDATETIME(),
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL,
  CONSTRAINT CK_admin_users_role_name CHECK (role_name IN ('superadmin', 'admin', 'editor', 'analyst'))
);
GO

CREATE UNIQUE INDEX UX_admin_users_email ON dbo.admin_users(email);
GO

CREATE TABLE dbo.outbreaks (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_outbreaks PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  public_id NVARCHAR(80) NOT NULL,
  slug NVARCHAR(160) NOT NULL,
  country_id UNIQUEIDENTIFIER NOT NULL,
  title NVARCHAR(250) NOT NULL,
  summary NVARCHAR(1000) NULL,
  description NVARCHAR(MAX) NOT NULL,
  status NVARCHAR(30) NOT NULL,
  severity_level NVARCHAR(30) NOT NULL,
  verification_status NVARCHAR(30) NOT NULL CONSTRAINT DF_outbreaks_verification_status DEFAULT 'verified',
  publication_status NVARCHAR(30) NOT NULL CONSTRAINT DF_outbreaks_publication_status DEFAULT 'draft',
  confirmed_cases INT NOT NULL CONSTRAINT DF_outbreaks_confirmed_cases DEFAULT 0,
  suspected_cases INT NOT NULL CONSTRAINT DF_outbreaks_suspected_cases DEFAULT 0,
  deaths INT NOT NULL CONSTRAINT DF_outbreaks_deaths DEFAULT 0,
  recovered INT NOT NULL CONSTRAINT DF_outbreaks_recovered DEFAULT 0,
  growth_rate DECIMAL(6,2) NOT NULL CONSTRAINT DF_outbreaks_growth_rate DEFAULT 0,
  confidence_score TINYINT NOT NULL CONSTRAINT DF_outbreaks_confidence_score DEFAULT 0,
  verification_notes NVARCHAR(MAX) NULL,
  primary_source_url NVARCHAR(2048) NULL,
  publication_date DATE NULL,
  last_verified_date DATE NULL,
  started_at DATE NOT NULL,
  resolved_at DATE NULL,
  latitude DECIMAL(9, 6) NOT NULL,
  longitude DECIMAL(9, 6) NOT NULL,
  radius_km DECIMAL(9, 2) NULL,
  published_at DATETIME2(0) NULL,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_outbreaks_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_outbreaks_updated_at DEFAULT SYSUTCDATETIME(),
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL,
  CONSTRAINT FK_outbreaks_country FOREIGN KEY (country_id) REFERENCES dbo.countries(id),
  CONSTRAINT CK_outbreaks_status CHECK (status IN ('confirmed', 'suspected', 'monitoring', 'resolved')),
  CONSTRAINT CK_outbreaks_severity_level CHECK (severity_level IN ('critical', 'high', 'medium', 'low')),
  CONSTRAINT CK_outbreaks_verification_status CHECK (verification_status IN ('verified', 'pending', 'unverified', 'rejected')),
  CONSTRAINT CK_outbreaks_publication_status CHECK (publication_status IN ('draft', 'published', 'archived')),
  CONSTRAINT CK_outbreaks_confidence_score CHECK (confidence_score BETWEEN 0 AND 100),
  CONSTRAINT CK_outbreaks_numeric_values CHECK (
    confirmed_cases >= 0 AND suspected_cases >= 0 AND deaths >= 0 AND recovered >= 0
  )
);
GO

CREATE UNIQUE INDEX UX_outbreaks_public_id ON dbo.outbreaks(public_id);
CREATE UNIQUE INDEX UX_outbreaks_slug ON dbo.outbreaks(slug);
CREATE INDEX IX_outbreaks_country_id ON dbo.outbreaks(country_id);
CREATE INDEX IX_outbreaks_publication_status ON dbo.outbreaks(publication_status, verification_status);
GO

CREATE TABLE dbo.articles (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_articles PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  public_id NVARCHAR(80) NOT NULL,
  slug NVARCHAR(180) NOT NULL,
  outbreak_id UNIQUEIDENTIFIER NULL,
  country_id UNIQUEIDENTIFIER NULL,
  title NVARCHAR(300) NOT NULL,
  excerpt NVARCHAR(1200) NOT NULL,
  content NVARCHAR(MAX) NOT NULL,
  category NVARCHAR(50) NOT NULL,
  verification_status NVARCHAR(30) NOT NULL CONSTRAINT DF_articles_verification_status DEFAULT 'verified',
  publication_status NVARCHAR(30) NOT NULL CONSTRAINT DF_articles_publication_status DEFAULT 'draft',
  reading_time_min INT NOT NULL CONSTRAINT DF_articles_reading_time DEFAULT 3,
  confidence_score TINYINT NOT NULL CONSTRAINT DF_articles_confidence_score DEFAULT 0,
  verification_notes NVARCHAR(MAX) NULL,
  primary_source_url NVARCHAR(2048) NULL,
  publication_date DATE NULL,
  last_verified_date DATE NULL,
  published_at DATETIME2(0) NULL,
  cover_image_url NVARCHAR(2048) NULL,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_articles_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_articles_updated_at DEFAULT SYSUTCDATETIME(),
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL,
  CONSTRAINT FK_articles_outbreak FOREIGN KEY (outbreak_id) REFERENCES dbo.outbreaks(id),
  CONSTRAINT FK_articles_country FOREIGN KEY (country_id) REFERENCES dbo.countries(id),
  CONSTRAINT CK_articles_category CHECK (category IN ('outbreak-report', 'scientific-research', 'public-health', 'travel-advisory', 'prevention', 'analysis')),
  CONSTRAINT CK_articles_verification_status CHECK (verification_status IN ('verified', 'pending', 'unverified', 'rejected')),
  CONSTRAINT CK_articles_publication_status CHECK (publication_status IN ('draft', 'published', 'archived')),
  CONSTRAINT CK_articles_confidence_score CHECK (confidence_score BETWEEN 0 AND 100)
);
GO

CREATE UNIQUE INDEX UX_articles_public_id ON dbo.articles(public_id);
CREATE UNIQUE INDEX UX_articles_slug ON dbo.articles(slug);
CREATE INDEX IX_articles_publication_status ON dbo.articles(publication_status, verification_status, published_at);
GO

CREATE TABLE dbo.article_tags (
  article_id UNIQUEIDENTIFIER NOT NULL,
  tag NVARCHAR(80) NOT NULL,
  CONSTRAINT PK_article_tags PRIMARY KEY (article_id, tag),
  CONSTRAINT FK_article_tags_article FOREIGN KEY (article_id) REFERENCES dbo.articles(id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.outbreak_sources (
  outbreak_id UNIQUEIDENTIFIER NOT NULL,
  source_id UNIQUEIDENTIFIER NOT NULL,
  is_primary BIT NOT NULL CONSTRAINT DF_outbreak_sources_is_primary DEFAULT 0,
  citation_title NVARCHAR(300) NULL,
  citation_url NVARCHAR(2048) NULL,
  publication_date DATE NULL,
  last_verified_date DATE NULL,
  notes NVARCHAR(2000) NULL,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_outbreak_sources_created_at DEFAULT SYSUTCDATETIME(),
  CONSTRAINT PK_outbreak_sources PRIMARY KEY (outbreak_id, source_id),
  CONSTRAINT FK_outbreak_sources_outbreak FOREIGN KEY (outbreak_id) REFERENCES dbo.outbreaks(id) ON DELETE CASCADE,
  CONSTRAINT FK_outbreak_sources_source FOREIGN KEY (source_id) REFERENCES dbo.sources(id)
);
GO

CREATE TABLE dbo.article_sources (
  article_id UNIQUEIDENTIFIER NOT NULL,
  source_id UNIQUEIDENTIFIER NOT NULL,
  is_primary BIT NOT NULL CONSTRAINT DF_article_sources_is_primary DEFAULT 0,
  citation_title NVARCHAR(300) NULL,
  citation_url NVARCHAR(2048) NULL,
  publication_date DATE NULL,
  last_verified_date DATE NULL,
  notes NVARCHAR(2000) NULL,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_article_sources_created_at DEFAULT SYSUTCDATETIME(),
  CONSTRAINT PK_article_sources PRIMARY KEY (article_id, source_id),
  CONSTRAINT FK_article_sources_article FOREIGN KEY (article_id) REFERENCES dbo.articles(id) ON DELETE CASCADE,
  CONSTRAINT FK_article_sources_source FOREIGN KEY (source_id) REFERENCES dbo.sources(id)
);
GO

CREATE TABLE dbo.audit_logs (
  id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_audit_logs PRIMARY KEY,
  actor_user_id UNIQUEIDENTIFIER NULL,
  action_type NVARCHAR(100) NOT NULL,
  entity_name NVARCHAR(100) NOT NULL,
  entity_id UNIQUEIDENTIFIER NULL,
  entity_public_id NVARCHAR(80) NULL,
  request_path NVARCHAR(400) NULL,
  http_method NVARCHAR(16) NULL,
  ip_address NVARCHAR(64) NULL,
  user_agent NVARCHAR(512) NULL,
  old_values NVARCHAR(MAX) NULL,
  new_values NVARCHAR(MAX) NULL,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_audit_logs_created_at DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_audit_logs_actor_user FOREIGN KEY (actor_user_id) REFERENCES dbo.admin_users(id)
);
GO

CREATE INDEX IX_audit_logs_entity ON dbo.audit_logs(entity_name, entity_id, created_at DESC);
CREATE INDEX IX_audit_logs_actor ON dbo.audit_logs(actor_user_id, created_at DESC);
GO

ALTER TABLE dbo.countries
  ADD CONSTRAINT FK_countries_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.countries
  ADD CONSTRAINT FK_countries_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);

ALTER TABLE dbo.sources
  ADD CONSTRAINT FK_sources_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.sources
  ADD CONSTRAINT FK_sources_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);

ALTER TABLE dbo.admin_users
  ADD CONSTRAINT FK_admin_users_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.admin_users
  ADD CONSTRAINT FK_admin_users_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);

ALTER TABLE dbo.outbreaks
  ADD CONSTRAINT FK_outbreaks_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.outbreaks
  ADD CONSTRAINT FK_outbreaks_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);

ALTER TABLE dbo.articles
  ADD CONSTRAINT FK_articles_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.articles
  ADD CONSTRAINT FK_articles_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);
GO

CREATE OR ALTER VIEW dbo.vw_global_stats
AS
SELECT
  SUM(o.confirmed_cases) AS total_confirmed_cases,
  SUM(o.suspected_cases) AS total_suspected_cases,
  SUM(o.deaths) AS total_deaths,
  SUM(o.recovered) AS total_recovered,
  COUNT(DISTINCT o.country_id) AS affected_countries,
  SUM(CASE WHEN o.status <> 'resolved' THEN 1 ELSE 0 END) AS active_outbreaks,
  CAST(AVG(CAST(o.growth_rate AS DECIMAL(10,2))) AS DECIMAL(10,2)) AS growth_rate_7d,
  MAX(CAST(COALESCE(o.last_verified_date, o.publication_date, CAST(o.updated_at AS DATE)) AS DATETIME2(0))) AS last_updated
FROM dbo.outbreaks o
WHERE o.publication_status = 'published'
  AND o.verification_status = 'verified';
GO

/*
  Seed guidance:
  - Insert the first admin user manually after app deployment using the ASP.NET password hasher.
  - Do not store plain-text passwords in SQL scripts.
*/
