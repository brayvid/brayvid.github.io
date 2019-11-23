// Efficient division of orders to drivers
// (c) 2019 Blake Rayvid. License is granted only for non-commerical use.
// Author: https//github.com/brayvid

var version = "1.0";

var defaultFields = 3;
var currentFields = 0;

// Additional functionality
// var geocoder;
// var data;
// var kmeanCount = 11;
// var coords;
// var indices;
// var geocodeCounter;
// var geocodingComplete = false;
// var matrixComplete = false;
// var filteredFinalGroups;

var numDrivers;
var orders;
var addresses;
var dMatrix;
var groups;

// var storeCoords = [40.729670, -74.000450];
var storeAddress = '116 Macdougal St';
var cityState = "NY NY";

class Order {
    constructor(name, address) {
        this.name = name;
        this.address = address;
    }
}

function compute() {
    // geocodeCounter = 0;

    $(window).scrollTop(0);

    numDrivers = document.getElementById("sel1").value;

    orders = [];

    for (let i = 1; i < (currentFields + 1); i++) {
        let nTemp = document.getElementById("n" + i).value;
        let aTemp = document.getElementById("a" + i).value;
        if (nTemp.match(/\S/) && aTemp.match(/\S/)) {
            orders.push(new Order(nTemp, aTemp));
        }
    }

    // Testing only
    // for (let i = 0; i < testAddresses.length; i++) {
    //     let nTemp = testNames[i];
    //     let aTemp = testAddresses[i];
    //     orders.push(new Order(nTemp, aTemp));
    // }

    // Don't process when all empty
    if (orders.length == 0 || orders.length == 1) {
        document.getElementById("go").innerHTML = "Enter at least two orders.";
        return;
    }

    // document.getElementById("go").innerHTML = '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div></div>';

    // // console.log("Address: " + orders[i].address);
    // document.getElementById("go").innerHTML = '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="' + (i + 1) * 10 + '" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div></div>';

    addresses = [storeAddress + " " + cityState];
    for (let i = 0; i < orders.length; i++) {
        addresses.push(orders[i].address + " " + cityState);
        document.getElementById("go").innerHTML = '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow=' + 10 * (i + 1) + ' aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div></div>';
    }

    // For testing only
    // for (let i = 0; i < testAddresses.length; i++) {
    //     addresses.push(testAddresses[i] + " " + cityState);
    //     document.getElementById("go").innerHTML = '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="' + 10 * (i + 1) + '" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div></div>';
    // }

    // Get distance matrix
    matrixService.getDistanceMatrix({
        origins: addresses,
        destinations: addresses,
        travelMode: 'BICYCLING',
        // unitSystem: google.maps.UnitSystem.IMPERIAL
    }, function (response, status) {
        // console.log(status);
        if (status == 'OK') {
            // console.log("Lat: " + results[0].geometry.location.lat() + ", " + "Lng: " + results[0].geometry.location.lng());
            dMatrix = response.rows;
            // console.log(dMatrix);
            // matrixComplete = true;
            analyzeResults();
        } else {
            alert('Distance Matrix call was not successful for the following reason: ' + status);
        }
    });

    analyzeResults();

    // // Get LatLng coordinates
    // coords = [];
    // for (let i = 0; i < orders.length; i++) {
    //     geocoder.geocode({
    //         'address': orders[i].address
    //     }, function (results, status) {
    //         // console.log(status);
    //         if (status == 'OK') {
    //             // console.log("Lat: " + results[0].geometry.location.lat() + ", " + "Lng: " + results[0].geometry.location.lng());
    //             // coords.push([Math.exp((results[0].geometry.location.lat() - storeCoords[0])), Math.exp((results[0].geometry.location.lng() - storeCoords[1]))]);
    //             coords.push([(results[0].geometry.location.lat() - storeCoords[0]), (results[0].geometry.location.lng() - storeCoords[1])]);

    //         } else {
    //             alert('Geocode was not successful geocoding address "' + address + '" for the following reason: ' + status);
    //         }
    //         geocodeCounter++;
    //         if (geocodeCounter == orders.length) {
    //             geocodingComplete = true;
    //             // console.log(coords);
    //         }
    //     });
    // }
}

