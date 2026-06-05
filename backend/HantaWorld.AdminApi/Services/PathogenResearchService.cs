using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using HantaWorld.AdminApi.Domain;
using HantaWorld.AdminApi.Models;

namespace HantaWorld.AdminApi.Services;

public static class PathogenResearchService
{
    private const int MaxSourcesToFetch = 8;
    private const int MaxHtmlChars = 260_000;
    private static readonly TimeSpan RequestTimeout = TimeSpan.FromSeconds(6);
    private static readonly HttpClient ResearchHttpClient = CreateHttpClient();

    public static async Task<PathogenResearchOutputViewModel> BuildOutputAsync(Pathogen pathogen, PathogenResearchViewModel model)
    {
        var sources = GetTrustedSources(pathogen.Slug);
        var fetchedSources = await FetchTrustedSourcesAsync(sources);
        return BuildOutput(pathogen, model, sources, fetchedSources);
    }

    private static PathogenResearchOutputViewModel BuildOutput(
        Pathogen pathogen,
        PathogenResearchViewModel model,
        List<PathogenResearchSourceViewModel> sources,
        List<PathogenResearchFetchedSourceViewModel> fetchedSources)
    {
        var reachedSources = fetchedSources.Where(x => x.IsSuccess).ToList();
        var primaryFetchedSource = reachedSources.FirstOrDefault(x => !string.IsNullOrWhiteSpace(x.Title) || !string.IsNullOrWhiteSpace(x.Snippet));
        var primarySource = primaryFetchedSource ?? fetchedSources.FirstOrDefault(x => x.IsSuccess);
        var sourceInstitutions = reachedSources.Count > 0
            ? string.Join(" / ", reachedSources.Select(x => x.Institution).Distinct())
            : string.Join(" / ", sources.Select(x => x.Institution).Distinct());
        var dateScope = BuildDateScope(model);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var sourceUrl = primarySource?.Url ?? sources.FirstOrDefault()?.Url ?? string.Empty;
        var currentDevelopment = BuildCurrentDevelopment(pathogen, reachedSources);
        var reportTitle = $"{pathogen.DisplayName} resmi kaynak taraması";
        var reportSummary = reachedSources.Count > 0
            ? $"{reachedSources.Count} resmi kaynağa ulaşıldı. Yayın öncesi başlık, tarih ve kısa notlar admin tarafından kontrol edilmelidir."
            : "Güncel bir gelişme bulunamadı. Resmi kaynaklara ulaşılamadı veya güvenilir özet çıkarılamadı.";
        var reportContent = BuildReportContent(pathogen, dateScope, currentDevelopment, reachedSources, fetchedSources);
        var verificationNote = "Bu rapor kaynaklı virüs taraması ekranında resmi kaynaklardan taslak olarak üretildi. Public site İngilizce olduğu için yayınlamadan önce kaynaklar kontrol edilmeli, metin editlenmeli ve gerekli ise İngilizceye çevrilmelidir.";
        var statisticsText = BuildStatisticsText(pathogen, sourceInstitutions, sourceUrl, dateScope, today);
        var reportText = BuildReportText(pathogen, reportTitle, reportSummary, reportContent, sourceInstitutions, sourceUrl, today, verificationNote);
        var sourcesText = BuildSourcesText(fetchedSources);

        return new PathogenResearchOutputViewModel
        {
            ReportTitle = reportTitle,
            ReportSummary = reportSummary,
            ReportContent = reportContent,
            ReportType = "outbreak-report",
            SourceInstitution = sourceInstitutions,
            SourceUrl = sourceUrl,
            PublicationDate = today,
            VerificationNote = verificationNote,
            StatisticsText = statisticsText,
            ReportText = reportText,
            SourcesText = sourcesText,
            AdminNote = "Bu çıktı otomatik yayınlanmadı. Sayılar otomatik kaydedilmedi. Kaynaklar kontrol edildikten sonra Salgın İstatistikleri ekranına elle girilebilir veya rapor taslak olarak Salgın Raporları içine eklenebilir.",
            CurrentDevelopmentText = currentDevelopment,
            Sources = sources,
            FetchedSources = fetchedSources
        };
    }

