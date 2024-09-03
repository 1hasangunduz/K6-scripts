import http from 'k6/http';
import {sleep} from 'k6';//bu her bir isteğin başarılı olup olmadığı kontrol etmek içindir.

export const options={
    vus: 5, //10 sanal kullanıcı
    duration: '1000',
}
export default function(){
    http.get('https://test.k6.io');
    sleep(1);
    
}
