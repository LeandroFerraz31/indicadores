const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;
const DATA_FILE = path.join(__dirname, 'employees.json');

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Serve arquivos estáticos como index.html, CSS, JS, etc.

async function loadData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao carregar employees.json:', error.message);
        return [];
    }
}

async function saveData(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Erro ao salvar employees.json:', error.message);
    }
}

app.get('/api/employees', async (req, res) => {
    const employees = await loadData();
    res.json(employees);
});

app.post('/api/employees', async (req, res) => {
    const employees = await loadData();
    const newEmployee = req.body;

    if (newEmployee.id) {
        const index = employees.findIndex(emp => emp.id === newEmployee.id);
        if (index !== -1) {
            employees[index] = newEmployee;
        } else {
            employees.push(newEmployee);
        }
    } else {
        newEmployee.id = employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
        employees.push(newEmployee);
    }

    await saveData(employees);
    res.json(newEmployee);
});

app.delete('/api/employees/:id', async (req, res) => {
    const employees = await loadData();
    const id = parseInt(req.params.id);
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    await saveData(updatedEmployees);
    res.json({ success: true });
});

// Rota principal para carregar o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});