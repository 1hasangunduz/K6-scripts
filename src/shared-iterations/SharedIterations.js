import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend, Rate } from 'k6/metrics';

// Custom metrics monitoring
let responseTimes = new Trend('custom_response_times'); // Yanıt sürelerini ölçmek için Trend metriği
let errorCount = new Counter('errors'); // Hatalı istek sayısını ölçmek için Counter metriği
let successRate = new Rate('successful_requests'); // Başarılı istek oranını ölçmek için Rate metriği
let errorRate = new Rate('error_requests'); // Hatalı istek oranını ölçmek için Rate metriği

//shared-iterations executor'ı, belirli bir sayıda toplam iterasyonu tüm sanal kullanıcılara paylaştırır. Her sanal kullanıcı, toplam iterasyon sayısına katkıda bulunur.
//Toplamda 50 iterasyon gerçekleştirilecektir. 10 sanal kullanıcı bu iterasyonları paylaştırır. Test, 5 dakika boyunca çalışabilir.
export const options = {
    scenarios: {
        housingloan_homepage: {
            executor: 'shared-iterations',
            vus: 10, // Sanal kullanıcı sayısı
            iterations: 50, // Toplam iterasyon sayısı
            maxDuration: '5m', // Maksimum süre
            exec: 'housingLoanHomepage', // Çalıştırılacak fonksiyonun adı
        },
        housingloan_search: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 50,
            maxDuration: '5m',
            exec: 'housingLoanSearch',
        },
        housingloan_detail: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 50,
            maxDuration: '5m',
            exec: 'housingLoanDetail',
        },
        housingloan_recourse_forward: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 50,
            maxDuration: '5m',
            exec: 'housingLoanRecourseForward',
        },
        housingloan_recourse_form: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 50,
            maxDuration: '5m',
            exec: 'housingLoanRecourseForm',
        },
        housingloan_bank_list: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 50,
            maxDuration: '5m',
            exec: 'housingLoanBankList',
        },
        vehicleloan_homepage: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 50,
            maxDuration: '5m',
            exec: 'vehicleLoanHomepage',
        },
        vehicleloan_search: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 50,
            maxDuration: '5m',
            exec: 'vehicleLoanSearch',
        },
        vehicleloan_detail: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 50,
            maxDuration: '5m',
            exec: 'vehicleLoanDetail',
        },
        vehicleloan_recourse_forward: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 50,
            maxDuration: '5m',
            exec: 'vehicleLoanRecourseForward',
        },
        vehicleloan_recourse_form: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 50,
            maxDuration: '5m',
            exec: 'vehicleLoanRecourseForm',
        },
        vehicleloan_bank_list: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 50,
            maxDuration: '5m',
            exec: 'vehicleLoanBankList',
        },
    },
    thresholds: {
        custom_response_times: ['p(95)<250'], // Tepki sürelerinin %95 percentilinin 250ms altında olması
        successful_requests: ['rate>0.95'], // Başarılı istek oranının %95'ten yüksek olması
        error_requests: ['rate<0.05'], // Hatalı istek oranının %5'ten düşük olması
        errors: ['count<20'], // Toplam hata sayısının 20'den az olması
    },
};

const BASE_URL = 'https://preprod.hangikredi.com';

// GET isteklerini gerçekleştiren, loglama ve metrik ekleyen yardımcı fonksiyon
function performGetRequest(endpoint, name) {
    const url = `${BASE_URL}${endpoint}`;
    let res = http.get(url); // GET isteği gönderilir

    // Gelen yanıtın 200 olup olmadığını ve yanıt gövdesinin boş olmadığını kontrol eder
    let isStatus200 = check(res, {
        'status is 200': (r) => r.status === 200,
        'response body is not empty': (r) => r.body.length > 0,
    });

    // Yanıt başarılıysa veya başarısızsa ilgili metrikler güncellenir
    if (isStatus200) {
        successRate.add(1); // Başarılı istek oranına ekleme
        errorRate.add(0);   // Hatalı istek oranına ekleme
    } else {
        errorCount.add(1);  // Hata sayısına ekleme
        successRate.add(0);
        errorRate.add(1);
        console.log(`Error: Request to ${url} failed with status ${res.status}`);
    }

    responseTimes.add(res.timings.duration); // Yanıt süresi metriğine ekleme

    // Konsolda yanıt durumunu yazdırır
    console.log(`${name}: ${res.status} - ${res.timings.duration}ms`);
    sleep(1); // İstekler arasında 1 saniye bekler
}

