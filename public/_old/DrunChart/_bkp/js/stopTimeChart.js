var stopTimeChart;

function generateStopTimeChart(series) {
    stopTimeChart = new CanvasJS.Chart("stopTimeChart", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "STOP TIME POR FUNÇÃO",
            fontSize : 22,
            margin : 15,
        },
        axisY: {
            title: "TEMPO DE PARADA",
            labelFormatter: function(e) {
                return msToTime(e.value)            
            },
        },        
        toolTip: {
            animationEnabled: false,
            shared: true,
            contentFormatter: function(e) {                             
                let time = msToTime(e.entries[0].dataPoint.y)
                return (e.entries[0].dataSeries.name) + ': ' + time;
            }
        },
        data: new Array(series)
    });
    stopTimeChart.render();
}
