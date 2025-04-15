Dashboard de Saúde
Uma aplicação web para gerenciamento e visualização de dados de saúde de funcionários, construída com Node.js, Express, SQLite e um front-end responsivo.
Propósito 🎯
Monitorar e analisar métricas de saúde dos funcionários para apoiar programas de bem-estar no trabalho, fornecendo insights acionáveis por meio de visualização e gerenciamento de dados.
Estrutura do Projeto 📂

Diretório Raiz:
index.js: Servidor backend (Node.js/Express) gerenciando rotas API, operações com SQLite e inicialização de dados.
render.yaml: Configuração para deploy no Render, especificando ambiente Node.js e armazenamento persistente.


Diretório /public:
index.html: Estrutura HTML principal para a interface do dashboard.
styles.css: Estilização CSS responsiva para componentes da UI.
script.js: JavaScript do front-end para busca de dados, renderização de tabelas/gráficos e manipulação de formulários.



Funcionalidades ✨

Backend:
API RESTful para operações CRUD em dados de saúde.
Banco SQLite armazenando métricas como IMC, condições e hábitos.
Inicialização de dados a partir de employees.json.
Middleware CORS e JSON para comunicação segura da API.


Frontend:
Dashboard responsivo com abas para visão geral e dados detalhados.
Gráficos interativos (condições de saúde, IMC, hábitos) usando JavaScript puro.
Tabela de dados filtrável com funções de edição/exclusão.
Formulários modais para gerenciamento de registros.
Exportação para Excel usando SheetJS.


Deploy:
Configurado para Render com armazenamento persistente em /data para SQLite.



Tecnologias 🛠️

Backend: Node.js, Express, SQLite3
Frontend: HTML5, CSS3, JavaScript puro, SheetJS
Deploy: Render
Ambiente: Node.js 18

Configuração ⚙️

Clone o repositório: git clone <url-do-repositório>.
Instale dependências: npm install.
Inicie o servidor: node index.js.
Acesse em http://localhost:3000.

Uso 📈

Adicione/edite dados de funcionários via formulários modais.
Filtre por funcionário ou unidade.
Visualize métricas em gráficos e cartões de resumo.
Exporte relatórios como arquivos Excel.

Melhorias Futuras 🚀

Adicionar autenticação para acesso seguro.
Integrar bibliotecas de gráficos avançadas (ex.: Chart.js).
Melhorar opções de filtragem e busca.

Tags 🏷️
#DashboardSaude #BemEstarFuncionarios #NodeJS #Express #SQLite #JavaScript #DesignResponsivo #VisualizacaoDados #APIRESTful #DeployRender
