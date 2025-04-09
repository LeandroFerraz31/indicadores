const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const dbPath = process.env.RENDER ? '/data/employees.db' : path.join(__dirname, 'employees.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Erro ao abrir/criar banco:', err.message);
    } else {
        console.log('Conectado ao banco SQLite em', dbPath);
    }
});

// Criar tabela
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

// Adicionar colunas faltantes
const addColumnIfNotExists = (column, type) => {
    db.run(`ALTER TABLE employees ADD COLUMN ${column} ${type}`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error(`Erro ao adicionar coluna ${column}:`, err.message);
        } else {
            console.log(`Coluna ${column} adicionada ou já existente`);
        }
    });
};

addColumnIfNotExists('age', 'INTEGER');
addColumnIfNotExists('weight', 'REAL');
addColumnIfNotExists('height', 'REAL');
addColumnIfNotExists('fractured', 'TEXT');
addColumnIfNotExists('fracturedPart', 'TEXT');
addColumnIfNotExists('hospitalized', 'TEXT');
addColumnIfNotExists('hospitalizationReason', 'TEXT');
addColumnIfNotExists('lastCheckup', 'TEXT');
addColumnIfNotExists('familyHistory', 'TEXT');
addColumnIfNotExists('healthComplaint', 'TEXT');

// Função para carregar dados iniciais (opcional)
const seedDatabase = () => {
    const filePath = path.join(__dirname, 'employees.json');
    if (fs.existsSync(filePath)) {
        const initialData = require('./employees.json');
        const stmt = db.prepare(`INSERT OR IGNORE INTO employees (
            name, age, weight, height, sector, branch, conditions, medication, 
            pcd, smoker, drinker, imc, fractured, fracturedPart, hospitalized, 
            hospitalizationReason, lastCheckup, familyHistory, healthComplaint
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        initialData.forEach(employee => {
            stmt.run(
                employee.name, employee.age || 30, employee.weight || 70, employee.height || 1.7,
                employee.sector, employee.branch, JSON.stringify(employee.conditions || []),
                employee.medication || '', employee.pcd || 'Não', employee.smoker || 'Não',
                employee.drinker || 'Não', employee.imc || 25.0, employee.fractured || 'Não',
                employee.fracturedPart || '', employee.hospitalized || 'Não',
                employee.hospitalizationReason || '', employee.lastCheckup || '',
                JSON.stringify(employee.familyHistory || {}), employee.healthComplaint || '',
                (err) => { if (err) console.error('Erro ao inserir dado inicial:', err.message); }
            );
        });
        stmt.finalize(() => console.log('Dados iniciais carregados'));
    } else {
        console.log('Arquivo employees.json não encontrado; nenhum dado inicial carregado');
    }
};

// Verificar e carregar dados iniciais se a tabela estiver vazia
db.get('SELECT COUNT(*) as count FROM employees', (err, row) => {
    if (err) {
        console.error('Erro ao verificar contagem:', err.message);
    } else if (row.count === 0) {
        seedDatabase();
    }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// Rotas API
app.get('/api/employees', (req, res) => {
    console.log('GET /api/employees solicitado');
    db.all('SELECT * FROM employees', (err, rows) => {
        if (err) {
            console.error('Erro ao buscar:', err.message);
            return res.status(500).json({ error: 'Erro ao carregar funcionários' });
        }
        const employees = rows.map(row => ({
            ...row,
            conditions: JSON.parse(row.conditions || '[]'),
            familyHistory: JSON.parse(row.familyHistory || '{}')
        }));
        res.json(employees);
    });
});

app.post('/api/employees', (req, res) => {
    console.log('POST /api/employees recebido:', req.body);
    const {
        name, age, weight, height, sector, branch, conditions, medication, pcd,
        smoker, drinker, imc, fractured, fracturedPart, hospitalized,
        hospitalizationReason, lastCheckup, familyHistory, healthComplaint, id
    } = req.body;

    const stmt = id
        ? db.prepare(`UPDATE employees SET name=?, age=?, weight=?, height=?, sector=?, branch=?, conditions=?, medication=?, pcd=?, smoker=?, drinker=?, imc=?, fractured=?, fracturedPart=?, hospitalized=?, hospitalizationReason=?, lastCheckup=?, familyHistory=?, healthComplaint=? WHERE id=?`)
        : db.prepare(`INSERT INTO employees (name, age, weight, height, sector, branch, conditions, medication, pcd, smoker, drinker, imc, fractured, fracturedPart, hospitalized, hospitalizationReason, lastCheckup, familyHistory, healthComplaint) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const params = id
        ? [name, age, weight, height, sector, branch, JSON.stringify(conditions), medication, pcd, smoker, drinker, imc, fractured, fracturedPart, hospitalized, hospitalizationReason, lastCheckup, JSON.stringify(familyHistory), healthComplaint, id]
        : [name, age, weight, height, sector, branch, JSON.stringify(conditions), medication, pcd, smoker, drinker, imc, fractured, fracturedPart, hospitalized, hospitalizationReason, lastCheckup, JSON.stringify(familyHistory), healthComplaint];

    stmt.run(params, function(err) {
        if (err) {
            console.error('Erro ao salvar:', err.message);
            return res.status(500).json({ error: 'Erro ao salvar funcionário' });
        }
        res.status(id ? 200 : 201).json({ id: this.lastID || id });
    });
    stmt.finalize();
});

app.delete('/api/employees/:id', (req, res) => {
    console.log('DELETE /api/employees/:id solicitado, ID:', req.params.id);
    db.run('DELETE FROM employees WHERE id = ?', req.params.id, (err) => {
        if (err) {
            console.error('Erro ao excluir:', err.message);
            return res.status(500).json({ error: 'Erro ao excluir funcionário' });
        }
        res.status(204).send();
    });
});

// Servir frontend
app.get('/', (req, res) => {
    console.log('Servindo index.html');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware 404
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    db.close(() => {
        console.log('Banco de dados fechado');
        process.exit(0);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});