function analyzeResults() {

    // // Frequency rank k-mean clustering results

    // allKMeans = new Array(kmeanCount);
    // for (let i = 0; i < kmeanCount; i++) {
    //     allKMeans[i] = new KMeans({
    //         data: coords,
    //         k: numDrivers
    //     });
    // }

    // // console.log(coords);
    // // console.log("allKMeans.assignments:\n");
    // // for (let i = 0; i < kmeanCount; i++) {
    // //     console.log(allKMeans[i].assignments);

    // // }

    // let uniques = [];
    // let freqs = [];
    // for (let i = 0; i < kmeanCount; i++) {
    //     let activeArray = allKMeans[i].assignments;
    //     let pos = uniques.indexOf(activeArray);
    //     if (pos != -1) {
    //         uniques[pos] = activeArray;
    //         freqs[pos]++;
    //     } else {
    //         uniques.push(activeArray);
    //         freqs.push(1);
    //     }
    // }

    // let mostFrequentKmean;
    // let max = 0;
    // for (let i = 0; i < uniques.length; i++) {
    //     if (freqs[i] >= max) {
    //         max = freqs[i];
    //         mostFrequentKmean = uniques[i];
    //     }
    // }

    // console.log("mostFrequentKmean:\n");
    // console.log(mostFrequentKmean);


    // indices = [];
    // for (let i = 0; i < numDrivers; i++) {
    //     indices[i] = [];
    //     for (let j = 0; j < orders.length; j++) {
    //         if (allKMeans[j].assignments[j] == i) {
    //             indices[i].push(j);
    //         }
    //     }
    // }

    // console.log("indices:\n");
    // console.log(indices);

    let matrixTimes = [],
        averageTimes = [];

    for (let i = 0; i < orders.length + 1; i++) {
        matrixTimes.push([]);
        averageTimes.push([]);
        for (let j = 0; j < orders.length + 1; j++) {
            matrixTimes[i].push(dMatrix[i].elements[j].duration.value);
            averageTimes[i].push(0);
        }
    }

    // console.log("matrixTimes:\n");
    // console.log(matrixTimes);

    for (let i = 0; i < matrixTimes.length; i++) {
        for (let j = 0; j < matrixTimes.length; j++) {
            if (j < i) {
                averageTimes[j][i] = 0;
            } else {
                averageTimes[j][i] = (matrixTimes[i][j] + matrixTimes[j][i]) / 2;
            }
        }
    }

    console.log("averageTimes:\n");
    console.log(averageTimes);


    // Determine global min and max
    let avgMax = 0;
    let bigNum = 999999999;
    let avgMin = bigNum;
    // let maxIndex;
    // let minIndex;

    for (let i = 1; i < averageTimes.length; i++) {
        for (let j = 1; j < i; j++) {
            if (averageTimes[i][j] >= avgMax) {
                avgMax = averageTimes[i][j];
                // maxIndex = [i, j];
            }
            if (averageTimes[i][j] <= avgMin) {
                avgMin = averageTimes[i][j];
                // minIndex = [i, j];
            }
        }
    }

    // console.log("avgMax: " + avgMax);
    // console.log("maxIndex: " + maxIndex);
    // console.log("avgMin: " + avgMin);
    // console.log("minIndex: " + minIndex);


    // Origin and destination are same group for element with minimum nonzero average time.



    let matrixGroupIndices = new Array(numDrivers);
    for (let i = 0; i < numDrivers; i++) {
        matrixGroupIndices[i] = -1;
    }

    // let matrixMidrange = (avgMax + avgMin) / 2;

    let matrixMidrange = avgMin + (avgMax - avgMin) / numDrivers;

    if (orders.length == 1) {
        matrixGroupIndices[randomChoice(numDrivers)] = 0;
    } else {
        groups = [];
        for (let i = 1; i < averageTimes.length; i++) {
            for (let j = 1; j < i; j++) {
                if (averageTimes[i][j] < matrixMidrange) {
                    // Small time -> same group
                    if (groups.length != 0) {
                        for (let k = 0; k < groups.length; k++) {
                            if (groups[k].includes(i) && groups[k].includes(j)) {

                            } else if (groups[k].includes(i)) {
                                groups[k].push(j);
                            } else if (groups[k].includes(j)) {
                                groups[k].push(i);
                            } else {
                                groups.push([i, j]);
                            }
                        }
                    } else {
                        groups.push([i, j]);
                    }
                }
            }
            // console.log("groups " + i + "\n");
            // console.log(groups);
        }
        // 
        for (let i = 0; i < orders.length; i++) {
            let contained = false;
            for (let j = 0; j < groups.length; j++) {
                if (groups[j].includes(i + 1)) {
                    contained = true;
                }
            }
            if (!contained) {
                groups.push([i + 1]);
            }
        }

        for (let i = 0; i < groups.length; i++) {
            groups[i].sort();
        }

        // console.log("\n");
        // console.log("groups:\n");
        // console.log(groups);
    }

    drawTable();
}

function drawTable() {

    // Find max orders one driver is taking
    let maxToOneDriver = 0;
    let ordersPerDriver = [];
    for (let i = 0; i < groups.length; i++) {
        ordersPerDriver.push(groups[i].length);
        if (groups[i].length > maxToOneDriver) {
            maxToOneDriver = groups[i].length;
        }
    }
    for (let i = 0; i < numDrivers - ordersPerDriver.length; i++) {
        ordersPerDriver.push(0);
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
    document.getElementById("go").innerHTML = '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 75%"></div></div>';


    // Table header
    document.getElementById("go").innerHTML = '<table class="table table-condensed"><tbody id="tablebody"></tbody></table>';
    for (let i = 0; i < numDrivers; i++) {
        let headNode = document.createElement("TH");
        let headText = document.createTextNode("Driver " + (i + 1));
        headNode.appendChild(headText);
        document.getElementById("tablebody").appendChild(headNode);
    }

    // Table body
    for (let i = 0; i < maxToOneDriver; i++) { //  each row
        let bodyNode = document.createElement("TR");
        for (let j = 0; j < numDrivers; j++) {
            let bodyData = document.createElement("TD");
            if (assignMap[i][j] == 1) {
                let bodyText = document.createTextNode(orders[groups[j][i] - 1].name);
                counter[j]++;
                bodyData.appendChild(bodyText);
            }
            bodyNode.appendChild(bodyData);
        }
        document.getElementById("tablebody").appendChild(bodyNode);
    }
}

function googleReady() {
    geocoder = new google.maps.Geocoder();
    matrixService = new google.maps.DistanceMatrixService();
    console.log("Driver Order Assignment v" + version);
    console.log("Google Maps JavaScript API ready.");
}

function arraysMatch(arr1, arr2) {

    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;

}

function randomChoice(a) {
    return Math.floor(Math.random() * (a + 1));
}

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