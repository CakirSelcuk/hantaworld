SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF OBJECT_ID(N'dbo.pathogens', N'U') IS NULL
BEGIN
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
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_pathogens_slug' AND object_id = OBJECT_ID(N'dbo.pathogens'))
BEGIN
  CREATE UNIQUE INDEX UX_pathogens_slug ON dbo.pathogens(slug);
END
GO

IF OBJECT_ID(N'dbo.pathogen_stats', N'U') IS NULL
BEGIN
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
    CONSTRAINT CK_pathogen_stats_values CHECK (
      (reported_cases IS NULL OR reported_cases >= 0) AND
      (total_deaths IS NULL OR total_deaths >= 0) AND
      (affected_countries IS NULL OR affected_countries >= 0) AND
      (active_outbreaks IS NULL OR active_outbreaks >= 0)
    )
  );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_pathogen_stats_pathogen_id' AND object_id = OBJECT_ID(N'dbo.pathogen_stats'))
BEGIN
  CREATE UNIQUE INDEX UX_pathogen_stats_pathogen_id ON dbo.pathogen_stats(pathogen_id);
END
GO

IF OBJECT_ID(N'dbo.pathogen_stat_history', N'U') IS NULL
BEGIN
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
    CONSTRAINT CK_pathogen_stat_history_values CHECK (
      (reported_cases IS NULL OR reported_cases >= 0) AND
      (total_deaths IS NULL OR total_deaths >= 0) AND
      (affected_countries IS NULL OR affected_countries >= 0) AND
      (active_outbreaks IS NULL OR active_outbreaks >= 0)
    )
  );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_pathogen_stat_history_pathogen_date' AND object_id = OBJECT_ID(N'dbo.pathogen_stat_history'))
BEGIN
  CREATE UNIQUE INDEX UX_pathogen_stat_history_pathogen_date ON dbo.pathogen_stat_history(pathogen_id, snapshot_date);
END
GO

IF COL_LENGTH(N'dbo.articles', N'pathogen_id') IS NULL
BEGIN
  ALTER TABLE dbo.articles ADD pathogen_id UNIQUEIDENTIFIER NULL;
END
GO

IF COL_LENGTH(N'dbo.outbreaks', N'pathogen_id') IS NULL
BEGIN
  ALTER TABLE dbo.outbreaks ADD pathogen_id UNIQUEIDENTIFIER NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_articles_pathogen_id' AND object_id = OBJECT_ID(N'dbo.articles'))
BEGIN
  CREATE INDEX IX_articles_pathogen_id ON dbo.articles(pathogen_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_outbreaks_pathogen_id' AND object_id = OBJECT_ID(N'dbo.outbreaks'))
BEGIN
  CREATE INDEX IX_outbreaks_pathogen_id ON dbo.outbreaks(pathogen_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_pathogen_stats_pathogen')
BEGIN
  ALTER TABLE dbo.pathogen_stats
    ADD CONSTRAINT FK_pathogen_stats_pathogen FOREIGN KEY (pathogen_id) REFERENCES dbo.pathogens(id) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_pathogen_stat_history_pathogen')
BEGIN
  ALTER TABLE dbo.pathogen_stat_history
    ADD CONSTRAINT FK_pathogen_stat_history_pathogen FOREIGN KEY (pathogen_id) REFERENCES dbo.pathogens(id) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_articles_pathogen')
BEGIN
  ALTER TABLE dbo.articles
    ADD CONSTRAINT FK_articles_pathogen FOREIGN KEY (pathogen_id) REFERENCES dbo.pathogens(id) ON DELETE SET NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_outbreaks_pathogen')
BEGIN
  ALTER TABLE dbo.outbreaks
    ADD CONSTRAINT FK_outbreaks_pathogen FOREIGN KEY (pathogen_id) REFERENCES dbo.pathogens(id) ON DELETE SET NULL;
END
GO

IF OBJECT_ID(N'dbo.admin_users', N'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_pathogens_created_by')
BEGIN
  ALTER TABLE dbo.pathogens
    ADD CONSTRAINT FK_pathogens_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
END
GO

IF OBJECT_ID(N'dbo.admin_users', N'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_pathogens_updated_by')
BEGIN
  ALTER TABLE dbo.pathogens
    ADD CONSTRAINT FK_pathogens_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);
END
GO

IF OBJECT_ID(N'dbo.admin_users', N'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_pathogen_stats_created_by')
BEGIN
  ALTER TABLE dbo.pathogen_stats
    ADD CONSTRAINT FK_pathogen_stats_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
END
GO

IF OBJECT_ID(N'dbo.admin_users', N'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_pathogen_stats_updated_by')
BEGIN
  ALTER TABLE dbo.pathogen_stats
    ADD CONSTRAINT FK_pathogen_stats_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);
