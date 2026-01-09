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
      "Sibirya mı burası? Evde kal!",
      "Buzdolabının içi daha sıcak şu an.",
      "Dondurucu gibi hava var, ama sen bilirsin.",
      "Soğuktan dudakların çatlayacak, sonra ağlama.",
    ],
    soguk: [ // -10 ile 5 arası
      "Mont al yanına, hasta olursan ben bakmam.",
      "Dışarısı buz gibi, evde otur.",
      "Üşüyeceksin ama dediğimi dinlemezsin ki.",
      "Eldiven almadan çıkma, sonra ağlama.",
      "Kışlık mont şart, yoksa donarsın.",
      "Ayaklarını sıcak tut, grip olmak istemiyorsan.",
      "Battaniyeyle çık sokağa, belki yetişir.",
      "Bu soğukta kahve içmeden çıkma dışarı.",
      "Burnun kızaracak, Rudolf'a döneceksin.",
    ],
    serin: [ // 5 ile 15 arası
      "Ne sıcak ne soğuk, kararsız hava kararsız insanlara.",
      "Ceket al mı alma mı... Al işte, üşürsen suçlama beni.",
      "Hava tam 'grip olayım mı olmayayım mı' kıvamında.",
      "İnce mont yeter ama dinleyen kim?",
      "Sabah soğuk akşam ılık, karar ver artık hava!",
      "Hırka al, ceketini de çantana koy.",
      "Tam 'hasta olmak için ideal' hava.",
      "Bu havada ne giyeceğini bilemezsin, normal.",
      "Bahar havası mı kış havası mı belli değil.",
    ],
    ilik: [ // 15 ile 25 arası
      "Fena değil hava, bunu da beğenmezsen bilemem.",
      "Dışarı çıkabilirsin, sana bir şey olmaz... galiba.",
      "Güzel hava, keyfini çıkar çünkü yarın ne olacağı belli değil.",
      "Kabul edilebilir bir sıcaklık. Şaşırdım.",
      "Piknik yapabilirsin, ama karınca kaçınılmaz.",
      "T-shirt yeter bugün, mont almana gerek yok.",
      "Dışarı çık biraz, vitamini D eksik kalmıştır.",
      "Güzel hava, ama sen yine evde kalacaksın değil mi?",
      "İdeal hava, şikayet etme artık.",
    ],
    sicak: [ // 25 ile 35 arası
      "Sıcaktan bunalacaksın ama şikayet etme.",
      "Güneş kremi sür, deri kanserini ben açıklamak zorunda değilim.",
      "Kavruluyor her yer, su iç... ya da içme, sen bilirsin.",
      "Yazlık giy, terle, sonra da klimaya gir hasta ol.",
      "Terlemeye hazır ol, deodorant şart.",
      "Su şişesi al, yoksa bayılırsın ortada.",
      "Öğlen saatlerinde dışarı çıkma, pişersin.",
      "Şapka tak, beynin kaynayacak yoksa.",
      "Klimalı mekan bul, sığın oraya.",
      "Plajda olmalıydın şu an, yazık sana.",
    ],
    cokSicak: [ // 35 ve üstü
      "Cehennem mi burası? Çıkma dışarı!",
      "Yumurta pişer bu sıcakta, akıl sağlığını koru evde kal.",
      "Güneş çarpması garantili, hastaneyi ara.",
      "Bu sıcakta dışarı çıkan aklını kaybetmiştir.",
      "Sahra Çölü gibi burası, nefes bile alamazsın.",
      "Eriyen asfalta yapışırsın, dikkat et.",
      "Klimadan çıkma, hayatta kalma mücadelesi bu.",
      "40 derece ne demek biliyor musun? Ölüm demek.",
      "Böyle havada köpekler bile yürümüyor.",
    ],
  },
  // Hava durumuna göre yorumlar
  durum: {
    Clear: [
      "Güneş açmış, nadir bir olay, fotoğrafını çek.",
      "Bugün şansın varmış, piyango oyna.",
      "Güneşli hava mı? Şüpheli...",
      "Güneş gözlüğü tak, gözlerin kamaşacak.",
      "Harika hava, ama sen yine evde kalacaksın.",
      "Güneşli günün tadını çıkar, yarın yağmur yağar.",
      "Açık hava, moralin düzelsin biraz.",
      "Vitamin D günü, dışarı çık!",
    ],
    Clouds: [
      "Bulutlu, tıpkı senin geleceğin gibi.",
      "Güneş yok, morallerin bozuk, anlıyorum.",
      "Bulutlar gökyüzünü kaplamış, şaşırmadık.",
      "Gri gri bir gün, ruhun gibi.",
      "Bulutlar var ama yağmur yok, henüz...",
      "Güneş saklanmış, sen de evde saklan.",
      "Kapalı hava, depresyon garantili.",
      "Bulutlara bak, belki şekil görürsün, yapacak bir şey yok çünkü.",
    ],
    Rain: [
      "Yine yağmur yağıyor, şaşırdık mı? Hayır.",
      "Şemsiye al, ıslanınca 'neden almadım' deme.",
      "Yağmur var, ayakkabıların ıslanacak, güle güle.",
      "Allah rahmet eylesin saçlarına.",
      "Evde kal, dışarısı berbat.",
      "Bot giy, ayakkabın su alır yoksa.",
      "Yağmurda romantik yürüyüş mü? Boş ver, ıslanırsın.",
      "Camdan izle yağmuru, dışarı çıkma.",
      "Şemsiyeni aldın mı? Almadın tabii.",
    ],
    Drizzle: [
      "Çiseleme var, saçların mahvolacak.",
      "Hafif yağmur, tam 'şemsiye alsam mı' kararsızlığı.",
      "Islak ıslak gezmek istiyorsan buyur çık.",
      "Çiseleyen yağmur, sinsice ıslatır.",
      "Küçümseme bu yağmuru, sırılsıklam ederler.",
      "Şemsiye gereksiz gibi ama değil, al.",
    ],
    Thunderstorm: [
      "Fırtına var, evden çıkma yoksa yıldırım çarpar.",
      "Gök gürüldüyor, korktun mu? Korkmalısın.",
      "Fırtına patlamış, sen hala dışarı mı bakıyorsun?",
      "Şimşekler çakıyor, telefonu prize takma.",
      "Thor kızgın galiba, evde kal.",
      "Yıldırım düşerse ben uyarmıştım.",
      "Korkunç hava, film izle evde.",
    ],
    Snow: [
      "Kar yağıyor, düşüp kalçanı kırarsan ben uyarmıştım.",
      "Her yer beyaz, güzel değil mi? Hayır, soğuk.",
      "Kartopu oyna, sonra dona dona eve dön.",
      "Kar var, arabayı bırak evde.",
      "Karda yürürken dikkat et, kayarsın.",
      "Kar manzarası güzel ama soğuk işte.",
      "Kardan adam yap, çocukluğunu hatırla.",
      "Kış lastiği taktın mı? Yoksa kalırsın yolda.",
    ],
    Mist: [
      "Sisli hava, korku filmi gibi, korkma... belki.",
      "Sis var, kaybolma sakın.",
      "Önünü göremezsin ama sorun değil, yolunu zaten bilmiyorsun.",
      "Gizemli bir hava, dedektif gibi hisset.",
      "Sis çökmüş, yavaş git arabayla.",
      "Silent Hill havası var, dikkatli ol.",
    ],
    Fog: [
      "Yoğun sis, araba kullanma derim ama dinlemezsin.",
      "Sis çökmüş, hayalet görebilirsin.",
      "Puslu hava, tıpkı zihnim gibi.",
      "Göz gözü görmüyor, evde kal.",
      "Sis lambası aç, yoksa kaza yaparsın.",
      "Londra gibi olmuş burası, çay iç.",
    ],
    Haze: [
      "Pus var, akciğerlerine yazık.",
      "Hava kirli, maske tak... ya da takma, sen bilirsin.",
      "Puslu hava, nefes almaktan kaçın.",
      "Hava kalitesi berbat, pencereyi kapat.",
      "Duman mı sis mi belli değil, zararlı her türlü.",
      "Maske tak, corona değil hava kirliliği için.",
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
  const [tahmin, setTahmin] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const [sinirliYorum, setSinirliYorum] = useState({ sicaklik: '', durum: '' });

  // API Key'i .env dosyasından al (GitHub'a gizli kalır)
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Günlük tahminleri grupla (5 günlük)
  const gunlukTahminleriAl = (list) => {
    const gunler = {};
    list.forEach(item => {
      const tarih = new Date(item.dt * 1000);
      const gun = tarih.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' });
      
      if (!gunler[gun]) {
        gunler[gun] = {
          tarih: gun,
          temps: [],
          icons: [],
          descriptions: [],
          main: item.weather[0].main
        };
      }
      gunler[gun].temps.push(item.main.temp);
      gunler[gun].icons.push(item.weather[0].main);
      gunler[gun].descriptions.push(item.weather[0].description);
    });

    // Her gün için min/max ve en sık görülen hava durumunu bul
    return Object.values(gunler).slice(0, 5).map(gun => {
      const minTemp = Math.round(Math.min(...gun.temps));
      const maxTemp = Math.round(Math.max(...gun.temps));
      // En sık görülen hava durumu
      const enSikIcon = gun.icons.sort((a, b) =>
        gun.icons.filter(v => v === a).length - gun.icons.filter(v => v === b).length
      ).pop();
      return {
        tarih: gun.tarih,
        minTemp,
        maxTemp,
        icon: enSikIcon,
        description: gun.descriptions[0]
      };
    });
  };

  const havaDurumuGetir = async () => {
    if (!sehir.trim()) {
      setHata('Şehir adı yaz da öyle ara, boş mu arıyorsun?');
      return;
    }

    setYukleniyor(true);
    setHata('');
    setHava(null);
    setTahmin(null);

    try {
      // Anlık hava durumu
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

      // 5 günlük tahmin
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(sehir)}&appid=${API_KEY}&units=metric&lang=tr`
      );
      
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        const gunlukTahmin = gunlukTahminleriAl(forecastData.list);
        setTahmin(gunlukTahmin);
      }

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

      {/* Ana hava kartı */}
      {hava && (
        <div className="ana-hava-karti">
          <div className="hava-ust">
            <div className="hava-ikon-buyuk">{havaDurumuIkonu(hava.weather[0].main)}</div>
            <div className="hava-sicaklik-buyuk">{Math.round(hava.main.temp)}°C</div>
            <div className="hava-aciklama-buyuk">{hava.weather[0].description}</div>
            <div className="hava-sehir-buyuk">{hava.name}, {hava.sys.country}</div>
          </div>
          <div className="hava-detaylar-buyuk">
            <div className="hava-detay-buyuk">Yağış: {hava.rain && hava.rain['1h'] ? `${hava.rain['1h']} mm` : '%'} </div>
            <div className="hava-detay-buyuk">Nem: %{hava.main.humidity}</div>
            <div className="hava-detay-buyuk">Rüzgar: {hava.wind.speed} km/s</div>
          </div>
        </div>
      )}

      {/* 5 Günlük Tahmin */}
      {tahmin && tahmin.length > 0 && (
        <div className="tahmin-bolumu-modern">
          {tahmin.map((gun, index) => (
            <div key={index} className="tahmin-karti-modern">
              <div className="tahmin-gun-modern">{gun.tarih}</div>
              <div className="tahmin-ikon-modern">{havaDurumuIkonu(gun.icon)}</div>
              <div className="tahmin-sicaklik-modern">
                <span className="tahmin-max-modern">{gun.maxTemp}°</span>
                <span className="tahmin-min-modern">{gun.minTemp}°</span>
              </div>
              <div className="tahmin-durum-modern">{gun.description}</div>
            </div>
          ))}
        </div>
      )}

      {/* Sinirli Yorumlar */}
      {(sinirliYorum.sicaklik || sinirliYorum.durum) && (
        <div className="yorumlar-bolumu-alt">
          <div className="sinirli-yorum-alt">
            <span className="yorum-emoji">😒</span>
            <p>{sinirliYorum.sicaklik}</p>
          </div>
          <div className="sinirli-yorum-alt">
            <span className="yorum-emoji">😤</span>
            <p>{sinirliYorum.durum}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
