const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./events.db');

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:3000', 'https://ela-ine.github.io'],
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

// Initialize database
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            high_score INTEGER DEFAULT 0
        )
    `);
});

app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

// Get event details by id
app.get('/event/:id', (req, res) => {
    console.log(`Fetching event details for id: ${req.params.id}`);
    const id = req.params.id;
    db.get('SELECT name, timestamp, high_score FROM events WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Database error: ' + err.message, details: err.cause });
        } else if (row) {
            console.log(`Event found: ${row.name} at ${row.timestamp} with high score ${row.high_score}`);
            res.json({ name: row.name, timestamp: row.timestamp, high_score: row.high_score, id: id });
        } else {
            res.status(404).json({ error: `No event found for id: ${id}` });
        }
    });
});

// Save or update event details
app.post('/event', (req, res) => {
    console.log('Received event data:', req.body);
    const { id, name, timestamp, high_score } = req.body;
    db.run(
        'INSERT INTO events (id, name, timestamp, high_score) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET timestamp = ?, high_score = ?',
        [id, name, timestamp, high_score, timestamp, high_score],
        function (err) {
            if (err) {
                console.error('Database error:', err.message);
                res.status(500).json({ error: err.message });
            } else {
                console.log(`Event ${id} saved/updated successfully.`);
                res.json({ data: { id, name, timestamp, high_score }, message: 'Event saved/updated successfully.' });
            }
        }
    );
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});