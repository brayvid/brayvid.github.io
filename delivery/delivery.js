/*  Title: Delivery Assignment System   
    Purpose: Assigns deliveries that are close together to the same driver if possible.
    Requirements: Google Maps JS API Distance Matrix Service (# of calls per button click = (n+1)^2 where n is # orders)
    Usage policy: (c) 2019 Blake Rayvid. License is granted for non-commerical use only.
    Author: Blake Rayvid (https//github.com/brayvid)    
    
    Issues:
    - What's the best way to determine if two orders are in the same group?
    - What should happen if there are more natural groups than drivers?
    - How to determine and handle out-of-range orders?
    */

var version = "0.3 (beta)",

    defaultFields = 3,
    currentFields = 0,

    numDrivers,
    orders,
    addresses,
    responses,
    averageTimes,
    groups,

    matrixService,

    storeAddress = '116 Macdougal St',
    cityState = "NY NY";

// Holds info for each inputted order
class Order {
    constructor(name, address) {
        this.name = name;
        this.address = address;
    }
}

// Step 1 after button clicked
function compute() {
    // Make table area visible
    $(window).scrollTop(0);

    // get number of drivers from input
    numDrivers = document.getElementById("driverSelect").value;

    // get order IDs and addresses from fields
    orders = [];
    for (let i = 1; i < (currentFields + 1); i++) {
        let nTemp = document.getElementById("n" + i).value;
        let aTemp = document.getElementById("a" + i).value;
        if (nTemp.match(/\S/) && aTemp.match(/\S/)) {
            orders.push(new Order(nTemp, aTemp));
        }
    }

    // Don't process when all fields are empty or only one order present
    if (orders.length == 0 || orders.length == 1) {
        document.getElementById("display").innerHTML = "Enter at least two orders.";
        return;
    }

    // Extract all addresses into a single array (include store address as first entry) for Google
    addresses = [storeAddress + " " + cityState];
    for (let i = 0; i < orders.length; i++) {
        addresses.push(orders[i].address + " " + cityState);
    }

    // Get distance matrix (call Google Maps JS API - each table element is a call for billing purposes)
    matrixService.getDistanceMatrix({
        // origins same as destinations
        origins: addresses,
        destinations: addresses,
        travelMode: 'BICYCLING',
    }, function (response, status) {
        if (status == 'OK') {
            responses = response.rows;
            // Report api usage
            console.log("+" + ((orders.length + 1) * orders.length / 2) + " distance matrix calls.");
            // Proceed to next step
            makeGroups();
        } else {
            document.getElementById("display").innerHTML = "Distance matrix call unsuccessful: " + status;
            return;
        }
    });
}