    private static async Task<List<PathogenResearchFetchedSourceViewModel>> FetchTrustedSourcesAsync(List<PathogenResearchSourceViewModel> sources)
    {
        var selectedSources = sources.Take(MaxSourcesToFetch).ToList();
        var tasks = selectedSources.Select(FetchSourceAsync).ToArray();
        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

    private static async Task<PathogenResearchFetchedSourceViewModel> FetchSourceAsync(PathogenResearchSourceViewModel source)
    {
        try
        {
            using var response = await ResearchHttpClient.GetAsync(source.Url, HttpCompletionOption.ResponseHeadersRead);
            if (!response.IsSuccessStatusCode)
            {
                return Failed(source, $"Kaynağa ulaşılamadı. HTTP {(int)response.StatusCode}");
            }

            var html = await ReadLimitedHtmlAsync(response);
            if (string.IsNullOrWhiteSpace(html))
            {
                return Failed(source, "Kaynağa ulaşılamadı. Boş içerik döndü.");
            }

            var title = ExtractTitle(html);
            var snippet = ExtractDescription(html) ?? ExtractFirstUsefulText(html);
            var publishedDate = ExtractPublishedDate(html);

            return new PathogenResearchFetchedSourceViewModel
            {
                Institution = source.Institution,
                Url = source.Url,
                Note = source.Note,
                IsSuccess = true,
                StatusText = "Kaynağa ulaşıldı.",
                Title = title,
                PublishedDate = publishedDate,
                Snippet = snippet
            };
        }
        catch (TaskCanceledException)
        {
            return Failed(source, "Kaynağa ulaşılamadı. Zaman aşımı.");
        }
        catch (HttpRequestException exception)
        {
            return Failed(source, $"Kaynağa ulaşılamadı. {TrimTo(exception.Message, 180)}");
        }
        catch (Exception exception)
        {
            return Failed(source, $"Kaynağa ulaşılamadı. {TrimTo(exception.Message, 180)}");
        }
    }

    private static PathogenResearchFetchedSourceViewModel Failed(PathogenResearchSourceViewModel source, string message)
    {
        return new PathogenResearchFetchedSourceViewModel
        {
            Institution = source.Institution,
            Url = source.Url,
            Note = source.Note,
            IsSuccess = false,
            StatusText = "Kaynağa ulaşılamadı.",
            ErrorMessage = message
        };
    }

    private static async Task<string> ReadLimitedHtmlAsync(HttpResponseMessage response)
    {
        await using var stream = await response.Content.ReadAsStreamAsync();
        using var reader = new StreamReader(stream, Encoding.UTF8, detectEncodingFromByteOrderMarks: true);
        var buffer = new char[MaxHtmlChars];
        var read = await reader.ReadBlockAsync(buffer, 0, buffer.Length);
        return new string(buffer, 0, read);
    }

    private static HttpClient CreateHttpClient()
    {
        var client = new HttpClient
        {
            Timeout = RequestTimeout
        };
        client.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent", "HantaWorldAdminResearchBot/1.0 (+https://www.hantaworld.com)");
        client.DefaultRequestHeaders.TryAddWithoutValidation("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        return client;
    }

    private static string BuildCurrentDevelopment(Pathogen pathogen, List<PathogenResearchFetchedSourceViewModel> reachedSources)
    {
        if (reachedSources.Count == 0)
        {
            return "Güncel bir gelişme bulunamadı.";
        }

        var lines = new List<string>
        {
            $"{pathogen.DisplayName} için resmi kaynaklardan alınan başlık ve kısa notlar aşağıdadır. Bu bilgiler yayın öncesi admin tarafından kaynak linklerinden tekrar kontrol edilmelidir."
        };

        foreach (var source in reachedSources.Take(5))
        {
            var title = string.IsNullOrWhiteSpace(source.Title) ? "Başlık çıkarılamadı" : source.Title;
            var date = string.IsNullOrWhiteSpace(source.PublishedDate) ? "tarih bulunamadı" : source.PublishedDate;
            var snippet = string.IsNullOrWhiteSpace(source.Snippet) ? "Kısa not çıkarılamadı." : source.Snippet;
            lines.Add($"- {source.Institution}: {title} ({date}). {snippet}");
        }

        return string.Join(Environment.NewLine, lines);
    }

    private static string BuildReportContent(
        Pathogen pathogen,
        string dateScope,
        string currentDevelopment,
        List<PathogenResearchFetchedSourceViewModel> reachedSources,
        List<PathogenResearchFetchedSourceViewModel> fetchedSources)
    {
        var reachedText = reachedSources.Count == 0
            ? "Resmi kaynaklara ulaşılamadı veya güvenilir özet çıkarılamadı."
            : string.Join(Environment.NewLine, reachedSources.Take(5).Select(x =>
                $"- {x.Institution}: {(string.IsNullOrWhiteSpace(x.Title) ? "Başlık çıkarılamadı" : x.Title)} ({(string.IsNullOrWhiteSpace(x.PublishedDate) ? "tarih bulunamadı" : x.PublishedDate)})"));
        var failedText = fetchedSources.Any(x => !x.IsSuccess)
            ? string.Join(Environment.NewLine, fetchedSources.Where(x => !x.IsSuccess).Take(5).Select(x => $"- {x.Institution}: {x.ErrorMessage}"))
            : "Ulaşılamayan kaynak yok.";

        return string.Join(Environment.NewLine + Environment.NewLine, new[]
        {
            $"{pathogen.DisplayName} için resmi halk sağlığı kaynakları tarandı.",
            $"Kontrol kapsamı: {dateScope}",
            $"Bulunan güncel gelişme:{Environment.NewLine}{currentDevelopment}",
            $"Ulaşılan kaynaklar:{Environment.NewLine}{reachedText}",
            $"Ulaşılamayan kaynaklar:{Environment.NewLine}{failedText}",
            "Sayısal veri otomatik kaydedilmedi. Vaka, ölüm, etkilenen ülke ve aktif salgın sayıları ancak resmi kaynakta açık ve doğrulanabilir şekilde yer alıyorsa admin tarafından Salgın İstatistikleri ekranına elle girilmelidir.",
            "Bu rapor taslağı resmi kaynaklardan üretilmiştir; yayın öncesi admin kontrolü gerekir."
        });
    }

    private static string BuildStatisticsText(Pathogen pathogen, string sourceInstitutions, string sourceUrl, string dateScope, DateOnly today)
    {
        return string.Join(Environment.NewLine, new[]
        {
            $"Virüs / Kategori: {pathogen.DisplayName}",
            "Vaka Sayısı: Güncel ve doğrulanmış numerik veri bulunamadı.",
            "Ölüm Sayısı: Güncel ve doğrulanmış numerik veri bulunamadı.",
            "Etkilenen Ülke: Güncel ve doğrulanmış numerik veri bulunamadı.",
            "Aktif Salgın: Güncel ve doğrulanmış numerik veri bulunamadı.",
            $"Kaynak Kurum: {sourceInstitutions}",
            $"Kaynak Linki: {(string.IsNullOrWhiteSpace(sourceUrl) ? "Kaynaklardan kontrol et." : sourceUrl)}",
            "Resmi Yayın Tarihi: Kaynak linkinden kontrol et.",
            $"Son Doğrulama Tarihi: {today:yyyy-MM-dd}",
            $"Notlar: {dateScope} Resmi kaynaklar kontrol edilmeden sayısal veri yayınlanmamalıdır. Bu ekran yalnızca öneri üretir ve istatistik kaydetmez."
        });
    }

    private static string BuildReportText(
        Pathogen pathogen,
        string reportTitle,
        string reportSummary,
        string reportContent,
        string sourceInstitutions,
        string sourceUrl,
        DateOnly today,
        string verificationNote)
    {
        return string.Join(Environment.NewLine, new[]
        {
            $"Rapor Başlığı: {reportTitle}",
            $"Virüs / Kategori: {pathogen.DisplayName}",
            "Rapor Türü: Salgın Raporu",
            $"Kısa Özet: {reportSummary}",
            $"Detaylı İçerik: {reportContent}",
            $"Kaynak Kurum: {sourceInstitutions}",
            $"Kaynak Linki: {(string.IsNullOrWhiteSpace(sourceUrl) ? "Kaynaklardan kontrol et." : sourceUrl)}",
            $"Yayın Tarihi: {today:yyyy-MM-dd}",
            $"Doğrulama Notu: {verificationNote}"
        });
    }

    private static string BuildSourcesText(List<PathogenResearchFetchedSourceViewModel> fetchedSources)
    {
        return string.Join(Environment.NewLine, fetchedSources.Select(x =>
        {
            var status = x.IsSuccess ? "ulaşıldı" : "ulaşılamadı";
            var detail = x.IsSuccess
                ? $"{x.Title ?? "Başlık çıkarılamadı"} | {x.PublishedDate ?? "tarih bulunamadı"}"
                : x.ErrorMessage ?? "Kaynağa ulaşılamadı.";
            return $"- {x.Institution}: {x.Url} ({status}) {detail}";
        }));
    }

    private static string? ExtractTitle(string html)
    {
        var ogTitle = ExtractMetaContent(html, "og:title", "twitter:title");
        if (!string.IsNullOrWhiteSpace(ogTitle))
        {
            return TrimTo(ogTitle, 240);
        }

        var match = Regex.Match(html, @"<title[^>]*>\s*(?<value>.*?)\s*</title>", RegexOptions.IgnoreCase | RegexOptions.Singleline);
        return match.Success ? TrimTo(CleanText(match.Groups["value"].Value), 240) : null;
    }

    private static string? ExtractDescription(string html)
    {
        var description = ExtractMetaContent(html, "description", "og:description", "twitter:description");
        return string.IsNullOrWhiteSpace(description) ? null : TrimTo(description, 500);
    }

    private static string? ExtractPublishedDate(string html)
    {
        var metaDate = ExtractMetaContent(html, "article:published_time", "date", "datePublished", "publishdate", "DC.date");
        if (!string.IsNullOrWhiteSpace(metaDate))
        {
            return NormalizeDate(metaDate);
        }

        var timeMatch = Regex.Match(html, @"<time\b[^>]*\bdatetime\s*=\s*[""'](?<value>.*?)[""'][^>]*>", RegexOptions.IgnoreCase | RegexOptions.Singleline);
        return timeMatch.Success ? NormalizeDate(timeMatch.Groups["value"].Value) : null;
    }

    private static string? ExtractFirstUsefulText(string html)
    {
        foreach (Match match in Regex.Matches(html, @"<p\b[^>]*>(?<value>.*?)</p>", RegexOptions.IgnoreCase | RegexOptions.Singleline))
        {
            var value = CleanText(match.Groups["value"].Value);
            if (value.Length >= 80 && !LooksLikeBoilerplate(value))
            {
                return TrimTo(value, 500);
            }
        }

        var text = CleanText(Regex.Replace(html, @"<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>", " ", RegexOptions.IgnoreCase | RegexOptions.Singleline));
        return text.Length >= 80 ? TrimTo(text, 500) : null;
    }

    private static string? ExtractMetaContent(string html, params string[] keys)
    {
        foreach (Match match in Regex.Matches(html, @"<meta\b[^>]*>", RegexOptions.IgnoreCase | RegexOptions.Singleline))
        {
            var tag = match.Value;
            var name = GetAttribute(tag, "name") ?? GetAttribute(tag, "property") ?? GetAttribute(tag, "itemprop");
            if (string.IsNullOrWhiteSpace(name) || !keys.Any(key => string.Equals(key, name, StringComparison.OrdinalIgnoreCase)))
            {
                continue;
            }

            var content = GetAttribute(tag, "content");
            if (!string.IsNullOrWhiteSpace(content))
            {
                return CleanText(content);
            }
        }

        return null;
    }

    private static string? GetAttribute(string tag, string attribute)
    {
        var match = Regex.Match(tag, $@"\b{Regex.Escape(attribute)}\s*=\s*[""'](?<value>.*?)[""']", RegexOptions.IgnoreCase | RegexOptions.Singleline);
        return match.Success ? WebUtility.HtmlDecode(match.Groups["value"].Value) : null;
    }

    private static string CleanText(string value)
    {
        var decoded = WebUtility.HtmlDecode(value);
        var withoutTags = Regex.Replace(decoded, "<[^>]+>", " ");
        return Regex.Replace(withoutTags, @"\s+", " ").Trim();
    }

    private static bool LooksLikeBoilerplate(string value)
    {
        return value.Contains("cookie", StringComparison.OrdinalIgnoreCase)
            || value.Contains("privacy", StringComparison.OrdinalIgnoreCase)
            || value.Contains("javascript", StringComparison.OrdinalIgnoreCase)
            || value.Contains("subscribe", StringComparison.OrdinalIgnoreCase);
    }

    private static string NormalizeDate(string value)
    {
        var cleaned = CleanText(value);
        return DateTime.TryParse(cleaned, out var parsed)
            ? parsed.ToString("yyyy-MM-dd")
            : TrimTo(cleaned, 80);
    }

    private static string TrimTo(string value, int maxLength)
    {
        var cleaned = CleanText(value);
        return cleaned.Length <= maxLength ? cleaned : $"{cleaned[..maxLength].TrimEnd()}...";
    }

    private static string BuildDateScope(PathogenResearchViewModel model)
    {
        if (model.SearchRecentOnly)
        {
            return "Son güncel gelişmeler için hazırlanmış resmi kaynak taraması.";
        }

        if (model.DateFrom.HasValue || model.DateTo.HasValue)
        {
            var from = model.DateFrom?.ToString("yyyy-MM-dd") ?? "başlangıç belirtilmedi";
            var to = model.DateTo?.ToString("yyyy-MM-dd") ?? "bitiş belirtilmedi";
            return $"Tarih aralığı: {from} - {to}.";
        }

        return "Tarih aralığı belirtilmedi.";
    }

    private static List<PathogenResearchSourceViewModel> GetTrustedSources(string slug)
    {
        var common = new List<PathogenResearchSourceViewModel>
        {
            Source("WHO Disease Outbreak News", "https://www.who.int/emergencies/disease-outbreak-news", "Küresel resmi salgın duyuruları"),
            Source("CDC Outbreaks", "https://www.cdc.gov/outbreaks/", "ABD CDC salgın ve sağlık uyarıları"),
            Source("ECDC Communicable Disease Threats", "https://www.ecdc.europa.eu/en/publications-data/communicable-disease-threats-report", "Avrupa haftalık tehdit raporları"),
            Source("Africa CDC Outbreaks", "https://africacdc.org/disease-outbreak/", "Afrika bölgesi resmi salgın güncellemeleri"),
            Source("PAHO Epidemiological Alerts", "https://www.paho.org/en/epidemiological-alerts-and-updates", "Amerika kıtası epidemiyolojik uyarıları")
        };

        var specific = slug switch
        {
            "hantavirus" => new[]
            {
                Source("CDC Hantavirus", "https://www.cdc.gov/hantavirus/", "Hantavirus teknik bilgi ve güncellemeler"),
                Source("WHO Disease Outbreak News", "https://www.who.int/emergencies/disease-outbreak-news", "Hantavirus için WHO salgın duyuruları")
            },
            "ebola-marburg" => new[]
            {
                Source("WHO Disease Outbreak News", "https://www.who.int/emergencies/disease-outbreak-news", "Ebola/Marburg için WHO salgın duyuruları"),
                Source("WHO Ebola", "https://www.who.int/health-topics/ebola", "Ebola hastalığı resmi bilgi sayfası"),
                Source("WHO Marburg Virus Disease", "https://www.who.int/news-room/fact-sheets/detail/marburg-virus-disease", "Marburg resmi bilgi sayfası"),
                Source("CDC Ebola", "https://www.cdc.gov/ebola/", "CDC Ebola bilgi merkezi"),
                Source("CDC Marburg", "https://www.cdc.gov/marburg/", "CDC Marburg bilgi merkezi"),
                Source("Africa CDC Outbreaks", "https://africacdc.org/disease-outbreak/", "Afrika CDC salgın güncellemeleri")
            },
            "mpox" => new[]
            {
                Source("WHO Mpox", "https://www.who.int/health-topics/mpox", "Mpox resmi bilgi sayfası"),
                Source("WHO Disease Outbreak News", "https://www.who.int/emergencies/disease-outbreak-news", "Mpox için WHO salgın duyuruları"),
                Source("CDC Mpox", "https://www.cdc.gov/mpox/", "CDC Mpox bilgi merkezi"),
                Source("ECDC Mpox", "https://www.ecdc.europa.eu/en/mpox", "ECDC Mpox izleme sayfası")
            },
            "dengue" => new[]
            {
                Source("WHO Dengue", "https://www.who.int/health-topics/dengue-and-severe-dengue", "Dengue resmi bilgi sayfası"),
                Source("CDC Dengue", "https://www.cdc.gov/dengue/", "CDC Dengue bilgi merkezi"),
                Source("PAHO Epidemiological Alerts", "https://www.paho.org/en/epidemiological-alerts-and-updates", "PAHO resmi epidemiyolojik uyarılar"),
                Source("PAHO Dengue", "https://www.paho.org/en/topics/dengue", "PAHO Dengue bölgesel güncellemeleri")
            },
            "measles" => new[]
            {
                Source("WHO Measles", "https://www.who.int/health-topics/measles", "Kızamık resmi bilgi sayfası"),
                Source("CDC Measles", "https://www.cdc.gov/measles/", "CDC Measles bilgi merkezi"),
                Source("ECDC Measles", "https://www.ecdc.europa.eu/en/measles", "ECDC Measles izleme sayfası")
            },
            "avian-influenza" => new[]
            {
                Source("WHO Avian Influenza", "https://www.who.int/health-topics/influenza-avian-and-other-zoonotic", "Avian ve zoonotik influenza resmi bilgi sayfası"),
                Source("CDC Bird Flu", "https://www.cdc.gov/bird-flu/", "CDC kuş gribi bilgi merkezi"),
                Source("ECDC Avian Influenza", "https://www.ecdc.europa.eu/en/avian-influenza", "ECDC avian influenza izleme sayfası")
            },
            "covid-respiratory-viruses" => new[]
            {
                Source("WHO Coronavirus", "https://www.who.int/health-topics/coronavirus", "WHO Coronavirus bilgi sayfası"),
                Source("CDC COVID", "https://www.cdc.gov/covid/", "CDC COVID bilgi merkezi"),
                Source("ECDC Respiratory Viruses", "https://www.ecdc.europa.eu/en/respiratory-viruses", "ECDC solunum yolu virüsleri")
            },
            "unknown-emerging-outbreaks" => new[]
            {
                Source("WHO Emergencies", "https://www.who.int/emergencies", "WHO acil durum ve salgın merkezi"),
                Source("WHO Disease Outbreak News", "https://www.who.int/emergencies/disease-outbreak-news", "Küresel resmi salgın duyuruları"),
                Source("CDC Health Alert Network", "https://emergency.cdc.gov/han/", "CDC sağlık uyarı ağı")
            },
            "official-updates" => new[]
            {
                Source("WHO News", "https://www.who.int/news", "WHO resmi haberleri"),
                Source("CDC Newsroom", "https://www.cdc.gov/media/", "CDC medya ve duyuru merkezi")
            },
            "weekly-risk-brief" => new[]
            {
                Source("ECDC Weekly Threats", "https://www.ecdc.europa.eu/en/publications-data/communicable-disease-threats-report", "Haftalık Avrupa tehdit raporu"),
                Source("WHO Disease Outbreak News", "https://www.who.int/emergencies/disease-outbreak-news", "Küresel resmi salgın duyuruları")
            },
            _ => Array.Empty<PathogenResearchSourceViewModel>()
        };

        return specific.Concat(common)
            .GroupBy(x => x.Url, StringComparer.OrdinalIgnoreCase)
            .Select(x => x.First())
            .ToList();
    }

    private static PathogenResearchSourceViewModel Source(string institution, string url, string note)
    {
        return new PathogenResearchSourceViewModel
        {
            Institution = institution,
            Url = url,
            Note = note
        };
    }
}
