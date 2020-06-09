let introFont;

function preload() {
    introFont = loadFont('cmunss.otf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    frameRate(60);
    background(0);
    bodyMass = [1, 1, 1];
    bodySize = Math.round(Math.log(windowWidth + windowHeight + 100));
    // axisRadius = 0.5;
    // axisLength = 20;
    cols = [color(255, 0, 0), color(0, 0, 255), color(255)]
    posVec = [
        createVector(0, 0, 0),
        createVector(0, 0, 0),
        createVector(0, 0, 0)
    ];
    velVec = [
        createVector(0, 0, 0),
        createVector(0, 0, 0),
        createVector(0, 0, 0)
    ];

    posBuffer = [
        createVector(0, 0, 0),
        createVector(0, 0, 0),
        createVector(0, 0, 0)
    ];
    velBuffer = [
        createVector(0, 0, 0),
        createVector(0, 0, 0),
        createVector(0, 0, 0)
    ];

    entered = [false, false, false];
    beginTouch = [0, 0];
    touchAllowed = true;
}

function draw() {
    background(0);
    // Lighting

    if (entered[0] == false) {
        push();
        fill(255);
        // translate(-windowWidth / 2, -windowHeight / 2, 0);
        textAlign(CENTER, CENTER);
        textFont(introFont, 24);
        text("3-body system under gravity:\nTap on three regions.", 0, -40);
        text("v0.2", 0, windowHeight / 2 - 80);
        pop();
    }

    ambientLight(166);
    directionalLight(255, 255, 255, 1, 1, -1);

    posVec = posBuffer;

    if (entered[0] == true && entered[1] == true && entered[2] == true) {
        orbitControl();
        updatePosition(0, accel(posVec[0], posVec[1], posVec[2], bodyMass[1], bodyMass[2]));
        updatePosition(1, accel(posVec[1], posVec[2], posVec[0], bodyMass[2], bodyMass[0]));
        updatePosition(2, accel(posVec[2], posVec[0], posVec[1], bodyMass[0], bodyMass[1]));
        translate(getCentroid());
        drawTriangle(posVec);
    }

    velVec = velBuffer;

    for (let i = 0; i < posVec.length; i++) {
        if (entered[i]) {
            drawBody(posVec[i], cols[i]);
        }
    }
    // drawAxes();
}

function getCentroid() {
    let centroid = p5.Vector.add(p5.Vector.add(posVec[0].mult(bodyMass[0]), posVec[1].mult(bodyMass[1])), posVec[2].mult(bodyMass[2])).mult(-1 / (bodyMass[0] + bodyMass[1] + bodyMass[2]));
    return centroid;
}

function accel(posA, posB, posC, mB, mC) {
    const c1 = -mB / (Math.log(p5.Vector.sub(posA, posB).magSq() - 1) + 0.01);
    const c2 = -mC / (Math.log(p5.Vector.sub(posA, posC).magSq() - 1) + 0.01);
    return p5.Vector.add(p5.Vector.sub(posA, posB).normalize().mult(c1), p5.Vector.sub(posA, posC).normalize().mult(c2));
}

function updatePosition(which, acc) {
    velBuffer[which].add(acc);
    posBuffer[which].add(velVec[which]);
}

function drawBody(v, c) {
    push();
    noStroke();
    translate(v.x, v.y, v.z);
    fill(c);
    sphere(bodySize);
    pop();
}

function drawTriangle(vvv) {

    const surfaceNormal = p5.Vector.cross(p5.Vector.sub(vvv[1], vvv[0]), p5.Vector.sub(vvv[2], vvv[0])).normalize().mult(0.05);
    push();
    noStroke();
    fill(50);
    beginShape();
    for (let i = 0; i < 3; i++) {
        vertex(vvv[i].x - surfaceNormal.x, vvv[i].y - surfaceNormal.y, vvv[i].z - surfaceNormal.z);
    }
    endShape();
    fill(150);
    beginShape();
    for (let i = 0; i < 3; i++) {
        vertex(vvv[i].x + surfaceNormal.x, vvv[i].y + surfaceNormal.y, vvv[i].z + surfaceNormal.z);
    }
    endShape();
    pop();
}

// function touchStarted() {
//     // verifiedTouch = true;
//     // justTouched = false;
// }

function touchEnded() {
    if (touchAllowed) {
        if (!entered[0]) {
            posVec[0] = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2, random(-windowWidth / 6, windowWidth / 6));
            entered[0] = true;
        } else if (!entered[1]) {
            posVec[1] = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2, random(-windowWidth / 6, windowWidth / 6));
            entered[1] = true;
        } else if (!entered[2]) {
            posVec[2] = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2, random(-windowWidth / 6, windowWidth / 6));
            entered[2] = true;
        }
        touchAllowed = false;
        setInterval(resetTouchState, 300);
    }
}

function resetTouchState() {
    touchAllowed = true;
}


// function drawAxes() {
//     push();
//     noStroke();

//     // X-axis
//     push();
//     rotateZ(HALF_PI);
//     ambientMaterial(220, 220, 220);
//     cylinder(axisRadius, axisLength * 24);
//     translate(0, -axisLength * 12, 0);
//     cone(axisRadius * 3, -axisRadius * 9);
//     translate(0, axisLength * 24, 0);
//     cone(axisRadius * 3, axisRadius * 9);
//     pop();

//     // Y-axis (green)
//     push();
//     ambientMaterial(220, 220, 220);
//     cylinder(axisRadius, axisLength * 24);
//     translate(0, -axisLength * 12, 0);
//     cone(axisRadius * 3, -axisRadius * 9);
//     translate(0, axisLength * 24, 0);
//     cone(axisRadius * 3, axisRadius * 9);
//     pop();

//     // Z-axis (blue)
//     push();
//     rotateX(HALF_PI);
//     ambientMaterial(220, 220, 220);
//     cylinder(axisRadius, axisLength * 24);
//     translate(0, -axisLength * 12, 0);
//     cone(axisRadius * 3, -axisRadius * 9);
//     translate(0, axisLength * 24, 0);
//     cone(axisRadius * 3, axisRadius * 9);
//     pop();

//     pop();
// }