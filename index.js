const left = document.getElementById('left');
const right = document.getElementById('right');
const context = right.getContext("2d");
const lcontext = left.getContext("2d");

let width;
let height;
let lwidth;
let lheight;

// set the number of canvas, scaled for screen resolution
// let pxScale = window.devicePixelRatio;
let pxScale = 2;

const pixelColors = [];
let generatedImg;

// get api key
let key = null;
fetch(".env")
    .then(response => response.text())
    .then(text => {
        key = text;
    });

// button click: get dalle image
document.getElementById("generate").addEventListener("click", () => {
    if (key === null) {
        console.log("Error: API key not found");
        return;
    }

    // get img prompt
    const prompt = document.getElementById("input").value;
    // if (prompt === "") {
    //     console.log("Cannot have empty prompt")
    //     return;
    // }

    // //get dalle img
    // fetch("https://api.openai.com/v1/images/generations", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${key}`
    //     },
    //     body: JSON.stringify({
    //         prompt: prompt,
    //         n: 1,
    //         "response_format": "b64_json"
    //     })
    // })
    //     .then(res => res.json())
    //     .then(json => {
    //         const bin = json.data[0].b64_json

    //         const img = new Image();
    //         img.onload = function() {
    //             generatedImg = img;
    //             getColors();
    //         };
    //         img.src = 'data:image/png;base64,' + bin;
    //     })

    // TEST
    const img = new Image();
    img.onload = function() {
        generatedImg = img;
        getColors();
    };
    img.src = "./dummy.png";
});

function setup() {
    // set up dimensions for left canvas drawing
    lwidth = left.getBoundingClientRect().width;
    lheight = left.getBoundingClientRect().height;

    left.width = lwidth * pxScale;
    left.height = lheight * pxScale;

    // set up dimensions for right canvas drawing
    width = right.getBoundingClientRect().width;
    height = right.getBoundingClientRect().height;

    right.width = width * pxScale;
    right.height = height * pxScale;

    // normalize the coordinate system
    lcontext.scale(pxScale, pxScale);
    context.scale(pxScale, pxScale);

    // create a grid of squares inside left canvas
    const scale = 40;

    for (let i = 0; i < left.width; i++) {
        for (let j = 0; j < left.height; j++) {
            // draw grid of circles
            lcontext.save();
            lcontext.beginPath();
            lcontext.rect(
                i * scale / pxScale, j * scale / pxScale, 
                (scale - 1) / pxScale, (scale - 1) / pxScale);
            lcontext.fill();
            lcontext.restore();
        }
    }
}

/**
 * This function samples colors from generated image and displays them in the right canvas
 */
function getColors() {
    context.drawImage(generatedImg, 0, 0, 45, 30);

    // sampling image data
    let imageData = context.getImageData(0, 0, right.width / 40, right.height / 40);
    let data = imageData.data;

    context.clearRect(0, 0, width, height);

    for (let channel = 0; channel < data.length; channel += 4) {
        let color = `rgba(${data[channel]}, ${data[channel + 1]}, ${data[channel + 2]}, ${data[channel + 3]})`;
        pixelColors.push(color);
    }

    draw();
}

/**
 * This function displays visual data on the right canvas via the pixelColors global array
 */
function draw() {
    // create a grid of squares inside right canvas
    const scale = 40;

    for (let i = 0; i < right.width; i++) {
        for (let j = 0; j < right.height; j++) {
            if (pixelColors.length !== 0) {
                let color = pixelColors[Math.floor(Math.random() * pixelColors.length)];
                context.fillStyle = color;
            }

            context.save();
            context.beginPath();
            context.rect(
                i * scale / pxScale, j * scale / pxScale, 
                (scale - 1) / pxScale, (scale - 1) / pxScale);
            context.fill();
            context.restore();
        }
    }

    // redraw img on right canvas
    if (generatedImg) {
        console.log(generatedImg); // TEST
        context.drawImage(generatedImg, 
            width / 4, height / 4, 
            width / 2, height / 2);
    }
}

// wait for the DOM to load, including dependent resources
window.addEventListener('load', () => {
    setup();
    draw();
});

window.addEventListener('resize', () => {
    setup();
    draw();
});