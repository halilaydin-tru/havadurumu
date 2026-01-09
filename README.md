# 🌦️ Sinirli Hava Durumu

Standart bir hava durumu web sitesi ama yorumları biraz "huysuz". Hava 15 derece mi? Ekranda sadece "15°C" yazmaz, altında "Mont al yanına, hasta olursan ben bakmam" yazar.

![Sinirli Hava Durumu](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Özellikler

- 🌡️ Gerçek zamanlı hava durumu bilgisi (OpenWeatherMap API)
- 😤 Sıcaklık ve duruma göre sinirli/komik Türkçe yorumlar
- 🏙️ Popüler şehirler ile hızlı arama
- 🎨 Modern mavi-siyah gradient tasarım
- ✨ Animasyonlar ve hover efektleri
- 📱 Responsive (mobil uyumlu)

## 🚀 Kurulum

1. Repoyu klonla:
```bash
git clone https://github.com/kullaniciadi/sinirli-hava-durumu.git
cd sinirli-hava-durumu
```

2. Bağımlılıkları yükle:
```bash
npm install
```

3. `.env` dosyası oluştur (`.env.example` dosyasını kopyala):
```bash
cp .env.example .env
```

4. [OpenWeatherMap](https://openweathermap.org/api) üzerinden ücretsiz API anahtarı al ve `.env` dosyasına ekle:
```
VITE_OPENWEATHER_API_KEY=senin_api_anahtarin
```

5. Geliştirme sunucusunu başlat:
```bash
npm run dev
```

## 🛠️ Teknolojiler

- **React 18** - UI Framework
- **Vite** - Build Tool
- **OpenWeatherMap API** - Hava durumu verisi
- **CSS3** - Animasyonlar ve stiller

## 📝 Örnek Yorumlar

| Durum | Yorum |
|-------|-------|
| Soğuk | "Mont al yanına, hasta olursan ben bakmam." |
| Yağmur | "Yine yağmur yağıyor, şaşırdık mı? Hayır." |
| Bulutlu | "Bulutlu, tıpkı senin geleceğin gibi." |
| Sıcak | "Kavruluyor her yer, su iç... ya da içme, sen bilirsin." |

## 📄 Lisans

MIT License - İstediğin gibi kullan!

---

Made with 😤 and ☕
