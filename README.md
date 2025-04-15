# 🩺 Dashboard de Saúde

Uma aplicação web para gerenciamento e visualização de dados de saúde de funcionários, construída com **Node.js**, **Express**, **SQLite** e um front-end responsivo.

---

## 🎯 Propósito

Monitorar e analisar métricas de saúde dos funcionários para apoiar programas de bem-estar no trabalho, fornecendo insights acionáveis por meio de visualização e gerenciamento de dados.

---

## 📁 Estrutura do Projeto

### 📦 Diretório Raiz

- `index.js`: Servidor backend com Node.js/Express, gerenciamento de rotas, integração com SQLite e inicialização de dados.
- `render.yaml`: Arquivo de configuração para deploy na plataforma Render, com ambiente Node.js e volume persistente para o banco de dados.

### 🌐 Diretório `/public`

- `index.html`: Estrutura HTML principal do dashboard.
- `styles.css`: Estilos CSS responsivos para uma UI agradável.
- `script.js`: Lógica do front-end com JavaScript para:
  - Requisições à API
  - Exibição de gráficos e tabelas
  - Manipulação de formulários

---

## ✨ Funcionalidades

### 🔧 Backend

- ✅ API RESTful com rotas CRUD para dados de saúde.
- 🧠 Banco SQLite com informações como IMC, condições e hábitos.
- 📂 Inicialização automática de dados com `employees.json`.
- 🔐 Middleware CORS e JSON integrados para comunicação segura.

### 💻 Frontend

- 📊 Dashboard responsivo com abas para visão geral e detalhada.
- 📈 Gráficos interativos (IMC, condições, hábitos) com JavaScript puro.
- 🗂️ Tabela filtrável com opções de edição e exclusão.
- 📝 Formulários modais para gerenciamento de registros.
- 📤 Exportação de dados para Excel com uso de **SheetJS**.

---

## 🚀 Deploy

A aplicação está preparada para deploy na plataforma **Render**, com:

- Ambiente configurado para Node.js 18.
- Volume persistente em `/data` para o banco SQLite.

---

## 🛠️ Tecnologias Utilizadas

| Camada       | Tecnologias                          |
|--------------|--------------------------------------|
| Backend      | Node.js, Express, SQLite3            |
| Frontend     | HTML5, CSS3, JavaScript Puro, SheetJS|
| Deploy       | Render                               |
| Ambiente     | Node.js 18                           |

---

## ⚙️ Como Executar Localmente

```bash
# 1. Clone o repositório:
git clone <url-do-repositório>

# 2. Navegue até a pasta do projeto:
cd dashboard-saude

# 3. Instale as dependências:
npm install

# 4. Inicie o servidor:
node index.js
```
---

##📈 Como Usar
-🧑‍💼 Adicione ou edite dados de funcionários via formulários modais.

-🔍 Filtre registros por funcionário ou unidade.

📊 Visualize métricas em gráficos e cartões de resumo.

📥 Exporte relatórios como arquivos .xlsx (Excel).

##🚧 Melhorias Futuras
🔐 Implementar autenticação para acesso seguro.

📊 Integrar bibliotecas gráficas mais robustas como Chart.js.

🔎 Ampliar filtros e funcionalidades de busca avançada.

##🏷️ Tags
#DashboardSaude #BemEstarFuncionarios #NodeJS #Express #SQLite
#JavaScript #DesignResponsivo #VisualizacaoDados #APIRESTful #DeployRender

##🧠 Autor
Leandro Ferraz