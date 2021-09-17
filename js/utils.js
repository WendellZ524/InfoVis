var bar_countries = []
    // filter data by year
function filter_year(year) {
    bar_countries = []
    table = []
    for (let row of full_tab) {

        if (row.Year == year) {
            if (TOPIC == P) {
                if (row.Passengers_In > 0 && row.Passengers_Out > 0)
                    table.push(row)
            } else if (TOPIC == F) {
                if (row.Freight_In > 0 && row.Freight_Out > 0)
                    table.push(row)
            } else if (TOPIC == M) {
                if (row.Mail_In > 0 && row.Mail_Out > 0)
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
    getTop5()
}

//filter data by Country
function filter_country(country) {
    Line_tab = []
    for (let row of full_tab) {
        if (row.Port_Country == country) {
            Line_tab.push(row)
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
    sum = 0
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


    for (let row of Line_tab) {
        //console.log('min:' + Math.min(...labels))
        let i = row.Year - 1985
        if (i == 2020 - 1985) {
            sum += row.Passengers_Out
            console.log(row.Passengers_Out)
            console.log('i= ' + i + 's=' + sum)
            console.log(row)
        }
        Pin_data[i] += Number(row.Passengers_In);
        Pout_data[i] += Number(row.Passengers_Out);
        Fin_data[i] += Number(row.Freight_In);
        Fout_data[i] += Number(row.Freight_Out);
        Min_data[i] += Number(row.Mail_In);
        Mout_data[i] += Number(row.Mail_Out);

    }


    //console.log(Math.sum(Pout_data))
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

    BarChart.update();
    Update_cone();
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
    BarChart.data.datasets[0].parsing.xAxisKey = TOPIC + '_In';
    BarChart.data.datasets[1].parsing.xAxisKey = TOPIC + '_Out';

    getTop5()
    BarChart.update()
    Update_LineChart()
    Update_cone()
}

function Update_cone() {
    for (let child of globe.children) {
        if (child.name != '' && child.name != 'Australia') {
            child.material.color = {
                r: 153 / 255,
                g: 153 / 255,
                b: 153 / 255
            }

        }
        if (Top5.includes(child.name)) {
            child.material.color = {
                r: 255 / 255,
                g: 204 / 255,
                b: 102 / 255
            }
        }
    }
}

function getTop5() {
    Top5 = []
    target_coord = []

    for (i = 0; i < 5; i++)
        Top5.push(bar_countries[i])
    for (let row of allcountry) {
        if (Top5.includes(row.Country) || Top5.includes(row.ID)) {
            let country = {
                    lat: 0,
                    lon: 0,
                    x: 0,
                    y: 0,
                    z: 0,
                },
                xyz = coord2xyz(R, row.lon, row.lat)
            country.lat = row.lat;
            country.lon = row.lon;
            country.x = xyz.x
            country.y = xyz.y
            country.z = xyz.z
            target_coord.push(country);
        }

    }

    for (let row of target_coord) {

        arcs.push(arc())
    }
}

function arc(start, end) {
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-300, 0, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(300, 0, 0)
    );

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

    // Create the final object to add to the scene
    const curveObject = new THREE.Line(geometry, material);
    return (curveObject)
}

function coord2xyz(R, lon, lat) {
    const _lon = lon * Math.PI / 180;
    const _lat = lat * Math.PI / 180;
    const x = R * Math.cos(_lat) * Math.sin(_lon);
    const y = R * Math.sin(_lat);
    const z = R * Math.cos(_lon) * Math.cos(_lat);
    return { x, y, z };
};