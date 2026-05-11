using System.Text;
using Microsoft.AspNetCore.Identity;

var options = SeedToolOptions.Parse(args);
if (!options.IsValid(out var validationError))
{
    Console.Error.WriteLine(validationError);
    Console.Error.WriteLine();
    Console.Error.WriteLine("Kullanim:");
    Console.Error.WriteLine("  dotnet run --project backend/HantaWorld.AdminSeedTool -- --email admin@example.com --full-name \"Platform Admin\" --output database\\02_seed_first_admin.sql");
    return 1;
}

Console.Write("Parola: ");
var password = ReadSecret();
Console.WriteLine();

Console.Write("Parola tekrar: ");
var passwordConfirm = ReadSecret();
Console.WriteLine();

if (string.IsNullOrWhiteSpace(password) || password.Length < 12)
{
    Console.Error.WriteLine("Parola en az 12 karakter olmalidir.");
    return 1;
}

if (!string.Equals(password, passwordConfirm, StringComparison.Ordinal))
{
    Console.Error.WriteLine("Parolalar eslesmiyor.");
    return 1;
}

var email = options.Email.Trim().ToLowerInvariant();
var fullName = options.FullName.Trim();

var passwordHasher = new PasswordHasher<SeedAdminUser>();
var user = new SeedAdminUser
{
    Email = email,
    FullName = fullName
};

var passwordHash = passwordHasher.HashPassword(user, password);
var sql = BuildSql(email, fullName, passwordHash);

var outputPath = Path.GetFullPath(options.OutputPath);
var outputDirectory = Path.GetDirectoryName(outputPath);
if (!string.IsNullOrWhiteSpace(outputDirectory))
{
    Directory.CreateDirectory(outputDirectory);
}

await File.WriteAllTextAsync(outputPath, sql, new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));

password = string.Empty;
passwordConfirm = string.Empty;

Console.WriteLine($"SQL seed dosyasi olusturuldu: {outputPath}");
Console.WriteLine("Bu dosya sadece hash icerir; duz metin parola kaydedilmedi.");
return 0;

static string BuildSql(string email, string fullName, string passwordHash)
{
    var safeEmail = EscapeSql(email);
    var safeFullName = EscapeSql(fullName);
    var safeHash = EscapeSql(passwordHash);

    return
$@"IF EXISTS (SELECT 1 FROM dbo.admin_users)
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
    N'{safeEmail}',
    N'{safeFullName}',
    N'{safeHash}',
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
";
}

static string EscapeSql(string value) => value.Replace("'", "''");

static string ReadSecret()
{
    var buffer = new StringBuilder();

    while (true)
    {
        var key = Console.ReadKey(intercept: true);
        if (key.Key == ConsoleKey.Enter)
        {
            break;
        }

        if (key.Key == ConsoleKey.Backspace)
        {
            if (buffer.Length > 0)
            {
                buffer.Length -= 1;
            }

            continue;
        }

        if (!char.IsControl(key.KeyChar))
        {
            buffer.Append(key.KeyChar);
        }
    }

    return buffer.ToString();
}

sealed class SeedAdminUser
{
    public string Email { get; init; } = string.Empty;
    public string FullName { get; init; } = string.Empty;
}

sealed class SeedToolOptions
{
    public string Email { get; private set; } = string.Empty;
    public string FullName { get; private set; } = string.Empty;
    public string OutputPath { get; private set; } = string.Empty;

    public static SeedToolOptions Parse(string[] args)
    {
        var options = new SeedToolOptions();

        for (var i = 0; i < args.Length; i++)
        {
            switch (args[i])
            {
                case "--email":
                    options.Email = GetNextValue(args, ref i);
                    break;
                case "--full-name":
                    options.FullName = GetNextValue(args, ref i);
                    break;
                case "--output":
                    options.OutputPath = GetNextValue(args, ref i);
                    break;
            }
        }

        return options;
    }

    public bool IsValid(out string error)
    {
        if (string.IsNullOrWhiteSpace(Email))
        {
            error = "--email zorunludur.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(FullName))
        {
            error = "--full-name zorunludur.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(OutputPath))
        {
            error = "--output zorunludur.";
            return false;
        }

        error = string.Empty;
        return true;
    }

    private static string GetNextValue(string[] args, ref int index)
    {
        if (index + 1 >= args.Length)
        {
            return string.Empty;
        }

        index += 1;
        return args[index];
    }
}
