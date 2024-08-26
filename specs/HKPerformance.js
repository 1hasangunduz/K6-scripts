import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

// Özel metrikler oluşturma
let MyTrend = new Trend('custom_duration'); // Özel bir trend metriği, yanıt süresini takip etmek için kullanılır
let ErrorCount = new Counter('errors'); // Hata sayacını oluşturur

export const options = {
    // Test senaryoları yapılandırmaları
    scenarios: {
        constant_load: {
            executor: 'constant-vus', // Sabit sayıda sanal kullanıcı çalıştırmak için kullanılır
            vus: 10, // Sabit kullanıcı sayısı
            duration: '30s', // Testin süresi
        },
        increasing_load: {
            executor: 'ramping-vus', // Kullanıcı sayısının zamanla arttığı bir senaryo
            startVUs: 0, // Başlangıçtaki sanal kullanıcı sayısı
            stages: [
                { duration: '30s', target: 50 }, // İlk 30 saniye sonunda 50 kullanıcıya ulaş
                { duration: '1m', target: 100 }, // Sonraki 1 dakika içinde 100 kullanıcıya ulaş
            ],
            gracefulRampDown: '30s', // Yük azalırken kullanıcıların 30 saniye içinde düzgün şekilde tamamlanmasına izin verir
        },
        peak_load: {
            executor: 'per-vu-iterations', // Her bir sanal kullanıcı için belirli sayıda yineleme çalıştırır
            vus: 50, // Sanal kullanıcı sayısı
            iterations: 200, // Her sanal kullanıcının çalıştıracağı yineleme sayısı
            maxDuration: '2m', // Maksimum test süresi
        },
    },
    // Eşik değerler
    thresholds: {
        http_req_duration: ['p(95)<200'], // HTTP isteği süresi için %95'lik yüzdelik dilimde 200ms altında olmasını hedefler
        errors: ['count<10'], // Hata sayısının 10'dan az olmasını hedefler
    },
};

// Ana test fonksiyonu
export default function () {
    //const BASE_URL = 'https://example.com/api'; // API'nin temel URL'si
    const BASE_URL = 'https://reqres.in/'; // API'nin temel URL'si

    const payload = JSON.stringify({
        username: `user${__VU}_${Math.floor(Math.random() * 1000)}`, // Kullanıcı adı, her sanal kullanıcı için benzersiz olacak şekilde oluşturulur
        email: `test${__VU}@example.com`, // E-posta adresi, her sanal kullanıcı için benzersiz olacak şekilde oluşturulur
        password: 'password123', // Sabit parola
    });

    const headers = { 'Content-Type': 'application/json' }; // JSON içeriği için gerekli başlık

    // POST isteği gönderilir ve yanıt alınır
    let res = http.post(`${BASE_URL}/register`, payload, { headers });

    // Yanıtın JSON formatında olup olmadığını kontrol edin
    if (res.status === 200) {
        try {
            const body = JSON.parse(res.body); // Yanıt gövdesi JSON formatına çevrilir
            if (body.id) {
                console.log(`Successfully registered with ID: ${body.id}`); // Başarıyla kaydolunduğunda loglanır
            } else {
                console.error(`No ID found in response: ${res.body}`); // ID bulunamazsa hata loglanır
                ErrorCount.add(1); // Hata sayacı bir arttırılır
            }
        } catch (e) {
            console.error(`Failed to parse response body as JSON: ${res.body}`); // Yanıt JSON formatına çevrilemezse hata loglanır
            ErrorCount.add(1); // Hata sayacı bir arttırılır
        }
    } else {
        console.error(`Unexpected status code: ${res.status}. Response body: ${res.body}`); // Beklenmedik durum kodu gelirse hata loglanır
        ErrorCount.add(1); // Hata sayacı bir arttırılır
    }

    // Özel metrik kaydetme
    MyTrend.add(res.timings.duration); // Yanıt süresi metriğe eklenir

    sleep(1); // Sanal kullanıcıyı 1 saniye bekletir
}
