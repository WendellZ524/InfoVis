// labels
let line_labels = [];
for (let row of full_tab) {
    if (!line_labels.includes(row.Year)) line_labels.push(row.Year)
}


dataset1 = {
    label: 'In',
    data: table,
    parsing: {      
        yAxisKey: 'Port_Country',
              xAxisKey: TOPIC + '_In'
    },
    fill: false,
    borderColor: 'rgb(255,255,255)',
    backgroundColor: 'rgb(255,255,255)',
    tension: 0.1
};
dataset2 = {
    label: 'Out',
    data: [],
    parsing: {      
        yAxisKey: 'Port_Country',
              xAxisKey: TOPIC + '_Out'
    },
    fill: false,
    borderColor: 'rgb(255,204,102)',
    backgroundColor: 'rgb(255,204,102)',
    tension: 0.1
};
const line_data = {
    labels: line_labels,
    datasets: [dataset1, dataset2]
};


const LINE_CANVAS = document.getElementById('LineChart')
WINDOW_WIDTH = LINE_CANVAS.parentNode.offsetWidth;
WINDOW_HEIGHT = LINE_CANVAS.parentNode.offsetHeight;
aspect = WINDOW_WIDTH / WINDOW_HEIGHT
var LineChart = new Chart(LINE_CANVAS, {
    type: 'line',
    data: line_data,
    options: {
        onClick: (e) => {
            let  canvasPosition  =  Chart.helpers.getRelativePosition(e,  e.chart);      
            let barNumber = e.chart.scales.x.getValueForPixel(canvasPosition.x); 
            document.getElementById('timeline').value = barNumber + 1985

            time_update()
        },
        plugins: {
            legend: {
                align: 'start',
                labels: {
                    color: 'white',

                }
            }
        },
        aspectRatio: aspect,
        responsive: true,
        scales: {

            y: {
                beginAtZero: true,
                ticks: {
                    color: "white"
                },
            },
            x: {
                ticks: {
                    color: "white"
                },
            }
        }
    }
});