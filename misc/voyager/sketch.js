const WIDTH = 120;
const DEPTH = 120;
const SIZE = 25;
const bodies = ["jupiter", "saturn", "neptune", "uranus", "earth", "voyager2"];
const coords = ["solar_ecliptic", "heliographic_inertial", "heliographic"];
const masses = {
    "sun": 333000,
    "jupiter": 317.0,
    "saturn": 95.0,
    "neptune": 17.0,
    "uranus": 14.0,
    "earth": 1.0
}

function preload() {
    tables = {};
    coord_select = 1;

    for (let i = 0; i < 6; i++) {
        tables[bodies[i]] = loadTable("data/" + coords[coord_select] + "/" + bodies[i] + "_" + coords[coord_select] + "_coords.csv", "csv", "header");
    }
    myFont = loadFont('assets/cmunss.otf');
    voyager = loadModel('assets/voyager.stl');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    frameRate(10);
    // setAttributes('antialias', true);
    // frustum(-500, 500, -500, 500, 500, 5000);

    num_frames = tables["voyager2"].getRowCount();
    timestep = 1;
    initPos = [0, 0];
    // rotateX(map(mouseY, 0, windowHeight, 0, PI * 0.55));
    // rotateZ(map(mouseX, 0, windowWidth, PI, 0));
    // voyager_grid_pos;
}

