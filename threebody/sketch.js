let introFont;

function preload() {
    introFont = loadFont('assets/cmunss.otf');
    // img1 = loadImage('assets/img1.jpg');
    // img2 = loadImage('assets/img2.jpg');

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
    ]
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

    posHistory = [];
    centroidHistory = [];

    entered = [false, false, false];
    touchAllowed = true;
    maxTrailLength = 32;
    // textureMode(IMAGE);
    // textureWrap(REPEAT);
    background(0);
}

function draw() {
    background(0);
    if (entered[0] == false) {
        push();
        fill(255);
        textAlign(CENTER, CENTER);
        textFont(introFont, 24);
        text("3-body system under gravity:\nTap on three places to choose\nan initial position for each body.\nAll start at rest.", 0, -40);
        text("v0.4", 0, windowHeight / 2 - 80);
        pop();
    }

    ambientLight(166);
    directionalLight(255, 255, 255, 1, 1, -1);

    posVec = posBuffer;

    if (entered[0] == true && entered[1] == true && entered[2] == true) {
        // orbitControl();
        updatePosition(0, accel(posVec[0], posVec[1], posVec[2], bodyMass[1], bodyMass[2]));
        updatePosition(1, accel(posVec[1], posVec[2], posVec[0], bodyMass[2], bodyMass[0]));
        updatePosition(2, accel(posVec[2], posVec[0], posVec[1], bodyMass[0], bodyMass[1]));
        let centr = getCentroid();
        let pos = [];
        for (let i = 0; i < posVec.length; i++) {
            pos.push(p5.Vector.add(posVec[i], centr));
        }

        centroidHistory.push(centr);
        posHistory.push(pos);

        if (posHistory.length >= maxTrailLength) {
            posHistory.splice(0, 1);
        }

        if (posHistory.length > 2) {
            // drawTriangle(posVec);
            for (let i = 0; i < posVec.length; i++) {
                drawTrail(i);
            }
        }
        translate(centr);
    }

    velVec = velBuffer;

    for (let i = 0; i < posVec.length; i++) {
        if (entered[i]) {
            drawBody(posVec[i], cols[i]);

        }
    }
}

function drawTrail(bod) {
    push();
    noStroke();
    let current = posHistory[posHistory.length - 1][bod];
    translate(current.x, current.y, current.z);
    let stepsBack = 0;
    let diff;
    let alph;
    for (let j = posHistory.length - 2; j >= 0; j--) {
        diff = p5.Vector.sub(posHistory[j][bod], posHistory[j + 1][bod]);
        alph = round(map(stepsBack, 0, maxTrailLength, 200, 0, true));
        translate(diff.x, diff.y, -diff.z);
        trailCols[bod][3] = alph;
        fill(trailCols[bod][0], trailCols[bod][1], trailCols[bod][2], trailCols[bod][3]);
        sphere(1);
        stepsBack++;
    }
    pop();
}

function getCentroid() {
    let centroid = p5.Vector.add(p5.Vector.add(posVec[0].mult(bodyMass[0]), posVec[1].mult(bodyMass[1])), posVec[2].mult(bodyMass[2])).mult(-1 / (bodyMass[0] + bodyMass[1] + bodyMass[2]));
    return centroid;
}

function accel(posA, posB, posC, mB, mC) {
    const c1 = -mB / (Math.log(p5.Vector.sub(posA, posB).magSq() + 1) + 0.01);
    const c2 = -mC / (Math.log(p5.Vector.sub(posA, posC).magSq() + 1) + 0.01);
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

// function drawTriangle(vvv) {
//     const surfaceNormal = p5.Vector.cross(p5.Vector.sub(vvv[1], vvv[0]), p5.Vector.sub(vvv[2], vvv[0])).normalize().mult(0.05);
//     push();
//     texture(img1);
//     beginShape();
//     for (let i = 0; i < 3; i++) {
//         vertex(vvv[i].x - surfaceNormal.x, vvv[i].y - surfaceNormal.y, vvv[i].z - surfaceNormal.z);
//     }
//     endShape();
//     texture(img2);
//     beginShape();
//     for (let i = 0; i < 3; i++) {
//         vertex(vvv[i].x + surfaceNormal.x, vvv[i].y + surfaceNormal.y, vvv[i].z + surfaceNormal.z);
//     }
//     endShape();
//     pop();
// }

function touchEnded() {
    if (touchAllowed) {
        if (!entered[0]) {
            posVec[0] = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2, random(-windowHeight / 4, windowHeight / 4));
            console.log("Body 1: [" + posVec[0].x + ", " + posVec[0].y + ", " + posVec[0].z + "]");
            entered[0] = true;
        } else if (!entered[1]) {
            posVec[1] = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2, random(-windowHeight / 4, windowHeight / 4));
            console.log("Body 2: [" + posVec[1].x + ", " + posVec[1].y + ", " + posVec[1].z + "]");
            entered[1] = true;
        } else if (!entered[2]) {
            posVec[2] = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2, random(-windowHeight / 4, windowHeight / 4));
            console.log("Body 3: [" + posVec[2].x + ", " + posVec[2].y + ", " + posVec[2].z + "]");
            entered[2] = true;
        }
        touchAllowed = false;
        setInterval(resetTouchState, 300);
    }
}

function resetTouchState() {
    touchAllowed = true;
}