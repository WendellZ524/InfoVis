// Our Javascript will go here.
// create scene


const scene = new THREE.Scene();
// create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z = 300;

// create renderer            
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight * 0.999);
renderer.setClearColor(0x333333, 1);
document.getElementById('mainview').appendChild(renderer.domElement);
// OrbitControlers*******************

var controls = new THREE.OrbitControls(camera, renderer.domElement);
const light = new THREE.DirectionalLight(0xaaaaaa, 0.9); // soft white light
var pivot = new THREE.Object3D()
light.position.x = -1000
pivot.add(light);
scene.add(pivot)

//***********

//************ */
function initGlobe(R, scene) {
    let _globe = new THREE.Group();

    worldGeo.features.forEach((country) => {
        if (country.geometry.type === "Polygon") {
            var line = countryLine(R, country.geometry.coordinates);
            _globe.add(line);
        } else if (country.geometry.type === "MultiPolygon") {
            country.geometry.coordinates.forEach((Polygon) => {
                var line = countryLine(R, Polygon);
                _globe.add(line);
            })
        }
    })
    const sphereGeometry = new THREE.SphereGeometry(R - 0.1, 50, 50);
    const sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x666666,
        opacity: 0.95,
        transparent: true,
    });
    this.InsideSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.InsideSphere.name = 'Insider'
    _globe.add(InsideSphere);
    _globe.rotation.y = 10
    _globe.rotation.x = -0.3

    return _globe
}

function countryLine(R, polygonArr) {
    //console.log(polygonArr)
    let group = new THREE.Group();
    polygonArr.forEach(polygon => {
        let pointArr = [];
        polygon.forEach(elem => {
            //console.log(polygon[0])
            let xyz = coord2xyz(R, elem[0], elem[1])
                //console.log(xyz)
            pointArr.push(xyz['x'], xyz['y'], xyz['z'])

        });
        //console.log(pointArr)
        group.add(line(pointArr));
    });
    return group;
}

function line(pointArr) {
    //
    let geometry = new THREE.BufferGeometry();
    let vertices = new Float32Array(pointArr);
    let attribue = new THREE.BufferAttribute(vertices, 3);
    geometry.attributes.position = attribue;
    let material = new THREE.LineBasicMaterial({
        color: 0xffffff, //white
        linecap: 'round', //ignored by WebGLRenderer
        linejoin: 'round' //ignored by WebGLRenderer
    });
    let line = new THREE.LineLoop(geometry, material);
    return line;
}

function addCountry(globe) {
    countries = []
    for (let row of full_tab) {
        if (!countries.includes(row.Port_Country)) {
            countries.push(row.Port_Country)

        }

    }
    if (countries[0] == null) countries.shift()
    for (let row of allcountry) {
        //clean not used data:
        if (countries.includes(row.Country) && Top5.includes(row.Country)) {
            c = Cylinder(0xffcc66) //gold
            xyz = coord2xyz(R + 5, row.lon, row.lat)
            coordVec3 = new THREE.Vector3(xyz.x, xyz.y, xyz.z).normalize();
            c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), coordVec3);

            c.position.x = xyz['x'];
            c.position.y = xyz['y'];
            c.position.z = xyz['z'];
            c.name = row.Country;
            this.globe.add(c)
        } else if (row.ID == 'AU') {
            c = Cylinder(0x999999)
            xyz = coord2xyz(R + 5, row.lon, row.lat)
            coordVec3 = new THREE.Vector3(xyz.x, xyz.y, xyz.z).normalize();
            c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), coordVec3);
            c.position.x = xyz['x'];
            c.position.y = xyz['y'];
            c.position.z = xyz['z'];
            Aus.x = xyz.x
            Aus.y = xyz.y
            Aus.z = xyz.z

            c.name = row.Country;
            this.globe.add(c)
        } else if (countries.includes(row.Country) && !Top5.includes(row.Country)) {

            c = Cylinder(0x999999)
            xyz = coord2xyz(R + 5, row.lon, row.lat)
            coordVec3 = new THREE.Vector3(xyz.x, xyz.y, xyz.z).normalize();
            c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), coordVec3);
            c.position.x = xyz['x'];
            c.position.y = xyz['y'];
            c.position.z = xyz['z'];
            Aus.x = xyz.x
            Aus.y = xyz.y
            Aus.z = xyz.z

            c.name = row.Country;
            this.globe.add(c)
        }
        //console.log(Top5)
        // Add Aus


    }

}







function Cylinder(color) {
    let geo = new THREE.CylinderGeometry(2.5, 0, 10, 100, 100);
    let mat = new THREE.MeshBasicMaterial({
        color: color
    })
    let mesh = new THREE.Mesh(geo, mat)
    return mesh
}

/**** 
 * background star
 */
const vertices = [];

for (let i = 0; i < 10000; i++) {

    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);

    vertices.push(x, y, z + 2000);
    vertices.push(x, y, z - 2000);
    vertices.push(x + 2000, y, z);
    vertices.push(x - 2000, y, z);
    vertices.push(x, y + 2000, z);
    vertices.push(x, y - 2000, z);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

const material = new THREE.PointsMaterial({ color: 0xaaaaaa });

const points = new THREE.Points(geometry, material);

scene.add(points);

//define mouse events
var mouse = new THREE.Vector2();

var isDragging = false;
var selected = null;

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('resize', onWindowResize);

