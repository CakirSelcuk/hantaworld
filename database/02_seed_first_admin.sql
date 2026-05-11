IF EXISTS (SELECT 1 FROM dbo.admin_users)
BEGIN
    THROW 51000, N'admin_users tablosunda zaten en az bir kullanici var. Islem iptal edildi.', 1;
END;
GO

INSERT INTO dbo.admin_users (
    email,
    full_name,
    password_hash,
    password_algorithm,
    role_name,
    is_active,
    failed_login_count,
    lockout_until,
    last_login_at,
    created_at,
    updated_at,
    created_by,
    updated_by
)
VALUES (
    N'selcukcakir@pm.me',
    N'Selcuk Cakir',
    N'AQAAAAIAAYagAAAAEG/2BtWSRlRsbF23PEf+wzspEMHyMoC/DU58uXmcdrDc/6b+Zq4jFSqEIgH2QXmwBQ==',
    N'ASP.NET Identity PBKDF2',
    N'superadmin',
    1,
    0,
    NULL,
    NULL,
    SYSUTCDATETIME(),
    SYSUTCDATETIME(),
    NULL,
    NULL
);
GO
