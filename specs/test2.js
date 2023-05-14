import http from "k6/http";
import {sleep, check} from 'k6'; //check :bu her bir isteğin başarılı olup olmadığı kontrol etmek içindir.

/*export let options = {
  vus: 5,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(95)<500"], //tüm isteklerin uçtan uca süresi (yani toplam gecikme süresi)
  },
};*/

export default function () {
    var domain = 'https://test.k6.io'

    let res = http.get(domain,{tags: {name: '01_Home'}});
    check(res, {
    "is status 200": (r) => r.status === 200,
    'text verification': (r)=> r.body.includes("Collection of simple web-pages suitable for load testing")
  });
  sleep(1);

  res = http.get(domain + '/flip_coin.php',{
    tags: {name: '02_VisitFlipCoin'}});
    check(res, {
    "is status 200": (r) => r.status === 200,
    'text verification': (r)=> r.body.includes("Your Bet")
  });
  //http.get(domain + 'flip_coin.php',)


  };
 //console.log(`Response time for https://k6.io/: ${res.timings.duration} ms`);
//http_req_failed, başarısız isteklerin toplam sayısı
//iterations, the total number of iterations
//https://github.com/grafana/k6-learn/blob/main/Modules/II-k6-Foundations/06-k6-Load-Test-Options.md