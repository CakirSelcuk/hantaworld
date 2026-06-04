# HantaWorld Ayrintili Calisma Kaydi

Bu dosya proje boyunca yapilan teknik isleri, alinan kararleri, olusturulan dosyalari, canli ortama hazirlik adimlarini ve kalan isleri tek yerde toplamak icin tutulur. Bu surum ozet degil; kronolojik ve operasyonel ayrinti amaciyla genisletilmistir.

## Calisma Kurallari

- Kullanici acikca `push et` veya benzeri bir onay vermeden GitHub'a push yapilmayacak.
- Backend dosyalari FileZilla/Plesk ile manuel yuklenir; backend publish, bin, obj ve database dosyalari frontend commitlerine karistirilmayacak.
- Yapilan her anlamli guncelleme, karar, hata nedeni, cozum ve canliya alma notu `hantaworld.md` dosyasina kaydedilecek.
- `hantaworld.md` proje hafizasi olarak kullanilacak; yeni faza gecmeden once ilgili son durum bu dosyaya islenecek.
- `hantaworld.md` kullanici acikca istemedikce GitHub commit/push islemlerine dahil edilmeyecek.

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

## 23. Operasyon Kurali: Git Push Onayi

Tarih: 2026-05-11

- Kullanici acikca `push et` demeden `git push` calistirilmayacak.
- Push istegi yoksa calisma sadece lokal degisiklik, analiz, test/build ve durum raporu ile sinirli kalacak.
- Commit veya stage islemi gerekiyorsa yalnizca kullanicinin istedigi kapsam alinacak.
- Backend `bin/`, `obj/`, publish ciktisi ve benzeri unrelated dosyalar stage/commit edilmeyecek.
- Bu kural kullanici tarafindan acikca degistirilene kadar gecerlidir.

## 24. Frontend API Entegrasyonu ve JSON Fallback Kaydi

Tarih: 2026-05-11

Tamamlanan isler:

- Frontend, local mock JSON yerine production ASP.NET API endpointlerini okuyacak sekilde guncellendi.
- Kullanilan endpointler:
  - `/api/outbreaks`
  - `/api/countries`
  - `/api/news`
  - `/api/sources`
  - `/api/global-stats`
- API base URL icin environment override desteklendi:
  - `HANTAWORLD_API_BASE_URL`
  - `NEXT_PUBLIC_HANTAWORLD_API_BASE_URL`
- Varsayilan production API adresi:
  - `https://hantaapi.sinavio.com.tr`
- SEO uyumlu sunucu tarafi render davranisi korunarak ilgili sayfalar dynamic/no-store veri akisina alindi.
- Loading ve empty state davranislari eklendi.
- Admin panelde published + verified veri girildiginde public site bu verileri API'den okuyacak.

Yapilan commit ve push kaydi:

- `55e8032 Connect frontend to live API`
- Bu commit kullanicinin acik push talimati sonrasinda `master -> origin/master` olarak push edildi.

Ek fallback mudalesi:

- Production API bos veri dondurdugu icin ana sayfa rakamlari, harita ve haberler bos gorunuyordu.
- `lib/data.ts` icinde live API verisi varsa API, API bos ise daha once elle girilen JSON verileri kullanilacak sekilde fallback davranisi eklendi.
- Countries icin live API ulkeleri ile JSON fallback ulkeleri birlestirildi.
- Boylece admin panelde henuz veri yokken:
  - ana sayfa rakamlari bos kalmaz,
  - `/map` isaretleri gorunur,
  - `/news` guncel haberleri gosterir,
  - `/country/[slug]` JSON fallback ulke/outbreak detaylarini okuyabilir.

Fallback JSON icindeki guncel veri ozeti:

- Fransa: 1
- Ispanya: 1
- Israil: 1
- ABD: 3
- Arjantin: 1
- Tristan da Cunha: 1
- Toplam reported cases: 8
- Toplam deaths: 3
- Ana haber: `Andes Hantavirus Outbreak: Global Situation Update (May 2026)`
- Haber tarihi: 2026-05-11

Yapilan fallback commit ve push kaydi:

- `62e7695 Use JSON fallback when live API is empty`
- Bu commit kullanicinin onceki push talimati kapsaminda `master -> origin/master` olarak push edildi.

Kontrol kaydi:

- `npm run lint` basarili.
- `npm run build` basarili.
- Lokal kontrolde `/`, `/map`, `/news` HTTP 200 dondu.
- Harita HTML ciktisinda fallback ulke verisi bulundu.
- Haber sayfasinda Andes outbreak haberi bulundu.

Mevcut dikkat notu:

- Local git durumunda backend `obj` altindaki dosyalar unrelated modified olarak kalabilir.
- Bu dosyalar frontend isi kapsaminda stage/commit edilmeyecek.
- Bundan sonraki hicbir push, kullanici acikca `push et` demeden yapilmayacak.

## 25. Admin Panel - Data Source Numeric Lokal Gelistirme

Tarih: 2026-05-11

Kullanici talimati:

- Bu adim sadece lokal gelistirme icindir.
- Kullanici acikca `push et` veya `canliya al` demeden canliya alma/push yapilmayacak.
- Ilk panel adimi, ana sayfadaki sayisal kart alanini panelden yonetilebilir hale getirmektir.

Yapilan lokal degisiklikler:

- Admin panel menusu ve dashboard icine `Data Source Numeric` linki eklendi.
- Yeni admin route eklendi:
  - `/admin/data-source-numeric`
- Bu ekranda ana sayfadaki dort numeric kart icin su alanlar duzenlenebilir:
  - kart anahtari
  - baslik
  - rakam
  - sira
  - aktif/pasif durumu
- Backend entity eklendi:
  - `DataSourceNumeric`
- EF DbContext mapping eklendi:
  - `data_source_numeric`
- Public API `/api/global-stats` geriye donuk uyumluluk korunarak genisletildi:
  - Eski toplam alanlari aynen durur.
  - Panelde aktif numeric kart varsa `numericCards` olarak doner.
- Frontend ana sayfa numeric kartlari `numericCards` geldiyse panel verisini kullanir.
- `numericCards` yoksa eski hesaplanan/fallback kart davranisi korunur.

Database notu:

- Ana schema dosyasina `data_source_numeric` tablosu eklendi.
- Var olan veritabani icin idempotent script eklendi:
  - `database/03_data_source_numeric.sql`

Kontrol kaydi:

- `npm run lint` basarili.
- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj` basarili.
- `npm run build` ilk denemede TypeScript type guard hatasi verdi.
- Type guard duzeltildi.
- `npm run build` ikinci denemede basarili tamamlandi.
- Lokal backend health kontrolu `http://127.0.0.1:5123/health` icin basarili cevap verdi.
- Codex sandbox kullanicisinda `/admin/login` sayfasi DataProtection/antiforgery kaynakli 500 davranisi verdi; normal Windows kullanicisi/Visual Studio veya uygun DataProtection key klasoru ile tekrar kontrol edilmeli.

Dikkat:

- Build islemi backend `bin/` ve `obj/` altinda derleme ciktisi degisiklikleri uretti.
- Bu derleme ciktisi dosyalari stage/commit edilmeyecek.
- Bu adimda push yapilmadi.

## 26. DB Karari ve Lokal/Canli Ayrimi

Tarih: 2026-05-11

Kullanici ile netlestirilen kararlar:

- Simdilik canliya kod alinmayacak.
- `git push`, deploy veya canli frontend/backend yayin islemi yapilmayacak.
- Canli DB konusu en sona birakilacak.
- Data Source Numeric panel ekrani icin DB tarafinda yeni tablo gerektigi biliniyor.
- Gerekli tablo:
  - `data_source_numeric`
- Bu tablo icin hazirlanan script:
  - `database/03_data_source_numeric.sql`
- Script canli DB'de ileride ayrica calistirilacak.
- Su an bu script canli DB'de calistirilmadi.

DB notu:

- Projedeki ana schema dosyasi:
  - `database/01_mssql_schema.sql`
- Mevcut canli DB'de tum tablo olusturma islemi daha once bu ana schema yaklasimi ile yapildi.
- Yeni ihtiyac icin tum schema tekrar calistirilmamali.
- Sadece eksik yeni tablo icin idempotent `03_data_source_numeric.sql` tercih edilmeli.

Guvenlik notu:

- Kullanici canli MSSQL connection string ornegini paylasti.
- Bu bilgi canli veritabanina isaret ettigi icin dikkatli kullanilmali.
- Local admin panel canli DB connection string ile acilirsa, panelde yapilan kayitlar push/deploy olmadan da canli DB'yi etkileyebilir.
- Bu nedenle DB mudalesi ayrica kullanici onayi olmadan yapilmayacak.

Hafiza kurali:

- `hantaworld.md` proje hafizasi olarak kullanilacak.
- Onemli kararlar, ilerleme notlari, test sonuclari ve dikkat edilmesi gereken riskler bu dosyaya islenecek.
- Kullanici ozellikle hatirlatti: "hantaworld.md bizim hafizamiz olacak."

## 27. Admin Panel - Map Lokal Gelistirme

Tarih: 2026-05-11

Kullanici talimati:

- Sıradaki panel alani `Map`.
- Hem ana sayfadaki harita hem de `/map` sayfasi ayni panel verisiyle yonetilecek.
- Haritadaki kirmizi/sari marker noktasina tiklaninca o ulke/marker icin bilgi kutusu acilmali.
- Bu adim da sadece lokal gelistirme; push/deploy/canliya alma yok.

Mevcut teknik durum:

- Public harita zaten `outbreaks` verisinden besleniyor.
- Marker koordinatlari:
  - `Latitude`
  - `Longitude`
- Marker rengi:
  - `Status`
- Marker buyuklugu ve popup sayilari:
  - `ConfirmedCases`
  - `SuspectedCases`
  - `Deaths`
  - `Recovered`
- Tiklaninca cikan popup metni:
  - `Description`
- Dogrulama kutusu:
  - `VerificationNotes`
- Kaynak linki:
  - `PrimarySourceUrl`
- Public sitede gorunmesi icin kayit `published` + `verified` olmali.

Yapilan lokal degisiklikler:

- Admin panel menusu ve dashboard icine `Map` linki eklendi.
- Yeni admin route eklendi:
  - `/admin/map`
  - `/admin/map/create`
  - `/admin/map/{id}/edit`
- Yeni controller eklendi:
  - `AdminMapController`
- Yeni Razor view klasoru eklendi:
  - `Views/AdminMap`
- `Map` paneli yeni bir tablo kullanmiyor.
- Kayitlar mevcut `outbreaks` tablosunda tutuluyor.
- Boylece panelden eklenen/duzenlenen map marker, mevcut API akisi uzerinden hem ana sayfa haritasinda hem `/map` sayfasinda gorunebilir.

Map panelinde yonetilen alanlar:

- Marker ID
- Slug
- Ulke
- Marker basligi
- Kisa ozet
- Haritada tiklaninca gosterilecek bilgi
- Marker durumu
- Seviye
- Dogrulama durumu
- Yayin durumu
- Confirmed / suspected / deaths / recovered rakamlari
- Growth rate
- Latitude / Longitude / Radius km
- Baslangic, yayin tarihi, son dogrulama tarihi
- Kaynak URL
- Kaynak listesi
- Harita dogrulama notu

Kontrol kaydi:

- `npm run lint` basarili.
- `npm run build` basarili.
- Normal `dotnet build` Visual Studio/local API calisirken `HantaWorld.AdminApi.exe` ve DLL dosyalari kilitli oldugu icin cikti klasorune yazamadi.
- Kod hatasini ayirmak icin build ciktisi gecici klasore yonlendirildi:
  - `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -o C:\\tmp\\hantaworld-admin-build-check`
- Gecici cikti klasorune backend build basarili tamamlandi.

Dikkat:

- Visual Studio veya local API acikken normal build dosya kilidi hatasi verebilir.
- Bu kod hatasi degil; calisan process build ciktisini kilitliyor.
- Build/test sonrasi yine push yapilmadi.
- DB'ye yeni tablo eklenmedi; Map alani mevcut `outbreaks` tablosunu kullaniyor.

## 28. Mevcut JSON Iceriginin DB Seed Olarak Korunmasi

Tarih: 2026-05-11

Kullanici talimati:

- Su an sitede gorunen bilgiler kaybedilmeyecek.
- Bu bilgiler DB tarafina da eklenebilir hale getirilecek.
- En sonda tablo/script calistirilirken icerikler de beraber eklensin.
- Su an canli DB'ye baglanilmayacak ve script calistirilmadi.

Yapilan lokal degisiklikler:

- `database/03_data_source_numeric.sql` guncellendi.
- `data_source_numeric` tablosu olusturulduktan sonra mevcut ana sayfa numeric kartlari da seed edilir:
  - Reported Cases = 8
  - Total Deaths = 3
  - Affected Countries = 6
  - Active Outbreaks = 6
- Yeni seed script eklendi:
  - `database/04_seed_current_frontend_content.sql`

`04_seed_current_frontend_content.sql` kapsami:

- Mevcut JSON ulkeleri DB'ye ekler/gunceller:
  - France
  - Spain
  - Israel
  - United States
  - Argentina
  - Tristan da Cunha
- Mevcut JSON kaynaklarini DB'ye ekler/gunceller:
  - WHO
  - WHO DON600
  - CDC
  - ECDC
  - RIVM
  - Spanish Ministry of Health
  - UKHSA
- Mevcut harita marker/outbreak verilerini DB'ye ekler/gunceller:
  - France monitoring signal
  - Spain suspected/testing signal
  - Israel confirmed case
  - United States 3 case-level signals
  - Argentina confirmed/death exposure investigation
  - Tristan da Cunha linked case signal
- Mevcut haberleri DB'ye ekler/gunceller:
  - Andes Hantavirus Outbreak: Global Situation Update (May 2026)
  - WHO Update: MV Hondius Cluster Reaches 8 Reported Cases
  - WHO Disease Outbreak News: Hantavirus - MV Hondius Multi-Country Cluster
- Article source baglantilari ve tag kayitlari da script icinde eklenir.
- `data_source_numeric` tablosu varsa numeric kartlar bu script icinde de guncellenir.

Script davranisi:

