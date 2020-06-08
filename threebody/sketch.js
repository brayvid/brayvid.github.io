function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    frameRate(60);
    background(0);
    mass = [100, 100, 100];
    cylinderRadius = 0.5;
    coordLen = 20;
    size = 10;
    cols = [color(255, 0, 0), color(255), color(0, 0, 255)]
    posVec = [
        createVector(0, 0, 0),
        createVector(0, 0, 0),
        createVector(0, 0, 0)
    ];
    velVec = [
        createVector(0, 0, 0),
        createVector(0, 0, 0),
        createVector(0, 0, 0)
    ]

    posBuffer = [
        createVector(0, 0, 0),
        createVector(0, 0, 0),
        createVector(0, 0, 0)
    ];
    velBuffer = [
        createVector(0, 0, 0),
        createVector(0, 0, 0),
        createVector(0, 0, 0)
    ]

    entered = [false, false, false];
    beginTouch = [0, 0];
}

function draw() {
    background(0);
    // Lighting
    ambientLight(166);
    directionalLight(255, 255, 255, 1, 1, -1);

    // orbitControl();

    // posVec = posBuffer;

    if (entered[0] == true && entered[1] == true && entered[2] == true) {
        orbitControl();
        updatePosition(0, accel(posVec[0], posVec[1], posVec[2], mass[1], mass[2]));
        updatePosition(1, accel(posVec[1], posVec[2], posVec[0], mass[2], mass[0]));
        updatePosition(2, accel(posVec[2], posVec[0], posVec[1], mass[0], mass[1]));
        drawTriangle(posVec);
    }


    velVec = velBuffer;
    posVec = posBuffer;

    for (let i = 0; i < posVec.length; i++) {
        if (entered[i]) {
            drawVector(posVec[i], cols[i]);
        }
        // console.log(posVec[i].x);
    }

    // console.log(posVec[0].x);

    drawAxes();
}

function accel(posA, posB, posC, mB, mC) {
    const c1 = -mB / p5.Vector.sub(posA, posB).magSq();
    const c2 = -mC / p5.Vector.sub(posA, posC).magSq();
    return p5.Vector.add(p5.Vector.sub(posA, posB).normalize().mult(c1), p5.Vector.sub(posA, posC).normalize().mult(c2));
}

function updatePosition(which, acc) {
    velBuffer[which].add(acc);
    posBuffer[which].add(velVec[which]);
}

function drawVector(v, c) {
    push();
    // Stroke
    // stroke(c);
    // beginShape();
    // vertex(0, 0, 0);
    // vertex(v.x, v.y, v.z);
    // endShape();

    // Sphere
    noStroke();
    translate(v.x, v.y, v.z);
    fill(c);
    sphere(size);
    pop();
}

function drawTriangle(vvv) {
    push();
    noStroke();
    fill(100);
    beginShape();
    for (let i = 0; i < 3; i++) {
        vertex(vvv[i].x, vvv[i].y, vvv[i].z);
    }
    endShape();
    pop();
}


// function mousePressed() {
//     beginTouch = [mouseX, mouseY];
//     console.log();
// }

function mouseClicked() {
    if (!entered[0]) {
        posVec[0] = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2, random(-windowWidth / 4, windowWidth / 4));
        entered[0] = true;
    } else if (!entered[1]) {
        posVec[1] = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2, random(-windowWidth / 4, windowWidth / 4));
        entered[1] = true;
    } else if (!entered[2]) {
        posVec[2] = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2, random(-windowWidth / 4, windowWidth / 4));
        entered[2] = true;
        // orbitControl();
    }
    // } else {
    //     posVec[0] = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2, random(-windowWidth / 10, windowWidth / 10));
    //     entered = [true, false, false];
    // }
}


function drawAxes() {
    push();
    noStroke();

    // X-axis
    push();
    rotateZ(HALF_PI);
    ambientMaterial(220, 220, 220);
    cylinder(cylinderRadius, coordLen * 24);
    translate(0, -coordLen * 12, 0);
    cone(cylinderRadius * 3, -cylinderRadius * 9);
    translate(0, coordLen * 24, 0);
    cone(cylinderRadius * 3, cylinderRadius * 9);
    pop();

    // Y-axis (green)
    push();
    ambientMaterial(220, 220, 220);
    cylinder(cylinderRadius, coordLen * 24);
    translate(0, -coordLen * 12, 0);
    cone(cylinderRadius * 3, -cylinderRadius * 9);
    translate(0, coordLen * 24, 0);
    cone(cylinderRadius * 3, cylinderRadius * 9);
    pop();

    // Z-axis (blue)
    push();
    rotateX(HALF_PI);
    ambientMaterial(220, 220, 220);
    cylinder(cylinderRadius, coordLen * 24);
    translate(0, -coordLen * 12, 0);
    cone(cylinderRadius * 3, -cylinderRadius * 9);
    translate(0, coordLen * 24, 0);
    cone(cylinderRadius * 3, cylinderRadius * 9);
    pop();

    pop();
}