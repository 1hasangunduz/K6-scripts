import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend, Rate } from 'k6/metrics';

// Custom metrics
let responseTimes = new Trend('custom_response_times');
let errorCount = new Counter('errors');
let successRate = new Rate('successful_requests');
let errorRate = new Rate('error_requests');

export const options = {
    scenarios: {
        housingloan_homepage: {
            executor: 'constant-vus',
            exec: 'housingLoanHomepage',
            vus: 20,
            duration: '1m',
        },
        housingloan_search: {
            executor: 'constant-vus',
            exec: 'housingLoanSearch',
            vus: 20,
            duration: '1m',
        },
        housingloan_detail: {
            executor: 'constant-vus',
            exec: 'housingLoanDetail',
            vus: 20,
            duration: '1m',
        },
        housingloan_recourse_forward: {
            executor: 'constant-vus',
            exec: 'housingLoanRecourseForward',
            vus: 20,
            duration: '1m',
        },
        housingloan_recourse_form: {
            executor: 'constant-vus',
            exec: 'housingLoanRecourseForm',
            vus: 20,
            duration: '1m',
        },
        housingloan_bank_list: {
            executor: 'constant-vus',
            exec: 'housingLoanBankList',
            vus: 20,
            duration: '1m',
        },
        vehicleloan_homepage: {
            executor: 'constant-vus',
            exec: 'vehicleLoanHomepage',
            vus: 20,
            duration: '1m',
        },
        vehicleloan_search: {
            executor: 'constant-vus',
            exec: 'vehicleLoanSearch',
            vus: 20,
            duration: '1m',
        },
        vehicleloan_detail: {
            executor: 'constant-vus',
            exec: 'vehicleLoanDetail',
            vus: 20,
            duration: '1m',
        },
        vehicleloan_recourse_forward: {
            executor: 'constant-vus',
            exec: 'vehicleLoanRecourseForward',
            vus: 20,
            duration: '1m',
        },
        vehicleloan_recourse_form: {
            executor: 'constant-vus',
            exec: 'vehicleLoanRecourseForm',
            vus: 20,
            duration: '1m',
        },
        vehicleloan_bank_list: {
            executor: 'constant-vus',
            exec: 'vehicleLoanBankList',
            vus: 20,
            duration: '1m',
        }
    },
    thresholds: {
        custom_response_times: ['p(95)<250'],
        successful_requests: ['rate>0.95'],
        error_requests: ['rate<0.05'],
        errors: ['count<20'],
    },
};

const BASE_URL = 'https://preprod.hangikredi.com';

// Helper function to perform GET requests with logging and metrics
function performGetRequest(endpoint, name) {
    const url = `${BASE_URL}${endpoint}`;
    let res = http.get(url);

    let isStatus200 = check(res, {
        'status is 200': (r) => r.status === 200,
        'response body is not empty': (r) => r.body.length > 0,
    });

    if (isStatus200) {
        successRate.add(1);
        errorRate.add(0);
    } else {
        errorCount.add(1);
        successRate.add(0);
        errorRate.add(1);
    }

    responseTimes.add(res.timings.duration);

    console.log(`Request URL: ${url}`);
    console.log(`Status: ${res.status}, Duration: ${res.timings.duration}ms`);
    sleep(1); // Wait for 1 second before next request
}

// K6 scenarios mapped to Locust tasks
export function housingLoanHomepage() {
    performGetRequest("/kredi/konut-kredisi", "HousingLoan Home");
}

export function housingLoanSearch() {
    let maturity = Math.floor(Math.random() * (120 - 12) / 12) * 12 + 12; // Random from 12, 24, ..., 120
    let amount = Math.floor(Math.random() * (500000 - 100000) / 50000) * 50000 + 100000; // Random from 100000, 150000, ..., 500000
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
    let maturity = Math.floor(Math.random() * (36 - 12) / 12) * 12 + 12; // Random from 12, 24, 36
    let amount = Math.floor(Math.random() * (400000 - 100000) / 25000) * 25000 + 100000; // Random from 100000, 125000, ..., 400000
    performGetRequest(`/kredi/tasit-kredisi/sorgulama?amount=${amount}&maturity=${maturity}&CarStatus=2&VehicleExist=0`, "VehicleLoan List");
}

export function vehicleLoanDetail() {
    let maturity = Math.floor(Math.random() * (36 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (400000 - 100000) / 25000) * 25000 + 100000;
    performGetRequest(`/kredi/tasit-kredisi/garanti-bankasi/tasit-kredisi?amount=${amount}&maturity=${maturity}`, "VehicleLoan Detail");
}

export function vehicleLoanRecourseForward() {
    let maturity = Math.floor(Math.random() * (36 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (400000 - 100000) / 25000) * 25000 + 100000;
    performGetRequest(`/kredi/tasit-kredisi/turkiye-is-bankasi/basvuru/yonlendirme?id=98&ct=List&amount=${amount}&maturity=${maturity}`, "VehicleLoan Forward");
}

export function vehicleLoanRecourseForm() {
    let maturity = Math.floor(Math.random() * (36 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (400000 - 100000) / 25000) * 25000 + 100000;
    performGetRequest(`/kredi/tasit-kredisi/yapi-kredi/basvuru/form?id=89&ct=List&activityStatus=All&amount=${amount}&maturity=${maturity}`, "VehicleLoan Form");
}

export function vehicleLoanBankList() {
    let maturity = Math.floor(Math.random() * (36 - 12) / 12) * 12 + 12;
    let amount = Math.floor(Math.random() * (400000 - 100000) / 25000) * 25000 + 100000;
    performGetRequest(`/kredi/tasit-kredisi/turkiye-is-bankasi?amount=${amount}&maturity=${maturity}`, "VehicleLoan Bank List");
}
