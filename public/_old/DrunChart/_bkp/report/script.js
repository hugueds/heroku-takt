var api = 'http://10.8.66.4/LTSApi/api/interferences?startDate={startDate}&endDate={endDate}';
var api2 = 'http://10.8.66.4/LTSApi/api/interferences?days=';
var startDay = null;
var endDay = null;
var days = 1;
var rawData = null;
var filteredData = null;
var startDate = $("#start-date");
var endDate = $("#end-date");

window.onload = loadChart

function loadChart() {
    getServerData(function (err, data) {
        if (err) return console.error(err);
        rawData = JSON.parse(data);
        rawData = generateDateTime(rawData);
        rawData = generateFunction(rawData);
        rawData = orderByFunction(rawData);
        filteredData = filterData(rawData);
        generateTable(filteredData);
        filteredData = groupByFunction(filteredData);
        generateStopTimeChart(new BarDataSerie(filteredData));
    });
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

function BarDataSerie(data) {
    this.type = "column";
    this.dataPoints = generateBarDataSeries(data);
}

function getServerData(callback) {    
    var url = api.replace('{startDate}', startDate.val()).replace('{endDate}', endDate.val());
    request(url, function (err, response) {
        if (err)
            return callback(err);
        return callback(null, response);
    });
}

function generateDateTime(data) {
    data.map(function (d) {
        d["Date"] = d.TimeStamp.slice(0, 10);
        d["TimeAmountMS"] = timeToMs(d.TimeAmount);
    });
    return data;
}



function generateTable(data) {
    $('.deviation-container').empty();
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
            '<td> <a href="http://10.8.66.4/TorqueData/TighteningResults?popIdFilter=506177&tighteningFilter=All">' + d.Popid + '</a> </td>'
        );
        return row;
    });
    table.append(tHeader);
    $(".deviation-container").append(table);
    table.append(rows);
}

