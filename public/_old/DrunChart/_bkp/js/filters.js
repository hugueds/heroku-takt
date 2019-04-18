function filterData(data) {
    var filteredData = data;
    filteredData = filterStopTime(filteredData);
    filteredData = filterResponsible(filteredData, "IND");
    return filteredData;
}

function filterStopTime(data) {
    return data.filter(function (f) { return f.isProcessStopTime });
}

function filterProcessAndStopTime(data) {
    return data.filter(function (f) { return f.isProcessStopTime || f.isStopTime });
}

function filterLine(data, line) {
    if (parseInt(line)) {
        return data.filter(function (f) { return f.ProcessId == line });
    }
    return data;
}

function filterResponsible(data, responsible) {
    return data.filter(function (f) { return f.Responsible != responsible });
}

function filterStation(data) {
    return;
}

function filterGeneric(data, filter, value) {
    return data.filter(function(f) { return f[filter] == value })
}

function groupByResponsible(data) {
    return Object.values(groupBy(data, 'Responsible'))
}

function groupByDate(data) {
    return Object.values(groupBy(data, 'Date'))
}

function groupByFunction(data) {
    return Object.values(groupBy(data, "Function"));
}

function orderByFunction(data) {
    return data.sort(dynamicSort("Function"));
}