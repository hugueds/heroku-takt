var api2 = 'http://10.8.66.4/LTSApi/api/interferences?days=';
var api = 'http://10.8.66.4/LTSApi/api/interferences?startDate={startDate}&endDate={endDate}';

var filteredData = null;
var line = null;
var rawData = null;
var groupedByFunction = null;
var responsibles = null;
var dataSeries = null;
var dataReceived = false;

var pages = 0;
var currentPage = 1;
var itensPerPage = 10;
var offset = 0;

var inputs = document.getElementsByTagName('input');
var groups = document.getElementById('select-group');
var line = document.getElementById('select-line');
var day = document.getElementById('select-day');
var startDate = $("#start-date");
var endDate = $("#end-date");

var oce = 0;
var calcOce = 0;

var interferenceGroups = {
    "Todos": [],
    "Qualidade": ["QUAL", "LTS", "QG FA5"],
    "Produção": ["PROD GG", "PROD DV", "PROD TR", "FA0", "FA1.1", "FA1.2", "FA2", "FA3.1", "FA3.2", "FA4", "FA5"],
    "Logística": ["LOG MP", "LOG MH"],
    "Manutenção": ["MAN ROF", "MAN EQ"],
    "Fabricas": ["MOT", "CAB", "TRANSM"],
    "Outros": ["IT SLA", "ENG PR", "ENG PP"]
};


window.onload = function () {
    loadChart();
    generateOptions();
}

function loadChart() {
    getServerData(function (err, data) {
        if (err) return console.error(err);
        rawData = JSON.parse(data);
        dataReceived = rawData.length ? true : false;
        if (!dataReceived) {
            yesterday = getYesterday(yesterday);
            $("[id$=date]").datepicker("setDate", yesterday);
            loadChart();
        }
        rawData = generateFunction(rawData);
        rawData = generateDateTime(rawData);
        rawData = orderByFunction(rawData);
        filteredData = filterData(rawData);
        groupedByFunction = groupByFunction(filteredData);        
        generateTable(filteredData);
        generateStopTimeChart(new BarDataSerie(groupedByFunction));
        generateDataSeries(filteredData, line.value, generateChart);
    });
}

function DataSerie(dataSerie) {
    if (!dataSerie.length) {
        return;
    }
    this.name = dataSerie[0][0].Responsible;
    this.type = "line";
    this.visible = true;
    this.showInLegend = true;
    this.dataPoints = dataSerie.map(generateDataPoints).sort(function (a, b) { return (a.x - b.x) });
}

function generateDataPoints(data) {
    var times = data.map(function (a) { return a.TimeAmountMS }).reduce(function (a, b) { return (a + b) });
    return {
        x: new Date(data[0].TimeStamp),
        y: times
    }
}

function generateDataSeries(data, line, callback) {
    groups.value = "Todos";
    data = filterLine(data, line);
    responsibles = groupByResponsible(data).map(groupByDate);
    dataSeries = responsibles.map(function (resp) { return new DataSerie(resp) });
    callback(dataSeries);
}

function selectGroup() {
    if (groups.value == "Todos") {
        return loadChart();
    }
    var selected = interferenceGroups[groups.value];
    dataSeries.forEach(function (element) {
        for (var i = 0; i < selected.length; i++) {
            if (element.name == selected[i]) {
                element.visible = true;
                break;
            }
            element.visible = false;
        }
    });
    chart.render();
}

function generateDateTime(data) {
    data.map(function (d) {
        d["Date"] = d.TimeStamp.slice(0, 10);
        d["TimeAmountMS"] = timeToMs(d.TimeAmount);
    });
    return data;
}

function updateObjective() {
    var min = parseInt(document.getElementById('target-minute').value) * 60 * 1000 || 0;
    var sec = parseInt(document.getElementById('target-second').value) * 1000 || 0;
    var ms = min + sec;
    chart.axisY[0].stripLines[0].set('value', ms);
}

