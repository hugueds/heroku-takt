const io = require('socket.io-client');
var https = require('https');
// var querystring = require('querystring');
 
// // form data
// var postData = querystring.stringify({
//     ctl00$cphBody$txtUserName: 'ssbhpe',
//     __VIEWSTATEGENERATOR: "4D84E9BB",
//     __EVENTVALIDATION: "/wEdABg+r2oL+RJDeHv0nMoABdVe/4Uhh4g94O10S6IM6FcunGHKOUF3ltkpZEYxteaTqpWBaUp56wxHamBZS3tq0htFB6XlVt29DI1vApAQh5c8fahS/Hq/6mxMl4m/SOdQipeYJelvi4XGPNA0JIMwjXAYjdiBw6wIK3bTfRo0dAhl1s6CcYkWhszrt43vurMF9WpUaRvDNssWy6d2NmNZD2k8sOakifc4GZb8ClrLi887+lsGOEiykm64gkJ8v5jWib9A4cfg2GTdKcfzmBwlyLOsgRnB/lHsvLikEXKMEfAqTyfseKYyTesydJwHJLixUJ1WLo0bCfH7Bi2llUuKfK25i/On1J7o9rUiVHvmfVsCf0khGVHaCyVsAhEKMolmH26nDlYelSUNoMG004w5p1pzNHc90HKbOIm0r7rEBSv/jw5NVe7stnFoCnNK8gEr4Eb1YlCmndgI9S6O/6qexozAmK++ylr4W4wjqpGcOnaIkPy75ukXkqrvhNoIbKdgcWPV4jrtcD/R6C97IissdZ+Dp2Q7T58/WGd+YlyRFPBdYg==",
//     __VIEWSTATE: "/wEPDwUJNDAwNzYwNDE4D2QWAmYPZBYCAgMPZBYCAgEPZBYCAhEPZBYCAgMPEA8WBh4ORGF0YVZhbHVlRmllbGQFBGNvZGUeDURhdGFUZXh0RmllbGQFC2Rlc2NyaXB0aW9uHgtfIURhdGFCb3VuZGdkEBUJBkJyYXNpbBZBcmdlbnRpbmEgQnVlbm9zIEFpcmVzEUFyZ2VudGluYSBUdWN1bWFuBUNoaWxlBk1leGljbxZNZXhpY28gU2FuIEx1aXMgUG90b3NpBFBlcnUJVmVuZXp1ZWxhCENvbG9tYmlhFQkCMDECMTACMTECMTICMTMCMTQCMTUCMTcCMjMUKwMJZ2dnZ2dnZ2dnZGQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgIFFmN0bDAwJGNwaEJvZHkkYnRuSW1nRW4FF2N0bDAwJGNwaEJvZHkkYnRuSW1nRXNwuOx7qFvkK+RBjPsWudt3sMsuS49A0wl/8d/sVR29LnY="
// });

// //var postData = `__LASTFOCUS=&__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwUJNDAwNzYwNDE4D2QWAmYPZBYCAgMPZBYCAgEPZBYCAhEPZBYCAgMPEA8WBh4ORGF0YVZhbHVlRmllbGQFBGNvZGUeDURhdGFUZXh0RmllbGQFC2Rlc2NyaXB0aW9uHgtfIURhdGFCb3VuZGdkEBUJBkJyYXNpbBZBcmdlbnRpbmEgQnVlbm9zIEFpcmVzEUFyZ2VudGluYSBUdWN1bWFuBUNoaWxlBk1leGljbxZNZXhpY28gU2FuIEx1aXMgUG90b3NpBFBlcnUJVmVuZXp1ZWxhCENvbG9tYmlhFQkCMDECMTACMTECMTICMTMCMTQCMTUCMTcCMjMUKwMJZ2dnZ2dnZ2dnZGQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgIFFmN0bDAwJGNwaEJvZHkkYnRuSW1nRW4FF2N0bDAwJGNwaEJvZHkkYnRuSW1nRXNwuOx7qFvkK%2BRBjPsWudt3sMsuS49A0wl%2F8d%2FsVR29LnY%3D&__VIEWSTATEGENERATOR=4D84E9BB&__EVENTVALIDATION=%2FwEdABg%2Br2oL%2BRJDeHv0nMoABdVe%2F4Uhh4g94O10S6IM6FcunGHKOUF3ltkpZEYxteaTqpWBaUp56wxHamBZS3tq0htFB6XlVt29DI1vApAQh5c8fahS%2FHq%2F6mxMl4m%2FSOdQipeYJelvi4XGPNA0JIMwjXAYjdiBw6wIK3bTfRo0dAhl1s6CcYkWhszrt43vurMF9WpUaRvDNssWy6d2NmNZD2k8sOakifc4GZb8ClrLi887%2BlsGOEiykm64gkJ8v5jWib9A4cfg2GTdKcfzmBwlyLOsgRnB%2FlHsvLikEXKMEfAqTyfseKYyTesydJwHJLixUJ1WLo0bCfH7Bi2llUuKfK25i%2FOn1J7o9rUiVHvmfVsCf0khGVHaCyVsAhEKMolmH26nDlYelSUNoMG004w5p1pzNHc90HKbOIm0r7rEBSv%2Fjw5NVe7stnFoCnNK8gEr4Eb1YlCmndgI9S6O%2F6qexozAmK%2B%2Bylr4W4wjqpGcOnaIkPy75ukXkqrvhNoIbKdgcWPV4jrtcD%2FR6C97IissdZ%2BDp2Q7T58%2FWGd%2BYlyRFPBdYg%3D%3D&ctl00%24cphBody%24ddlpais=01&ctl00%24cphBody%24txtCcusto=&ctl00%24cphBody%24txtCodend=&ctl00%24cphBody%24txtDepto=&ctl00%24cphBody%24txtNome=hugo&ctl00%24cphBody%24txtRamal=&ctl00%24cphBody%24txtUserName=&ctl00%24cphBody%24txtCxPostal=&ctl00%24cphBody%24btnconsulta=Consultar`
// //var postData = `y%24ddlpais=01&ctl00%24cphBody%24txtCcusto=&ctl00%24cphBody%24txtCodend=&ctl00%24cphBody%24txtDepto=&ctl00%24cphBody%24txtNome=hugo&ctl00%24cphBody%24txtRamal=&ctl00%24cphBody%24txtUserName=&ctl00%24cphBody%24txtCxPostal=&ctl00%24cphBody%24btnconsulta=Consultar`

 
// // request option
// var options = {
//   host: 'listatelefonica.br.scania.com',
//   port: 443,
//   method: 'POST',
//   path: '/site/',
//   headers: {
//     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Content-Length': postData.length
//   }
// };
 
