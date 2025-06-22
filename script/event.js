import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';
const EVENT_ID_KEY = 'event';
const API_URL = 'http://localhost:3000'; // Adjust this if your API URL is different
var eventDetails = null;

// **** TIMER METHODS **** //

// Update the displayed time since the event
function updateTime() {
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

// Continuously update the time since the event every second
function startTimer() {
    setInterval(updateTime, 1000);
}

// Reset the event details
async function resetEventTime(event) {
    if (!eventDetails) {
        throw new Error("Event details are not set.");
    }

    eventDetails.timestamp = new Date().toISOString();
    eventDetails.high_score = Math.max(eventDetails.high_score, new Date() - new Date(eventDetails.timestamp));

    saveEvent(eventDetails);
    event.preventDefault();
}

function addLetters(e, str) {
    for (const char of str) {
        const letter = document.createElement('span');
        letter.className = 'letter';
        letter.textContent = char == ' ' ? '\xa0' : char;
        e.appendChild(letter);
    }
}

// *** EVENT METHODS *** //

function newEvent(name) {
    return { 
        id: 'last-spiral', // nanoid(10), 
        name: name, 
        timestamp: (new Date()).toISOString() ,
        high_score: 0
    };
}

function shareEvent(event) {
    navigator.clipboard.writeText(document.location.origin + document.location.pathname + "?id=" + eventDetails.id);
    saveEvent();
    event.preventDefault();
}

async function saveEvent() {
    if (!eventDetails) {
        throw new Error("Event details are not set.");
    }

    // save the event details to db
    const response = await fetch(`${API_URL}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventDetails),
    })
}

async function getEvent(eventId) {
    const response = await fetch(`${API_URL}/event/${eventId}`);
    if (!response.ok) {
        console.error(`Error fetching event details: ${response.statusText}`);
        return null;
    }
    var e = await response.json();
    e.id = eventId;
    return e;
}

document.addEventListener('DOMContentLoaded', async () => {

    let params = new URLSearchParams(document.location.search);
    let eventId = params.get('id');
    let name = params.get('name');

    if (eventId) {
        const e = await getEvent(eventId);
        if (!e) {
            location.href = "index.html";
        }
        eventDetails = e;
    } else if (name) {
        eventDetails = newEvent(name);
    } else {
        location.href = "index.html";
    }

    localStorage.setItem(EVENT_ID_KEY, JSON.stringify(eventDetails));
    
    const eventName = eventDetails.name;

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

    document.getElementById('share-button').addEventListener('click', shareEvent); 
    document.getElementById('reset-button').addEventListener('click', resetEventTime);

    updateTime()
    startTimer()
})