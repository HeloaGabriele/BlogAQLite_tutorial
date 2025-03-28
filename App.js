const express = require("express"); // Importa lib do Express
const sqlite3 = require("sqlite3"); // Importa lib do sqlite3
const bodyParser = require("body-parser");

// Porta TCP do servidor HTTP da aplicação
const port = 3000;

const app = express(); // Instancia para uso do Express

// Instancia para o uso do sqlite3, e usa o arquivo 'user.db'
const db = new sqlite3.Database("user.db"); 

// ESte método permite enviar comandos SQL em modo 'sequencial'
db.serialize( () => { 
    db.run(
        `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT,
        email TEXT, tel TEXT, cpf TEXT, rg TEXT)`

    );
});

// __dirname é a variável interna do nodejs que guarda o caminho absoluto do projeto, no SO
// console.log(__dirname + "/static");

// Aqui será acrescentado uma rota "/static", para a pasta __dirname + "/static"
// O app.use é usado para acrescentar rotas novas para o  Express gerenciar e pode usar
// Middleware para isto, que neste caso é o express.static, que gerencia rotas esáticas 
app.use("/static", express.static(__dirname + "/static"));

app.use(bodyParser.urlencoded({extended: true}));
// Configurar EJS como motor de visualização
app.set("view engine", "ejs");
// Cria conexão com o banco de dados

// const index = "<a href='/sobre'> Sobre</a><<a href='/login'> login</a><a href='/cadastro'> cadastro</a>";
// const sobre = 'Vc está na página "sobre"<br><a href="/">Voltar</a>';
// const login = 'Vc está na página "login"<br><a href="/">Voltar</a>';
// const cadastro = 'Vc está na página "cadastro"<br><a href="/">Voltar</a>';

/* Método express.get necessita de dois parametros
Na ARRW FUNCTION, o primeiro são os dados do servidor 
(REQUISITION -'req') o segundo, são os dados que serão
enviados ap cliente (RESULT -'res') */
app.get('/', (req, res) => {
    // res.send(index);
    res.render("index");
});

app.get("/sobre", (req,res) => {
    res.send(sobre);
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    res.send("Login ainda não implementado!");
});

app.get("/cadastro", (req, res) => {
    res.send(cadastro);
});

app.post("/cadastro", (req, res) => {
    req.body
    ? console.log(JSON.stringify(req.body)) 
    : console.log(`Body vazio: ${req.body}`);

    res.send(`Bem-vindo usuário: ${req.body.username}, seu email é ${req.body.email}`); 
});

// app.listen() deve ser o último comando da aplicação (app.js)
app.listen(port, () => {
    console.log(`Servidor sendo executado na porta ${port}!`);
    }); 