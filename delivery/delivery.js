/*  Title: Delivery Assignment   
    Purpose: Assigns deliveries that are close together to the same driver if possible.
    Requirements: Google Maps JS API Distance Matrix Service (# of calls per button click = (n+1)^2 where n is # orders)
    Usage policy: (c) 2019 Blake Rayvid. License is granted for non-commerical use only.
    Author: Blake Rayvid (https//github.com/brayvid)
    */

var defaultFields = 3,
    currentFields = 0,
    colors = [
        "#ff6600",
        "#0000ff",
        "#00ff00",
        "#6600ff"
    ],

    numDrivers,

    matrixService,
    directionService,
    map,
    mapOptions,

    storeAddress = '116 Macdougal St',
    cityState = "NY NY",
    storeLL = [40.729671, -74.000450],

    transportation = 'BICYCLING', // or 'DRIVING' or 'WALKING'
    dropoffSeconds = 120, // rough time stopped at a customer's location

    orders,
    addressArray,
    groups,
    addressGroups,
    numGroups,
    routeDurations = [],

    trialCounter = 0,
    matrixCounter,
    directionsCounter,

    trials = 5,
    minOrders = 2, // 2 or more
    maxOrders = 5;



function compute(orderCount) {
    matrixCounter = 0;
    directionsCounter = 0;

    numDrivers = document.getElementById("driverSelect").value;

    // let orderCount = uniformRandomInt(minOrders, maxOrders); // Pick a random number of orders

    // Randomly choose the specified number of addresses 
    // addressArray = new Array(orderCount);
    // for (let i = 0; i < orderCount; i++) {
    //     let choice = testList[uniformRandomInt(0, testList.length - 1)]; // choose street
    //     addressArray[i] = uniformRandomInt(parseInt(choice.min), parseInt(choice.max)) + " " + choice.street + " " + cityState; // choose building
    //     // console.log(addressArray[i]);
    // }

    // get order IDs and addresses from fields
    orders = [];
    addressArray = [];
    for (let i = 1; i < (currentFields + 1); i++) {
        let nTemp = document.getElementById("n" + i).value;
        let aTemp = document.getElementById("a" + i).value;
        if (nTemp.match(/\S/) && aTemp.match(/\S/)) {
            orders.push(new Order(nTemp, aTemp + " " + cityState));
            addressArray.push(aTemp + " " + cityState);
        }
    }

    // Don't process when all fields are empty or only one order present
    if (orders.length < 2) {
        document.getElementById("map").style.height = "30px";
        document.getElementById("map").innerHTML = "Enter at least two orders.";
        return;
    }

    mapOptions = {
        zoom: 14,
        center: {
            lat: storeLL[0],
            lng: storeLL[1]
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        gestureHandling: 'cooperative'
    }
    map = new google.maps.Map(document.getElementById("map"), mapOptions);


    console.log("Addresses:");
    for (let i = 0; i < addressArray.length; i++) {
        console.log(addressArray[i]);
    }

    // Get distance matrix for this set of orders
    let matrixRequest = {
        // origins same as destinations
        origins: [storeAddress + " " + cityState].concat(addressArray),
        destinations: [storeAddress + " " + cityState].concat(addressArray),
        travelMode: transportation,
    };

    matrixService.getDistanceMatrix(matrixRequest, matrixCallback);
    $(".collapse").collapse('show');
}

function matrixCallback(response, status) {
    if (status == 'OK') {
        matrixCounter++;
        // console.log("Distance matrix received.");

        cluster(response.rows); // determine groups
        addressGroups = new Array(groups.length);
        numGroups = groups.length;
        for (let i = 0; i < groups.length; i++) {
            console.log("Group " + (i + 1) + ":");
            for (let j = 0; j < groups[i].length; j++) {
                addressGroups[i] = [];
                let currentAddress = addressArray[groups[i][j] - 1];
                console.log(currentAddress);
                addressGroups[i].push(currentAddress);
            }
            getRouteDuration(addressGroups[i]);
        }
    } else {
        document.getElementById("map").style.height = "30px";
        document.getElementById("map").innerHTML = "Distance matrix request unsuccessful: " + status;
    }
}

function getRouteDuration(addresses) {
    let waypts = [];
    for (let j = 0; j < addresses.length; j++) {
        waypts.push({
            location: addresses[j],
            stopover: true
        });
    }

    let directionsRequest = {
        origin: storeAddress + " " + cityState,
        destination: storeAddress + " " + cityState,
        travelMode: transportation,
        waypoints: waypts,
        optimizeWaypoints: true,
        provideRouteAlternatives: false,
    };

    directionService.route(directionsRequest, directionsCallback);
}

function directionsCallback(response, status) {
    if (status === 'OK') {
        directionsCounter++;
        // console.log("Route received.");

        // Add route to map
        let directionsRenderer = new google.maps.DirectionsRenderer({
            polylineOptions: {
                strokeColor: colors[directionsCounter - 1]
            }
        });
        directionsRenderer.setMap(map);
        directionsRenderer.setOptions({
            suppressMarkers: true,
            draggable: false,
            preserveViewport: true,
            suppressBicyclingLayer: true
        });
        directionsRenderer.setDirections(response);

        // Get route duration
        let route = response.routes[0];
        let legs = route.legs;
        let duration = 0;
        for (let k = 0; k < legs.length; k++) {
            duration += legs[k].duration.value;
        }
        routeDurations.push(duration + dropoffSeconds * (legs.length - 1));
        if (directionsCounter == numGroups) {
            results();
            showTable();
            let marker = new google.maps.Marker({
                position: {
                    lat: storeLL[0],
                    lng: storeLL[1]
                },
                map: map,
                icon: {
                    url: 'cookie.png',
                    // This marker is 20 pixels wide by 32 pixels high.
                    size: new google.maps.Size(28, 28),
                    anchor: new google.maps.Point(14, 14)
                },
                title: "Store"
            });
            document.getElementById("map").style.height = "300px";
        }
    } else {
        document.getElementById("map").style.height = "30px";
        document.getElementById("map").innerHTML = "Directions request unsuccessful: " + status;
    }
}

function results() {
    let avg = 0;
    console.log("Results:");
    for (let i = 0; i < routeDurations.length; i++) {
        let minutes = routeDurations[i] / 60;
        avg += minutes;
        console.log("Route duration: " + minutes.toFixed(2) + " min");
    }
    avg = avg / routeDurations.length;
    console.log("Average time: " + avg.toFixed(2) + " min");
}

// Step 3 after button click
function showTable() {
    // Find max orders per driver over all drivers, aka number of rows of table to generate
    let maxToOneDriver = 0;
    let ordersPerDriver = [];
    for (let i = 0; i < groups.length; i++) {
        ordersPerDriver.push(groups[i].length);
        if (groups[i].length > maxToOneDriver) {
            maxToOneDriver = groups[i].length;
        }
    }

    // If there are fewer groups than drivers, set order counts for extra drivers to 0
    for (let i = 0; i < numDrivers - ordersPerDriver.length; i++) {
        ordersPerDriver.push(0);
    }

    // Determine if an order will be placed at each table entry
    let assignMap = [];
    for (let i = 0; i < maxToOneDriver; i++) { // for each row
        assignMap.push([]);
        for (j = 0; j < numDrivers; j++) { // for each column
            assignMap[i][j] = 0; // set to 0 to start
            if (ordersPerDriver[j] > 0) {
                // The current driver has orders still to list
                assignMap[i][j] = 1;
                ordersPerDriver[j] -= 1;
            }
        }
    }
    // document.getElementById("map").innerHTML = ""; // clear previous messages



    // Table header
    document.getElementById("tbl").innerHTML = '<table id="displayTable" class="table table-condensed"><tbody id="tablebody"></tbody></table>';
    for (let i = 0; i < numDrivers; i++) {
        let headNode = document.createElement("TH");
        let headText = document.createTextNode("Driver " + (i + 1));
        // let headColor = document.createElement("SPAN");
        // headColor.innerHTML = " ";
        headNode.appendChild(headText);
        headNode.style.borderBottom = "20px solid " + colors[i];
        // headNode.appendChild(headColor);
        document.getElementById("tablebody").appendChild(headNode);
    }

    // Table body
    for (let i = 0; i < maxToOneDriver; i++) { //  each row
        let bodyNode = document.createElement("TR");
        for (let j = 0; j < numDrivers; j++) {
            let bodyData = document.createElement("TD");
            if (assignMap[i][j] == 1) {
                let bodyText = document.createTextNode(orders[groups[j][i] - 1].name);
                // counter[j]++;
                bodyData.appendChild(bodyText);
            }
            bodyNode.appendChild(bodyData);
        }
        document.getElementById("tablebody").appendChild(bodyNode);
    }
    // Results have been printed to screen, process is complete.
}

function cluster(rows) {
    // Consolidate travel times (by bike) into a 2D array, rows = origins, cols = dests.
    let matrixTimes = [];
    let averageTimes = [];
    for (let i = 0; i < rows.length; i++) {
        matrixTimes.push([]);
        averageTimes.push([]);
        for (let j = 0; j < rows.length; j++) {
            matrixTimes[i].push(rows[i].elements[j].duration.value);
            averageTimes[i].push(0);
        }
    }

    // Average the forward and reverse times for each pair of addresses
    for (let i = 0; i < matrixTimes.length; i++) {
        for (let j = 0; j < matrixTimes.length; j++) {
            if (j < i) {
                averageTimes[j][i] = 0;
            } else {
                averageTimes[j][i] = (matrixTimes[i][j] + matrixTimes[j][i]) / 2;
            }
        }
    }

    // Hierarchical agglomerative clustering
    let activeSet = [];
    for (let i = 0; i < rows.length - 1; i++) {
        activeSet.push([i + 1]);
    }

    while (activeSet.length > numDrivers) {
        let minDist = 999999999,
            closestGroup1, closestGroup2,
            group1Index, group2Index; // for argmin

        // compare distance between each group in activeSet
        for (let i = 0; i < activeSet.length - 1; i++) {
            for (let j = i + 1; j < activeSet.length; j++) {
                let d = averageClusterDistance(activeSet[i], activeSet[j], averageTimes);
                if (d < minDist) {
                    closestGroup1 = activeSet[i];
                    group1Index = i;
                    closestGroup2 = activeSet[j];
                    group2Index = j;
                    minDist = d;
                }
            }
        }

        // Remove individual members (from end of array first)
        if (group1Index > group2Index) {
            activeSet.splice(group1Index, 1);
            activeSet.splice(group2Index, 1);
        } else {
            activeSet.splice(group2Index, 1);
            activeSet.splice(group1Index, 1);
        }

        // Add newly formed composite group containing members just removed
        let setToAdd = closestGroup1.concat(closestGroup2);

        activeSet.push(setToAdd);
    }
    // End clustering

    groups = activeSet;
    // let groups = activeSet;
    // Sort each group so the lowest-numbered order is first
    for (let i = 0; i < groups.length; i++) {
        groups[i].sort();
    }

    // Randomize which group is assigned to which driver.
    groups = shuffle(groups);

    // return groups;
}

// Holds info for each inputted order
class Order {
    constructor(name, address) {
        this.name = name;
        this.address = address;
    }
}

// Called when google maps API loads 
function googleReady() {
    matrixService = new google.maps.DistanceMatrixService();
    directionService = new google.maps.DirectionsService();
    console.log("Delivery Assignment Testing");
    console.log("Distance matrix service ready.");
    console.log("Directions service ready.");
}

// Checks array equality
function arraysMatch(arr1, arr2) {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;
}

// Returns a random integer from min to max inclusively
function uniformRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generates a positive int from a geometric distribution
function randomGeometric(successProbability, randomUniform) {
    successProbability = successProbability || 1 - Math.exp(-1);
    var rate = -Math.log(1 - successProbability);
    return Math.floor(randomExponential(rate, randomUniform));
}

// Generates a positive float from an exponential distribution
function randomExponential(rate, randomUniform) {
    rate = rate || 1;
    var U = randomUniform;
    if (typeof randomUniform === 'function') U = randomUniform();
    if (!U) U = Math.random();
    return -Math.log(U) / rate;
}

// Randomizes an array
function shuffle(arr) {
    var currentIndex = arr.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle
    while (0 !== currentIndex) {

        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Swap it with the current element
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
    }
    return arr;
}

// Adds a new row of input fields on the bottom
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
        inp.addEventListener("keyup", function (event) {
            // Enter key clicks assign button when any input field is selected
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("assign").click();
            }
        });
        din.appendChild(inp);
        d.appendChild(din)
    }

    document.getElementById("fields").appendChild(d);
    currentFields++;
}

// Removes the last row of input fields
function removeField() {
    if (currentFields > 1) {
        let select = document.getElementById('fields');
        select.removeChild(select.lastChild);
        currentFields -= 1;
    }
}

// Distance function for clustering algorithm
function averageClusterDistance(X, Y, M) {
    // X, Y are 1D arrays representing groups; they contain the indices (w/r averageTimes matrix) of the orders in their group
    let n = X.length;
    let m = Y.length;
    let den = n * m;
    let outerSum = 0;
    for (let i = 0; i < n; i++) {
        let innerSum = 0;
        for (let j = 0; j < m; j++) {
            let dist = M[Math.max(X[i], Y[j])][Math.min(X[i], Y[j])];
            innerSum += dist;
        }
        outerSum += innerSum;
    }
    return outerSum / den;
}