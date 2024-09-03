import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// Options for the test
export let options = {
    stages: [
        { duration: '1m', target: 100 }, // Ramp-up to 100 users over 1 minute
        { duration: '5m', target: 100 }, // Stay at 100 users for 5 minutes
        { duration: '1m', target: 0 },   // Ramp-down to 0 users over 1 minute
    ],
};

// Base URL for all requests
const BASE_URL = 'https://www.example.com';  // Replace with your actual base URL

// Main function to be executed by each virtual user (VU)
export default function () {
    // Call each function based on their weight
    homepage();
    creditHomepage();
    consumerLoanSearch();
    consumerLoanDetail();
    housingLoanSearch();
    housingLoanDetail();
    mortgageLoanSearch();
    mortgageLoanDetail();
    smeLoanSearch();
    smeLoanDetail();
    carLoanSearch();
    carLoanDetail();
    creditCardHomepage();
    creditCardDetail();

    // Sleep for 1 second between each iteration to mimic real user behavior
    sleep(1);
}

// Function for the homepage
function homepage() {
    let res = http.get(`${BASE_URL}/`, { tags: { name: 'Homepage' } });
    check(res, { 'Homepage status is 200': (r) => r.status === 200 });
}

// Function for the credit homepage
function creditHomepage() {
    let res = http.get(`${BASE_URL}/kredi`, { tags: { name: 'Credit Homepage' } });
    check(res, { 'Credit Homepage status is 200': (r) => r.status === 200 });
}

// Function for the consumer loan search
function consumerLoanSearch() {
    let amount = randomIntBetween(10000, 50000);
    let maturity = randomIntBetween(3, 36);
    let res = http.get(`${BASE_URL}/kredi/ihtiyac-kredisi/sorgulama?amount=${amount}&maturity=${maturity}`, { tags: { name: 'Consumer Loan Search' } });
    check(res, { 'Consumer Loan Search status is 200': (r) => r.status === 200 });
}

// Function for the consumer loan detail
function consumerLoanDetail() {
    let res = http.get(`${BASE_URL}/kredi/ihtiyac-kredisi`, { tags: { name: 'Consumer Loan Detail' } });
    check(res, { 'Consumer Loan Detail status is 200': (r) => r.status === 200 });
}

// Function for the housing loan search
function housingLoanSearch() {
    let amount = randomIntBetween(50000, 500000);
    let maturity = randomIntBetween(12, 240);
    let res = http.get(`${BASE_URL}/kredi/konut-kredisi/sorgulama?amount=${amount}&maturity=${maturity}`, { tags: { name: 'Housing Loan Search' } });
    check(res, { 'Housing Loan Search status is 200': (r) => r.status === 200 });
}

// Function for the housing loan detail
function housingLoanDetail() {
    let res = http.get(`${BASE_URL}/kredi/konut-kredisi`, { tags: { name: 'Housing Loan Detail' } });
    check(res, { 'Housing Loan Detail status is 200': (r) => r.status === 200 });
}

// Function for the mortgage loan search
function mortgageLoanSearch() {
    let amount = randomIntBetween(50000, 1000000);
    let maturity = randomIntBetween(12, 300);
    let res = http.get(`${BASE_URL}/kredi/tasit-kredisi/sorgulama?amount=${amount}&maturity=${maturity}`, { tags: { name: 'Mortgage Loan Search' } });
    check(res, { 'Mortgage Loan Search status is 200': (r) => r.status === 200 });
}

// Function for the mortgage loan detail
function mortgageLoanDetail() {
    let res = http.get(`${BASE_URL}/kredi/tasit-kredisi`, { tags: { name: 'Mortgage Loan Detail' } });
    check(res, { 'Mortgage Loan Detail status is 200': (r) => r.status === 200 });
}

// Function for the SME loan search
function smeLoanSearch() {
    let amount = randomIntBetween(10000, 200000);
    let maturity = randomIntBetween(12, 60);
    let res = http.get(`${BASE_URL}/kredi/kobi-kredisi/sorgulama?amount=${amount}&maturity=${maturity}`, { tags: { name: 'SME Loan Search' } });
    check(res, { 'SME Loan Search status is 200': (r) => r.status === 200 });
}

// Function for the SME loan detail
function smeLoanDetail() {
    let res = http.get(`${BASE_URL}/kredi/kobi-kredisi`, { tags: { name: 'SME Loan Detail' } });
    check(res, { 'SME Loan Detail status is 200': (r) => r.status === 200 });
}

// Function for the car loan search
function carLoanSearch() {
    let amount = randomIntBetween(10000, 300000);
    let maturity = randomIntBetween(12, 60);
    let res = http.get(`${BASE_URL}/kredi/tasit-kredisi/sorgulama?amount=${amount}&maturity=${maturity}`, { tags: { name: 'Car Loan Search' } });
    check(res, { 'Car Loan Search status is 200': (r) => r.status === 200 });
}

// Function for the car loan detail
function carLoanDetail() {
    let res = http.get(`${BASE_URL}/kredi/tasit-kredisi`, { tags: { name: 'Car Loan Detail' } });
    check(res, { 'Car Loan Detail status is 200': (r) => r.status === 200 });
}

// Function for the credit card homepage
function creditCardHomepage() {
    let res = http.get(`${BASE_URL}/kredi-karti`, { tags: { name: 'Credit Card Homepage' } });
    check(res, { 'Credit Card Homepage status is 200': (r) => r.status === 200 });
}

// Function for the credit card detail
function creditCardDetail() {
    let res = http.get(`${BASE_URL}/kredi-karti`, { tags: { name: 'Credit Card Detail' } });
    check(res, { 'Credit Card Detail status is 200': (r) => r.status === 200 });
}