- Idempotent tasarlandi.
- Tekrar calistirilirse duplicate olusturmaz.
- Kayitlari `slug`, `public_id` ve tag/source iliskileri uzerinden eslestirir.
- Mevcut kayit varsa gunceller, yoksa ekler.

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -o C:\\tmp\\hantaworld-admin-build-check` basarili.
- Yeni SQL dosyasi build ciktisinda `DatabaseScripts` altina dahil oldu.
- `npm run lint` basarili.

Dikkat:

- Bu scriptler henuz canli DB'de calistirilmadi.
- Canli DB'ye uygulanacak siralama ileride tekrar kontrol edilmeli.
- Onerilen siralama:
  1. DB yedegi al
  2. Gerekirse `03_data_source_numeric.sql` calistir
  3. `04_seed_current_frontend_content.sql` calistir
  4. Admin panelde kayitlari kontrol et
  5. Kullanici acikca isterse kod push/deploy surecine gec

## 29. Admin Panel - Intelligence Feed Sadelestirme

Tarih: 2026-05-11

Kullanici talimati:

- Ana sayfadaki `Intelligence Feed` alani paneldeki haber bolumuyle yonetilecek.
- Panel kafa karistirmayacak.
- Gereksiz bilgiler kaldirilacak.
- Sadece direkt amaca hizmet eden alanlar kalacak.
- Push/deploy/canliya alma yok.

Yapilan lokal degisiklikler:

- Admin menudeki `Haberler` etiketi `Intelligence Feed` olarak degistirildi.
- `/admin/articles` ekrani `Intelligence Feed` mantigina gore sadeleştirildi.
- Liste ekrani artik public feed icin gereken bilgileri gosterir:
  - rapor basligi
  - kart ozeti
  - kategori
  - dogrulama/yayin durumu
  - yayin tarihi
  - okuma suresi
- Yeni rapor ekleme basligi degistirildi:
  - `Yeni Intelligence Feed Raporu`
- Rapor duzenleme basligi degistirildi:
  - `Intelligence Feed Raporu Duzenle`
- Yeni rapor olustururken varsayilan teknik alanlar otomatik doldurulur:
  - `PublicId`
  - `Slug`
  - `Category = outbreak-report`
  - `VerificationStatus = verified`
  - `PublicationStatus = draft`
  - `ReadingTimeMin = 3`
  - `ConfidenceScore = 100`
  - `PublicationDate`
  - `LastVerifiedDate`

Panelde kalan amaca donuk alanlar:

- Rapor basligi
- Rapor ID
- URL slug
- Kart kategorisi
- Dogrulama
- Yayin
- Okuma suresi
- Kart ozeti
- Rapor detayi
- Yayin tarihi
- Son dogrulama
- Ana kaynak URL
- Kaynak rozetleri
- Etiketler

Panelden kaldirilan/gizlenen kafa karistirici alanlar:

- Ulke secimi
- Salgin secimi
- Cover image
- Confidence score
- Verification notes

Not:

- Bu alanlar modelde duruyor ama formda kullanicinin onune cikarilmiyor.
- Boylece mevcut veri yapisi bozulmadan panel sade kalir.
- Public alanda gorunmesi icin raporun `verified` + `published` olmasi gerekir.

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -o C:\\tmp\\hantaworld-admin-build-check` basarili.
- `npm run lint` basarili.
- `npm run build` basarili.

Dikkat:

- Bu adimda DB'ye dokunulmadi.
- Push yapilmadi.
- Canliya alinmadi.

## 36. Vaka/Olum Trend Grafigi Plani Uygulamasi

Tarih: 2026-05-13

Kullanici talimati:

- Ana sayfada haritanin ustune sade bir cizgi grafik eklenecek.
- Grafik iki cizgi gosterecek:
  - Reported Cases
  - Total Deaths
- Veri paneldeki `Data Source Numeric` kaydedildikce otomatik tarihceye yazilacak.
- Ulke bazli filtre ve gecmis tarihleri elle duzenleme bu fazda yapilmayacak.
- Push yapilmayacak.

Yapilan backend degisiklikleri:

- `data_source_numeric_history` icin domain entity ve EF mapping eklendi.
- `AdminDataSourceNumericController` kaydetme sonrasi ayni gun icin history upsert yapacak sekilde guncellendi.
- Yeni API endpoint eklendi:
  - `GET /api/global-stats/trend`
- `SetupController` icindeki `/setup/apply-admin-panel-updates` endpointi artik `05_data_source_numeric_history.sql` scriptini de calistiriyor.
- Yeni idempotent script eklendi:
  - `database/05_data_source_numeric_history.sql`
- Bos DB kurulumu icin `database/01_mssql_schema.sql` icine history tablosu ve indeksleri eklendi.

Yapilan frontend degisiklikleri:

- `GlobalStatsTrendPoint` tipi eklendi.
- `getGlobalStatsTrend()` fonksiyonu eklendi.
- Kucuk fallback dosyasi eklendi:
  - `data/global-stats-trend.json`
- Yeni client grafik bileseni eklendi:
  - `components/dashboard/GlobalStatsTrendChart.tsx`
- Ana sayfada grafik `HeroStats` altina, harita bolumunun ustune yerlestirildi.
- Mevcut `echarts` ve `echarts-for-react` paketleri kullanildi; yeni paket eklenmedi.

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj` basarili.
- `npm run lint` basarili; mevcut `mapOutbreak` unused uyarisi devam ediyor.
- `npm run build` basarili.
- `dotnet publish backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -c Release -o backend\\publish\\HantaWorld.AdminApi` basarili.
- Publish klasorunde `DatabaseScripts\\05_data_source_numeric_history.sql` var.

Yuklenecek publish yolu:

- `C:\\Users\\Ceyda\\.gemini\\antigravity\\scratch\\hantaworld\\backend\\publish\\HantaWorld.AdminApi`

Dikkat:

- GitHub'a push yapilmadi.
- Canli DB'ye bu adimda tarafimdan islem yapilmadi.

## 39. Ingilizce Hantavirus SEO Teknik Faz 1

Tarih: 2026-05-15

Kullanici talimati:

- SEO calismasi Ingilizce olacak, TR sayfa acilmayacak.
- Hedef hanta virusu / hantavirus odakli aramalarda yukselmek.
- Kod tarafinda onerilen teknik SEO adimlari uygulanacak.
- Kullanici demeden push yapilmayacak.

Yapilan frontend SEO degisiklikleri:

- Canonical domain `https://www.hantaworld.com` olarak netlestirildi.
- `app/robots.ts` eklendi; `/robots.txt` sitemap URL'sini gosteriyor.
- Yeni Ingilizce bilgi sayfalari eklendi:
  - `/hantavirus`
  - `/hantavirus-symptoms`
  - `/andes-virus`
- Yeni sayfalara sayfa bazli metadata, canonical, OpenGraph ve JSON-LD eklendi.
- `/news/[slug]` detay sayfasina `NewsArticle` JSON-LD eklendi.
- `/news`, `/map`, `/country/[slug]` ve ana sayfa metadata/canonical bilgileri guclendirildi.
- `app/sitemap.ts` yeni SEO sayfalarini sitemap'e ekleyecek sekilde guncellendi.
- Footer'a `Hantavirus Guides` link grubu eklendi.

Kullanilan resmi bilgi kaynaklari:

- CDC Hantavirus genel bilgi sayfasi.
- CDC Hantavirus prevention.
- CDC Andes virus.
- WHO Hantavirus fact sheet.
- WHO Disease Outbreak News.

Kontrol kaydi:

- `npm run lint` basarili; mevcut `mapOutbreak` unused uyarisi devam ediyor.
- `npm run build` basarili.
- Build ciktisinda yeni statik rotalar gorundu:
  - `/hantavirus`
  - `/hantavirus-symptoms`
  - `/andes-virus`
  - `/robots.txt`

Dikkat:

- GitHub'a push yapilmadi.
- Backend tarafina bu SEO fazinda dokunulmadi.
- Canliya almak icin kullanici acikca `push et` demeli.
- Sunucuda backend publish yuklendikten sonra setup endpoint calistirilmali.
- Sunucudaki `appsettings.json` ezilmemeli; production DB bilgileri korunmali.

## 37. Google Verification, Otomatik Tarih ve 7 Gunluk Degisim

Tarih: 2026-05-13

Kullanici talimati:

- Frontend `<head>` icine Google site verification meta etiketi eklenecek.
- Ana sayfadaki `Data verified` tarihi her gun otomatik guncellenecek.
- `0% 7-day change` alani gercek amacina uygun aktif hale getirilecek.
- Push yapilmayacak.

Yapilan degisiklikler:

- `app/layout.tsx` icine eklendi:
  - `<meta name="google-site-verification" content="pyY1SlYkOScmKbeeS8Ny0mPpJlUoC4rJLff15vHFV3Y" />`
- `HeroStats` artik `Data verified` icin server tarafinda uretilen bugunun tarihini aliyor.
- Ana sayfa `globalStatsTrend` verisinden vaka sayisi icin 7 gunluk degisim yuzdesi hesapliyor.
- `/api/global-stats` endpointi de `growthRate7d` degerini mumkunse `data_source_numeric_history` uzerinden hesaplayacak sekilde guncellendi.
- Tek history kaydi varsa oran 0 kalir; birden fazla kayit varsa son kayit ile 7 gun onceki/en eski uygun kayit karsilastirilir.

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj` basarili.
- `npm run lint` basarili; mevcut `mapOutbreak` unused uyarisi devam ediyor.
- `npm run build` basarili.
- `dotnet publish backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -c Release -o backend\\publish\\HantaWorld.AdminApi` basarili.

Dikkat:

- GitHub'a push yapilmadi.
- Canli DB'ye bu adimda tarafimdan islem yapilmadi.
- Backend publish yuklenirse `appsettings.json` ezilmemeli.

## 38. Trend Grafigi Tarihce Seed Duzeltmesi

Tarih: 2026-05-13

Kullanici bildirimi:

- Canli grafikte sadece `May 13` tek nokta gorunuyor.
- Grafik 8-9-10-11-12-13 Mayis olarak gorunmeli.
- 8-11 Mayis: 8 vaka, 3 olum.
- 12-13 Mayis: 11 vaka, 3 olum.
- Bundan sonrasi paneldeki Data Source Numeric alani kaydedilince cizgi grafigine yansimali.
- Vaka ve olum cizgi renkleri daha belirgin ayrilmali.

Tespit:

- Canli `/api/global-stats/trend` endpointi sadece tek kayit donduruyordu:
  - `2026-05-13`, `reportedCases=11`, `totalDeaths=3`
- Bu yuzden frontend cizgi cizemiyor, tek nokta gosteriyordu.

Yapilan lokal duzeltmeler:

- `database/05_data_source_numeric_history.sql`
  - 8-13 Mayis 2026 arasi baslangic history seed'i eklendi.
  - Mevcut May 13 kaydi varsa 11/3 olarak guncellenir.
  - Sonrasinda mevcut gun icin paneldeki numeric degerlerden otomatik upsert devam eder.
- `database/03_data_source_numeric.sql`
  - Mevcut numeric satirlarinin `numeric_value` degeri artik seed tarafindan ezilmeyecek.
- `database/04_seed_current_frontend_content.sql`
  - Mevcut numeric satirlarinin `numeric_value` degeri artik seed tarafindan ezilmeyecek.
- `data/global-stats-trend.json`
  - Frontend fallback 8-13 Mayis verileriyle guncellendi.
- `components/dashboard/GlobalStatsTrendChart.tsx`
  - Vaka cizgisi kirmizi, olum cizgisi sari olarak daha belirgin ayrildi.

Kontrol kaydi:

- `npm run lint` basarili; mevcut `mapOutbreak` unused uyarisi devam ediyor.
- `npm run build` basarili.
- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj` basarili.
- `dotnet publish backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -c Release -o backend\\publish\\HantaWorld.AdminApi` basarili.

Canliya almak icin:

- Backend publish klasorundeki guncel `DatabaseScripts` dosyalari sunucuya yuklenmeli.
- Sonra setup endpoint tekrar calistirilmali:
  - `/setup/apply-admin-panel-updates?key=...`
- Kontrol:
  - `/api/global-stats/trend` 8-13 Mayis kayitlarini dondurmeli.

Dikkat:

- GitHub'a push yapilmadi.
- Canli DB'ye bu adimda tarafimdan islem yapilmadi.

## 35. Admin Haber Ekleme 500 Hatasi

Tarih: 2026-05-12

Kullanici bildirimi:

- `https://hantaapi.sinavio.com.tr/admin/articles/create` sayfasinda yeni haber eklerken submit sonrasi HTTP 500 hatasi alindi.

Tespit:

- Haber kaydi `Articles` tablosuna yazildiktan sonra audit log kaydi olusturuluyor.
- Audit log servisi EF entity nesnesini dogrudan JSON'a ceviriyordu.
- `Article` entity icindeki navigation alanlari nedeniyle JSON cycle/depth hatasi olusup islem redirect etmeden 500'e dusebilir.
- Bu durumda haber DB'ye yazilmis olabilir; ayni slug/public id ile tekrar denemeden once admin listesi kontrol edilmeli.

Yapilan lokal backend duzeltmeleri:

- `backend/HantaWorld.AdminApi/Services/AuditLogService.cs`
  - JSON serialize icin `ReferenceHandler.IgnoreCycles` eklendi.
  - `MaxDepth = 16` ayarlandi.
  - Serialize hatasinda tum istegi patlatmak yerine kisa hata ozeti yazan guvenli fallback eklendi.
