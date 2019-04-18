const io = require('socket.io-client');
const HttpsProxyAgent = require('https-proxy-agent');

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
    socket.emit('counter', 'TESTE ZE CARLOS' + counter);
}, 1000)


