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

CREATE TABLE dbo.pathogens (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_pathogens PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  slug NVARCHAR(80) NOT NULL,
  name NVARCHAR(160) NOT NULL,
  display_name NVARCHAR(160) NOT NULL,
  short_description NVARCHAR(500) NULL,
  color NVARCHAR(32) NOT NULL CONSTRAINT DF_pathogens_color DEFAULT N'#64748b',
  sort_order INT NOT NULL CONSTRAINT DF_pathogens_sort_order DEFAULT 100,
  is_active BIT NOT NULL CONSTRAINT DF_pathogens_is_active DEFAULT 1,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_pathogens_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_pathogens_updated_at DEFAULT SYSUTCDATETIME(),
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL
);
GO

CREATE UNIQUE INDEX UX_pathogens_slug ON dbo.pathogens(slug);
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
  pathogen_id UNIQUEIDENTIFIER NULL,
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
  show_on_website BIT NOT NULL CONSTRAINT DF_outbreaks_show_on_website DEFAULT 1,
  show_on_mobile BIT NOT NULL CONSTRAINT DF_outbreaks_show_on_mobile DEFAULT 1,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_outbreaks_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_outbreaks_updated_at DEFAULT SYSUTCDATETIME(),
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL,
  CONSTRAINT FK_outbreaks_country FOREIGN KEY (country_id) REFERENCES dbo.countries(id),
  CONSTRAINT FK_outbreaks_pathogen FOREIGN KEY (pathogen_id) REFERENCES dbo.pathogens(id) ON DELETE SET NULL,
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
CREATE INDEX IX_outbreaks_pathogen_id ON dbo.outbreaks(pathogen_id);
CREATE INDEX IX_outbreaks_publication_status ON dbo.outbreaks(publication_status, verification_status);
CREATE INDEX IX_outbreaks_surface_visibility ON dbo.outbreaks(show_on_website, show_on_mobile, publication_status, verification_status);
GO

CREATE TABLE dbo.articles (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_articles PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  public_id NVARCHAR(80) NOT NULL,
  slug NVARCHAR(180) NOT NULL,
  outbreak_id UNIQUEIDENTIFIER NULL,
  country_id UNIQUEIDENTIFIER NULL,
  pathogen_id UNIQUEIDENTIFIER NULL,
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
  send_push_on_publish BIT NOT NULL CONSTRAINT DF_articles_send_push_on_publish DEFAULT 0,
  notification_sent_at DATETIME2(0) NULL,
  notification_sent_by UNIQUEIDENTIFIER NULL,
  notification_send_count INT NOT NULL CONSTRAINT DF_articles_notification_send_count DEFAULT 0,
  last_notification_sent_at DATETIME2(0) NULL,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_articles_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_articles_updated_at DEFAULT SYSUTCDATETIME(),
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL,
  CONSTRAINT FK_articles_outbreak FOREIGN KEY (outbreak_id) REFERENCES dbo.outbreaks(id),
  CONSTRAINT FK_articles_country FOREIGN KEY (country_id) REFERENCES dbo.countries(id),
  CONSTRAINT FK_articles_pathogen FOREIGN KEY (pathogen_id) REFERENCES dbo.pathogens(id) ON DELETE SET NULL,
  CONSTRAINT CK_articles_category CHECK (category IN ('outbreak-report', 'scientific-research', 'public-health', 'travel-advisory', 'prevention', 'analysis')),
  CONSTRAINT CK_articles_verification_status CHECK (verification_status IN ('verified', 'pending', 'unverified', 'rejected')),
  CONSTRAINT CK_articles_publication_status CHECK (publication_status IN ('draft', 'published', 'archived')),
  CONSTRAINT CK_articles_confidence_score CHECK (confidence_score BETWEEN 0 AND 100)
);
GO

CREATE UNIQUE INDEX UX_articles_public_id ON dbo.articles(public_id);
CREATE UNIQUE INDEX UX_articles_slug ON dbo.articles(slug);
CREATE INDEX IX_articles_pathogen_id ON dbo.articles(pathogen_id);
CREATE INDEX IX_articles_publication_status ON dbo.articles(publication_status, verification_status, published_at);
GO