- `backend/HantaWorld.AdminApi/Controllers/AdminArticlesController.cs`
  - Haber tag alani bos/null gelirse 500 vermemesi icin `ApplyTags` null-safe yapildi.

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj` basarili.
- `dotnet publish backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -c Release -o backend\\publish\\HantaWorld.AdminApi` basarili.

Yuklenecek publish yolu:

- `C:\\Users\\Ceyda\\.gemini\\antigravity\\scratch\\hantaworld\\backend\\publish\\HantaWorld.AdminApi`

Dikkat:

- GitHub'a push yapilmadi.
- Frontend tarafina dokunulmadi.
- Sunucuda `appsettings.json` overwrite edilmemeli; production connection string korunmali.
- Publish dosyalari yuklendikten sonra Plesk/IIS uygulamasi yeniden baslatilmali.

## 35. Frontend Haber ve Harita Ulke Guncellemesi - 12 Mayis

Tarih: 2026-05-12

Kullanici talimati:

- Sadece frontend tarafinda guncelleme yapilacak.
- Sabah eklenen 12 Mayis haberleri tekrar gorunur olacak.
- 11 Mayis haberi tum haberler sayfasinda kalacak.
- Haritadaki ulkeler guncel listeye gore duzenlenecek.
- Push yapilacak.

Guncel harita ulkeleri:

- Argentina
- Netherlands
- Germany
- United Kingdom
- South Africa
- Switzerland
- Spain
- France
- United States

Yapilan lokal degisiklik:

- `data/countries.json` 9 ulke/bölge listesine gore guncellendi.
- `data/outbreaks.json` 9 harita kaydiyla guncellendi.
- `data/news.json` icindeki 12 Mayis gunluk haber tam metinle guncellendi.
- 11 Mayis haberi dosyada korundu.
- Public frontend haber ve harita verilerinde JSON icerigi oncelikli kullanacak sekilde `lib/data.ts` guncellendi.
- Ana sayfa stat kartlarinda `Affected Countries` ve `Active Outbreaks` 9 yapildi.

Kontrol kaydi:

- `npm run lint` basarili; sadece eski API mapper fonksiyonu icin uyarı verdi.
- `npm run build` basarili.

Dikkat:

- Backend, DB, publish/bin/obj dosyalarina dokunulmadi.

## 36. DB Seed Hazirligi - 12 Mayis Icerikleri

Tarih: 2026-05-12

Kullanici talimati:

- Bugunku frontend icerikleri DB tarafina da eklenecek.
- Panel baglantisi yapilmayacak.
- Git push yapilmayacak.
- Sadece DB seed entegrasyonu hazirlanacak.

Yapilan lokal degisiklik:

- `database/04_seed_current_frontend_content.sql` bugunku JSON iceriginden yeniden uretildi.
- Publish klasorundeki kopya da guncellendi:
  - `backend/publish/HantaWorld.AdminApi/DatabaseScripts/04_seed_current_frontend_content.sql`

Scriptin yaptiklari:

- 9 guncel ulke/bölgeyi DB'ye ekler veya gunceller.
- 9 guncel outbreak/harita kaydini DB'ye ekler veya gunceller.
- Eski yayinlanmis outbreak kayitlarini `archived` durumuna ceker; boylece API eski Israel / Tristan gibi kaldirilan kayitlari dondurmez.
- 12 Mayis haberlerini DB'ye ekler/gunceller.
- 11 Mayis haberini haberler listesinde korur.
- `data_source_numeric` degerlerini 10 / 3 / 9 / 9 olarak gunceller.

Kontrol kaydi:

- Script icinde Netherlands, Germany, United Kingdom, South Africa, Switzerland, Spain, France, United States ve Argentina kayitlari kontrol edildi.
- `data_source_numeric` degerleri kontrol edildi.

Dikkat:

- Push yapilmadi.
- Canli DB henuz guncellenmedi; bunun icin publish klasorundeki `04_seed_current_frontend_content.sql` sunucuya yuklenip setup linki calistirilacak.

## 37. DB Setup Endpoint Hata Hafizasi ve Basarili Calistirma

Tarih: 2026-05-12

Kullanici talimati:

- DB tablolari, setup endpoint mantigi, alinan hatalar ve nedenleri hafiza dosyasina kaydedilecek.

Endpoint mantigi:

- `/setup/run-schema?key=...`
  - Ana DB semasini kurar.
  - `01_mssql_schema.sql` dosyasini calistirir.
  - Bos DB icin kullanilir.
  - DB'de tablolar zaten varsa tekrar calistirilmemelidir.

- `/setup/apply-admin-panel-updates?key=...`
  - Admin panel ve mevcut frontend icerik guncellemelerini uygular.
  - Sirasiyla su scriptleri calistirir:
    - `03_data_source_numeric.sql`
    - `04_seed_current_frontend_content.sql`
  - Ana tablolarin daha once olusturulmus oldugunu varsayar.

Onemli ayar:

- Endpointlerin calismasi icin sunucudaki `appsettings.json` icinde gecici olarak:
  - `Setup:EnableSchemaRunner = true`
  - `Setup:SchemaRunnerKey = ilgili_key`
- Islem bittikten sonra guvenlik icin:
  - `Setup:EnableSchemaRunner = false`

Alinan hatalar ve nedenleri:

- Hata:
  - `There is already an object named 'countries' in the database.`
- Neden:
  - `/setup/run-schema` bos olmayan DB'de calistirildi.
  - `01_mssql_schema.sql` ana tablolari tekrar olusturmaya calistigi icin `countries` tablosunda durdu.
- Cozum:
  - DB zaten kuruluysa `/setup/run-schema` calistirilmaz.
  - Bunun yerine `/setup/apply-admin-panel-updates` calistirilir.

- Hata:
  - `HTTP ERROR 404`
  - `/setup/apply-admin-panel-updates` bulunamadi.
- Neden:
  - Sunucuda yeni endpoint'i iceren `HantaWorld.AdminApi.dll` aktif degildi.
  - FileZilla aktariminda `HantaWorld.AdminApi.dll` ve bazi DLL dosyalari aktarilamayanlar listesinde kalmisti.
  - Uygulama restart edilmeden eski DLL hafizada kalabiliyor.
- Cozum:
  - Uygulama durdurulur veya restart edilir.
  - Yeni publish icindeki dosyalar sunucudaki uygulama kokune yuklenir.
  - Ozellikle `HantaWorld.AdminApi.dll`, `HantaWorld.AdminApi.exe`, `deps/runtimeconfig`, `web.config` ve `DatabaseScripts` kontrol edilir.
  - Uygulama yeniden baslatilir.

- Hata:
  - `Missing end comment mark '*/'.`
- Neden:
  - `04_seed_current_frontend_content.sql` icindeki yorum satirinda `data/*.json` ifadesi vardi.
  - SQL Server bunu blok yorum isareti gibi yorumlayabildi ve kapanis bekledi.
  - Ilk duzeltmede yorum metni degistirildi; hata devam edince blok yorum tamamen kaldirildi.
- Cozum:
  - `04_seed_current_frontend_content.sql` icindeki `/* ... */` blok yorumu tamamen kaldirildi.
  - Dosyanin sunucudaki ilk satirlari su sekilde baslamali:
    - `SET ANSI_NULLS ON;`
    - `SET QUOTED_IDENTIFIER ON;`
    - `GO`
    - `MERGE dbo.countries AS target`

Basarili calistirma sonucu:

- Calistirilan link:
  - `/setup/apply-admin-panel-updates?key=...`
- Donen sonuc:
  - `success: true`
  - `03_data_source_numeric.sql` icin `batchesExecuted: 6`
  - `04_seed_current_frontend_content.sql` icin `batchesExecuted: 10`

Son durum:

- DB tarafina bugunku numeric ve frontend icerik seed'i basariyla uygulandi.
- Push yapilmadi.
- GitHub/canli frontend deploy islemi yapilmadi.

## 38. Sinirli Panel Baglantisi - Data Source Numeric ve Intelligence Feed

Tarih: 2026-05-12

Kullanici talimati:

- Panel tarafini sadece iki alan icin public frontend'e bagla:
  - Data Source Numeric
  - Intelligence Feed
- Harita, ulke detaylari ve diger alanlar simdilik baglanmayacak.
- Push yapilmayacak.

Yapilan lokal frontend degisiklik:

- `Data Source Numeric`:
  - Ana sayfadaki stat kartlari artik `getGlobalStats()` uzerinden gelen `numericCards` API verisini kullanir.
  - API veri vermezse mevcut fallback hesaplama calisir.
  - `Data verified` tarihi tekrar `stats.lastUpdated` kaynagina baglandi.

- `Intelligence Feed`:
  - Haber listesi artik `/api/news` canli API verisini once kullanir.
  - API'de verified haber yoksa `data/news.json` fallback olarak kullanilir.
  - Haber detay sayfasi once `/api/news?includeContent=true` uzerinden canli icerigi arar; bulamazsa JSON fallback'e doner.

Kapsam disi birakilanlar:

- `getOutbreaks()` hala JSON fallback kullanir.
- Harita panel/API baglantisi simdilik aktif edilmedi.
- Country detaylari ve risk monitor icin mevcut harita/fallback akisi korunur.

Canli API kontrolu:

- `https://hantaapi.sinavio.com.tr/api/global-stats`
  - Numeric kartlar `10 / 3 / 9 / 9` donuyor.
- `https://hantaapi.sinavio.com.tr/api/news`
  - 6 verified haber donuyor.
  - Ilk haber: `Hantavirus Daily Update - May 12, 2026`

Kontrol kaydi:

- `npm run lint` basarili; sadece `mapOutbreak` icin kullanilmayan fonksiyon uyarisi var. Bu fonksiyon harita API baglantisi bekledigi icin simdilik silinmedi.
- `npm run build` basarili.

Dikkat:

- Push yapilmadi.
- Backend/DB/panel kodu bu adimda degistirilmedi.

## 39. Google Analytics ve Sinirli Frontend Push Hazirligi

Tarih: 2026-05-12

Kullanici talimati:

- Google Analytics kodu siteye eklenecek.
- Data Source Numeric ve Intelligence Feed baglantilariyla birlikte push yapilacak.
- Backend/DB/panel dosyalari push'a dahil edilmeyecek.

Yapilan lokal frontend degisiklik:

- `app/layout.tsx` icine Google Analytics tag eklendi:
  - Measurement ID: `G-YWFWWGVBX0`
- `components/dashboard/HeroStats.tsx` Data Source Numeric API verisini kullanacak sekilde ayarlandi.
- `lib/data.ts` Intelligence Feed icin `/api/news` canli API verisini once kullanacak sekilde ayarlandi.

Kontrol kaydi:

- `npm run lint` basarili; sadece `mapOutbreak` icin mevcut uyarı var.
- `npm run build` basarili.

Dikkat:

- Commit/push sirasinda yalnizca su frontend dosyalari secilecek:
  - `app/layout.tsx`
  - `components/dashboard/HeroStats.tsx`
  - `lib/data.ts`

## 30. Admin Panel - Map Markers Sadelestirme

Tarih: 2026-05-11

Kullanici talimati:

- Map admin paneli de fazla karisik bulundu.
- Panel sadece amaca hizmet etmeli.
- Kullanici onayi ile Map paneli sadelestirildi.
- Push/deploy/canliya alma yok.

Yapilan lokal degisiklikler:

- Admin menudeki `Map` etiketi `Map Markers` olarak degistirildi.
- Admin dashboard butonu `Map Markers` olarak degistirildi.
- `/admin/map` liste ekrani sadelestirildi.
- Liste artik yalnizca marker icin gerekli bilgileri gosterir:
  - marker basligi
  - ulke
  - durum/seviye
  - toplam vaka/death
  - koordinat
  - dogrulama/yayin durumu
- `/admin/map/create` ve `/admin/map/{id}/edit` formu teknik outbreak formundan cikarildi.
- Form artik sadece harita marker amacina hizmet eder.

Map formunda kalan alanlar:

- Ulke
- Marker basligi
- Tiklaninca acilacak bilgi
- Durum
- Seviye
- Dogrulama
- Yayin
- Confirmed
- Suspected
- Deaths
- Recovered
- Latitude
- Longitude
- Radius km
- Son dogrulama
- Kaynak URL

Gizlenen/otomatik kalan alanlar:

- Public ID
- Slug
- Summary
- Growth rate
- StartedAt
- PublicationDate
- ResolvedAt
- VerificationNotes
- Kaynak listesi

Not:

- Map kayitlari halen mevcut `outbreaks` tablosunu kullanir.
- Public haritada gorunmesi icin kayit `verified` + `published` olmali.
- Kaynak listesi yerine bu panelde tek `Kaynak URL` kullanimi tercih edildi.
- Boylece panel kullanicisi icin odak sadece harita noktasi ve tiklaninca cikacak bilgi olur.

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -o C:\\tmp\\hantaworld-admin-build-check` basarili.
- `npm run lint` basarili.

Dikkat:

- Bu adimda DB'ye dokunulmadi.
- Push yapilmadi.
- Canliya alinmadi.

## 31. Country Risk Monitor - Map Marker Kaynagina Baglama

Tarih: 2026-05-11

Kullanici talimati:

- Ana sayfadaki `Country Risk Monitor` alani haritaya eklenen ulkelerden otomatik beslensin.
- Haritaya eklenen ulke burada da gorunsun.
- Ayri panel/veri girisi olmasin.
- Push/deploy/canliya alma yok.

Yapilan lokal degisiklikler:

- `getCountryWatchlist` fonksiyonu opsiyonel outbreak/marker listesi alacak sekilde guncellendi.
- Ana sayfada once `getOutbreaks()` ile harita markerlari alinir.
- Ayni marker listesi `getCountryWatchlist(outbreaks)` ile Country Risk Monitor'e verilir.
- Boylece ana sayfadaki harita ve Country Risk Monitor ayni veri setinden beslenir.
- Haritada gorunen ulkeler otomatik olarak Country Risk Monitor listesine de dahil olur.
- Daha once sadece `activeOutbreaks > 0` olan ulkeler listeleniyordu.
- Bu filtre kaldirildi; haritada gorunen resolved/aktif olmayan kayitlar da risk monitor kaynagina dahil olabilir.

Teknik not:

- Public harita ve Country Risk Monitor icin ana kaynak hala `outbreaks` / map marker kayitlaridir.
- Admin tarafinda ayri bir Country Risk Monitor paneli acilmadi.
- Bu karar veri tekrarini azaltir ve paneli sade tutar.

Kontrol kaydi:

- `npm run lint` basarili.
- `npm run build` basarili.
- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -o C:\\tmp\\hantaworld-admin-build-check` basarili.

Dikkat:

- Bu adimda DB'ye dokunulmadi.
- Push yapilmadi.
- Canliya alinmadi.

## 32. Setup Link - Admin Panel DB Scriptlerini Tek Linkle Calistirma

Tarih: 2026-05-11

Kullanici talimati:

- SQL scriptleri manuel calistirmak yerine daha once oldugu gibi link uzerinden calistirilacak.
- Mevcut DB calistigi icin `01_mssql_schema.sql` tekrar calistirilmamali.
- Sadece yeni admin panel scriptleri calistirilmali.
- GitHub/push yok; kullanici dosyalari FileZilla/cPanel uzerinden yukleyecek.

Yapilan lokal degisiklik:

- `SetupController` icine yeni endpoint eklendi:
  - `GET /setup/apply-admin-panel-updates?key=...`
- Bu endpoint sirasiyla su scriptleri calistirir:
  - `03_data_source_numeric.sql`
  - `04_seed_current_frontend_content.sql`
- Endpoint mevcut `Setup:EnableSchemaRunner` ve `Setup:SchemaRunnerKey` guvenlik ayarlarini kullanir.
- `RunSchema` endpoint'indeki key dogrulama ortak helper'a tasindi.

Publish kaydi:

- Backend yeniden publish edildi.
- Publish klasoru:
  - `backend/publish/HantaWorld.AdminApi`
