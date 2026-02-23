import { useState } from 'react';
import './App.css';

// --- SABİT VERİLER (YORUMLAR & İKONLAR) ---
const sinirliYorumlar = {
  sicaklik: {
    cokSoguk: [
      "Donacaksın, ama beni ilgilendirmez.",
      "Kutup ayısı mısın? Eve dön!",
      "Buzdolabının içi daha sıcak.",
      "Dondurucu gibi hava, ama sen bilirsin.",
    ],
    soguk: [
      "Mont al yanına, hasta olursan bakmam.",
      "Dışarısı buz gibi, otur oturduğun yerde.",
      "Burnun kızaracak, palyaçoya döneceksin.",
      "Eldiven almadan çıkma sakın.",
    ],
    serin: [
      "Ne sıcak ne soğuk, kararsız hava.",
      "Hırka al, sonra 'üşüdüm' diye ağlama.",
      "Tam hastalık havası, dikkat et.",
      "Mevsim normalleriymiş... Yersen.",
    ],
    ilik: [
      "Fena değil, bunu da beğenmezsen yuh.",
      "Dışarı çıkabilirsin, ölmezsin.",
      "Güzel hava, ama sen yine evde pinekleyeceksin.",
      "İdeal hava, tadını çıkar.",
    ],
    sicak: [
      "Yanıyorsun Fuat Abi!",
      "Deodorant sık, milleti bayıltma.",
      "Güneş kremi sür, ıstakoza dönme.",
      "Klimayı kucakla ve bırakma.",
    ],
    cokSicak: [
      "Cehennemin fragmanı gibi.",
      "Yumurta kırsan pişer, dışarı çıkma.",
      "Eriyen asfalta yapışırsın, dikkat et.",
      "Bu sıcakta nefes alan bordodur.",
    ],
  },
  durum: {
    Clear: ["Güneş var diye sevinme, yarın bozar.", "Gözlüğünü tak, kör olma.", "Açık hava, şanslı günündesin."],
    Clouds: ["Gri gökyüzü, tam senin ruh halin.", "Güneş küsmüş, sana mı doğsun?", "Bulutlu ve kasvetli."],
    Rain: ["Şemsiye al, sırılsıklam olma.", "Saçların bozulacak, geçmiş olsun.", "Bereket yağıyor dediler, çamur oldu."],
    Drizzle: ["Ahmak ıslatan... Tam sana göre.", "Ne yağıyor ne yağmıyor, sinir bozucu.", "Çiseleme var, ıslanmak garanti."],
    Thunderstorm: ["Thor sinirlenmiş, evde kal.", "Çarpılmak istemiyorsan çıkma.", "Gök gürlüyor, yorganın altına saklan."],
    Snow: ["Kıçının üstüne düşme, dikkat et.", "Her yer bembeyaz ve buz gibi.", "Kardan adam yapacak yaşta değilsin."],
    Mist: ["Sisli hava, korku filmi seti gibi.", "Önünü göremiyorsun, zaten yolunu da bilmiyorsun.", "Silent Hill mod on."],
    Fog: ["Göz gözü görmüyor.", "Kaybolursan kimse seni bulamaz.", "Puslu ve gizemli, ama soğuk."],
    Haze: ["Hava kirli, nefes alma.", "Ciğerlerine yazık.", "Pus var, manzara falan bekleme."],
  },
};

function rastgeleYorumSec(arr) {
  if (!arr || arr.length === 0) return "Hava durumu hakkında bir fikrim yok.";
  return arr[Math.floor(Math.random() * arr.length)];
}

function sicaklikKategorisi(temp) {
  if (temp <= -10) return 'cokSoguk';
  if (temp <= 5) return 'soguk';
  if (temp <= 15) return 'serin';
  if (temp <= 25) return 'ilik';
  if (temp <= 35) return 'sicak';
  return 'cokSicak';
}

function havaDurumuIkonu(main) {
  const ikonlar = {
    Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️',
    Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️', Haze: '😶‍🌫️',
  };
  return ikonlar[main] || '🌡️';
}

