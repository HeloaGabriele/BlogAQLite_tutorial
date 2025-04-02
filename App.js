const express = require("express"); // Importa lib do Express
const sqlite3 = require("sqlite3"); // Importa lib do sqlite3
const bodyParser = require("body-parser"); // Importa o body-parser

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

// Middleware para processar as requisições do Body Parameters do cliente
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
    console.log("GET /index");
    res.render("index");
    // res.redirect("/cadastro")//Redireciona para a ROTA cadastro.
});

app.get("/sobre", (req,res) => {
    console.log("GET /sobre");
    res.render("sobre");
});

app.get("/login", (req, res) => {
    console.log("GET /login");
    res.render("login");
});

app.post("/login", (req, res) => {
    console.log("POST /login");
    res.send("Login ainda não implementado!");
});

app.get("/cadastro", (req, res) => {
    console.log("GET /cadastro");
    res.render("cadastro");
});

app.post("/cadastro", (req, res) => {
    console.log("POST /cadastro");
    req.body
      ? console.log(JSON.stringify(req.body))
      : console.log(`Body vazio: ${req.body}`);
  
    const { username, password, email, tel, cpf, rg } = req.body;
  
    //colocar aqui as validações e inclusão no banco de dados do cadastro do usuário
    // 1. Validar campos
  
    // 2. Verificar se ele ja existe no banco
    const query =
      "SELECT * FROM users WHERE email = ? OR cpf = ? OR rg = ? OR username = ?";
    db.get(query, [email, cpf, rg, username], (err, row) => {
      if (err) throw err;
  
      if (row) {
        // A variável 'row' irá retornar os dados do banco de dados
        // Executado atráves do SQL, variável query
        res.send("Usuário já cadastrado! Por favor refaça o cadastro");
      } else {
        // 3. Se o usuário não existe no banco cadastrar
        const insertQuery =
          "INSERT INTO users (username, password, email, tel, cpf, rg) VALUES (?,?,?,?,?,?)";
        db.run(
          insertQuery,
          [username, password, email, tel, cpf, rg],
          (err) => {
            // Inserir a lógica INSERT
            if (err) throw err;
            res.send("Usuário cadastrado com sucesso!");
          }
        );
      }
    });
    // res.send(`Bem-vindo usuário: ${req.body.username}, seu email é ${req.body.email}`); 
});

// app.listen() deve ser o último comando da aplicação (app.js)
app.listen(port, () => {
    console.log(`Servidor sendo executado na porta ${port}!`);
    }); 