/**
@title Voyager II escaping the Solar System
@author Blake Rayvid
 */
const WIDTH = 120; // Number of grid units left to right
const DEPTH = 120; // Number of grid units front to back
const SIZE = 25; // Pixels per grid unit
const bodies = ["jupiter", "saturn", "uranus", "neptune", "earth", "voyager2"]; // 
const coords = ["solar_ecliptic", "heliographic_inertial", "heliographic"]; // Not functional yet - keep coord_select = 1 below
const masses = { // x Earth mass
    "sun": 333000.0,
    "jupiter": 317.0,
    "saturn": 95.0,
    "uranus": 14.0,
    "neptune": 17.0,
    "earth": 1.0
};
const colors = {
    "sun": '#ffcc00',
    "jupiter": '#e36e4b',
    "saturn": '#ab604a',
    "uranus": '#89c7c5',
    "neptune": '#3e54e8',
    "earth": '#0099cc'
};
const sizes = { // Diameters
    "sun": 250, // 865370
    "jupiter": 50, // 86881
    "saturn": 41, // 72367
    "uranus": 18, // 31518
    "neptune": 17, // 30599
    "earth": 5 // 7917
};
const planetLevels = { // value of the potential field
    "sun": -30000,
    "jupiter": -5500, // 107 x Neptune
    "saturn": -1765, // 17 ""   ""
    "uranus": -440, // 1.3
    "neptune": -190, // 1.0
    "earth": -5000 // 1.7

}

//Runs once before setup()
function preload() {
    coord_select = 1; // keep set to 1
    tables = {};
    // Load CSV files into tables
    for (let i = 0; i < bodies.length; i++) {
        tables[bodies[i]] = loadTable("data/" + coords[coord_select] + "/" + bodies[i] + "_" + coords[coord_select] + "_coords.csv", "csv", "header");
    }
    // Load assets
    myFont = loadFont('assets/cmunss.otf');
    voyager = loadModel('assets/voyager.stl');
}

// Runs once
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL); // Create 3D-enabled canvas filling entire window
    frameRate(8); //Keep less than 10
    timeUnit = 40; // How many actual days pass each frame
    num_frames = tables[bodies[0]].getRowCount();
    timestep = 1;
    initPos = [0, 0];
    allBodiesXY = {}; // stores where each body is at the current timestep

    // Pre-generate and store the potential surface for the Sun only
    sunPotentialSurface = [];
    for (let y = 0; y < DEPTH + 1; y++) {
        let tempPotentialRow = [];
        for (let x = 0; x < WIDTH + 1; x++) {
            // console.log(x, y);
            tempPotentialRow[x] = sunPotential(x, y);
        }
        sunPotentialSurface.push(tempPotentialRow);
    }

    // Program variables
    mouseIsDown = false;
    xRotation = 0;
    zRotation = 0;
    whereWasMouse = [mouseX, mouseY];
    computeProximity = 30;




}

