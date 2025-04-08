// index.js (ajustado)
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

const dbPath = process.env.RENDER ? '/data/employees.db' : './employees.db';
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao abrir banco:', err.message);
    } else {
        console.log('Conectado ao banco SQLite em', dbPath);
    }
});

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Serve arquivos estáticos normalmente

// Criar tabela de forma segura
const createTableSQL = `CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    weight REAL NOT NULL,
    height REAL NOT NULL,
    sector TEXT NOT NULL,
    branch TEXT NOT NULL,
    conditions TEXT NOT NULL,
    medication TEXT,
    pcd TEXT NOT NULL,
    smoker TEXT NOT NULL,
    drinker TEXT NOT NULL,
    imc REAL NOT NULL,
    fractured TEXT NOT NULL,
    fracturedPart TEXT,
    hospitalized TEXT NOT NULL,
    hospitalizationReason TEXT,
    lastCheckup TEXT,
    familyHistory TEXT,
    healthComplaint TEXT
)`;

db.run(createTableSQL, (err) => {
    if (err) console.error('Erro ao criar tabela:', err.message);
    else console.log('Tabela employees criada ou já existente');
});

// Rota para obter todos os funcionários
app.get('/api/employees', (req, res) => {
    db.all('SELECT * FROM employees', (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro ao carregar funcionários' });

        const employees = rows.map(row => {
            let conditions = [];
            let familyHistory = {};
            try {
                conditions = JSON.parse(row.conditions || '[]');
                familyHistory = JSON.parse(row.familyHistory || '{}');
            } catch (e) {
                console.warn('Erro ao fazer parse dos campos JSON:', e.message);
            }
            return { ...row, conditions, familyHistory };
        });

        res.json(employees);
    });
});

// Rota para adicionar ou atualizar funcionários
app.post('/api/employees', (req, res) => {
    const requiredFields = ['name', 'age', 'weight', 'height', 'sector', 'branch', 'pcd', 'smoker', 'drinker', 'imc', 'fractured', 'hospitalized'];
    for (const field of requiredFields) {
        if (!req.body[field]) return res.status(400).json({ error: `Campo obrigatório faltando: ${field}` });
    }

    const {
        id, name, age, weight, height, sector, branch, conditions, medication, pcd, smoker, drinker, imc,
        fractured, fracturedPart, hospitalized, hospitalizationReason, lastCheckup, familyHistory, healthComplaint
    } = req.body;

    const employeeData = [
        name, age, weight, height, sector, branch, JSON.stringify(conditions || []), medication || '',
        pcd, smoker, drinker, imc, fractured, fracturedPart || '', hospitalized, hospitalizationReason || '',
        lastCheckup || '', JSON.stringify(familyHistory || {}), healthComplaint || ''
    ];

    if (id) {
        db.run(`UPDATE employees SET name=?, age=?, weight=?, height=?, sector=?, branch=?, conditions=?, medication=?, pcd=?, smoker=?, drinker=?, imc=?, fractured=?, fracturedPart=?, hospitalized=?, hospitalizationReason=?, lastCheckup=?, familyHistory=?, healthComplaint=? WHERE id=?`,
            [...employeeData, id],
            (err) => {
                if (err) return res.status(500).json({ error: 'Erro ao atualizar funcionário' });
                res.json({ id, ...req.body });
            });
    } else {
        db.run(`INSERT INTO employees (name, age, weight, height, sector, branch, conditions, medication, pcd, smoker, drinker, imc, fractured, fracturedPart, hospitalized, hospitalizationReason, lastCheckup, familyHistory, healthComplaint) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            employeeData,
            function(err) {
                if (err) return res.status(500).json({ error: 'Erro ao inserir funcionário' });
                res.json({ id: this.lastID, ...req.body });
            });
    }
});

// Rota para deletar
app.delete('/api/employees/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.run('DELETE FROM employees WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao excluir funcionário' });
        res.json({ success: true });
    });
});

// Servir frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware 404
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