END
GO

IF OBJECT_ID(N'dbo.admin_users', N'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_pathogen_stat_history_created_by')
BEGIN
  ALTER TABLE dbo.pathogen_stat_history
    ADD CONSTRAINT FK_pathogen_stat_history_created_by FOREIGN KEY (created_by) REFERENCES dbo.admin_users(id);
END
GO

IF OBJECT_ID(N'dbo.admin_users', N'U') IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = N'FK_pathogen_stat_history_updated_by')
BEGIN
  ALTER TABLE dbo.pathogen_stat_history
    ADD CONSTRAINT FK_pathogen_stat_history_updated_by FOREIGN KEY (updated_by) REFERENCES dbo.admin_users(id);
END
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

DECLARE @hantavirusId UNIQUEIDENTIFIER = (SELECT id FROM dbo.pathogens WHERE slug = N'hantavirus');

IF @hantavirusId IS NOT NULL
BEGIN
  UPDATE dbo.articles
  SET pathogen_id = @hantavirusId
  WHERE pathogen_id IS NULL;

  UPDATE dbo.outbreaks
  SET pathogen_id = @hantavirusId
  WHERE pathogen_id IS NULL;
END
GO

DECLARE @hantavirusId UNIQUEIDENTIFIER = (SELECT id FROM dbo.pathogens WHERE slug = N'hantavirus');

IF @hantavirusId IS NOT NULL AND OBJECT_ID(N'dbo.data_source_numeric', N'U') IS NOT NULL
BEGIN
  MERGE dbo.pathogen_stats AS target
  USING (
    SELECT
      @hantavirusId AS pathogen_id,
      MAX(CASE WHEN card_key = N'reportedCases' THEN numeric_value END) AS reported_cases,
      MAX(CASE WHEN card_key = N'totalDeaths' THEN numeric_value END) AS total_deaths,
      MAX(CASE WHEN card_key = N'affectedCountries' THEN numeric_value END) AS affected_countries,
      MAX(CASE WHEN card_key = N'activeOutbreaks' THEN numeric_value END) AS active_outbreaks
    FROM dbo.data_source_numeric
    WHERE card_key IN (N'reportedCases', N'totalDeaths', N'affectedCountries', N'activeOutbreaks')
    HAVING COUNT(*) > 0
  ) AS source
  ON target.pathogen_id = source.pathogen_id
  WHEN MATCHED THEN
    UPDATE SET
      reported_cases = COALESCE(target.reported_cases, source.reported_cases),
      total_deaths = COALESCE(target.total_deaths, source.total_deaths),
      affected_countries = COALESCE(target.affected_countries, source.affected_countries),
      active_outbreaks = COALESCE(target.active_outbreaks, source.active_outbreaks),
      updated_at = SYSUTCDATETIME()
  WHEN NOT MATCHED THEN
    INSERT (id, pathogen_id, reported_cases, total_deaths, affected_countries, active_outbreaks, created_at, updated_at)
    VALUES (NEWID(), source.pathogen_id, source.reported_cases, source.total_deaths, source.affected_countries, source.active_outbreaks, SYSUTCDATETIME(), SYSUTCDATETIME());
END
GO

DECLARE @hantavirusId UNIQUEIDENTIFIER = (SELECT id FROM dbo.pathogens WHERE slug = N'hantavirus');

IF @hantavirusId IS NOT NULL AND OBJECT_ID(N'dbo.data_source_numeric_history', N'U') IS NOT NULL
BEGIN
  MERGE dbo.pathogen_stat_history AS target
  USING (
    SELECT
      @hantavirusId AS pathogen_id,
      snapshot_date,
      reported_cases,
      total_deaths
    FROM dbo.data_source_numeric_history
  ) AS source
  ON target.pathogen_id = source.pathogen_id AND target.snapshot_date = source.snapshot_date
  WHEN MATCHED THEN
    UPDATE SET
      reported_cases = COALESCE(target.reported_cases, source.reported_cases),
      total_deaths = COALESCE(target.total_deaths, source.total_deaths),
      updated_at = SYSUTCDATETIME()
  WHEN NOT MATCHED THEN
    INSERT (id, pathogen_id, snapshot_date, reported_cases, total_deaths, created_at, updated_at)
    VALUES (NEWID(), source.pathogen_id, source.snapshot_date, source.reported_cases, source.total_deaths, SYSUTCDATETIME(), SYSUTCDATETIME());
END
GO
