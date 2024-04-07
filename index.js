const left = document.getElementById('left');
const right = document.getElementById('right');
const ctx = right.getContext("2d");

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

    // TEST (use dummy img instead of generated img)
    applyTransformations("./dummy.png");

    // // get dalle img
    // fetch("https://api.openai.com/v1/images/generations", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${key}`
    //     },
    //     body: JSON.stringify({
    //         prompt: prompt,
    //         n: 1
    //     })
    // })
    //     .then(res => res.json())
    //     .then(json => {
    //         const url = json.data[0].url
    //         applyTransformations(url);
    //     })
});

/**
 * This function applys graphical transformations to the right canvas based on given url image
 * @param {String} url String url to img
 */
function applyTransformations(url) {
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0, right.width, right.height);
    };
    img.src = url;
}