// // request object
// var req = https.request(options, function (res) {
//   var result = '';
//   res.on('data', function (chunk) {
//     result += chunk;
//   });
//   res.on('end', function () {
//     console.log(result);
//   });
//   res.on('error', function (err) {
//     console.log(err);
//   })
// });
 
// // req error
// req.on('error', function (err) {
//   console.log(err);
// });
 
// //send request witht the postData form
// req.write(postData);
// req.end();



const HttpsProxyAgent = require('https-proxy-agent');

var a = [{"ready":false,"andon":false,"popid":"547042","traction":"6X4"},{"ready":false,"andon":false,"popid":"549478","traction":"6X2"},{"ready":false,"andon":false,"popid":"547041","traction":"6X4"},{"ready":false,"andon":false,"popid":"547040","traction":"6X4"},{"ready":true,"andon":false,"popid":"549393","traction":"4X2"},{"ready":true,"andon":false,"popid":"546521","traction":"6X2"},{"ready":false,"andon":false,"popid":"547032","traction":"6X4"},{"ready":false,"andon":false,"popid":"546977","traction":"6X2"},{"ready":false,"andon":false,"popid":"547039","traction":"6X4"},{"ready":true,"andon":false,"popid":"549949","traction":"4X2"},{"ready":false,"andon":false,"popid":"547037","traction":"6X4"},{"ready":true,"andon":false,"popid":"547038","traction":"6X4"},{"ready":false,"andon":false,"popid":"546881","traction":"6X2"},{"ready":false,"andon":false,"popid":"547054","traction":"6X4"},{"ready":false,"andon":false,"popid":"548879","traction":"6X4"},{"ready":true,"andon":false,"popid":"546978","traction":"6X2"},{"ready":false,"andon":false,"popid":"548016","traction":"6X4"},{"ready":false,"andon":false,"popid":"549055","traction":"6X4"},{"ready":true,"andon":false,"popid":"549136","traction":"4X2"},{"ready":true,"andon":false,"popid":"546550","traction":"6X4"},{"ready":true,"andon":false,"popid":"000000","traction":"____"},{"ready":false,"andon":false,"popid":"546548","traction":"6X4"},{"ready":false,"andon":false,"popid":"550216","traction":"6X4"},{"ready":false,"andon":false,"popid":"549870","traction":"4X2"},{"ready":false,"andon":false,"popid":"546989","traction":"6X4"},{"ready":true,"andon":false,"popid":"000000","traction":"____"},{"ready":false,"andon":false,"popid":"546979","traction":"6X2"},{"ready":false,"andon":false,"popid":"546549","traction":"6X4"},{"ready":false,"andon":false,"popid":"550292","traction":"8X2"},{"ready":false,"andon":false,"popid":"549898","traction":"4X2"},{"ready":false,"andon":false,"popid":"550136","traction":"6X4"},{"ready":false,"andon":false,"popid":"549417","traction":"6X2"},{"ready":false,"andon":false,"popid":"549477","traction":"6X4"}];


let proxy = 'http://148.148.192.2:8080';

const socket = io.connect('https://webpopids.herokuapp.com', {
    agent: new HttpsProxyAgent(proxy)
});


let counter = 0;
socket.on('connect', () => {
    console.log('ok')
})

setInterval(() => {
    counter++;
    socket.emit('server popids', a);
}, 2000)

