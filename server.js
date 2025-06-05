const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./events.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    `);
});

// Get event details by id
app.get('/event/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT name, timestamp FROM events WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Database error: ' + err.message });
        } else if (row) {
            res.json({ name: row.name, timestamp: row.timestamp });
        } else {
            res.status(404).json({ error: `No event found for id: ${id}` });
        }
    });
});

// Save or update event details
app.post('/event', (req, res) => {
    const { id, name, timestamp } = req.body;
    db.run(
        'INSERT INTO events (id, name, timestamp) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = ?, timestamp = ?',
        [id, name, timestamp, name, timestamp],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ success: true });
            }
        }
    );
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});