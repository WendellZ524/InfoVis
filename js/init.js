const P = 'Passengers';
const F = 'Freight';
const M = 'Mail';
var TOPIC = P;
var curr_year = 2021;
var R = 200
var selected = 'New Zealand';
var ClientX = 0
var ClientY = 0

function set_selected(name) {
    selected = name;
    select_callback(); // this is whatever you wanted to call onChange
}

function select_callback() {
    //console.log(selected)
    //update Title

    //up date line chart here
    //update dataset
    Update_LineChart()
    document.getElementById('cur_country').innerHTML = selected


}
filter_year(curr_year);
var labels = []
for (let row of table) {
    if (!labels.includes(row.Port_Country)) {
        labels.push(row.Port_Country)

    }

}
if (labels[0] == null) labels.shift()

Picon = document.getElementById('Picon');
Ficon = document.getElementById('Ficon');
Micon = document.getElementById('Micon');