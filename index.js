const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const db = new sqlite3.Database('./employees.db', (err) => {
    if (err) console.error('Erro ao abrir banco:', err);
    else console.log('Banco de dados conectado');
});

db.run(`CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, sector TEXT, branch TEXT, conditions TEXT,
    medication TEXT, pcd TEXT, smoker TEXT, drinker TEXT, imc REAL
)`);

async function loadData() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM employees', (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(row => ({
                ...row,
                conditions: row.conditions ? JSON.parse(row.conditions) : []
            })));
        });
    });
}

async function saveData(employee) {
    const { id, name, sector, branch, conditions, medication, pcd, smoker, drinker, imc } = employee;
    if (id) {
        await new Promise((resolve, reject) => {
            db.run(`UPDATE employees SET name=?, sector=?, branch=?, conditions=?, medication=?, pcd=?, smoker=?, drinker=?, imc=? WHERE id=?`,
                [name, sector, branch, JSON.stringify(conditions), medication, pcd, smoker, drinker, imc, id], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    } else {
        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO employees (name, sector, branch, conditions, medication, pcd, smoker, drinker, imc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, sector, branch, JSON.stringify(conditions), medication, pcd, smoker, drinker, imc], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    }
}

app.get('/api/employees', async (req, res) => {
    const employees = await loadData();
    res.json(employees);
});

app.post('/api/employees', async (req, res) => {
    const newEmployee = req.body;
    await saveData(newEmployee);
    res.json(newEmployee);
});

app.delete('/api/employees/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    await new Promise((resolve, reject) => {
        db.run('DELETE FROM employees WHERE id = ?', [id], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
    res.json({ success: true });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});