// Step 2 after button click
function makeGroups() {

    // Consolidate travel times (by bike) into a 2D array, rows = origins, cols = dests.
    let matrixTimes = [];

    averageTimes = [];
    for (let i = 0; i < orders.length + 1; i++) {
        matrixTimes.push([]);
        averageTimes.push([]);
        for (let j = 0; j < orders.length + 1; j++) {
            matrixTimes[i].push(responses[i].elements[j].duration.value);
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

    // Find global min and max of all elements
    let avgMax = 0;
    let avgMin = 999999999;

    for (let i = 1; i < averageTimes.length; i++) {
        for (let j = 1; j < i; j++) {
            if (averageTimes[i][j] >= avgMax) {
                avgMax = averageTimes[i][j];
            }
            if (averageTimes[i][j] <= avgMin) {
                avgMin = averageTimes[i][j];
            }
        }
    }


    // Set maximum time to consider two addresses in the same group (problem #1)
    let timeCutoff;
    if (numDrivers == 2) {
        timeCutoff = avgMin + (avgMax - avgMin) / numDrivers;
    } else {
        timeCutoff = avgMin + (avgMax - avgMin) / 3;

    }


    // Run comparison process to determine groups (problem #2)
    groups = [];
    for (let i = 1; i < averageTimes.length; i++) {
        for (let j = 1; j < i; j++) {
            let diff = averageTimes[i][j] - timeCutoff;
            if (diff <= 0) { // Small time = same group
                // (i,j) are in the same group

                if (groups.length != 0) { // orders have been placed already

                    // Check if either order in the pair has been placed already
                    for (let k = 0; k < groups.length; k++) {
                        if (groups[k].includes(i) && !groups[k].includes(j)) { // first present, add the second
                            groups[k].push(j);
                        } else if (groups[k].includes(j) && !groups[k].includes(i)) { // second present, add the first
                            groups[k].push(i);
                        } else if (!(groups[k].includes(i) || groups[k].includes(j))) { // neither present
                            groups.push([i, j]);
                        }
                    }
                } else { // this is the first pair and their time was under the cutoff so group these two 
                    groups.push([i, j]);
                }
            }
            // (i,j) in different groups, so do nothing else
        }
    }

    // Include any missing orders (i.e. ones not in any other group), each as a new group (needed because of problems #1,2)
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

    // Remove duplicate groups (needed because of problems #1,2)
    for (let i = 0; i < groups.length - 1; i++) {
        for (let j = i + 1; j < groups.length; j++) {
            if (arraysMatch(groups[i], groups[j])) {
                groups.splice(j, 1);
            }
        }
    }

    // // Check average distance between each group and the other groups
    // let distBtwnGroups = new Array(groups.length);
    // for (let i = 0; i < distBtwnGroups.length; i++) {
    //     distBtwnGroups[i] = new Array(groups.length);
    // }
    //
    // for (let i = 0; i < groups.length - 1; i++) {
    //     for (let j = i + 1; j < groups.length; j++) {
    //         let tot = 0;
    //         for (let k = 0; k < groups[i].length; k++) {
    //             for (let l = 0; l < groups[j].length; l++) {
    //                 let rowIndex = groups[i][k];
    //                 let colIndex = groups[j][l];
    //                 if (rowIndex < colIndex) {
    //                     let temp = rowIndex;
    //                     rowIndex = colIndex;
    //                     colIndex = temp;
    //                 }
    //                 tot += averageTimes[rowIndex][colIndex];
    //             }
    //         }
    //         distBtwnGroups[j][i] = tot / (groups[i].length + groups[j].length);
    //     }
    // }
    //
    // // If necessary, consolidate groups (merge the closest groups) until groups.length <= numDrivers
    // let groupsOver = groups.length - numDrivers;
    // let minDist = 9999999999;
    // let included = [];
    // while (groupsOver > 0) {
    //     // go through matrix, find smallest not yet grouped
    //     for (let i = 1; i < distBtwnGroups.length; i++) {
    //         for (let j = 0; j < i; j++) {
    //             if (distBtwnGroups[i][j] < minDist && included.includes(i)) {
    //                 minDist = distBtwnGroups[i][j];
    //             }
    //         }
    //     }
    // }

    // Sort each group so the lowest-numbered order is first
    for (let i = 0; i < groups.length; i++) {
        groups[i].sort();
    }

    // Randomize which group is assigned to which driver.
    groups = shuffle(groups);

    // Proceed to next step
    showTable();
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

    // Table header
    document.getElementById("display").innerHTML = '<table id="displayTable" class="table table-condensed"><tbody id="tablebody"></tbody></table>';
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
                // counter[j]++;
                bodyData.appendChild(bodyText);
            }
            bodyNode.appendChild(bodyData);
        }
        document.getElementById("tablebody").appendChild(bodyNode);
    }
    // Results have been printed to screen, process is complete.

}

// Called when google maps API loads 
function googleReady() {
    matrixService = new google.maps.DistanceMatrixService();
    console.log("Delivery Assignment version " + version);
    console.log("Distance matrix service ready.");
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

// Randomly chooses an integer from 1 to a inclusively (picks an option)
function randomChoice(a) {
    return Math.floor(Math.random() * (a + 1));
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