function App() {
  const [sehir, setSehir] = useState('');
  const [hava, setHava] = useState(null);
  const [tahmin, setTahmin] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const [sinirliYorum, setSinirliYorum] = useState({ sicaklik: '', durum: '' });

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const gunlukTahminleriAl = (list) => {
    const gunler = {};
    list.forEach(item => {
      const tarih = new Date(item.dt * 1000);
      // Hatalı gün adını engelle: hem gün adı hem tarih (ör: Paz 7 Oca)
      const gunAdi = `${tarih.toLocaleDateString('tr-TR', { weekday: 'short' })} ${tarih.getDate()} ${tarih.toLocaleDateString('tr-TR', { month: 'short' })}`;

      if (!gunler[gunAdi]) {
        gunler[gunAdi] = {
          gunAdi,
          temps: [],
          icons: [],
          descriptions: [],
        };
      }
      gunler[gunAdi].temps.push(item.main.temp);
      gunler[gunAdi].icons.push(item.weather[0].main);
      gunler[gunAdi].descriptions.push(item.weather[0].description);
    });

    return Object.values(gunler).slice(0, 5).map(gun => {
      const enSikIcon = gun.icons.sort((a, b) =>
        gun.icons.filter(v => v === a).length - gun.icons.filter(v => v === b).length
      ).pop();

      return {
        gunAdi: gun.gunAdi,
        maxTemp: Math.round(Math.max(...gun.temps)),
        minTemp: Math.round(Math.min(...gun.temps)),
        icon: enSikIcon,
        description: gun.descriptions[0]
      };
    });
  };

  // Fonksiyonu parametre alabilir hale getirdik
  const havaDurumuGetir = async (aranacakSehir = sehir) => {
    if (!aranacakSehir.trim()) {
      setHata('Şehir adı yaz da öyle ara!');
      return;
    }

    setYukleniyor(true);
    setHata('');
    setHava(null);
    setTahmin(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(aranacakSehir)}&appid=${API_KEY}&units=metric&lang=tr`
      );

      if (!response.ok) throw new Error('Şehri bulamadım, sallama istersen.');
      const data = await response.json();
      setHava(data);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(aranacakSehir)}&appid=${API_KEY}&units=metric&lang=tr`
      );
      
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setTahmin(gunlukTahminleriAl(forecastData.list));
      }

      const sicaklikKat = sicaklikKategorisi(data.main.temp);
      const durumKat = data.weather[0].main;

      setSinirliYorum({
        sicaklik: rastgeleYorumSec(sinirliYorumlar.sicaklik[sicaklikKat]),
        durum: sinirliYorumlar.durum[durumKat] 
          ? rastgeleYorumSec(sinirliYorumlar.durum[durumKat])
          : 'Bu nasıl hava belli değil.',
      });

    } catch (error) {
      setHata(error.message);
    } finally {
      setYukleniyor(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') havaDurumuGetir();
  };

  // Popüler şehir araması artık daha temiz
  const hizliAra = (sehirAdi) => {
    setSehir(sehirAdi);
    havaDurumuGetir(sehirAdi);
  };

  return (
    <div className="container">
      <div className="bg-animation"></div>
      
      <header className="header">
        <div style={{display:'flex',alignItems:'center',gap:'1rem',justifyContent:'center'}}>
          <span style={{fontSize:'3.5rem',lineHeight:1}} role="img" aria-label="şimşekli">🌩️</span>
          <h1 style={{margin:0}}>Sinirli Hava</h1>
        </div>
        <p className="slogan">Moralini bozacak hava durumu.</p>
      </header>

      <div className="arama-container">
        <div className="input-group">
          <input
            type="text"
            placeholder="Neresi? Yaz şuraya..."
            value={sehir}
            onChange={(e) => setSehir(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={() => havaDurumuGetir()} disabled={yukleniyor}>
            {yukleniyor ? '...' : 'ARA'}
          </button>
        </div>
        
        <div className="populer-etiketler">
          {['İstanbul', 'Ankara', 'İzmir', 'Trabzon', 'Londra'].map((s) => (
            <span key={s} onClick={() => hizliAra(s)}>{s}</span>
          ))}
        </div>
      </div>

      {hata && <div className="hata-kutusu">⚠️ {hata}</div>}

      {hava && (
        <div className="sonuc-alani">
          {/* Ana Kart */}
          <div className="hava-karti">
            <div className="kart-ust">
              <h2 className="sehir-isim">{hava.name}, {hava.sys.country}</h2>
              <div className="tarih">{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</div>
            </div>
            
            <div className="kart-orta">
              <div className="derece-bolumu">
                <span className="ikon">{havaDurumuIkonu(hava.weather[0].main)}</span>
                <span className="derece">{Math.round(hava.main.temp)}°</span>
              </div>
              <div className="durum-yazi">{hava.weather[0].description}</div>
            </div>

            <div className="kart-alt">
              <div className="detay-kutu">
                <span>Nem</span>
                <strong>%{hava.main.humidity}</strong>
              </div>
              <div className="detay-kutu">
                <span>Rüzgar</span>
                <strong>{hava.wind.speed} km/s</strong>
              </div>
              <div className="detay-kutu">
                <span>Hissedilen</span>
                <strong>{Math.round(hava.main.feels_like)}°</strong>
              </div>
            </div>
          </div>

          {/* Sinirli Mesajlar */}
          <div className="sinirli-mesajlar">
            <div className="mesaj-balonu sicaklik-mesaji">
              <span className="emoji">😤</span>
              <p>"{sinirliYorum.sicaklik}"</p>
            </div>
            <div className="mesaj-balonu durum-mesaji">
              <span className="emoji">😒</span>
              <p>"{sinirliYorum.durum}"</p>
            </div>
          </div>

          {/* 5 Günlük Tahmin */}
          {tahmin && (
            <div className="tahmin-container">
              <h3>Gelecek Günlerin Sefaleti</h3>
              <div className="tahmin-grid">
                {tahmin.map((gun, idx) => (
                  <div key={idx} className="tahmin-kart">
                    <span className="gun-adi">{gun.gunAdi}</span>
                    <span className="tahmin-ikon">{havaDurumuIkonu(gun.icon)}</span>
                    <div className="tahmin-derece">
                      <span className="max">{gun.maxTemp}°</span>
                      <span className="min">{gun.minTemp}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;