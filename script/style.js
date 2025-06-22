
const gradients = [
    "--gradient-macha",
    "--gradient-orange-crush",
    "--gradient-lipstick",
    "--gradient-purple-haze",
    "--gradient-skyfall",
    "--gradient-emerald-city",
    "--gradient-summer-fair"
];

const letterColors = [
    "--color-shockingly-green",
    "--color-surface-white",
    "--color-pink",
    "--color-shockingly-pink",
    "--color-orangey",
    "--color-lilac",
    "--color-lt-green",
    "--color-blue",
    "--grey-dark",
    "--light",
    "--green",
    "--green-dark",
    "--green-light",
    "--blue",
    "--purple",
    "--red",
    "--orange"
];

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getCSSVarValue(v) {
    return getComputedStyle(document.body).getPropertyValue(v).trim();
}

function randomizeVisuals() {
    const poster = document.getElementById('bkg');

    const gradientValue = getCSSVarValue(getRandomItem(gradients));
    const colorValue = getCSSVarValue(getRandomItem(letterColors));
    if (poster) {
        poster.style.background = gradientValue;
        poster.style.color = colorValue;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    randomizeVisuals();
})