function toggleSelection() {
    dataSeries.forEach(function (element) { element.visible = !element.visible; });
    chart.render();
}

function downloadChart() {
    var fileName = new Date().toISOString().slice(0, 10);
    chart.exportChart({ format: String("jpg"), fileName: fileName })
}

function sprint() {
    var display = document.getElementById('deviation-container').style.display;
    document.getElementById('deviation-container').style.display = 'block';
    window.print();
    document.getElementById('deviation-container').style.display = display;
}

function generateOptions() {
    for (var key in interferenceGroups) {
        var option = document.createElement("OPTION");
        option.value = key;
        option.textContent = key;
        groups.appendChild(option);
    }
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', function (e) {
            var target = e.target.value
            if (target > 59) {
                e.target.value = 59;
            }
        });
    }
}

function getServerData(callback) {
    var url = api.replace('{startDate}', startDate.val()).replace('{endDate}', endDate.val());
    request(url, function (err, response) {
        if (err)
            return callback(err);
        return callback(null, response);
    });
}

function getServerDataByDays(days, callback) {
    request(api + days, function (err, response) {
        if (err)
            return callback(err);
        return callback(null, response);
    });
}

/* GRAFICO POR FUNÇÃO */

function BarDataSerie(data) {
    this.name = "Tempo";
    this.type = "column";
    this.dataPoints = generateBarDataSeries(data);
}

function generateBarDataSeries(data) {
    return data.map(function (f) {
        return {
            label: f[0].Function,
            y: f.map(function (g) { return g.TimeAmountMS }).reduce(function (a, b) { return a + b })
        }
    });
}

function generateFunction(data) {
    var pattern = /(FA\d[\s\.]\d?)\s?P\d/;
    data.map(function (d) {
        if (d.CellDescription == "FA0")
            d.Function = "FA0";
        else if (pattern.test(d.StationDescription))
            d.Function = d.StationDescription.match(pattern)[1].replace(" ", "");
        else
            d.Function = "ROFA E OUTROS";
    });
    return data;
}

function generatePages(data, callback) {
    var deviations = data.map(function (d) { return new Deviation(d) });
    pages = Math.ceil(deviations.length / itensPerPage);
    for (var i=0; i < pages; i++) {
        $('.pages-container').append('<a>'+ (i+1) +'</a>').on('click', function(e) { console.log(e)})
    }
    callback(deviations);
}

function generateTable(data) {
    var deviationContainer = $('.deviation-container');
    deviationContainer.empty();
    var deviations = data.map(function (d) { return new Deviation(d) });
    var table = $('<table></table>');   
    var tHeader = $('<thead></thead>');
    tHeader.append('' +
        '<th> DATA / HORA </th>' +
        '<th> DURAÇÃO </th>' +
        '<th> FUNÇÃO </th>' +
        '<th> POSTO </th>' +
        '<th> DESCRIÇÃO </th>' +
        '<th> RESPONSÁVEL </th>' +
        // '<th> MENSAGEM </th>' +
        '<th>POPID</th>'
    );
    var tBody = $('<tbody></tbody>');
    var rows = deviations.map(function (d) {
        var row = $('<tr class="table-row"></tr>');
        row.append('' +
            '<td>' + d.TimeStamp.replace('T', "<br>") + '</td>' +
            '<td>' + d.TimeAmount + '</td>' +
            '<td>' + d.Function + '</td>' +
            '<td>' + d.StationDescription + '</td>' +
            '<td class="col-description">' + d.Description + '</td>' +
            '<td>' + d.Responsible + '</td>' +
            // '<td>' + d.AndonMessage + '</td>' +
            '<td> <a target="_blank" href="http://10.8.66.4/TorqueData/TighteningResults?popIdFilter=' + d.Popid + '&tighteningFilter=All">' + d.Popid + '</a> </td>'
        );
        return row;
    });
    table.append(tHeader);
    pages = Math.ceil(deviations.length / itensPerPage);    
    deviationContainer.append(table);
    table.append(rows);
}
