# HantaWorld Ayrintili Calisma Kaydi

Bu dosya proje boyunca yapilan teknik isleri, alinan kararleri, olusturulan dosyalari, canli ortama hazirlik adimlarini ve kalan isleri tek yerde toplamak icin tutulur. Bu surum ozet degil; kronolojik ve operasyonel ayrinti amaciyla genisletilmistir.

## 1. Proje Baglami

- Proje adi: HantaWorld
- Frontend mimarisi: Next.js 16 App Router, statik MVP
- Backend mimarisi: ASP.NET Core 8 MVC/Admin + Web API
- Veritabani: MSSQL
- Frontend hosting: Vercel
- Backend hosting: Inetmar / Plesk / Windows / IIS
- Backend domain: `hantaapi.sinavio.com.tr`
- Veritabani adi: `hantaworld`
- Veritabani host: `localhost`
- Genel mimari:
  - Vercel frontend
  - ASP.NET Core 8 backend
  - Backend uzerinden MSSQL erisimi

## 2. Bu Calisma Surecinin Ana Hedefleri

Bu oturumlarda asagidaki buyuk is kalemleri tamamlandi:

1. Mevcut Next.js projesini incelemek
2. Hazirlanan rapor ile gercek kod tabanini karsilastirmak
3. Frontend ve icerik uyumsuzluklarini duzeltmek
4. MSSQL veritabani semasini tasarlamak
5. ASP.NET Core 8 uyumlulugunu test etmek
6. Gercek backend admin/API scaffold'ini olusturmak
7. Guvenli deploy ve Plesk yayin akisini hazirlamak
8. Gecici schema runner eklemek
9. Ilk superadmin olusturma icin alternatif guvenli mekanizmalar eklemek
10. SQL seed araci ve seed endpoint'i eklemek

## 3. Frontend Inceleme ve Uygulanan Duzeltmeler

### 3.1 Inceleme Sonucu Genel Durum

Mevcut frontend yapisi raporun ana omurgasiyla buyuk olcude uyumluydu:

- Next.js 16.2.5 App Router kullaniyor
- Veri kaynagi buyuk oranda `data/*.json`
- Harita, haberler, ulke detay, metodoloji ve legal sayfalari mevcut
- Leaflet tabanli outbreak map yaklasimi korunmus

Ancak rapor ile repo arasinda bazi somut uyumsuzluklar vardi.

### 3.2 Duzeltilen Frontend Uyumsuzluklari

Asagidaki noktalar duzeltildi:

- Kirik ic linkler giderildi
- `/country/[slug]` rota kullanimlari dogru hale getirildi
- Footer ve navbar icindeki mevcut olmayan route referanslari temizlendi
- Haber detay sayfalarinda placeholder icerik yerine gercek `article.content` render akisi duzeltildi
- Metadata ve sitemap tarafindaki uyumsuz referanslar duzeltildi
- Karakter bozulmalari temizlendi
- "verified-only / zero-fake-data" anlatimi ile UI icerikleri daha tutarli hale getirildi
- Veri dogrulama tarihiyle celisen bugun tarihi benzeri kullanimlar temizlendi

### 3.3 Frontend Incelemede Not Edilen Teknik Bulgular

Asagidaki bulgular rapora not dusuldu:

- `package.json` raporda anlatilandan daha genis bagimliliklar iceriyordu
- Kullanilmayan veya raporda gecmeyen kutuphane bagimliliklari mevcuttu
- Bazi yerlerde tarih sunumu veri tarihinden degil guncel tarihten uretiliyordu
- Haber detay icerigi ve rota duzeni raporla birebir uyusmuyordu

## 4. Veritabani Fazina Gecis Icin Hazirlanan Temel Belgeler

Asagidaki dosyalar olusturuldu:

- `database/01_mssql_schema.sql`
- `docs/aspnet-database-phase-plan.md`

### 4.1 `database/01_mssql_schema.sql`

