//full_tab.sort((row1, row2) => {
//  return row2.Passengers_In - row1.Passengers_In;
//});

var labels = []

var data = {
    // labels: labels,
    datasets: [{
            label: 'In',
            backgroundColor: 'rgb(255,255,255)',


            data: table,
            parsing: {      
                yAxisKey: 'Port_Country',
                      xAxisKey: TOPIC + '_In'
            },

        },
        {
            label: 'Out',
            backgroundColor: 'rgb(255,204,102)',

            data: table,
            parsing: {      
                yAxisKey: 'Port_Country',
                      xAxisKey: TOPIC + '_Out'
            }

        }
    ]
}
let canvas = document.getElementById('Barchart')

WINDOW_WIDTH = canvas.parentNode.offsetWidth;
WINDOW_HEIGHT = canvas.parentNode.offsetHeight * 1.5;
let aspect = WINDOW_WIDTH / WINDOW_HEIGHT
let config = {
    type: 'bar',
    data: data,
    options: {
        interaction: {
            mode: 'index'
        },
        events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
        onClick: (e) => {
            let  canvasPosition  =  Chart.helpers.getRelativePosition(e,  e.chart);      
            let barNumber = e.chart.scales.y.getValueForPixel(canvasPosition.y); 


            let row = bar_countries[barNumber];
            console.log(row)  
            selected = row 
            Update_LineChart()
        },
        aspectRatio: aspect,
        responsive: true,
        indexAxis: 'y',
        animation: {
            duration: 500,
            easing: 'easeOutQuart',
            delay: 200,
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
            },
            tooltip: {
                // Tooltip will only receive click events
                events: ['mousemove']
            }
        },

        scales: {
            x: {
                ticks: {
                    color: "white"
                },
                type: 'logarithmic',
                reverse: true,
                display: true,
                grid: {
                    display: true,
                    color: 'gray'
                },
                position: 'top'

            },
            y: {
                position: 'right',
                grid: {
                    display: false
                },
                ticks: {
                    color: "white"
                },

            }
        }
    }
};

var BarChart = new Chart(
    canvas,
    config
);