import http from 'k6/http';
import {check, sleep} from 'k6';
import {Counter, Trend, Rate} from 'k6/metrics';

// Custom metrics monitoring
let responseTimes = new Trend('custom_response_times'); // Yanıt sürelerini ölçmek için Trend metriği
let errorCount = new Counter('errors'); // Hatalı istek sayısını ölçmek için Counter metriği
let successRate = new Rate('successful_requests'); // Başarılı istek oranını ölçmek için Rate metriği
let errorRate = new Rate('error_requests'); // Hatalı istek oranını ölçmek için Rate metriği

//ramping-arrival-rate executor'ı, istek oranını kademeli olarak artırır. Bu tür, sistemin yük altında nasıl performans gösterdiğini adım adım değerlendirmek için kullanılır.
//Test, başlangıçta 1 istek/saniye ile başlar,
//sonra 2 dakika boyunca 10 istek/saniyeye çıkar, 3 dakika boyunca 20 istek/saniyeye ulaşır ve son olarak 2 dakika boyunca istek sayısını 0'a düşür.

export const options = {
    /*stages : Yükün kademeli olarak arttırılacağı aşamalar:
                       İlk 2 dakika boyunca 10 istek/saniye.
                       Sonraki 3 dakika boyunca 20 istek/saniye.
S                       on 2 dakika boyunca istek oranını 0’a düşür.*/
    scenarios: {
        housingloan_homepage: {
            executor: 'ramping-arrival-rate',
            startRate: 1, // Testin başlangıç oranı (istek/saniye).
            timeUnit: '1s', // Zaman birimi
            preAllocatedVUs: 10, // Başlangıçta tahsis edilen sanal kullanıcı sayısı.
            maxVUs: 50, //Maksimum sanal kullanıcı sayısı.
            stages: [
                {duration: '2m', target: 10}, // 2 dakika boyunca 10 istek/saniye
                {duration: '3m', target: 20}, // 3 dakika boyunca 20 istek/saniye
                {duration: '2m', target: 0}, // 2 dakika boyunca istek oranını 0'a düşür
            ],
            exec: 'housingLoanHomepage', // Çalıştırılacak fonksiyonun adı
        },
        housingloan_search: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 50,
            stages: [
                {duration: '2m', target: 10},
                {duration: '3m', target: 20},
                {duration: '2m', target: 0},
            ],
            exec: 'housingLoanSearch',
        },
        housingloan_detail: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 50,
            stages: [
                {duration: '2m', target: 10},
                {duration: '3m', target: 20},
                {duration: '2m', target: 0},
            ],
            exec: 'housingLoanDetail',
        },
        housingloan_recourse_forward: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 50,
            stages: [
                {duration: '2m', target: 10},
                {duration: '3m', target: 20},
                {duration: '2m', target: 0},
            ],
            exec: 'housingLoanRecourseForward',
        },
        housingloan_recourse_form: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 50,
            stages: [
                {duration: '2m', target: 10},
                {duration: '3m', target: 20},
                {duration: '2m', target: 0},
            ],
            exec: 'housingLoanRecourseForm',
        },
        housingloan_bank_list: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 50,
            stages: [
                {duration: '2m', target: 10},
                {duration: '3m', target: 20},
                {duration: '2m', target: 0},
            ],
            exec: 'housingLoanBankList',
        },
        vehicleloan_homepage: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 50,
            stages: [
                {duration: '2m', target: 10},
                {duration: '3m', target: 20},
                {duration: '2m', target: 0},
            ],
            exec: 'vehicleLoanHomepage',
        },
        vehicleloan_search: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 50,
            stages: [
                {duration: '2m', target: 10},
                {duration: '3m', target: 20},
                {duration: '2m', target: 0},
            ],
            exec: 'vehicleLoanSearch',
        },
        vehicleloan_detail: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 50,
            stages: [
                {duration: '2m', target: 10},
                {duration: '3m', target: 20},
                {duration: '2m', target: 0},
            ],
            exec: 'vehicleLoanDetail',
        },
        vehicleloan_recourse_forward: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 50,
            stages: [
                {duration: '2m', target: 10},
                {duration: '3m', target: 20},
                {duration: '2m', target: 0},
            ],
            exec: 'vehicleLoanRecourseForward',
        },
        vehicleloan_recourse_form: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 50,
            stages: [
                {duration: '2m', target: 10},
                {duration: '3m', target: 20},
                {duration: '2m', target: 0},
            ],
            exec: 'vehicleLoanRecourseForm',
        },
        vehicleloan_bank_list: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 50,
            stages: [
                {duration: '2m', target: 10},
                {duration: '3m', target: 20},
                {duration: '2m', target: 0},
            ],
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