- Publish icindeki `DatabaseScripts` klasorunde su dosyalar kontrol edildi:
  - `01_mssql_schema.sql`
  - `02_seed_first_admin.sql`
  - `03_data_source_numeric.sql`
  - `04_seed_current_frontend_content.sql`

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -o C:\\tmp\\hantaworld-admin-build-check` basarili.
- `npm run lint` basarili.
- `dotnet publish backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -c Release -o backend\\publish\\HantaWorld.AdminApi` basarili.

Dikkat:

- Endpointin calismasi icin sunucudaki `appsettings.json` icinde gecici olarak:
  - `Setup:EnableSchemaRunner = true`
  - `Setup:SchemaRunnerKey = guclu_gecici_key`
- Link calistirildiktan sonra `EnableSchemaRunner` tekrar `false` yapilmali.
- Bu adimda DB'ye dokunulmadi.
- Push yapilmadi.
- Canliya alinmadi; sadece lokal publish alindi.

## 33. Frontend Icerik Guncellemesi - 12 Mayis Gunluk Hantavirus Verisi

Tarih: 2026-05-12

Kullanici talimati:

- Sadece frontend tarafinda icerik guncellenecek.
- Panel entegrasyonu su an bekleyecek.
- Ana sayfadaki `Reported Cases` rakami 9 olacak.
- Bugunku 12 Mayis haberleri Intelligence Feed alaninda gorunecek.
- Dunku haberler silinmeyecek; tum haberler sayfasinda kalabilir.
- Sadece icerik degisiklikleri GitHub'a push edilecek.

Yapilan lokal degisiklikler:

- `data/outbreaks.json` icinde toplam vaka sayisini 9 yapacak sekilde Fransa ve Ispanya kayitlari 12 Mayis verisine guncellendi.
- Ispanya kaydi Madrid karantinasindaki yolcunun PCR pozitif cikmasi bilgisini icerir.
- Fransa kaydi yeni pozitif Fransiz yolcu bilgisini icerir.
- `data/global-stats.json` son dogrulama tarihi 2026-05-12 yapildi; toplam can kaybi 3 olarak korundu.
- `data/news.json` basina 3 adet 12 Mayis 2026 tarihli guncel haber eklendi.
- Eski 11 Mayis / 8 Mayis / 4 Mayis haberleri dosyada korundu; ana sayfa ilk 3 haberi gosterdigi icin bugunku haberler one cikacak.

Dikkat:

- Backend/panel/DB dosyalarina bu adimda dokunulmadi.
- Commit ve push sirasinda sadece frontend icerik dosyalari secilmeli.

## 34. Ana Sayfa Stat Kartlari - Frontend Lokal Rakam Guncellemesi

Tarih: 2026-05-12

Kullanici talimati:

- Sadece frontend tarafinda minik guncelleme yapilacak.
- Ana sayfadaki rakam kartlari guncellenecek.
- Backend, DB ve panel tarafina dokunulmayacak.

Guncellenen hedef rakamlar:

- Reported Cases: 10
- Total Deaths: 3
- Affected Countries: 6
- Active Outbreaks: 6

Yapilan lokal degisiklik:

- `components/dashboard/HeroStats.tsx` icinde ana sayfa stat kartlari icin frontend override degerleri eklendi.
- Harita ve ulke detay verilerini etkilememek icin `data/outbreaks.json` vaka dagilimi degistirilmedi.

Kontrol kaydi:

- `npm run lint` basarili.
- `npm run build` basarili.

Dikkat:

- Push yapilmadi.
- Canliya alinmadi.

## 35. SEO Bilgi Sayfalari - Ust Menu ve Detayli Icerik Guncellemesi

Tarih: 2026-05-15

Kullanici talimati:

- Hantavirus SEO sayfalari web sitesi menusunde gorunsun.
- Icerikler daha detayli ve arastirilmis olsun.
- Push kullanici acikca istemeden yapilmayacak.

Yapilan lokal degisiklikler:

- `components/layout/Navbar.tsx` icine `Hantavirus` menu linki eklendi.
- `/hantavirus`, `/hantavirus-symptoms`, `/andes-virus` sayfalarinda aktif menu durumu `Hantavirus` olarak calisacak sekilde ayarlandi.
- `/hantavirus` sayfasi CDC/WHO/ECDC kaynaklarina gore daha genis bilgi icerigiyle guncellendi:
  - Hastalik paternleri ve cografya
  - Bulasma yollari
  - Onleme oncelikleri
  - Tani ve tedavi baglami
- `/hantavirus-symptoms` sayfasi daha detayli hale getirildi:
  - Maruziyet sonrasi belirti zamanlamasi
  - Baska hastaliklarla karisabilen belirtiler
  - Acil bakim gerektiren durumlar
  - Kaynak linkleri
  - FAQ structured data icine belirti zamanlamasi eklendi.
- `/andes-virus` sayfasi daha detayli hale getirildi:
  - 4-42 gun kuluçka/izlem penceresi
  - Sinirli kisiden kisiye bulasma baglami
  - Kamu sagligi yaniti
  - HantaWorld vaka/temas siniflandirma mantigi
  - FAQ structured data eklendi.

Kontrol kaydi:

- `npm run lint` calisti; hata yok, sadece daha onceden kalan `lib/data.ts` icinde `mapOutbreak` unused warning var.
- `npm run build` basarili.

Dikkat:

- Backend/DB dosyalarina bu adimda dokunulmadi.
- Push yapilmadi.
- Canliya alinmadi.

## 36. Instagram Feed Widget - Panel Kontrollu Ilk Faz

Tarih: 2026-05-15

Kullanici talimati:

- Instagram sayfasindaki postlarin web sitesinde widget gibi gorunmesi isteniyor.
- Ilk onerilen guvenli yontem uygulanacak: postlar panelden URL olarak girilecek.
- Otomatik Meta API entegrasyonu bu fazda yapilmayacak.
- Push kullanici acikca istemeden yapilmayacak.

Yapilan lokal degisiklikler:

- Backend entity eklendi: `InstagramPost`.
- EF mapping eklendi: `instagram_posts`.
- Admin panel bolumu eklendi:
  - `/admin/instagram-posts`
  - `/admin/instagram-posts/create`
  - `/admin/instagram-posts/{id}/edit`
- Admin form alanlari:
  - Baslik
  - Instagram post/reel/tv URL
  - Kisa aciklama
  - Sira
  - Yayinda
  - One cikar
- Public API eklendi:
  - `GET /api/instagram-posts`
  - Sadece `is_published = 1` kayitlari doner.
  - `is_featured`, `sort_order`, `updated_at` siralamasina gore listeler.
- Frontend eklendi:
  - `components/dashboard/InstagramUpdates.tsx`
  - Ana sayfada Intelligence Feed sonrasi gorunur.
  - Veri yoksa widget hic gorunmez.
  - Instagram embed scripti sadece post varsa yuklenir.
  - Embed calismazsa kart icindeki Instagram linki fallback olarak kalir.
- Frontend data katmani eklendi:
  - `getInstagramPosts()`
  - `/api/instagram-posts` endpointini okur.
  - `data/instagram-posts.json` bos fallback dosyasi eklendi.
- Setup script eklendi:
  - `database/06_instagram_posts.sql`
  - `apply-admin-panel-updates` endpointi artik `06_instagram_posts.sql` dosyasini da calistirir.
- Tam schema dosyasi guncellendi:
  - `database/01_mssql_schema.sql` icine `instagram_posts` tablosu ve FK/index tanimlari eklendi.
- Backend publish alindi:
  - `backend\\publish\\HantaWorld.AdminApi`
  - Publish icinde `DatabaseScripts\\06_instagram_posts.sql` mevcut.

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj` basarili.
- `npm run lint` basarili; sadece daha onceden kalan `lib/data.ts` icinde `mapOutbreak` unused warning var.
- `npm run build` basarili.
- `dotnet publish backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -c Release -o backend\\publish\\HantaWorld.AdminApi` basarili.

Canliya alma notu:

- Backend icin `backend\\publish\\HantaWorld.AdminApi` klasorundeki dosyalar FileZilla/Plesk ile sunucuya yuklenmeli.
- Sonra setup endpoint calistirilmali:
  - `/setup/apply-admin-panel-updates?key=...`
- Bu endpoint `06_instagram_posts.sql` tablosunu olusturur.
- Frontend icin GitHub push yapilmadi; kullanici `push et` demeden push yok.

## 37. Instagram Feed 500 Hata Duzeltmesi

Tarih: 2026-05-15

Durum:

- Kullanici panelden Instagram post girdikten sonra HTTP 500 hatasi aldigini bildirdi.
- Canli API kontrolunde kaydin aslinda olustugu goruldu:
  - `GET /api/instagram-posts` kaydi dondurdu.

Kok neden:

- Kayit basariyla `instagram_posts` tablosuna yaziliyor.
- Hata kayittan sonra audit log yazilirken olusuyor.
- `audit_logs.entity_public_id` kolonu 80 karakter.
- Instagram post basligi 80 karakterden uzun oldugunda audit log insert 500 hatasina dusuyor.

Yapilan lokal duzeltme:

- `AuditLogService` icinde audit log text alanlari DB kolon limitlerine gore kirpilacak sekilde guncellendi:
  - `action_type`: 100
  - `entity_name`: 100
  - `entity_public_id`: 80
  - `request_path`: 400
  - `http_method`: 16
  - `ip_address`: 64
  - `user_agent`: 512

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj` basarili, 0 uyari, 0 hata.
- `dotnet publish backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -c Release -o backend\\publish\\HantaWorld.AdminApi` basarili.

Canliya alma notu:

- Bu duzeltme backend tarafidir.
- FileZilla/Plesk ile `backend\\publish\\HantaWorld.AdminApi` klasorundeki yeni publish dosyalari sunucuya yuklenmeli.
- DB script calistirmaya gerek yok; tablo zaten var ve kayit API'de gorunuyor.

## 38. Instagram Widget Reel Kapak Gorseli

Tarih: 2026-05-15

Kullanici talimati:

- Instagram widget icinde reel'in ilk gorselinin gorunmesi istendi.

Yapilan lokal degisiklik:

- `components/dashboard/InstagramUpdates.tsx` yeniden duzenlendi.
- Instagram embed kutusu yerine linkli kapak gorseli fallback'i eklendi.
- Reel/post/tv URL'sinden shortcode okunarak su formatta kapak gorseli denenir:
  - `https://www.instagram.com/{type}/{shortcode}/media/?size=l`
- Gorselin uzerine play ikonu ve `Watch on Instagram` metni eklendi.
- Kapak gorseli yuklenemezse kart yine Instagram linki ile calisir.

Kontrol kaydi:

- `npm run lint` basarili; sadece daha onceden kalan `lib/data.ts` icinde `mapOutbreak` unused warning var.
- `npm run build` basarili.

Dikkat:

- Bu degisiklik sadece frontend tarafidir.
- Push yapilmadi.

## 39. Hantaworld.md Hafiza Kurali Netlestirme

Tarih: 2026-05-15

Kullanici talimati:

- Yapilan tum guncellemelerin `hantaworld.md` dosyasina kaydedildigi teyit edilecek.
- Bunu kalici bir calisma kurali olarak dosyaya eklemek istendi.

Yapilan degisiklik:

- Dosyanin ust kismina `Calisma Kurallari` bolumu eklendi.
- Bu bolume su kural acik olarak yazildi:
  - Yapilan her anlamli guncelleme, karar, hata nedeni, cozum ve canliya alma notu `hantaworld.md` dosyasina kaydedilecek.
- Push kurali da ayni bolumde tekrar netlestirildi:
  - Kullanici acikca `push et` demeden GitHub'a push yapilmayacak.
- `hantaworld.md` dosyasinin proje hafizasi olarak kullanilacagi ve kullanici istemedikce commit/push edilmeyecegi de not edildi.

Dikkat:

- Bu degisiklik sadece lokal hafiza dosyasindadir.
- Push yapilmadi.

## 40. Instagram Widget Kapak Gorseli Alanina Gecis

Tarih: 2026-05-15

Durum:

- Instagram reel kapagi icin denenmis otomatik URL (`/media/?size=l`) canli sitede kirik gorsel olarak gorundu.
- Kok neden: Instagram bu media endpointini hotlink / tarayici gorsel kullanimi icin guvenilir bicimde sunmuyor; dis siteden direkt gorsel olarak kullanilmasi engellenebiliyor.

Alinan karar:

- Guvenilir cozum olarak panelde Instagram postu icin manuel `Kapak gorseli URL` alani eklenecek.
- Frontend once panelden gelen kapak gorselini kullanacak.
- Kapak gorseli yoksa otomatik Instagram media URL denenir.
- Otomatik gorsel de yuklenemezse kirik gorsel yerine duzgun fallback metni gorunecek.

Yapilan lokal degisiklikler:

- Backend:
  - `InstagramPost` entity icine `ThumbnailImageUrl` eklendi.
  - EF mapping icine `thumbnail_image_url` kolonu eklendi.
  - Admin form modeline `ThumbnailImageUrl` eklendi.
  - Admin Instagram formuna `Kapak gorseli URL` inputu eklendi.
  - Public API DTO ve `/api/instagram-posts` cevabina `thumbnailImageUrl` eklendi.
- Database:
  - `database/06_instagram_posts.sql` idempotent olarak `thumbnail_image_url` kolonunu ekleyecek sekilde guncellendi.
  - `database/01_mssql_schema.sql` tam kurulum semasina kolon eklendi.
- Frontend:
  - `InstagramPost` tipine `thumbnailImageUrl` eklendi.
  - `getInstagramPosts()` mapping alanina `thumbnailImageUrl` eklendi.
  - `InstagramUpdates` componenti manuel kapak gorselini oncelikli kullanacak sekilde guncellendi.
  - Gorsel yuklenemezse `Open this update on Instagram` fallback'i gosterilecek; kirik img ikonu kalmayacak.

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj` basarili, 0 uyari, 0 hata.
- `npm run lint` basarili; sadece daha onceden kalan `lib/data.ts` icinde `mapOutbreak` unused warning var.
- `npm run build` basarili.
- `dotnet publish backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -c Release -o backend\\publish\\HantaWorld.AdminApi` basarili.

Canliya alma notu:

- Backend publish klasoru sunucuya yuklenmeli:
  - `backend\\publish\\HantaWorld.AdminApi`
- Sonra setup endpoint tekrar calistirilmali:
  - `/setup/apply-admin-panel-updates?key=...`
- Panelde ilgili Instagram postuna guvenilir bir kapak gorseli URL girilmeli.
- Frontend degisiklikleri push edilmedi; kullanici `push et` demeden push yapilmayacak.

## 41. Instagram Widget Kapatma ve Sadece Link Ikonu Kullanma

Tarih: 2026-05-15

Kullanici talimati:

- Musteri Instagram widget/post kartlarini istemedi.
- Instagram alani kapatilacak.
- Sadece Instagram ikonu eklenecek.
- Ikona tiklaninca `hanta.world` Instagram hesabina gidilecek.

Yapilan lokal frontend degisiklikleri:

- Ana sayfadaki Instagram widget render akisi kaldirildi.
- `getInstagramPosts()` frontend data fonksiyonu kaldirildi.
- `InstagramPost` frontend tipi kaldirildi.
- `components/dashboard/InstagramUpdates.tsx` silindi.
- `data/instagram-posts.json` silindi.
- Navbar sag tarafina Instagram ikon linki eklendi:
  - URL: `https://www.instagram.com/hanta.world/`
  - Ikon: `Camera`
  - Yeni sekmede acilir.

Kontrol kaydi:

- `npm run lint` basarili; sadece daha onceden kalan `lib/data.ts` icinde `mapOutbreak` unused warning var.
- `npm run build` basarili.

Dikkat:

- Bu degisiklik sadece frontend tarafidir.
- Backend tarafindaki daha once eklenen Instagram admin/API dosyalari lokal olarak duruyor; bu adimda commit/push edilmeyecek.
- Push yapilmadi.

## 42. Ulke Kartlari Veri Duzeltmesi - Canada ve MV Hondius Dagilimi

Tarih: 2026-05-20

Kullanici talimati:

- Ulke kartlarindaki vaka/olum sayilari guncellenecek.
- Push yapilmayacak.

Yapilan frontend veri degisiklikleri:

- `data/outbreaks.json` guncellendi.
- `data/countries.json` guncellendi.
- `data/global-stats.json` son guncelleme tarihi `2026-05-20T00:00:00Z` yapildi.

Ulke karti hedef durumlari:

- United Kingdom: 3 vaka / 0 olum, degismedi.
- Germany: 0 vaka / 1 olum, degismedi.
- South Africa: 1 vaka / 0 olum olarak guncellendi.
- Switzerland: 1 vaka / 0 olum, degismedi.
- Spain: 1 vaka / 0 olum, degismedi.
- France: 1 vaka / 0 olum, degismedi.
- United States: 0 vaka / 0 olum olarak revize edildi; aktif pozitif vaka yok, izlem/karantina baglami aciklamaya islendi.
- Argentina: 0 vaka / 0 olum, high risk/endemic exposure source baglami korunuyor.
- Netherlands: 3 vaka / 2 olum, degismedi.
- Canada: yeni ulke olarak eklendi, 1 vaka / 0 olum, risk seviyesi `high`.

Canada kaydi:

- `countries.json` icine `c-canada` eklendi.
- `outbreaks.json` icine `o-canada-andes-2026` eklendi.
- Kaynak baglami CDC/WHO MV Hondius guncellemesi olarak not edildi.

Kontrol kaydi:

- `npm run lint` basarili; sadece daha onceden kalan `lib/data.ts` icinde `mapOutbreak` unused warning var.
- `npm run build` basarili.

Dikkat:

- Bu degisiklik sadece frontend JSON verileri icindir.
- Backend/DB dosyalarina dokunulmadi.
- Push yapilmadi.

