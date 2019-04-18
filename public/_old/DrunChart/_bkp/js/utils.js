function request(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        var DONE = 4;
        var OK = 200;
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                callback(null, xhr.responseText);
            } else {
                callback(new Error("Erro na requisição"));
            }
        }
    }
    xhr.send(null);
}

function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

function errorCheck(err) {
    if (err) {
        console.error(err);
        return true;
    }
    return false;
}

function sumTimes(times) {
    let ms = 0;
    for (let i = 0; i < times.length; i++) {
        ms += (times[i].split(':')[0] * 3600000)
        ms += (times[i].split(':')[1] * 60000)
        ms += (times[i].split(':')[2] * 1000)
    }
    return msToTime(ms);
}

function timeToMs(time) {
    let ms = 0;
    ms += (time.split(':')[0] * 3600000)
    ms += (time.split(':')[1] * 60000)
    return ms += (time.split(':')[2] * 1000)
}

var msToTime = function (duration) {
    var milliseconds = parseInt((duration % 1000) / 100);
    var seconds = parseInt((duration / 1000) % 60);
    var minutes = parseInt((duration / (1000 * 60)) % 60);
    var hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function getYesterday(d) {
    d.setDate(d.getDate() - 1); 
    return d;                 
};