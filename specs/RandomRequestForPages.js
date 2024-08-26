import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend, Rate } from 'k6/metrics';

/*
* K6 kodu, test sırasında belirli sayfalara rastgele istekler gönderir. Kodunuzda belirtilen pages dizisi içindeki her bir sayfa URL'si,
* test çalışırken rastgele seçilir ve bu sayfalara istekler gönderilir. Yani, test sırasında her bir sanal kullanıcı
* bu sayfalardan birine istek yapar, ancak hangi sayfaya istek yapacağı her iterasyonda rastgele belirlenir.
* */

// Özel metrikler oluşturma
let responseTimes = new Trend('custom_response_times'); // Özel bir trend metriği, yanıt süresini takip etmek için
let errorCount = new Counter('errors'); // Hata sayacını oluşturur
let successRate = new Rate('successful_requests'); // Başarılı istek oranını takip etmek için
let errorRate = new Rate('error_requests'); // Hatalı istek oranını takip etmek için

// Test edilecek sayfaların listesi
const pages = [
    '/hakkimizda/iletisim',
    '/hakkimizda/kariyer',
    '/hakkimizda/ekibimiz',
    // Buraya diğer sayfaları ekleyin
];

export const options = {
    scenarios: {
        constant_load: {
            executor: 'constant-vus', // Sabit sayıda sanal kullanıcı çalıştırmak için
            vus: 20, // Sabit kullanıcı sayısı
            duration: '1m', // Test süresi
        },
        ramping_load: {
            executor: 'ramping-vus', // Kullanıcı sayısının zamanla arttığı bir senaryo
            startVUs: 0, // Başlangıçtaki sanal kullanıcı sayısı
            stages: [
                { duration: '1m', target: 20 }, // İlk 1 dakika sonunda 20 kullanıcıya ulaş
                { duration: '2m', target: 50 }, // Sonraki 2 dakika içinde 50 kullanıcıya ulaş
                { duration: '1m', target: 0 }, // Son 1 dakikada 0 kullanıcıya düş
            ],
            gracefulRampDown: '30s', // Yük azalırken kullanıcıların 30 saniye içinde düzgün şekilde tamamlanmasına izin verir
        },
        spike_load: {
            executor: 'per-vu-iterations', // Her bir sanal kullanıcı için belirli sayıda yineleme çalıştırır
            vus: 30, // Sanal kullanıcı sayısı
            iterations: 300, // Her sanal kullanıcının çalıştıracağı yineleme sayısı
            maxDuration: '3m', // Maksimum test süresi
        },
    },
    thresholds: {
        custom_response_times: ['p(95)<250'], // Yanıt süresinin %95'lik diliminde 250ms altında olmasını hedefler
        successful_requests: ['rate>0.95'], // Başarılı istek oranının %95'in üzerinde olmasını hedefler
        error_requests: ['rate<0.05'], // Hatalı istek oranının %5'ten az olmasını hedefler
        errors: ['count<20'], // Hata sayısının 20'den az olmasını hedefler
    },
};

// Ana test fonksiyonu
export default function () {
    //const BASE_URL = 'https://www.hangikredi.com'; // Temel URL
    const BASE_URL = 'https://preprod.hangikredi.com'; // Temel URL

    // Sayfalardan rastgele birini seç
    const randomPage = pages[Math.floor(Math.random() * pages.length)];
    const url = `${BASE_URL}${randomPage}`;

    // GET isteği gönderilir ve yanıt alınır
    let res = http.get(url);

    // Yanıtı kontrol etme ve hataları ele alma
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response body is not empty': (r) => r.body.length > 0,
    });

    // Yanıtın durum kodunu kontrol et ve metrikleri güncelle
    if (res.status === 200) {
        console.log(`Successfully accessed ${url}`);
        successRate.add(1); // Başarılı istek oranı arttırılır
        errorRate.add(0); // Hatalı istek oranı azaltılır
    } else {
        console.error(`Failed to access ${url}. Status code: ${res.status}`);
        errorCount.add(1); // Hata sayacı bir arttırılır
        successRate.add(0); // Başarısız istek oranı eklenir
        errorRate.add(1); // Hatalı istek oranı arttırılır
    }

    // Yanıt süresi metriği kaydetme
    responseTimes.add(res.timings.duration); // Yanıt süresi metriğe eklenir

    sleep(1); // Sanal kullanıcıyı 1 saniye bekletir
}
