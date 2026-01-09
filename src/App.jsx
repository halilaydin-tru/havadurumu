import { useState } from 'react'
import './App.css'

// Sinirli yorumlar - hava durumuna göre
const sinirliYorumlar = {
  // Sıcaklığa göre yorumlar
  sicaklik: {
    cokSoguk: [ // -10 ve altı
      "Donacaksın, ama beni ilgilendirmez.",
      "Bu havada dışarı çıkan aklını sorgulasın.",
      "Ayazdan kemiklerin çatırdayacak, haberin olsun.",
      "Kutup ayısı mısın sen? Eve dön!",
    ],
    soguk: [ // -10 ile 5 arası
      "Mont al yanına, hasta olursan ben bakmam.",
      "Dışarısı buz gibi, evde otur.",
      "Üşüyeceksin ama dediğimi dinlemezsin ki.",
      "Eldiven almadan çıkma, sonra ağlama.",
    ],
    serin: [ // 5 ile 15 arası
      "Ne sıcak ne soğuk, kararsız hava kararsız insanlara.",
      "Ceket al mı alma mı... Al işte, üşürsen suçlama beni.",
      "Hava tam 'grip olayım mı olmayayım mı' kıvamında.",
      "İnce mont yeter ama dinleyen kim?",
    ],
    ilik: [ // 15 ile 25 arası
      "Fena değil hava, bunu da beğenmezsen bilemem.",
      "Dışarı çıkabilirsin, sana bir şey olmaz... galiba.",
      "Güzel hava, keyfini çıkar çünkü yarın ne olacağı belli değil.",
      "Kabul edilebilir bir sıcaklık. Şaşırdım.",
    ],
    sicak: [ // 25 ile 35 arası
      "Sıcaktan bunalacaksın ama şikayet etme.",
      "Güneş kremi sür, deri kanserini ben açıklamak zorunda değilim.",
      "Kavruluyor her yer, su iç... ya da içme, sen bilirsin.",
      "Yazlık giy, terle, sonra da klimaya gir hasta ol.",
    ],
    cokSicak: [ // 35 ve üstü
      "Cehennem mi burası? Çıkma dışarı!",
      "Yumurta pişer bu sıcakta, akıl sağlığını koru evde kal.",
      "Güneş çarpması garantili, hastaneyi ara.",
      "Bu sıcakta dışarı çıkan aklını kaybetmiştir.",
    ],
  },
  // Hava durumuna göre yorumlar
  durum: {
    Clear: [
      "Güneş açmış, nadir bir olay, fotoğrafını çek.",
      "Bugün şansın varmış, piyango oyna.",
      "Güneşli hava mı? Şüpheli...",
    ],
    Clouds: [
      "Bulutlu, tıpkı senin geleceğin gibi.",
      "Güneş yok, morallerin bozuk, anlıyorum.",
      "Bulutlar gökyüzünü kaplamış, şaşırmadık.",
    ],
    Rain: [
      "Yine yağmur yağıyor, şaşırdık mı? Hayır.",
      "Şemsiye al, ıslanınca 'neden almadım' deme.",
      "Yağmur var, ayakkabıların ıslanacak, güle güle.",
      "Allah rahmet eylesin saçlarına.",
    ],
    Drizzle: [
      "Çiseleme var, saçların mahvolacak.",
      "Hafif yağmur, tam 'şemsiye alsam mı' kararsızlığı.",
      "Islak ıslak gezmek istiyorsan buyur çık.",
    ],
    Thunderstorm: [
      "Fırtına var, evden çıkma yoksa yıldırım çarpar.",
      "Gök gürüldüyor, korktun mu? Korkmalısın.",
      "Fırtına patlamış, sen hala dışarı mı bakıyorsun?",
    ],
    Snow: [
      "Kar yağıyor, düşüp kalçanı kırarsan ben uyarmıştım.",
      "Her yer beyaz, güzel değil mi? Hayır, soğuk.",
      "Kartopu oyna, sonra dona dona eve dön.",
    ],
    Mist: [
      "Sisli hava, korku filmi gibi, korkma... belki.",
      "Sis var, kaybolma sakın.",
      "Önünü göremezsin ama sorun değil, yolunu zaten bilmiyorsun.",
    ],
    Fog: [
      "Yoğun sis, araba kullanma derim ama dinlemezsin.",
      "Sis çökmüş, hayalet görebilirsin.",
      "Puslu hava, tıpkı zihnim gibi.",
    ],
    Haze: [
      "Pus var, akciğerlerine yazık.",
      "Hava kirli, maske tak... ya da takma, sen bilirsin.",
      "Puslu hava, nefes almaktan kaçın.",
    ],
  },
};

