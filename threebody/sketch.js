let introFont;

// --- CUSTOM FORCE LAW ---
function accel(posA, posB, posC, mB, mC) {
    const c1 = -mB / (Math.log(p5.Vector.sub(posA, posB).magSq() + 1) + 0.01);
    const c2 = -mC / (Math.log(p5.Vector.sub(posA, posC).magSq() + 1) + 0.01);
    return p5.Vector.add(p5.Vector.sub(posA, posB).normalize().mult(c1), p5.Vector.sub(posA, posC).normalize().mult(c2));
}

// --- Global Variables ---
let bodyMass, bodySize, cols, trailCols;
let posVec, velVec;
let posHistory;
let entered, touchAllowed, maxTrailLength;

function preload() {
    introFont = loadFont('assets/cmunss.otf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    frameRate(60);
    bodyMass = [1, 1, 1];
    bodySize = Math.round(Math.log(windowWidth + windowHeight + 1000));
    cols = [color(81, 119, 166), color(70, 133, 62), color(220, 110, 121)];
    trailCols = [
        [81, 119, 166, 0],
        [70, 133, 62, 0],
        [220, 110, 121, 0]
    ];
    posVec = [createVector(0, 0, 0), createVector(0, 0, 0), createVector(0, 0, 0)];
    velVec = [createVector(0, 0, 0), createVector(0, 0, 0), createVector(0, 0, 0)];
    posHistory = [];
    entered = [false, false, false];
    touchAllowed = true;
    maxTrailLength = 64;
    background(0);
}

function draw() {
    background(0);
    ambientLight(166);
    directionalLight(255, 255, 255, 1, 1, -1);

    const simulationActive = entered[0] && entered[1] && entered[2];

    if (simulationActive) {
        // --- SIMULATION IS ACTIVE ---
        // 1. Update Physics State
        const accelerations = [
            accel(posVec[0], posVec[1], posVec[2], bodyMass[1], bodyMass[2]),
            accel(posVec[1], posVec[2], posVec[0], bodyMass[2], bodyMass[0]),
            accel(posVec[2], posVec[0], posVec[1], bodyMass[0], bodyMass[1])
        ];
        for (let i = 0; i < 3; i++) {
            velVec[i].add(accelerations[i]);
            posVec[i].add(velVec[i]);
        }
        posHistory.push(posVec.map(p => p.copy()));
        if (posHistory.length > maxTrailLength) {
            posHistory.shift();
        }

        // 2. Set up Camera
        const centr = getCentroid();
        translate(centr);

        // 3. Draw Everything in the Centered View
        for (let i = 0; i < 3; i++) {
            drawTrail(i);
            drawBody(posVec[i], cols[i]);
        }

    } else {
        // --- WAITING FOR ALL BODIES ---
        // Show intro text if no bodies have been placed yet
        if (!entered[0]) {
            push();
            fill(255);
            textAlign(CENTER, CENTER);
            textFont(introFont, 24);
            text("3-body system under gravity:\nTap on three places to choose\nan initial position for each body.\nAll start at rest.", 0, -40);
            text("v0.7", 0, windowHeight / 2 - 80);
            pop();
        }

        // Draw whichever bodies have already been placed
        for (let i = 0; i < 3; i++) {
            if (entered[i]) {
                drawBody(posVec[i], cols[i]);
            }
        }
    }
}

function drawTrail(bod) {
    noStroke();
    for (let j = 0; j < posHistory.length; j++) {
        const p = posHistory[j][bod];
        const alpha = map(j, 0, posHistory.length - 1, 0, 200);
        fill(trailCols[bod][0], trailCols[bod][1], trailCols[bod][2], alpha);
        push();
        translate(p.x, p.y, p.z);
        sphere(2);
        pop();
    }
}

function getCentroid() {
    let weightedSum = createVector(0, 0, 0);
    let totalMass = 0;
    for (let i = 0; i < posVec.length; i++) {
        weightedSum.add(p5.Vector.mult(posVec[i], bodyMass[i]));
        totalMass += bodyMass[i];
    }
    return weightedSum.div(-totalMass);
}

function drawBody(v, c) {
    push();
    noStroke();
    translate(v.x, v.y, v.z);
    fill(c);
    sphere(bodySize);
    pop();
}

function touchEnded() {
    if (touchAllowed) {
        const zPos = random(-windowHeight / 4, windowHeight / 4);
        if (!entered[0]) {
            posVec[0] = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2, zPos);
            entered[0] = true;
        } else if (!entered[1]) {
            posVec[1] = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2, zPos);
            entered[1] = true;
        } else if (!entered[2]) {
            posVec[2] = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2, zPos);
            entered[2] = true;
        }
        touchAllowed = false;
        setTimeout(() => {
            touchAllowed = true;
        }, 300);
    }
}