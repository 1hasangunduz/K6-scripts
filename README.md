# K6-scripts

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