// Runs at ~FPS set above
function draw() {
    background(0, 20, 50);

    // Locate each body
    for (let i = 0; i < bodies.length; i++) {
        let tempR = tables[bodies[i]].get(timestep, 2);
        let tempTh = tables[bodies[i]].get(timestep, 4);
        allBodiesXY[bodies[i]] = [tempR * cos(PI * tempTh / 180), tempR * sin(PI * tempTh / 180)];
        // planetLevels[bodies[i]] = sunPotentialSurface[round(allBodiesXY[bodies[i][0]])][round(allBodiesXY[bodies[i][1]])];
    }

    // Draw text
    push();
    textFont(myFont);
    fill(255);
    textSize(36);
    textAlign(CENTER);
    translate(100, 200, 800);
    rotateY(-PI);
    rotateX(PI);
    textAlign("CENTER");
    text('VOYAGER 2', 0, 0);
    text(Math.round(1977 + timestep / 365), 58, 50);
    pop();

    // Set up viewport
    frustum(width / 4, -width / 4, -height / 4, height / 4, 400, -400);
    camera(0, 0, 1800, 0, 0, 0, 0, 1, 0);

    // Update viewing angle values whenever mouse is pressed
    if (mouseIsDown) {
        xRotation += (mouseY - whereWasMouse[1]);
        zRotation += (mouseX - whereWasMouse[0]);
        whereWasMouse = [mouseX, mouseY];
    }

    // Set updated viewing angle
    rotateX(constrain(map(xRotation, 0, windowHeight, PI, PI / 2), PI / 3, PI));
    rotateZ(map(zRotation, 0, windowWidth, 0, TWO_PI));
    rotateY(PI);
    translate(-WIDTH * SIZE / 2, -DEPTH * SIZE / 2);

    // Set up light source
    ambientLight(220);
    directionalLight(color(127), -1, 1, -1);

    // Draw potential surface
    push();
    strokeWeight(0.5);
    fill(255, 230);
    for (let y = 0; y < DEPTH; y++) {
        beginShape(TRIANGLE_STRIP);
        for (let x = 0; x < WIDTH + 1; x++) {
            if (xyClearOfBodies(x, y)) { // Use pre-computed sun potential surface for points far enough away from any bodies
                vertex(x * SIZE, y * SIZE, max(sunPotentialSurface[x][y], planetLevels["sun"]));
                vertex(x * SIZE, (y + 1) * SIZE, max(sunPotentialSurface[x][y + 1], planetLevels["sun"]));
            } else { // Compute total potential directly
                let thisPotential = getPotential(x, y, timestep);
                vertex(x * SIZE, y * SIZE, thisPotential);
                vertex(x * SIZE, (y + 1) * SIZE, getPotential(x, y + 1, timestep));
            }
        }
        endShape();
    }
    pop();

    // Display bodies

    //Voyager II
    let voyager_r = parseFloat(tables["voyager2"].get(timestep, 2));
    let voyager_theta = parseFloat(tables["voyager2"].get(timestep, 4));
    let voyager_x = voyager_r * cos(PI * voyager_theta / 180)
    let voyager_y = voyager_r * sin(PI * voyager_theta / 180)
    push();
    fill(50);
    noStroke();
    translate(WIDTH * SIZE / 2 + voyager_x * SIZE, DEPTH * SIZE / 2 + voyager_y * SIZE, getPotential(voyager_x + WIDTH / 2, voyager_y + DEPTH / 2, timestep));
    rotateX(timestep * 0.01);
    rotateY(PI / 2);
    // rotateY(PI / 2);
    rotateZ(PI / 4);
    // rotateZ(timestep * 0.01);
    scale(1);
    model(voyager, true);
    pop();

    // Sun
    push();
    noStroke();
    translate(SIZE * WIDTH / 2, SIZE * DEPTH / 2, planetLevels["sun"]);
    fill(colors["sun"]);
    sphere(sizes["sun"]);
    pop();

    //  Jupiter
    displaySphere("jupiter");
    //  Saturn
    displaySphere("saturn");
    //  Uranus
    displaySphere("uranus");
    // Neptune
    displaySphere("neptune");
    // Earth
    displaySphere("earth");

    // Stop animation at end of sequence
    if (timestep > num_frames - 41) {
        noLoop();
        console.log("Finished.")
    }
    // Increment timestep at end of each loop
    timestep += timeUnit;
}

// Computes gravitational potential at (x,y) at timestep t: https://en.wikipedia.org/wiki/Gravitational_potential
function getPotential(x, y, t) {
    let total_potential = 0;
    for (let i = 0; i < bodies.length - 1; i++) {
        // console.log(bodies[i])
        let r = parseFloat(tables[bodies[i]].get(t, 2));
        let theta = parseFloat(tables[bodies[i]].get(t, 4));
        let body_x = r * cos(PI * theta / 180);
        let body_y = r * sin(PI * theta / 180);
        total_potential += -masses[bodies[i]] / (Math.pow(x - body_x - WIDTH / 2, 2) + Math.pow(y - body_y - DEPTH / 2, 2) + 0.01);
    }

    sun_potential = -masses["sun"] / (Math.pow(x - WIDTH / 2, 2) + Math.pow(y - DEPTH / 2, 2));
    total_potential += sun_potential;
    // console.log("potential=" + total_potential);
    return 0.5 * total_potential;
}

// Computes potential at (x,y) due to Sun only
function sunPotential(x, y) {
    return -0.5 * masses["sun"] / (Math.pow(x - WIDTH / 2, 2) + Math.pow(y - DEPTH / 2, 2));
}

// Return true if the passed coordinate is not currently near any bodies
function xyClearOfBodies(x, y) {
    for (let i = 0; i < bodies.length; i++) {
        if (Math.pow(x - allBodiesXY[bodies[i]][0] - WIDTH / 2, 2) + Math.pow(y - allBodiesXY[bodies[i]][1] - DEPTH / 2, 2) < computeProximity) {
            // console.log("false");
            return false;
        }
    }
    // console.log("true");
    return true;
}

// Called once when mouse is depressed
function mousePressed() {
    mouseIsDown = true;
    whereWasMouse = [mouseX, mouseY];
    return false;
}

// Called once when mouse released
function mouseReleased() {
    mouseIsDown = false;
    return false;
}

// Called whenever window size changes
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Draw specified body
function displaySphere(obj) {

    let r = parseFloat(tables[obj].get(timestep, 2));
    // if (obj == "earth") {
    //     r *= 3;
    // }
    let theta = parseFloat(tables[obj].get(timestep, 4));
    let x = r * cos(PI * theta / 180)
    let y = r * sin(PI * theta / 180)
    push();
    fill(colors[obj]);
    noStroke();
    translate(WIDTH * SIZE / 2 + x * SIZE, DEPTH * SIZE / 2 + y * SIZE, planetLevels[obj]);
    sphere(sizes[obj]);
    pop();
}