## 43. Android Mobil Uygulama ve Push Notification Altyapisi

Tarih: 2026-05-20

Kullanici talimati:

- Android-only Expo mobil uygulama ilk fazi uygulanacak.
- Mobil uygulama dili sadece English olacak.
- Harita mobil ilk faza dahil edilmeyecek.
- Haber `verified + published` oldugunda sadece `Send push notification when published` seciliyse push gonderilecek.
- Ayni `expo_push_token` tekrar gelirse yeni cihaz kaydi acilmayacak; mevcut kayit guncellenecek ve `last_seen_at` yenilenecek.
- Her onemli karar ve degisiklik bu dosyaya yazilacak.
- Push/commit/canliya alma kullanici acikca istemeden yapilmayacak.

Yapilan backend degisiklikleri:

- `Article` kaydina push kontrol alanlari eklendi:
  - `send_push_on_publish`
  - `notification_sent_at`
  - `notification_sent_by`
  - `notification_send_count`
  - `last_notification_sent_at`
- Mobil bildirim domain entity'leri eklendi:
  - `MobileDevice`
  - `MobileNotification`
  - `MobileNotificationDelivery`
- Mobil cihaz API endpointleri eklendi:
  - `POST /api/mobile/devices`
  - `GET /api/mobile/notifications`
  - `POST /api/mobile/notifications/{id}/read`
- Push gonderimi controller icine gomulmedi; ayri servislerle ayrildi:
  - `PushNotificationService`
  - `MobileNotificationService`
- Expo push API istegi servis uzerinden yapiliyor; ileride background job/queue yapisina tasinabilecek sekilde ayrildi.
- Expo token tekrar gelirse `mobile_devices` uzerinde upsert yapiliyor; yeni satir acilmiyor.

Yapilan admin panel degisiklikleri:

- Haber formuna `Send push notification when published` checkbox'i eklendi.
- Checkbox varsayilan kapali kalacak.
- Haber `verified + published` ve checkbox aciksa ilk yayin kaydinda otomatik push gonderimi tetikleniyor.
- Intelligence Feed listesine push gonderim sayisi ve son gonderim tarihi eklendi.
- `Send Push` manuel butonu eklendi.
- Ayni habere daha once bildirim gonderildiyse panelde `Notification was already sent. Send again?` uyari onayi gosteriliyor.

Yapilan DB/setup degisiklikleri:

- `database/07_mobile_push_notifications.sql` eklendi.
- Script `articles` tablosuna push alanlarini idempotent ekliyor.
- Script `mobile_devices`, `mobile_notifications`, `mobile_notification_deliveries` tablolarini idempotent olusturuyor.
- `expo_push_token` icin unique index eklendi.
- Notification/news/device iliskileri icin FK ve indexler eklendi.
- `database/01_mssql_schema.sql` tam kurulum semasina ayni yapilar eklendi.
- `setup/apply-admin-panel-updates` endpoint'i artik `07_mobile_push_notifications.sql` scriptini de calistiracak.

Yapilan mobil Expo degisiklikleri:

- Yeni `mobile/` klasoru olusturuldu.
- Expo Router + TypeScript Android uygulama iskeleti eklendi.
- Ana ekranlar eklendi:
  - Dashboard
  - News
  - News Detail
  - Notifications
  - Hantavirus Info
  - Andes Virus
  - Symptoms
  - Methodology
- Dashboard verileri admin API'den cekiliyor:
  - `/api/global-stats`
  - `/api/global-stats/trend`
  - `/api/news`
- Push izin akisi eklendi:
  - Uygulama acilista izin ister.
  - Expo push token alinir.
  - Token `POST /api/mobile/devices` ile backend'e gonderilir.
  - Bildirime tiklaninca ilgili haber detayina yonlendirme yapilir.
- Bildirimler ekrani cihaza ait bildirim gecmisini backend'den okur.

Dikkat:

- Bu faz backend, DB ve yeni mobil klasor degisiklikleri icerir.
- GitHub push yapilmadi.

## 2026-06-01 - Google AdSense Auto Ads entegrasyonu

Kural hatirlatma:

- Kullanici acikca `push et` demeden GitHub push yapilmayacak.
- Bu islemde push yapilmadi.

Kapsam:

- Sadece web frontend tarafinda Google AdSense Auto Ads global script entegrasyonu yapildi.
- Manuel reklam component'i veya sayfa ici reklam yerlesimi eklenmedi.
- Harita, dashboard kartlari, feed ve veri tablolarinin icine reklam koyulmadi.

Yapilanlar:

- `.env.example` dosyasi eklendi:
  - `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-1333313233367768`
- `app/layout.tsx` icinde AdSense client ID environment degiskeninden okunacak hale getirildi.
- AdSense Auto Ads scripti yalnizca su kosullarda yuklenir:
  - `NODE_ENV === "production"`
  - `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID` doluysa.
- Script global layout head tarafinda `next/script` ile eklendi:
  - `async`
  - `strategy="afterInteractive"`
  - `crossOrigin="anonymous"`
- Client ID yoksa site hata vermez ve script render edilmez.
- Local/development ortaminda AdSense scripti yuklenmez.
- Layout metadata icindeki `real-time` ifadeleri daha temkinli `source-attributed` diline cekildi.
- Privacy Policy reklam bolumu guncellendi:
  - Google AdSense Auto Ads
  - Google AdMob
  - cookies
  - third-party advertising identifiers
  - browser/mobile advertising preference controls
- Disclaimer ve Methodology sayfalari kontrol edildi:
  - Medical advice vermedigi acik.
  - WHO, CDC, ECDC ve official health ministry kaynak atiflari korunuyor.

Degisen dosyalar:

- `.env.example`
- `.gitignore`
- `app/layout.tsx`
- `app/legal/privacy/page.tsx`
- `hantaworld.md`

Kontrol:

- `npx tsc --noEmit --incremental false` basarili.
- `npm run lint` basarili; mevcut `lib/data.ts` icinde `mapOutbreak` unused warning devam ediyor.
- `npm run build` basarili.

Canli/Vercel notu:

- Vercel production ortaminda `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID` environment variable olarak tanimli olmali.
- Deger:
  - `ca-pub-1333313233367768`
- GitHub push yapilmadi.
- Canliya alma icin backend publish alinip Plesk/FileZilla ile yuklenmeli, sonra setup endpoint calistirilmalidir.

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj` basarili, 0 uyari, 0 hata.
- `dotnet publish backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -c Release -o backend\\publish\\HantaWorld.AdminApi` basarili.
- Publish klasoru:
  - `backend\\publish\\HantaWorld.AdminApi`
- Publish icinde `DatabaseScripts\\07_mobile_push_notifications.sql` dosyasinin olustugu kontrol edildi.
- Mobil Expo tarafinda dependency install/build henuz calistirilmadi; `mobile/` klasoru kod olarak eklendi.

Expo Go lokal test notu:

- Android telefonda Expo Go acilisinda `Cannot find module 'babel-preset-expo'` hatasi goruldu.
- Neden: Paket `node_modules\\expo\\node_modules\\babel-preset-expo` altinda kurulu ama Metro proje kokunden `babel-preset-expo` ismini cozemedi.
- Gecici/pratik lokal test cozumunde `mobile\\babel.config.js` preset yolu `require.resolve("expo/node_modules/babel-preset-expo")` olarak netlestirildi.
- Bu degisiklik mobil lokal calistirma icindir; backend veya canli siteyi etkilemez.
- Sonraki kontrolde `npx tsc --noEmit` basarili calisti.
- `npx expo export --platform android --output-dir .expo-export-test` basarili calisti; Android bundle uretildi.
- Bu nedenle splash ekraninda kalma sorununun kod derleme hatasindan cok Expo Go'nun Metro sunucusuna baglanamamasi veya eski cache'i acmasi olasi goruldu.

Expo Go hata duzeltmesi:

- Expo Go icinde `expo-notifications` remote push destegi SDK 53 sonrasi kaldirildigi icin console error goruldu.
- Cozum: `Constants.appOwnership === "expo"` iken push token alma ve backend'e cihaz kaydi atlandi.
- Gercek push notification testi Expo Go ile degil, development build/APK ile yapilacak.
- `react-native-gifted-charts` Expo Go icinde `expo-linear-gradient` native paketini bekledigi icin hata verdi.
- Cozum: mobil grafik componenti native ekstra paket istemeyen basit custom cizgi grafik olarak yeniden yazildi.
- `react-native-gifted-charts` dependency'si mobil `package.json` dosyasindan kaldirildi.
- Kontrol: `npx tsc --noEmit` basarili, `npx expo export --platform android --output-dir .expo-export-test` basarili.

Mobil ulke kartlari:

- Kullanici mobil uygulamaya ulke kartlarinin da eklenmesini istedi.
- Mobil dashboard artik `/api/outbreaks` endpoint'inden verified + published outbreak verilerini cekiyor.
- Outbreak kayitlari ulke bazinda gruplanip mobil `Country Risk Monitor` alani olusturuluyor.
- Kartlarda ulke adi, ISO kodu, kita, vaka sayisi, olum sayisi, aktif outbreak sayisi, status ve risk seviyesi gosteriliyor.
- Risk siralamasi `critical`, `high`, `medium`, `low` onceligine gore yapiliyor.
- Yeni component:
  - `mobile\\components\\CountryRiskCard.tsx`
- Guncellenen dosyalar:
  - `mobile\\app\\index.tsx`
  - `mobile\\lib\\api.ts`
  - `mobile\\lib\\types.ts`
- Kontrol: `npx tsc --noEmit` basarili, `npx expo export --platform android --output-dir .expo-export-test` basarili.

## 44. Admin Country Cards Sadelestirme ve Web/Mobile Gorunum Tikleri

Tarih: 2026-05-21

Kullanici talimati:

- Paneldeki kart ekleme sayfasi calismiyor/karisik gorunuyor.
- Sadece kart ekleme amacina hizmet eden sade bir ekran isteniyor.
- Kart eklenirken web ve mobil icin ayri tikler olsun.
- Kart hem web sitesinde hem mobil uygulamada secime gore gorunsun.

Alinan karar:

- Mevcut `AdminMap` bolumu teknik olarak outbreak/marker yonetiyor; kullanici tarafinda ise ulke karti ve harita noktasi olarak algilaniyor.
- Bu nedenle ekran adlari ve form `Country Cards` mantigina sadelestirildi.
- Teknik alanlar arka planda otomatik kalacak:
  - `PublicId`
  - `Slug`
  - `verification_status`
  - `publication_status`
  - `confidence_score`
  - tarih alanlari
- Koordinat girilmezse secilen ulkenin latitude/longitude degerleri kullanilacak.

Yapilan backend/admin degisiklikleri:

- `Outbreak` entity'sine iki alan eklendi:
  - `ShowOnWebsite`
  - `ShowOnMobile`
- EF mapping icine `show_on_website` ve `show_on_mobile` kolonlari eklendi.
- `OutbreakFormViewModel` icine web/mobile gorunum tikleri eklendi.
- `AdminMapController` create/edit akisi bu tikleri kaydedecek sekilde guncellendi.
- Create varsayilani artik `published + verified`, `ShowOnWebsite=true`, `ShowOnMobile=true`.
- Admin form sade hale getirildi:
  - Ulke
  - Kart basligi
  - Kart aciklamasi
  - Cases
  - Deaths
  - Probable/Suspected
  - Risk
  - Status
  - Verified date
  - Source URL
  - Show on website
  - Show on mobile app
- Koordinat alanlari `Advanced map position` altina alindi.
- Index sayfasi `Country Cards` olarak yeniden adlandirildi ve Web/Mobile badge'leri eklendi.

Yapilan API/mobil degisiklikleri:

- `/api/outbreaks` endpoint'i `surface` query parametresi alacak sekilde guncellendi.
- Varsayilan davranis web icindir:
  - `/api/outbreaks` => sadece `show_on_website = 1`
- Mobil uygulama artik su endpoint'i cagirir:
  - `/api/outbreaks?surface=mobile`
- Mobil ulke kartlari sadece `show_on_mobile = 1` olan kayitlari gorecek.

Yapilan DB/setup degisiklikleri:

- `database/08_outbreak_surface_visibility.sql` eklendi.
- Script `outbreaks` tablosuna idempotent olarak su kolonlari ekler:
  - `show_on_website BIT NOT NULL DEFAULT 1`
  - `show_on_mobile BIT NOT NULL DEFAULT 1`
- `database/01_mssql_schema.sql` tam kurulum semasina ayni kolonlar ve index eklendi.
- `setup/apply-admin-panel-updates` endpoint'i artik `08_outbreak_surface_visibility.sql` scriptini de calistiracak.

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj` basarili, 0 uyari, 0 hata.
- `npx tsc --noEmit` mobil tarafta basarili.
- `npx expo export --platform android --output-dir .expo-export-test` basarili.
- `dotnet publish backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -c Release -o backend\\publish\\HantaWorld.AdminApi` basarili.

Dikkat:

- GitHub push yapilmadi.
- Canli admin panelde bu degisikligi gormek icin backend publish klasoru sunucuya yuklenmeli ve setup endpoint tekrar calistirilmelidir.

## 45. Mobil AdMob Banner Entegrasyonu

Tarih: 2026-05-21

Kullanici talimati:

- Mobil uygulamada reklam almak isteniyor.
- Kullanici AdMob hesabini olusturdu ve Android App ID ile Banner Ad Unit ID paylasti.

AdMob bilgileri:

- Android App ID:
  - `ca-app-pub-1333313233367768~9415536183`
- Banner Ad Unit ID:
  - `ca-app-pub-1333313233367768/5033438042`

Yapilan mobil degisiklikleri:

- `react-native-google-mobile-ads` paketi kuruldu.
- `mobile\\app.json` icine Google Mobile Ads config plugin eklendi.
- Android AdMob App ID app config'e islendi.
- Banner reklam birimi ID'si `extra.adMobBannerAdUnitId` olarak eklendi.
- Yeni component eklendi:
  - `mobile\\components\\AdBanner.tsx`
- Banner yerlesimleri:
  - Dashboard ekraninda trend grafiginden sonra.
  - News detail ekraninda haber icerigi/source butonundan sonra.

Test/release karari:

- Development modda Google test banner ID kullanilir.
- Release/development build tarafinda gercek Banner Ad Unit ID hazir durur.
- Expo Go native AdMob modulunu calistirmadigi icin Expo Go'da reklam yerine placeholder gorunur.
- Gercek reklam testi APK/development build ile yapilacak.

Kontrol kaydi:

- `npx tsc --noEmit` basarili.
- `npx expo export --platform android --output-dir .expo-export-test` basarili.

Dikkat:

- Google Play tarafinda uygulama yayin/inner test asamasina geldiginde AdMob uygulama magaza baglantisi tamamlanmali.
- Daha sonra `https://www.hantaworld.com/app-ads.txt` dosyasi gerekecek.
- GitHub push yapilmadi.

## 46. Google Play AAB Build Hazirligi

Tarih: 2026-05-21

Kullanici talimati:

- Google Play'e yuklemek icin `.aab` dosyasi hazirlansin.

Durum:

- Lokal makinede Java komutu bulunamadi.
- `ANDROID_HOME` / `ANDROID_SDK_ROOT` ortam degiskenleri bulunamadi.
- Bu nedenle lokal Gradle ile AAB almak icin gerekli Android build ortami hazir degil.
- En uygun yol Expo EAS cloud build olarak belirlendi.

