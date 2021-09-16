var bar_countries = []
    // filter data by year
function filter_year(year) {
    table = []
    for (let row of full_tab) {

        if (row.Year == year) {
            if (TOPIC == P) {
                if (row.Passengers_In > 100 && row.Passengers_Out > 100)
                    table.push(row)
            } else if (TOPIC == F) {
                if (row.Freight_In > 1 && row.Freight_Out > 1)
                    table.push(row)
            } else if (TOPIC == M) {
                if (row.Mail_In > 1 && row.Mail_Out > 1)
                    table.push(row)
            }

        }
    }
    //sort data with keyworkd
    if (TOPIC == P) {
        console.log('sorting')
        table.sort((row1, row2) => {
            return (row2.Passengers_In + row2.Passengers_Out) - (row1.Passengers_In + row1.Passengers_Out);
        })
    } else if (TOPIC == F) {
        table.sort((row1, row2) => {
            return (row2.Freight_In + row2.Freight_Out) - (row1.Freight_In + row1.Freight_Out);
        })
    } else if (TOPIC == M) {
        table.sort((row1, row2) => {
            return (row2.Mail_In + row2.Mail_Out) - (row1.Mail_In + row1.Mail_Out);
        })
    };
    for (let row of table) {
        if (!bar_countries.includes(row.Port_Country))
            bar_countries.push(row.Port_Country)
    }
}

//filter data by Country
function filter_country(country) {
    table = []
    for (let row of full_tab) {
        if (row.Port_Country == country) {
            table.push(row)
        }
    }
}

function Update_LineChart() {

    filter_country(selected)
    labels = []
    Pin_data = []
    Pout_data = []
    Fin_data = []
    Fout_data = []
    Min_data = []
    Mout_data = []



    Pin_data = []

    //get labels
    for (let i = 1985; i <= 2021; i++) {
        labels.push(i)
        Pin_data.push(0)
        Pout_data.push(0)
        Fin_data.push(0)
        Fout_data.push(0)
        Min_data.push(0)
        Mout_data.push(0)
    }

    for (let row of table) {
        //console.log('min:' + Math.min(...labels))
        let i = row.Year - 1985
        Pin_data[i] += row.Passengers_In
        Pout_data[i] += row.Passengers_Out
        Fin_data[i] = row.Freight_In
        Fout_data[i] = row.Freight_Out
        Min_data[i] = row.Mail_In
        Mout_data[i] = row.Mail_Out
    }
    //console.log(table)
    //console.log(labels)
    //console.log(Pin_data)
    if (TOPIC == P) {
        LineChart.data.datasets[0].data = Pin_data
        LineChart.data.datasets[1].data = Pout_data
    }
    if (TOPIC == F) {
        LineChart.data.datasets[0].data = Fin_data
        LineChart.data.datasets[1].data = Fout_data
    }
    if (TOPIC == M) {
        LineChart.data.datasets[0].data = Min_data
        LineChart.data.datasets[1].data = Mout_data
    }


    LineChart.update();
}



function time_update() {
    //change data
    curr_year = document.getElementById('timeline').value;
    document.getElementById("time").innerHTML = curr_year
    filter_year(curr_year)
    labels = []
    for (let row of table) {
        if (!labels.includes(row.Port_Country)) labels.push(row.Port_Country)
    }
    if (labels[0] == null) labels.shift()
        //update chart
    BarChart.data.labels = labels;

    BarChart.data.datasets.forEach(dataset => {
        dataset.data = table
    });

    BarChart.update()
    console.log('try to update bar')
}

function TOPIC_update() {
    //change data
    filter_year(curr_year)
        //time_update()
    labels = []
    for (let row of table) {
        if (!labels.includes(row.Port_Country)) labels.push(row.Port_Country)

    }
    if (labels[0] == null) labels.shift()
        //update chart
    BarChart.data.labels = labels;

    BarChart.data.datasets.forEach(dataset => {
        dataset.data = table
    });

    WINDOW_WIDTH = canvas.parentNode.offsetWidth;
    WINDOW_HEIGHT = canvas.parentNode.offsetHeight * (labels.length % 10);
    //aspect = WINDOW_WIDTH / WINDOW_HEIGHT
    BarChart.options.aspectRatio = aspect;
    BarChart.data.datasets[0].parsing.xAxisKey = TOPIC + '_In'
    BarChart.data.datasets[1].parsing.xAxisKey = TOPIC + '_Out'

    BarChart.update()
    Update_LineChart()
}