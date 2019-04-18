var chart;
function generateChart(series) {
    chart = new CanvasJS.Chart("chartContainer", {
        culture: 'pt-br',
        theme : 'light1',                
        animationEnabled: true,
        title: {
            text: "INTERFERÊNCIAS",            
        },
        axisX: {
             valueFormatString: "DD/MM/YY",
             crosshair: {
                 enabled: true,
                 snapToDataPoint: true
             }
        },
        axisY: {
            title: "Tempo de Parada",             
            tickLength: 15,            
            gridThickness: 2,
            includeZero: true,
            stripLines:[
                {                
                    value:1771000,
                    thickness:3
                }],
            labelFormatter: function(e) {
                return msToTime(e.value)            
            },
            crosshair: {                 
                 snapToDataPoint: true
             }
        },
        legend: {
            cursor: "pointer",
            fontSize: 16,
            itemclick: toggleDataSeries,
            reversed: true,
			verticalAlign: "center",
			horizontalAlign: "right"
        },
        toolTip: {
            animationEnabled: true,
            shared: false,
            contentFormatter: function(e) {                             
                let time = msToTime(e.entries[0].dataPoint.y)
                return (e.entries[0].dataSeries.name) + ': ' + time;       
            }
        },
        data: series
    });  
   

    function toggleDataSeries(e) {
        console.log(e)
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }    
    chart.render();
}