Yapilan degisiklik:

- `mobile\\eas.json` dosyasi eklendi.
- `production` profili Android icin `app-bundle` yani `.aab` uretmek uzere ayarlandi.
- `development` ve `preview` profilleri dahili APK test icin ayrildi.

Kontrol:

- `npx eas-cli --version` calisti ve `eas-cli/19.0.5` goruldu.
- `npx eas-cli whoami` sonucu `Not logged in`.

Sonraki adim:

- Bilgisayarda Expo hesabi ile `npx eas-cli login` yapilmali.
- Ardindan `npx eas-cli build --platform android --profile production` calistirilerek AAB cloud build baslatilmali.
- Build tamamlaninca EAS download linkinden `.aab` indirilecek ve Google Play Console Dahili test surumune yuklenecek.

Dikkat:

- GitHub push yapilmadi.

EAS build hata kaydi:

- Kullanici `npx eas-cli build --platform android --profile production` komutunu calistirdi.
- EAS projesi olustu:
  - `@selcukcakirexpodev/hantaworld-mobile`
  - Project ID: `878f308d-7ffa-43f3-94ab-fc405222df86`
- Android keystore Expo server tarafinda olusturuldu.
- Build `Install dependencies` asamasinda `Unknown error` ile dustu.
- Olası neden: Lokal kurulumda da gorulen npm peer dependency cakismalari. Lokal kurulum `--legacy-peer-deps` ile basarili olmustu.
- Cozum olarak `mobile\\.npmrc` eklendi:
  - `legacy-peer-deps=true`
  - `engine-strict=false`
- Kontrol: `npx tsc --noEmit` basarili.
- Kontrol: `npx expo export --platform android --output-dir .expo-export-test` basarili.
- Sonraki adim: kullanici ayni EAS production build komutunu tekrar calistiracak.

EAS build basari kaydi:

- Kullanici ikinci EAS production build komutunu calistirdi.
- Build basarili tamamlandi.
- Android AAB linki:
  - `https://expo.dev/artifacts/eas/5KsqHvsvwDmHqBbeneM4V3.aab`
- Google Play Dahili test kanalina AAB yuklendi.
- Test linki ilk etapta `App not available` verdi.
- Neden: Google Play Console uygulama icerik/kurulum gorevleri tamamlanmadigi icin test linki aktif kullanilabilir hale gelmedi.

## 47. Google Play Privacy Policy Sayfasi

Tarih: 2026-05-21

Kullanici talimati:

- Google Play Console gizlilik politikasi URL istiyor.

Yapilan frontend degisiklikleri:

- Mevcut `app\\legal\\privacy\\page.tsx` guncellendi.
- Privacy policy artik web sitesi, Android app, push notification, AdMob reklam, analytics ve teknik veri kullanimini kapsiyor.
- Kisa Play Console URL'i icin yeni sayfa eklendi:
  - `app\\privacy-policy\\page.tsx`
- Hedef canli URL:
  - `https://www.hantaworld.com/privacy-policy`

Kontrol kaydi:

- `npm run lint` basarili.
- Bilinen mevcut uyari devam ediyor:
  - `lib\\data.ts` icinde `mapOutbreak` unused warning.
- `npm run build` calistirildi ancak kod hatasi disinda `EPERM: operation not permitted, open '.next\\trace'` hatasi verdi.
- Olası neden: `.next\\trace` dosyasinin calisan Next/Node sureci tarafindan kilitlenmesi.

Dikkat:

- Bu URL'in Google Play'de kullanilabilmesi icin frontend degisikligi GitHub'a push edilip Vercel deploy tamamlanmali.
- Kullanici acikca `push et` demeden push yapilmayacak.

## 48. Google Play App Icon

Tarih: 2026-05-21

Kullanici talimati:

- Google Play uyumlu 512x512 PNG uygulama ikonu olusturulacak.
- Mevcut HantaWorld marka kimligi kullanilacak.
- Dosya adi `play-store-icon.png` olacak.

Yapilan islem:

- Mevcut logo dosyalari incelendi:
  - `public\\hantaLogo.png`
  - `public\\hantaWorldLogo.jpg`
- Play Store kucuk onizlemelerinde okunabilirlik icin yazili tam logo yerine kalkan/virus amblemi merkeze alindi.
- Koyu HantaWorld arka plan uzerinde 512x512 PNG ikon olusturuldu:
  - `play-store-icon.png`

Kontrol kaydi:

- Dosya olcusu: 512x512.
- Dosya formati: PNG.
- Dosya boyutu: yaklasik 179 KB.
- Push yapilmadi.

## 49. Google Play Feature Graphic

Tarih: 2026-05-21

Kullanici talimati:

- Google Play icin feature graphic olusturulacak.
- Olcu: 1024x500 px.
- Format: PNG.
- Metinler:
  - `HantaWorld`
  - `Global Hantavirus Updates`
  - `News • Statistics • Trends • Public Health Sources`
- Stil: temiz, medikal/public health temali, koyu mavi ve beyaz, subtile world map arka plan, profesyonel, yaniltici medikal iddia yok.

Yapilan islem:

- Mevcut HantaWorld amblemi kullanildi.
- Koyu mavi arka plan, hafif grid, subtile world map noktalar ve profesyonel public health kompozisyonu hazirlandi.
- Dosya olusturuldu:
  - `play-feature-graphic.png`

Kontrol kaydi:

- Dosya olcusu: 1024x500.
- Dosya formati: PNG.
- Dosya boyutu: yaklasik 190 KB.
- Push yapilmadi.

Guncelleme:

- Kullanici ayni dosya icin yeni feature graphic istedi.
- Yeni gereksinimler:
  - 1024x500 exact size.
  - PNG.
  - Transparan arka plan olmayacak.
  - Tum canvas dolu olacak.
  - Landscape layout.
  - Metin buyuk ve okunabilir olacak.
  - Metinler:
    - `HantaWorld`
    - `Global Hantavirus Updates`
    - `News • Statistics • Trends`
- `play-feature-graphic.png` yeniden olusturuldu.
- Kontrol sonucu:
  - Olcu: 1024x500.
  - Pixel format: `Format24bppRgb` yani opak/transparan degil.
  - Dosya boyutu: yaklasik 166 KB.
  - Push yapilmadi.

## 50. Google Play Phone Screenshots

Tarih: 2026-05-21

Kullanici talimati:

- HantaWorld Android app icin Google Play telefon ekran goruntuleri hazirlanacak.
- En az 4 adet, dikey PNG, tercihen 1080x1920.
- Ekranlar:
  - Dashboard
  - News list
  - News detail
  - Notifications
  - Hantavirus info
- Arayuz Ingilizce olacak.
- Yaniltici saglik iddiasi veya `diagnosis`, `treatment`, `cure`, `official government app` ifadeleri kullanilmayacak.

Yapilan islem:

- Mobil uygulamadaki gercek ekran dosyalari incelendi:
  - `mobile\\app\\index.tsx`
  - `mobile\\app\\news\\index.tsx`
  - `mobile\\app\\news\\[slug].tsx`
  - `mobile\\app\\notifications.tsx`
  - `mobile\\app\\info\\hantavirus.tsx`
- Bu oturumda Android cihaz/emulator uzerinden otomatik ekran yakalama yapilamadi.
- Uygulamanin mevcut ekran yapisi, renkleri, kart duzeni ve Ingilizce metinleri baz alinarak Play Store uyumlu 1080x1920 statik screenshot gorselleri hazirlandi.
- Sahte ozellik eklenmedi; mevcut ekran tipleri demo veriyle temsil edildi.

Olusturulan dosyalar:

- `assets\\store\\play-screenshot-01-dashboard.png`
- `assets\\store\\play-screenshot-02-news-list.png`
- `assets\\store\\play-screenshot-03-news-detail.png`
- `assets\\store\\play-screenshot-04-notifications.png`
- `assets\\store\\play-screenshot-05-info.png`

Kontrol kaydi:

- Tum dosyalar 1080x1920 PNG.
- Pixel format: `Format24bppRgb`.
- Push yapilmadi.

## 51. Google Play 7-inch Tablet Screenshot Talebi

Tarih: 2026-05-21

Kullanici talimati:

- HantaWorld Android app icin Google Play 7-inch tablet screenshotlari olusturulacak.
- Ozellikle gercek uygulama ekranlari isteniyor; sahte mockup uretilmeyecek.
- 7-inch Android tablet emulator/device uzerinden ekran goruntusu alinacak.

Kontrol kaydi:

- Bu oturumda `adb` komutu PATH icinde bulunamadi.
- Bu oturumda `emulator` komutu PATH icinde bulunamadi.
- `$env:LOCALAPPDATA\\Android\\Sdk` altinda `adb.exe` / `emulator.exe` bulunamadi.
- Sonuc: Gercek Android tablet emulator/device ekran goruntusu bu oturumdan alinamadi.

Karar:

- Kullanici ozellikle gercek app ekranlari istedigi icin statik/sahte tablet mockup uretilmedi.
- Screenshot uretimi icin Android Studio/SDK ve 7-inch tablet emulator kurulumu veya bagli cihaz erisimi gerekiyor.
- Push yapilmadi.

## 52. Mevcut Tablet Gorsellerinin 16:9 Donusumu

Tarih: 2026-05-21

Kullanici talimati:

- Masaustundeki uc tablet gorseli 16:9 tablet boyutuna cevrilecek:
  - `C:\\Users\\Ceyda\\Desktop\\tablet1.png`
  - `C:\\Users\\Ceyda\\Desktop\\tablet2.png`
  - `C:\\Users\\Ceyda\\Desktop\\tablet3.png`

Yapilan islem:

- Gorseller 1920x1080 PNG olarak yeniden hazirlandi.
- Icerik kirpilmadi; 16:9 canvas uzerine sigdirildi.
- Bos kalan alanlar HantaWorld koyu tema/grid arka plani ile dolduruldu.

Olusturulan dosyalar:

- `assets\\store\\play-tablet7-01-dashboard-hero.png`
- `assets\\store\\play-tablet7-02-dashboard-stats.png`
- `assets\\store\\play-tablet7-03-trend.png`

Kontrol kaydi:

- Tum dosyalar 1920x1080.
- Aspect ratio: 16:9.
- Format: PNG.
- Pixel format: `Format24bppRgb`.
- Her dosya 8 MB altinda.
- Push yapilmadi.

## 53. Mevcut Tablet Gorsellerinin 10-inch Play Store Donusumu

Tarih: 2026-05-21

Kullanici talimati:

- Ayni uc tablet gorseli Google Play 10 inç tablet ekran goruntusu kurallarina gore ayarlanacak.
- Kural:
  - En fazla 8 adet.
  - Kenarlar 1080 ile 7680 piksel arasinda olacak.
  - 16:9 veya 9:16 oran.
  - PNG/JPEG.
  - Her dosya 8 MB altinda.

Yapilan islem:

- Gorseller 2560x1440 PNG olarak yeniden hazirlandi.
- 16:9 oran korundu.
- Icerik kirpilmadan 10 inç tablet ekran goruntusu alanina sigdirildi.
- Bos alanlar HantaWorld koyu tema/grid arka plani ile tamamlandi.

Olusturulan dosyalar:

- `assets\\store\\play-tablet10-01-dashboard-hero.png`
- `assets\\store\\play-tablet10-02-dashboard-stats.png`
- `assets\\store\\play-tablet10-03-trend.png`

Kontrol kaydi:

- Tum dosyalar 2560x1440.
- Aspect ratio: 16:9.
- Format: PNG.
- Pixel format: `Format24bppRgb`.
- Her dosya 8 MB altinda.
- Push yapilmadi.

## 54. Mobil Push Bildirim Gelmeme Kontrolu

Tarih: 2026-05-22

Kullanici bildirimi:

- Google Play test kullanicisi olarak uygulama acildi.
- Uygulama kurulumunda bildirim izni verildi.
- Admin panelden yeni haber girildi.
- Haber uygulamada gorundu ancak push bildirim gelmedi.

Kod kontrolu:

- Mobil uygulama acilista `registerForPushNotificationsAsync()` cagiriyor.
- Expo push token alininca `POST /api/mobile/devices` endpointine kaydediliyor.
- Haber otomatik push icin su kosullara bagli:
  - `Send push notification when published` checkbox acik olmali.
  - Haber `verified` olmali.
  - Haber `published` olmali.
  - Daha once notification gonderilmemis olmali.
- Haber listesinde manuel `Send Push` butonu var; verified + published haber icin tekrar push denenebilir.

Olası nedenler:

- Haber olustururken `Send push notification when published` checkbox secilmemis olabilir.
- Mobil cihaz tokeni DB'deki `mobile_devices` tablosuna kaydolmamis olabilir.
- Push gonderimi denenmis ama `mobile_notification_deliveries` tablosunda Expo/FCM hatasi olusmus olabilir.
- Expo Android push icin FCM credentials eksik olabilir; Expo dokumanina gore Android push icin FCM/EAS credentials kurulumu gerekir.

Sonraki kontrol:

- DB'de `mobile_devices`, `mobile_notifications`, `mobile_notification_deliveries` tablolari kontrol edilmeli.
- Admin panelde ilgili haberin `Sent` sayisi kontrol edilmeli.
- Gerekirse manuel `Send Push` butonu ile tek haber icin test gonderimi yapilmali.

## 55. Admin Mobile Push Debug Sayfasi

Tarih: 2026-05-22

Kullanici talimati:

- Mobil push bildirimin neden ulasmadigini anlamak icin gecici read-only admin debug sayfasi eklenecek.
- Sayfa public olmayacak.
- Sadece yetkili admin girisinden sonra erisilecek.
- Token tam gosterilmeyecek; sadece ilk 20 karakter + `...` gosterilecek.
- `mobile_devices`, `mobile_notifications`, `mobile_notification_deliveries` tablolarinin son 20 kaydi listelenecek.
- `mobile_notification_deliveries.status` ve `error_message` alanlari net gosterilecek.
- Veri silme, guncelleme veya tekrar push gonderme islemi eklenmeyecek.

Yapilan backend degisiklikleri:

- Yeni controller eklendi:
  - `backend\\HantaWorld.AdminApi\\Controllers\\AdminMobilePushDebugController.cs`
- Yeni admin route:
  - `/admin/mobile-push-debug`
- Yetki:
  - `[Authorize(Policy = "RequireAdmin")]`
  - Sadece `superadmin` ve `admin` rollerine acik.
- Yeni view eklendi:
  - `backend\\HantaWorld.AdminApi\\Views\\AdminMobilePushDebug\\Index.cshtml`
- Yeni view modeller eklendi:
  - `MobilePushDebugViewModel`
  - `MobileDeviceDebugRow`
  - `MobileNotificationDebugRow`
  - `MobileNotificationDeliveryDebugRow`
