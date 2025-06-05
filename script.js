const API_URL = 'http://localhost:3000';
const EVENT_ID_KEY = 'event-id';

gsap.registerPlugin(SplitText)
gsap.registerPlugin(ScrambleTextPlugin)

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('event-name-input').addEventListener('input', showHintText);
    document.getElementById('event-name-form').addEventListener('submit', showEventPage);
    document.getElementById('reset-button').addEventListener('click', resetEventDetails);
    document.getElementById('default-title').addEventListener('mouseover', titleHover);
    randomizeVisuals();
    animate()
});

// Update the displayed time since the event
function updateTimeSinceEvent() {
    const eventDetails = JSON.parse(localStorage.getItem(EVENT_ID_KEY));
    const eventTimestamp = new Date(eventDetails.timestamp);
    const now = new Date();
    const timeDifference = now - eventTimestamp;

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    const time = document.getElementById('time');
    time.textContent = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

function addLetters(e, str) {
    for (const char of str) {
        const letter = document.createElement('span');
        letter.className = 'letter';
        letter.textContent = char == ' ' ? '\xa0' : char;
        e.appendChild(letter);
    }
}

// Set the event name and store it along with the current datetime in the SQLite database
function setEventName() {
    const eventName = document.getElementById('event-name-input').value.trim();

    if (eventName) {
        const now = new Date();

        const eventDetails = { id: 'test', name: eventName, timestamp: now.toISOString() };

        // cache event id
        localStorage.setItem(EVENT_ID_KEY, JSON.stringify(eventDetails));

        const title = document.getElementById('event-title');

        const timeSince = document.createElement('div');
        timeSince.id = 'time-since';
        timeSince.classList = 'title'
        addLetters(timeSince, 'days since');

        const eventTitle = document.createElement('div');
        eventTitle.id = 'event-name'
        eventTitle.className = 'title';
        addLetters(eventTitle, eventName);

        title.appendChild(timeSince);
        title.appendChild(eventTitle);
    }
    return false;
}

// Reset the event details
async function resetEventDetails() {
    const eventNameInput = document.getElementById('event-name-input').value.trim();
    const eventName = eventNameInput || 'Last Event';
    const now = new Date();
    const eventKey = localStorage.getItem(EVENT_ID_KEY);

    const eventDetails = { k: eventKey, name: eventName, timestamp: now.toISOString() };
    await fetch(`${API_URL}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventDetails),
    });
}

// Continuously update the time since the event every second
function startTimer() {
    setInterval(updateTimeSinceEvent, 1000);
}

// show hint text when there is input
function showHintText() {
    const eventName = document.getElementById('event-name-input').value.trim();
    const helpText = document.getElementById('help-text');
    const submitText = document.getElementById('submit-text');

    if (!eventName) {
        helpText.hidden = false;
        submitText.hidden = true;
        return;
    }

    submitText.hidden = false;
    helpText.hidden = true;
}

// show timer & reset button after event name is submitted
function showEventPage() {
    setEventName();
    updateTimeSinceEvent();
    const eventPage = document.getElementById('event-page');
    eventPage.hidden = false;
    const landingPage = document.getElementById('landing-page');
    landingPage.style.display = 'none';
    startTimer();
}

// visuals
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

function animate() {
    const defaultTitle = new SplitText('#default-title', { type: "chars", charsClass: "char", position: "relative" });
    // const ripple = gsap.timeline({ repeat: -1, delay: 4 })
    //     .to("#default-title .char", {
    //         ease: "back.inOut", duration: 1.5, stagger: { each: 0.15, repeat: 1, yoyo: true, repeat: -1 }, y: -6, x: 4, scale: 1.02
    //     });
    const blink = gsap.timeline({ repeat: -1, repeatDelay: 1 })
        .to("#submit-text", { 
            duration: 1.2, opacity: 0, ease: "power1.in", repeat: -1, yoyo: true
        })
    const scramble = gsap.timeline({ delay: 1 })
        .from('#default-title .char', {
            duration: 3,
            stagger: 0.05,
            scrambleText: { text: "?", chars: "01", speed: 0.2 },
            opacity: 0,
            scale: 0.5,
            rotationX: 180,
            transformOrigin: "0% 50% -50",
            ease: "back",
            stagger: 0.05,
        }, 0.1);
}

function titleHover(event) {
    const explode = gsap.to("#default-title .char", {
    })
    explode.play()
}

// const initialRotationOffset = -36.25;
// const letterPos = [0, 15.25, 30.25, 42.25, 54.25, 64.25, 73.5];
// const shapes = gsap.utils.toArray(".letter");
// const proxy = document.createElement("div");
// const progressWrap = gsap.utils.wrap(0, 1);
// const wrapRotation = gsap.utils.wrap(-90, 90);

// let screenRange = gsap.utils.mapRange(0, 2000, 500, 4500),
// dragDistancePerRotation = screenRange(window.innerWidth),
// startProgress;

// window.addEventListener("resize", () => dragDistancePerRotation = screenRange(window.innerWidth));

// const spin = gsap.fromTo(shapes, {
//     rotationY: (i) => letterPos[i] + initialRotationOffset
// }, {
//     rotationY: `-=${360}`,
//     modifiers: {
//     rotationY: (value) => wrapRotation(parseFloat(value)) + "deg"
//     },
//     duration: 10,
//     ease: "none",
//     repeat: -1
// });

// Draggable.create(proxy, {
//     trigger: smoooth,
//     type: "x",
//     inertia: true,
//     allowNativeTouchScrolling: true,
//     onPress() {
//     gsap.killTweensOf(spin);
//     spin.timeScale(0);
//     startProgress = spin.progress();
//     },
//     onDrag: updateRotation,
//     onThrowUpdate: updateRotation,
//     onRelease() {
//     if (!this.tween || !this.tween.isActive()) {
//         gsap.to(spin, { timeScale: 1, duration: 1 });
//     }
//     },
//     onThrowComplete() {
//     gsap.to(spin, { timeScale: 1, duration: 1 });
//     }
// });

// function updateRotation() {
//     const p = startProgress + (this.startX - this.x) / dragDistancePerRotation;
//     spin.progress(progressWrap(p));
// }