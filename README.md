_# K6-scripts

```javascript
"https://grafana.com/docs/k6/latest/set-up/install-k6/"
```

```javascript
"go to the directory where the script is located and run the following command:"
"$ k6 run HKPerformance.js"
```

```javascript

"K6 is a modern load testing tool, building on Load Impact's years of experience in the load and performance testing industry. It provides a clean, approachable scripting API, local and cloud execution, and flexible configuration."

```


```javascript
"export K6_CLOUD_TOKEN=<your_api_token>"
"echo $K6_CLOUD_TOKEN"
"k6 run -o cloud RandomRequestForPages.js" 
```

```javascript

"k6 run --vus 10 --iterations 40 script.js"
* "--vus 10: 'VUS' (Virtual Users), sanal kullanıcı sayısını belirtir. Bu durumda, 10 sanal kullanıcı testi aynı anda gerçekleştirir."
* "--iterations 40: Her bir sanal kullanıcının yapacağı toplam işlem sayısını belirtir. Burada, her sanal kullanıcı 40 kez işlem yapacak şekilde test edilecektir."
"k6 run --vus 10 --duration 30s script.js"
"k6 run --vus 10 --duration 30s --out influxdb=http://localhost:8086/myk6db script.js"

```

```javascript
"1. constant-vus"
"Açıklama: Belirli bir süre boyunca sabit sayıda sanal kullanıcı çalıştırır."
   " Kullanım: Performans testi için belirli bir yükü simüle etmek istiyorsanız."

export const options = {
    scenarios: {
        example: {
            executor: 'constant-vus',
            vus: 10, // Sabit sanal kullanıcı sayısı
            duration: '30s', // Süre
        },
    },
};
"2. per-vu-iterations"
"Açıklama: Her sanal kullanıcının belirli bir sayıda iterasyon gerçekleştirmesini sağlar."
   " Kullanım: Sanal kullanıcıların belirli bir sayıda işlem yapmasını simüle etmek istiyorsanız."
  
export const options = {
    scenarios: {
        example: {
            executor: 'per-vu-iterations',
            vus: 10, // Sanal kullanıcı sayısı
            iterations: 10, // Her kullanıcı için iterasyon sayısı
        },
    },
};
"3. constant-arrival-rate"
"Açıklama: Belirli bir süre boyunca belirli bir istek hızını korur."
"    Kullanım: Belirli bir istek sıklığı (örneğin, saniyede 50 istek) simüle etmek istiyorsanız."
    
export const options = {
    scenarios: {
        example: {
            executor: 'constant-arrival-rate',
            rate: 5, // Saniyede 5 istek
            timeUnit: '1s', // Zaman birimi
            duration: '1m', // Süre
            preAllocatedVUs: 10, // Başlangıçta tahsis edilen VU sayısı
            maxVUs: 20, // Maksimum VU sayısı
        },
    },
};
"4. ramping-arrival-rate"
"Açıklama: İstek oranını kademeli olarak artırır."
   "Kullanım: Yükü kademeli olarak artırmak ve test etmek istiyorsanız."
   
export const options = {
    scenarios: {
        example: {
            executor: 'ramping-arrival-rate',
            startRate: 1, // Başlangıç oranı
            timeUnit: '1m', // Zaman birimi
            preAllocatedVUs: 10, // Başlangıçta tahsis edilen VU sayısı
            maxVUs: 50, // Maksimum VU sayısı
            stages: [
                { duration: '2m', target: 10 }, // 2 dakika boyunca 10 istek/saniye
                { duration: '3m', target: 20 }, // 3 dakika boyunca 20 istek/saniye
                { duration: '2m', target: 0 }, // 2 dakika boyunca istek sayısını 0'a düşür
            ],
        },
    },
};
"5. shared-iterations"
"Açıklama: Her sanal kullanıcı belirli bir sayıda iterasyon gerçekleştirir."
"   Kullanım: Sanal kullanıcıların belirli bir toplam iterasyon sayısına ulaşmasını istiyorsanız."
export const options = {
    scenarios: {
        example: {
            executor: 'shared-iterations',
            vus: 10, // Sanal kullanıcı sayısı
            iterations: 50, // Toplam iterasyon sayısı
            maxDuration: '5m', // Maksimum süre
        },
    },
};
"6. distribute-arrival-rate"
"Açıklama: İstekleri belirli bir dağıtım modeline göre simüle eder."
 "   Kullanım: Trafiği belirli bir dağıtım modeline göre simüle etmek istiyorsanız."
   
export const options = {
    scenarios: {
        example: {
            executor: 'distribute-arrival-rate',
            rate: 10, // İstek oranı
            timeUnit: '1s', // Zaman birimi
            duration: '1m', // Süre
            distribution: {
                '0s': 0.5, // İlk 0 saniye
                '30s': 1,   // 30 saniye sonra
            },
        },
    },
};
```

```javascript_
