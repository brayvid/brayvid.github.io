const WIDTH = 120;
const DEPTH = 120;
const SIZE = 25;
const bodies = ["jupiter", "saturn", "neptune", "uranus", "earth", "voyager2"];
const coords = ["solar_ecliptic", "heliographic_inertial", "heliographic"];
const masses = {
    "sun": 5000,
    "jupiter": 317.0,
    "saturn": 95.0,
    "neptune": 17.0,
    "uranus": 14.0,
    "earth": 1.0
}

let timestep = 1;
// let surface;

function preload() {
    tables = {};
    coord_select = 1;

    for (let i = 0; i < 6; i++) {
        tables[bodies[i]] = loadTable("data/" + coords[coord_select] + "/" + bodies[i] + "_" + coords[coord_select] + "_coords.csv", "csv", "header");
    }
    myFont = loadFont('assets/cmunss.otf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    frameRate(10);
    num_frames = tables["voyager2"].getRowCount();
    // noLoop();
}

function draw() {
    background(0, 20, 50);
    textFont(myFont);
    textSize(36);
    push();
    translate(-85, -200, 400);
    textAlign("CENTER");
    text('VOYAGER II', 0, 0);
    text(Math.round(1977 + timestep / 365), 58, 50);
    pop();
    rotateX(PI * 0.4);
    translate(-WIDTH * SIZE / 2, -DEPTH * SIZE / 2);
    // orbitControl();
    // getPotential();
    // ambientMaterial(20, 60, 40);
    // ambientLight(63);
    // directionalLight(color(127), -1, 1, -1);
    // fill(20, 60, 40);
    stroke(20);
    for (let y = 0; y < DEPTH; ++y) {
        beginShape(TRIANGLE_STRIP);
        for (let x = 0; x < WIDTH + 1; ++x) {
            vertex(x * SIZE, y * SIZE, 0.1 * getPotential(x, y, timestep));
            vertex(x * SIZE, (y + 1) * SIZE, 0.1 * getPotential(x, y + 1, timestep));
        }
        endShape();
    }
    let voyager_r = parseFloat(tables["voyager2"].get(timestep, 2));
    let voyager_theta = parseFloat(tables["voyager2"].get(timestep, 4));
    let voyager_x = voyager_r * cos(PI * voyager_theta / 180);
    let voyager_y = voyager_r * sin(PI * voyager_theta / 180);
    push();
    fill(255, 0, 0);
    translate(WIDTH * SIZE / 2 + voyager_x * SIZE, DEPTH * SIZE / 2 + voyager_y * SIZE, getPotential(voyager_x, voyager_y, timestep))
    sphere(3);
    pop();

    if (timestep > num_frames - 29) {
        noLoop();
        console.log("Finished.")
    }
    timestep += 28;
}

function getPotential(x, y, t) {
    let total_potential = 0;
    for (let i = 0; i < bodies.length - 1; i++) {
        // console.log(bodies[i])
        let r = parseFloat(tables[bodies[i]].get(t, 2));
        let theta = parseFloat(tables[bodies[i]].get(t, 4));
        let body_x = r * cos(PI * theta / 180);
        let body_y = r * sin(PI * theta / 180);
        total_potential += -masses[bodies[i]] / (Math.pow(x - body_x - WIDTH / 2, 2) + Math.pow(y - body_y - DEPTH / 2, 2));;
        // console.log("r=" + r);
        // console.log("th=" + theta);
        // console.log("body_x=" + body_x);
        // console.log("body_y" + body_y)
    }

    sun_potential = -masses["sun"] / (Math.pow(x - WIDTH / 2, 2) + Math.pow(y - DEPTH / 2, 2));
    total_potential += sun_potential;
    // console.log("potential=" + total_potential);
    return total_potential;
}