Bu dosyada asagidaki tablolar ve iliskiler tanimlandi:

- `countries`
- `sources`
- `admin_users`
- `outbreaks`
- `articles`
- `outbreak_sources`
- `article_sources`
- `article_tags`
- `audit_logs`

Bu semada ozellikle su alanlar garanti altina alindi:

- `source_url`
- `publication_date`
- `last_verified_date`
- `verification_notes`
- `confidence_score`
- `publication_status`
- `verification_status`

### 4.2 `docs/aspnet-database-phase-plan.md`

Bu dokumanda asagidaki maddeler planlandi:

- ASP.NET Core 8 tabanli backend mimarisi
- Admin panel modulleri
- Public API endpointleri
- MSSQL baglanti yaklasimi
- Guvenlik kurallari
- Audit log stratejisi

## 5. ASP.NET Core 8 Uyumluluk Testi

Inetmar/Plesk tarafinda .NET 8 runtime uyumunu gormek icin minimal bir test uygulamasi olusturuldu.

### 5.1 Test Projesi

- Proje: `backend/HantaWorld.HealthCheck`
- Endpoint: `GET /health`
- Beklenen JSON:

```json
{"status":"ok","runtime":".NET 8","app":"HantaWorld API"}
```

### 5.2 Sonuc

Bu test uygulamasi publish edildi ve daha sonra canli ortamda calistigi dogrulandi. Bu sonuc sayesinde ASP.NET Framework 4.7.2 fallback ihtiyaci ortadan kalkti ve ASP.NET Core 8 mimarisi ile devam edildi.

## 6. Gercek Backend Projesinin Kurulmasi

Health-check onayindan sonra gercek backend scaffold edildi.

### 6.1 Cozum ve Proje

- Cozum: `backend/HantaWorld.AdminApi.sln`
- Proje: `backend/HantaWorld.AdminApi`

### 6.2 NuGet ve Proje Yapilandirmasi

Projeye su bagimliliklar eklendi:

- `Microsoft.EntityFrameworkCore.SqlServer`
- `Microsoft.EntityFrameworkCore.Design`

Proje ozellikleri:

- `net8.0`
- IIS/Plesk icin `InProcess` hosting modeli
- SQL script dosyalarinin publish ciktisina kopyalanmasi

### 6.3 Baslica Backend Dosyalari

Olusturulan veya anlamli sekilde degistirilen ana dosyalar:

- `backend/HantaWorld.AdminApi/Program.cs`
- `backend/HantaWorld.AdminApi/appsettings.json`
- `backend/HantaWorld.AdminApi/web.config`
- `backend/HantaWorld.AdminApi/Data/ApplicationDbContext.cs`
- `backend/HantaWorld.AdminApi/Data/DesignTimeDbContextFactory.cs`
- `backend/HantaWorld.AdminApi/Domain/Entities.cs`
- `backend/HantaWorld.AdminApi/Services/AdminAuthService.cs`
- `backend/HantaWorld.AdminApi/Services/AuditLogService.cs`
- `backend/HantaWorld.AdminApi/Services/SchemaInitializer.cs`
- `backend/HantaWorld.AdminApi/Services/FirstAdminBootstrapService.cs`
- `backend/HantaWorld.AdminApi/Models/AdminViewModels.cs`
- `backend/HantaWorld.AdminApi/Models/PublicApiDtos.cs`
- `backend/HantaWorld.AdminApi/Models/SetupViewModels.cs`

### 6.4 Controller Katmani

Olusturulan controller'lar:

- `HomeController`
- `HealthController`
- `AuthController`
- `AdminDashboardController`
- `AdminCountriesController`
- `AdminSourcesController`
- `AdminOutbreaksController`
- `AdminArticlesController`
- `Api/CountriesController`
- `Api/SourcesController`
- `Api/OutbreaksController`
- `Api/NewsController`
- `Api/GlobalStatsController`
- `SetupController`

