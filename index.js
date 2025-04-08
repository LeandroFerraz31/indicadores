const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// Conectar ao banco SQLite
const db = new sqlite3.Database('./employees.db', (err) => {
    if (err) {
        console.error('Erro ao abrir banco:', err.message);
    } else {
        console.log('Conectado ao banco SQLite');
    }
});

// Criar tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sector TEXT NOT NULL,
    branch TEXT NOT NULL,
    conditions TEXT NOT NULL,
    medication TEXT,
    pcd TEXT NOT NULL,
    smoker TEXT NOT NULL,
    drinker TEXT NOT NULL,
    imc REAL NOT NULL
)`);

app.get('/api/employees', (req, res) => {
    db.all('SELECT * FROM employees', (err, rows) => {
        if (err) {
            console.error('Erro ao carregar funcionários:', err.message);
            res.status(500).json({ error: 'Erro ao carregar funcionários' });
        } else {
            const employees = rows.map(row => ({
                ...row,
                conditions: JSON.parse(row.conditions || '[]')
            }));
            res.json(employees);
        }
    });
});

app.post('/api/employees', (req, res) => {
    console.log('Recebido no POST:', req.body);
    const { id, name, sector, branch, conditions, medication, pcd, smoker, drinker, imc } = req.body;

    if (!name || !sector || !branch || !pcd || !smoker || !drinker || !imc) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const employeeData = [
        name,
        sector,
        branch,
        JSON.stringify(conditions || []),
        medication || '',
        pcd,
        smoker,
        drinker,
        imc
    ];

    if (id) {
        db.run(
            `UPDATE employees SET name=?, sector=?, branch=?, conditions=?, medication=?, pcd=?, smoker=?, drinker=?, imc=? WHERE id=?`,
            [...employeeData, id],
            (err) => {
                if (err) {
                    console.error('Erro ao atualizar funcionário:', err.message);
                    res.status(500).json({ error: 'Erro ao atualizar funcionário' });
                } else {
                    res.json({ id, ...req.body });
                }
            }
        );
    } else {
        db.run(
            `INSERT INTO employees (name, sector, branch, conditions, medication, pcd, smoker, drinker, imc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            employeeData,
            function(err) {
                if (err) {
                    console.error('Erro ao inserir funcionário:', err.message);
                    res.status(500).json({ error: 'Erro ao inserir funcionário' });
                } else {
                    res.json({ id: this.lastID, ...req.body });
                }
            }
        );
    }
});

app.delete('/api/employees/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.run('DELETE FROM employees WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Erro ao excluir funcionário:', err.message);
            res.status(500).json({ error: 'Erro ao excluir funcionário' });
        } else {
            res.json({ success: true });
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});