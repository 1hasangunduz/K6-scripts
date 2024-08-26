import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

// Özel metrikler oluşturma
let MyTrend = new Trend('custom_duration');
let ErrorCount = new Counter('errors');

export const options = {
    scenarios: {
        // Sabit yük testi senaryosu
        constant_load: {
            executor: 'constant-vus',
            vus: 10, // Sabit kullanıcı sayısı
            duration: '30s', // Test süresi
        },
        // Artan yük testi senaryosu
        increasing_load: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '30s', target: 50 }, // İlk 30 saniye boyunca 50 kullanıcıya ulaş
                { duration: '1m', target: 100 }, // Sonraki 1 dakika boyunca 100 kullanıcıya ulaş
            ],
            gracefulRampDown: '30s', // VUs kapatıldığında 30 saniye boyunca kademeli olarak kapatılır
        },
        // Zirve yük testi senaryosu
        peak_load: {
            executor: 'per-vu-iterations',
            vus: 50,
            iterations: 200, // Her kullanıcı için 200 döngü çalıştırılır
            maxDuration: '2m',
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<200'], // 95. yüzdelik dilimdeki tüm istekler 200ms'den kısa olmalı
        errors: ['count<10'], // 10'dan az hata olmalı
    },
};

export default function () {
    const BASE_URL = 'https://example.com/api'; // Test edilecek API base URL

    // Rastgele veri oluşturma
    const payload = JSON.stringify({
        username: `user${__VU}_${Math.floor(Math.random() * 1000)}`,
        email: `test${__VU}@example.com`,
        password: 'password123',
    });

    const headers = { 'Content-Type': 'application/json' };


    // POST isteği gönderme
    let res = http.post(`${BASE_URL}/register`, payload, { headers });

    // Yanıtı kontrol etme
    let checkRes = check(res, {
        'status was 200': (r) => r.status === 200,
        'response body contains id': (r) => JSON.parse(r.body).id !== undefined,
    });

    if (!checkRes) {
        ErrorCount.add(1); // Hata sayacını artır
    }

    // Özel metrik kaydetme
    MyTrend.add(res.timings.duration);

    sleep(1);
}