### 6.5 View Katmani

Admin arayuzu icin Razor view'lar eklendi:

- Login sayfasi
- Dashboard
- Countries index/create/edit
- Sources index/create/edit
- Outbreaks index/create/edit
- Articles index/create/edit
- Shared layout

## 7. Domain Model ve Tablo Esleme Ayrintilari

Backend icinde asagidaki ana entity'ler tanimlandi:

- `Country`
- `Source`
- `AdminUser`
- `Outbreak`
- `Article`
- `OutbreakSource`
- `ArticleSource`
- `ArticleTag`
- `AuditLog`

### 7.1 `AdminUser`

`admin_users` tablosuna map edilen alanlar:

- `email`
- `full_name`
- `password_hash`
- `password_algorithm`
- `role_name`
- `is_active`
- `last_login_at`
- `failed_login_count`
- `lockout_until`

### 7.2 Public Data Guvencesi

Public endpoint sorgularinda asagidaki kurallar uygulandi:

- Sadece `publication_status = published`
- Sadece `verification_status = verified`

Bu sayede frontend, draft veya dogrulanmamis veriyi gormez.

## 8. Kimlik Dogrulama ve Guvenlik Tasarimi

### 8.1 Kimlik Dogrulama

Kullanilan yapi:

- Cookie tabanli authentication
- Login path: `/admin/login`
- Access denied path: `/admin/login`
- Secure cookie
- Sliding expiration
- 8 saatlik oturum omru

### 8.2 Yetkilendirme

Politikalar:

- `RequireAdmin`
- `RequireEditor`

Roller:

- `superadmin`
- `admin`
- `editor`

### 8.3 Parola Guvenligi

Parolalar:

- duz metin saklanmaz
- `ASP.NET Core Identity PasswordHasher` ile hashlenir
- login sirasinda `VerifyHashedPassword` ile dogrulanir

### 8.4 Login Koruma Mantigi

Asagidaki kontroller eklendi:

- inactive kullanici engeli
- gecici lockout destegi
- basarisiz giris sayaci
- 5 yanlis denemede 15 dakika lockout
- `SuccessRehashNeeded` durumunda parola hash yenileme

### 8.5 Audit Log

Kritik islemler icin audit altyapisi eklendi:

- actor user id
- action type
- entity name
- entity id
- request path
- http method
- ip address
- user agent
- old values
- new values

## 9. Startup ve Konfig Kararlari

### 9.1 `Program.cs`

`Program.cs` icinde su ana sorumluluklar kuruldu:

- MVC + Views kaydi
- Output cache
- SQL Server DbContext
- Cookie auth
- Authorization policies
- Servis kayitlari
- Controlled schema init
- Controlled bootstrap servisleri

### 9.2 `appsettings.json`

Canli operasyon acisindan kritik ayarlar:

- `ConnectionStrings:DefaultConnection`
- `DatabaseSettings:RunSchemaOnStartup`
- `Setup:*`
- `BootstrapAdmin:*`

### 9.3 Onemli Mimari Karar

Asagidaki karar net olarak alindi:

- `RunSchemaOnStartup = false`

Anlami:

- canli uygulama her acilista veritabani tablosu olusturmaz
- schema degisikligi startup'ta otomatik yurutulmez
- operasyonel kontrol manuel olarak kalir

## 10. Runtime Sorunu ve Cozulen Problem

Publish sonrasi uygulama yerelde hemen kapaniyordu. Sorun direkt uygulama kodundan degil, Windows `EventLog` logger yetki davranisindan cikti.

### 10.1 Tespit Edilen Hata

Temel hata:

- Windows EventLog yazma izni yok
- bu nedenle host startup sirasinda exception olusuyordu

### 10.2 Uygulanan Cozum

`Program.cs` icinde:

- `builder.Logging.ClearProviders()`
- `builder.Logging.AddConsole()`
- `builder.Logging.AddDebug()`