function onMouseMove(event) {

    isDragging = true;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //console.log(mouse)
    ClientX = event.clientX
    ClientY = event.clientY
}

function updateLabels() {
    console.log('selected')
    selected = null;



}

function onWindowResize() {

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    aspect = SCREEN_WIDTH / SCREEN_HEIGHT * 2;

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT * 0.999);

    camera.aspect = 0.5 * aspect;
    camera.updateProjectionMatrix();


}



function ray() {
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(globe.children);

    //**moue over actions */
    if (intersects.length > 1 && intersects[0].object.name != 'Insider') {
        if (!pointat.includes(intersects[0].object)) {

            pointat.push(intersects[0])
            if (intersects[0].object.name != selected) {
                intersects[0].object.material.color = {
                    r: 255 / 255,
                    g: 255 / 255,
                    b: 255 / 255
                }
                intersects[0].object.scale.set(1.5, 1.5, 1.5)
            }
        }
        if (document.getElementsByClassName('panel').length == 0) //hover panel
            showPanel()
        else {
            document.getElementsByClassName('panel')[0].style.left = ClientX + 10 + 'px';
            document.getElementsByClassName('panel')[0].style.top = ClientY - 120 + 'px';

        }
    }



    //**do not point at country */
    if (intersects.length <= 1 && pointat.length > 0) {
        //restore the color
        pointat.forEach((stamp) => {
            if (stamp.object.name != 'Australia' && Top5.includes(stamp.object.name)) { //Top5 countries
                stamp.object.material.color = {
                    r: 255 / 255,
                    g: 204 / 255,
                    b: 102 / 255
                }
            } else if (stamp.object.name != 'Australia' && !Top5.includes(stamp.object.name)) {
                stamp.object.material.color = {
                    r: 153 / 255,
                    g: 153 / 255,
                    b: 153 / 255
                }
            } else { //AUS
                stamp.object.material.color = {
                    r: 153 / 255,
                    g: 153 / 255,
                    b: 153 / 255
                }
            }


            stamp.object.scale.set(1, 1, 1)
        })
        pointat = []
        panels = document.getElementsByClassName('panel')
        for (i = 0; i < panels.length; i++) {
            panels[i].remove()
        }
    }
    //console.log(pointat[pointat.length - 1])
    //** left click event*/
    if (intersects.length > 1 && intersects[0].object.name != 'Insider' && intersects[0].object.name != selected && Click) {
        set_selected(intersects[0].object.name)
            //selected.country = intersects[0].object.name;
    }
    //** right click event*/
    if (intersects.length > 1 && intersects[0].object.name != 'Insider' && intersects[0].object.name != selected && RightClick) {

        //selected.country = intersects[0].object.name;
    }

}

function showPanel() {
    //console.log('Show panel')
    var node = document.getElementsByTagName("body")[0]
    let value_in = 0;
    let value_out = 0;
    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = ClientX + 10 + 'px';
    div.style.top = ClientY - 120 + 'px';
    //div.style.color = 'white'

    let c_name = document.createElement('p')
    c_name.id = 'cty_display'
    let c_data = document.createElement('p');
    c_data.id = 'data_dispaly'
    let obj;
    obj = table.find(function(obj) {
        //console.log(obj)
        return obj.Port_Country === pointat[0].object.name;
    })
    let unit = ' (ton)'
    console.log(obj)
    if (!(!obj)) {
        if (TOPIC == P) {
            if (!obj.Passengers_In) {
                console.log(Passengers_In + 'undef')
            } else {
                value_in += Number(obj.Passengers_In);
            }
            if (!obj.Passengers_Out) {
                console.log(Passengers_Out + 'undef')
            } else {
                value_out += Number(obj.Passengers_Out)
            }
        } else if (TOPIC == F) {
            if (!obj.Freight_In) {
                console.log(Freight_In + 'undef')
            } else {
                value_in += Number(obj.Freight_In)
                value_in += unit
            }
            if (!obj.Freight_Out) {
                console.log(Freight_Out + 'undef')
            } else {
                value_out += Number(obj.Freight_Out)
                value_out += unit
            }
        } else if (TOPIC == M) {
            if (!obj.Mail_In) {
                console.log(Mail_In + 'undef')
            } else {
                value_in += Number(obj.Mail_In)
                value_in += unit
            }
            if (!obj.Mail_Out) {
                console.log(Mail_Out + 'undef')
            } else {
                value_out += Number(obj.Mail_Out)
                value_out += unit
            }
        }
    }

    let str = TOPIC + '&ensp;&ensp;in:  ' + value_in + '<br>' + TOPIC + ' out: ' + value_out
    c_data.innerHTML = str;
    c_name.innerHTML = pointat[0].object.name
    div.classList.add('panel');
    div.append(c_name)
    div.append(c_data);
    node.append(div);
    x = div;
    setTimeout("x.remove()", 50000);
}


function animate() {
    //globe.rotation.y -= 0.00009;
    ray()
    requestAnimationFrame(animate);
    Click = false
    RightClick = false
    renderer.render(scene, camera);
    pivot.rotation.y += 0.01;
}

function mouseDown(e) {
    e = e || window.event;
    switch (e.which) {
        case 1:
            controls.enabled = true;
            Click = true
            break;
        case 2:
            controls.enabled = true;
            break;
        case 3:
            controls.enabled = false;
            RightClick = true
                // show target info
            ClientX = e.clientX
            ClientY = e.clientY
            break;
    }
}