- View sadece read-only tablo gosteriyor.
- `error_message` bos degilse satir `table-danger` ile dikkat cekiyor.
- Delivery kayitlari en yeni `sent_at` / notification `created_at` sirasina gore geliyor.
- Admin menüsüne link eklenmedi; route uzerinden erisilecek.

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj` basarili.
- Build sonucu: 0 hata, 0 uyari.
- Push yapilmadi.

## 56. Backend Publish - Mobile Push Debug

Tarih: 2026-05-22

Kullanici talimati:

- Backend icin Release publish alinacak.
- Proje:
  - `backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj`
- Cikti kolay bulunacak bir klasore konacak:
  - `backend-publish`
- Sunucuya yukleme yapilmayacak.

Yapilan islem:

- Komut calistirildi:
  - `dotnet publish backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -c Release -o backend-publish`
- Publish basarili tamamlandi.

Publish cikti yolu:

- `C:\\Users\\Ceyda\\.gemini\\antigravity\\scratch\\hantaworld\\backend-publish`

Kontrol kaydi:

- Publish klasorunde 123 dosya var.
- Ana dosyalar:
  - `HantaWorld.AdminApi.dll`
  - `HantaWorld.AdminApi.exe`
  - `web.config`
  - `appsettings.json`
  - `DatabaseScripts\\`
  - `wwwroot\\`
  - `runtimes\\`
- Push yapilmadi.

## 57. Mobile Push Token Registration Debug/Fix

Tarih: 2026-05-22

Kullanici bildirimi:

- Canli admin debug sayfasinda:
  - `mobile_devices` bos.
  - `mobile_notifications` icinde bildirim kaydi var.
  - `mobile_notification_deliveries` bos.
- Sonuc: Haber push tetikleniyor, ancak mobil cihaz token kaydi backend'e yapilmiyor.

Tespit:

- Mobil uygulama acilista push registration calistiriyor ancak hata durumlari yutuluyordu.
- `registerForPushNotificationsAsync().catch(() => null)` nedeniyle token alma/API kayit hatasi gorunmuyordu.
- Android notification channel kurulumu yoktu.
- Backend request model alanlari camelCase/PascalCase varsayimina birakilmisti.

Yapilan mobil degisiklikler:

- `mobile\\lib\\push.ts`
  - Android icin `Notifications.setNotificationChannelAsync("default", ...)` eklendi.
  - Permission durumu loglanmaya baslandi.
  - Expo `projectId` kontrolu netlestirildi; eksikse acik hata uretir.
  - Expo push token alma sonucu maskeli loglanir.
  - `/api/mobile/devices` kayit sonucu maskeli loglanir.
  - Hatalar artik `console.error("[HantaWorld Push] ...")` ile gorulur.
- `mobile\\lib\\api.ts`
  - POST hata durumunda HTTP status + response body ile hata ureten `postJsonWithStatus` eklendi.
  - `registerMobileDevice` bu net hata mekanizmasini kullanir.
- `mobile\\app\\_layout.tsx`
  - Push registration catch blogu artik hatayi console'a yazar.

Yapilan backend degisiklikler:

- `backend\\HantaWorld.AdminApi\\Models\\PublicApiDtos.cs`
  - `MobileDeviceRegistrationRequest` ve `MobileNotificationReadRequest` alanlarina `JsonPropertyName` eklendi.
  - Mobil JSON alanlari acikca `expoPushToken`, `platform`, `deviceId`, `appVersion`, `locale` ile eslendi.
- `backend\\HantaWorld.AdminApi\\Controllers\\Api\\MobileController.cs`
  - Bos token istegi loglanir.
  - Basarili cihaz kaydi maskeli token preview ile loglanir.
- `backend\\HantaWorld.AdminApi\\Services\\MobileNotificationService.cs`
  - Cihaz upsert sonucu backend loguna yazilir.

Kontrol kaydi:

- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj` basarili.
- Backend build: 0 hata, 0 uyari.
- `npx tsc --noEmit` mobil TypeScript kontrolu basarili.
- Push yapilmadi.

Beklenen davranis:

- Yeni mobil build yuklendikten sonra uygulama acilinca izin verildiyse `mobile_devices` tablosunda en az bir kayit olusmali.
- Olusmazsa artik Android Logcat/console tarafinda hangi adimda hata oldugu gorulecek:
  - permission
  - projectId
  - Expo token alma
  - API base URL
  - `/api/mobile/devices` HTTP hata cevabi

## 58. Backend Publish - Mobile Push Token Registration Fix

Tarih: 2026-05-22

Kullanici talimati:

- Mobile push token registration fix sonrasinda backend publish alinacak.
- Publish klasor yolu tekrar bildirilecek.

Yapilan islem:

- Komut calistirildi:
  - `dotnet publish backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj -c Release -o backend-publish`
- Publish basarili tamamlandi.

Publish cikti yolu:

- `C:\\Users\\Ceyda\\.gemini\\antigravity\\scratch\\hantaworld\\backend-publish`

Kontrol kaydi:

- Publish klasorunde 123 dosya var.
- `HantaWorld.AdminApi.dll` guncellendi.
- Sunucuya yukleme yapilmadi.
- Push yapilmadi.

## 59. Android AAB Build - Mobile Push Token Registration Fix

Tarih: 2026-05-22

Kullanici talimati:

- Google Play'e yuklenecek yeni Android AAB build hazirlanacak.
- Bu ikinci surum/guncelleme olacak.
- APK degil AAB alinacak.
- `versionCode` mevcut yuklu surumden yuksek olacak.
- `versionName` / Expo `version` degeri `1.0.1` olacak.
- Google Play'e yukleme yapilmayacak.

Yapilan mobil ayar degisiklikleri:

- `mobile\\app.json`
  - `expo.version`: `1.0.1`
  - `android.versionCode`: `4`
- `mobile\\eas.json`
  - Production profilinde `android.buildType`: `app-bundle`
  - Production profilinde `autoIncrement`: `true`

Kontrol:

- `npx tsc --noEmit` basarili.
- EAS Android production build baslatildi:
  - `npx eas-cli build --platform android --profile production`
- Build ID:
  - `af2a506a-0ffe-4b36-86cd-7ad01e88bac5`
- Build durumu:
  - `FINISHED`
- Build profili:
  - `production`
- Distribution:
  - `STORE`
- App version / versionName:
  - `1.0.1`
- App build version / versionCode:
  - `4`

AAB linki:

- `https://expo.dev/artifacts/eas/nCxR91eUaS8meia3ZCjRf6.aab`

Not:

- Mobile push token registration duzeltmeleri bu build surecine dahil edildi.
- Google Play'e yukleme yapilmadi.
- GitHub push yapilmadi.

## 60. Mobile Push Visible Debug Panel ve APK Build

Tarih: 2026-05-22

Kullanici bildirimi:

- Sorun devam ediyor.
- Canli debug ekraninda:
  - `mobile_devices` halen bos.
  - `mobile_notifications` icinde yeni haber bildirim kayitlari olusuyor.
  - `mobile_notification_deliveries` halen bos.
- Sonuc: Cihaz token kaydi halen yapilmiyor.

Yapilan mobil degisiklikler:

- Dashboard ekranina gecici gorunur debug panel eklendi:
  - `mobile\\components\\PushRegistrationDebug.tsx`
- Panelde gorunen alanlar:
  - registration step
  - permission status
  - expo push token preview
  - API base URL
  - Expo/EAS projectId
  - backend status code
  - backend response body
  - registered device id
  - error
- Panelde `Retry push registration` butonu eklendi.
- Debug bilgisi `SecureStore` icinde saklanir ve 2 saniyede bir panelde yenilenir.
- `mobile\\lib\\push.ts` guncellendi:
  - Her kritik adim hem console'a hem debug storage'a yazilir.
  - Bildirim izni reddedilirse kullaniciya Android settings acma uyarisi gosterilir.
  - Android notification channel kurulumu devam ediyor.
  - Token alinmazsa hata gorunur hale gelir.
- `mobile\\lib\\api.ts` guncellendi:
  - Device registration POST icin status code ve response body yakalayan detayli helper eklendi.
- `mobile\\app\\index.tsx` guncellendi:
  - Dashboard'a `PushRegistrationDebug` paneli eklendi.

Kontrol:

- `npx tsc --noEmit` basarili.

APK build:

- Komut:
  - `npx eas-cli build --platform android --profile preview`
- Build ID:
  - `04ab2edd-af40-47b1-b083-bcde7107b3b2`
- Build profili:
  - `preview`
- Distribution:
  - `INTERNAL`
- Format:
  - APK
- App version / versionName:
  - `1.0.1`
- App build version / versionCode:
  - `4`
- Build durumu:
  - `FINISHED`

APK linki:

- `https://expo.dev/artifacts/eas/zrnPDRSXTSzfYDyem8Wjf.apk`

Test beklentisi:

- APK telefona kurulduktan sonra Dashboard'daki `Push Registration Debug` panelinde su alanlar kontrol edilecek:
  - `Permission`
  - `Token`
  - `API base URL`
  - `Backend status`
  - `Backend body`
  - `Error`
- Basarili durumda `Backend status` 200 ve debug panelde `Registered device` id gorunmeli.
- Sonra canli admin debug sayfasinda `mobile_devices` tablosunda kayit olusmali.

Not:

- Google Play'e yukleme yapilmadi.
- GitHub push yapilmadi.

## 61. Firebase Google Services ve Temiz Preview APK Build

Tarih: 2026-05-22

Kullanici bildirimi:

- Android APK debug panelinde push token alinmadan once su hata gorundu:
  - `Default FirebaseApp is not initialized in this process com.hantaworld.mobile`
- Kullanici Firebase tarafindan alinan `google-services.json` dosyasini `mobile` klasorune koydu.

Yapilan kontroller:

- `mobile\\google-services.json` dosyasi bulundu.
- Dosya icindeki Android `package_name` degeri kontrol edildi:
  - `com.hantaworld.mobile`
- `mobile\\app.json` icindeki Android package degeri kontrol edildi:
  - `com.hantaworld.mobile`
- Sonuc: Firebase Android app package ile Expo Android package birebir eslesiyor.

Yapilan mobil konfig degisikligi:

- `mobile\\app.json` icinde `android` bolumune su alan eklendi:
  - `"googleServicesFile": "./google-services.json"`

Kontrol:

- `npx tsc --noEmit` basarili.

Temiz APK build:

- Komut:
  - `npx eas-cli build --platform android --profile preview --clear-cache --non-interactive`
- Build ID:
  - `05b00e22-91bb-4e13-9b09-c4c963b424ea`
- Build profili:
  - `preview`
- Distribution:
  - `INTERNAL`
- Format:
  - APK
- App version / versionName:
  - `1.0.1`
- App build version / versionCode:
  - `4`
- Build durumu:
  - `FINISHED`

APK linki:

- `https://expo.dev/artifacts/eas/GJFC4kLpxQ1sJ2RrQ5u9J.apk`

Beklenen test sonucu:

- Bu APK telefona kurulduktan sonra uygulama acilisinda Firebase init hatasi gorunmemeli.
- Dashboard'daki `Push Registration Debug` panelinde token alinmali.
- Backend kaydi basariliysa panelde `Backend status` 200 gorunmeli.
- Canli admin debug sayfasinda `mobile_devices` tablosunda en az bir cihaz kaydi olusmali.

Not:

- Google Play'e yukleme yapilmadi.
- GitHub push yapilmadi.

## 62. Expo/EAS FCM V1 Credential Kontrolu

Tarih: 2026-05-22

Kullanici bildirimi:

- Mobil cihaz artik `mobile_devices` tablosuna kaydoldu.
- Yeni bildirim kaydi olusuyor.
- `mobile_notification_deliveries` kaydinda Expo/FCM hatasi gorundu:
  - `Unable to retrieve the FCM server key for the recipient's app.`
- Sonuc: Mobil app token kaydi calisiyor; eksik kalan parca Expo/EAS Android FCM credential.

Kullanici Firebase Admin SDK private key JSON dosyasini indirdi:

- `C:\\Users\\Ceyda\\Downloads\\hantaworld-firebase-adminsdk-fbsvc-c7fcc6acfe.json`

Yapilan guvenli kontroller:

- Admin SDK JSON icindeki `project_id`:
  - `hantaworld`
- `mobile\\google-services.json` icindeki Firebase project:
  - `hantaworld`
- Android package:
  - `com.hantaworld.mobile`
- Sonuc: Admin SDK JSON, mobil uygulamanin kullandigi Firebase projesiyle eslesiyor.

Islem durumu:

- Firebase Admin SDK private key dosyasi gizli servis hesabi anahtari oldugu icin Codex araci uzerinden Expo/EAS'e yukleme yapilmadi.
- Yukleme kullanicinin kendi terminalinden `npx eas-cli credentials -p android` ile yapilacak.
- Bu islem tamamlandiktan sonra yeni APK build gerekmez; mevcut Firebase iceren APK uzerinden yeniden haber/push testi yapilabilir.

Not:

- GitHub push yapilmadi.

## 63. Mobil Push Debug Temizligi ve Production AAB Build

Tarih: 2026-05-22

Kullanici bildirimi:

- Push notification testi basarili oldu.
- `mobile_devices` kaydi olustu.
- `mobile_notification_deliveries` son kayit `success`.
- Telefona bildirim geldi.

Yapilan production temizligi:

- Mobil uygulamadaki gecici gorunur `Push Registration Debug` paneli kaldirildi.
- `Retry push registration` debug butonu kaldirildi.
- Kullaniciya gorunen push debug metinleri temizlendi.
- `mobile\\components\\PushRegistrationDebug.tsx` dosyasi silindi.
- Dashboard uzerinden debug component import/render satirlari kaldirildi.
- Push token registration arka planda calismaya devam ediyor:
  - `mobile\\app\\_layout.tsx` icinde `registerForPushNotificationsAsync()` korunuyor.
- Console log/hata kaydi arka plan teknik takip icin korundu.
- Bildirim izni, Expo token alma ve `/api/mobile/devices` kayit akisi korunuyor.

Gizli/gecici dosya kontrolu:

- `mobile` altinda FCM/gecici gizli JSON olarak sadece `google-services.json` bulundu.
- `google-services.json` bilerek korundu.
- `app.json` icindeki `android.googleServicesFile` ayari korundu:
  - `"./google-services.json"`

Version guncellemesi:

- `mobile\\app.json`
  - `expo.version`: `1.0.2`
  - `android.versionCode`: `5`

Kontrol:

- `npx tsc --noEmit` basarili.
- Debug panel kalintisi icin arama yapildi; uygulama kodunda gorunur debug component referansi kalmadi.

Google Play production AAB build:

- Komut:
  - `npx eas-cli build --platform android --profile production --non-interactive`
- Build ID:
  - `3bac788b-a3ce-4269-8f87-373825dde431`
- Build profili:
  - `production`
- Distribution:
  - `STORE`
- Format:
  - AAB
- App version / versionName:
  - `1.0.2`
- App build version / versionCode:
  - `5`
- Build durumu:
  - `FINISHED`

AAB linki:

- `https://expo.dev/artifacts/eas/8nowpJvgnALGewKFxh859r.aab`

Not:

- Google Play'e yukleme yapilmadi.
- GitHub push yapilmadi.

## 64. Play Store AAB Bildirim Gorunurlugu Duzeltmesi

Tarih: 2026-05-22

Kullanici bildirimi:

- Play Store'dan kurulan uygulamada cihaz kaydi calisiyor.
- Admin debug tarafinda:
  - `mobile_devices` kaydi var.
  - `is_active = true`.
  - `last_seen_at` guncel.
  - `mobile_notification_deliveries` son push icin `success`.
- Preview APK testinde bildirim telefonda gorundu.
- Play Store AAB surumunde delivery success olmasina ragmen bildirim telefonda gorunmedi.

Yapilan kontroller:

