// Fair division of orders to drivers
// @author: https//github.com/brayvid


var storeAddress = '116 Macdougal St';

var defaultFields = 3;
var currentFields = 0;

var geocoder;

var data;

var numDrivers;
var orders;
var coords;

var nyCoords = [40.730610, -73.935242];

var googleCallCounter;
class Order {
    constructor(name, address) {
        this.name = name;
        this.address = address;
        // this.tip = tip;
    }
}

// class Driver {
//     constructor(name, deliveries) {
//         this.name = name;
//         this.deliveries = deliveries;
//     }

//     addDelivery(delivery) {
//         this.deliveries.push(delivery);
//     }
// }

function addField() {
    let i = currentFields;
    let d = document.createElement("div");
    d.setAttribute("class", "form-row");
    d.setAttribute("id", "row" + (i + 1));
    for (let j = 0; j < 2; j++) {
        let din = document.createElement("div");
        din.setAttribute("class", "col col-md-" + (4 * (j + 1)));
        let inp = document.createElement("input");
        inp.setAttribute("class", "form-control");
        inp.setAttribute("type", "text");
        if (j == 0) {
            inp.setAttribute("placeholder", "Order ID");
            inp.setAttribute("id", "n" + (i + 1));
        } else {
            inp.setAttribute("placeholder", "Address");
            inp.setAttribute("id", "a" + (i + 1));
        }
        din.appendChild(inp);
        d.appendChild(din)
    }

    document.getElementById("fields").appendChild(d);
    currentFields++;
}

function removeField() {
    if (currentFields > 1) {
        let select = document.getElementById('fields');
        select.removeChild(select.lastChild);
        currentFields -= 1;
    }
}

function compute() {

    googleCallCounter = 0;

    $(window).scrollTop(0);

    numDrivers = document.getElementById("sel1").value;

    orders = [];

    for (let i = 1; i < (currentFields + 1); i++) {
        let nTemp = document.getElementById("n" + i).value;
        let aTemp = document.getElementById("a" + i).value;
        // let tTemp = document.getElementById("t" + i).value;
        if (nTemp.match(/\S/) && aTemp.match(/\S/)) {
            orders.push(new Order(nTemp, aTemp));
        }
    }

    // Don't process when all empty
    if (orders.length == 0) {
        return;
    }

    // Get X-Y LatLng coordinates from addresses
    coords = [];
    for (let i = 0; i < orders.length; i++) {
        // console.log("Address: " + orders[i].address);
        geocoder.geocode({
            'address': orders[i].address
        }, function (results, status) {
            // console.log(status);
            if (status == 'OK') {
                // console.log("Lat: " + results[0].geometry.location.lat() + ", " + "Lng: " + results[0].geometry.location.lng());
                coords.push([Math.exp((results[0].geometry.location.lat() - nyCoords[0])), Math.exp((results[0].geometry.location.lng() - nyCoords[1]))])
            } else {
                alert('Geocode was not successful geocoding address "' + address + '" for the following reason: ' + status);
            }
            googleCallCounter++;
            if(googleCallCounter == orders.length){
                resultsTable();
                // console.log(coords);
            }
        });
    }

    // console.log(coords);


    // Make data out of coordinates






    // data = []; // fill in proper syntax for k-means clustering

    // for (let i = 0; i < orders.length; i++) {
    //     data.push([parseFloat(orders[i].address), parseFloat(orders[i].address)]); // data.push([x, x])
    // }

    // console.log(data);


}

function resultsTable() {
    kmeans = new KMeans({
        // canvas: document.getElementById('canvas'),
        data: coords,
        k: numDrivers
    });

    // console.log(kmeans.assignments);
    console.log(kmeans.assignments);
    let indices = [];
    for (let i = 0; i < numDrivers; i++) {
        indices[i] = [];
        for (let j = 0; j < orders.length; j++) {
            if (kmeans.assignments[j] == i) {
                indices[i].push(j);
            }
        }
    }
    // console.log("Indices:\n");
    // console.log(indices);


    // Generate table headers
    document.getElementById("go").innerHTML = '<table class="table table-condensed"><tbody id="tablebody"></tbody></table>';
    for (let i = 0; i < numDrivers; i++) {
        let headNode = document.createElement("TH");
        let headText = document.createTextNode("Driver " + (i + 1));
        headNode.appendChild(headText);
        document.getElementById("tablebody").appendChild(headNode);
    }

    // distMatrix(orders);

    // drivers = [];

    // for (let i = 0; i < numDrivers; i++) {
    //     drivers.push(new Driver("Driver " + (i + 1), []));
    // }


    // Display the computed partition

    // Find max orders for one driver
    let maxToOneDriver = 0;
    for (let i = 0; i < indices.length; i++) {
        let thisLength = indices[i].length;
        if (thisLength > maxToOneDriver) {
            maxToOneDriver = thisLength;
        }
    }

    let ordersPerDriver = [];
    for (let i = 0; i < numDrivers; i++) {
        ordersPerDriver[i] = indices[i].length;
    }

    let assignMap = [];
    for (let i = 0; i < maxToOneDriver; i++) {
        assignMap.push([]);
        for (j = 0; j < ordersPerDriver.length; j++) {
            assignMap[i][j] = 0;
            if (ordersPerDriver[j] > 0) {
                assignMap[i][j] = 1;
                ordersPerDriver[j] -= 1;
            }
        }
    }

    let counter = [];
    for (let i = 0; i < numDrivers; i++) {
        counter.push(0);
    }


    for (let i = 0; i < maxToOneDriver; i++) { //  each row
        let bodyNode = document.createElement("TR");
        for (let j = 0; j < numDrivers; j++) {
            let bodyData = document.createElement("TD");
            if (assignMap[i][j] == 1) {
                let bodyText = document.createTextNode(orders[indices[j][counter[j]]].name);
                counter[j]++;
                bodyData.appendChild(bodyText);
            }
            bodyNode.appendChild(bodyData);
        }
        document.getElementById("tablebody").appendChild(bodyNode);
    }




}

function bikeDist(a, b) {
    // Google Maps API call here
    return Math.random();
}

function distMatrix(orders) {
    let originsArr = [storeAddress + " NY NY"];
    let destsArr = originsArr;
    for (let i = 0; i < orders.length; i++) {
        originsArr.push(orders[i].address + " NY NY");
        destsArr[i + 1] = originsArr[i + 1];
    }
    service.getDistanceMatrix({
        origins: originsArr,
        destinations: destsArr,
        travelMode: 'BICYCLING',
    }, callback);
}
//

function callback(response, status) {
    if (status == 'OK') {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;

        for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
                var element = results[j];
                var distance = element.distance.text;
                var duration = element.duration.text;
                var from = origins[i];
                var to = destinations[j];
            }
        }
    }
}

function googleReady() {
    geocoder = new google.maps.Geocoder();
    console.log("Google Maps API ready");
}

// // rows = origins, columns = destinations
// let n = orders.length;
// let mat = new Array(n);
// for (let i = 0; i < n; i++) {
//     mat[i] = new Array(n);
//     for (let j = 0; j < n; j++) {
//         if (i == j) {
//             mat[i][j] = 0;
//         } else {
//             mat[i][j] = bikeDist(orders[i].address, orders[j].address);
//         }
//     }
// }
// return mat;