// Rastgele yorum seç
function rastgeleYorumSec(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Sıcaklığa göre kategori belirle
function sicaklikKategorisi(temp) {
  if (temp <= -10) return 'cokSoguk';
  if (temp <= 5) return 'soguk';
  if (temp <= 15) return 'serin';
  if (temp <= 25) return 'ilik';
  if (temp <= 35) return 'sicak';
  return 'cokSicak';
}

// Hava durumu ikonu
function havaDurumuIkonu(main) {
  const ikonlar = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '😶‍🌫️',
  };
  return ikonlar[main] || '🌡️';
}

function App() {
  const [sehir, setSehir] = useState('');
  const [hava, setHava] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const [sinirliYorum, setSinirliYorum] = useState({ sicaklik: '', durum: '' });

  // API Key'i .env dosyasından al (GitHub'a gizli kalır)
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const havaDurumuGetir = async () => {
    if (!sehir.trim()) {
      setHata('Şehir adı yaz da öyle ara, boş mu arıyorsun?');
      return;
    }

    setYukleniyor(true);
    setHata('');
    setHava(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(sehir)}&appid=${API_KEY}&units=metric&lang=tr`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Bu şehri bulamadım, yanlış mı yazdın yoksa uyduruk bir yer mi?');
        }
        if (response.status === 401) {
          throw new Error('API anahtarı geçersiz veya henüz aktif değil. 10-15 dakika bekle.');
        }
        throw new Error('Bir şeyler ters gitti, muhtemelen senin suçun.');
      }

      const data = await response.json();
      setHava(data);

      // Sinirli yorumları belirle
      const sicaklikKat = sicaklikKategorisi(data.main.temp);
      const durumKat = data.weather[0].main;

      setSinirliYorum({
        sicaklik: rastgeleYorumSec(sinirliYorumlar.sicaklik[sicaklikKat]),
        durum: sinirliYorumlar.durum[durumKat] 
          ? rastgeleYorumSec(sinirliYorumlar.durum[durumKat])
          : 'Bu hava durumunu tanımıyorum, şaşırdım.',
      });

    } catch (error) {
      setHata(error.message);
    } finally {
      setYukleniyor(false);
    }
  };

  const enterTusu = (e) => {
    if (e.key === 'Enter') {
      havaDurumuGetir();
    }
  };

  // Popüler şehirler
  const populerSehirler = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Trabzon', 'Bursa'];

  const hizliAra = (sehirAdi) => {
    setSehir(sehirAdi);
    // Hemen arama yap
    setTimeout(() => {
      document.querySelector('.ara-btn').click();
    }, 100);
  };

  return (
    <div className="container">
      {/* Dekoratif arka plan elemanları */}
      <div className="deko-daire deko-1"></div>
      <div className="deko-daire deko-2"></div>
      <div className="deko-daire deko-3"></div>

      <header className="header">
        <h1>🌦️ Sinirli Hava Durumu</h1>
        <p className="slogan">Hava durumunu öğren, moralini boz.</p>
      </header>

      <div className="arama-kutusu">
        <input
          type="text"
          placeholder="Şehir adı yaz..."
          value={sehir}
          onChange={(e) => setSehir(e.target.value)}
          onKeyDown={enterTusu}
          className="sehir-input"
        />
        <button onClick={havaDurumuGetir} className="ara-btn" disabled={yukleniyor}>
          {yukleniyor ? '🔄 Bakıyorum...' : '🔍 ARA'}
        </button>
      </div>

      {/* Popüler Şehirler */}
      <div className="populer-sehirler">
        <p className="populer-baslik">Popüler şehirler:</p>
        <div className="sehir-butonlari">
          {populerSehirler.map((s) => (
            <button key={s} className="sehir-btn" onClick={() => hizliAra(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {hata && (
        <div className="hata-mesaji">
          <span>😤</span> {hata}
        </div>
      )}

      {hava && (
        <div className="hava-karti">
          <div className="sehir-adi">
            📍 {hava.name}, {hava.sys.country}
          </div>
          
          {/* Sol taraf - Sıcaklık */}
          <div className="sicaklik-bolumu">
            <span className="hava-ikonu">{havaDurumuIkonu(hava.weather[0].main)}</span>
            <span className="sicaklik">{Math.round(hava.main.temp)}°C</span>
            <div className="hava-aciklama">
              {hava.weather[0].description}
            </div>
          </div>

          {/* Sağ taraf - Yorumlar */}
          <div className="yorumlar-bolumu">
            <div className="sinirli-yorum sicaklik-yorumu">
              <span className="yorum-emoji">😒</span>
              <p>{sinirliYorum.sicaklik}</p>
            </div>

            <div className="sinirli-yorum durum-yorumu">
              <span className="yorum-emoji">😤</span>
              <p>{sinirliYorum.durum}</p>
            </div>
          </div>

          <div className="detaylar">
            <div className="detay">
              <span className="detay-ikon">💨</span>
              <span className="detay-deger">{hava.wind.speed} m/s</span>
              <span className="detay-baslik">Rüzgar</span>
            </div>
            <div className="detay">
              <span className="detay-ikon">💧</span>
              <span className="detay-deger">%{hava.main.humidity}</span>
              <span className="detay-baslik">Nem</span>
            </div>
            <div className="detay">
              <span className="detay-ikon">🌡️</span>
              <span className="detay-deger">{Math.round(hava.main.feels_like)}°C</span>
              <span className="detay-baslik">Hissedilen</span>
            </div>
            <div className="detay">
              <span className="detay-ikon">🔽</span>
              <span className="detay-deger">{Math.round(hava.main.temp_min)}°C</span>
              <span className="detay-baslik">Min</span>
            </div>
            <div className="detay">
              <span className="detay-ikon">🔼</span>
              <span className="detay-deger">{Math.round(hava.main.temp_max)}°C</span>
              <span className="detay-baslik">Max</span>
            </div>
            <div className="detay">
              <span className="detay-ikon">🎈</span>
              <span className="detay-deger">{hava.main.pressure} hPa</span>
              <span className="detay-baslik">Basınç</span>
            </div>
            <div className="detay">
              <span className="detay-ikon">👁️</span>
              <span className="detay-deger">{(hava.visibility / 1000).toFixed(1)} km</span>
              <span className="detay-baslik">Görüş</span>
            </div>
            <div className="detay">
              <span className="detay-ikon">☁️</span>
              <span className="detay-deger">%{hava.clouds.all}</span>
              <span className="detay-baslik">Bulut</span>
            </div>
            <div className="detay">
              <span className="detay-ikon">🌅</span>
              <span className="detay-deger">{new Date(hava.sys.sunrise * 1000).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})}</span>
              <span className="detay-baslik">Gün Doğumu</span>
            </div>
            <div className="detay">
              <span className="detay-ikon">🌇</span>
              <span className="detay-deger">{new Date(hava.sys.sunset * 1000).toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'})}</span>
              <span className="detay-baslik">Gün Batımı</span>
            </div>
            {hava.wind.deg !== undefined && (
              <div className="detay">
                <span className="detay-ikon">🧭</span>
                <span className="detay-deger">{hava.wind.deg}°</span>
                <span className="detay-baslik">Rüzgar Yönü</span>
              </div>
            )}
            {hava.rain && hava.rain['1h'] !== undefined && (
              <div className="detay">
                <span className="detay-ikon">🌧️</span>
                <span className="detay-deger">{hava.rain['1h']} mm</span>
                <span className="detay-baslik">Yağış (1s)</span>
              </div>
            )}
            {hava.rain && hava.rain['3h'] !== undefined && (
              <div className="detay">
                <span className="detay-ikon">🌧️</span>
                <span className="detay-deger">{hava.rain['3h']} mm</span>
                <span className="detay-baslik">Yağış (3s)</span>
              </div>
            )}
            {hava.snow && hava.snow['1h'] !== undefined && (
              <div className="detay">
                <span className="detay-ikon">❄️</span>
                <span className="detay-deger">{hava.snow['1h']} mm</span>
                <span className="detay-baslik">Kar (1s)</span>
              </div>
            )}
            {hava.snow && hava.snow['3h'] !== undefined && (
              <div className="detay">
                <span className="detay-ikon">❄️</span>
                <span className="detay-deger">{hava.snow['3h']} mm</span>
                <span className="detay-baslik">Kar (3s)</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App
