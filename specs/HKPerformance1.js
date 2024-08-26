import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend, Rate } from 'k6/metrics';

// Özel metrikler oluşturma
let responseTimes = new Trend('custom_response_times'); // Özel bir trend metriği, yanıt süresini takip etmek için kullanılır
let errorCount = new Counter('errors'); // Hata sayacını oluşturur
let successRate = new Rate('successful_requests'); // Başarılı istek oranını takip etmek için bir oran metriği

export const options = {
    // Test senaryoları yapılandırmaları
    scenarios: {
        constant_load: {
            executor: 'constant-vus', // Sabit sayıda sanal kullanıcı çalıştırmak için kullanılır
            vus: 20, // Sabit kullanıcı sayısı (artırılmış)
            duration: '1m', // Testin süresi
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
    // Eşik değerler
    thresholds: {
        http_req_duration: ['p(95)<250'], // HTTP isteği süresi için %95'lik yüzdelik dilimde 250ms altında olmasını hedefler
        'successful_requests': ['rate>0.95'], // Başarılı istek oranının %95'in üzerinde olmasını hedefler
        'errors': ['count<20'], // Hata sayısının 20'den az olmasını hedefler
    },
};

// Ana test fonksiyonu
export default function () {
    const BASE_URL = 'https://reqres.in/api'; // API'nin temel URL'si

    // API'nin tanımlı kullanıcı bilgileri
    const payload = JSON.stringify({
        email: 'eve.holt@reqres.in', // Tanımlı e-posta adresi
        password: 'password123', // Sabit parola
    });

    const headers = { 'Content-Type': 'application/json' }; // JSON içeriği için gerekli başlık

    // POST isteği gönderilir ve yanıt alınır
    let res = http.post(`${BASE_URL}/register`, payload, { headers });

    // Yanıtı kontrol etme ve hataları ele alma
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response body contains id': (r) => {
            try {
                const body = JSON.parse(r.body);
                return body.id !== undefined;
            } catch (e) {
                return false;
            }
        },
    });

    // Yanıtın JSON formatında olup olmadığını kontrol edin ve logları yönetme
    if (res.status === 200) {
        try {
            const body = JSON.parse(res.body);
            if (body.id) {
                console.log(`Successfully registered with ID: ${body.id}`);
                successRate.add(1); // Başarılı istek oranı arttırılır
            } else {
                console.error(`No ID found in response: ${res.body}`);
                errorCount.add(1); // Hata sayacı bir arttırılır
                successRate.add(0); // Başarısız istek oranı eklenir
            }
        } catch (e) {
            console.error(`Failed to parse response body as JSON: ${res.body}`);
            errorCount.add(1); // Hata sayacı bir arttırılır
            successRate.add(0); // Başarısız istek oranı eklenir
        }
    } else {
        console.error(`Unexpected status code: ${res.status}. Response body: ${res.body}`);
        errorCount.add(1); // Hata sayacı bir arttırılır
        successRate.add(0); // Başarısız istek oranı eklenir
    }

    // Yanıt süresi metriği kaydetme
    responseTimes.add(res.timings.duration); // Yanıt süresi metriğe eklenir

    sleep(1); // Sanal kullanıcıyı 1 saniye bekletir
}
