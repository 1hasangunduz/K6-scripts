import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend, Rate } from 'k6/metrics';

// Custom metrics monitoring
let responseTimes = new Trend('custom_response_times'); // Custom response time ölçmek için Trend metriği
let errorCount = new Counter('errors'); // Errors sayısını saymak için Counter metriği
let successRate = new Rate('successful_requests'); // Başarılı isteklerin(success rate) oranını ölçmek için Rate metriği
let errorRate = new Rate('error_requests'); // Hatalı isteklerin(error rate) oranını ölçmek için Rate metriği

export const options = {
    scenarios: {
        // Konut kredisi ana sayfa senaryosu
        housingloan_homepage: {
            executor: 'constant-vus', // Sabit sanal kullanıcı sayısıyla çalışan yürütücü
            exec: 'housingLoanHomepage', // Çalıştırılacak fonksiyonun adı
            vus: 15, // Sanal kullanıcı sayısı
            duration: '1m', // Duration of the scenario
        },
        // Konut kredisi arama senaryosu
        housingloan_search: {
            executor: 'constant-vus',
            exec: 'housingLoanSearch',
            vus: 25,
            duration: '1m',
        },
        // Konut kredisi detay senaryosu
        housingloan_detail: {
            executor: 'constant-vus',
            exec: 'housingLoanDetail',
            vus: 35,
            duration: '1m',
        },
        // Konut kredisi başvuru yönlendirme senaryosu
        housingloan_recourse_forward: {
            executor: 'constant-vus',
            exec: 'housingLoanRecourseForward',
            vus: 5,
            duration: '1m',
        },
        // Konut kredisi başvuru formu senaryosu
        housingloan_recourse_form: {
            executor: 'constant-vus',
            exec: 'housingLoanRecourseForm',
            vus: 5,
            duration: '1m',
        },
        // Konut kredisi banka listesi senaryosu
        housingloan_bank_list: {
            executor: 'constant-vus',
            exec: 'housingLoanBankList',
            vus: 5,
            duration: '1m',
        },
        // Taşıt kredisi ana sayfa senaryosu
        vehicleloan_homepage: {
            executor: 'constant-vus',
            exec: 'vehicleLoanHomepage',
            vus: 5,
            duration: '1m',
        },
        // Taşıt kredisi arama senaryosu
        vehicleloan_search: {
            executor: 'constant-vus',
            exec: 'vehicleLoanSearch',
            vus: 5,
            duration: '1m',
        },
        // Taşıt kredisi detay senaryosu
        vehicleloan_detail: {
            executor: 'constant-vus',
            exec: 'vehicleLoanDetail',
            vus: 5,
            duration: '1m',
        },
        // Taşıt kredisi başvuru yönlendirme senaryosu
        vehicleloan_recourse_forward: {
            executor: 'constant-vus',
            exec: 'vehicleLoanRecourseForward',
            vus: 5,
            duration: '1m',
        },
        // Taşıt kredisi başvuru formu senaryosu
        vehicleloan_recourse_form: {
            executor: 'constant-vus',
            exec: 'vehicleLoanRecourseForm',
            vus: 5,
            duration: '1m',
        },
        // Taşıt kredisi banka listesi senaryosu
        vehicleloan_bank_list: {
            executor: 'constant-vus',
            exec: 'vehicleLoanBankList',
            vus: 5,
            duration: '1m',
        }
    },
    thresholds: {
        custom_response_times: ['p(95)<250'], // Tepki süreleri için %95 percentilinin 250ms altında olması
        successful_requests: ['rate>0.95'], // Başarılı istek oranının %95'ten yüksek olması
        error_requests: ['rate<0.05'], // Hatalı istek oranının %5'ten düşük olması
        errors: ['count<20'], // Toplam hata sayısının 20'den az olması
        //successRate: ['rate>0.95'], // Başarılı istek oranının %95'ten yüksek olması
        //errorRate: ['rate<0.05'], // Hatalı istek oranının %5'ten düşük olması
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

    // Konsola isteğin URL'si ve yanıt durumu ile süresi yazdırılır
    //console.log(`Request URL: ${url}`);
    //console.log(`Status: ${res.status}, Duration: ${res.timings.duration}ms`);
    sleep(1); // Bir sonraki istek öncesinde 1 saniye bekleme
}


// K6 senaryolarının fonksiyonlarla eşleştirilmesi
export function housingLoanHomepage() {
    performGetRequest("/kredi/konut-kredisi", "HousingLoan Home");
}

export function housingLoanSearch() {
    let maturity = Math.floor(Math.random() * (120 - 12) / 12) * 12 + 12; // 12, 24, ..., 120 arasında rastgele bir vade seçimi
    let amount = Math.floor(Math.random() * (500000 - 100000) / 50000) * 50000 + 100000; // 100000, 150000, ..., 500000 arasında rastgele bir tutar seçimi
    performGetRequest(`/kredi/konut-kredisi/sorgulama?amount=${amount}&maturity=${maturity}`, "HousingLoan List");
}

export function housingLoanDetail() {
    let maturity = Math.floor(Math.random() * (120 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (500000 - 100000) / 50000) * 50000 + 100000;
    performGetRequest(`/kredi/konut-kredisi/akbank/konut-kredisi?amount=${amount}&maturity=${maturity}`, "HousingLoan Detail");
}

export function housingLoanRecourseForward() {
    let maturity = Math.floor(Math.random() * (120 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (500000 - 100000) / 50000) * 50000 + 100000;
    performGetRequest(`/kredi/konut-kredisi/ing-bank/basvuru/yonlendirme?id=77&ct=List&amount=${amount}&maturity=${maturity}`, "HousingLoan Forward");
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
    performGetRequest("/kredi/tasit-kredisi", "VehicleLoan Home");
}

export function vehicleLoanSearch() {
    let maturity = Math.floor(Math.random() * (36 - 12) / 12) * 12 + 12; // 12, 24, 36 arasında rastgele bir vade seçimi
    let amount = Math.floor(Math.random() * (400000 - 100000) / 25000) * 25000 + 100000; // 100000, 125000, ..., 400000 arasında rastgele bir tutar seçimi
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