CREATE TABLE dbo.article_tags (
  article_id UNIQUEIDENTIFIER NOT NULL,
  tag NVARCHAR(80) NOT NULL,
  CONSTRAINT PK_article_tags PRIMARY KEY (article_id, tag),
  CONSTRAINT FK_article_tags_article FOREIGN KEY (article_id) REFERENCES dbo.articles(id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.data_source_numeric (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_data_source_numeric PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  card_key NVARCHAR(80) NOT NULL,
  label NVARCHAR(120) NOT NULL,
  numeric_value INT NOT NULL CONSTRAINT DF_data_source_numeric_value DEFAULT 0,
  display_order INT NOT NULL CONSTRAINT DF_data_source_numeric_display_order DEFAULT 0,
  is_active BIT NOT NULL CONSTRAINT DF_data_source_numeric_is_active DEFAULT 1,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_data_source_numeric_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_data_source_numeric_updated_at DEFAULT SYSUTCDATETIME(),
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL,
  CONSTRAINT CK_data_source_numeric_value CHECK (numeric_value >= 0),
  CONSTRAINT CK_data_source_numeric_card_key CHECK (card_key IN ('reportedCases', 'totalDeaths', 'affectedCountries', 'activeOutbreaks'))
);
GO

CREATE UNIQUE INDEX UX_data_source_numeric_card_key ON dbo.data_source_numeric(card_key);
GO

CREATE TABLE dbo.data_source_numeric_history (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_data_source_numeric_history PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  snapshot_date DATE NOT NULL,
  reported_cases INT NOT NULL CONSTRAINT DF_data_source_numeric_history_reported_cases DEFAULT 0,
  total_deaths INT NOT NULL CONSTRAINT DF_data_source_numeric_history_total_deaths DEFAULT 0,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_data_source_numeric_history_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_data_source_numeric_history_updated_at DEFAULT SYSUTCDATETIME(),
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL,
  CONSTRAINT CK_data_source_numeric_history_values CHECK (reported_cases >= 0 AND total_deaths >= 0)
);
GO

CREATE UNIQUE INDEX UX_data_source_numeric_history_snapshot_date ON dbo.data_source_numeric_history(snapshot_date);
GO

CREATE TABLE dbo.pathogen_stats (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_pathogen_stats PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  pathogen_id UNIQUEIDENTIFIER NOT NULL,
  reported_cases INT NULL,
  total_deaths INT NULL,
  affected_countries INT NULL,
  active_outbreaks INT NULL,
  source_institution NVARCHAR(200) NULL,
  source_url NVARCHAR(2048) NULL,
  official_published_at DATE NULL,
  last_verified_at DATE NULL,
  notes NVARCHAR(4000) NULL,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_pathogen_stats_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_pathogen_stats_updated_at DEFAULT SYSUTCDATETIME(),
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL,
  CONSTRAINT FK_pathogen_stats_pathogen FOREIGN KEY (pathogen_id) REFERENCES dbo.pathogens(id) ON DELETE CASCADE,
  CONSTRAINT CK_pathogen_stats_values CHECK (
    (reported_cases IS NULL OR reported_cases >= 0) AND
    (total_deaths IS NULL OR total_deaths >= 0) AND
    (affected_countries IS NULL OR affected_countries >= 0) AND
    (active_outbreaks IS NULL OR active_outbreaks >= 0)
  )
);
GO

CREATE UNIQUE INDEX UX_pathogen_stats_pathogen_id ON dbo.pathogen_stats(pathogen_id);
GO

CREATE TABLE dbo.pathogen_stat_history (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_pathogen_stat_history PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  pathogen_id UNIQUEIDENTIFIER NOT NULL,
  snapshot_date DATE NOT NULL,
  reported_cases INT NULL,
  total_deaths INT NULL,
  affected_countries INT NULL,
  active_outbreaks INT NULL,
  source_institution NVARCHAR(200) NULL,
  source_url NVARCHAR(2048) NULL,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_pathogen_stat_history_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_pathogen_stat_history_updated_at DEFAULT SYSUTCDATETIME(),
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL,
  CONSTRAINT FK_pathogen_stat_history_pathogen FOREIGN KEY (pathogen_id) REFERENCES dbo.pathogens(id) ON DELETE CASCADE,
  CONSTRAINT CK_pathogen_stat_history_values CHECK (
    (reported_cases IS NULL OR reported_cases >= 0) AND
    (total_deaths IS NULL OR total_deaths >= 0) AND
    (affected_countries IS NULL OR affected_countries >= 0) AND
    (active_outbreaks IS NULL OR active_outbreaks >= 0)
  )
);
GO

CREATE UNIQUE INDEX UX_pathogen_stat_history_pathogen_date ON dbo.pathogen_stat_history(pathogen_id, snapshot_date);
GO

CREATE TABLE dbo.instagram_posts (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_instagram_posts PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  title NVARCHAR(180) NOT NULL,
  post_url NVARCHAR(2048) NOT NULL,
  thumbnail_image_url NVARCHAR(2048) NULL,
  description NVARCHAR(500) NULL,
  sort_order INT NOT NULL CONSTRAINT DF_instagram_posts_sort_order DEFAULT 10,
  is_featured BIT NOT NULL CONSTRAINT DF_instagram_posts_is_featured DEFAULT 0,
  is_published BIT NOT NULL CONSTRAINT DF_instagram_posts_is_published DEFAULT 1,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_instagram_posts_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_instagram_posts_updated_at DEFAULT SYSUTCDATETIME(),
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL
);
GO

CREATE INDEX IX_instagram_posts_public ON dbo.instagram_posts(is_published, is_featured DESC, sort_order ASC, updated_at DESC);
GO

CREATE TABLE dbo.mobile_devices (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_mobile_devices PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  expo_push_token NVARCHAR(300) NOT NULL,
  platform NVARCHAR(40) NOT NULL CONSTRAINT DF_mobile_devices_platform DEFAULT N'android',
  device_id NVARCHAR(200) NULL,
  app_version NVARCHAR(40) NULL,
  locale NVARCHAR(20) NULL,
  is_active BIT NOT NULL CONSTRAINT DF_mobile_devices_is_active DEFAULT 1,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_mobile_devices_created_at DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_mobile_devices_updated_at DEFAULT SYSUTCDATETIME(),
  last_seen_at DATETIME2(0) NULL,
  created_by UNIQUEIDENTIFIER NULL,
  updated_by UNIQUEIDENTIFIER NULL
);
GO

CREATE UNIQUE INDEX UX_mobile_devices_expo_push_token ON dbo.mobile_devices(expo_push_token);
GO

CREATE TABLE dbo.mobile_notifications (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_mobile_notifications PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  news_id UNIQUEIDENTIFIER NULL,
  title NVARCHAR(160) NOT NULL,
  body NVARCHAR(500) NOT NULL,
  data_json NVARCHAR(MAX) NULL,
  created_at DATETIME2(0) NOT NULL CONSTRAINT DF_mobile_notifications_created_at DEFAULT SYSUTCDATETIME(),
  sent_at DATETIME2(0) NULL,
  created_by UNIQUEIDENTIFIER NULL,
  CONSTRAINT FK_mobile_notifications_news FOREIGN KEY (news_id) REFERENCES dbo.articles(id) ON DELETE SET NULL,
  CONSTRAINT FK_mobile_notifications_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id) ON DELETE SET NULL
);
GO

CREATE INDEX IX_mobile_notifications_news ON dbo.mobile_notifications(news_id, created_at DESC);
GO

CREATE TABLE dbo.mobile_notification_deliveries (
  id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_mobile_notification_deliveries PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  notification_id UNIQUEIDENTIFIER NOT NULL,
  mobile_device_id UNIQUEIDENTIFIER NOT NULL,
  expo_push_token NVARCHAR(300) NOT NULL,
  status NVARCHAR(40) NOT NULL CONSTRAINT DF_mobile_notification_deliveries_status DEFAULT N'pending',
  error_message NVARCHAR(1000) NULL,
  sent_at DATETIME2(0) NULL,
  read_at DATETIME2(0) NULL,
  CONSTRAINT FK_mobile_notification_deliveries_notification FOREIGN KEY (notification_id) REFERENCES dbo.mobile_notifications(id) ON DELETE CASCADE,
  CONSTRAINT FK_mobile_notification_deliveries_device FOREIGN KEY (mobile_device_id) REFERENCES dbo.mobile_devices(id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_mobile_notification_deliveries_device ON dbo.mobile_notification_deliveries(mobile_device_id, sent_at DESC);
CREATE INDEX IX_mobile_notification_deliveries_token ON dbo.mobile_notification_deliveries(expo_push_token, sent_at DESC);
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

ALTER TABLE dbo.pathogens
  ADD CONSTRAINT FK_pathogens_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.pathogens
  ADD CONSTRAINT FK_pathogens_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);

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
ALTER TABLE dbo.articles
  ADD CONSTRAINT FK_articles_notification_sent_by FOREIGN KEY (notification_sent_by) REFERENCES dbo.admin_users(id);

ALTER TABLE dbo.data_source_numeric
  ADD CONSTRAINT FK_data_source_numeric_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.data_source_numeric
  ADD CONSTRAINT FK_data_source_numeric_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.data_source_numeric_history
  ADD CONSTRAINT FK_data_source_numeric_history_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.data_source_numeric_history
  ADD CONSTRAINT FK_data_source_numeric_history_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.pathogen_stats
  ADD CONSTRAINT FK_pathogen_stats_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.pathogen_stats
  ADD CONSTRAINT FK_pathogen_stats_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.pathogen_stat_history
  ADD CONSTRAINT FK_pathogen_stat_history_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.pathogen_stat_history
  ADD CONSTRAINT FK_pathogen_stat_history_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.instagram_posts
  ADD CONSTRAINT FK_instagram_posts_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.instagram_posts
  ADD CONSTRAINT FK_instagram_posts_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.mobile_devices
  ADD CONSTRAINT FK_mobile_devices_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
ALTER TABLE dbo.mobile_devices
  ADD CONSTRAINT FK_mobile_devices_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);
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

MERGE dbo.pathogens AS target
USING (VALUES
  (CAST('11111111-1111-1111-1111-111111111111' AS UNIQUEIDENTIFIER), N'hantavirus', N'Hantavirus', N'Hantavirus', N'Hantavirus outbreak intelligence and official-source updates.', N'#0ea5e9', 10, CAST(1 AS BIT)),
  (CAST('22222222-2222-2222-2222-222222222222' AS UNIQUEIDENTIFIER), N'ebola-marburg', N'Ebola / Marburg', N'Ebola / Marburg', N'Filovirus outbreak intelligence and public health updates.', N'#ef4444', 20, CAST(1 AS BIT)),
  (CAST('33333333-3333-3333-3333-333333333333' AS UNIQUEIDENTIFIER), N'mpox', N'Mpox', N'Mpox', N'Mpox outbreak intelligence and public health updates.', N'#a855f7', 30, CAST(1 AS BIT)),
  (CAST('44444444-4444-4444-4444-444444444444' AS UNIQUEIDENTIFIER), N'dengue', N'Dengue', N'Dengue', N'Dengue outbreak intelligence and public health updates.', N'#f59e0b', 40, CAST(1 AS BIT)),
  (CAST('55555555-5555-5555-5555-555555555555' AS UNIQUEIDENTIFIER), N'measles', N'Measles', N'Measles', N'Measles outbreak intelligence and public health updates.', N'#6366f1', 50, CAST(1 AS BIT)),
  (CAST('66666666-6666-6666-6666-666666666666' AS UNIQUEIDENTIFIER), N'avian-influenza', N'Avian Influenza', N'Avian Influenza', N'Avian influenza outbreak intelligence and public health updates.', N'#fb923c', 60, CAST(1 AS BIT)),
  (CAST('77777777-7777-7777-7777-777777777777' AS UNIQUEIDENTIFIER), N'covid-respiratory-viruses', N'COVID / Respiratory Viruses', N'COVID / Respiratory Viruses', N'Respiratory virus outbreak intelligence and public health updates.', N'#38bdf8', 70, CAST(1 AS BIT)),
  (CAST('88888888-8888-8888-8888-888888888888' AS UNIQUEIDENTIFIER), N'unknown-emerging-outbreaks', N'Unknown / Emerging Outbreaks', N'Unknown / Emerging Outbreaks', N'Emerging outbreak intelligence when pathogen classification is incomplete.', N'#94a3b8', 80, CAST(1 AS BIT)),
  (CAST('99999999-9999-9999-9999-999999999999' AS UNIQUEIDENTIFIER), N'official-updates', N'Official Updates', N'Official Updates', N'Category-like taxonomy entry for official public health updates.', N'#22c55e', 90, CAST(1 AS BIT)),
  (CAST('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' AS UNIQUEIDENTIFIER), N'weekly-risk-brief', N'Weekly Risk Brief', N'Weekly Risk Brief', N'Category-like taxonomy entry for weekly risk brief content.', N'#eab308', 100, CAST(1 AS BIT))
) AS source (id, slug, name, display_name, short_description, color, sort_order, is_active)
ON target.slug = source.slug
WHEN MATCHED THEN
  UPDATE SET
    name = source.name,
    display_name = source.display_name,
    short_description = source.short_description,
    color = source.color,
    sort_order = source.sort_order,
    is_active = source.is_active,
    updated_at = SYSUTCDATETIME()
WHEN NOT MATCHED THEN
  INSERT (id, slug, name, display_name, short_description, color, sort_order, is_active, created_at, updated_at)
  VALUES (source.id, source.slug, source.name, source.display_name, source.short_description, source.color, source.sort_order, source.is_active, SYSUTCDATETIME(), SYSUTCDATETIME());
GO

/*
  Seed guidance:
  - Insert the first admin user manually after app deployment using the ASP.NET password hasher.
  - Do not store plain-text passwords in SQL scripts.
*/