eklendi.

### 10.3 Sonuc

Bu degisiklikten sonra:

- uygulama publish ciktisindan saglikli kalkti
- `/health` endpoint'i beklenen JSON'u dondu

## 11. Build, Publish ve Yerel Dogrulama

Backend icin birden fazla kez asagidaki komutlar basariyla calistirildi:

```powershell
dotnet build backend\HantaWorld.AdminApi\HantaWorld.AdminApi.csproj
dotnet publish backend\HantaWorld.AdminApi\HantaWorld.AdminApi.csproj -c Release -o backend\publish\HantaWorld.AdminApi
```

Seed tool icin de:

```powershell
dotnet build backend\HantaWorld.AdminSeedTool\HantaWorld.AdminSeedTool.csproj
```

### 11.1 Yerel Runtime Testleri

Publish ciktisindan local testler yapildi:

- `GET /health` basarili
- setup endpoint'leri key tanimsizsa dogru sekilde reddediyor

Beklenen korumali yanit ornekleri:

```json
{"success":false,"error":"setup_key_not_configured"}
```

```json
{"success":false,"error":"first_admin_bootstrap_key_not_configured"}
```

```json
{"success":false,"error":"first_admin_seed_runner_key_not_configured"}
```

## 12. Plesk / Canli Deploy Hazirligi

### 12.1 Hazir Publish Klasoru

- `backend/publish/HantaWorld.AdminApi`

### 12.2 Sunucuya Yuklenecek Icerik

Plesk yayin dizinine klasorun kendisi degil, icindeki tum dosyalar yuklenir:

- `HantaWorld.AdminApi.dll`
- `HantaWorld.AdminApi.exe`
- `HantaWorld.AdminApi.deps.json`
- `HantaWorld.AdminApi.runtimeconfig.json`
- `web.config`
- `appsettings.json`
- `wwwroot/`
- `runtimes/`
- `DatabaseScripts/`
- diger .dll bagimliliklari

### 12.3 Baglanti Gizliligi

Asagidaki bilgiler asla koda veya repoya yazilmamali:

- gercek MSSQL parolasi
- gecici setup key'leri
- bootstrap key'leri
- first admin seed key'i

Parola yalnizca sunucuya yuklenmeden hemen once `publish` icindeki `appsettings.json` dosyasinda ayarlanir.

## 13. Gecici Schema Runner

Plesk SQL import araci kullanisli olmadigi icin backend icine gecici schema runner eklendi.

### 13.1 Endpoint

- `GET /setup/run-schema?key=TEMP_SETUP_KEY`

### 13.2 Davranis

- `DatabaseScripts/01_mssql_schema.sql` okunur
- `GO` batch'leri parcalanir
- MSSQL uzerinde tek tek calistirilir
- startup'ta otomatik calismaz
- key ile korunur
- JSON success/failure doner

### 13.3 Konfig

- `Setup:EnableSchemaRunner`
- `Setup:SchemaRunnerKey`

### 13.4 Kapatma Politikasi

Schema basariyla kurulduktan sonra:

- ya `EnableSchemaRunner = false` yapilacak
- ya da endpoint tamamen kaldirilacak

## 14. Ilk Superadmin Bootstrap Endpoint'i

Admin tablosu bos oldugu icin once request body ile admin olusturan guvenli bir bootstrap endpoint eklendi.

### 14.1 Endpoint

- `POST /setup/bootstrap-first-admin?key=TEMP_BOOTSTRAP_KEY`

### 14.2 Beklenen Body

```json
{
  "email": "admin@example.com",
  "fullName": "Platform Admin",
  "password": "StrongPassword123!"
}
```

### 14.3 Guvenlik Kurallari

- yalnizca `EnableFirstAdminBootstrap = true` ise calisir
- yalnizca key dogruysa calisir
- `admin_users` tablosu bos degilse tekrar calismaz
- parola sadece request body'de gelir
- parola duz metin saklanmaz
- parola hashlenerek kaydedilir
- rol otomatik `superadmin` olur

