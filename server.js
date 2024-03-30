const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const Port = 3000;
const db = new sqlite3.Database("./tasks.db");

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

db.run('CREATE TABLE IF NOT EXISTS tasks (id  INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,description TEXT,completed BOOLEAN)');

app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        res.status(400).json({ error: "Title and description are required" });
        return;
    }
    db.run('INSERT INTO tasks (title,description,completed) VALUES (?,?,?)', [title, description, false], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(201).json({ id: this.lastID, title, description, completed: false });
    });
});

app.listen(Port, () => console.log(`Listening on port ${Port}`));