function draw() {
    background(0, 20, 50);
    // push();
    // textFont(myFont);
    // fill(255);
    // textSize(36);
    // translate(-85, -200, 800);
    // textAlign("CENTER");
    // text('VOYAGER 2', 0, 0);
    // text(Math.round(1977 + timestep / 365), 58, 50);
    // pop();

    frustum(width / 4, -width / 4, -height / 4, height / 4, 400, -400);
    camera(0, 0, 1800, 0, 0, 0, 0, 1, 0);
    rotateX(constrain(map(mouseY, 0, windowHeight, 5 * PI / 4, PI / 2), PI / 1.8, PI));
    rotateZ(map(mouseX, 0, windowWidth, 0, TWO_PI));
    rotateY(PI)
    // if (mouseIsPressed) {
    //     rotateX(map(initPos[1] - mouseY, 0, windowHeight, PI * 0.49, 0));
    //     rotateZ(map(initPos[0] - mouseX, 0, windowWidth, TWO_PI, 0));
    //     initPos = [mouseX, mouseY];
    // }
    translate(-WIDTH * SIZE / 2, -DEPTH * SIZE / 2);

    // orbitControl();
    // getPotential();
    // ambientMaterial(20, 60, 40);
    // ambientLight(63);
    // directionalLight(color(127), -1, 1, -1);
    // fill(20, 60, 40);

    for (let y = 0; y < DEPTH; ++y) {
        beginShape(TRIANGLE_STRIP);
        for (let x = 0; x < WIDTH + 1; ++x) {
            let thisPotential = getPotential(x, y, timestep);
            stroke

            vertex(x * SIZE, y * SIZE, thisPotential);
            vertex(x * SIZE, (y + 1) * SIZE, getPotential(x, y + 1, timestep));
        }
        endShape();
    }
    let voyager_r = parseFloat(tables["voyager2"].get(timestep, 2));
    let voyager_theta = parseFloat(tables["voyager2"].get(timestep, 4));
    let voyager_x = voyager_r * cos(PI * voyager_theta / 180)
    let voyager_y = voyager_r * sin(PI * voyager_theta / 180)
    // voyager_grid_pos =
    push();
    fill(0);
    noStroke();
    // specularMaterial(255, 0, 0);
    // translate(WIDTH * SIZE / 2 + voyager_x * SIZE, DEPTH * SIZE / 2 + voyager_y * SIZE, getPotential(voyager_x, voyager_y, timestep));
    translate(WIDTH * SIZE / 2 + voyager_x * SIZE, DEPTH * SIZE / 2 + voyager_y * SIZE, getPotential(voyager_x + WIDTH / 2, voyager_y + DEPTH / 2, timestep));
    rotateX(-PI / 2);
    // rotateY(PI / 2);
    rotateZ(-3 * PI / 2);
    // rotateZ(timestep * 0.01);
    scale(1); // Scaled to make model fit into canvas
    model(voyager, true);
    pop();

    // Sun
    push();
    stroke(1);
    translate(SIZE * WIDTH / 2, SIZE * DEPTH / 2, -6550);
    fill('#ffcc00');
    sphere(150);
    pop();

    // Jupiter
    let jupiter_r = parseFloat(tables["jupiter"].get(timestep, 2));
    let jupiter_theta = parseFloat(tables["jupiter"].get(timestep, 4));
    let jupiter_x = jupiter_r * cos(PI * jupiter_theta / 180)
    let jupiter_y = jupiter_r * sin(PI * jupiter_theta / 180)
    // voyager_grid_pos =
    push();
    fill('#e36e4b');
    noStroke();
    // normalMaterial();
    // translate(WIDTH * SIZE / 2 + voyager_x * SIZE, DEPTH * SIZE / 2 + voyager_y * SIZE, getPotential(voyager_x, voyager_y, timestep));
    translate(WIDTH * SIZE / 2 + jupiter_x * SIZE, DEPTH * SIZE / 2 + jupiter_y * SIZE, -5500);
    // rotateX(PI);
    // rotateY(PI);
    // rotateZ(timestep * 0.01);
    // scale(0.4); // Scaled to make model fit into canvas
    sphere(35);
    pop();


    // Saturn
    let saturn_r = parseFloat(tables["saturn"].get(timestep, 2));
    let saturn_theta = parseFloat(tables["saturn"].get(timestep, 4));
    let saturn_x = saturn_r * cos(PI * saturn_theta / 180)
    let saturn_y = saturn_r * sin(PI * saturn_theta / 180)
    // voyager_grid_pos =
    push();
    fill('#ab604a');
    noStroke();
    // normalMaterial();
    // translate(WIDTH * SIZE / 2 + voyager_x * SIZE, DEPTH * SIZE / 2 + voyager_y * SIZE, getPotential(voyager_x, voyager_y, timestep));
    translate(WIDTH * SIZE / 2 + saturn_x * SIZE, DEPTH * SIZE / 2 + saturn_y * SIZE, -1765);
    // rotateX(PI);
    // rotateY(PI);
    // rotateZ(timestep * 0.01);
    // scale(0.4); // Scaled to make model fit into canvas
    sphere(15);
    pop();


    // Uranus
    let uranus_r = parseFloat(tables["uranus"].get(timestep, 2));
    let uranus_theta = parseFloat(tables["uranus"].get(timestep, 4));
    let uranus_x = uranus_r * cos(PI * uranus_theta / 180)
    let uranus_y = uranus_r * sin(PI * uranus_theta / 180)
    // voyager_grid_pos =
    push();
    fill('#89c7c5');
    noStroke();
    // normalMaterial();
    // translate(WIDTH * SIZE / 2 + voyager_x * SIZE, DEPTH * SIZE / 2 + voyager_y * SIZE, getPotential(voyager_x, voyager_y, timestep));
    translate(WIDTH * SIZE / 2 + uranus_x * SIZE, DEPTH * SIZE / 2 + uranus_y * SIZE, -440);
    // rotateX(PI);
    // rotateY(PI);
    // rotateZ(timestep * 0.01);
    // scale(0.4); // Scaled to make model fit into canvas
    sphere(12);
    pop();

    // Neptune
    let neptune_r = parseFloat(tables["neptune"].get(timestep, 2));
    let neptune_theta = parseFloat(tables["neptune"].get(timestep, 4));
    let neptune_x = neptune_r * cos(PI * neptune_theta / 180)
    let neptune_y = neptune_r * sin(PI * neptune_theta / 180)
    // voyager_grid_pos =
    push();
    fill('#3e54e8');
    noStroke();
    // normalMaterial();
    // translate(WIDTH * SIZE / 2 + voyager_x * SIZE, DEPTH * SIZE / 2 + voyager_y * SIZE, getPotential(voyager_x, voyager_y, timestep));
    translate(WIDTH * SIZE / 2 + neptune_x * SIZE, DEPTH * SIZE / 2 + neptune_y * SIZE, -190);
    rotateX(PI);
    rotateY(PI);
    // rotateZ(timestep * 0.01);
    // scale(0.4); // Scaled to make model fit into canvas
    sphere(12);
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
    return 0.5 * total_potential;
}

function mouseClicked() {
    initPos = [mouseX, mouseY];
    return false;
}