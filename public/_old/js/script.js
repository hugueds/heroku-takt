var socket = io('http://10.33.22.184:8083');

// DEBUG 
// var socket = io('http://localhost:8083');


var MAX_STATIONS = 32;

socket.on('connect', function () {
    console.log(`%c Web Socket Connected`, 'color: cyan;');
    socket.emit('process');
    $("#error-box").hide();
});

socket.on('disconnect', function() {
    console.error('Perda de conexão com o servidor');
    var error = { status: -1, message: 'Failed to connect to WebSocket Server' };
    $("#error-box").show();
    $("#error-box").text(error.message);
});

socket.on('reload-screen', function() {
    console.log('Reloading Screens');
    location.reload();
});

socket.on('server process', function(data) {
    $("#produced").text(data.produced);
    $("#objective").text(data.objective);
    $("#stop-time").text(convertMsToTime(data.stopTime));
});

socket.on('server popids', function(data) {
    if (!data) {
        return;
    }
    for (var i = 0; i <= MAX_STATIONS; i++) {
        if (data[i].popid === '') {
            $('#station-' + i).text('-----------');
        } else {
            $('#station-' + i).text(data[i].popid);
            $('#traction-station-' + i).text(data[i].traction);
        }
        if (data[i].ready) {
            $('#station-' + i).parent('.popid').parent('.station').addClass('station-ready');
            $('#station-' + i).removeClass('station-stopped');
        } else {            
            $('#station-' + i).parent('.popid').parent('.station').removeClass('station-ready');
        }
    }
});

socket.on('server takt', function(data)  {

    if (!data) return;

    var instances = ["FA0", "ML0", "ML1", "ML2"];

    instances.map(updateTaktTime);

    function updateTaktTime(i) {
        var tag = data['time_' + i];
        var id = '#takt-' + i.toLowerCase();
        $(id).text(convertMsToTime(tag));
        if (tag < 0) {
            $(id).parent('.takt').addClass('takt-negative');
        } else {
            $(id).parent('.takt').removeClass('takt-negative');
        }
    }

    $('#andon-message').html(data.andonMessage.replace(/\\n/, ' '));

});

socket.on('plc-status', function(status) {
    if (!status) {
        console.error('Falha na conexão com o PLC');
        $("#restart-button").show();
	return;
    }
    $("#restart-button").hide();
});

$("#restart-button").on('click', function() {
    $.get('/plc/restart', function(data){
        console.log(data);
    })    
});

$("#reload-button").on('click', function() {
    console.log('recarregando')
    socket.emit('server-reload-screen', '');
});

setInterval(function () {
    socket.emit('popids');
}, 2000);

setInterval(function () {
    socket.emit('takt');
}, 1000);

setInterval(function () {
    socket.emit('process');
}, 5000);

setInterval(function() {        
    socket.emit('get-plc-status');
}, 2000);

function convertMsToTime(ms) {
    var negative = false;
    var takt;
    if (ms < 0) {
        negative = true;
        ms = ms * -1;
    }
    var hr = 0;
    var min = (ms / 1000 / 60) << 0;
    var sec = (ms / 1000) % 60;

    if (sec < 10)
        takt = min + ":0" + sec;
    else
        takt = min + ":" + sec;

    if (negative)
        takt = "-" + takt;

    return takt;
}