// İlgili işlevlerin tanımlanması
export function housingLoanHomepage() {
    performGetRequest(`/kredi/konut-kredisi`, "HousingLoan Homepage");
}

export function housingLoanSearch() {
    let maturity = Math.floor(Math.random() * (120 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (500000 - 100000) / 50000) * 50000 + 100000;
    performGetRequest(`/kredi/konut-kredisi/sorgulama?amount=${amount}&maturity=${maturity}`, "HousingLoan Search");
}

export function housingLoanDetail() {
    let maturity = Math.floor(Math.random() * (120 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (500000 - 100000) / 50000) * 50000 + 100000;
    performGetRequest(`/kredi/konut-kredisi/akbank/tasit-kredisi?amount=${amount}&maturity=${maturity}`, "HousingLoan Detail");
}

export function housingLoanRecourseForward() {
    let maturity = Math.floor(Math.random() * (120 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (500000 - 100000) / 50000) * 50000 + 100000;
    performGetRequest(`/kredi/konut-kredisi/qnb-finansbank/basvuru/yonlendirme?id=84&ct=List&amount=${amount}&maturity=${maturity}`, "HousingLoan Forward");
}

export function housingLoanRecourseForm() {
    let maturity = Math.floor(Math.random() * (120 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (500000 - 100000) / 50000) * 50000 + 100000;
    performGetRequest(`/kredi/konut-kredisi/akbank/basvuru/form?id=81&ct=List&activityStatus=All&amount=${amount}&maturity=${maturity}`, "HousingLoan Form");
}

export function housingLoanBankList() {
    let maturity = Math.floor(Math.random() * (120 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (500000 - 100000) / 50000) * 50000 + 100000;
    performGetRequest(`/kredi/konut-kredisi/turkiye-is-bankasi?amount=${amount}&maturity=${maturity}`, "HousingLoan Bank List");
}

export function vehicleLoanHomepage() {
    performGetRequest(`/kredi/tasit-kredisi`, "VehicleLoan Home");
}

export function vehicleLoanSearch() {
    let maturity = Math.floor(Math.random() * (36 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (400000 - 100000) / 25000) * 25000 + 100000;
    performGetRequest(`/kredi/tasit-kredisi/sorgulama?amount=${amount}&maturity=${maturity}`, "VehicleLoan List");
}

export function vehicleLoanDetail() {
    let maturity = Math.floor(Math.random() * (36 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (400000 - 100000) / 25000) * 25000 + 100000;
    performGetRequest(`/kredi/tasit-kredisi/akbank/tasit-kredisi?amount=${amount}&maturity=${maturity}`, "VehicleLoan Detail");
}

export function vehicleLoanRecourseForward() {
    let maturity = Math.floor(Math.random() * (36 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (400000 - 100000) / 25000) * 25000 + 100000;
    performGetRequest(`/kredi/tasit-kredisi/qnb-finansbank/basvuru/yonlendirme?id=84&ct=List&amount=${amount}&maturity=${maturity}`, "VehicleLoan Forward");
}

export function vehicleLoanRecourseForm() {
    let maturity = Math.floor(Math.random() * (36 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (400000 - 100000) / 25000) * 25000 + 100000;
    performGetRequest(`/kredi/tasit-kredisi/akbank/basvuru/form?id=81&ct=List&activityStatus=All&amount=${amount}&maturity=${maturity}`, "VehicleLoan Form");
}

export function vehicleLoanBankList() {
    let maturity = Math.floor(Math.random() * (36 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (400000 - 100000) / 25000) * 25000 + 100000;
    performGetRequest(`/kredi/tasit-kredisi/turkiye-is-bankasi?amount=${amount}&maturity=${maturity}`, "VehicleLoan Bank List");
}
