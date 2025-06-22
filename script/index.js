const API_URL = 'http://localhost:3000';

gsap.registerPlugin(SplitText)
gsap.registerPlugin(ScrambleTextPlugin)

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('event-name-input').addEventListener('input', showHintText);
    document.getElementById('event-name-form').addEventListener('submit', setEventName);
    document.getElementById('default-title').addEventListener('mouseover', titleHover);
    animate()
});

// Set the event name and store it along with the current datetime in the SQLite database
function setEventName() {
    const eventName = document.getElementById('event-name-input').value.trim();

    if (eventName) {
        location.href = "event.html?name=" + eventName;
    }
    return false;
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

function animate() {
    const defaultTitle = new SplitText('#default-title', { type: "chars", charsClass: "char", position: "relative" });
    const ripple = gsap.timeline({ repeat: -1, delay: 4 })
        .to("#default-title .char", {
            ease: "back.inOut", duration: 1.1, stagger: { each: 0.1, repeat: 1, yoyo: true, repeat: -1 }, y: -10, x: 5
        });
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