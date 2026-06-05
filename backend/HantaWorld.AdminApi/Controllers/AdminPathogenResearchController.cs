using HantaWorld.AdminApi.Data;
using HantaWorld.AdminApi.Domain;
using HantaWorld.AdminApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace HantaWorld.AdminApi.Controllers;

[Authorize(Policy = "RequireEditor")]
public class AdminPathogenResearchController(ApplicationDbContext dbContext) : Controller
{
    [HttpGet("/admin/pathogen-research")]
    public async Task<IActionResult> Index()
    {
        return View(new PathogenResearchViewModel
        {
            AvailablePathogens = await GetPathogenSelectListAsync(null)
        });
    }

    [HttpPost("/admin/pathogen-research")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Index(PathogenResearchViewModel model)
    {
        var pathogen = string.IsNullOrWhiteSpace(model.SelectedPathogenSlug)
            ? null
            : await dbContext.Pathogens
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.IsActive && x.Slug == model.SelectedPathogenSlug);

        if (pathogen is null)
        {
            ModelState.AddModelError(nameof(model.SelectedPathogenSlug), "Seçilen virüs/kategori bulunamadı.");
        }

        model.AvailablePathogens = await GetPathogenSelectListAsync(pathogen?.Slug ?? model.SelectedPathogenSlug);

        if (!ModelState.IsValid || pathogen is null)
        {
            return View(model);
        }

        model.SelectedPathogenDisplayName = pathogen.DisplayName;
        model.Output = BuildOutput(pathogen, model);
        return View(model);
    }

    private async Task<List<SelectListItem>> GetPathogenSelectListAsync(string? selectedSlug)
    {
        var items = await dbContext.Pathogens
            .AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.DisplayName)
            .Select(x => new SelectListItem(x.DisplayName, x.Slug, x.Slug == selectedSlug))
            .ToListAsync();

        items.Insert(0, new SelectListItem("Virüs / kategori seç", string.Empty, string.IsNullOrWhiteSpace(selectedSlug)));
        return items;
    }

    private static PathogenResearchOutputViewModel BuildOutput(Pathogen pathogen, PathogenResearchViewModel model)
    {
        var sources = GetTrustedSources(pathogen.Slug);
        var sourceInstitutions = string.Join(" / ", sources.Select(x => x.Institution).Distinct());
        var primarySource = sources.FirstOrDefault();
        var dateScope = BuildDateScope(model);

        var statisticsText = string.Join(Environment.NewLine, new[]
        {
            $"Virüs / Kategori: {pathogen.DisplayName}",
            "Vaka Sayısı: Güncel ve doğrulanmış numerik veri bulunamadı.",
            "Ölüm Sayısı: Güncel ve doğrulanmış numerik veri bulunamadı.",
            "Etkilenen Ülke: Güncel ve doğrulanmış numerik veri bulunamadı.",
            "Aktif Salgın: Güncel ve doğrulanmış numerik veri bulunamadı.",
            $"Kaynak Kurum: {sourceInstitutions}",
            $"Kaynak Linki: {primarySource?.Url ?? "-"}",
            "Resmi Yayın Tarihi: Kaynak linkinden kontrol et.",
            $"Son Doğrulama Tarihi: {DateOnly.FromDateTime(DateTime.UtcNow):yyyy-MM-dd}",
            $"Notlar: {dateScope} Resmi kaynakları kontrol etmeden sayısal veri yayınlama. Tarih eski olabilir, admin kontrolü gerekli."
        });

        var reportText = string.Join(Environment.NewLine, new[]
        {
            $"Rapor Başlığı: {pathogen.DisplayName} için kaynak kontrollü güncelleme",
            $"Virüs / Kategori: {pathogen.DisplayName}",
            "Rapor Türü: Salgın Raporu",
            "Kısa Özet: Güncel bir gelişme bulunamadı.",
            $"Detaylı İçerik: {pathogen.DisplayName} için resmi halk sağlığı kaynakları kontrol edilmelidir. Bu ekran canlı veri yayınlamaz; WHO, CDC, ECDC, Africa CDC, PAHO veya ilgili ulusal sağlık bakanlığı kaynaklarından doğrulama yapıldıktan sonra rapor metni elle tamamlanmalıdır.",
            $"Kaynak Kurum: {sourceInstitutions}",
            $"Kaynak Linki: {primarySource?.Url ?? "-"}",
            $"Yayın Tarihi: {DateOnly.FromDateTime(DateTime.UtcNow):yyyy-MM-dd}",
            "Doğrulama Notu: Bu taslak otomatik yayınlanmadı. Kaynak linklerini açıp son doğrulama sonrası Salgın Raporları ekranına elle gir."
        });

        var sourcesText = string.Join(Environment.NewLine, sources.Select(x => $"- {x.Institution}: {x.Url} ({x.Note})"));

        return new PathogenResearchOutputViewModel
        {
            StatisticsText = statisticsText,
            ReportText = reportText,
            SourcesText = sourcesText,
            AdminNote = "Bu çıktı otomatik yayınlanmadı. Kaynakları kontrol ettikten sonra Salgın İstatistikleri veya Salgın Raporları ekranına elle gir.",
            Sources = sources
        };
    }

    private static string BuildDateScope(PathogenResearchViewModel model)
    {
        if (model.SearchRecentOnly)
        {
            return "Son güncel gelişmeler için hazırlanmış kontrol şablonu.";
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
                Source("WHO Health Topics", "https://www.who.int/health-topics", "WHO konu başlıkları üzerinden doğrulama")
            },
            "ebola-marburg" => new[]
            {
                Source("WHO Ebola", "https://www.who.int/health-topics/ebola", "Ebola hastalığı resmi bilgi sayfası"),
                Source("WHO Marburg Virus Disease", "https://www.who.int/news-room/fact-sheets/detail/marburg-virus-disease", "Marburg resmi bilgi sayfası"),
                Source("CDC Ebola", "https://www.cdc.gov/ebola/", "CDC Ebola bilgi merkezi")
            },
            "mpox" => new[]
            {
                Source("WHO Mpox", "https://www.who.int/health-topics/mpox", "Mpox resmi bilgi sayfası"),
                Source("CDC Mpox", "https://www.cdc.gov/mpox/", "CDC Mpox bilgi merkezi"),
                Source("ECDC Mpox", "https://www.ecdc.europa.eu/en/mpox", "ECDC Mpox izleme sayfası")
            },
            "dengue" => new[]
            {
                Source("WHO Dengue", "https://www.who.int/health-topics/dengue-and-severe-dengue", "Dengue resmi bilgi sayfası"),
                Source("CDC Dengue", "https://www.cdc.gov/dengue/", "CDC Dengue bilgi merkezi"),
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