### 14.4 Durum

Canli kullanimda endpoint 403 verdigi icin manuel request debug surecine daha fazla zaman harcamama karari alindi ve alternatif yaklasima gecildi.

## 15. SQL Seed Tabanli Ilk Admin Yaklasimi

Bootstrap endpoint yerine daha operasyonel bir yol hazirlandi:

- lokal ortamda hash uret
- tek kullanimlik SQL seed dosyasi yaz
- backend icinden bu SQL dosyasini gecici endpoint ile calistir

### 15.1 Seed Tool

Olusturulan arac:

- `backend/HantaWorld.AdminSeedTool`

Dosyalar:

- `backend/HantaWorld.AdminSeedTool/HantaWorld.AdminSeedTool.csproj`
- `backend/HantaWorld.AdminSeedTool/Program.cs`

### 15.2 Seed Tool'un Gorevi

- e-posta alir
- ad soyad alir
- parolayi gizli prompt ile iki kez alir
- `PasswordHasher` ile uyumlu hash uretir
- SQL `INSERT` scripti yazar
- duz metin parolayi dosyaya yazmaz

### 15.3 Seed Tool Komutu

```powershell
dotnet run --project backend/HantaWorld.AdminSeedTool -- --email admin@example.com --full-name "Platform Admin" --output database\02_seed_first_admin.sql
```

### 15.4 Seed SQL Dosyasi

- `database/02_seed_first_admin.sql`

Icerik ozellikleri:

- `admin_users` tablosunda mevcut kullanici varsa insert durur
- `email`
- `full_name`
- `password_hash`
- `password_algorithm = ASP.NET Identity PBKDF2`
- `role_name = superadmin`
- `is_active = 1`

### 15.5 Teknik Not

Ilk durumda bu dosya yer tutucu olarak repo'ya eklendi. Gercek hash bu dosyanin uzerine seed tool calistirildiginda yazilacak.

## 16. Seed SQL Calistirma Endpoint'i

Plesk tarafinda kullanisli SQL editor olmadigi icin `02_seed_first_admin.sql` dosyasini backend icinden calistiracak gecici endpoint eklendi.

### 16.1 Endpoint

- `GET /setup/seed-first-admin?key=TEMP_KEY`

### 16.2 Davranis

- `DatabaseScripts/02_seed_first_admin.sql` okunur
- MSSQL veritabaninda calistirilir
- startup'ta otomatik calismaz
- key ile korunur
- success/failure JSON doner

### 16.3 Konfig

- `Setup:EnableFirstAdminSeedRunner`
- `Setup:FirstAdminSeedRunnerKey`

### 16.4 Publish Stratejisi

`backend/HantaWorld.AdminApi.csproj` ayarinda `database/*.sql` dosyalari `DatabaseScripts/` altina publish'e kopyalanacak sekilde genisletme yapildi.

Bu sayede:

- `01_mssql_schema.sql`
- `02_seed_first_admin.sql`

canli paketin icinde yer alir.

## 17. Canlida Bilinen Calisan Parcalar

Kullanici tarafindan dogrulanmis canli durumlar:

- backend ayaga kalkiyor
- MSSQL schema calisiyor
- admin login sayfasi aciliyor

Bu da su noktalarin canlida calistigini gostermis oldu:

- IIS / Plesk publish modeli
- MSSQL baglantisi
- ASP.NET Core 8 runtime
- Razor Pages / MVC response cikisi

## 18. Dosya ve Moduller Bazinda Yapilan Baslica Degisiklikler

### 18.1 Veritabani ve Dokuman

- `database/01_mssql_schema.sql`
- `database/02_seed_first_admin.sql`
- `docs/aspnet-database-phase-plan.md`
- `hantaworld.md`

### 18.2 Backend Ana Yapi

