import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 2,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(95)<500"],
    errors: ["rate<0.1"],
  },
};

export default function () {
  let res = http.get("https://www.enuygun.com/ucak-bileti/");

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  let doc = res.html();

  let imgSrcs = doc.find("img").toArray().map((img) => img.attr("src"));

  imgSrcs.forEach((src) => {
    let imgRes = http.get(src);

    check(imgRes, {
      "status is 200": (r) => r.status === 200,
    });
  });

  let links = doc.find("a").toArray().map((a) => a.attr("href"));

  links.forEach((link) => {
    let linkRes = http.get(link);

    check(linkRes, {
      "status is 200": (r) => r.status === 200,
    });
  });

  let formRes = http.post("https://www.enuygun.com/uyelik/kurumsal/kayit/", {
    name: "John Doe",
    email: "johndoe@example.com",
    message: "Hello, world!",
  });

  check(formRes, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