- `expo-notifications` handler kaldirilmamis; module seviyesinde aktif.
- Android notification channel kurulumu debug panel temizliginde silinmemis.
- Token registration arka planda `mobile\\app\\_layout.tsx` icinden calismaya devam ediyor.
- Debug panel kaldirilirken handler/channel setup bozulmamis.
- Backend Expo push payload'unda `sound = default` ve `priority = high` vardi ancak Android `channelId` yoktu.

Yapilan mobil duzeltmeler:

- `mobile\\lib\\push.ts`
  - `setNotificationHandler` icine uyumluluk icin `shouldShowAlert: true` eklendi.
  - Handler icine Android priority olarak `AndroidNotificationPriority.MAX` eklendi.
  - Android channel kurulumu guclendirildi:
    - `default`
    - `hantaworld-alerts`
  - Kanallar icin:
    - `importance = AndroidImportance.MAX`
    - `sound = default`
    - `enableVibrate = true`
    - `enableLights = true`
    - `showBadge = true`
    - `lockscreenVisibility = PUBLIC`
  - Channel kurulumu uygulama acilisinda push registration akisi icinde garanti calismaya devam ediyor.

Yapilan backend duzeltmesi:

- `backend\\HantaWorld.AdminApi\\Services\\PushNotificationService.cs`
  - Expo push payload'una Android `channelId` eklendi:
    - `hantaworld-alerts`
  - Bu sayede Expo/Android bildirimi, mobil uygulamanin olusturdugu yuksek onemli kanala hedeflenecek.

Version guncellemesi:

- `mobile\\app.json`
  - `expo.version`: `1.0.3`
  - `android.versionCode`: `6`

Kontrol:

- `npx tsc --noEmit` basarili.
- `dotnet build backend\\HantaWorld.AdminApi\\HantaWorld.AdminApi.csproj` basarili.
- Backend publish alindi:
  - `C:\\Users\\Ceyda\\.gemini\\antigravity\\scratch\\hantaworld\\backend-publish`

Google Play production AAB build:

- Build ID:
  - `9b3ab427-2a06-409d-ade2-63a444fc5454`
- Build profili:
  - `production`
- Distribution:
  - `STORE`
- Format:
  - AAB
- App version / versionName:
  - `1.0.3`
- App build version / versionCode:
  - `6`
- Build durumu:
  - `FINISHED`

AAB linki:

- `https://expo.dev/artifacts/eas/kaLqpn9kvGbzNxgHrHSYA1.aab`

Operasyon notu:

- Bu duzeltme iki parcali:
  - Mobil AAB Play Store'a yuklenmeli.
  - Backend `backend-publish` klasoru Plesk/FileZilla ile canliya alinmali.
- Backend canliya alinmadan Expo payload'undaki `channelId = hantaworld-alerts` aktif olmayacak.
- Google Play'e yukleme yapilmadi.
- GitHub push yapilmadi.

## 2026-05-23 - Frontend Global Health Intelligence UI iyilestirmesi

Kural hatirlatma:

- Kullanici acikca `push et` demeden GitHub push yapilmayacak.
- Onemli kararlar ve gelistirmeler bu dosyaya kaydedilmeye devam edecek.

Kapsam:

- Sadece frontend/web arayuzu iyilestirildi.
- Backend kontratlari, API endpointleri ve veri modelleri degistirilmedi.
- Mevcut rota, komponent ve veri akisi korunarak ilerlenildi.

Yapilan frontend iyilestirmeleri:

- Ana sayfa hero alani daha profesyonel public-health intelligence tonuna cekildi:
  - Baslik: `Global Hantavirus Intelligence`
  - Aciklama: kaynak atifli outbreak, risk ve public health update takibi.
  - CTA'lar: `View Live Map` ve `Read Intelligence Feed`.
  - Guven gostergeleri: WHO, CDC, ECDC, official health ministries.
- Tasarim tokenlari koyu public-health paletine gore guncellendi:
  - Deep navy / slate background.
  - Sky blue / indigo brand accent.
  - Amber warning, red critical/death, green sadece verified/success icin.
- Istatistik kartlari yeniden duzenlendi:
  - Reported Cases: mavi/brand accent.
  - Total Deaths: kritik kirmizi.
  - Affected Countries: indigo/mavi.
  - Active Outbreaks: amber warning.
  - Kartlara renkli border, glow, hover ve kisa aciklama eklendi.
- Harita alani buyutuldu ve daha merkezi hale getirildi:
  - Desktop icin responsive 55-65vh araligina yakin yukseklik.
  - Mobil icin 360px yukseklik.
  - Risk legend'i low/moderate/high/critical olarak sadeleştirildi.
  - Marker detay paneli kaynaklar, risk, metrikler, son dogrulama/guncelleme ve country detail linki gosterecek sekilde iyilestirildi.
- Intelligence Feed kartlari gelistirilerek kaynak/kategori vurgusu daha okunur hale getirildi.
- Alert CTA sade ve gercek backend davranisina uygun hale getirildi:
  - Fake email submit kaldirildi.
  - `/alerts` sayfasina yonlendiren CTA kullanildi.
  - `No spam. Public-health updates only.` mesaji eklendi.
- Navbar daha sakin public-health tonuna cekildi:
  - Aktif rota vurgusu netlestirildi.
  - Kirmizi `LIVE` baskinligi kaldirildi, `LIVE MAP` mavi tona alindi.
  - Mobilde tasma riski olan fazla butonlar gizlendi.
- Footer guncellendi:
  - `real-time` gibi desteklenmeyen iddia kaldirildi.
  - Source-attributed data badge eklendi.
  - Medical disclaimer daha net bir ifade ile korundu.
  - Logo uzerindeki zorlayici CSS filter kaldirildi.
- Erişilebilirlik/performance:
  - `prefers-reduced-motion` destegi guclendirildi.
  - Icon-only butonlarda aria-label/aria-expanded kullanimi korundu veya eklendi.

Degisen dosyalar:

- `app/globals.css`
- `app/page.tsx`
- `components/dashboard/HeroStats.tsx`
- `components/dashboard/LatestReports.tsx`
- `components/dashboard/AlertSignup.tsx`
- `components/map/OutbreakMap.tsx`
- `components/map/MapWrapper.tsx`
- `components/layout/Navbar.tsx`
- `components/layout/Footer.tsx`
- `tsconfig.json`
- `eslint.config.mjs`

Build/lint notlari:

- `npx tsc --noEmit` basarili.
- `npm run lint` basarili; yalniz mevcut `lib/data.ts` icinde `mapOutbreak` unused warning kaldi.
- `npm run build` basarili.
- Ilk build denemesi `.next/trace` EPERM hatasina takildi; komut normal izinlerle tekrar calistirilince build basarili tamamlandi.

Teknik kapsam duzeltmesi:

- Next web projesinin typecheck/lint kapsami `mobile/` ve `backend-publish/` gibi web disi klasorleri taramayacak sekilde daraltildi.
- Mobil Expo projesi kendi build surecinde kalmali; Next build tarafindan typecheck edilmemeli.

Canliya alma:

- GitHub push yapilmadi.
- Kullanici acikca `push et` demeden push yapilmayacak.

## 2026-06-04 - Phase 1A Multi-Pathogen Foundation

Kurallar:

- Push yapilmadi.
- Commit yapilmadi.
- Deploy yapilmadi.
- Production environment degiskenleri degistirilmedi.
- Eski Hantavirus fonksiyonlari, tablolar ve API akislari silinmedi.
- `data_source_numeric` ve `data_source_numeric_history` compatibility/fallback olarak korunuyor.

Kapsam:

- HantaWorld coklu patojen outbreak intelligence altyapisina hazirlandi.
- Homepage redesign, public pathogen sayfalari, multi-line chart UI, scraping veya otomatik veri cekme bu fazda yapilmadi.
- `official-updates` ve `weekly-risk-brief` Phase 1A icin taxonomy icinde category-like kayitlar olarak tutuldu; bunlara fake vaka/vefat sayisi uretilmedi.

Backend/API:

- Yeni EF entity ve mapping eklendi:
  - `Pathogen`
  - `PathogenStats`
  - `PathogenStatHistory`
- `Article` ve `Outbreak` entitylerine nullable `PathogenId` ve navigation eklendi.
- Yeni API endpointleri eklendi:
  - `GET /api/pathogens`
  - `GET /api/pathogens/{slug}`
  - `GET /api/pathogens/{slug}/stats/trend`
  - `GET /api/pathogen-stats/trend`
- `/api/news` geriye uyumlu sekilde genisletildi:
  - Mevcut alanlar korunuyor.
  - Optional nested `pathogen` bilgisi donuyor: slug, displayName, color.
  - Optional filtre eklendi: `/api/news?pathogen=hantavirus`.

Admin panel:

- Yeni admin route eklendi: `/admin/pathogen-stats`.
- Admin bu ekranda aktif pathogen/category secip su alanlari kaydedebilir:
  - Reported Cases
  - Total Deaths
  - Affected Countries
  - Active Outbreaks
  - Source Institution
  - Source URL
  - Official Published Date
  - Last Verified Date
  - Notes
- Kaydetme davranisi:
  - `pathogen_stats` current row upsert edilir.
  - `pathogen_stat_history` ayni gun/snapshot row upsert edilir.
  - Snapshot date `last_verified_at` varsa onun tarihi, yoksa UTC today olur.
  - Unique `(pathogen_id, snapshot_date)` duplicate history satirlarini engeller.
- Intelligence Feed create/edit formuna `Pathogen / Category` dropdown eklendi.
- Yeni veya bos kayitlarda default Hantavirus secilir; edit mevcut secimi korur.
- Intelligence Feed listesinde pathogen badge gosterilir.

Database:

- Yeni idempotent setup script eklendi:
  - `database/09_pathogen_taxonomy_and_stats.sql`
- Yeni tablolar:
  - `pathogens`
  - `pathogen_stats`
  - `pathogen_stat_history`
- Mevcut tablolara nullable kolonlar:
  - `articles.pathogen_id`
  - `outbreaks.pathogen_id`
- Seed taxonomy:
  - `hantavirus`
  - `ebola-marburg`
  - `mpox`
  - `dengue`
  - `measles`
  - `avian-influenza`
  - `covid-respiratory-viruses`
  - `unknown-emerging-outbreaks`
  - `official-updates`
  - `weekly-risk-brief`
- Backfill:
  - `articles.pathogen_id IS NULL` kayitlari Hantavirus'a baglanir.
  - `outbreaks.pathogen_id IS NULL` kayitlari Hantavirus'a baglanir.
  - Dolu `pathogen_id` alanlari asla overwrite edilmez.
  - Mevcut `data_source_numeric` Hantavirus current stats icin yeni `pathogen_stats` tablosuna sadece eksik alanlarda backfill edilir.
  - Mevcut `data_source_numeric_history` Hantavirus trend icin yeni `pathogen_stat_history` tablosuna sadece eksik alanlarda backfill edilir.
- `SetupController.ApplyAdminPanelUpdates` artik `09_pathogen_taxonomy_and_stats.sql` scriptini de calistirir.
- Fresh install icin `database/01_mssql_schema.sql` yeni tablo/kolon/seed yapisiyla guncellendi.

Test:

- `dotnet build backend/HantaWorld.AdminApi/HantaWorld.AdminApi.csproj` basarili.
- Build sonucu: 0 warning, 0 error.

Notlar:

- Canli DB'ye uygulanmasi icin backend deploy sonrasi mevcut setup endpoint akisiyle `apply-admin-panel-updates` calistirilmelidir.
- API endpointleri runtime DB baglantisi olmadan bu turnde canli olarak cagrilmadi; derleme kontrolu basarili.

## 2026-06-04 - Phase 1B-1 Multi-Pathogen Frontend Foundation

Kurallar:

- Push yapilmayacak.
- Commit yapilmayacak.
- Deploy yapilmayacak.
- Setup endpoint calistirilmayacak.
- Production env degistirilmeyecek.
- Backend sadece zorunlu olmadikca degistirilmeyecek.
- Fake production data eklenmeyecek.
- Mevcut Hantavirus sayfalari ve davranisi korunacak.

Yapilan frontend altyapi guncellemeleri:

- Ana sayfa ust konumlandirmasi HantaWorld multi-pathogen platform yonune tasindi:
  - `Global Outbreak & Virus Intelligence`
  - Pathogen/category kartlari ana sayfanin ust bolumune eklendi.
  - Eski Hantavirus numeric kartlari kaldirilmadi; `Hantavirus verified snapshot` olarak daha asagiya tasindi.
- Yeni public route eklendi:
  - `/pathogens`
- Yeni public detay route eklendi:
  - `/pathogens/[slug]`
- Pathogen kartlari API'den gelen gercek kayitlari kullanir:
  - `GET /api/pathogens`
  - Stats yoksa fake `0` gosterilmez; bos durum gosterilir.
- Pathogen detay sayfasi su API'leri kullanir:
  - `GET /api/pathogens/{slug}`
  - `GET /api/pathogens/{slug}/stats/trend`
  - `GET /api/news?pathogen={slug}`
- Haber sayfasi `?pathogen=` query parametresini geriye uyumlu sekilde destekler.
- Sitemap'e `/pathogens` ve API'den gelen `/pathogens/{slug}` URL'leri eklendi.
- Navbar'a `Pathogens` linki eklendi; `/hantavirus` rehber sayfasi korunur.

Notlar:

- Multi-line chart UI bu fazda eklenmedi.
- Public `/hantavirus` guide sayfasi korunur; `/pathogens/hantavirus` outbreak intelligence profili olarak ayrilir.
- Stats olmayan category-like kayitlarda (`official-updates`, `weekly-risk-brief`) sayfalar bos/opsiyonel stats durumunu guvenli gosterir.

## 2026-06-04 - Phase 1B-2 Multi-Pathogen Trend and News Filters

Kurallar:

- Push yapilmayacak.
- Commit yapilmayacak.
- Deploy yapilmayacak.
- Setup endpoint calistirilmayacak.
- Production env degistirilmeyecek.
- Backend degistirilmeyecek.
- Fake production chart/data eklenmeyecek.

Yapilan frontend guncellemeleri:

- Ana sayfaya multi-pathogen reported cases trend chart eklendi.
  - API: `GET /api/pathogen-stats/trend`
  - Her pathogen icin API rengini kullanan ayri cizgi olusturur.
  - Bu fazda sadece reported cases gosterilir; deaths ana sayfa chartinda gosterilmez.
  - Veri yoksa `No verified data available yet.` bos durumu gosterilir.
- `/pathogens/[slug]` detay sayfasina tek pathogen reported cases trend chart eklendi.
  - API: `GET /api/pathogens/{slug}/stats/trend`
  - Veri yoksa `No verified trend data available yet.` bos durumu gosterilir.
- `/news` sayfasina dinamik pathogen/category filtre chipleri eklendi.
  - `All` -> `/news`
  - Pathogen chip -> `/news?pathogen={slug}`
  - Aktif chip API rengini kullanarak vurgulanir.
- Intelligence Feed kartlarina pathogen/category badge gosterimi eklendi.
  - `/news`
  - Homepage `LatestReports`
  - `/pathogens/[slug]` related intelligence kartlari
- `/news` metadata dili Hantavirus-only olmaktan global outbreak/pathogen intelligence diline guncellendi.

Notlar:

- Chartlar eksik tarih/degerlerde fake `0` uretmez; eksik noktalar null olarak kalir.
- Multi-line chart sadece mevcut API history kayitlarina gore kendini otomatik genisletir.