- `backend/HantaWorld.AdminApi/Program.cs`
- `backend/HantaWorld.AdminApi/appsettings.json`
- `backend/HantaWorld.AdminApi/web.config`
- `backend/HantaWorld.AdminApi/HantaWorld.AdminApi.csproj`

### 18.3 Backend Veri ve Servis Katmani

- `Data/ApplicationDbContext.cs`
- `Data/DesignTimeDbContextFactory.cs`
- `Domain/Entities.cs`
- `Services/AdminAuthService.cs`
- `Services/AuditLogService.cs`
- `Services/SchemaInitializer.cs`
- `Services/FirstAdminBootstrapService.cs`

### 18.4 Backend Setup ve Yardimci Moduller

- `Controllers/SetupController.cs`
- `Models/SetupViewModels.cs`
- `backend/HantaWorld.AdminSeedTool/*`

### 18.5 Admin UI

- `Views/Auth/Login.cshtml`
- `Views/AdminDashboard/*`
- `Views/AdminCountries/*`
- `Views/AdminSources/*`
- `Views/AdminOutbreaks/*`
- `Views/AdminArticles/*`
- `Views/Shared/_Layout.cshtml`

## 19. Guvenlik Acisindan Bilerek Gecici Birakilan Mekanizmalar

Asagidaki yapi ve endpoint'ler kalici degil, operasyon tamamlandiginda kaldirilacak veya kapatilacak:

- `/setup/run-schema`
- `/setup/bootstrap-first-admin`
- `/setup/seed-first-admin`

Asagidaki key'ler canli ortamda guclu, tek kullanimlik ve gecici tutulacak:

- `SchemaRunnerKey`
- `FirstAdminBootstrapKey`
- `FirstAdminSeedRunnerKey`

## 20. Onerilen Operasyon Sirasi

Canli ilk admin olusturma icin onerilen siralama:

1. Lokal ortamda `HantaWorld.AdminSeedTool` ile gercek `02_seed_first_admin.sql` uret
2. `appsettings.json` icine gecici `FirstAdminSeedRunnerKey` gir
3. Guncel publish paketini tekrar Plesk'e yukle
4. `GET /setup/seed-first-admin?key=...` endpoint'ini bir kez cagir
5. `/admin/login` ile giris yap
6. `EnableFirstAdminSeedRunner = false` yap
7. Mumkunse seed endpoint kodunu tamamen kaldir

## 21. Kalan Isler

Bu kaydin alindigi an itibariyla kalan mantikli isler:

- Gercek first-admin seed dosyasini uretmek
- Seed endpoint'i canlida bir kez calistirmak
- Ilk superadmin ile `/admin/login` dogrulamasi yapmak
- Gecici setup endpoint'lerini kapatmak
- Frontend'i JSON API endpointlerine baglamak
- Istenirse kullanilmayan frontend bagimliliklarini temizlemek
- Istenirse audit log ekranini admin UI icine eklemek

## 22. Son Durum Ozeti

Mevcut durumda proje sadece plan veya prototip asamasinda degil; calisan bir backend iskeleti, canliya yayinlanabilir publish paketi, MSSQL semasi, admin login altyapisi, public API'ler ve operasyonel kurulum endpoint'leri ile somut olarak ilerletilmis durumdadir.

Ozellikle tamamlanmis kritik alanlar:

- Next.js proje incelemesi
- rapor ile kod tabani uyumsuzluk tespiti
- frontend duzeltmeleri
- MSSQL schema tasarimi
- ASP.NET Core 8 uyumluluk dogrulamasi
- gercek backend scaffold
- public API katmani
- admin CRUD iskeleti
- login ve auth
- audit log altyapisi
- schema runner
- first admin bootstrap alternatifleri
- SQL seed araci
- seed SQL execution endpoint'i
- publish paketi

Bu dosya yeni adimlar oldukca guncellenmeye devam edilmelidir.
